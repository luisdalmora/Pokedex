"use client";

import React, { useState, useEffect, use } from "react";
import { PokedexOSLayout } from "@/components/pokedex-os/PokedexOSLayout";
import { PokedexOSTabs } from "@/components/pokedex-os/PokedexOSTabs";
import { PokedexOSPanel } from "@/components/pokedex-os/PokedexOSPanel";
import { Loader, ErrorState } from "@/components/ui/States";
import { SafeImage } from "@/components/ui/SafeImage";
import { PokeAPIClient } from "@/lib/pokeapi/client";
import { PokemonData, PokemonSpeciesData, EvolutionLink } from "@/types/pokeapi";
import { resolvePokemonSprite } from "@/lib/sprites/sprite-engine";
import { buildSpriteGallery } from "@/lib/sprites/sprite-engine";
import { PokemonDetailViewModel, EvolutionTreeViewModel } from "@/types/view-models";

import { PokemonBioPanel } from "@/components/pokemon/PokemonBioPanel";
import { PokemonStatsPanel } from "@/components/pokemon/PokemonStatsPanel";
import { PokemonEvolutionTree } from "@/components/pokemon/PokemonEvolutionTree";
import { PokemonSpriteGallery } from "@/components/pokemon/PokemonSpriteGallery";
import { PokemonTypeEffectiveness } from "@/components/pokemon/PokemonTypeEffectiveness";
import { PokemonVersionDescriptions } from "@/components/pokemon/PokemonVersionDescriptions";
import { PokemonFormsPanel } from "@/components/pokemon/PokemonFormsPanel";
import { FavoritePokemonButton } from "@/components/pokemon/FavoritePokemonButton";
import { formatId } from "@/utils/formatters";
import { useRouter } from "next/navigation";

