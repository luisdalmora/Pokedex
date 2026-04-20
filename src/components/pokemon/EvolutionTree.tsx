"use client";

import { useEffect, useState } from "react";
import { EvolutionLink, EvolutionDetail } from "@/types/pokemon";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Zap, Repeat, Heart, HelpCircle, MapPin, Moon, Sun, Sword } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

/**
 * Helper to display the evolution trigger in a friendly way
 */
const getTriggerLabel = (details: EvolutionDetail) => {
  if (!details) return null;
  
  if (details.trigger.name === "level-up") {
    if (details.min_level) return `Nível ${details.min_level}`;
    if (details.min_happiness) return "Felicidade Máxima";
    if (details.min_affection) return "Muito Afeto";
    if (details.min_beauty) return "Beleza Máxima";
    if (details.known_move) return `Saber ${details.known_move.name.replace(/-/g, ' ')}`;
    if (details.location) return "Neste Local";
    if (details.time_of_day) return details.time_of_day === "day" ? "Durante o Dia" : "Durante a Noite";
    if (details.held_item) return `Segurando ${details.held_item.name.replace(/-/g, ' ')}`;
    return "Subir de Nível";
  }
  
  if (details.trigger.name === "use-item" && details.item) {
    return details.item.name.replace(/-/g, ' ');
  }
  
  if (details.trigger.name === "trade") {
    if (details.held_item) return `Trocar com ${details.held_item.name.replace(/-/g, ' ')}`;
    return "Troca";
  }

  return details.trigger.name.replace(/-/g, ' ');
};

const TriggerIcon = ({ details }: { details: EvolutionDetail }) => {
  const trigger = details.trigger.name;
  if (trigger === "use-item") return <Box size={14} className="text-amber-500" />;
  if (trigger === "trade") return <Repeat size={14} className="text-indigo-500" />;
  
  if (trigger === "level-up") {
    if (details.min_happiness || details.min_affection) return <Heart size={14} className="text-pink-500" />;
    if (details.location) return <MapPin size={14} className="text-emerald-500" />;
    if (details.time_of_day === "day") return <Sun size={14} className="text-orange-500" />;
    if (details.time_of_day === "night") return <Moon size={14} className="text-slate-500" />;
    if (details.known_move) return <Sword size={14} className="text-rose-500" />;
    return <Zap size={14} className="text-amber-400" />;
  }
  
  return <HelpCircle size={14} className="text-slate-400" />;
};

const ItemImage = ({ itemName }: { itemName: string }) => (
  <img 
    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`}
    alt={itemName}
    className="w-8 h-8 object-contain drop-shadow-sm"
    onError={(e) => (e.currentTarget.style.display = 'none')}
  />
);

const PokemonNode = ({ speciesName, id }: { speciesName: string, id: string }) => (
  <Link href={`/pokemon/${id}`} className="group flex flex-col items-center">
    <div className="relative w-20 h-20 lg:w-28 lg:h-28 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center p-4 border-2 border-slate-100 dark:border-slate-800 group-hover:border-rose-500 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 opacity-50" />
      <SafeImage 
        src={getBestAvailableSprite(id)} 
        alt={speciesName} 
        className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <span className="mt-3 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
      {speciesName.replace(/-/g, ' ')}
    </span>
  </Link>
);

const EvolutionNode = ({ link }: { link: EvolutionLink }) => {
  const parts = link.species.url.split("/");
  const id = parts[parts.length - 2];

  return (
    <div className="flex items-center gap-6 lg:gap-12">
      {/* Current Pokemon */}
      <PokemonNode speciesName={link.species.name} id={id} />

      {/* Children Branches */}
      {link.evolves_to.length > 0 && (
        <div className="flex flex-col gap-10">
          {link.evolves_to.map((child, idx) => {
            const detail = child.evolution_details[0];
            const triggerText = detail ? getTriggerLabel(detail) : null;
            
            return (
              <div key={idx} className="flex items-center gap-6 lg:gap-12">
                {/* Arrow and Trigger */}
                <div className="flex flex-col items-center min-w-[100px] lg:min-w-[140px] relative">
                  <div className="flex items-center gap-2 mb-2">
                     <ArrowRight size={20} className="text-slate-200 dark:text-slate-700" />
                     {detail?.item && <ItemImage itemName={detail.item.name} />}
                  </div>
                  
                  {triggerText && (
                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 whitespace-nowrap shadow-sm">
                      {detail && <TriggerIcon details={detail} />}
                      {triggerText}
                    </div>
                  )}
                </div>
                
                {/* Recurse */}
                <EvolutionNode link={child} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function EvolutionTree({ chain }: { chain: EvolutionLink }) {
  if (!chain) return null;

  return (
    <section className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Linha Evolutiva</h2>
        <div className="hidden sm:flex gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
        </div>
      </div>
      <div className="min-w-max py-4">
        <EvolutionNode link={chain} />
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
