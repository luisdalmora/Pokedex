import { ENDPOINTS } from "./endpoints";

export class PokeAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "PokeAPIError";
  }
}

export const fetchPokeAPI = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      ...options,
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new PokeAPIError(404, `Resource not found at ${url}`);
      }
      throw new PokeAPIError(res.status, `HTTP error! status: ${res.status}`);
    }

    return await res.json() as T;
  } catch (error) {
    if (error instanceof PokeAPIError) throw error;
    console.error(`Fetch error for ${url}:`, error);
    throw new PokeAPIError(500, `Network error fetching ${url}`);
  }
};

import { 
  PokemonData, 
  PokemonSpeciesData, 
  EvolutionChainData, 
  TypeData, 
  PaginatedResponse,
  NamedAPIResource,
  PokedexData,
  RegionData
} from "@/types/pokeapi";

export const PokeAPIClient = {
  getPokemon: (idOrName: string | number) => fetchPokeAPI<PokemonData>(ENDPOINTS.pokemon(idOrName)),
  getPokemonSpecies: (idOrName: string | number) => fetchPokeAPI<PokemonSpeciesData>(ENDPOINTS.pokemonSpecies(idOrName)),
  getEvolutionChain: (id: number) => fetchPokeAPI<EvolutionChainData>(ENDPOINTS.evolutionChain(id)),
  getPokedex: (idOrName: string | number) => fetchPokeAPI<PokedexData>(ENDPOINTS.pokedex(idOrName)), 
  getType: (idOrName: string | number) => fetchPokeAPI<TypeData>(ENDPOINTS.type(idOrName)),
  getGeneration: (idOrName: string | number) => fetchPokeAPI<{ pokemon_species: NamedAPIResource[] }>(ENDPOINTS.generation(idOrName)),
  getRegion: (idOrName: string | number) => fetchPokeAPI<RegionData>(ENDPOINTS.region(idOrName)),
  
  // Custom fetch for paginated lists
  getPokemonList: (limit: number = 20, offset: number = 0) => 
    fetchPokeAPI<PaginatedResponse<NamedAPIResource>>(`${ENDPOINTS.pokemon("")}?limit=${limit}&offset=${offset}`),
};
