export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const ENDPOINTS = {
  pokemon: (idOrName: string | number) => `${POKEAPI_BASE_URL}/pokemon/${idOrName}`,
  pokemonSpecies: (idOrName: string | number) => `${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`,
  evolutionChain: (id: number) => `${POKEAPI_BASE_URL}/evolution-chain/${id}`,
  pokedex: (idOrName: string | number) => `${POKEAPI_BASE_URL}/pokedex/${idOrName}`,
  type: (idOrName: string | number) => `${POKEAPI_BASE_URL}/type/${idOrName}`,
  generation: (idOrName: string | number) => `${POKEAPI_BASE_URL}/generation/${idOrName}`,
  region: (idOrName: string | number) => `${POKEAPI_BASE_URL}/region/${idOrName}`,
};
