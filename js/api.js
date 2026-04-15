import { state, getCache, setCache } from './state.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemons = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    return [];
  }
};

export const fetchPokemonDetails = async (nameOrId) => {
  const cached = getCache('details', nameOrId);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) throw new Error('Pokemon not found');
    const data = await response.json();
    setCache('details', data.id, data);
    setCache('details', data.name, data); // cache by both id and name
    return data;
  } catch (error) {
    console.error(`Error fetching detail for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchSpeciesDetails = async (nameOrId) => {
  const cached = getCache('species', nameOrId);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
    if (!response.ok) throw new Error('Species not found');
    const data = await response.json();
    setCache('species', nameOrId, data);
    return data;
  } catch (error) {
    console.error(`Error fetching species for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchEvolutionChain = async (url) => {
  const cached = getCache('evolution', url);
  if (cached) return cached;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Evolution chain not found');
    const data = await response.json();
    setCache('evolution', url, data);
    return data;
  } catch (error) {
    console.error('Error fetching evolution:', error);
    return null;
  }
};

export const loadPokemonsBatch = async (limit, offset) => {
  state.loading = true;
  const list = await fetchPokemons(limit, offset);
  
  // Use Promise.all para carregar detalhes em paralelo
  const detailsPromises = list.map(p => fetchPokemonDetails(p.name));
  const detailedPokemons = await Promise.all(detailsPromises);
  
  // Filtrar nulos (erros)
  const validPokemons = detailedPokemons.filter(p => p !== null);
  
  state.loading = false;
  return validPokemons;
};

// --- Funções de Dados Locais para Jogos e Regiões ---
export const fetchGenerationsList = async () => {
  const response = await fetch('./src/data/games/generations.json');
  if (!response.ok) throw new Error('Failed to fetch generations');
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

export const fetchRegionsList = async () => {
  const response = await fetch('./src/data/regions/regions.json');
  if (!response.ok) throw new Error('Failed to fetch regions list');
  return response.json();
};

export const fetchRegionData = async (regionSlug) => {
  const response = await fetch(`./src/data/regions/${regionSlug}.json`);
  if (!response.ok) throw new Error(`Data not found for ${regionSlug}`);
  return response.json();
};

export const fetchRegionGames = async (regionSlug) => {
  try {
    const response = await fetch(`./src/data/games/${regionSlug}-games.json`);
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
