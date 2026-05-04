"use client";
import React, { useState } from "react";
import { SpriteGallery } from "@/types/view-models";
import { SafeImage } from "../ui/SafeImage";
import { PokedexOSPanel } from "../pokedex-os/PokedexOSPanel";

export function PokemonSpriteGallery({ gallery }: { gallery: SpriteGallery }) {
  const [activeGen, setActiveGen] = useState<string>("officialArtwork");

  const renderGrid = (sprites: { label: string; url: string | null }[]) => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {sprites.map((s, i) => (
          s.url && (
            <div key={i} className="bg-black/50 border border-slate-800 rounded p-2 flex flex-col items-center justify-center">
              <SafeImage src={s.url} alt={s.label} className="w-16 h-16 group-hover:scale-110 transition-transform pixelated" />
              <span className="text-[9px] uppercase text-slate-400 mt-2 text-center">{s.label}</span>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-2 overflow-x-auto os-scroll pb-2 shrink-0">
        <button 
          onClick={() => setActiveGen("officialArtwork")}
          className={`px-3 py-1 text-xs font-bold uppercase rounded border transition-colors whitespace-nowrap ${
            activeGen === "officialArtwork" ? "bg-cyan-900 border-cyan-500 text-cyan-300" : "bg-slate-900 border-slate-700 text-slate-400"
          }`}
        >
          Modernos
        </button>
        {Object.keys(gallery.versions || {}).map(gen => (
          <button 
            key={gen}
            onClick={() => setActiveGen(gen)}
            className={`px-3 py-1 text-xs font-bold uppercase rounded border transition-colors whitespace-nowrap ${
              activeGen === gen ? "bg-cyan-900 border-cyan-500 text-cyan-300" : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            {gen.replace("generation-", "Gen ")}
          </button>
        ))}
      </div>

      <PokedexOSPanel className="flex-1 overflow-y-auto os-scroll">
        {activeGen === "officialArtwork" && (
          <div className="space-y-4">
            {renderGrid([
              { label: "Official Artwork", url: gallery.officialArtwork },
              { label: "HOME", url: gallery.home },
              { label: "Animated", url: gallery.animated },
              { label: "Dream World", url: gallery.dreamWorld }
            ])}
          </div>
        )}

        {activeGen !== "officialArtwork" && gallery.versions?.[activeGen] && (
          <div className="space-y-6">
            {Object.entries(gallery.versions[activeGen]).map(([version, sprites]) => (
              <div key={version} className="border-b border-slate-800 pb-4">
                <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-3">
                  {version.replace(/-/g, " ")}
                </h4>
                {renderGrid([
                  { label: "Normal (Frente)", url: sprites.front },
                  { label: "Shiny (Frente)", url: sprites.shiny },
                  { label: "Normal (Costas)", url: sprites.back },
                  { label: "Shiny (Costas)", url: sprites.backShiny }
                ])}
              </div>
            ))}
          </div>
        )}
      </PokedexOSPanel>
    </div>
  );
}
