const BASE_URL = 'https://pokeapi.co/api/v2';

// Básico para a 1ª geração
export const fetchPokemons = async (limit = 151, offset = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch pokemons');
  return response.json();
};

export const fetchPokemonDetails = async (nameOrId) => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) throw new Error('Pokemon not found');
  return response.json();
};

export const fetchSpeciesDetails = async (nameOrId) => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
  if (!response.ok) throw new Error('Species not found');
  return response.json();
};

export const fetchEvolutionChain = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Evolution chain not found');
  return response.json();
};

// Detalhes da versão do jogo (ex: red, blue, yellow)
export const fetchGameVersion = async (versionName) => {
  const response = await fetch(`${BASE_URL}/version/${versionName}`);
  if (!response.ok) throw new Error('Game version not found');
  return response.json();
};

// Detalhes do grupo de versões, que contém as regiões
export const fetchVersionGroup = async (groupUrl) => {
  const response = await fetch(groupUrl);
  if (!response.ok) throw new Error('Version group not found');
  return response.json();
};
