export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const ENDPOINTS = {
  pokemon: (idOrName: string | number) => `/pokemon/${idOrName}`,
  pokemonSpecies: (idOrName: string | number) => `/pokemon-species/${idOrName}`,
  pokemonList: (limit: number = 20, offset: number = 0) => `/pokemon?limit=${limit}&offset=${offset}`,
  evolutionChain: (id: number) => `/evolution-chain/${id}`,
  generation: (idOrName: string | number) => `/generation/${idOrName}`,
  region: (idOrName: string | number) => `/region/${idOrName}`,
  type: (idOrName: string | number) => `/type/${idOrName}`,
  pokedex: (idOrName: string | number) => `/pokedex/${idOrName}`,
};
