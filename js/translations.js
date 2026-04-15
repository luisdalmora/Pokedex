export const typeTranslations = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Planta',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terrestre',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
  fairy: 'Fada'
};

export const statTranslations = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade'
};

export const translateType = (type) => typeTranslations[type.toLowerCase()] || type;
export const translateStat = (stat) => statTranslations[stat.toLowerCase()] || stat;

export const translateMethod = (method) => {
  if (!method) return '?';
  if (method === 'trade') return 'Troca';
  if (method.startsWith('level-')) return `Nível ${method.split('-')[1]}`;
  if (method.startsWith('item-')) return `Item: ${method.split('-').slice(1).join(' ')}`;
  if (method.startsWith('happiness-')) return `Felicidade ${method.split('-')[1]}`;
  if (method === 'base') return 'Básico';
  return method;
};
