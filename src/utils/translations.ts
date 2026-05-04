export const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Venenoso",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
};

export const STAT_TRANSLATIONS: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defesa Especial",
  speed: "Velocidade",
};

export const EVOLUTION_METHOD_TRANSLATIONS: Record<string, string> = {
  "level-up": "Subir de Nível",
  trade: "Troca",
  "use-item": "Usar Item",
  shed: "Troca de Pele",
  spin: "Girar",
  "tower-of-darkness": "Torre das Trevas",
  "tower-of-waters": "Torre das Águas",
  "three-critical-hits": "Três Acertos Críticos",
  "take-damage": "Receber Dano",
  other: "Outro",
};

export function translateType(type: string): string {
  return TYPE_TRANSLATIONS[type.toLowerCase()] || type;
}

export function translateStat(stat: string): string {
  return STAT_TRANSLATIONS[stat.toLowerCase()] || stat;
}

export function translateEvolutionMethod(method: string): string {
  return EVOLUTION_METHOD_TRANSLATIONS[method.toLowerCase()] || method;
}
