import { PokemonData, PokemonSpeciesData } from "@/types/pokeapi";
import { PokemonCardViewModel, PokemonDetailViewModel } from "@/types/view-models";

export class PokemonMapper {
  static toCardViewModel(pokemon: PokemonData, species?: PokemonSpeciesData): PokemonCardViewModel {
    return {
      id: pokemon.id,
      name: species?.names.find((n) => n.language.name === "en")?.name || pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      spriteUrl: pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default,
      generation: species ? this.extractGeneration(species.generation.name) : null,
    };
  }

  static toDetailViewModel(pokemon: PokemonData, species: PokemonSpeciesData): PokemonDetailViewModel {
    // Buscar descrição em inglês (ou português se existisse, mas a API raramente tem)
    const flavorTextEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    const description = flavorTextEntry
      ? flavorTextEntry.flavor_text.replace(/[\n\f\r]/g, " ")
      : null;

    return {
      id: pokemon.id,
      name: species.names.find((n) => n.language.name === "en")?.name || pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      height: pokemon.height / 10, // Converter decímetros para metros
      weight: pokemon.weight / 10, // Converter hectogramas para quilogramas
      baseExperience: pokemon.base_experience,
      stats: pokemon.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      abilities: pokemon.abilities.map((a) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })),
      generation: this.extractGeneration(species.generation.name),
      description,
      habitat: species.habitat?.name || null,
      color: species.color.name,
      shape: species.shape.name,
      isBaby: species.is_baby,
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      captureRate: species.capture_rate,
      eggGroups: species.egg_groups.map((eg) => eg.name),
      genderRate: species.gender_rate,
      sprites: {
        main: pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default,
        gallery: this.mapGallery(pokemon.sprites.versions),
        officialArtwork: pokemon.sprites.other?.["official-artwork"]?.front_default || null,
      },
    };
  }

  private static mapGallery(versions: any): any {
    if (!versions) return {};
    const gallery: any = {};
    for (const genKey of Object.keys(versions)) {
      gallery[genKey] = {};
      for (const verKey of Object.keys(versions[genKey])) {
        const ver = versions[genKey][verKey];
        gallery[genKey][verKey] = {
          front: ver.front_default || null,
          back: ver.back_default || null,
          shiny: ver.front_shiny || null,
          backShiny: ver.back_shiny || null,
        };
      }
    }
    return gallery;
  }

  private static extractGeneration(genName: string): number {
    const parts = genName.split("-");
    const roman = parts[1]?.toUpperCase();
    const romanMap: Record<string, number> = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
    };
    return romanMap[roman] || 1;
  }
}
