import { SpriteResolvedResult } from "@/types/sprites";

const OFFICIAL_ARTWORK_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const HOME_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";

export function getFallbackSprite(pokemonId: number): SpriteResolvedResult {
  // Return official artwork as ultimate fallback
  return {
    url: `${OFFICIAL_ARTWORK_BASE}${pokemonId}.png`,
    source: "official-artwork-fallback",
    generation: null,
    version: null,
    isFallback: true
  };
}

export function getHomeFallback(pokemonId: number): SpriteResolvedResult {
  return {
    url: `${HOME_BASE}${pokemonId}.png`,
    source: "home-fallback",
    generation: null,
    version: null,
    isFallback: true
  };
}

export function buildFallbackChain(pokemonId: number, preferredMode: string): SpriteResolvedResult[] {
  const chain: SpriteResolvedResult[] = [];
  
  if (preferredMode !== "official-artwork") {
    chain.push(getHomeFallback(pokemonId));
  }
  
  chain.push(getFallbackSprite(pokemonId));
  
  return chain;
}
