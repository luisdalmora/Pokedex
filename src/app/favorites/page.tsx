"use client";

import { useEffect, useState } from "react";
import { getPokemon } from "@/services/pokeapi";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { PokemonSummary } from "@/types/pokemon";
import { PokemonCard, PokemonSkeleton } from "@/components/pokemon/PokemonCard";
import { Heart, Search, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      const stored = localStorage.getItem("pokedex-favorites");
      if (stored) {
        const ids = JSON.parse(stored) as number[];
        const detailed = await Promise.all(
          ids.map(async (id) => {
            try {
              const detail = await getPokemon(id.toString());
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
        setFavorites(detailed.filter((p): p is PokemonSummary => p !== null));
      }
      setLoading(false);
    }
    loadFavorites();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="Meus Favoritos"
        subtitle="Sua coleção pessoal de Pokémon favoritos, salvos para acesso rápido."
        pill="Espaço do Treinador"
        backgroundImage="/images/backgrounds/hero-bg.png"
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <PokemonSkeleton key={i} />)}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="w-20 h-20 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-3xl mx-auto mb-6">
                <Heart size={40} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Sua lista está vazia</h2>
             <p className="text-slate-500 font-bold max-w-md mx-auto mb-8">
               Você ainda não favoritou nenhum Pokémon. Explore a Pokédex e clique no ícone de coração para salvar seus favoritos aqui.
             </p>
             <Link href="/pokedex" className="inline-flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">
               Explorar Pokédex <ChevronRight size={20} />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
