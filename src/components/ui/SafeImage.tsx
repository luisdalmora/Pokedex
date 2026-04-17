"use client";

import { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ src, fallback = "/images/items/poke-ball.png", className, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      className={className}
      alt={alt}
      style={error ? { opacity: 0.2, ...props.style } : props.style}
      onError={() => setError(true)}
      {...props}
    />
  );
}
