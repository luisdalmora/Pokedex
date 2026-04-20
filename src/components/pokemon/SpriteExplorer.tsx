"use client";

import React, { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { SafeImage } from "@/components/ui/SafeImage";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, ChevronRight, ChevronLeft, Sparkles, User, UserMinus } from "lucide-react";
import { getTypeColor } from "@/utils/pokemonStyles";

interface SpriteExplorerProps {
  pokemon: Pokemon;
}

type SpriteCategory = {
  name: string;
  gen: string;
  versions: {
    name: string;
    key: string;
    hasBack?: boolean;
    hasFemale?: boolean;
    isAnimated?: boolean;
  }[];
};

const CATEGORIES: SpriteCategory[] = [
  {
    name: "Geração 1",
    gen: "generation-i",
    versions: [
      { name: "Red / Blue", key: "red-blue", hasBack: true },
      { name: "Yellow", key: "yellow", hasBack: true },
    ],
  },
  {
    name: "Geração 2",
    gen: "generation-ii",
    versions: [
      { name: "Gold", key: "gold", hasBack: true },
      { name: "Silver", key: "silver", hasBack: true },
      { name: "Crystal", key: "crystal", hasBack: true },
    ],
  },
  {
    name: "Geração 3",
    gen: "generation-iii",
    versions: [
      { name: "Ruby / Sapphire", key: "ruby-sapphire", hasBack: true },
      { name: "Emerald", key: "emerald", hasBack: true },
      { name: "FireRed / LeafGreen", key: "firered-leafgreen", hasBack: true },
    ],
  },
  {
    name: "Geração 4",
    gen: "generation-iv",
    versions: [
      { name: "Diamond / Pearl", key: "diamond-pearl", hasBack: true, hasFemale: true },
      { name: "Platinum", key: "platinum", hasBack: true, hasFemale: true },
      { name: "HG / SS", key: "heartgold-soulsilver", hasBack: true, hasFemale: true },
    ],
  },
  {
    name: "Geração 5",
    gen: "generation-v",
    versions: [
      { name: "Black / White", key: "black-white", hasBack: true, hasFemale: true, isAnimated: true },
    ],
  },
  {
    name: "Geração 6",
    gen: "generation-vi",
    versions: [
      { name: "X / Y", key: "x-y", hasBack: true, hasFemale: true },
      { name: "Omega Ruby / Alpha Sapphire", key: "omegaruby-alphasapphire", hasBack: true, hasFemale: true },
    ],
  },
  {
    name: "Geração 7",
    gen: "generation-vii",
    versions: [
      { name: "Ultra Sun / Ultra Moon", key: "ultra-sun-ultra-moon", hasBack: true, hasFemale: true },
    ],
  },
];

export function SpriteExplorer({ pokemon }: SpriteExplorerProps) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[CATEGORIES.length - 1].name);
  const [showShiny, setShowShiny] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [showFemale, setShowFemale] = useState(false);

  const primaryType = pokemon.types[0].type.name;
  const accentColor = getTypeColor(primaryType);

  const getSpriteUrl = (gen: string, version: string, type: "front" | "back", isShiny: boolean, isFemale: boolean) => {
    const versions = (pokemon.sprites as any).versions;
    if (!versions || !versions[gen] || !versions[gen][version]) return null;

    const vData = versions[gen][version];
    
    // Handle animated for Gen 5
    if (gen === "generation-v" && version === "black-white") {
      const animated = vData.animated;
      if (animated) {
        let key = `${type}_${isShiny ? "shiny" : "default"}`;
        if (isFemale && animated[`${key}_female`]) {
          key = `${key}_female`;
        }
        return animated[key] || vData[key];
      }
    }

    let key = `${type}_${isShiny ? "shiny" : "default"}`;
    if (isFemale && vData[`${key}_female`]) {
      key = `${key}_female`;
    }
    return vData[key];
  };

  const activeCatData = CATEGORIES.find(c => c.name === activeCategory);
  const currentHasFemale = activeCatData?.versions.some(v => v.hasFemale);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Header with Tabs */}
      <div className="p-1 px-1 bg-slate-50 dark:bg-slate-800/50 flex overflow-x-auto no-scrollbar gap-1 border-b border-slate-100 dark:border-slate-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setActiveCategory(cat.name);
              if (!cat.versions.some(v => v.hasFemale)) setShowFemale(false);
            }}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 rounded-t-2xl ${
              activeCategory === cat.name
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05),10px_0_15px_-5px_rgba(0,0,0,0.05)]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Galeria de Sprites</h3>
            <p className="text-slate-500 font-bold">Histórico visual oficial através das eras.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl">
            <button
              onClick={() => setShowShiny(!showShiny)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                showShiny 
                  ? "bg-white dark:bg-slate-700 text-amber-500 shadow-md" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Sparkles size={16} /> {showShiny ? "Shiny" : "Ver Shinies"}
            </button>
            <button
              onClick={() => setShowBack(!showBack)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                showBack 
                  ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-md" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <UserMinus size={16} className={showBack ? "rotate-180" : ""} /> {showBack ? "Costas" : "Frente"}
            </button>
            {currentHasFemale && (
              <button
                onClick={() => setShowFemale(!showFemale)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  showFemale 
                    ? "bg-white dark:bg-slate-700 text-rose-500 shadow-md" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <User size={16} /> {showFemale ? "Fêmea" : "Macho"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {activeCatData?.versions.map((v) => {
              const url = getSpriteUrl(activeCatData.gen, v.key, showBack ? "back" : "front", showShiny, showFemale && v.hasFemale);
              
              if (!url) return null;

              return (
                <motion.div
                  key={`${activeCategory}-${v.key}-${showBack}-${showShiny}-${showFemale}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] p-6 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-500"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {v.name}
                    </span>
                  </div>
                  
                  <div className="relative h-40 w-full flex items-center justify-center p-4">
                    {/* Background Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-3xl"
                      style={{ backgroundColor: accentColor }}
                    />
                    
                    <SafeImage 
                      src={url} 
                      alt={`${pokemon.name} ${v.name}`}
                      className={`w-32 h-32 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500 ${v.isAnimated ? "pixelated" : ""}`}
                      useSkeleton={true}
                    />
                  </div>

                  {v.isAnimated && (
                    <div className="absolute bottom-4 right-4 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      Animado
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Fallback info */}
        <div className="mt-12 flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
           <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm">
             <Monitor size={20} className="text-slate-400" />
           </div>
           <div>
             <h4 className="text-sm font-black text-slate-900 dark:text-white">Fonte: PokéAPI & Nintendo</h4>
             <p className="text-xs font-bold text-slate-500">Exibindo artes originais redimensionadas para alta fidelidade.</p>
           </div>
        </div>
      </div>
      
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
