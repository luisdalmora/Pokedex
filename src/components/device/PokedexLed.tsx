import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface PokedexLedProps {
  size?: "small" | "large";
  color?: "blue" | "red" | "yellow" | "green";
  glow?: boolean;
  className?: string;
}

export const PokedexLed: React.FC<PokedexLedProps> = ({ 
  size = "small", 
  color = "red",
  glow = false,
  className
}) => {
  const baseClasses = "rounded-full shadow-md border-2 border-white/20 relative before:absolute before:top-1 before:left-1 before:w-1/4 before:h-1/4 before:bg-white/60 before:rounded-full";
  
  const sizeClasses = {
    small: "w-4 h-4",
    large: "w-16 h-16 border-4 border-white/40",
  };

  const colorClasses = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    green: "bg-green-500",
  };

  const glowClasses = {
    blue: "shadow-[0_0_15px_rgba(59,130,246,0.8)]",
    red: "shadow-[0_0_15px_rgba(239,68,68,0.8)]",
    yellow: "shadow-[0_0_15px_rgba(250,204,21,0.8)]",
    green: "shadow-[0_0_15px_rgba(34,197,94,0.8)]",
  };

  return (
    <div 
      className={twMerge(
        clsx(
          baseClasses,
          sizeClasses[size],
          colorClasses[color],
          glow && glowClasses[color],
          glow && "animate-pulse"
        ),
        className
      )}
    />
  );
};
