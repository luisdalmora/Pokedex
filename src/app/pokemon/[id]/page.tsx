import React from "react";
import Link from "next/link";
import { KantoPokedexShell } from "@/components/device/KantoPokedexShell";
import { PokedexScreen } from "@/components/device/PokedexScreen";
import { PokemonDetailPanel } from "@/components/pokemon/PokemonDetailPanel";
import { PokemonService } from "@/lib/pokemon/pokemon.service";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { resolvePokemonSprite } from "@/lib/sprites/sprite-engine";
import { PokeApiClient } from "@/lib/pokeapi/client";
import { ENDPOINTS } from "@/lib/pokeapi/endpoints";

export default async function PokemonPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  let pokemonDetail = null;
  let rawPokemonData = null;
  let spriteResult = null;

  try {
    pokemonDetail = await PokemonService.getPokemonDetail(id);
    rawPokemonData = await PokeApiClient.fetch<any>(ENDPOINTS.pokemon(id));
    
    // Testando o Sprite Engine
    spriteResult = resolvePokemonSprite({
      pokemon: rawPokemonData,
      originGeneration: pokemonDetail.generation || 1,
      mode: "origin-generation", // Forçando Kanto mode
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do pokemon", error);
  }

  const spriteToUse = spriteResult?.url || pokemonDetail?.sprites.main;
  const isKantoSprite = spriteResult?.generation === 1;

  return (
    <KantoPokedexShell
      isOpen={true}
      rightPanel={
        <PokemonDetailPanel pokemon={pokemonDetail} />
      }
    >
      <PokedexScreen>
        <div className="flex justify-between items-center mb-4 border-b-2 border-black/10 pb-2">
          <Link href="/pokedex">
            <button className="flex items-center gap-1 font-pixel text-[10px] hover:opacity-70 transition-opacity">
              <ChevronLeft size={16} /> VOLTAR
            </button>
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 font-pixel text-[10px] hover:text-[var(--color-pokedex-blue)] transition-colors">
              <Star size={14} /> SALVAR
            </button>
          </div>
        </div>

        {!pokemonDetail ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <p className="font-pixel text-[10px]">ERRO DE LEITURA<br/>DADOS CORROMPIDOS</p>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-8">
            <div className="relative w-48 h-48 mb-8 flex justify-center items-center">
              {/* Círculo de fundo estilizado */}
              <div className="absolute inset-0 bg-white/40 rounded-full border-4 border-black/10"></div>
              
              {/* Efeito de scanline específico para a imagem */}
              <div className="absolute inset-0 rounded-full overflow-hidden z-10 pointer-events-none">
                <div className="w-full h-1 bg-[var(--color-pokedex-blue-glow)]/50 animate-scanline"></div>
              </div>

              {spriteToUse ? (
                <img 
                  src={spriteToUse} 
                  alt={pokemonDetail.name} 
                  className={`relative z-20 object-contain drop-shadow-xl ${isKantoSprite ? 'w-40 h-40 rendering-pixelated' : 'w-full h-full'}`}
                  style={{ imageRendering: isKantoSprite ? "pixelated" : "auto" }}
                />
              ) : (
                <span className="font-pixel text-[10px] text-gray-500 z-20">SEM SINAL</span>
              )}
            </div>

            <div className="flex gap-4 mb-8 w-full px-8">
              <Link href={`/pokemon/${Math.max(1, pokemonDetail.id - 1)}`} className="flex-1">
                <button className="w-full bg-black/10 border-2 border-black/30 py-2 rounded flex justify-center hover:bg-black/20 transition-colors">
                  <ChevronLeft size={20} />
                </button>
              </Link>
              
              <Link href={`/pokemon/${pokemonDetail.id + 1}`} className="flex-1">
                <button className="w-full bg-black/10 border-2 border-black/30 py-2 rounded flex justify-center hover:bg-black/20 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </Link>
            </div>

            <div className="bg-black/5 rounded-lg p-4 w-full border border-black/10">
              <h3 className="font-pixel text-[10px] text-gray-600 mb-2 border-b border-black/10 pb-1">SISTEMA DE ANÁLISE</h3>
              <p className="text-sm">
                Espécie registrada no banco de dados. 
                {isKantoSprite && " Sprite otimizado para exibição clássica Gen I."}
              </p>
            </div>
          </div>
        )}
      </PokedexScreen>
    </KantoPokedexShell>
  );
}
