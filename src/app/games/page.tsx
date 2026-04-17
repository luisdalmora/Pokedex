import gamesRegistry from "@/data/games_registry.json";
import { Gamepad2, Monitor, Calendar } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

export default function GamesPage() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Biblioteca de Jogos</h1>
        <p className="text-slate-500 font-bold max-w-2xl">
          Navegue por décadas de história Pokémon, desde os clássicos pixelados do Game Boy até as aventuras em mundo aberto do Switch.
        </p>
      </header>

      <div className="space-y-20">
        {gamesRegistry.regions.map((region) => (
          <section key={region.id} className="space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/20">
                <Gamepad2 size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {region.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {region.generations.map((gen) => (
                <div key={gen.name} className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {gen.name}
                  </h3>
                  <div className="space-y-3">
                    {gen.games.map((game) => (
                      <Link 
                        key={game.id} 
                        href={`/games/${game.id}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all hover:shadow-xl"
                      >
                        <div className="w-12 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          <SafeImage 
                            src={`https://img.pokemondb.net/boxes/${game.id.replace('lets-go-pikachu', 'lets-go-pikachu-switch').replace('lets-go-eevee', 'lets-go-eevee-switch')}.jpg`} 
                            alt={game.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                            {game.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                              <Monitor size={10} /> {game.platform}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                              <Calendar size={10} /> {game.year}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
