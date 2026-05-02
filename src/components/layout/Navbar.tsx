"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Map, Database, Gamepad2, Heart, Search, Menu, X, Smartphone } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Regiões", href: "/regions", icon: Map },
  { name: "Pokédex", href: "/pokedex", icon: Database },
  { name: "Jogos", href: "/games", icon: Gamepad2 },
  { name: "Favoritos", href: "/favorites", icon: Heart },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
          isScrolled ? "py-4" : "py-8"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              "relative flex items-center justify-between px-6 py-3 rounded-[2rem] transition-all duration-500 border border-transparent",
              isScrolled
                ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl border-slate-100 dark:border-slate-800"
                : "bg-transparent"
            )}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:rotate-12 transition-transform">
                <Database size={20} className="text-white" />
              </div>
              <span className={cn(
                "text-xl font-black tracking-tighter uppercase transition-colors",
                isScrolled ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white lg:text-white"
              )}>
                Poké<span className="text-rose-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative group",
                      isActive
                        ? "text-rose-600"
                        : cn(
                            "text-slate-400 hover:text-slate-900 dark:hover:text-white",
                            !isScrolled && "lg:text-white/60 lg:hover:text-white"
                          )
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="flex items-center gap-2">
                      <link.icon size={14} className={isActive ? "text-rose-500" : "text-slate-400"} />
                      {link.name}
                    </span>
                    
                    {/* Hover indicator */}
                    {!isActive && (
                       <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-rose-500 rounded-full group-hover:w-4 transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-3 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 relative group",
                  !isScrolled && "lg:text-white lg:hover:bg-white/10"
                )}
              >
                <Search size={20} />
                <span className="absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity">Busca</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "lg:hidden p-3 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                  !isScrolled && "lg:text-white lg:hover:bg-white/10"
                )}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center">
                     <Database size={20} className="text-white" />
                   </div>
                   <span className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                     Menu
                   </span>
                 </div>
                 <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="flex-1 space-y-2">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all",
                        isActive 
                          ? "bg-rose-500 text-white shadow-xl shadow-rose-500/20" 
                          : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <link.icon size={20} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                 <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Seu Progresso</p>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                         <Smartphone size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">PokéHub Mobile</p>
                          <p className="text-[10px] font-bold text-slate-400">Em breve na App Store</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
