import { POKEAPI_BASE_URL } from "./endpoints";

export class PokeApiClient {
  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${POKEAPI_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        next: { revalidate: 86400 }, // Cache de 24 horas por padrão (Next.js App Router)
        ...options,
      });

      if (!response.ok) {
        throw new Error(`PokeAPI fetch failed: ${response.status} ${response.statusText} at ${url}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[PokeAPI Error]:", error);
      throw error;
    }
  }
}
