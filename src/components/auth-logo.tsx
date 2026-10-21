import { Tv } from "lucide-react";

type AuthLogoProps = {
  subtitle: string;
};

export const AuthLogo = ({ subtitle }: AuthLogoProps) => {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Tv className="h-8 w-8" />
      </div>
      <h1 className="bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent">
        My Anime List
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};
