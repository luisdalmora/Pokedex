"use client";

import React from "react";
import { PokemonCardViewModel } from "@/types/view-models";
import { SafeImage } from "../ui/SafeImage";
import { Badge } from "../ui/States";
import { translateType } from "@/utils/translations";
import { formatId } from "@/utils/formatters";
import Link from "next/link";
import { FavoritePokemonButton } from "./FavoritePokemonButton";
import { cn } from "@/utils/cn";

interface Props {
  pokemon: PokemonCardViewModel;
  showGeneration?: boolean;
}

export function PokemonCard({ pokemon, showGeneration = false }: Props) {
  return (
    <div className="relative group">
      <Link href={`/pokemon/${pokemon.id}`} className="block h-full">
        <div className={cn(
          "relative h-full flex flex-col bg-gradient-to-br from-[#0f172a] to-[#020617] border-2 border-[#1f2937]",
          "rounded-lg overflow-hidden transition-all duration-300",
          "hover:border-[#38bdf8] hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:-translate-y-1"
        )}>
          
          {/* Header area */}
          <div className="flex justify-between items-center p-2 border-b border-[#1f2937] bg-black/40">
            <span className="text-[#94a3b8] font-bold text-xs font-mono">{formatId(pokemon.id)}</span>
            <div className="flex gap-1">
              {pokemon.isLegendary && <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-[8px]">L</Badge>}
              {pokemon.isMythical && <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/50 text-[8px]">M</Badge>}
            </div>
          </div>

          {/* Image area */}
          <div className="relative flex-1 p-4 flex items-center justify-center min-h-[120px] bg-gradient-to-b from-transparent to-[#1e293b]/50">
            {/* Type background glow */}
            <div 
              className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40 blur-xl rounded-full scale-75"
              style={{ backgroundColor: `var(--color-type-${pokemon.types[0]?.toLowerCase()})` }}
            />
            <SafeImage 
              src={pokemon.spriteUrl} 
              alt={pokemon.name}
              className="z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Footer area */}
          <div className="p-3 border-t border-[#1f2937] bg-[#0f172a]">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider truncate mb-2 group-hover:text-[#38bdf8] transition-colors">
              {pokemon.name}
            </h3>
            
            <div className="flex flex-wrap gap-1">
              {pokemon.types.map((type) => (
                <span 
                  key={type}
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-white border border-white/20"
                  style={{ backgroundColor: `var(--color-type-${type.toLowerCase()})` }}
                >
                  {translateType(type)}
                </span>
              ))}
            </div>
            
            {showGeneration && pokemon.generation && (
              <div className="mt-2 text-[10px] text-[#94a3b8] uppercase">
                Geração {pokemon.generation}
              </div>
            )}
          </div>

          {/* Scanline hover effect */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 scanline-effect transition-opacity duration-300"></div>
        </div>
      </Link>
      
      {/* Absolute positioned favorite button so it doesn't trigger the link */}
      <div className="absolute top-1 right-1 z-20">
        <FavoritePokemonButton pokemon={pokemon} />
      </div>
    </div>
  );
}
