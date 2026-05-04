"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Loader, ErrorState, EmptyState } from "@/components/ui/States";
import { PokeAPIClient } from "@/lib/pokeapi/client";
import { PokemonSearchEngine, SearchFilters } from "@/lib/pokeapi/search-engine";
import { PokemonCardViewModel } from "@/types/view-models";

export default function PokedexPage() {
  const [pokemonList, setPokemonList] = useState<PokemonCardViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [genFilter, setGenFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [specialFilter, setSpecialFilter] = useState("all");

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 30;

  const loadBatch = useCallback(async (currentOffset: number, append = false, currentFilters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchRes = await PokemonSearchEngine.search(currentFilters, LIMIT, currentOffset);
      setHasMore(searchRes.hasMore);
      setTotalCount(searchRes.totalCount);
      
      // Fetch details only for the current paginated slice
      const detailedPromises = searchRes.results.map(async (p) => {
        try {
          const detail = await PokeAPIClient.getPokemon(p.name);
          const species = await PokeAPIClient.getPokemonSpecies(detail.id); // Get by ID to avoid form name issues
          return {
            id: detail.id,
            name: detail.name,
            types: detail.types.map((t) => t.type.name),
            spriteUrl: detail.sprites.front_default,
            generation: species.generation ? parseInt(species.generation.name.split("-")[1] || "0", 10) : null,
            isLegendary: species.is_legendary,
            isMythical: species.is_mythical
          };
        } catch (e) {
          console.warn(`Failed to fetch details for ${p.name}`);
          return null;
        }
      });

      const detailedResults = (await Promise.all(detailedPromises)).filter(Boolean) as PokemonCardViewModel[];

      setPokemonList(prev => append ? [...prev, ...detailedResults] : detailedResults);
    } catch (err) {
      setError("Falha ao carregar banco de dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search when filters or search change
  useEffect(() => {
    const debounce = setTimeout(() => {
        loadBatch(0, false, {
            query: search,
            type: typeFilter,
            generation: genFilter,
            special: specialFilter
        });
    }, 400); // 400ms debounce for typing
    return () => clearTimeout(debounce);
  }, [search, genFilter, typeFilter, specialFilter, loadBatch]);

  const loadMore = () => {
    if (!hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadBatch(nextOffset, true, {
        query: search,
        type: typeFilter,
        generation: genFilter,
        special: specialFilter
    });
  };

  const RightPanel = (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-[#0f172a] border-2 border-[#1f2937] p-3 rounded">
        <h3 className="text-[#38bdf8] font-bold text-xs uppercase tracking-widest mb-3">Busca</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nome ou ID" 
            value={search}
            onChange={(e) => {
              setOffset(0);
              setSearch(e.target.value);
            }}
            className="flex-1 bg-black border border-[#374151] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
          />
        </div>
      </div>

      <div className="bg-[#0f172a] border-2 border-[#1f2937] p-3 rounded flex-1">
        <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Filtros Globais</h3>
        
        <select 
          className="w-full bg-black border border-[#374151] rounded px-2 py-1.5 text-xs text-white mb-2"
          value={genFilter}
          onChange={(e) => {
            setOffset(0);
            setGenFilter(e.target.value);
          }}
        >
          <option value="all">Todas as Gerações</option>
          <option value="1">Geração 1</option>
          <option value="2">Geração 2</option>
          <option value="3">Geração 3</option>
          <option value="4">Geração 4</option>
          <option value="5">Geração 5</option>
          <option value="6">Geração 6</option>
          <option value="7">Geração 7</option>
          <option value="8">Geração 8</option>
          <option value="9">Geração 9</option>
        </select>
        
        <select 
          className="w-full bg-black border border-[#374151] rounded px-2 py-1.5 text-xs text-white mb-2"
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
          <option value="dark">Dark</option>
          <option value="steel">Steel</option>
          <option value="fairy">Fairy</option>
        </select>

        <select 
          className="w-full bg-black border border-[#374151] rounded px-2 py-1.5 text-xs text-white mb-2"
          value={specialFilter}
          onChange={(e) => {
            setOffset(0);
            setSpecialFilter(e.target.value);
          }}
        >
          <option value="all">Status Comum</option>
          <option value="legendary">Lendários</option>
          <option value="mythical">Míticos</option>
          <option value="baby">Bebês</option>
        </select>
        
        <div className="mt-4 p-2 bg-black/50 border border-slate-800 rounded">
            <div className="text-[#38bdf8] text-xl font-bold font-mono tracking-widest text-center">
                {totalCount.toString().padStart(4, '0')}
            </div>
            <div className="text-[10px] text-slate-400 text-center uppercase mt-1">
                Registros Encontrados
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <PokedexOSLayout 
      moduleName="NATIONAL DEX" 
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
             <div className="py-4"><Loader text="LOADING MORE..." /></div>
          )}
          
          {!loading && !error && hasMore && pokemonList.length > 0 && (
            <button 
              onClick={loadMore}
              className="mt-6 w-full py-2 border-2 border-[#1f2937] text-[#94a3b8] font-bold text-xs uppercase tracking-widest hover:border-[#38bdf8] hover:text-[#38bdf8] transition-colors rounded"
            >
              CARREGAR MAIS REGISTROS
            </button>
          )}
        </div>
      </div>
    </PokedexOSLayout>
  );
}
