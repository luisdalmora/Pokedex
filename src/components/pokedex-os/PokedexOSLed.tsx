import React from "react";
import { cn } from "@/utils/cn";

interface LedProps {
  color?: "red" | "green" | "blue" | "yellow";
  size?: "sm" | "md" | "lg";
  animate?: "blink" | "pulse" | "none";
  active?: boolean;
}

export function PokedexOSLed({ 
  color = "red", 
  size = "md", 
  animate = "none",
  active = true 
}: LedProps) {
  const baseClasses = "rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5),_inset_2px_2px_4px_rgba(255,255,255,0.4)]";
  
  const colors = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400"
  };

  const glows = {
    red: "shadow-[0_0_10px_rgba(239,68,68,0.8)]",
    green: "shadow-[0_0_10px_rgba(34,197,94,0.8)]",
    blue: "shadow-[0_0_10px_rgba(59,130,246,0.8)]",
    yellow: "shadow-[0_0_10px_rgba(250,204,21,0.8)]"
  };

  const sizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  const animations = {
    none: "",
    blink: "animate-blink",
    pulse: "animate-pulse"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        colors[color],
        sizes[size],
        active ? glows[color] : "opacity-30",
        active && animate !== "none" ? animations[animate] : ""
      )}
    />
  );
}
