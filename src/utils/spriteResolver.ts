/**
 * Standardized Sprite Resolver for Pokédex Project
 * Priority: HOME (3D) -> Official Artwork -> Default
 */

export const getOfficialArtwork = (id: number | string): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const getHomeSprite = (id: number | string): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
};

export const getDreamWorldSprite = (id: number | string): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
};

export const getShowdownSprite = (name: string, shiny = false): string => {
  const cleanName = String(name).toLowerCase().replace(' ', '');
  const prefix = shiny ? 'ani-shiny' : 'ani';
  return `https://play.pokemonshowdown.com/sprites/${prefix}/${cleanName}.gif`;
};

export const getFallbackImage = (): string => {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
};

/**
 * Returns the best available high-res image.
 * Uses HOME (3D) as priority, falling back to Official Artwork.
 */
export const getBestAvailableSprite = (id: number | string): string => {
  return getHomeSprite(id);
};

export const getSpriteByVersion = (id: number | string, version: string, name?: string): string => {
  const key = id;
  
  // Logic for Legacy/Pixel Sprites based on game versions
  const versionMap: Record<string, string> = {
    'red-blue': `generation-i/red-blue/transparent/${key}.png`,
    'yellow': `generation-i/yellow/transparent/${key}.png`,
    'gold': `generation-ii/gold/transparent/${key}.png`,
    'silver': `generation-ii/silver/transparent/${key}.png`,
    'crystal': `generation-ii/crystal/transparent/${key}.png`,
    'ruby-sapphire': `generation-iii/ruby-sapphire/${key}.png`,
    'emerald': `generation-iii/emerald/${key}.png`,
    'firered-leafgreen': `generation-iii/firered-leafgreen/${key}.png`,
    'diamond-pearl': `generation-iv/diamond-pearl/${key}.png`,
    'platinum': `generation-iv/platinum/${key}.png`,
    'heartgold-soulsilver': `generation-iv/heartgold-soulsilver/${key}.png`,
    'black-white': `generation-v/black-white/animated/${key}.gif`,
  };

  const path = versionMap[version];
  
  // Use Showdown for Gen 5+ animations if name is provided
  if (name && (version === 'black-white' || version === 'x-y' || version === 'sun-moon' || version === 'sword-shield' || version === 'scarlet-violet')) {
    return getShowdownSprite(name);
  }

  if (path) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/${path}`;
  }

  return getBestAvailableSprite(id);
};
