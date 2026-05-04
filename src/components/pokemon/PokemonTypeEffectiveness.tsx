"use client";
import React, { useMemo } from "react";
import { calculateTypeEffectiveness } from "@/lib/pokemon/type-effectiveness";
import { translateType } from "@/utils/translations";

export function PokemonTypeEffectiveness({ types }: { types: string[] }) {
  const effectiveness = useMemo(() => calculateTypeEffectiveness(types), [types]);

  const renderSection = (title: string, list: string[], mult: string, color: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4 bg-slate-900/50 p-3 rounded border border-slate-800">
        <h4 className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold flex justify-between">
          <span>{title}</span>
          <span className={color}>{mult}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {list.map(t => (
            <span 
              key={t}
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white shadow-md border border-white/10"
              style={{ backgroundColor: `var(--color-type-${t.toLowerCase()})` }}
            >
              {translateType(t)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full font-mono">
      {renderSection("Dano Fatal", effectiveness.weaknesses4x, "x4", "text-red-400")}
      {renderSection("Fraquezas", effectiveness.weaknesses2x, "x2", "text-red-300")}
      {renderSection("Resistências", effectiveness.resistances05x, "x0.5", "text-green-300")}
      {renderSection("Super Resistências", effectiveness.resistances025x, "x0.25", "text-green-400")}
      {renderSection("Imunidades", effectiveness.immunities0x, "x0", "text-slate-500")}
    </div>
  );
}
