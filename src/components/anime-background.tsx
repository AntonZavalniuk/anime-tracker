export const AnimeBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden select-none">
      {/* Dark theme background image */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat transition-opacity duration-700 dark:block"
        style={{ backgroundImage: "url('/anime-bg-dark.png')" }}
      />

      {/* Light theme background image */}
      <div
        className="absolute inset-0 block bg-cover bg-center bg-no-repeat transition-opacity duration-700 dark:hidden"
        style={{ backgroundImage: "url('/anime-bg-light.png')" }}
      />

      {/* Overlay gradient & blur tint for maximum readability & aesthetic contrast */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px] transition-colors duration-500 dark:bg-background/50" />

      {/* Ambient glowing accent light blobs */}
      <div className="absolute -top-40 right-0 h-125 w-125 rounded-full bg-linear-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/0 opacity-80 blur-3xl" />
      <div className="absolute bottom-0 -left-40 h-100 w-100 rounded-full bg-linear-to-tr from-blue-500/15 via-teal-500/10 to-transparent opacity-80 blur-3xl" />
    </div>
  );
};
