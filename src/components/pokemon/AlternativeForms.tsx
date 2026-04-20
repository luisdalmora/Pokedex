"use client";

import { getBestAvailableSprite } from "@/utils/spriteResolver";
import Link from "next/link";
import { Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";

interface Variety {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
}

/**
 * Human-friendly name formatter for various Pokémon forms
 */
const formatVarietyName = (name: string) => {
  return name
    .replace(/-/g, ' ')
    .replace(/(^|\s)\S/g, l => l.toUpperCase()) // Title case
    .replace('Mega X', 'Mega (X)')
    .replace('Mega Y', 'Mega (Y)')
    .replace('Gmax', 'Gigantamax')
    .replace('Alola', 'Alolan')
    .replace('Galar', 'Galarian')
    .replace('Hisui', 'Hisuian')
    .replace('Paldea', 'Paldean');
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Layers size={24} className="text-indigo-500" /> Formas & Variedades
        </h2>
        <span className="px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-400">
          {varieties.length} Disponíveis
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {varieties.map((v) => {
          const name = v.pokemon.name;
          const urlParts = v.pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
          const isCurrent = parseInt(id) === currentPokemonId;

          return (
            <motion.div
              key={id}
              whileHover={isCurrent ? {} : { y: -5, scale: 1.02 }}
              className="h-full"
            >
              <Link
                href={`/pokemon/${id}`}
                className={`flex flex-col items-center justify-between h-full p-4 rounded-[2rem] transition-all duration-500 border-2 ${
                  isCurrent 
                    ? "bg-slate-50 dark:bg-slate-800 border-rose-500 shadow-inner" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-400 hover:shadow-2xl group"
                }`}
              >
                <div className="relative w-20 h-20 mb-4 p-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg z-10 animate-bounce">
                      <Sparkles size={10} />
                    </div>
                  )}
                  <SafeImage 
                    src={getBestAvailableSprite(id)} 
                    alt={name}
                    className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                   <span className={`block text-[10px] font-black uppercase tracking-widest leading-tight ${
                    isCurrent ? "text-rose-600" : "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`}>
                    {formatVarietyName(name)}
                  </span>
                  {v.is_default && (
                    <small className="text-[8px] font-bold text-slate-300 uppercase mt-1 block">Principal</small>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
