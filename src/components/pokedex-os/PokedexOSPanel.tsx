import React from "react";
import { cn } from "@/utils/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: "default" | "screen" | "glass";
}

export function PokedexOSPanel({ title, variant = "default", className, children, ...props }: PanelProps) {
  const base = "relative overflow-hidden rounded-md border";
  
  const variants = {
    default: "bg-[#0f172a] border-[#1f2937] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]",
    screen: "bg-[#020617] border-[#0ea5e9]/30 shadow-[inset_0_0_30px_rgba(2,132,199,0.2)]",
    glass: "bg-[#0f172a]/80 backdrop-blur-md border-[#1f2937]/50"
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props}>
      {title && (
        <div className="bg-[#1f2937] px-3 py-1.5 border-b border-[#374151] flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] font-bold">
            {title}
          </span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#facc15]/50"></div>
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      
      {variant === "screen" && (
        <div className="pointer-events-none absolute inset-0 scanline-effect opacity-50"></div>
      )}
    </div>
  );
}
