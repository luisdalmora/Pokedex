"use client";
import React from "react";
import { PokemonDetailViewModel } from "@/types/view-models";
import { formatHeight, formatWeight } from "@/utils/formatters";

const DataRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="flex flex-col py-2 border-b border-slate-800">
    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</span>
    <span className="text-sm text-slate-300 font-mono">{value || "--"}</span>
  </div>
);

export function PokemonBioPanel({ pokemon }: { pokemon: PokemonDetailViewModel }) {


  return (
    <div className="flex flex-col h-full overflow-y-auto os-scroll pr-2">
      {pokemon.description && (
        <div className="bg-slate-900/50 p-4 rounded border border-slate-800 mb-6 italic text-slate-300 text-sm leading-relaxed font-mono">
          &ldquo;{pokemon.description}&rdquo;
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <DataRow label="Altura" value={formatHeight(pokemon.height)} />
        <DataRow label="Peso" value={formatWeight(pokemon.weight)} />
        
        <DataRow label="Habitat" value={pokemon.habitat ? pokemon.habitat.replace(/-/g, ' ') : "Desconhecido"} />
        <DataRow label="Cor Base" value={pokemon.color} />
        
        <DataRow label="Taxa de Captura" value={pokemon.captureRate} />
        <DataRow label="Felicidade Base" value={pokemon.baseHappiness} />
        
        <DataRow label="Grupos de Ovo" value={pokemon.eggGroups.join(", ")} />
        <DataRow label="Formato" value={pokemon.shape} />
        
        <DataRow label="Geração Origem" value={pokemon.generation ? `Geração ${pokemon.generation}` : "Desconhecido"} />
        <DataRow label="Base Exp" value={pokemon.baseExperience} />
      </div>

      <div className="mt-6">
        <h4 className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-3">Habilidades</h4>
        <div className="space-y-2">
          {pokemon.abilities.map((ability, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-white text-sm font-bold capitalize">{ability.name.replace(/-/g, ' ')}</span>
              {ability.isHidden && (
                <span className="text-[9px] uppercase tracking-widest text-yellow-500 border border-yellow-500/50 px-1 rounded">
                  Oculta
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {pokemon.forms.length > 1 && (
        <div className="mt-6">
          <h4 className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-3">Variedades Conhecidas</h4>
          <div className="flex flex-wrap gap-2">
            {pokemon.forms.map((form, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                {form.name.replace(`${pokemon.name}-`, '').replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
