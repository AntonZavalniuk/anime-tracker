"use client";

import { useState } from "react";
import { getPosterUrl, type PosterSize } from "@/lib/poster";

type AnimePosterProps = {
  src: string;
  alt: string;
  size?: PosterSize;
  className?: string;
};

export const AnimePoster = ({
  src,
  alt,
  size = "original",
  className,
}: AnimePosterProps) => {
  // Remember which src failed so a changed src gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === src ? src : getPosterUrl(src, size);

  return (
    // Plain <img>: poster URLs can come from imports with arbitrary hosts,
    // which next/image would reject unless every host is whitelisted.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        // Resized variant missing: fall back to the original URL
        if (resolvedSrc !== src) setFailedSrc(src);
      }}
    />
  );
};
