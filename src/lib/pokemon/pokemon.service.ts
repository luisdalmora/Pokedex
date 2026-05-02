import { PokeApiClient } from "../pokeapi/client";
import { ENDPOINTS } from "../pokeapi/endpoints";
import { PokemonData, PokemonSpeciesData, PaginatedResponse, NamedAPIResource } from "@/types/pokeapi";
import { PokemonMapper } from "./pokemon.mapper";
import { PokemonCardViewModel, PokemonDetailViewModel } from "@/types/view-models";

export class PokemonService {
  static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonCardViewModel[]> {
    const listResponse = await PokeApiClient.fetch<PaginatedResponse<NamedAPIResource>>(
      ENDPOINTS.pokemonList(limit, offset)
    );

    const detailedPokemons = await Promise.all(
      listResponse.results.map(async (p) => {
        const id = p.url.split("/").filter(Boolean).pop()!;
        try {
          const pokemon = await PokeApiClient.fetch<PokemonData>(ENDPOINTS.pokemon(id));
          return PokemonMapper.toCardViewModel(pokemon);
        } catch (error) {
          console.error(`Failed to fetch basic info for pokemon ${id}`, error);
          return null;
        }
      })
    );

    return detailedPokemons.filter((p): p is PokemonCardViewModel => p !== null);
  }

  static async getPokemonDetail(idOrName: string | number): Promise<PokemonDetailViewModel> {
    const pokemon = await PokeApiClient.fetch<PokemonData>(ENDPOINTS.pokemon(idOrName));
    const species = await PokeApiClient.fetch<PokemonSpeciesData>(ENDPOINTS.pokemonSpecies(pokemon.species.name));

    return PokemonMapper.toDetailViewModel(pokemon, species);
  }

  static async getRegionalPokedex(regionName: string) {
    // Para simplificar, o Pokedex da API para 'kanto' é id 2, 'national' é id 1.
    const pokedexId = regionName.toLowerCase() === "kanto" ? 2 : 1;
    const pokedex = await PokeApiClient.fetch<any>(ENDPOINTS.pokedex(pokedexId));
    
    // pokedex.pokemon_entries contém os IDs
    return pokedex.pokemon_entries.map((entry: any) => ({
      entryNumber: entry.entry_number,
      pokemonSpecies: entry.pokemon_species
    }));
  }
}
