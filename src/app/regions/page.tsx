"use client";

import React, { useState, useEffect } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { RegionViewModel } from "@/types/view-models";
import { PokedexOSPanel } from "@/components/pokedex-os/PokedexOSPanel";
import Link from "next/link";
import regionData from "@/data/region_registry.json";

const mappedRegions: RegionViewModel[] = (regionData as RegionViewModel[]).map((r) => ({
  slug: r.slug,
  name: r.name,
  generation: r.generation,
  pokemonRange: r.pokemonRange,
  starters: r.starters || [],
  legendaries: r.legendaries || [],
  mainGames: r.mainGames || [],
  description: r.description || ""
}));

export default function RegionsPage() {
  const [regions] = useState<RegionViewModel[]>(mappedRegions);

  return (
    <PokedexOSLayout moduleName="GEOGRAPHIC MAPPING" itemsCount={regions.length}>
      <div className="h-full overflow-y-auto os-scroll pr-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {regions.map((region) => (
            <Link key={region.slug} href={region.slug === "kanto" ? "/regions/kanto" : `/regions/${region.slug}`} className="group">
              <PokedexOSPanel className={`h-full transition-all duration-300 ${region.slug === "kanto" ? "border-red-500 hover:bg-red-900/20" : "border-[#1f2937] hover:border-cyan-500 hover:bg-[#0f172a]"}`}>
                <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-3">
                  <div>
                    <h3 className={`text-lg font-black uppercase tracking-widest ${region.slug === "kanto" ? "text-red-400 group-hover:text-red-300" : "text-white group-hover:text-cyan-400"}`}>
                      {region.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">GEN {region.generation} :: {region.pokemonRange}</span>
                  </div>
                  {region.slug === "kanto" && (
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                  )}
                </div>
                
                <div className="bg-slate-900/80 p-4 rounded border border-emerald-900/50 italic text-slate-300 text-sm leading-relaxed font-mono">
                    &ldquo;{region.description}&rdquo;
                </div>

                <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-mono mt-auto">
                  <div className="flex justify-between">
                    <span>GAMES:</span>
                    <span className="text-slate-300 text-right">{region.mainGames.slice(0, 2).join(", ")} {region.mainGames.length > 2 ? "..." : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STARTERS:</span>
                    <span className="text-slate-300 text-right">{region.starters.slice(0, 3).join(", ")}</span>
                  </div>
                </div>
              </PokedexOSPanel>
            </Link>
          ))}
        </div>
      </div>
    </PokedexOSLayout>
  );
}
