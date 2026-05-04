import { PokemonData, PokemonSpeciesData } from "./pokeapi";

export type SpriteMode = 
  | "origin-generation"
  | "selected-generation"
  | "modern"
  | "official-artwork"
  | "game-version";

export interface SpriteResolveOptions {
  pokemon: PokemonData;
  species?: PokemonSpeciesData;
  mode: SpriteMode;
  selectedGeneration?: number;
  selectedVersion?: string;
  shiny?: boolean;
  back?: boolean;
  female?: boolean;
  animated?: boolean;
  form?: string;
}

export interface SpriteResolvedResult {
  url: string | null;
  source: string;
  generation: number | null;
  version: string | null;
  isFallback: boolean;
}
