"use client";
import React, { useState, useEffect } from "react";
import { PokemonCardViewModel } from "@/types/view-models";
import { cn } from "@/utils/cn";
import { isFavorite, toggleFavorite } from "@/lib/favorites/favorites.storage";

interface Props {
  pokemon: PokemonCardViewModel;
  className?: string;
  onToggle?: (isFav: boolean) => void;
}

export function FavoritePokemonButton({ pokemon, className, onToggle }: Props) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fav = isFavorite(pokemon.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFav(fav);
  }, [pokemon.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleFavorite(pokemon);
    setIsFav(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 group",
        isFav 
          ? "bg-[#facc15]/20 border-[#facc15] text-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
          : "bg-black/40 border-[#374151] text-[#94a3b8] hover:text-white hover:border-[#94a3b8]",
        className
      )}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isFav ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={cn("w-4 h-4", isFav && "animate-pulse")}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}
// end of file
