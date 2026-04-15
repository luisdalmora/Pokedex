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

// --- Funções de Dados Locais ---

export const fetchRegionsList = async () => {
  const response = await fetch('./src/data/regions/regions.json');
  if (!response.ok) throw new Error('Failed to fetch regions list');
  return response.json();
};

export const fetchRegionData = async (regionSlug) => {
  const response = await fetch(`./src/data/regions/${regionSlug}.json`);
  if (!response.ok) throw new Error(`Failed to fetch region data for ${regionSlug}`);
  return response.json();
};

export const fetchRegionGames = async (regionSlug) => {
  try {
    const response = await fetch(`./src/data/games/${regionSlug}-games.json`);
    if (!response.ok) return []; // Ignora caso a região ainda não tenha o arquivo com jogos
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchGenerationsList = async () => {
  const response = await fetch('./src/data/games/generations.json');
  if (!response.ok) throw new Error('Failed to fetch generations list');
  return response.json();
};

export const fetchGenerationGames = async (genSlug) => {
  try {
    const response = await fetch(`./src/data/games/${genSlug}-games.json`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchSpecialEvolutionsFallback = async () => {
  try {
    const response = await fetch('./src/data/special-evolutions.json');
    if (!response.ok) return { specialEvolutions: [] };
    return await response.json();
  } catch (error) {
    return { specialEvolutions: [] };
  }
};

