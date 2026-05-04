import { PokemonCardViewModel } from "@/types/view-models";

const FAVORITES_KEY = "pokedex_os_favorites";

export function getFavorites(): PokemonCardViewModel[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error parsing favorites", e);
    return [];
  }
}

export function isFavorite(id: number): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === id);
}

export function toggleFavorite(pokemon: PokemonCardViewModel): boolean {
  if (typeof window === "undefined") return false;
  
  let favorites = getFavorites();
  const exists = favorites.some(f => f.id === pokemon.id);
  
  if (exists) {
    favorites = favorites.filter(f => f.id !== pokemon.id);
  } else {
    favorites.push({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      spriteUrl: pokemon.spriteUrl,
      generation: pokemon.generation,
      isLegendary: pokemon.isLegendary,
      isMythical: pokemon.isMythical
    });
    // Sort by ID
    favorites.sort((a, b) => a.id - b.id);
  }
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    // Dispatch an event so other components can sync if needed
    window.dispatchEvent(new Event('favoritesUpdated'));
    return !exists;
  } catch (e) {
    console.error("Error saving favorites", e);
    return exists;
  }
}
