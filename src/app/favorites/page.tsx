"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { ChevronLeft, Star } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento do LocalStorage no client-side
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem("pokedex_favorites");
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, []);

  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <div className="h-full flex flex-col p-4 justify-center items-center text-center">
          <Star size={48} className="mb-4 text-yellow-500" fill="currentColor" />
          <h2 className="font-pixel text-xl mb-4 text-yellow-500">FAVORITOS</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            Lista de Pokémon marcados com a estrela. Os dados são salvos localmente na memória do dispositivo (localStorage).
          </p>
          <div className="bg-[#111] p-4 rounded-lg border-2 border-gray-700 w-full">
             <div className="flex justify-between items-center">
              <span className="font-pixel text-[10px] text-gray-400">TOTAL SALVO:</span>
              <span className="font-pixel text-lg text-white">{favorites.length}</span>
            </div>
          </div>
        </div>
      }
    >
      <PokedexScreen isScanning={isLoading}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--color-pokedex-screen-bg)] z-30 py-2 border-b-2 border-black/10">
          <Link href="/">
            <button className="flex items-center gap-1 font-pixel text-[10px] hover:opacity-70 transition-opacity">
              <ChevronLeft size={16} /> VOLTAR
            </button>
          </Link>
          <h1 className="font-pixel text-sm">MEUS FAVORITOS</h1>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center text-[10px] font-pixel animate-pulse">
            LENDO MEMÓRIA...
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <Star size={48} className="text-black/30 mb-4" />
            <p className="font-pixel text-[10px]">NENHUM POKÉMON<br/>SALVO</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {favorites.map((pokemon, index) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
            ))}
          </div>
        )}
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
