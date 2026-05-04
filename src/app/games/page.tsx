"use client";

import React, { useState, useEffect } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { GameViewModel } from "@/types/view-models";
import { PokedexOSPanel } from "@/components/pokedex-os/PokedexOSPanel";
import Link from "next/link";
import gamesData from "@/data/games_registry.json";

const sortedGames = [...(gamesData as GameViewModel[])].sort((a, b) => a.year - b.year);

export default function GamesPage() {
  const [games, setGames] = useState<GameViewModel[]>(sortedGames);

  // Group by generation
  const grouped = games.reduce((acc, game) => {
    if (!acc[game.generation]) acc[game.generation] = [];
    acc[game.generation].push(game);
    return acc;
  }, {} as Record<number, GameViewModel[]>);

  return (
    <PokedexOSLayout moduleName="SOFTWARE TIMELINE" itemsCount={games.length}>
      <div className="h-full overflow-y-auto os-scroll pr-2 pb-8 w-full max-w-4xl mx-auto">
        <div className="relative border-l-2 border-[#1f2937] ml-4 mt-6">
          {Object.keys(grouped).sort().map((gen) => (
            <div key={gen} className="mb-10 pl-6 relative">
              <div className="absolute w-4 h-4 rounded-full bg-cyan-500 -left-[9px] top-1 shadow-[0_0_10px_rgba(6,182,212,0.8)] border-2 border-[#0f172a]"></div>
              
              <h2 className="text-xl font-black italic tracking-widest text-cyan-400 mb-4 uppercase">
                Geração {gen}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[parseInt(gen, 10)].map((game) => (
                  <Link href={`/games/${game.id}`} key={game.id} className="group block">
                    <PokedexOSPanel className="transition-all duration-300 border-[#1f2937] group-hover:border-cyan-500 group-hover:bg-[#111827]">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest bg-black/50 px-1 py-0.5 rounded w-max mb-1 border border-slate-800">
                            {game.console}
                          </span>
                          <h3 className="text-white font-bold group-hover:text-cyan-400 transition-colors uppercase">
                            {game.name}
                          </h3>
                        </div>
                        <div className="text-cyan-500 font-mono font-bold text-xs">
                          {game.year}
                        </div>
                      </div>
                      
                      <div className="text-slate-400 text-[10px] font-mono flex gap-3 uppercase">
                        <span><span className="text-slate-600">REG:</span> {game.region}</span>
                        {game.isRemake && <span className="text-yellow-500 bg-yellow-500/10 px-1 rounded">REMAKE</span>}
                      </div>
                    </PokedexOSPanel>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokedexOSLayout>
  );
}
