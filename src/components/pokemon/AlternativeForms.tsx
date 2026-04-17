"use client";

import { useEffect, useState } from "react";
import { getOfficialArtwork } from "@/utils/spriteResolver";
import Link from "next/link";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";

interface Variety {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
}

/**
 * Human-friendly name formatter
 */
const formatVarietyName = (name: string) => {
  return name
    .replace(/-/g, ' ')
    .replace(/(^|\s)\S/g, l => l.toUpperCase()) // Title case
    .replace('Mega X', 'Mega (X)')
    .replace('Mega Y', 'Mega (Y)')
    .replace('Gmax', 'Gigantamax')
    .replace('Alola', '(Alola)')
    .replace('Galar', '(Galar)')
    .replace('Hisui', '(Hisui)')
    .replace('Paldea', '(Paldea)');
};

export function AlternativeForms({ 
    varieties, 
    currentPokemonId 
}: { 
    varieties: Variety[], 
    currentPokemonId: number 
}) {
  if (varieties.length <= 1) return null;

  return (
    <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <Layers size={24} className="text-indigo-500" /> Formas Alternativas
      </h2>
      
      <div className="flex flex-wrap gap-4">
        {varieties.map((v) => {
          const name = v.pokemon.name;
          const urlParts = v.pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
          const isCurrent = parseInt(id) === currentPokemonId;

          return (
            <motion.div
              key={id}
              whileHover={{ y: -5 }}
              className={`relative ${isCurrent ? "pointer-events-none" : ""}`}
            >
              <Link
                href={`/pokemon/${id}`}
                className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-300 border-2 ${
                  isCurrent 
                    ? "bg-slate-50 dark:bg-slate-800 border-rose-500 shadow-inner" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg"
                }`}
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 mb-2">
                  <img 
                    src={getOfficialArtwork(id)} 
                    alt={name}
                    className={`w-full h-full object-contain ${isCurrent ? "" : "filter grayscale group-hover:grayscale-0"}`}
                  />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter text-center max-w-[80px] leading-tight ${
                  isCurrent ? "text-rose-600" : "text-slate-400"
                }`}>
                  {formatVarietyName(name)}
                </span>
                
                {isCurrent && (
                    <div className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg">
                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
