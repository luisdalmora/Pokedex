import { Pokemon, PokemonListResult, PokemonSpecies } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Professional Fetch Wrapper with Next.js Cache
 */
async function pokeFetch<T>(endpoint: string, revalidate = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`PokeAPI Error [${endpoint}]:`, error);
    return null;
  }
}

export const getPokemonList = async (limit = 20, offset = 0) => {
  const data = await pokeFetch<{ results: PokemonListResult[] }>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return data?.results || [];
};

export const getPokemon = async (idOrName: string | number): Promise<Pokemon | null> => {
  return await pokeFetch<Pokemon>(`/pokemon/${idOrName}`);
};

export const getPokemonSpecies = async (idOrName: string | number): Promise<PokemonSpecies | null> => {
  return await pokeFetch<PokemonSpecies>(`/pokemon-species/${idOrName}`);
};

export const getEvolutionChain = async (url: string): Promise<any | null> => {
  const id = url.split('/').filter(Boolean).pop();
  return await pokeFetch<any>(`/evolution-chain/${id}`);
};

export const getPokedex = async (idOrName: string | number): Promise<any | null> => {
  return await pokeFetch<any>(`/pokedex/${idOrName}`);
};

export const getRegion = async (idOrName: string | number): Promise<any | null> => {
  return await pokeFetch<any>(`/region/${idOrName}`);
};

export const getPokemonByType = async (type: string) => {
  const data = await pokeFetch<{ pokemon: { pokemon: PokemonListResult }[] }>(`/type/${type}`);
  return data?.pokemon.map(p => p.pokemon) || [];
};
