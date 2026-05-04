"use client";
import React, { useState } from "react";
import { cleanFlavorText } from "@/utils/formatters";

interface Entry {
  flavor_text: string;
  language: { name: string };
  version: { name: string };
}

export function PokemonVersionDescriptions({ entries }: { entries: Entry[] }) {
  // Filter only Portuguese and English, preferring Portuguese
  const ptEntries = entries.filter(e => e.language.name === "pt-BR" || e.language.name === "pt");
  const enEntries = entries.filter(e => e.language.name === "en");
  
  // Use PT if available, else EN
  const displayEntries = ptEntries.length > 0 ? ptEntries : enEntries;
  
  const [activeVersion, setActiveVersion] = useState<string>(displayEntries[0]?.version.name || "");

  if (displayEntries.length === 0) {
    return <div className="text-slate-500 font-mono text-sm p-4 text-center">Nenhum dado de versão disponível.</div>;
  }

  const activeEntry = displayEntries.find(e => e.version.name === activeVersion) || displayEntries[0];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="bg-slate-900/50 p-4 rounded border border-slate-800 italic text-slate-300 text-sm leading-relaxed font-mono min-h-[150px]">
        {cleanFlavorText(activeEntry.flavor_text)}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto os-scroll pr-2 pb-2">
        {displayEntries.map((entry, idx) => (
          <button
            key={idx}
            onClick={() => setActiveVersion(entry.version.name)}
            className={`px-2 py-1.5 text-[10px] font-bold uppercase rounded border transition-colors text-left truncate ${
              activeVersion === entry.version.name 
                ? "bg-cyan-900 border-cyan-500 text-cyan-300" 
                : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
            }`}
          >
            {entry.version.name.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
