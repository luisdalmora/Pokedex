import React from "react";
import { STAT_TRANSLATIONS } from "@/lib/constants/translations";

interface PokemonStatsProps {
  stats: { name: string; value: number }[];
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({ stats }) => {
  const maxStat = 255;

  return (
    <div className="space-y-3">
      {stats.map((stat) => {
        const label = STAT_TRANSLATIONS[stat.name] || stat.name;
        const percentage = Math.min(100, Math.max(0, (stat.value / maxStat) * 100));
        
        // Cor baseada no valor
        let colorClass = "bg-red-500";
        if (stat.value >= 90) colorClass = "bg-green-500";
        else if (stat.value >= 60) colorClass = "bg-yellow-500";
        else if (stat.value >= 40) colorClass = "bg-orange-500";

        return (
          <div key={stat.name} className="flex items-center text-xs">
            <span className="w-24 text-gray-400 capitalize font-medium">{label}</span>
            <span className="w-8 text-right mr-3 font-pixel text-[10px]">{stat.value}</span>
            <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
              <div 
                className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
