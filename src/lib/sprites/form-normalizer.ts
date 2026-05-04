export function normalizeFormName(pokemonName: string, speciesName: string): string | null {
  if (pokemonName === speciesName) return null;
  
  // Extract form from name (e.g., "venusaur-mega", "pikachu-alola")
  const formPart = pokemonName.replace(`${speciesName}-`, "");
  return formPart;
}

export function isSpecialForm(pokemonName: string, speciesName: string): boolean {
  return pokemonName !== speciesName;
}
