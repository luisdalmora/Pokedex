import React from "react";
import { twMerge } from "tailwind-merge";

interface PokedexScreenProps {
  children: React.ReactNode;
  className?: string;
  isScanning?: boolean;
}

export const PokedexScreen: React.FC<PokedexScreenProps> = ({ 
  children, 
  className,
  isScanning = false
}) => {
  return (
    <div className={twMerge("h-full w-full relative", className)}>
      {/* O conteúdo real da tela */}
      <div className="absolute inset-0 z-10 pokedex-scroll overflow-y-auto overflow-x-hidden p-4">
        {children}
      </div>

      {/* Efeito de Scanline */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="w-full h-4 bg-white/30 blur-[2px] animate-scanline"></div>
        </div>
      )}
    </div>
  );
};
