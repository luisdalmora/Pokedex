"use client";

import React, { useState, useEffect } from "react";
import { PokeAPIClient } from "@/lib/pokeapi/client";
import { SafeImage } from "../ui/SafeImage";
import { Badge, Loader } from "../ui/States";
import { translateType } from "@/utils/translations";
import { PokedexOSPanel } from "../pokedex-os/PokedexOSPanel";

interface PokemonFormsPanelProps {
  varieties: {
    name: string;
    url: string;
    isDefault: boolean;
  }[];
}

interface FormDetail {
  id: number;
  name: string;
  types: string[];
  sprite: string | null;
  category: string;
}

export function PokemonFormsPanel({ varieties }: PokemonFormsPanelProps) {
  const [forms, setForms] = useState<FormDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadForms() {
      // Don't load if we only have the default variety
      if (varieties.length <= 1) {
        setLoading(false);
        return;
      }

      try {
        const nonDefault = varieties.filter(v => !v.isDefault);
        const details = await Promise.all(
          nonDefault.map(async (v) => {
            const data = await PokeAPIClient.getPokemon(v.name);
            
            // Classification logic based on name
            let category = "Special Form";
            const name = data.name.toLowerCase();
            
            if (name.includes("-mega")) category = "Mega Evolution";
            else if (name.includes("-gmax")) category = "Gigantamax";
            else if (name.includes("-alola")) category = "Alolan Form";
            else if (name.includes("-galar")) category = "Galarian Form";
            else if (name.includes("-hisui")) category = "Hisuian Form";
            else if (name.includes("-paldea")) category = "Paldean Form";
            else if (name.includes("-primal")) category = "Primal Reversion";
            else if (name.includes("-origin")) category = "Origin Forme";
            else if (name.includes("-therian")) category = "Therian Forme";
            
            return {
              id: data.id,
              name: data.name.replace(/-/g, " "),
              types: data.types.map(t => t.type.name),
              sprite: data.sprites.other?.home?.front_default || data.sprites.front_default,
              category
            };
          })
        );
        setForms(details);
      } catch (error) {
        console.error("Failed to load forms", error);
      } finally {
        setLoading(false);
      }
    }

    loadForms();
  }, [varieties]);

  if (loading) return <Loader text="SYNCING FORM DATA..." />;

  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
        <span className="text-4xl mb-2">🧬</span>
        <p className="text-[10px] font-mono tracking-widest uppercase">No alternate forms detected.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 os-scroll">
      {forms.map((form) => (
        <PokedexOSPanel key={form.id} variant="default" className="p-3 border-slate-800 bg-slate-900/50">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-black/40 rounded flex items-center justify-center border border-slate-800 shrink-0">
              <SafeImage 
                src={form.sprite || ""} 
                alt={form.name} 
                width={60} 
                height={60}
                className="drop-shadow-md"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-wider mb-1">
                {form.category}
              </span>
              <h4 className="text-xs font-black text-white uppercase truncate mb-2">
                {form.name}
              </h4>
              <div className="flex gap-1">
                {form.types.map(type => (
                  <span 
                    key={type} 
                    className="text-[8px] px-1 py-0 rounded font-bold uppercase text-white shadow-sm" 
                    style={{ backgroundColor: `var(--color-type-${type}, #475569)` }}
                  >
                    {translateType(type)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </PokedexOSPanel>
      ))}
    </div>
  );
}
