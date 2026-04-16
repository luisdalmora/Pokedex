import { fetchWithCache } from '../utils/cache.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemons = async (limit = 20, offset = 0) => {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  try {
    const data = await fetchWithCache(url, 'list', `${limit}_${offset}`);
    return data.results;
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    return [];
  }
};

export const fetchPokemonDetails = async (nameOrId) => {
  const url = `${BASE_URL}/pokemon/${nameOrId}`;
  try {
    return await fetchWithCache(url, 'details', nameOrId);
  } catch (error) {
    // Silenciado o console.error aqui propositalmente para evitar spam no console durante a digitação de buscas parciais ("e", "ee", "eev", etc).
    return null;
  }
};

export const fetchSpeciesDetails = async (nameOrId) => {
  const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
  try {
    return await fetchWithCache(url, 'species', nameOrId);
  } catch (error) {
    console.error(`Error fetching species for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchEvolutionChain = async (url) => {
  try {
    // URL may contain trailing slash or parameters, we use the raw URL as the key
    const parts = url.split('/');
    const id = parts[parts.length - 2]; 
    return await fetchWithCache(url, 'evolution', id);
  } catch (error) {
    console.error('Error fetching evolution:', error);
    return null;
  }
};

export const fetchTypeDetails = async (nameOrId) => {
  const url = `${BASE_URL}/type/${nameOrId}`;
  try {
    return await fetchWithCache(url, 'type', nameOrId);
  } catch (error) {
    console.error(`Error fetching type for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchMoveDetails = async (nameOrId) => {
  const url = `${BASE_URL}/move/${nameOrId}`;
  try {
    return await fetchWithCache(url, 'move', nameOrId);
  } catch (error) {
    console.error(`Error fetching move for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchAbilityDetails = async (nameOrId) => {
  const url = `${BASE_URL}/ability/${nameOrId}`;
  try {
    return await fetchWithCache(url, 'ability', nameOrId);
  } catch (error) {
    console.error(`Error fetching ability for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchItemDetails = async (nameOrId) => {
  const url = `${BASE_URL}/item/${nameOrId}`;
  try {
    return await fetchWithCache(url, 'item', nameOrId);
  } catch (error) {
    console.error(`Error fetching item for ${nameOrId}:`, error);
    return null;
  }
};

export const fetchLocationAreas = async (id) => {
  const url = `${BASE_URL}/pokemon/${id}/encounters`;
  try {
    return await fetchWithCache(url, 'encounters', id);
  } catch (error) {
    console.error(`Error fetching encounters for ${id}:`, error);
    return [];
  }
};

export const fetchRegionList = async () => {
  const url = `${BASE_URL}/region`;
  try {
    const data = await fetchWithCache(url, 'regions_list', 'all');
    return data.results;
  } catch (error) {
    console.error('Error fetching region list:', error);
    return [];
  }
};

export const fetchRegionDetails = async (idOrName) => {
  const url = `${BASE_URL}/region/${idOrName}`;
  try {
    return await fetchWithCache(url, 'region', idOrName);
  } catch (error) {
    console.error(`Error fetching region ${idOrName}:`, error);
    return null;
  }
};

export const fetchGenerationDetails = async (idOrName) => {
  const url = `${BASE_URL}/generation/${idOrName}`;
  try {
    return await fetchWithCache(url, 'generation', idOrName);
  } catch (error) {
    console.error(`Error fetching generation ${idOrName}:`, error);
    return null;
  }
};

export const fetchVersionGroup = async (idOrName) => {
  const url = `${BASE_URL}/version-group/${idOrName}`;
  try {
    return await fetchWithCache(url, 'version-group', idOrName);
  } catch (error) {
    console.error(`Error fetching version group ${idOrName}:`, error);
    return null;
  }
};

export const fetchPokedexDetails = async (idOrName) => {
  const url = `${BASE_URL}/pokedex/${idOrName}`;
  try {
    return await fetchWithCache(url, 'pokedex', idOrName);
  } catch (error) {
    console.error(`Error fetching pokedex ${idOrName}:`, error);
    return null;
  }
};

// ==========================================
// HYBRID LOCAL JSON FETCHERS
// These gracefully fail if the user has not populated the JSON
// ==========================================

export const fetchLocalGymLeaders = async (regionSlug) => {
  try {
    const res = await fetch(`./src/data/gym-leaders/${regionSlug}.json`);
    if (!res.ok) return [];
    const data = await res.json();
    return data['gym-leaders'] || [];
  } catch (err) {
    return [];
  }
};

export const fetchLocalLore = async (regionSlug) => {
  try {
    const res = await fetch(`./src/data/lore/${regionSlug}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const fetchLocalGameData = async (gameSlug) => {
  try {
    const res = await fetch(`./src/data/games/${gameSlug}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
};
