"use client";

import { Search, Map, Gamepad2, Database, Dices, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

const regions = [
  { name: 'Kanto', count: 151, slug: 'kanto', color: 'bg-rose-500' },
  { name: 'Johto', count: 100, slug: 'johto', color: 'bg-emerald-500' },
  { name: 'Hoenn', count: 135, slug: 'hoenn', color: 'bg-sky-500' },
  { name: 'Sinnoh', count: 107, slug: 'sinnoh', color: 'bg-indigo-500' },
  { name: 'Unova', count: 156, slug: 'unova', color: 'bg-neutral-600' },
  { name: 'Kalos', count: 72, slug: 'kalos', color: 'bg-pink-500' },
  { name: 'Alola', count: 88, slug: 'alola', color: 'bg-orange-500' },
  { name: 'Galar', count: 81, slug: 'galar', color: 'bg-cyan-500' },
  { name: 'Paldea', count: 103, slug: 'paldea', color: 'bg-purple-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        title="Encontre Seu Próximo Pokémon."
        subtitle="Dados precisos, stats reais e cadeias evolutivas completas em um só lugar."
        pill="A Nova Era Pokédex"
        actions={[
          { label: "Explorar Agora", href: "/pokedex", primary: true },
          { label: "Pesquisar", href: "/pokedex", icon: Search }
        ]}
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 space-y-12 -mt-16 relative z-20">
        {/* Stats / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Database size={32} />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">1025</span>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Pokémon Registrados</p>
            </div>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Gamepad2 size={32} />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">9</span>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Gerações Ativas</p>
            </div>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Map size={32} />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">10</span>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Regiões Mapeadas</p>
            </div>
          </div>
        </div>

        {/* Regions Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Navegar por Região</h2>
              <p className="text-slate-500 font-bold">Pokémon nativos de cada parte do mundo.</p>
            </div>
            <Link href="/regions" className="text-rose-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
              Ver todas <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Link key={region.slug} href={`/regions/${region.slug}`} className="group relative overflow-hidden rounded-[2.5rem] p-8 aspect-video flex flex-col justify-end bg-slate-900 transition-all hover:shadow-2xl hover:shadow-rose-600/10 border border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                  <img src={`/images/regions/${region.slug}.png`} alt={region.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="relative z-10">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{region.count} Pokémon</span>
                  <h3 className="text-4xl font-black text-white tracking-tighter">{region.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
