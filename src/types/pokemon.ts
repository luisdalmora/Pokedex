export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonSummary {
  id: number;
  name: string;
  types: string[];
  image: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
    versions?: any;
  };
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionLink;
}

export interface EvolutionLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionLink[];
}

export interface EvolutionDetail {
  item: { name: string; url: string } | null;
  trigger: { name: string; url: string };
  min_level: number | null;
  gender: number | null;
  location: { name: string; url: string } | null;
  held_item: { name: string; url: string } | null;
  known_move: { name: string; url: string } | null;
  known_move_type: { name: string; url: string } | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  relative_physical_stats: number | null;
  party_species: { name: string; url: string } | null;
  party_type: { name: string; url: string } | null;
  trade_species: { name: string; url: string } | null;
  needs_overworld_rain: boolean;
  turn_upside_down: boolean;
  time_of_day?: string | null;
}
