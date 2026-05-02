import { PokemonData } from "@/types/pokeapi";

export type SpriteMode = 
  | "origin-generation" 
  | "selected-generation" 
  | "modern" 
  | "official-artwork" 
  | "game-version";

export interface ResolveSpriteOptions {
  pokemon: PokemonData;
  originGeneration: number;
  mode?: SpriteMode;
  selectedGeneration?: number;
  selectedVersion?: string;
  shiny?: boolean;
  back?: boolean;
  female?: boolean;
  animated?: boolean;
}

export interface SpriteResolvedResult {
  url: string | null;
  source: string;
  generation: number | null;
  version: string | null;
  isFallback: boolean;
}

export function resolvePokemonSprite(options: ResolveSpriteOptions): SpriteResolvedResult {
  const {
    pokemon,
    originGeneration,
    mode = "origin-generation",
    selectedGeneration,
    selectedVersion,
    shiny = false,
    back = false,
    female = false,
    animated = false,
  } = options;

  const sprites = pokemon.sprites;
  
  // Helpers
  const getPropName = (b: boolean, s: boolean, f: boolean) => {
    let name = b ? "back" : "front";
    if (s) name += "_shiny";
    else name += "_default";
    if (f) {
       // Only append female if it exists. But we check dynamically later.
       name = name.replace("default", "female").replace("shiny", "shiny_female");
    }
    return name;
  };

  const getSpriteFromObj = (obj: any, b: boolean, s: boolean, f: boolean) => {
    if (!obj) return null;
    const propName = getPropName(b, s, f);
    if (f && obj[propName]) return obj[propName];
    // Fallback to non-female if female requested but not found
    const fallbackProp = getPropName(b, s, false);
    return obj[fallbackProp] || null;
  };

  // 1. Official Artwork Mode
  if (mode === "official-artwork") {
    const artworkObj = sprites.other?.["official-artwork"];
    const url = getSpriteFromObj(artworkObj, false, shiny, false); // no back/female for artwork usually
    if (url) return { url, source: "official-artwork", generation: null, version: null, isFallback: false };
  }

  // 2. Modern Mode (HOME or Showdown for animated)
  if (mode === "modern") {
    if (animated && sprites.other?.showdown) {
      const url = getSpriteFromObj(sprites.other.showdown, back, shiny, female);
      if (url) return { url, source: "showdown", generation: null, version: null, isFallback: false };
    }
    const homeObj = sprites.other?.home;
    const url = getSpriteFromObj(homeObj, false, shiny, female);
    if (url) return { url, source: "home", generation: null, version: null, isFallback: false };
  }

  // 3. Origin or Selected Generation Mode
  if (mode === "origin-generation" || mode === "selected-generation") {
    const targetGen = mode === "origin-generation" ? originGeneration : (selectedGeneration || originGeneration);
    
    // Mapeamento de versões primárias por geração
    const genVersionMap: Record<number, { genKey: string; verKey: string }> = {
      1: { genKey: "generation-i", verKey: "red-blue" }, // Yellow is also an option
      2: { genKey: "generation-ii", verKey: "crystal" },
      3: { genKey: "generation-iii", verKey: "emerald" },
      4: { genKey: "generation-iv", verKey: "platinum" },
      5: { genKey: "generation-v", verKey: "black-white" },
      6: { genKey: "generation-vi", verKey: "omegaruby-alphasapphire" },
      7: { genKey: "generation-vii", verKey: "ultra-sun-ultra-moon" },
    };

    const targetInfo = genVersionMap[targetGen];
    
    if (targetInfo && sprites.versions && (sprites.versions as any)[targetInfo.genKey]) {
      const genObj = (sprites.versions as any)[targetInfo.genKey];
      
      // Override for Gen 5 Animated
      if (targetGen === 5 && animated && genObj["black-white"]?.animated) {
        const url = getSpriteFromObj(genObj["black-white"].animated, back, shiny, female);
        if (url) return { url, source: "versions", generation: targetGen, version: "black-white-animated", isFallback: false };
      }

      const verObj = genObj[targetInfo.verKey];
      const url = getSpriteFromObj(verObj, back, shiny, female);
      
      if (url) {
        return { url, source: "versions", generation: targetGen, version: targetInfo.verKey, isFallback: false };
      }
    }
  }

  // 4. Game Version Mode
  if (mode === "game-version" && selectedVersion && sprites.versions) {
    // Find the version across generations
    for (const [genKey, genObj] of Object.entries(sprites.versions)) {
      if ((genObj as any)[selectedVersion]) {
        const url = getSpriteFromObj((genObj as any)[selectedVersion], back, shiny, female);
        if (url) {
          const genNum = parseInt(genKey.split("-")[1].replace(/i|v|x/g, (m) => ({"i": 1, "v": 5, "x": 10}[m] as any) || m)); // rough roman to int if needed, actually we just return what we have
          return { url, source: "versions", generation: null, version: selectedVersion, isFallback: false };
        }
      }
    }
  }

  // FALLBACKS
  // 1. Official Artwork
  let fallbackUrl = getSpriteFromObj(sprites.other?.["official-artwork"], false, shiny, false);
  if (fallbackUrl) return { url: fallbackUrl, source: "official-artwork", generation: null, version: null, isFallback: true };

  // 2. Default Front
  fallbackUrl = getSpriteFromObj(sprites, back, shiny, female);
  if (fallbackUrl) return { url: fallbackUrl, source: "base", generation: null, version: null, isFallback: true };

  // 3. Absolute Last Resort
  return { url: null, source: "none", generation: null, version: null, isFallback: true };
}
