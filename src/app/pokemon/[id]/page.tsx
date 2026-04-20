import { getPokemon, getPokemonSpecies, getEvolutionChain } from "@/services/pokeapi";
import { getBestAvailableSprite } from "@/utils/spriteResolver";
import { translateType, getPtBrText } from "@/utils/translations";
import { getTypeColor } from "@/utils/pokemonStyles";
import { StatsBar } from "@/components/pokemon/StatsBar";
import { EvolutionTree } from "@/components/pokemon/EvolutionTree";
import { AlternativeForms } from "@/components/pokemon/AlternativeForms";
import { SpriteExplorer } from "@/components/pokemon/SpriteExplorer";
import { SafeImage } from "@/components/ui/SafeImage";
import { ChevronLeft, Scale, Ruler, Zap, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pokemon = await getPokemon(id);
  const species = await getPokemonSpecies(id);

  if (!pokemon) notFound();

  const primaryType = pokemon.types[0].type.name;
  const description = getPtBrText(species?.flavor_text_entries || []) || "Sem descrição disponível.";
  
  const maxStat = Math.max(...pokemon.stats.map(s => s.base_stat));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Dynamic Header Background */}
      <div 
        className="relative h-[35vh] lg:h-[40vh] w-full transition-all duration-700"
        style={{ backgroundColor: getTypeColor(primaryType) }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        
        <div className="container mx-auto px-6 pt-12 relative z-10">
          <Link 
            href="/pokedex" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors"
          >
            <ChevronLeft size={24} />
            Voltar para Pokédex
          </Link>
        </div>

        {/* Big Float Image */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500">
           <SafeImage 
              src={getBestAvailableSprite(pokemon.id)} 
              alt={pokemon.name}
              className="w-full h-full object-contain"
              useSkeleton={false}
           />
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 -mt-8 relative z-20 pb-20">
        <div className="flex flex-col items-center mb-10">
          <span className="text-xl font-black text-slate-400 dark:text-slate-600 mb-2">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black capitalize text-slate-900 dark:text-white tracking-tighter mb-6">
            {pokemon.name.replace('-', ' ')}
          </h1>
          
          <div className="flex gap-4">
            {pokemon.types.map(t => (
              <span 
                key={t.type.name}
                style={{ backgroundColor: getTypeColor(t.type.name) }}
                className="px-8 py-2 rounded-full text-sm font-black uppercase tracking-widest text-white shadow-xl"
              >
                {translateType(t.type.name)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Info size={24} className="text-rose-500" /> Sobre
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-8">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <Scale className="text-slate-400 mb-2" />
                  <span className="text-xl font-black text-slate-900 dark:text-white">{pokemon.weight / 10} kg</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peso</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <Ruler className="text-slate-400 mb-2" />
                  <span className="text-xl font-black text-slate-900 dark:text-white">{pokemon.height / 10} m</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Altura</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Zap size={24} className="text-amber-500" /> Habilidades
              </h3>
              <div className="flex flex-wrap gap-3">
                {pokemon.abilities.map(a => (
                  <span key={a.ability.name} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-black capitalize text-slate-600 dark:text-slate-400">
                    {a.ability.name.replace('-', ' ')}
                    {a.is_hidden && <small className="ml-2 opacity-50 text-[10px]">(Oculta)</small>}
                  </span>
                ))}
              </div>
            </div>

            {/* Evolution Chain Section */}
            {species?.evolution_chain && (
              <EvolutionChainWrapper url={species.evolution_chain.url} />
            )}

            {/* Alternative Forms Section */}
            {species?.varieties && species.varieties.length > 1 && (
              <AlternativeForms 
                varieties={species.varieties} 
                currentPokemonId={pokemon.id} 
              />
            )}
          </div>

          {/* Stats Side */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
               <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Atributos Base</h2>
               <div className="space-y-6">
                  {pokemon.stats.map(s => (
                    <StatsBar
                      key={s.stat.name}
                      label={s.stat.name}
                      value={s.base_stat}
                      type={primaryType}
                      isHighest={s.base_stat === maxStat}
                    />
                  ))}
               </div>
            </div>

            <SpriteExplorer pokemon={pokemon} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function EvolutionChainWrapper({ url }: { url: string }) {
  const chainData = await getEvolutionChain(url);
  if (!chainData) return null;
  return <EvolutionTree chain={chainData.chain} />;
}
