"use client";

import { useEffect, useState } from "react";
import { getPokemonList, getPokemon } from "@/services/pokeapi";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { PokemonSummary } from "@/types/pokemon";
import { PokemonCard, PokemonSkeleton } from "@/components/pokemon/PokemonCard";
import { Search, Dices } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const results = await getPokemonList(100, 0);
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
      setPokemon(detailed.filter((p): p is PokemonSummary => p !== null));
      setLoading(false);
    }
    loadData();
  }, []);

  const handleRandom = () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    router.push(`/pokemon/${randomId}`);
  };

  const filteredPokemon = pokemon.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString() === searchTerm
  );

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Pokédex</h1>
          <p className="text-slate-500 font-bold">Explore o mundo Pokémon com detalhes profissionais.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou ID..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-bold"
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
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => <PokemonSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </div>
  );
}
