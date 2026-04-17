"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  useSkeleton?: boolean;
}

export function SafeImage({ 
  src, 
  fallback = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png", 
  className, 
  alt,
  useSkeleton = true,
  ...props 
}: SafeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setErrorCount(0);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (errorCount === 0 && src?.includes("home")) {
      // First fallback: Try official artwork if HOME fails
      const officialArtwork = src.replace("other/home", "other/official-artwork");
      setCurrentSrc(officialArtwork);
      setErrorCount(1);
    } else {
      // Final fallback: Poke-ball
      setCurrentSrc(fallback);
      setErrorCount(2);
      setHasError(true);
      setIsLoaded(true); // Stop skeleton since we are showing fallback
    }
  };

  return (
    <div className={cn("relative overflow-hidden flex items-center justify-center", className)}>
      <AnimatePresence>
        {!isLoaded && useSkeleton && (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse z-10"
          />
        )}
      </AnimatePresence>
      
      <motion.img
        key={currentSrc} // Force re-render on src change to trigger onLoad/onError
        src={currentSrc}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          filter: hasError ? "grayscale(1) opacity(0.2)" : "none"
        }}
        transition={{ duration: 0.3 }}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={cn("w-full h-full object-contain", props.className)}
        {...props}
      />
    </div>
  );
}
