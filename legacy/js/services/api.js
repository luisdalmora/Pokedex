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

export const fetchLocalExclusives = async (generationSlug) => {
  try {
    const res = await fetch(`./src/data/exclusives/${generationSlug}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
};

/**
 * Helper to get the best sprite for a specific game version
 * Using PokéAPI's sprites.versions structure
 */
export const getVersionSprite = (sprites, versionGroup) => {
    if (!sprites) return null;

    // Mapping versionGroup to PokeAPI sprite keys
    const mapping = {
        'red-blue': ['generation-i', 'red-blue'],
        'yellow': ['generation-i', 'yellow'],
        'gold': ['generation-ii', 'gold'],
        'silver': ['generation-ii', 'silver'],
        'crystal': ['generation-ii', 'crystal'],
        'ruby-sapphire': ['generation-iii', 'ruby-sapphire'],
        'emerald': ['generation-iii', 'emerald'],
        'firered-leafgreen': ['generation-iii', 'firered-leafgreen'],
        'diamond-pearl': ['generation-iv', 'diamond-pearl'],
        'platinum': ['generation-iv', 'platinum'],
        'heartgold-soulsilver': ['generation-iv', 'heartgold-soulsilver'],
        'black-white': ['generation-v', 'black-white'],
        'black-2-white-2': ['generation-v', 'black-white'],
        'x-y': ['generation-vi', 'x-y'],
        'omega-ruby-alpha-sapphire': ['generation-vi', 'omegaruby-alphasapphire'],
        'sun-moon': ['generation-vii', 'ultra-sun-ultra-moon'],
        'ultra-sun-ultra-moon': ['generation-vii', 'ultra-sun-ultra-moon']
    };

    const path = mapping[versionGroup];
    if (!path || !sprites.versions) return sprites.front_default;

    try {
        const generation = sprites.versions[path[0]];
        const game = generation[path[1]];
        // For older generations, 'transparent' often exists and looks better
        return game.front_default || sprites.front_default;
    } catch (e) {
        return sprites.front_default;
    }
};

const idCache = {};

/**
 * Resolves a Pokémon name to its ID and types by fetching from PokéAPI
 * Uses a local cache to avoid redundant requests
 */
export const resolvePokemonId = async (name) => {
    const slug = name.toLowerCase().replace(/[\s.]+/g, '-');
    if (idCache[slug]) return idCache[slug];

    try {
        const data = await fetchPokemonDetails(slug);
        if (data) {
            const info = {
                id: data.id,
                types: data.types.map(t => t.type.name),
                name: data.name
            };
            idCache[slug] = info;
            return info;
        }
    } catch (e) {
        console.warn(`Could not resolve ID for ${name}`);
    }
    return null;
};

/**
 * Returns a static sprite URL for a specific pokemon ID based on the game version
 */
export const getPokemonSpriteUrl = (idOrName, versionGroup = 'modern') => {
    const key = idOrName;
    
    // Gen 1 & 2
    if (versionGroup === 'red' || versionGroup === 'blue' || versionGroup === 'yellow' || versionGroup === 'red-blue') {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${key}.png`;
    }
    if (versionGroup === 'gold' || versionGroup === 'silver' || versionGroup === 'crystal') {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/${versionGroup}/transparent/${key}.png`;
    }
    
    // Gen 3
    if (versionGroup === 'ruby' || versionGroup === 'sapphire' || versionGroup === 'emerald') {
        const path = versionGroup === 'emerald' ? 'emerald' : 'ruby-sapphire';
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/${path}/${key}.png`;
    }
    if (versionGroup === 'firered' || versionGroup === 'leafgreen') {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${key}.png`;
    }

    // Gen 4
    if (versionGroup === 'diamond' || versionGroup === 'pearl' || versionGroup === 'platinum') {
        const path = versionGroup === 'platinum' ? 'platinum' : 'diamond-pearl';
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/${path}/${key}.png`;
    }
    if (versionGroup === 'heartgold' || versionGroup === 'soulsilver') {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/${key}.png`;
    }

    // Gen 5
    if (versionGroup === 'black' || versionGroup === 'white' || versionGroup === 'black-2' || versionGroup === 'white-2') {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${key}.gif`;
    }

    // Modern (Gen 6-9) - Default to High Quality Official Artwork
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${key}.png`;
};

