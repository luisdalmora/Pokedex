import React from "react";
import { PokedexOSLed } from "./PokedexOSLed";
import { cn } from "@/utils/cn";

interface HeaderProps {
  moduleName: string;
  status?: "ONLINE" | "OFFLINE" | "SCANNING" | "ERROR";
}

export function PokedexOSHeader({ moduleName, status = "ONLINE" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-[#dc2626] border-b-4 border-[#991b1b] p-4 text-white relative shadow-md z-10">
      <div className="flex items-center gap-4">
        {/* Main Camera Lens */}
        <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] border-4 border-[#e5e7eb]">
          <div className="w-12 h-12 rounded-full bg-[#0284c7] border-2 border-[#1e3a8a] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full rotate-45 blur-[1px]"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full blur-[1px]"></div>
            <div className="w-4 h-4 bg-[#0ea5e9] rounded-full blur-[2px]"></div>
          </div>
        </div>

        {/* Small Status LEDs */}
        <div className="flex gap-2 mb-8">
          <PokedexOSLed color="red" size="sm" animate={status === "ERROR" ? "blink" : "none"} />
          <PokedexOSLed color="yellow" size="sm" animate={status === "SCANNING" ? "pulse" : "none"} />
          <PokedexOSLed color="green" size="sm" animate={status === "ONLINE" ? "pulse" : "none"} />
        </div>
      </div>

      <div className="flex flex-col items-end">
        <h1 className="text-2xl font-black italic tracking-tighter drop-shadow-md">POKÉDEX OS</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] uppercase font-bold bg-black/30 px-2 py-0.5 rounded text-[#facc15] border border-black/20">
            {moduleName}
          </span>
          <span className={cn(
            "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
            status === "ONLINE" ? "bg-green-500/20 text-green-300 border-green-500/50" : "",
            status === "SCANNING" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 animate-pulse" : "",
            status === "ERROR" ? "bg-red-500/20 text-red-300 border-red-500/50 animate-blink" : "",
            status === "OFFLINE" ? "bg-gray-500/20 text-gray-300 border-gray-500/50" : ""
          )}>
            SYS: {status}
          </span>
        </div>
      </div>
    </header>
  );
}
