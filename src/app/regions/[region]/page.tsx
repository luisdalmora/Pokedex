"use client";

import React, { use } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokedexOSPanel } from "@/components/pokedex-os/PokedexOSPanel";
import { ErrorState } from "@/components/ui/States";
import { RegionViewModel } from "@/types/view-models";
import regionData from "@/data/region_registry.json";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DataRow = ({ label, value }: { label: string, value: string | number | React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-800">
    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
    <span className="text-xs text-white font-mono uppercase text-right">{value || "--"}</span>
  </div>
);

export default function RegionDetailPage({ params }: { params: Promise<{ region: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const regionInfo = (regionData as RegionViewModel[]).find(r => r.slug === resolvedParams.region);

  if (!regionInfo) {
    return (
      <PokedexOSLayout moduleName="ERROR" status="ERROR">
        <ErrorState message="DADOS GEOGRÁFICOS NÃO ENCONTRADOS." />
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
            onClick={() => router.push('/regions')}
            className="w-full mt-4 p-2 border border-slate-700 bg-slate-900 rounded text-xs font-bold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors uppercase"
         >
             &lt; Mapa Global
         </button>
      </PokedexOSPanel>
    </div>
  );

  return (
    <PokedexOSLayout 
      moduleName={`REGION // ${regionInfo.name.toUpperCase()}`} 
      rightPanel={RightPanel}
      itemsCount={1}
    >
      <div className="h-full flex flex-col p-2 overflow-y-auto os-scroll w-full max-w-2xl mx-auto">
        
        <PokedexOSPanel variant="screen" className="mb-4 border-emerald-900">
            <div className="flex flex-col gap-4 p-2">
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-black italic uppercase tracking-widest text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                        {regionInfo.name}
                    </h2>
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500">
                        GEN {regionInfo.generation}
                    </span>
                </div>
                
                <div className="bg-slate-900/80 p-4 rounded border border-emerald-900/50 italic text-slate-300 text-sm leading-relaxed font-mono">
                    &ldquo;{regionInfo.description}&rdquo;
                </div>
            </div>
        </PokedexOSPanel>

        <PokedexOSPanel className="flex-1">
            <h3 className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-800 pb-1">
                Dados Demográficos e Biológicos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                    <DataRow label="Faixa de Registros" value={regionInfo.pokemonRange} />
                    <DataRow label="Espécies Iniciais" value={regionInfo.starters.join(", ")} />
                </div>
                <div>
                    <DataRow label="Espécies Lendárias" value={regionInfo.legendaries.join(", ")} />
                    <DataRow label="Softwares Relacionados" value={regionInfo.mainGames.join(", ")} />
                </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
               <p className="text-yellow-500 text-[10px] font-mono text-center uppercase">
                  Módulo de Scanner Regional avançado disponível apenas para a região de Kanto no momento.
               </p>
               <div className="flex justify-center mt-2">
                 <Link href="/pokedex" className="text-cyan-400 text-xs font-bold hover:underline uppercase">
                   Ir para National Dex &gt;
                 </Link>
               </div>
            </div>
        </PokedexOSPanel>

      </div>
    </PokedexOSLayout>
  );
}
