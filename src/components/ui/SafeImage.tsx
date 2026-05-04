"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface SafeImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "/fallback-placeholder.png",
  width = 96,
  height = 96,
  priority = false
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const imageSrc = error || !src ? fallbackSrc : src;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full animate-pulse">
          <div className="w-1/2 h-1/2 rounded-full border-2 border-[#38bdf8] border-t-transparent animate-spin"></div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "object-contain transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          error ? "opacity-50 grayscale" : ""
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        unoptimized
      />
    </div>
  );
}
