export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const getTypeColor = (type: string) => POKEMON_TYPE_COLORS[type.toLowerCase()] || '#777';

export const getCardStyle = (type: string) => {
  const color = getTypeColor(type);
  return {
    '--type-color': color,
    backgroundColor: color,
  };
};
