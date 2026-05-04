export interface PokemonCardViewModel {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
  generation: number | null;
  isLegendary: boolean;
  isMythical: boolean;
}

export interface PokemonDetailViewModel {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  baseExperience: number;
  stats: {
    name: string;
    value: number;
  }[];
  abilities: {
    name: string;
    isHidden: boolean;
  }[];
  generation: number | null;
  description: string | null;
  habitat: string | null;
  color: string | null;
  shape: string | null;
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  captureRate: number;
  eggGroups: string[];
  genderRate: number;
  baseHappiness: number;
  growthRate: string | null;
  sprites: SpriteGallery;
  mainSpriteUrl: string;
  mainSpriteSource: string;
  forms: {
    name: string;
    url: string;
    isDefault: boolean;
  }[];
  varieties: {
    name: string;
    url: string;
    isDefault: boolean;
  }[];
}

export interface EvolutionTreeViewModel {
  id: number;
  speciesName: string;
  speciesUrl: string;
  spriteUrl: string | null;
  isBaby: boolean;
  evolvesTo: {
    details: EvolutionMethodDetails[];
    species: EvolutionTreeViewModel;
  }[];
}

export interface EvolutionMethodDetails {
  trigger: string;
  item: string | null;
  minLevel: number | null;
  minHappiness: number | null;
  timeOfDay: string | null;
  location: string | null;
  heldItem: string | null;
  knownMove: string | null;
  knownMoveType: string | null;
  gender: number | null;
  minBeauty: number | null;
  minAffection: number | null;
  needsOverworldRain: boolean;
  partySpecies: string | null;
  partyType: string | null;
  relativePhysicalStats: number | null;
  tradeSpecies: string | null;
  turnUpsideDown: boolean;
}

export interface TypeEffectivenessViewModel {
  type: string;
  weaknesses4x: string[];
  weaknesses2x: string[];
  normal1x: string[];
  resistances05x: string[];
  resistances025x: string[];
  immunities0x: string[];
}

export interface SpriteGallery {
  main: string | null;
  officialArtwork: string | null;
  home: string | null;
  dreamWorld: string | null;
  animated: string | null;
  versions: {
    [generation: string]: {
      [game: string]: {
        front: string | null;
        back: string | null;
        shiny: string | null;
        backShiny: string | null;
      };
    };
  };
}

export interface RegionViewModel {
  slug: string;
  name: string;
  generation: number;
  pokemonRange: string;
  starters: string[];
  legendaries: string[];
  mainGames: string[];
  description: string;
}

export interface GameViewModel {
  id: string;
  name: string;
  generation: number;
  region: string;
  console: string;
  year: number;
  spriteVersion: string;
  isRemake: boolean;
  originalGame: string | null;
  starters: string[];
  legendaries: string[];
  description: string;
  boxArt: string | null;
}
