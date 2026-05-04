import React from "react";

interface StatusBarProps {
  apiStatus?: "PokeAPI Connected" | "Cached Data" | "Offline";
  itemsCount?: number;
  message?: string;
}

export function PokedexOSStatusBar({ apiStatus = "PokeAPI Connected", itemsCount = 0, message = "System Ready" }: StatusBarProps) {
  return (
    <footer className="bg-[#111827] border-t border-[#1f2937] px-4 py-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono z-10">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {apiStatus}
        </span>
        <span className="text-[#38bdf8]">&gt;_ {message}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {itemsCount > 0 && (
          <span>Records: {itemsCount.toString().padStart(4, "0")}</span>
        )}
        <span>V 3.0 KANTO BUILD</span>
      </div>
    </footer>
  );
}