export default function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [data, setData] = useState<PokemonDetailViewModel | null>(null);
  const [evolutionTree, setEvolutionTree] = useState<EvolutionTreeViewModel | null>(null);
  const [versions, setVersions] = useState<PokemonSpeciesData["flavor_text_entries"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const detail = await PokeAPIClient.getPokemon(resolvedParams.id);
        const species = await PokeAPIClient.getPokemonSpecies(detail.id);
        
        let chainData = null;
        if (species.evolution_chain?.url) {
          try {
            const chainId = parseInt(species.evolution_chain.url.split("/").slice(-2, -1)[0], 10);
            chainData = await PokeAPIClient.getEvolutionChain(chainId);
          } catch (e) {
            console.warn("Failed to load evolution chain");
          }
        }

        const mapEvoTree = (node: EvolutionLink): EvolutionTreeViewModel => {
          // Simplistic sprite grab, could use real fetch if needed
          const speciesId = node.species.url.split("/").slice(-2, -1)[0];
          return {
            id: parseInt(speciesId, 10),
            speciesName: node.species.name,
            speciesUrl: node.species.url,
            spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`,
            isBaby: node.is_baby,
            evolvesTo: node.evolves_to.map((evo) => ({
              details: evo.evolution_details.map((d) => ({
                trigger: d.trigger.name,
                item: d.item?.name || null,
                minLevel: d.min_level,
                minHappiness: d.min_happiness,
                timeOfDay: d.time_of_day,
                location: d.location?.name || null,
                heldItem: d.held_item?.name || null,
                knownMove: d.known_move?.name || null,
                knownMoveType: d.known_move_type?.name || null,
                gender: d.gender,
                minBeauty: d.min_beauty,
                minAffection: d.min_affection,
                needsOverworldRain: d.needs_overworld_rain,
                partySpecies: d.party_species?.name || null,
                partyType: d.party_type?.name || null,
                relativePhysicalStats: d.relative_physical_stats,
                tradeSpecies: d.trade_species?.name || null,
                turnUpsideDown: d.turn_upside_down
              })),
              species: mapEvoTree(evo)
            }))
          };
        };

        const tree = chainData ? mapEvoTree(chainData.chain) : null;
        setEvolutionTree(tree);
        
        setVersions(species.flavor_text_entries);

        const ptDesc = species.flavor_text_entries.find((e) => e.language.name === "pt-BR" || e.language.name === "pt");
        const enDesc = species.flavor_text_entries.find((e) => e.language.name === "en");
        
        const mainSprite = resolvePokemonSprite({
            pokemon: detail,
            species: species,
            mode: "origin-generation"
        });

        const viewModel: PokemonDetailViewModel = {
          id: detail.id,
          name: detail.name,
          types: detail.types.map((t) => t.type.name),
          height: detail.height,
          weight: detail.weight,
          baseExperience: detail.base_experience,
          stats: detail.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
          abilities: detail.abilities.map((a) => ({ name: a.ability.name, isHidden: a.is_hidden })),
          generation: species.generation ? parseInt(species.generation.name.split("-")[1] || "0", 10) : null,
          description: ptDesc ? ptDesc.flavor_text : (enDesc ? enDesc.flavor_text : null),
          habitat: species.habitat ? species.habitat.name : null,
          color: species.color ? species.color.name : null,
          shape: species.shape ? species.shape.name : null,
          isBaby: species.is_baby,
          isLegendary: species.is_legendary,
          isMythical: species.is_mythical,
          captureRate: species.capture_rate,
          eggGroups: species.egg_groups.map((eg) => eg.name),
          genderRate: species.gender_rate,
          baseHappiness: species.base_happiness,
          growthRate: species.growth_rate?.name || null,
          sprites: buildSpriteGallery(detail),
          forms: [], // Forms data could be populated by fetching variations
          varieties: species.varieties.map((v) => ({ name: v.pokemon.name, url: v.pokemon.url, isDefault: v.is_default })),
          mainSpriteUrl: mainSprite.url || detail.sprites.front_default || "",
          mainSpriteSource: mainSprite.source
        };

        setData(viewModel);
      } catch (err) {
        setError("FALHA NA CONEXÃO COM O DATABASE.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <PokedexOSLayout moduleName="SCANNING..." status="SCANNING" isScanning={true}>
        <Loader text="EXTRACTING BIOMETRICS..." />
      </PokedexOSLayout>
    );
  }

  if (error || !data) {
    return (
      <PokedexOSLayout moduleName="ERROR" status="ERROR">
        <ErrorState message={error || "ID NOT FOUND."} />
      </PokedexOSLayout>
    );
  }

  const tabs = [
    { id: "bio", label: "BIO", content: <PokemonBioPanel pokemon={data} /> },
    { id: "stats", label: "STATS", content: <PokemonStatsPanel stats={data.stats} /> },
    { id: "evo", label: "EVOLUÇÃO", content: <PokemonEvolutionTree chain={evolutionTree} /> },
    { id: "forms", label: "FORMAS", content: <PokemonFormsPanel varieties={data.varieties} /> },
    { id: "sprites", label: "Arquivo Visual", content: <PokemonSpriteGallery gallery={data.sprites} /> },
    { id: "types", label: "TIPOS", content: <PokemonTypeEffectiveness types={data.types} /> },
    { id: "versions", label: "VERSÕES", content: <PokemonVersionDescriptions entries={versions} /> }
  ];



  const RightPanel = (
    <div className="flex flex-col gap-4 h-full">
      <PokedexOSPanel variant="screen" className="flex flex-col items-center p-4">
         <div className="absolute top-2 right-2 flex gap-2">
           <FavoritePokemonButton pokemon={{
               id: data.id,
               name: data.name,
               types: data.types,
               spriteUrl: data.sprites.main,
               generation: data.generation,
               isLegendary: data.isLegendary,
               isMythical: data.isMythical
           }} />
         </div>
         <span className="text-[#38bdf8] font-bold font-mono tracking-widest text-lg mb-2">
            {formatId(data.id)}
         </span>
         
         <div className="w-48 h-48 relative flex items-center justify-center my-4">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent rounded-full blur-xl"></div>
            <SafeImage 
                src={data.mainSpriteUrl || data.sprites.main} 
                alt={data.name} 
                width={160} 
                height={160}
                className="z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                priority
            />
         </div>
         
         <h2 className="text-2xl font-black italic uppercase tracking-widest text-white mt-2">
            {data.name}
         </h2>
         
         <div className="text-[10px] text-cyan-500 uppercase mt-1 font-mono tracking-widest">
            {data.mainSpriteSource} Render
         </div>
      </PokedexOSPanel>

      <PokedexOSPanel className="flex-1">
         <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
             System Commands
         </h3>
         <div className="grid grid-cols-2 gap-2 mt-4">
             <button 
                onClick={() => router.push(`/pokemon/${data.id > 1 ? data.id - 1 : 1}`)}
                className="p-2 border border-slate-700 bg-slate-900 rounded text-xs font-bold text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors uppercase"
             >
                 &lt; Anterior
             </button>
             <button 
                onClick={() => router.push(`/pokemon/${data.id + 1}`)}
                className="p-2 border border-slate-700 bg-slate-900 rounded text-xs font-bold text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors uppercase"
             >
                 Próximo &gt;
             </button>
         </div>
         <button 
            onClick={() => router.push('/pokedex')}
            className="w-full mt-2 p-2 border border-slate-700 bg-slate-900 rounded text-xs font-bold text-slate-300 hover:border-red-500 hover:text-red-400 transition-colors uppercase"
         >
             Voltar p/ Dex
         </button>
      </PokedexOSPanel>
    </div>
  );

  return (
    <PokedexOSLayout 
      moduleName={`RECORD // ${formatId(data.id)}`} 
      rightPanel={RightPanel}
      itemsCount={1}
    >
      <div className="h-full flex flex-col p-2">
        <PokedexOSTabs tabs={tabs} className="h-full" />
      </div>
    </PokedexOSLayout>
  );
}
