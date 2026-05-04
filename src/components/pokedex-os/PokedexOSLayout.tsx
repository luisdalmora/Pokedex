"use client";

import React from "react";
import { PokedexOSHeader } from "./PokedexOSHeader";
import { PokedexOSStatusBar } from "./PokedexOSStatusBar";
import { PokedexOSScanner } from "./PokedexOSScanner";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutProps {
  moduleName: string;
  status?: "ONLINE" | "OFFLINE" | "SCANNING" | "ERROR";
  isScanning?: boolean;
  message?: string;
  itemsCount?: number;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/", label: "BOOT" },
  { href: "/pokedex", label: "NATIONAL DB" },
  { href: "/regions/kanto", label: "KANTO OS" },
  { href: "/regions", label: "REGIONS" },
  { href: "/games", label: "GAMES" },
  { href: "/favorites", label: "FAVORITES" },
];

export function PokedexOSLayout({ 
  moduleName, 
  status = "ONLINE", 
  isScanning = false, 
  message = "System Ready",
  itemsCount = 0,
  rightPanel,
  children 
}: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#dc2626] selection:bg-[#38bdf8] selection:text-white">
      <PokedexOSHeader moduleName={moduleName} status={status} />
      
      <main className="flex-1 flex overflow-hidden p-2 md:p-4 gap-4 pb-0 relative">
        {/* Left Navigation Panel - Hidden on very small screens, visible as a sidebar on md+ */}
        <nav className="hidden md:flex flex-col w-48 bg-[#991b1b] rounded-t-xl border-4 border-b-0 border-[#7f1d1d] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] p-2 z-10 overflow-y-auto os-scroll">
          <div className="text-[#facc15] font-black italic mb-4 mt-2 px-2 border-b-2 border-[#7f1d1d] pb-2 text-sm">
            MODULE SELECT
          </div>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`block px-3 py-2 text-xs font-bold uppercase rounded border-2 transition-colors ${
                    isActive 
                    ? "bg-[#1f2937] text-[#38bdf8] border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                    : "bg-[#7f1d1d] text-white border-[#991b1b] hover:bg-[#111827] hover:text-white"
                  }`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Central Scanner Area */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#0f172a] rounded-t-xl border-4 border-b-0 border-[#1f2937] p-2 relative shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] z-10">
          <PokedexOSScanner isScanning={isScanning} className="flex-1">
             {children}
          </PokedexOSScanner>
        </section>

        {/* Right Contextual Panel */}
        {rightPanel && (
          <aside className="hidden lg:flex flex-col w-80 bg-[#111827] rounded-t-xl border-4 border-b-0 border-[#1f2937] p-3 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] z-10 overflow-y-auto os-scroll">
            {rightPanel}
          </aside>
        )}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden flex bg-[#991b1b] overflow-x-auto os-scroll py-2 px-2 gap-2 border-t-4 border-[#7f1d1d] z-20">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`flex-shrink-0 px-3 py-2 text-[10px] font-bold uppercase rounded border-2 ${
              isActive 
              ? "bg-[#1f2937] text-[#38bdf8] border-[#38bdf8]" 
              : "bg-[#7f1d1d] text-white border-[#991b1b]"
            }`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <PokedexOSStatusBar apiStatus="PokeAPI Connected" message={message} itemsCount={itemsCount} />
    </div>
  );
}
