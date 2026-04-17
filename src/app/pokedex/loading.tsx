import { PokemonSkeleton } from "@/components/pokemon/PokemonCard";

export default function Loading() {
  return (
    <div className="p-8 lg:p-12">
      <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mb-12 animate-skeleton" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {[...Array(15)].map((_, i) => (
          <PokemonSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
