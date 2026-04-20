"use client";

import React from "react";
import { GymLeader } from "@/services/localData";
import { SafeImage } from "@/components/ui/SafeImage";
import { getBestAvailableSprite, getOfficialArtwork, getShowdownSprite } from "@/utils/spriteResolver";
import { Shield, Swords, Award } from "lucide-react";
import { getTypeColor } from "@/utils/pokemonStyles";

interface TrainerTeamProps {
  leader: GymLeader;
  accentColor?: string;
}

export function TrainerTeam({ leader, accentColor = "#ef4444" }: TrainerTeamProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
      {/* Decorative accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" 
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        {/* Leader Info */}
        <div className="flex flex-col items-center shrink-0 w-40">
           <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                <SafeImage 
                  src={`https://img.pokemondb.net/sprites/trainers/home/extralarge/${leader.name.toLowerCase().split(' ')[0]}.png`}
                  fallback={`https://img.pokemondb.net/sprites/trainers/home/extralarge/red.png`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt={leader.name}
                  useSkeleton={true}
                />
              </div>
           </div>
           <h3 className="text-xl font-black text-slate-900 dark:text-white text-center leading-tight mb-1">{leader.name}</h3>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{leader.role}</p>
           
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
              <Shield size={12} className="text-rose-500" />
              <span className="text-[8px] font-black uppercase text-slate-500">Defensor de Ginásio</span>
           </div>
        </div>

        {/* Team Grid */}
        <div className="flex-1 space-y-6">
           <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h4 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                <Swords size={16} /> Equipe Pokémon
              </h4>
              <span className="text-xs font-bold text-slate-300">{leader.pokemon.length} Pokémon</span>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {leader.pokemon.map((pName, idx) => (
                <div 
                  key={`${pName}-${idx}`}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group/pkmn"
                >
                  <div className="w-16 h-16 mx-auto mb-2 relative">
                    <SafeImage 
                      src={getShowdownSprite(pName)}
                      fallback={getOfficialArtwork(pName.toLowerCase().replace(/ /g, '-'))}
                      className="w-full h-full object-contain group-hover/pkmn:scale-110 transition-transform"
                      alt={pName}
                    />
                  </div>
                  <p className="text-[10px] font-black text-center text-slate-500 dark:text-slate-400 uppercase tracking-tighter truncate">
                    {pName}
                  </p>
                </div>
              ))}
           </div>
           
           {/* Achievement */}
           <div className="pt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <Award size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 leading-tight">
                Vença este líder para obter a insígnia da região e avançar na sua jornada.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
