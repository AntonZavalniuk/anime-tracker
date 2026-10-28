import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import { getAnimeBatch, getAnimeCounts } from "@/actions/anime";
import { getTableSettings } from "@/actions/table-settings";
import { AnimeProvider } from "@/context/anime-context";
import { Navbar, NavbarFallback } from "@/components/navbar";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { Toaster } from "@/components/ui/toast";

const ProtectedLayoutContent = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  await verifySession();

  const [initialBatch, counts, tableSettings] = await Promise.all([
    getAnimeBatch({ offset: 0, limit: 25, status: "AIRING" }),
    getAnimeCounts(),
    getTableSettings(),
  ]);

  return (
    <AnimeProvider
      initialBatch={initialBatch}
      initialCounts={counts}
      initialTableSettings={{
        viewMode: tableSettings.viewMode,
        showOriginalTitle: tableSettings.showOriginalTitle,
        showPosterInTableRow: tableSettings.showPosterInTableRow,
      }}
    >
      <Navbar />
      {children}
    </AnimeProvider>
  );
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent font-sans selection:bg-indigo-500/20 selection:text-indigo-500">
      <Suspense fallback={<NavbarFallback />}>
        <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
      </Suspense>
      <ScrollToTopButton />
      <Toaster />
    </div>
  );
}
