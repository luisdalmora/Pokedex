"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { ChevronLeft, Map as MapIcon } from "lucide-react";
import regionsData from "@/data/region_registry.json";

export default function RegionsPage() {
  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <div className="h-full flex flex-col p-4 justify-center items-center text-center">
          <MapIcon size={48} className="mb-4 text-gray-400" />
          <h2 className="font-pixel text-xl mb-4">MAPA MUNDI</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Selecione uma região para acessar o banco de dados regional e informações de líderes de ginásio.
          </p>
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
          <h1 className="font-pixel text-sm">REGIÕES</h1>
        </div>

        <div className="flex flex-col gap-4 pb-10">
          {regionsData.map((region) => (
            <Link key={region.id} href={region.id === "kanto" ? "/regions/kanto" : `/regions/${region.id}`}>
              <div className="bg-white/80 backdrop-blur border-4 border-gray-400 hover:border-gray-600 rounded-lg p-4 cursor-pointer transition-all hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-pixel text-sm uppercase">{region.name}</h2>
                  <span className="font-pixel text-[8px] bg-gray-200 px-2 py-1 rounded">GEN {region.generation}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{region.description}</p>
                <div className="font-pixel text-[8px] text-gray-500">
                  POKÉMON: #{region.pokemonRange}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
