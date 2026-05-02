"use client";

import React from "react";
import Link from "next/link";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { ChevronLeft, Gamepad2 } from "lucide-react";
import gamesRegistry from "@/data/games_registry.json";

export default function GamesPage() {
  // Agrupar por geração
  const gamesByGen = gamesRegistry.reduce((acc, game) => {
    if (!acc[game.generation]) acc[game.generation] = [];
    acc[game.generation].push(game);
    return acc;
  }, {} as Record<number, typeof gamesRegistry>);

  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <div className="h-full flex flex-col p-4 justify-center items-center text-center">
          <Gamepad2 size={48} className="mb-4 text-[var(--color-pokedex-blue-glow)]" />
          <h2 className="font-pixel text-xl mb-4 text-[var(--color-pokedex-blue-glow)]">REGISTRO DE JOGOS</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            Explore a linha do tempo dos jogos principais da franquia, organizados por geração e console.
          </p>
          <div className="bg-[#111] p-4 rounded-lg border-2 border-gray-700 w-full">
            <h3 className="font-pixel text-[10px] text-gray-500 mb-2">ESTATÍSTICAS</h3>
            <div className="flex justify-between border-b border-gray-800 pb-2 mb-2">
              <span className="text-xs text-gray-400">Total de Jogos</span>
              <span className="font-pixel text-xs text-white">{gamesRegistry.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Gerações</span>
              <span className="font-pixel text-xs text-white">{Object.keys(gamesByGen).length}</span>
            </div>
          </div>
        </div>
      }
    >
      <PokedexScreen>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--color-pokedex-screen-bg)] z-30 py-2 border-b-2 border-black/10">
          <Link href="/">
            <button className="flex items-center gap-1 font-pixel text-[10px] hover:opacity-70 transition-opacity">
              <ChevronLeft size={16} /> VOLTAR
            </button>
          </Link>
          <h1 className="font-pixel text-sm">LINHA DO TEMPO</h1>
        </div>

        <div className="flex flex-col gap-8 pb-10">
          {Object.entries(gamesByGen).map(([gen, games]) => (
            <div key={gen} className="relative">
              <h2 className="font-pixel text-xs bg-black text-white px-3 py-1 inline-block rounded mb-4">
                GERAÇÃO {gen}
              </h2>
              
              <div className="grid grid-cols-1 gap-4 border-l-2 border-black/20 pl-4 ml-2">
                {games.map((game) => (
                  <div key={game.id} className="bg-white/80 backdrop-blur border-2 border-black/20 rounded p-3 relative hover:scale-[1.01] transition-transform">
                    <div className="absolute -left-[21px] top-4 w-3 h-3 rounded-full bg-[var(--color-pokedex-red)] border-2 border-white"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 leading-tight mb-1">{game.name}</h3>
                        <div className="flex gap-2 text-xs text-gray-500 mb-2">
                          <span>{game.year}</span>
                          <span>•</span>
                          <span className="capitalize">{game.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/10">
                      <span className="text-[10px] font-pixel text-gray-400 uppercase bg-black/5 px-2 py-1 rounded">
                        {game.console}
                      </span>
                      {game.isRemake && (
                        <span className="text-[9px] font-pixel text-orange-500 uppercase border border-orange-200 bg-orange-50 px-1 rounded">
                          Remake
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
