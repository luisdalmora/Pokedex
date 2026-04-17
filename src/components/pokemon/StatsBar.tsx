"use client";

import { motion } from "framer-motion";
import { translateStat } from "@/utils/translations";
import { getTypeColor } from "@/utils/pokemonStyles";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsBarProps {
  label: string;
  value: number;
  max?: number;
  type: string;
  isHighest?: boolean;
}

export function StatsBar({ label, value, max = 255, type, isHighest }: StatsBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {translateStat(label)}
        </span>
        <span className={cn(
          "text-sm font-black",
          isHighest ? "text-slate-900 dark:text-white" : "text-slate-500"
        )}>
          {value}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ backgroundColor: getTypeColor(type) }}
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isHighest && "brightness-125 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          )}
        />
      </div>
    </div>
  );
}
