import gamesRegistry from "@/data/games_registry.json";
import { getLocalGymLeaders, getLocalExclusives } from "@/services/localData";
import { getOfficialArtwork } from "@/utils/spriteResolver";
import { getTypeColor } from "@/utils/pokemonStyles";
import { ChevronLeft, Trophy, Swords, Sparkles, Monitor, Calendar, Map, Info, Users, BookOpen } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { TrainerTeam } from "@/components/pokemon/TrainerTeam";
import { RegionPokedex } from "@/components/pokemon/RegionPokedex";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mapping of Game IDs to PokéAPI Pokedex IDs
const POKEDEX_MAP: Record<string, number> = {
  "red": 2, "blue": 2, "yellow": 2, "firered": 2, "leafgreen": 2,
  "gold": 3, "silver": 3, "crystal": 3, "heartgold": 7, "soulsilver": 7,
  "ruby": 4, "sapphire": 4, "emerald": 4, "omega-ruby": 15, "alpha-sapphire": 15,
  "diamond": 5, "pearl": 5, "platinum": 6, "brilliant-diamond": 5, "shining-pearl": 5,
  "black": 8, "white": 8, "black-2": 9, "white-2": 9,
  "x": 12, "y": 12,
  "sun": 16, "moon": 16, "ultra-sun": 21, "ultra-moon": 21,
  "sword": 27, "shield": 27,
  "scarlet": 31, "violet": 31, "legends-arceus": 30
};

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
  const pokedexId = POKEDEX_MAP[id] || 1; // Default to National if not found

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="h-[40vh] lg:h-[50vh] bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 contrast-125">
          <img src="https://images.alphacoders.com/131/1315974.jpeg" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-between py-12 relative z-10">
          <Link href="/games" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-black uppercase tracking-widest text-xs transition-all bg-white/10 backdrop-blur-md px-4 py-2 rounded-full self-start">
            <ChevronLeft size={16} /> Voltar para Biblioteca
          </Link>
          
          <div className="flex flex-col md:flex-row items-end gap-10">
            <div className="w-40 h-56 lg:w-56 lg:h-80 rounded-[2rem] bg-white shadow-2xl overflow-hidden border-8 border-white shrink-0 -mb-20 hidden md:block group">
               <SafeImage 
                 src={`https://img.pokemondb.net/boxes/${id.replace('lets-go-pikachu', 'lets-go-pikachu-switch').replace('lets-go-eevee', 'lets-go-eevee-switch')}.jpg`} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 alt={currentGame.name}
               />
            </div>
            <div className="flex-1 pb-4">
               <div className="flex items-center gap-3 mb-4">
                 <span className="px-4 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-rose-600/30">
                    {currentGame.platform}
                 </span>
                 <span className="text-slate-400 dark:text-white/60 text-sm font-black uppercase tracking-widest">Lançado em {currentGame.year}</span>
               </div>
               <h1 className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 leading-none uppercase">{currentGame.name}</h1>
               <p className="text-rose-500 font-extrabold text-xl lg:text-2xl tracking-tight">Região de {regionId.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-32 lg:mt-48">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Summary Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-12">
               <div className="bg-slate-50 dark:bg-slate-900/50 p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BookOpen size={120} className="text-slate-900 dark:text-white" />
                  </div>
                  <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <Info size={16} /> Visão Geral da Aventura
                  </h2>
                  <p className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                    {currentGame.desc || `Uma jornada épica aguarda na região de ${regionId.charAt(0).toUpperCase() + regionId.slice(1)}, onde grandes descobertas e batalhas inesquecíveis definem o destino dos treinadores.`}
                  </p>
               </div>
            </div>
          </section>

          {/* Region Pokedex */}
          <section className="space-y-12">
             <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                      <Map size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Pokédex de {currentGame.name}</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Explore todos os Pokémon nativos desta região</p>
                   </div>
                </div>
             </div>
             <RegionPokedex pokedexId={pokedexId} />
          </section>

          {/* Exclusives */}
          {exclusives && (
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                    <Sparkles size={24} />
                 </div>
                 <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Pokémon Exclusivos</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Variedades únicas disponíveis apenas nessas versões</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[exclusives.version1, exclusives.version2].map((version, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-8 flex items-center justify-between">
                      Versão {version.name}
                      <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-[10px] text-slate-400">{version.pokemon.length} Pokémon</span>
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {version.pokemon.slice(0, 12).map(name => (
                        <div key={name} className="flex flex-col items-center group/excl" title={name}>
                          <div className="w-full aspect-square bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center p-2 group-hover/excl:shadow-lg transition-all">
                             <img src={`https://img.pokemondb.net/sprites/home/normal/${name.toLowerCase().replace(/ /g, '-')}.png`} className="w-full h-full object-contain group-hover/excl:scale-110 transition-transform" alt={name} />
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
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Users size={24} />
                 </div>
                 <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Principais Treinadores</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Líderes de Ginásio, Elite Four e o Campeão Regional</p>
                 </div>
              </div>
              
              {/* Gym Leaders Section */}
              <div className="space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-100 dark:border-slate-800 pb-4">Líderes de Ginásio</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {leaders.filter(l => l.role.toLowerCase().includes("gym") || l.role.toLowerCase().includes("líder")).map(leader => (
                    <TrainerTeam key={leader.name} leader={leader} accentColor={getTypeColor(leader.role.split(' ')[0])} />
                  ))}
                </div>
              </div>

              {/* Elite Four & Champion Section */}
              <div className="space-y-8 pt-12">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] border-b border-amber-500/20 pb-4">A Elite Final</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {leaders.filter(l => !l.role.toLowerCase().includes("gym") && !l.role.toLowerCase().includes("líder")).map(leader => (
                    <TrainerTeam key={leader.name} leader={leader} accentColor="#f59e0b" />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
