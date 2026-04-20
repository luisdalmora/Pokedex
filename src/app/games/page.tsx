"use client";

import { useState } from "react";
import gamesRegistry from "@/data/games_registry.json";
import { Gamepad2, Monitor, Calendar, Smartphone, Gamepad, Layers } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";

const BOX_ART_MAP: Record<string, string> = {
  "lets-go-pikachu": "lets-go-pikachu-switch",
  "lets-go-eevee": "lets-go-eevee-switch",
  "green": "pocket-monsters-green",
  "legends-arceus": "legends-arceus",
  "brilliant-diamond": "brilliant-diamond",
  "shining-pearl": "shining-pearl",
  "scarlet": "scarlet",
  "violet": "violet"
};

const getBoxArtUrl = (gameId: string) => {
  const slug = BOX_ART_MAP[gameId] || gameId;
  return `https://img.pokemondb.net/boxes/${slug}.jpg`;
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes("switch")) return <Smartphone size={10} className="text-rose-500" />;
  if (p.includes("3ds") || p.includes("ds")) return <Smartphone size={10} className="text-blue-500" />;
  if (p.includes("game boy")) return <Gamepad size={10} className="text-emerald-500" />;
  return <Monitor size={10} className="text-slate-400" />;
};

export default function GamesPage() {
  const [activeRegionId, setActiveRegionId] = useState(gamesRegistry.regions[0].id);
  
  const activeRegion = gamesRegistry.regions.find(r => r.id === activeRegionId) || gamesRegistry.regions[0];

  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="Biblioteca de Jogos"
        subtitle="Navegue por décadas de história Pokémon, organizadas por regiões e gerações."
        pill="Coleção de Aventuras"
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 space-y-12">

      {/* Region Selector (Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        {gamesRegistry.regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setActiveRegionId(region.id)}
            className={`
              px-6 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all whitespace-nowrap
              ${activeRegionId === region.id 
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20 scale-105" 
                : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}
            `}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* Region Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRegionId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="w-16 h-16 rounded-[2rem] bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/20">
              <Layers size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Região de {activeRegion.name}
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                {activeRegion.generations.length} {activeRegion.generations.length === 1 ? 'Geração' : 'Gerações'} disponíveis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activeRegion.generations.map((gen) => (
              <div key={gen.name} className="space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {gen.name}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {gen.games.map((game) => (
                    <Link 
                      key={game.id} 
                      href={`/games/${game.id}`}
                      className="group flex items-center gap-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="w-16 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-inner">
                        <SafeImage 
                          src={getBoxArtUrl(game.id)} 
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors leading-tight mb-2">
                          {game.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                            <PlatformIcon platform={game.platform} /> 
                            {game.platform}
                          </span>
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                            <Calendar size={10} className="text-slate-400" /> 
                            {game.year}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}
