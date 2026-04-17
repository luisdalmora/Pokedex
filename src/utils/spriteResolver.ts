/**
 * Standardized Sprite Resolver for Pokédex Project
 * Level: Professional
 */

export const getOfficialArtwork = (id: number | string): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const getFallbackImage = (): string => {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
};

export const getSpriteByVersion = (id: number | string, version: string): string => {
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
  if (path) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/${path}`;
  }

  // Default to Official Artwork
  return getOfficialArtwork(id);
};
