import React from "react";
import { cn } from "@/utils/cn";

interface ScannerProps extends React.HTMLAttributes<HTMLDivElement> {
  isScanning?: boolean;
}

export function PokedexOSScanner({ isScanning = false, className, children, ...props }: ScannerProps) {
  return (
    <div 
      className={cn(
        "relative w-full h-full bg-[#020617] border-4 border-[#374151] rounded-lg overflow-hidden flex flex-col",
        "shadow-[inset_0_0_50px_rgba(2,132,199,0.15)]",
        className
      )}
      {...props}
    >
      {/* Glare effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/3 z-20"></div>
      
      {/* Scanline background */}
      <div className="pointer-events-none absolute inset-0 scanline-effect opacity-60 z-10"></div>
      
      {/* Active scanning bar */}
      {isScanning && (
        <div className="pointer-events-none absolute left-0 right-0 h-4 bg-cyan-400/30 blur-sm animate-[scanline_3s_linear_infinite] z-20"></div>
      )}

      {/* Internal Content Area */}
      <div className="relative z-30 flex-1 flex flex-col p-4 overflow-hidden">
        {children}
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0ea5e9]/50 z-20 m-2"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0ea5e9]/50 z-20 m-2"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0ea5e9]/50 z-20 m-2"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0ea5e9]/50 z-20 m-2"></div>
    </div>
  );
}
