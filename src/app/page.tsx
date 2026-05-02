"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { Database, Search, Map as MapIcon, Gamepad2, Shuffle } from "lucide-react";

export default function HomePage() {
  const [isOn, setIsOn] = useState(false);

  if (!isOn) {
    return (
      <KantoPokedexShell isOpen={false}>
        <div className="h-full w-full flex flex-col items-center justify-center bg-black rounded-lg">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOn(true)}
            className="w-24 h-24 rounded-full bg-blue-500 border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] text-white font-bold font-pixel text-xs animate-pulse flex items-center justify-center"
          >
            LIGAR
          </motion.button>
        </div>
      </KantoPokedexShell>
    );
  }

  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <div className="h-full flex flex-col justify-center items-center text-center p-4">
          <Database size={48} className="mb-4 text-gray-400" />
          <h2 className="font-pixel text-xl mb-4">SISTEMA POKÉDEX</h2>
          <p className="font-pixel text-[10px] text-gray-400 leading-relaxed max-w-xs">
            Bem-vindo à Enciclopédia Pokémon Premium Edition.
            <br /><br />
            Dados fornecidos por PokeAPI.
            <br />
            Sprites originais incluídos.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-700 w-full">
            <p className="font-pixel text-[10px] text-[var(--color-pokedex-blue-glow)]">MODO KANTO ATIVO</p>
          </div>
        </div>
      }
    >
      <PokedexScreen isScanning className="flex flex-col h-full bg-[var(--color-pokedex-screen-bg)] text-[#1a1a1a]">
        <div className="text-center mb-8 mt-4">
          <h1 className="font-pixel text-2xl mb-2 drop-shadow-md">POKÉDEX</h1>
          <p className="font-pixel text-[10px] opacity-70">v. Premium Kanto</p>
        </div>

        <div className="grid grid-cols-1 gap-4 flex-1 content-center px-4 max-w-sm mx-auto w-full">
          <Link href="/pokedex">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black/10 hover:bg-black/20 border-2 border-black/30 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors"
            >
              <div className="bg-[var(--color-pokedex-red)] p-2 rounded-full shadow-inner border border-black/20">
                <Search size={20} className="text-white" />
              </div>
              <span className="font-pixel text-xs font-bold">Abrir Pokédex</span>
            </motion.div>
          </Link>

          <Link href="/regions/kanto">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black/10 hover:bg-black/20 border-2 border-black/30 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors"
            >
              <div className="bg-green-600 p-2 rounded-full shadow-inner border border-black/20">
                <MapIcon size={20} className="text-white" />
              </div>
              <span className="font-pixel text-xs font-bold">Explorar Kanto</span>
            </motion.div>
          </Link>

          <Link href={`/pokemon/${Math.floor(Math.random() * 898) + 1}`}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black/10 hover:bg-black/20 border-2 border-black/30 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors"
            >
              <div className="bg-yellow-500 p-2 rounded-full shadow-inner border border-black/20">
                <Shuffle size={20} className="text-white" />
              </div>
              <span className="font-pixel text-xs font-bold">Pokémon Aleatório</span>
            </motion.div>
          </Link>

          <Link href="/games">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black/10 hover:bg-black/20 border-2 border-black/30 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors"
            >
              <div className="bg-purple-600 p-2 rounded-full shadow-inner border border-black/20">
                <Gamepad2 size={20} className="text-white" />
              </div>
              <span className="font-pixel text-xs font-bold">Jogos & Consoles</span>
            </motion.div>
          </Link>
        </div>
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
