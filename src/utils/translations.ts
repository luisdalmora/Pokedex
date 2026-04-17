export const typeTranslations: Record<string, string> = {
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

export const statTranslations: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade',
  accuracy: 'Precisão',
  evasion: 'Evasão'
};

export const translateType = (type: string) => typeTranslations[type.toLowerCase()] || type;
export const translateStat = (stat: string) => statTranslations[stat.toLowerCase()] || stat;

export const getPtBrText = (entries: any[], preferredKey: string = 'flavor_text') => {
  if (!entries) return null;
  const ptEntry = entries.find(e => e.language.name === 'pt' || e.language.name === 'pt-BR');
  if (ptEntry) return ptEntry[preferredKey];
  
  const enEntry = entries.find(e => e.language.name === 'en');
  return enEntry ? enEntry[preferredKey] : null;
};
