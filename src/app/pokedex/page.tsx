"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { PokemonCardViewModel } from "@/types/view-models";
import { PokemonService } from "@/lib/pokemon/pokemon.service";
import { Search, ChevronLeft } from "lucide-react";
import { PokeApiClient } from "@/lib/pokeapi/client";
import { ENDPOINTS } from "@/lib/pokeapi/endpoints";
import { PokemonMapper } from "@/lib/pokemon/pokemon.mapper";

export default function PokedexPage() {
  const [pokemons, setPokemons] = useState<PokemonCardViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const LIMIT = 20;

  const loadPokemons = useCallback(async (currentOffset: number, append = false) => {
    setIsLoading(true);
    try {
      const newPokemons = await PokemonService.getPokemonList(LIMIT, currentOffset);
      if (append) {
        setPokemons(prev => [...prev, ...newPokemons]);
      } else {
        setPokemons(newPokemons);
      }
    } catch (error) {
      console.error("Erro ao carregar pokémons", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemons(0);
  }, [loadPokemons]);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    loadPokemons(newOffset, true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setOffset(0);
      loadPokemons(0);
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    try {
      const pokemonNameOrId = searchQuery.toLowerCase().trim();
      const pokemon = await PokeApiClient.fetch<any>(ENDPOINTS.pokemon(pokemonNameOrId));
      const card = PokemonMapper.toCardViewModel(pokemon);
      setPokemons([card]);
    } catch (error) {
      console.error("Pokemon não encontrado", error);
      setPokemons([]); // Não encontrado
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <div className="h-full flex flex-col p-2">
          <h2 className="font-pixel text-xl mb-6 border-b-2 border-gray-700 pb-2">BUSCA NACIONAL</h2>
          
          <form onSubmit={handleSearch} className="mb-8">
            <label className="font-pixel text-[10px] text-gray-400 block mb-2">NOME OU ID</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: pikachu, 25"
                className="flex-1 bg-black border-2 border-gray-600 rounded p-3 font-pixel text-xs text-white focus:outline-none focus:border-[var(--color-pokedex-blue-glow)] transition-colors"
              />
              <button 
                type="submit"
                className="bg-[var(--color-pokedex-blue)] hover:bg-blue-400 p-3 rounded border-2 border-blue-800 transition-colors flex items-center justify-center"
              >
                <Search size={20} className="text-white" />
              </button>
            </div>
            {isSearching && (
              <button 
                type="button" 
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                  setOffset(0);
                  loadPokemons(0);
                }}
                className="mt-4 text-[10px] font-pixel text-gray-400 hover:text-white underline w-full text-center"
              >
                LIMPAR BUSCA
              </button>
            )}
          </form>

          <div className="flex-1 border-t-2 border-gray-700 pt-6">
            <p className="font-pixel text-[10px] text-gray-400 mb-4">ESTATÍSTICAS DA TELA</p>
            <div className="bg-[#111] border border-gray-700 rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="font-pixel text-[10px] text-gray-500">EXIBINDO:</span>
                <span className="font-pixel text-[10px] text-[var(--color-pokedex-blue-glow)]">{pokemons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-pixel text-[10px] text-gray-500">MODO:</span>
                <span className="font-pixel text-[10px] text-[var(--color-pokedex-blue-glow)]">{isSearching ? 'BUSCA' : 'LISTAGEM'}</span>
              </div>
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
          <h1 className="font-pixel text-sm">LISTA NACIONAL</h1>
        </div>

        {pokemons.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="w-16 h-16 border-4 border-dashed border-black/30 rounded-full mb-4 flex items-center justify-center">
              <span className="font-pixel text-[10px]">?</span>
            </div>
            <p className="font-pixel text-[10px]">NENHUM POKÉMON<br/>ENCONTRADO</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {pokemons.map((pokemon, index) => (
              <PokemonCard key={`${pokemon.id}-${index}`} pokemon={pokemon} index={index} />
            ))}
          </div>
        )}

        {isLoading && pokemons.length > 0 && (
          <div className="py-4 flex justify-center text-[10px] font-pixel animate-pulse">
            CARREGANDO...
          </div>
        )}

        {!isSearching && pokemons.length > 0 && !isLoading && (
          <div className="flex justify-center mt-6 pb-6">
            <button 
              onClick={handleLoadMore}
              className="bg-black/10 hover:bg-black/20 border-2 border-black/30 px-6 py-3 rounded font-pixel text-[10px] font-bold transition-colors"
            >
              CARREGAR MAIS
            </button>
          </div>
        )}
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
