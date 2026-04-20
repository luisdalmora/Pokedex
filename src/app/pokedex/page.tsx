"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPokemonList, getPokemon } from "@/services/pokeapi";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { PokemonSummary } from "@/types/pokemon";
import { PokemonCard, PokemonSkeleton } from "@/components/pokemon/PokemonCard";
import { Search, Dices, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";

const ITEMS_PER_PAGE = 50;

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPokemon = useCallback(async (currentOffset: number, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const results = await getPokemonList(ITEMS_PER_PAGE, currentOffset);
      
      if (results.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      const detailed = await Promise.all(
        results.map(async (p) => {
          try {
            const detail = await getPokemon(p.name);
            if (!detail) return null;
            return {
              id: detail.id,
              name: detail.name,
              types: detail.types.map(t => t.type.name),
              image: getBestAvailableSprite(detail.id),
            };
          } catch (e) {
            return null;
          }
        })
      );

      const validDetails = detailed.filter((p): p is PokemonSummary => p !== null);
      
      setPokemon(prev => isInitial ? validDetails : [...prev, ...validDetails]);
    } catch (error) {
      console.error("Failed to fetch pokemon:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPokemon(0, true);
  }, [fetchPokemon]);

  // Infinite scroll observer
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchTerm) {
        setOffset(prevOffset => {
          const nextOffset = prevOffset + ITEMS_PER_PAGE;
          fetchPokemon(nextOffset);
          return nextOffset;
        });
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, searchTerm, fetchPokemon]);

  const handleRandom = () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    router.push(`/pokemon/${randomId}`);
  };

  const filteredPokemon = pokemon.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString() === searchTerm
  );

  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="Pokédex"
        subtitle="Explore o mundo Pokémon com detalhes profissionais."
        pill="Banco de Dados Oficial"
      >
        <div className="flex gap-3">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou ID..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-bold text-white placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleRandom}
            className="p-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
            title="Escolha um Pokémon aleatório"
          >
            <Dices size={24} />
          </button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {loading && pokemon.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => <PokemonSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPokemon.map((p, index) => {
                if (filteredPokemon.length === index + 1) {
                  return (
                    <div key={p.id} ref={lastElementRef}>
                      <PokemonCard pokemon={p} />
                    </div>
                  );
                }
                return <PokemonCard key={p.id} pokemon={p} />;
              })}
            </div>

            {loadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {[...Array(4)].map((_, i) => <PokemonSkeleton key={i} />)}
              </div>
            )}

            {!hasMore && pokemon.length > 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Você chegou ao fim da Pokédex nacional.</p>
              </div>
            )}

            {searchTerm && filteredPokemon.length === 0 && (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <p className="text-xl font-bold text-slate-400">Nenhum Pokémon encontrado para "{searchTerm}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
