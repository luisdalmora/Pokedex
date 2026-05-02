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
  speed: 'Velocidade',
  accuracy: 'Precisão',
  evasion: 'Evasão'
};

export const damageClassTranslations = {
  physical: 'Físico',
  special: 'Especial',
  status: 'Status'
};

// Internal Fallbacks for typical Abilities and Moves if PT-BR is totally missing from PokeAPI
const internalAbilitiesFallback = {
  overgrow: 'Supercrescimento',
  blaze: 'Chama',
  torrent: 'Torrente',
  'shield-dust': 'Pó Escudo',
  'shed-skin': 'Troca de Pele',
  swarm: 'Enxame',
  keen_eye: 'Olho Vivo',
  run_away: 'Fuga',
  intimidate: 'Intimidação'
};

export const translateType = (type) => typeTranslations[type.toLowerCase()] || type;
export const translateStat = (stat) => statTranslations[stat.toLowerCase()] || stat;
export const translateDamageClass = (dmgClass) => damageClassTranslations[dmgClass?.toLowerCase()] || dmgClass || '-';

export const translateMethod = (method) => {
  if (!method) return '?';
  if (method === 'trade') return 'Troca';
  if (method.startsWith('level-')) return `Nível ${method.split('-')[1]}`;
  if (method.startsWith('item-')) return `Item: ${method.split('-').slice(1).join(' ')}`;
  if (method.startsWith('happiness-')) return `Felicidade ${method.split('-')[1]}`;
  if (method === 'use-item') return 'Usar Item';
  if (method === 'base') return 'Básico';
  return method;
};

// Helper for extracting PT-BR from arrays like flavor_text_entries or names
export const getPtBrText = (entries, fallbackProperty = 'name') => {
  if (!entries || !Array.isArray(entries)) return null;
  const ptEntry = entries.find(e => e.language.name === 'pt' || e.language.name === 'pt-BR');
  if (ptEntry) {
    if (ptEntry.flavor_text) return ptEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    if (ptEntry.name) return ptEntry.name;
  }
  
  // Fallback to English
  const enEntry = entries.find(e => e.language.name === 'en');
  if (enEntry) {
    if (enEntry.flavor_text) return enEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    if (enEntry.name) return enEntry.name;
  }
  
  return null;
};

export const getAbilityTranslation = (abilityName) => {
  return internalAbilitiesFallback[abilityName] || abilityName;
};
