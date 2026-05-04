"use client";
import React, { useEffect, useState } from "react";
import { PokedexOSScanner } from "./PokedexOSScanner";

export function PokedexOSBoot({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const bootSequence = [
      "INITIATING BOOT SEQUENCE...",
      "LOADING KERNEL v3.0...",
      "MOUNTING /dev/sda1... OK",
      "CHECKING MEMORY... 640K OK",
      "STARTING POKÉDEX OS...",
      "CONNECTING TO PROF. OAK DATABASE...",
      "AUTHENTICATING...",
      "ACCESS GRANTED.",
      "LOADING REGION: KANTO...",
      "INITIALIZING SCANNER MODULE...",
      "SYSTEM READY."
    ];

    let delay = 0;
    bootSequence.forEach((line, index) => {
      delay += Math.random() * 200 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, [onComplete]);

  return (
    <PokedexOSScanner className="h-full items-center justify-center font-pixel text-[#22c55e] p-8">
      <div className="w-full max-w-2xl h-full flex flex-col justify-end text-sm md:text-base text-shadow-[0_0_5px_#22c55e]">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
        <div className="animate-blink mt-2">_</div>
      </div>
    </PokedexOSScanner>
  );
}
