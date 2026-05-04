"use client";

import React, { useState } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokedexOSBoot } from "@/components/pokedex-os/PokedexOSBoot";
import { PokedexOSPanel } from "@/components/pokedex-os/PokedexOSPanel";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

export default function HomePage() {
  const [booted, setBooted] = useState(false);
  const [heroSprite, setHeroSprite] = useState<string | null>(null);
  const [randomId, setRandomId] = useState<number | null>(null);

  React.useEffect(() => {
    if (booted) {
      const rid = Math.floor(Math.random() * 151) + 1; // Keep it classic for Kanto Scanner hero
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroSprite(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${rid}.png`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRandomId(Math.floor(Math.random() * 1025) + 1);
    }
  }, [booted]);

  if (!booted) {
    return (
      <div className="h-screen w-full bg-black p-4 md:p-12">
        <PokedexOSBoot onComplete={() => setBooted(true)} />
      </div>
    );
  }

  return (
    <PokedexOSLayout moduleName="MAIN MENU" status="ONLINE">
      <div className="flex flex-col gap-4 h-full overflow-y-auto os-scroll pb-4 pr-2">
        
        {/* Main Hero Panel */}
        <PokedexOSPanel variant="screen" className="flex-shrink-0">
          <div className="flex flex-col md:flex-row items-center gap-6 p-4">
            <div className="w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center">
              {heroSprite ? (
                <SafeImage src={heroSprite} alt="Random Pokemon" width={192} height={192} className="drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
              )}
              {/* Replace placeholder-pokeball with something dynamic or a simple CSS shape if we don't have it */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full mix-blend-screen"></div>
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                POKÉDEX OS
              </h2>
              <div className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
                Kanto Scanner Edition
              </div>
              <p className="text-slate-400 text-xs md:text-sm max-w-md">
                Bem-vindo ao sistema de banco de dados do Prof. Oak. Escolha um módulo abaixo para começar a análise de registros Pokémon.
              </p>
            </div>
          </div>
        </PokedexOSPanel>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link href="/pokedex" className="group">
            <PokedexOSPanel className="h-full hover:bg-slate-800 transition-colors border-slate-700 hover:border-cyan-500 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold tracking-widest text-sm group-hover:text-cyan-400">NATIONAL DEX</h3>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-slate-400 text-xs">Banco de dados completo contendo 1025+ registros confirmados.</p>
            </PokedexOSPanel>
          </Link>

          <Link href="/regions/kanto" className="group">
            <PokedexOSPanel className="h-full hover:bg-slate-800 transition-colors border-slate-700 hover:border-red-500 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold tracking-widest text-sm group-hover:text-red-400">KANTO SCANNER</h3>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <p className="text-slate-400 text-xs">Interface histórica de primeira geração. Registros #001 a #151.</p>
            </PokedexOSPanel>
          </Link>

          <Link href="/regions" className="group">
            <PokedexOSPanel className="h-full hover:bg-slate-800 transition-colors border-slate-700 hover:border-emerald-500 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold tracking-widest text-sm group-hover:text-emerald-400">REGIONS</h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <p className="text-slate-400 text-xs">Mapeamento geográfico de todas as 9 regiões conhecidas.</p>
            </PokedexOSPanel>
          </Link>

          <Link href="/games" className="group">
            <PokedexOSPanel className="h-full hover:bg-slate-800 transition-colors border-slate-700 hover:border-yellow-500 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold tracking-widest text-sm group-hover:text-yellow-400">GAMES TIMELINE</h3>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              </div>
              <p className="text-slate-400 text-xs">Histórico de versões do sistema, de Red/Blue até Scarlet/Violet.</p>
            </PokedexOSPanel>
          </Link>

          <Link href="/favorites" className="group">
            <PokedexOSPanel className="h-full hover:bg-slate-800 transition-colors border-slate-700 hover:border-pink-500 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold tracking-widest text-sm group-hover:text-pink-400">FAVORITES</h3>
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              </div>
              <p className="text-slate-400 text-xs">Acesse rapidamente seus registros favoritados no armazenamento local.</p>
            </PokedexOSPanel>
          </Link>

          <Link href={randomId ? `/pokemon/${randomId}` : "#"} className="group">
            <PokedexOSPanel className="h-full bg-slate-900 hover:bg-slate-800 transition-colors border-cyan-900 hover:border-cyan-400 cursor-pointer">
              <div className="flex items-center justify-center h-full">
                <span className="text-cyan-500 font-bold tracking-widest text-sm group-hover:text-cyan-300">
                  + RANDOM SCAN
                </span>
              </div>
            </PokedexOSPanel>
          </Link>

        </div>

        {/* System Status Panel */}
        <PokedexOSPanel title="System Diagnostics" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10px] md:text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 mb-1">API CONNECTION</span>
              <span className="text-green-400">SECURE [pokeapi.co]</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">LOCAL STORAGE</span>
              <span className="text-green-400">MOUNTED</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">SPRITE ENGINE</span>
              <span className="text-green-400">v3.0 ONLINE</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">TOTAL RECORDS</span>
              <span className="text-cyan-400">1025+ VALIDATED</span>
            </div>
          </div>
        </PokedexOSPanel>

      </div>
    </PokedexOSLayout>
  );
}
