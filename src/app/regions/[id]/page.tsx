import { getRegion, getPokedex, getPokemon } from "@/services/pokeapi";
import { getLocalLore } from "@/services/localData";
import { getOfficialArtwork } from "@/utils/spriteResolver";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import gamesRegistry from "@/data/games_registry.json";
import { Map, ChevronLeft, BookOpen, Gamepad2, Monitor, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RegionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const region = await getRegion(id);
  const lore = await getLocalLore(id);
  
  if (!region) notFound();

  // Find games associated with this region from registry
  const regionGames = gamesRegistry.regions.find(r => r.id === id);

  // Find the 'main' pokedex for this region (often has the same name or is linked)
  const mainPokedex = await getPokedex(id);
  const pokemonList = mainPokedex?.pokemon_entries?.slice(0, 100) || [];

  const detailedPokemon = await Promise.all(
    pokemonList.map(async (entry: any) => {
      const detail = await getPokemon(entry.pokemon_species.name);
      if (!detail) return null;
      return {
        id: detail.id,
        name: detail.name,
        types: detail.types.map(t => t.type.name),
        image: getOfficialArtwork(detail.id),
      };
    })
  );

  const finalPokemon = detailedPokemon.filter(Boolean);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Region Banner */}
      <div className="h-[40vh] relative overflow-hidden bg-slate-100 dark:bg-slate-900">
        <div className="absolute inset-0 grayscale opacity-20 group-hover:grayscale-0 transition-all duration-1000">
           <img src={`/images/regions/${id}.png`} className="w-full h-full object-cover" alt={region.name} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-between py-12 relative z-10">
           <Link href="/regions" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-all">
             <ChevronLeft size={20} /> Todas as Regiões
           </Link>
           <div>
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/20">
                 <Map size={24} />
               </div>
               <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Continente Pokémon
               </span>
             </div>
             <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter capitalize">
               {region.name}
             </h1>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-20">
        {/* Lore Section */}
        {lore && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                <BookOpen className="text-rose-600" /> Sobre a Região
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                {lore.description}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 underline decoration-rose-500 decoration-2 underline-offset-4">
                 Locais Importantes
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  {lore.main_locations?.map(loc => (
                    <div key={loc} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                       <div className="w-2 h-2 rounded-full bg-rose-600" />
                       {loc}
                    </div>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* Associated Games Section */}
        {regionGames && (
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Gamepad2 className="text-rose-600" />
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Jogos da Região</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionGames.generations.map(gen => (
                <div key={gen.name} className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-l-2 border-rose-500 pl-3">
                    {gen.name}
                  </h3>
                  <div className="space-y-3">
                    {gen.games.map(game => (
                      <Link 
                        key={game.id} 
                        href={`/games/${game.id}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all shadow-sm"
                      >
                        <div className="w-12 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                           <img 
                              src={`https://img.pokemondb.net/boxes/${game.id.replace('lets-go-pikachu', 'lets-go-pikachu-switch').replace('lets-go-eevee', 'lets-go-eevee-switch')}.jpg`} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              alt={game.name}
                           />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                            {game.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {game.platform} • {game.year}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pokédex Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pokédex Nativa</h2>
              <p className="text-slate-500 font-bold italic">Os 100 primeiros Pokémon descobertos nesta região.</p>
            </div>
            <div className="text-slate-400 font-black text-xs uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl">
              {pokemonList.length} Espécies
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {finalPokemon.map((p: any) => (
              <PokemonCard key={p!.id} pokemon={p!} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
