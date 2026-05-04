"use client";

import React, { useState, useEffect } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { EmptyState } from "@/components/ui/States";
import { getFavorites } from "@/lib/favorites/favorites.storage";
import { PokemonCardViewModel } from "@/types/view-models";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<PokemonCardViewModel[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Load favorites in next tick
    const timer = setTimeout(() => {
      setFavorites(getFavorites());
    }, 0);
    
    const handleUpdate = () => {
      setFavorites(getFavorites());
    };
    
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("favoritesUpdated", handleUpdate);
    };
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <PokedexOSLayout 
      moduleName="LOCAL STORAGE // FAVORITES" 
      itemsCount={favorites.length}
    >
      <div className="h-full flex flex-col p-2">
        {favorites.length === 0 ? (
          <EmptyState message="NENHUM REGISTRO SALVO NO ARMAZENAMENTO LOCAL." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto os-scroll pr-2 pb-4">
            {favorites.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} showGeneration />
            ))}
          </div>
        )}
      </div>
    </PokedexOSLayout>
  );
}
