"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PokemonSummary } from "@/types/pokemon";
import { translateType } from "@/utils/translations";
import { getTypeColor } from "@/utils/pokemonStyles";
import { SafeImage } from "@/components/ui/SafeImage";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  const primaryType = pokemon.types[0];
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link href={`/pokemon/${pokemon.id}`}>
        <div className={cn(
          "relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
          "hover:border-transparent transition-all duration-300",
          "flex flex-col items-center text-center shadow-sm hover:shadow-2xl"
        )}>
          {/* Dynamic Background Glow */}
          <div 
            className="absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-10 group-hover:opacity-40 transition-opacity duration-500"
            style={{ backgroundColor: getTypeColor(primaryType) }}
          />
          
          <span className="absolute top-4 right-6 text-xl font-black text-slate-200 dark:text-slate-800">
            #{String(pokemon.id).padStart(3, '0')}
          </span>

          <div className="relative w-40 h-40 mb-4 group-hover:drop-shadow-2xl transition-all duration-300">
            <SafeImage 
               src={pokemon.image} 
               alt={pokemon.name}
               className="w-full h-full object-contain filter group-hover:brightness-105"
            />
          </div>

          <h3 className="text-xl font-black capitalize text-slate-900 dark:text-white mb-3">
            {pokemon.name.replace('-', ' ')}
          </h3>

          <div className="flex gap-2 justify-center">
            {pokemon.types.map(type => (
              <span 
                key={type}
                style={{ backgroundColor: getTypeColor(type) }}
                className={cn(
                  "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
                )}
              >
                {translateType(type)}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PokemonSkeleton() {
  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
      <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded self-end mb-4 animate-skeleton" />
      <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 animate-skeleton" />
      <div className="w-24 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 animate-skeleton" />
      <div className="flex gap-2 mt-auto">
        <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded-full animate-skeleton" />
        <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded-full animate-skeleton" />
      </div>
    </div>
  );
}
