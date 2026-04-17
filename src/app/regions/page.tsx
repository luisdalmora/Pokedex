import Link from "next/link";
import { Map } from "lucide-react";

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

export default function RegionsPage() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Regiões do Mundo</h1>
        <p className="text-slate-500 font-bold max-w-2xl">
          Do continente de Kanto às vastas terras de Paldea, cada região guarda seus próprios segredos, lendas e ecossistemas únicos.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {regions.map((region) => (
          <Link 
            key={region.slug} 
            href={`/regions/${region.slug}`} 
            className="group relative overflow-hidden rounded-[2.5rem] aspect-[16/10] flex flex-col justify-end bg-slate-900 transition-all hover:shadow-2xl hover:shadow-rose-600/10 border border-slate-200 dark:border-slate-800"
          >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-all duration-700">
              <img 
                src={`/images/regions/${region.slug}.png`} 
                alt={region.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-2 text-rose-500 mb-2">
                <Map size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{region.count} Pokémon Nativos</span>
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter">{region.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
