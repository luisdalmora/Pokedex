"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  pill?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
  actions?: Array<{
    label: string;
    href: string;
    icon?: React.ElementType;
    primary?: boolean;
  }>;
}

export function PageHeader({ 
  title, 
  subtitle, 
  pill, 
  backgroundImage = "/images/backgrounds/hero-bg.png",
  children,
  actions
}: PageHeaderProps) {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[400px] flex flex-col justify-center py-20 lg:py-32">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="" 
          className="w-full h-full object-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-8 lg:px-12 w-full relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            {pill && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-600/30 font-black text-xs uppercase tracking-widest">
                {pill}
              </div>
            )}
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-white">
              {title}
            </h1>
            <p className="text-slate-400 font-bold text-xl max-w-md">
              {subtitle}
            </p>
            
            {actions && actions.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {actions.map((action, idx) => (
                  <Link 
                    key={idx}
                    href={action.href} 
                    className={`
                      px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all
                      ${action.primary 
                        ? "bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20" 
                        : "bg-slate-800 hover:bg-slate-700"}
                    `}
                  >
                    {action.icon && <action.icon size={20} />}
                    {action.label}
                    {action.primary && <ChevronRight size={20} />}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {children && (
            <div className="w-full lg:max-w-md">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
