"use client";

import React, { useState, useEffect } from "react";
import { getPokedex, getPokemon } from "@/services/pokeapi";
import { SafeImage } from "@/components/ui/SafeImage";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List as ListIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getTypeColor } from "@/utils/pokemonStyles";

interface RegionPokedexProps {
  pokedexId: string | number;
}

export function RegionPokedex({ pokedexId }: RegionPokedexProps) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchPokedex() {
      setLoading(true);
      const data = await getPokedex(pokedexId);
      if (data && data.pokemon_entries) {
        setEntries(data.pokemon_entries);
      }
      setLoading(false);
    }
    fetchPokedex();
  }, [pokedexId]);

  const filteredEntries = entries.filter((entry) => 
    entry.pokemon_species.name.toLowerCase().includes(filter.toLowerCase()) ||
    String(entry.entry_number).includes(filter)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl animate-pulse" />
           ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text"
             placeholder="Buscar na Pokédex Regional..."
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
           />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
           <button 
             onClick={() => setViewMode("grid")}
             className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
           >
             <Grid size={18} />
           </button>
           <button 
             onClick={() => setViewMode("list")}
             className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-700 text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
           >
             <ListIcon size={18} />
           </button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"}>
        <AnimatePresence>
          {filteredEntries.map((entry) => {
            const name = entry.pokemon_species.name;
            const speciesId = entry.pokemon_species.url.split('/').filter(Boolean).pop();
            
            return (
              <motion.div
                key={entry.entry_number}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
                className="group"
              >
                <Link 
                  href={`/pokemon/${speciesId}`}
                  className={`
                    flex ${viewMode === "grid" ? "flex-col" : "flex-row"} 
                    items-center p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 
                    hover:border-rose-400 hover:shadow-xl transition-all duration-300
                  `}
                >
                  <div className={`${viewMode === "grid" ? "w-20 h-20 mb-3" : "w-12 h-12 mr-4"} relative flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2`}>
                    <SafeImage 
                      src={getBestAvailableSprite(speciesId)} 
                      alt={name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className={viewMode === "grid" ? "text-center" : "flex-1 flex items-center justify-between"}>
                    <div>
                      <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                        #{String(entry.entry_number).padStart(3, '0')}
                      </span>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase truncate group-hover:text-rose-600 transition-colors">
                        {name.replace(/-/g, ' ')}
                      </h5>
                    </div>
                    {viewMode === "list" && <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-500" />}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredEntries.length === 0 && (
        <div className="py-20 text-center">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum Pokémon encontrado</p>
        </div>
      )}
    </section>
  );
}
