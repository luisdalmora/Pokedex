import React from "react";

export function Loader({ text = "SCANNING..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] text-[#38bdf8]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-[#1e3a8a] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#38bdf8] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-b-[#0ea5e9] rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#facc15] rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-xs font-bold tracking-widest animate-pulse font-pixel">{text}</div>
    </div>
  );
}

export function ErrorState({ message = "ERROR RETRIEVING DATA." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] text-[#ef4444]">
      <div className="w-16 h-16 mb-4 bg-red-500/20 border-2 border-red-500 rounded flex items-center justify-center animate-pulse">
        <span className="text-2xl font-black">!</span>
      </div>
      <div className="text-xs font-bold tracking-widest text-center">{message}</div>
    </div>
  );
}

export function EmptyState({ message = "NO DATA FOUND." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] text-[#94a3b8]">
      <div className="w-16 h-16 mb-4 border-2 border-dashed border-[#475569] rounded flex items-center justify-center">
        <span className="text-xl font-bold">?</span>
      </div>
      <div className="text-xs font-bold tracking-widest text-center">{message}</div>
    </div>
  );
}

export function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}
