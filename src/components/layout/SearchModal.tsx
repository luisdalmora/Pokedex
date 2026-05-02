"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, ArrowRight } from "lucide-react";
import { getPokemonList } from "@/services/pokeapi";
import { SafeImage } from "@/components/ui/SafeImage";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [allPokemon, setAllPokemon] = useState<any[]>([]);

  useEffect(() => {
    async function loadAll() {
      const list = await getPokemonList(1000, 0);
      setAllPokemon(list);
    }
    if (isOpen) {
      loadAll();
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const filtered = allPokemon.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    setResults(filtered);
  }, [query, allPokemon]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm"
          />
        )}
        {isOpen && (
          <motion.div
            key="search-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <Search className="text-rose-500" size={24} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Qual Pokémon você está procurando?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xl font-black text-slate-900 dark:text-white placeholder:text-slate-300"
                />
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-4">
                 {results.length > 0 ? (
                   <div className="grid grid-cols-1 gap-2">
                     {results.map((p) => {
                       const id = p.url.split('/').filter(Boolean).pop();
                       return (
                         <Link
                           key={p.name || id}
                           href={`/pokemon/${id}`}
                           onClick={onClose}
                           className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 group transition-all"
                         >
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                 <SafeImage 
                                   src={getBestAvailableSprite(id)} 
                                   className="w-full h-full object-contain"
                                   alt={p.name}
                                 />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{String(id).padStart(3, '0')}</p>
                                 <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize group-hover:text-rose-600 transition-colors">{p.name}</h4>
                              </div>
                           </div>
                           <ArrowRight className="text-slate-200 group-hover:text-rose-500 transition-colors" size={20} />
                         </Link>
                       );
                     })}
                   </div>
                 ) : query ? (
                   <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <X className="text-slate-300" size={32} />
                      </div>
                      <p className="text-slate-400 font-bold">Nenhum Pokémon encontrado para "{query}"</p>
                   </div>
                 ) : (
                   <div className="py-20 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Command size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Dica de Busca</span>
                      </div>
                      <p className="font-bold max-w-xs mx-auto">Digite o nome do Pokémon para ver os resultados instantâneos.</p>
                   </div>
                 )}
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PokéHub Search v1.0</p>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-300 uppercase">ESC para fechar</span>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
