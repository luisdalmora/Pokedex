"use client";

import { useEffect, useState } from "react";
import { EvolutionLink, EvolutionDetail } from "@/types/pokemon";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Zap, Repeat } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

/**
 * Helper to display the evolution trigger in a friendly way
 */
const getTriggerLabel = (details: EvolutionDetail) => {
  if (!details) return null;
  
  if (details.trigger.name === "level-up") {
    if (details.min_level) return `Nível ${details.min_level}`;
    if (details.min_happiness) return "Felicidade";
    if (details.min_affection) return "Afeto";
    if (details.known_move) return "Aprender Golpe";
    if (details.location) return "Localização";
    if (details.time_of_day && details.time_of_day !== "") return `Dia/Noite`;
  }
  
  if (details.trigger.name === "use-item" && details.item) {
    return details.item.name.replace('-', ' ');
  }
  
  if (details.trigger.name === "trade") {
    return "Troca";
  }

  return details.trigger.name.replace('-', ' ');
};

const TriggerIcon = ({ trigger }: { trigger: string }) => {
  if (trigger === "use-item") return <Box size={12} />;
  if (trigger === "level-up") return <Zap size={12} />;
  if (trigger === "trade") return <Repeat size={12} />;
  return null;
};

interface TreeNodeProps {
  link: EvolutionLink;
  isFirst?: boolean;
}

const PokemonNode = ({ speciesName, id }: { speciesName: string, id: string }) => (
  <Link href={`/pokemon/${id}`} className="group flex flex-col items-center">
    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center p-2 border-2 border-transparent group-hover:border-rose-500 transition-all shadow-sm">
      <SafeImage 
        src={getBestAvailableSprite(id)} 
        alt={speciesName} 
        className="w-full h-full object-contain"
      />
    </div>
    <span className="mt-2 text-[10px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-rose-600">
      {speciesName.replace('-', ' ')}
    </span>
  </Link>
);

const EvolutionNode = ({ link }: TreeNodeProps) => {
  const parts = link.species.url.split("/");
  const id = parts[parts.length - 2];

  return (
    <div className="flex items-center gap-4">
      {/* Current Pokemon */}
      <PokemonNode speciesName={link.species.name} id={id} />

      {/* Children Branches */}
      {link.evolves_to.length > 0 && (
        <div className="flex flex-col gap-6">
          {link.evolves_to.map((child, idx) => {
            const detail = child.evolution_details[0];
            const triggerText = detail ? getTriggerLabel(detail) : null;
            
            return (
              <div key={idx} className="flex items-center gap-4">
                {/* Arrow and Trigger */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <ArrowRight size={16} className="text-slate-300 dark:text-slate-700" />
                  {triggerText && (
                    <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase text-slate-400">
                      {detail && <TriggerIcon trigger={detail.trigger.name} />}
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
    <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-x-auto">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Linha Evolutiva</h2>
      <div className="min-w-max">
        <EvolutionNode link={chain} isFirst />
      </div>
    </section>
  );
}
