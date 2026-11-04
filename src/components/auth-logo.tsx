import Image from "next/image";

type AuthLogoProps = {
  subtitle: string;
};

export const AuthLogo = ({ subtitle }: AuthLogoProps) => {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="relative mb-4 h-20 w-20">
        <div
          aria-hidden
          className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-pink-400/40 via-fuchsia-400/30 to-sky-400/40 blur-xl dark:from-pink-500/30 dark:via-violet-500/30 dark:to-indigo-500/30"
        />
        <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-linear-to-br from-pink-100 via-fuchsia-50 to-sky-100 shadow-lg ring-1 shadow-pink-500/20 ring-black/5 dark:from-pink-500/20 dark:via-violet-500/20 dark:to-indigo-500/25 dark:shadow-indigo-500/20 dark:ring-white/15">
        <Image
          src="/auth-logo.webp"
          alt="My Anime List mascot"
          width={80}
          height={80}
          preload
          className="h-full w-full object-contain p-1 drop-shadow-md"
        />
        </div>
      </div>
      <h1 className="bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent">
        My Anime List
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};
