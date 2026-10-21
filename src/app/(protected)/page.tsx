import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";
import { Navbar, NavbarFallback } from "@/components/navbar";
import { Footer } from "@/components/footer";

const FeatureSchema = z.object({
  name: z.string(),
  status: z.string(),
  description: z.string(),
});

type Feature = z.infer<typeof FeatureSchema>;

export default function Home() {
  const currentTime = Temporal.Now.instant().toString();

  const rawStack = [
    {
      name: "Next.js 16 + Tailwind CSS v4",
      status: "Ready",
      description: "App router, Server Components, and Turbopack styling.",
    },
    {
      name: "shadcn/ui",
      status: "Configured",
      description: "Accessible, customizable UI primitives installed.",
    },
    {
      name: "Prisma 8",
      status: "Connected",
      description: "Next-gen Prisma schema, config, and generated client.",
    },
    {
      name: "jose & server-only",
      status: "Installed",
      description: "JWT/JWS/JWE cryptography and server-only protection.",
    },
    {
      name: "temporal-polyfill & zod",
      status: "Installed",
      description: "Modern date-time handling and runtime schema validation.",
    },
  ];

  const stack: Feature[] = z.array(FeatureSchema).parse(rawStack);

  return (
    <div className="flex min-h-screen flex-col bg-transparent font-sans selection:bg-indigo-500/20 selection:text-indigo-500">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-3xl font-bold tracking-tight">Anime Tracker</h1>
            <Badge variant="outline">Template Ready</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Current system time: {currentTime}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stack.map((item) => (
            <Card key={item.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Your Next.js project is fully bootstrapped with your requested
              stack.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Explore Components</Button>
            <Button variant="outline">Prisma Docs</Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
