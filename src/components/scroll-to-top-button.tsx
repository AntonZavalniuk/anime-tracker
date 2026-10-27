"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const SCROLL_THRESHOLD = 400;

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={scrollToTop}
      title="Scroll to top"
      aria-label="Scroll to top"
      className={cn(
        "fixed right-4 bottom-4 cursor-pointer z-40 rounded-full shadow-lg transition-all duration-300 sm:right-6 sm:bottom-6",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
};
