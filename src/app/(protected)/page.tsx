import { Footer } from "@/components/footer";
import { FilterControls } from "@/components/filter-controls";
import { AnimeView } from "@/components/anime-view";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <FilterControls />
        {/*ANIME LIST OR GRID*/}
        <AnimeView />
      </main>

      <Footer />
    </>
  );
}
