export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="h-[35vh] lg:h-[40vh] bg-slate-200 dark:bg-slate-900 animate-skeleton" />
      
      <div className="container mx-auto px-6 -mt-8 relative z-20 pb-20 flex flex-col items-center">
        <div className="w-64 h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4 animate-skeleton" />
        <div className="w-96 h-16 bg-slate-200 dark:bg-slate-800 rounded-[2rem] mb-10 animate-skeleton" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-skeleton" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-skeleton" />
        </div>
      </div>
    </div>
  );
}
