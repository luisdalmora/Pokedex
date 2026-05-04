export const GENERATION_MAP: Record<number, { name: string; versions: string[] }> = {
  1: { name: "generation-i", versions: ["red-blue", "yellow"] },
  2: { name: "generation-ii", versions: ["crystal", "gold", "silver"] },
  3: { name: "generation-iii", versions: ["emerald", "firered-leafgreen", "ruby-sapphire"] },
  4: { name: "generation-iv", versions: ["diamond-pearl", "heartgold-soulsilver", "platinum"] },
  5: { name: "generation-v", versions: ["black-white"] },
  6: { name: "generation-vi", versions: ["omegaruby-alphasapphire", "x-y"] },
  7: { name: "generation-vii", versions: ["ultra-sun-ultra-moon"] }, // Note: PokeAPI sometimes uses icons for gen 7/8
  8: { name: "generation-viii", versions: ["icons"] }
};

export function getGenerationName(gen: number): string | null {
  return GENERATION_MAP[gen]?.name || null;
}

export function getDefaultVersionForGeneration(gen: number): string | null {
  const versions = GENERATION_MAP[gen]?.versions;
  if (!versions || versions.length === 0) return null;
  // Prefer specific versions based on user rules
  if (gen === 1) return "red-blue"; // user prefers red/blue for 1
  if (gen === 2) return "crystal";
  if (gen === 3) return "emerald";
  if (gen === 4) return "platinum";
  if (gen === 5) return "black-white";
  return versions[0];
}

// Convert "generation-i" to 1
export function extractGenerationNumber(genName: string): number | null {
  const map: Record<string, number> = {
    "generation-i": 1,
    "generation-ii": 2,
    "generation-iii": 3,
    "generation-iv": 4,
    "generation-v": 5,
    "generation-vi": 6,
    "generation-vii": 7,
    "generation-viii": 8,
    "generation-ix": 9
  };
  return map[genName] || null;
}
