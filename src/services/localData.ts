import { PokemonListResult } from "@/types/pokemon";

export interface GymLeader {
  name: string;
  role: string;
  image: string;
  pokemon: string[];
}

export interface GameExclusives {
  version1: {
    name: string;
    pokemon: string[];
  };
  version2: {
    name: string;
    pokemon: string[];
  };
}

export interface RegionLore {
  name: string;
  description: string;
  main_locations: string[];
}

/**
 * Service to access migrated local JSON data
 */
export const getLocalGymLeaders = async (region: string): Promise<GymLeader[]> => {
  try {
    const data = await import(`@/data/gym-leaders/${region}.json`);
    const rawLeaders = data['gym-leaders'] || [];
    
    // Normalize data from migrated legacy JSONs
    return rawLeaders.map((l: any) => ({
      name: l.name,
      role: l.gym || l.specialty || "Gym Leader",
      image: l.image || `${l.name.split(' / ')[0]}.png`,
      pokemon: (l.team || l.pokemon || []).map((p: any) => 
        typeof p === 'string' ? p : p.name
      )
    }));
  } catch (e) {
    console.error(`Error loading gym leaders for ${region}:`, e);
    return [];
  }
};

export const getLocalExclusives = async (gameId: string): Promise<GameExclusives | null> => {
  try {
    const data = await import(`@/data/exclusives/${gameId}.json`);
    return data || null;
  } catch (e) {
    return null;
  }
};

export const getLocalLore = async (region: string): Promise<RegionLore | null> => {
  try {
    const data = await import(`@/data/lore/${region}.json`);
    return data || null;
  } catch (e) {
    return null;
  }
};
