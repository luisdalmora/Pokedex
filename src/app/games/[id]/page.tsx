"use client";

import React, { use } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokedexOSPanel } from "@/components/pokedex-os/PokedexOSPanel";
import { ErrorState } from "@/components/ui/States";
import { GameViewModel } from "@/types/view-models";
import gamesData from "@/data/games_registry.json";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DataRow = ({ label, value }: { label: string, value: string | number | React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-800">
    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
    <span className="text-xs text-white font-mono uppercase">{value || "--"}</span>
  </div>
);

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const game = (gamesData as GameViewModel[]).find(g => g.id === resolvedParams.id);

  if (!game) {
    return (
      <PokedexOSLayout moduleName="ERROR" status="ERROR">
        <ErrorState message="SOFTWARE NÃO ENCONTRADO NO REGISTRO." />
      </PokedexOSLayout>
    );
  }



  const RightPanel = (
    <div className="flex flex-col gap-4 h-full">
      <PokedexOSPanel className="flex-1 overflow-y-auto os-scroll">
         <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
             System Commands
         </h3>
         <button 
            onClick={() => router.push('/games')}
            className="w-full mt-4 p-2 border border-slate-700 bg-slate-900 rounded text-xs font-bold text-slate-300 hover:border-yellow-500 hover:text-yellow-400 transition-colors uppercase"
         >
             &lt; Voltar para Timeline
         </button>
         
         <div className="mt-8">
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
                Links Relacionados
            </h3>
            <Link href={game.region.toLowerCase() === 'kanto' ? '/regions/kanto' : `/regions/${game.region.toLowerCase()}`} className="block w-full mt-2 p-2 border border-slate-700 bg-slate-900 rounded text-xs font-bold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors uppercase text-center">
                Explorar {game.region}
            </Link>
         </div>
      </PokedexOSPanel>
    </div>
  );

  return (
    <PokedexOSLayout 
      moduleName={`SOFTWARE // ${game.console.toUpperCase()}`} 
      rightPanel={RightPanel}
      itemsCount={1}
    >
      <div className="h-full flex flex-col p-2 overflow-y-auto os-scroll w-full max-w-2xl mx-auto">
        
        <PokedexOSPanel variant="screen" className="mb-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-2">
                <div className="w-32 h-40 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded flex flex-col items-center justify-center shrink-0 relative overflow-hidden group">
                   {game.boxArt ? (
                      <img src={game.boxArt} alt={game.name} className="w-full h-full object-cover" />
                   ) : (
                      <>
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="text-cyan-500/30 text-4xl font-black italic select-none">POKÉ</div>
                        <div className="text-[8px] text-slate-500 font-mono uppercase text-center p-2 mt-2 leading-tight">
                           {game.name}<br/>
                           <span className="text-cyan-600/50">Digital Record</span>
                        </div>
                      </>
                   )}
                </div>
                
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-black italic uppercase tracking-widest text-cyan-400 mb-2">
                            {game.name}
                        </h2>
                        {game.isRemake && (
                            <span className="text-[9px] bg-yellow-500 text-black font-black px-2 py-0.5 rounded uppercase">
                                Remake
                            </span>
                        )}
                    </div>
                    
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-800 italic text-slate-300 text-xs leading-relaxed font-mono mb-4">
                        {game.description}
                    </div>
                </div>
            </div>
        </PokedexOSPanel>

        <PokedexOSPanel className="flex-1">
            <h3 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-800 pb-1">
                Especificações Técnicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                    <DataRow label="Console" value={game.console} />
                    <DataRow label="Ano de Lançamento" value={game.year} />
                    <DataRow label="Geração" value={game.generation} />
                    <DataRow label="Região" value={game.region} />
                    <DataRow label="Motor Gráfico" value={game.spriteVersion} />
                </div>
                <div>
                    <DataRow label="Starters" value={game.starters.join(", ")} />
                    <DataRow label="Lendários Capa" value={game.legendaries.join(", ")} />
                    {game.isRemake && game.originalGame && (
                        <DataRow label="Software Original" value={game.originalGame} />
                    )}
                </div>
            </div>
        </PokedexOSPanel>

      </div>
    </PokedexOSLayout>
  );
}
