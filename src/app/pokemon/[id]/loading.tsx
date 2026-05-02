import React from "react";

export default function PokemonLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header Skeleton */}
      <div className="relative h-[35vh] lg:h-[40vh] w-full bg-slate-100 dark:bg-slate-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </div>

      {/* Float Image Skeleton */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[20vh] w-64 h-64 lg:w-80 lg:h-80 bg-white dark:bg-slate-800 rounded-full shadow-2xl animate-pulse border-8 border-white dark:border-slate-950 z-20" />

      <div className="container mx-auto px-6 mt-40 relative z-20 pb-20">
        <div className="flex flex-col items-center mb-16">
          <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 animate-pulse" />
          <div className="h-16 w-64 lg:w-96 bg-slate-100 dark:bg-slate-800 rounded-3xl mb-8 animate-pulse" />
          <div className="flex gap-4">
             <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
             <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="h-64 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
            <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
          </div>

          {/* Stats Side */}
          <div className="h-[500px] bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
