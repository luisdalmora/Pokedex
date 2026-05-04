"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Loader, ErrorState, EmptyState } from "@/components/ui/States";
import { PokeAPIClient } from "@/lib/pokeapi/client";
import { PokemonSearchEngine, SearchFilters } from "@/lib/pokeapi/search-engine";
import { PokemonCardViewModel } from "@/types/view-models";

import kantoLore from "@/data/kanto_lore.json";
import gymLeaders from "@/data/gym_leaders.json";

export default function KantoScannerPage() {
  const [pokemonList, setPokemonList] = useState<PokemonCardViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 30;

  const loadKantoDex = useCallback(async (currentOffset: number, append = false, currentFilters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Force Kanto filter (Generation 1)
      const kantoFilters = { ...currentFilters, generation: "1", special: "all" };
      const searchRes = await PokemonSearchEngine.search(kantoFilters, LIMIT, currentOffset);
      
      setHasMore(searchRes.hasMore);
      setTotalCount(searchRes.totalCount);
      
      const detailedPromises = searchRes.results.map(async (p) => {
        try {
          const detail = await PokeAPIClient.getPokemon(p.name);
          const species = await PokeAPIClient.getPokemonSpecies(detail.id);
          
          return {
            id: detail.id,
            name: detail.name,
            types: detail.types.map((t) => t.type.name),
            spriteUrl: detail.sprites.versions?.["generation-i"]?.["red-blue"]?.front_default || 
                       detail.sprites.versions?.["generation-i"]?.yellow?.front_default || 
                       detail.sprites.front_default,
            generation: 1,
            isLegendary: species.is_legendary,
            isMythical: species.is_mythical
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      });
      
      const detailedBatch = (await Promise.all(detailedPromises)).filter(Boolean) as PokemonCardViewModel[];
      setPokemonList(prev => append ? [...prev, ...detailedBatch] : detailedBatch);
    } catch (err) {
      setError("Falha ao carregar banco de dados de Kanto.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadKantoDex(0, false, {
        query: search,
        type: typeFilter,
        generation: "1",
        special: "all"
      });
    }, 400);
    return () => clearTimeout(debounce);
  }, [search, typeFilter, loadKantoDex]);

  const loadMore = () => {
    if (!hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadKantoDex(nextOffset, true, {
      query: search,
      type: typeFilter,
      generation: "1",
      special: "all"
    });
  };

  const RightPanel = (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-[#991b1b]/20 border-2 border-red-500/50 p-3 rounded">
        <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-3">Busca Kanto</h3>
        <input 
          type="text" 
          placeholder="Nome ou ID" 
          value={search}
          onChange={(e) => {
            setOffset(0);
            setSearch(e.target.value);
          }}
          className="w-full bg-black border border-red-900 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500 mb-2"
        />
        <select 
          className="w-full bg-black border border-red-900 rounded px-2 py-1.5 text-xs text-white"
          value={typeFilter}
          onChange={(e) => {
            setOffset(0);
            setTypeFilter(e.target.value);
          }}
        >
          <option value="all">Todos os Tipos</option>
          <option value="normal">Normal</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="ice">Ice</option>
          <option value="fighting">Fighting</option>
          <option value="poison">Poison</option>
          <option value="ground">Ground</option>
          <option value="flying">Flying</option>
          <option value="psychic">Psychic</option>
          <option value="bug">Bug</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="dragon">Dragon</option>
        </select>
        
        <div className="mt-4 p-2 bg-black/50 border border-red-900 rounded">
            <div className="text-red-500 text-xl font-bold font-mono tracking-widest text-center">
                {totalCount.toString().padStart(3, '0')}
            </div>
            <div className="text-[10px] text-red-900/80 text-center uppercase mt-1">
                Registros Compatíveis
            </div>
        </div>
      </div>

      <div className="bg-[#0f172a] border-2 border-[#1f2937] p-3 rounded flex-1 overflow-y-auto os-scroll">
        <h3 className="text-white font-bold text-[10px] uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
          Kanto Lore
        </h3>
        <p className="text-[10px] text-slate-400 font-mono mb-4">
          {kantoLore.description}
        </p>

        <h3 className="text-white font-bold text-[10px] uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
          Líderes de Ginásio
        </h3>
        <div className="flex flex-col gap-2">
          {gymLeaders.filter(g => g.region === "Kanto").map((leader) => (
            <div key={leader.order} className="flex flex-col bg-black/40 p-1.5 rounded border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">{leader.name}</span>
                <span className="text-[9px] px-1 rounded text-white" style={{ backgroundColor: `var(--color-type-${leader.type})` }}>
                  {leader.type}
                </span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 mt-1 uppercase">
                <span>{leader.city}</span>
                <span>{leader.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PokedexOSLayout 
      moduleName="KANTO SCANNER" 
      status={loading ? "SCANNING" : "ONLINE"}
      isScanning={loading}
      itemsCount={totalCount}
      rightPanel={RightPanel}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto os-scroll pr-2 pb-4">
          {error ? (
            <ErrorState message={error} />
          ) : pokemonList.length === 0 && !loading ? (
             <EmptyState message="Nenhum Pokémon encontrado." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}
          
          {loading && pokemonList.length > 0 && (
             <div className="py-4"><Loader text="MOUNTING KANTO DATABASE..." /></div>
          )}
          
          {!loading && !error && hasMore && pokemonList.length > 0 && (
            <button 
              onClick={loadMore}
              className="mt-6 w-full py-2 border-2 border-red-900/50 text-red-500/70 font-bold text-xs uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-colors rounded"
            >
              CARREGAR MAIS REGISTROS
            </button>
          )}
        </div>
      </div>
    </PokedexOSLayout>
  );
}
