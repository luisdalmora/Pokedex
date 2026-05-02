export interface PokemonCardViewModel {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
  generation: number | null;
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
  color: string;
  shape: string;
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  captureRate: number;
  eggGroups: string[];
  genderRate: number;
  sprites: {
    main: string | null;
    gallery: {
      [generation: string]: {
        [version: string]: {
          front: string | null;
          back: string | null;
          shiny: string | null;
          backShiny: string | null;
        }
      }
    };
    officialArtwork: string | null;
  };
}

export interface EvolutionTreeViewModel {
  id: number;
  speciesName: string;
  speciesUrl: string;
  isBaby: boolean;
  evolvesTo: {
    details: any[]; // Mapped details
    species: EvolutionTreeViewModel;
  }[];
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
