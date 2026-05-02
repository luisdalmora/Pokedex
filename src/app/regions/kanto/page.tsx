"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { ChevronLeft } from "lucide-react";
import gymLeaders from "@/data/gym_leaders.json";
import kantoLore from "@/data/kanto_lore.json";
import { PokemonService } from "@/lib/pokemon/pokemon.service";
import { PokeApiClient } from "@/lib/pokeapi/client";
import { ENDPOINTS } from "@/lib/pokeapi/endpoints";
import { PokemonMapper } from "@/lib/pokemon/pokemon.mapper";

export default function KantoPage() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadKantoPokedex = useCallback(async () => {
    setIsLoading(true);
    try {
      // 151 Pokémons originais
      const listResponse = await PokeApiClient.fetch<any>(ENDPOINTS.pokemonList(151, 0));
      const detailedPokemons = await Promise.all(
        listResponse.results.map(async (p: any) => {
          const id = p.url.split("/").filter(Boolean).pop()!;
          const pokemon = await PokeApiClient.fetch<any>(ENDPOINTS.pokemon(id));
          
          // Mapeando com sprite gen 1 forçado
          const card = PokemonMapper.toCardViewModel(pokemon);
          // Substituir sprite normal pelo de Red/Blue (ou fallback se yellow)
          const gen1Sprite = pokemon.sprites.versions?.["generation-i"]?.["red-blue"]?.front_default 
                          || pokemon.sprites.versions?.["generation-i"]?.yellow?.front_default
                          || card.spriteUrl;
                          
          return { ...card, spriteUrl: gen1Sprite, generation: 1 };
        })
      );
      setPokemons(detailedPokemons);
    } catch (error) {
      console.error("Erro ao carregar Kanto dex", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKantoPokedex();
  }, [loadKantoPokedex]);

  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <div className="h-full flex flex-col p-2 pokedex-scroll overflow-y-auto pr-2">
          <h2 className="font-pixel text-xl mb-4 border-b-2 border-gray-700 pb-2 text-red-500">KANTO DOSSIER</h2>
          
          <div className="bg-[#111] border border-gray-700 rounded p-4 mb-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              {kantoLore.description}
            </p>
          </div>

          <h3 className="font-pixel text-xs text-gray-400 mb-4 border-b border-gray-700 pb-2">LÍDERES DE GINÁSIO</h3>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {gymLeaders.map((leader) => (
              <div key={leader.id} className="bg-[#222] border border-gray-600 rounded p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-pixel text-[10px] text-white uppercase">{leader.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{leader.city}</p>
                </div>
                <div className="text-right">
                  <span className="font-pixel text-[8px] bg-gray-800 text-gray-300 px-2 py-1 rounded block mb-1">
                    {leader.badge}
                  </span>
                  <span className="font-pixel text-[8px] text-[var(--color-pokedex-blue-glow)] block">
                    TIPO: {leader.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-pixel text-xs text-gray-400 mb-4 border-b border-gray-700 pb-2">LOCAIS NOTÁVEIS</h3>
          <div className="space-y-4">
            {kantoLore.notableLocations.map((loc, idx) => (
              <div key={idx} className="border-l-2 border-red-500 pl-3">
                <h4 className="font-pixel text-[10px] text-gray-200">{loc.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{loc.description}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <PokedexScreen isScanning={isLoading}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--color-pokedex-screen-bg)] z-30 py-2 border-b-2 border-black/10">
          <Link href="/regions">
            <button className="flex items-center gap-1 font-pixel text-[10px] hover:opacity-70 transition-opacity">
              <ChevronLeft size={16} /> REGIÕES
            </button>
          </Link>
          <h1 className="font-pixel text-sm">POKÉDEX KANTO</h1>
        </div>

        {isLoading ? (
           <div className="py-20 flex flex-col items-center justify-center text-[10px] font-pixel animate-pulse">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            CARREGANDO DADOS DA GERAÇÃO I...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {pokemons.map((pokemon, index) => (
              <div key={pokemon.id} className="rendering-pixelated">
                <PokemonCard pokemon={pokemon} index={index} />
              </div>
            ))}
          </div>
        )}
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
