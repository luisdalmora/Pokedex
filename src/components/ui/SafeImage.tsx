"use client";

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
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

export const SafeImage = forwardRef<HTMLImageElement, SafeImageProps>(({ 
  src, 
  fallback = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png", 
  className, 
  alt,
  useSkeleton = true,
  onDrag,
  onDragStart,
  onDragEnd,
  onAnimationStart,
  ...props 
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const internalRef = useRef<HTMLImageElement>(null);

  // Sync refs: internal usage + external ref
  useImperativeHandle(ref, () => internalRef.current!);

  // Sync with prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setErrorCount(0);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Handle cached images
  useEffect(() => {
    if (internalRef.current?.complete && internalRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (errorCount === 0 && typeof src === "string" && src.includes("home")) {
      const officialArtwork = src.replace("other/home", "other/official-artwork");
      setCurrentSrc(officialArtwork);
      setErrorCount(1);
    } else {
      setCurrentSrc(fallback);
      setErrorCount(2);
      setHasError(true);
      setIsLoaded(true); 
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
        ref={internalRef}
        key={typeof currentSrc === "string" ? currentSrc : undefined}
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
        className={cn("w-full h-full object-contain", className)}
        {...props}
      />
    </div>
  );
});

SafeImage.displayName = "SafeImage";
