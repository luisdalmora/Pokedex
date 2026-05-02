import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PokemonCardViewModel } from "@/types/view-models";
import { PokemonTypeBadges } from "./PokemonTypeBadges";

interface PokemonCardProps {
  pokemon: PokemonCardViewModel;
  index: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, index }) => {
  const formattedId = pokemon.id.toString().padStart(3, "0");

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/90 backdrop-blur border-4 border-gray-300 rounded-lg p-3 shadow-md flex flex-col items-center cursor-pointer group relative overflow-hidden h-full"
      >
        <div className="absolute top-2 left-2 font-pixel text-[10px] text-gray-400">
          #{formattedId}
        </div>
        
        <div className="w-24 h-24 mt-4 mb-2 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gray-200 rounded-full opacity-50 group-hover:bg-blue-100 transition-colors"></div>
          {pokemon.spriteUrl ? (
            <img 
              src={pokemon.spriteUrl} 
              alt={pokemon.name}
              className="w-full h-full object-contain relative z-10 drop-shadow-md group-hover:scale-110 transition-transform"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-xs text-center">Sem Imagem</div>
          )}
        </div>

        <h3 className="font-bold text-gray-800 capitalize mb-2 truncate w-full text-center">
          {pokemon.name}
        </h3>

        <PokemonTypeBadges types={pokemon.types} className="justify-center mt-auto" />
      </motion.div>
    </Link>
  );
};
