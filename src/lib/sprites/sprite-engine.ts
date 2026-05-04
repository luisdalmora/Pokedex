import { SpriteResolveOptions, SpriteResolvedResult } from "@/types/sprites";
import { SpriteGallery } from "@/types/view-models";
import { getGenerationName, getDefaultVersionForGeneration, extractGenerationNumber } from "./sprite-version-map";
import { buildFallbackChain } from "./sprite-fallbacks";

export function resolvePokemonSprite(options: SpriteResolveOptions): SpriteResolvedResult {
  const {
    pokemon,
    species,
    mode,
    selectedGeneration,
    selectedVersion,
    shiny = false,
    back = false,
    female = false,
    animated = false
  } = options;

  const sprites = pokemon.sprites;
  if (!sprites) return buildFallbackChain(pokemon.id, mode)[0];

  const propKey = [
    back ? "back" : "front",
    shiny ? "shiny" : "default",
    female ? "female" : null
  ].filter(Boolean).join("_");

  // Fix: The female key in PokeAPI is like "front_female" or "front_shiny_female". If female is true, but female sprite is null, fallback to male.
  const getProp = (obj: Record<string, string | null | undefined> | null | undefined): string | null => {
    if (!obj) return null;
    let url = obj[propKey];
    if (!url && female) {
      // Fallback to non-female if female doesn't exist
      const fallbackKey = [back ? "back" : "front", shiny ? "shiny" : "default"].join("_");
      url = obj[fallbackKey];
    }
    return url || null;
  };

  const getModern = (): SpriteResolvedResult | null => {
    const homeUrl = getProp(sprites.other?.home as any);
    if (homeUrl) return { url: homeUrl, source: "home", generation: null, version: null, isFallback: false };
    
    const artworkUrl = getProp(sprites.other?.["official-artwork"] as any);
    if (artworkUrl) return { url: artworkUrl, source: "official-artwork", generation: null, version: null, isFallback: false };
    
    return null;
  };

  const getHistorical = (genStr: string, version: string): SpriteResolvedResult | null => {
    const genData = sprites.versions?.[genStr];
    if (!genData) return null;
    
    const versionData = genData[version] as any;
    if (!versionData) return null;

    if (animated && versionData.animated) {
      const animUrl = getProp(versionData.animated);
      if (animUrl) return { url: animUrl, source: `animated-${version}`, generation: extractGenerationNumber(genStr), version, isFallback: false };
    }

    const url = getProp(versionData);
    if (url) return { url, source: version, generation: extractGenerationNumber(genStr), version, isFallback: false };

    return null;
  };

  if (mode === "official-artwork") {
    const url = getProp(sprites.other?.["official-artwork"] as any);
    if (url) return { url, source: "official-artwork", generation: null, version: null, isFallback: false };
  }

  if (mode === "modern") {
    const modern = getModern();
    if (modern) return modern;
  }

  if (mode === "game-version" && selectedGeneration && selectedVersion) {
    const genName = getGenerationName(selectedGeneration);
    if (genName) {
      const historical = getHistorical(genName, selectedVersion);
      if (historical) return historical;
    }
  }

  if (mode === "origin-generation" || mode === "selected-generation") {
    let targetGen = mode === "selected-generation" && selectedGeneration ? selectedGeneration : null;
    
    if (mode === "origin-generation" && species?.generation) {
       targetGen = extractGenerationNumber(species.generation.name);
    }

    // Try target generation
    if (targetGen) {
      const genName = getGenerationName(targetGen);
      const defaultVersion = getDefaultVersionForGeneration(targetGen);
      if (genName && defaultVersion) {
        const historical = getHistorical(genName, defaultVersion);
        if (historical) return historical;
        
        // If preferred version fails, try any version in that generation
        if (sprites.versions && sprites.versions[genName]) {
            for(const v of Object.keys(sprites.versions[genName])) {
                const hist = getHistorical(genName, v);
                if (hist) return hist;
            }
        }
      }
    }
  }

  // Final fallback strategy
  const defaultUrl = getProp(sprites as any);
  if (defaultUrl) {
      return { url: defaultUrl, source: "default", generation: null, version: null, isFallback: true };
  }

  return buildFallbackChain(pokemon.id, mode)[0];
}

import { PokemonData } from "@/types/pokeapi";

export function buildSpriteGallery(pokemon: PokemonData): SpriteGallery {
  const s = pokemon.sprites;
  const mappedVersions: any = {};
  if (s.versions) {
    Object.entries(s.versions).forEach(([gen, games]) => {
      mappedVersions[gen] = {};
      Object.entries(games).forEach(([game, sprites]: [string, any]) => {
        mappedVersions[gen][game] = {
          front: sprites.front_default || null,
          back: sprites.back_default || null,
          shiny: sprites.front_shiny || null,
          backShiny: sprites.back_shiny || null
        };
      });
    });
  }

  return {
    main: s.other?.["official-artwork"]?.front_default || s.front_default || null,
    officialArtwork: s.other?.["official-artwork"]?.front_default || null,
    home: s.other?.home?.front_default || null,
    dreamWorld: s.other?.dream_world?.front_default || null,
    animated: s.versions?.["generation-v"]?.["black-white"]?.animated?.front_default || null,
    versions: mappedVersions
  };
}
