import gamesRegistry from "@/data/games_registry.json";
import { getLocalGymLeaders, getLocalExclusives } from "@/services/localData";
import { getOfficialArtwork } from "@/utils/spriteResolver";
import { ChevronLeft, Trophy, Swords, Sparkles, Monitor, Calendar } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Find game in registry
  let currentGame: any = null;
  let regionId = "";
  
  gamesRegistry.regions.forEach(r => {
    r.generations.forEach(gen => {
      const game = gen.games.find(g => g.id === id);
      if (game) {
        currentGame = game;
        regionId = r.id;
      }
    });
  });

  if (!currentGame) notFound();

  const leaders = await getLocalGymLeaders(regionId);
  const exclusives = await getLocalExclusives(id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="h-[30vh] lg:h-[40vh] bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 grayscale blur-sm">
          <img src="/images/backgrounds/hero-bg.png" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-between py-12 relative z-10">
          <Link href="/games" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold transition-all">
            <ChevronLeft size={20} /> Voltar para Biblioteca
          </Link>
          
          <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="w-32 h-44 lg:w-48 lg:h-64 rounded-2xl bg-white shadow-2xl overflow-hidden border-4 border-white shrink-0 -mb-20 hidden md:block">
               <SafeImage 
                 src={`https://img.pokemondb.net/boxes/${id.replace('lets-go-pikachu', 'lets-go-pikachu-switch').replace('lets-go-eevee', 'lets-go-eevee-switch')}.jpg`} 
                 className="w-full h-full object-cover"
                 alt={currentGame.name}
               />
            </div>
            <div className="flex-1 pb-4">
               <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {currentGame.platform}
                 </span>
                 <span className="text-white/60 text-sm font-bold">Lançado em {currentGame.year}</span>
               </div>
               <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter capitalize">{currentGame.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-32 lg:mt-40 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Summary */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Visão Geral</h2>
            <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed text-lg italic">
              "{currentGame.desc || "Uma aventura emocionante pela região, repleta de mistérios e novos amigos Pokémon."}"
            </p>
          </section>

          {/* Exclusives */}
          {exclusives && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-500" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pokémon Exclusivos</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[exclusives.version1, exclusives.version2].map((version, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                    <h3 className="text-center font-black text-slate-400 uppercase tracking-widest text-[10px] mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                      Exclusivos {version.name}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {version.pokemon.map(name => (
                        <div key={name} className="flex flex-col items-center group cursor-pointer" title={name}>
                          <img src={`https://img.pokemondb.net/sprites/items/poke-ball.png`} className="hidden" /> {/* prefetch helper if needed */}
                          <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-2 group-hover:bg-slate-100 transition-colors">
                             <img src={`https://img.pokemondb.net/sprites/home/normal/${name.toLowerCase()}.png`} className="w-full h-full object-contain" alt={name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Leaders */}
          {leaders.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Trophy className="text-rose-600" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Líderes de Ginásio</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {leaders.map(leader => (
                  <div key={leader.name} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6 group hover:border-rose-500 transition-colors">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 grayscale group-hover:grayscale-0 transition-all">
                       <SafeImage 
                         src={`/images/leaders/${leader.image}`} 
                         className="w-full h-full object-cover" 
                         alt={leader.name}
                       />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 dark:text-white capitalize">{leader.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{leader.role}</p>
                      <div className="flex gap-1 mt-2">
                        {leader.pokemon?.map(p => (
                          <div key={p} className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 p-0.5" title={p}>
                            <img src={`https://img.pokemondb.net/sprites/home/normal/${p.toLowerCase().replace(/ /g, '-')}.png`} className="w-full h-full object-contain" alt={p}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] space-y-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Monitor size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Plataforma</p>
                  <p className="text-xl font-black">{currentGame.platform}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 border-t border-white/10 pt-6">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Calendar size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Lançamento</p>
                  <p className="text-xl font-black">{currentGame.year}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 border-t border-white/10 pt-6">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Swords size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Ranking Regional</p>
                  <p className="text-xl font-black">{regionId === 'kanto' ? 'Geração I' : regionId.toUpperCase()}</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
