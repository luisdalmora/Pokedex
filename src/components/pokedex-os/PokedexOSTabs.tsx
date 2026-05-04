"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function PokedexOSTabs({ tabs, defaultTab, onTabChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex gap-1 overflow-x-auto os-scroll border-b-2 border-[#1f2937] pb-1 mb-3 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t-md border-2 border-b-0 whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9]/50 shadow-[0_-2px_10px_rgba(2,132,199,0.3)]"
                : "bg-[#111827] text-[#94a3b8] border-[#1f2937] hover:bg-[#1f2937] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto os-scroll pr-1 relative">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
