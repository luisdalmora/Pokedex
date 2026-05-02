import React from "react";
import { PokemonDetailViewModel } from "@/types/view-models";
import { PokemonStats } from "./PokemonStats";
import { PokemonTypeBadges } from "./PokemonTypeBadges";

interface PokemonDetailPanelProps {
  pokemon: PokemonDetailViewModel | null;
  isLoading?: boolean;
}

export const PokemonDetailPanel: React.FC<PokemonDetailPanelProps> = ({ 
  pokemon, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-pulse">
        <div className="w-16 h-16 border-4 border-[var(--color-pokedex-blue)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-pixel text-[10px] text-gray-400">CARREGANDO DADOS...</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-pixel text-[10px] text-gray-500 text-center leading-relaxed">
          NENHUM POKÉMON<br/>SELECIONADO
        </p>
      </div>
    );
  }

  const formattedId = pokemon.id.toString().padStart(3, "0");

  return (
    <div className="h-full flex flex-col pokedex-scroll overflow-y-auto pr-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-pixel text-xl uppercase mb-1">{pokemon.name}</h2>
          <p className="font-pixel text-xs text-gray-400">Nº {formattedId}</p>
        </div>
        <PokemonTypeBadges types={pokemon.types} />
      </div>

      <div className="bg-[#111] border-2 border-gray-700 rounded p-4 mb-6">
        <p className="text-sm text-gray-300 leading-relaxed min-h-[60px]">
          {pokemon.description || "Descrição não disponível."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111] border border-gray-700 rounded p-3">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Altura</p>
          <p className="font-pixel text-[10px]">{pokemon.height} m</p>
        </div>
        <div className="bg-[#111] border border-gray-700 rounded p-3">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Peso</p>
          <p className="font-pixel text-[10px]">{pokemon.weight} kg</p>
        </div>
        <div className="bg-[#111] border border-gray-700 rounded p-3 col-span-2">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Habilidades</p>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <span 
                key={ability.name} 
                className={`text-xs capitalize px-2 py-1 rounded bg-gray-800 border ${ability.isHidden ? 'border-yellow-600 text-yellow-500' : 'border-gray-600'}`}
              >
                {ability.name.replace("-", " ")} {ability.isHidden && "(Oculta)"}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-pixel text-[10px] text-gray-400 mb-4 border-b border-gray-700 pb-2">Status Base</h3>
        <PokemonStats stats={pokemon.stats} />
      </div>
      
    </div>
  );
};
