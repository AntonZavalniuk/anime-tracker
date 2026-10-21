import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { StatsOverview, StatsOverviewFallback } from "@/components/stats-overview";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<StatsOverviewFallback />}>
          <StatsOverview />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
