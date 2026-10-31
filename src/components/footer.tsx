import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
      <p>
        Anime Tracker •{" "}
        <Link
          title="https://github.com/AntonZavalniuk/anime-tracker"
          href="https://github.com/AntonZavalniuk/anime-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
        >
          Anton Zavalniuk
        </Link>
      </p>
    </footer>
  );
};
