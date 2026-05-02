import React from "react";
import { getTypeColor } from "@/lib/constants/type-colors";
import { TYPE_TRANSLATIONS } from "@/lib/constants/translations";
import { twMerge } from "tailwind-merge";

interface PokemonTypeBadgesProps {
  types: string[];
  className?: string;
  size?: "sm" | "md";
}

export const PokemonTypeBadges: React.FC<PokemonTypeBadgesProps> = ({ 
  types, 
  className,
  size = "sm"
}) => {
  return (
    <div className={twMerge("flex flex-wrap gap-2", className)}>
      {types.map((type) => {
        const color = getTypeColor(type);
        const name = TYPE_TRANSLATIONS[type.toLowerCase()] || type;
        
        return (
          <span
            key={type}
            className={twMerge(
              "px-3 rounded text-white font-bold tracking-wide shadow border border-black/20",
              size === "sm" ? "py-1 text-[10px] uppercase" : "py-1.5 text-xs uppercase"
            )}
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
};
