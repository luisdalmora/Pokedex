"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PokedexLed } from "./PokedexLed";

interface KantoPokedexShellProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  isOpen?: boolean;
}

export const KantoPokedexShell: React.FC<KantoPokedexShellProps> = ({ 
  children, 
  rightPanel,
  isOpen = true
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full bg-[#1e1e1e] p-4 lg:p-10 font-sans">
      <div className="relative flex flex-col lg:flex-row drop-shadow-2xl max-w-7xl w-full">
        
        {/* Lado Esquerdo (Principal) */}
        <div className="bg-[var(--color-pokedex-red)] rounded-t-3xl rounded-bl-3xl rounded-br-md lg:rounded-l-3xl lg:rounded-r-none border-b-8 border-r-8 border-b-[var(--color-pokedex-dark-red)] border-r-[var(--color-pokedex-dark-red)] w-full lg:w-1/2 min-h-[650px] lg:h-[800px] flex flex-col relative z-20">
          
          {/* Top Header */}
          <div className="flex px-6 pt-6 pb-4 border-b-4 border-[var(--color-pokedex-dark-red)] relative before:absolute before:bottom-[-4px] before:left-0 before:w-1/2 before:h-8 before:border-b-4 before:border-r-4 before:border-[var(--color-pokedex-dark-red)] before:rounded-br-[40px] before:bg-[var(--color-pokedex-red)]">
            <div className="flex items-center gap-4 relative z-10">
              {/* Lente Principal */}
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner border-4 border-white/20">
                <PokedexLed size="large" color="blue" glow />
              </div>
              
              {/* Leds menores */}
              <div className="flex gap-2 mb-8">
                <PokedexLed size="small" color="red" />
                <PokedexLed size="small" color="yellow" />
                <PokedexLed size="small" color="green" />
              </div>
            </div>
          </div>

          {/* Tela e Controles Inferiores */}
          <div className="flex-1 flex flex-col p-6 mt-6">
            {/* O Container da Tela */}
            <div className="bg-white rounded-t-xl rounded-bl-xl rounded-br-[40px] p-6 mb-6 shadow-inner border-4 border-[#e0e0e0] flex-1 flex flex-col">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--color-pokedex-red)]"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-pokedex-red)]"></div>
              </div>
              
              {/* A Tela em Si */}
              <div className="bg-[var(--color-pokedex-black)] p-4 rounded-lg flex-1 overflow-hidden relative border-4 border-[var(--color-pokedex-screen-border)]">
                <div className="absolute inset-0 bg-[var(--color-pokedex-screen-bg)] overflow-hidden scanline-effect screen-glare">
                  {children}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="w-4 h-4 rounded-full bg-[var(--color-pokedex-red)] border-2 border-[var(--color-pokedex-dark-red)]"></div>
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-1 bg-[var(--color-pokedex-black)]"></div>
                  <div className="w-8 h-1 bg-[var(--color-pokedex-black)]"></div>
                  <div className="w-8 h-1 bg-[var(--color-pokedex-black)]"></div>
                </div>
              </div>
            </div>

            {/* Controles de baixo (D-Pad, Botão Preto, etc) */}
            <div className="flex justify-between items-start px-2">
              <div className="w-12 h-12 rounded-full bg-[var(--color-pokedex-black)] shadow-md border-b-4 border-gray-900"></div>
              <div className="flex gap-4 mt-4">
                <div className="w-16 h-3 rounded-full bg-[var(--color-pokedex-red)] border-2 border-[var(--color-pokedex-dark-red)]"></div>
                <div className="w-16 h-3 rounded-full bg-[var(--color-pokedex-blue)] border-2 border-[var(--color-pokedex-dark-red)]"></div>
              </div>
              
              {/* D-Pad Simplificado */}
              <div className="relative w-24 h-24">
                <div className="absolute top-1/3 left-0 w-full h-1/3 bg-[var(--color-pokedex-black)] rounded-sm border-b-4 border-gray-900 shadow-md"></div>
                <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[var(--color-pokedex-black)] rounded-sm border-b-4 border-gray-900 shadow-md"></div>
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-[#111] z-10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito (Painel de Detalhes) */}
        {isOpen && rightPanel && (
          <div className="bg-[var(--color-pokedex-red)] rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none border-b-8 border-r-8 border-b-[var(--color-pokedex-dark-red)] border-r-[var(--color-pokedex-dark-red)] w-full lg:w-1/2 min-h-[500px] lg:h-[700px] mt-0 lg:mt-12 p-8 flex flex-col relative z-10 transform origin-left">
            <div className="bg-[var(--color-pokedex-black)] flex-1 rounded-xl p-4 shadow-inner border-4 border-[#333] relative overflow-hidden text-white">
              {rightPanel}
            </div>
            
            {/* Botões Azuis da Grade */}
            <div className="grid grid-cols-5 gap-2 mt-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-[var(--color-pokedex-blue)] rounded shadow-sm border-b-4 border-blue-800"></div>
              ))}
            </div>

            <div className="flex justify-between items-end mt-8">
              <div className="flex gap-4">
                <div className="w-12 h-3 rounded-full bg-white border-b-2 border-gray-400"></div>
                <div className="w-12 h-3 rounded-full bg-white border-b-2 border-gray-400"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-pokedex-yellow)] border-b-4 border-yellow-700 shadow-md"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
