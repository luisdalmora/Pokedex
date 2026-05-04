"use client";
import React from "react";
import { translateStat } from "@/utils/translations";

export function PokemonStatsPanel({ stats }: { stats: { name: string; value: number }[] }) {
  const total = stats.reduce((acc, s) => acc + s.value, 0);
  const maxStatValue = 255; // Blissey HP is 255

  // find max and min stat for highlight
  let maxVal = -1;
  let minVal = 999;
  stats.forEach(s => {
    if (s.value > maxVal) maxVal = s.value;
    if (s.value < minVal) minVal = s.value;
  });

  return (
    <div className="space-y-4 text-xs font-mono">
      {stats.map((stat) => {
        const isMax = stat.value === maxVal;
        const isMin = stat.value === minVal;
        const width = Math.min(100, (stat.value / maxStatValue) * 100);
        
        let colorClass = "bg-cyan-500";
        if (stat.value < 50) colorClass = "bg-red-500";
        else if (stat.value < 80) colorClass = "bg-yellow-500";
        else if (stat.value >= 120) colorClass = "bg-green-500";

        return (
          <div key={stat.name} className="flex flex-col gap-1">
            <div className="flex justify-between text-slate-400">
              <span className={`uppercase font-bold ${isMax ? "text-green-400" : isMin ? "text-red-400" : ""}`}>
                {translateStat(stat.name)}
              </span>
              <span className="text-white">{stat.value}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colorClass} transition-all duration-1000 shadow-[0_0_5px_currentColor]`} 
                style={{ width: `${width}%` }} 
              />
            </div>
          </div>
        );
      })}
      
      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-sm">
        <span className="text-slate-400 font-bold uppercase">Total de Base Stats</span>
        <span className="text-cyan-400 font-bold">{total}</span>
      </div>
    </div>
  );
}
