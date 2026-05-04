import { PokeAPIClient } from "./client";
import { NamedAPIResource } from "@/types/pokeapi";

export interface SearchFilters {
  query: string;
  type: string;
  generation: string;
  special: string; // 'legendary', 'mythical', 'baby', 'all'
}

// Special flags lists (Names of species that are legendary/mythical/baby to avoid 1025 requests)
const LEGENDARIES = new Set([
  "articuno", "zapdos", "moltres", "mewtwo", 
  "raikou", "entei", "suicune", "lugia", "ho-oh", 
  "regirock", "regice", "registeel", "latias", "latios", "kyogre", "groudon", "rayquaza",
  "uxie", "mesprit", "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina", "cresselia",
  "cobalion", "terrakion", "virizion", "tornadus", "thundurus", "reshiram", "zekrom", "landorus", "kyurem",
  "xerneas", "yveltal", "zygarde", 
  "type-null", "silvally", "tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini", "cosmog", "cosmoem", "solgaleo", "lunala", "necrozma",
  "zacian", "zamazenta", "eternatus", "kubfu", "urshifu", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex",
  "enamorus", "wo-chien", "chien-pao", "ting-lu", "chi-yu", "koraidon", "miraidon", "okidogi", "munkidori", "fezandipiti", "ogerpon", "terapagos"
]);

const MYTHICALS = new Set([
  "mew", "celebi", "jirachi", "deoxys", "phione", "manaphy", "darkrai", "shaymin", "arceus",
  "victini", "keldeo", "meloetta", "genesect", "diancie", "hoopa", "volcanion",
  "magearna", "marshadow", "zeraora", "meltan", "melmetal", "zarude", "pecharunt"
]);

const BABIES = new Set([
  "pichu", "cleffa", "igglybuff", "togepi", "tyrogue", "smoochum", "elekid", "magby",
  "azurill", "wynaut", "budew", "chingling", "bonsly", "mime-jr", "happiny", "munchlax",
  "riolu", "mantyke", "toxel"
]);

let globalIndexCache: NamedAPIResource[] | null = null;

export class PokemonSearchEngine {
  
  static async getGlobalIndex(): Promise<NamedAPIResource[]> {
    if (globalIndexCache) return globalIndexCache;
    const res = await PokeAPIClient.getPokemonList(10000, 0);
    globalIndexCache = res.results;
    return globalIndexCache;
  }

  static async search(filters: SearchFilters, limit: number, offset: number) {
    let results = await this.getGlobalIndex();

    // 1. Text Query Filter
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(p => {
        const id = p.url.split("/").slice(-2, -1)[0];
        return p.name.includes(q) || id === q;
      });
    }

    // 2. Type Filter (Fetch type list and intersect)
    if (filters.type !== "all") {
      try {
        const typeData = await PokeAPIClient.getType(filters.type);
        const typeNames = new Set(typeData.pokemon.map(p => p.pokemon.name));
        results = results.filter(p => typeNames.has(p.name));
      } catch (error) {
        console.warn(`Failed to filter by type ${filters.type}`, error);
      }
    }

    // 3. Generation Filter (Fetch generation list and intersect)
    // Note: Generation returns species names, which generally match the base pokemon names.
    if (filters.generation !== "all") {
      try {
        const genData = await PokeAPIClient.getGeneration(filters.generation);
        // Generation returns species. Some pokemon are forms (e.g. charizard-mega-x).
        // For strict filtering, we check if the pokemon name starts with the species name or matches it.
        const genSpeciesNames = new Set(genData.pokemon_species.map(s => s.name));
        results = results.filter(p => {
            // Check exact match first
            if (genSpeciesNames.has(p.name)) return true;
            // Check if it's a form of a species in this generation (e.g. aegislash-blade -> aegislash)
            const baseName = p.name.split("-")[0];
            return genSpeciesNames.has(baseName);
        });
      } catch (error) {
         console.warn(`Failed to filter by generation ${filters.generation}`, error);
      }
    }

    // 4. Special Filter (Legendary, Mythical, Baby)
    if (filters.special !== "all") {
      let targetSet: Set<string> | null = null;
      if (filters.special === "legendary") targetSet = LEGENDARIES;
      if (filters.special === "mythical") targetSet = MYTHICALS;
      if (filters.special === "baby") targetSet = BABIES;
      
      if (targetSet) {
        results = results.filter(p => {
            const baseName = p.name.split("-")[0];
            return targetSet!.has(p.name) || targetSet!.has(baseName);
        });
      }
    }

    // 5. Pagination
    const totalCount = results.length;
    const paginatedSlice = results.slice(offset, offset + limit);

    return {
      results: paginatedSlice,
      totalCount,
      hasMore: offset + limit < totalCount
    };
  }
}
