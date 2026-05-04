"use client";
import React from "react";
import { EvolutionTreeViewModel, EvolutionMethodDetails } from "@/types/view-models";
import { SafeImage } from "../ui/SafeImage";
import Link from "next/link";
import { translateEvolutionMethod } from "@/utils/translations";

export function PokemonEvolutionTree({ chain }: { chain: EvolutionTreeViewModel | null }) {
  if (!chain) return <div className="text-slate-500 font-mono text-sm p-4 text-center">Nenhum dado evolutivo disponível.</div>;

  const renderEvolutionDetails = (details: EvolutionMethodDetails[]) => {
    if (!details || details.length === 0) return null;
    const method = details[0]; // Usually we just show the primary condition
    
    let text = translateEvolutionMethod(method.trigger);
    
    if (method.minLevel) text += ` Nv. ${method.minLevel}`;
    if (method.item) text += ` com ${method.item.replace(/-/g, ' ')}`;
    if (method.minHappiness) text += ` + Felicidade`;
    if (method.heldItem) text += ` segurando ${method.heldItem.replace(/-/g, ' ')}`;
    if (method.timeOfDay) text += ` de ${method.timeOfDay}`;
    
    return (
      <div className="flex flex-col items-center justify-center px-4 py-2 text-center text-[10px] text-cyan-400 font-mono tracking-tighter">
        <span className="mb-1 text-slate-500">&darr;</span>
        <span className="bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">
          {text}
        </span>
      </div>
    );
  };

  const renderNode = (node: EvolutionTreeViewModel) => {
    return (
      <div className="flex flex-col items-center w-full my-4">
        <Link href={`/pokemon/${node.id}`} className="group flex flex-col items-center">
          <div className="relative w-24 h-24 bg-slate-900 rounded-full border-2 border-slate-700 group-hover:border-cyan-500 transition-colors flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <SafeImage src={node.spriteUrl} alt={node.speciesName} className="group-hover:scale-110 transition-transform" />
          </div>
          <span className="mt-2 text-white font-bold uppercase tracking-widest text-xs group-hover:text-cyan-400">
            {node.speciesName}
          </span>
        </Link>
        
        {node.evolvesTo && node.evolvesTo.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-2 w-full">
            {node.evolvesTo.map((evolution, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {renderEvolutionDetails(evolution.details)}
                {renderNode(evolution.species)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-full overflow-y-auto os-scroll py-4 px-2">
      {renderNode(chain)}
    </div>
  );
}
