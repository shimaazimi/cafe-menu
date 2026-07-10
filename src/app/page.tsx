export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-950 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6f4e37_0%,transparent_60%)] opacity-40" />

      <section className="relative z-10 max-w-md text-center text-white">
        <span className="mb-5 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-sm text-amber-300">
          به کافه فرندز خوش آمدید
        </span>

        <h1 className="mb-6 text-5xl font-extrabold">Friends Cafe</h1>

        <p className="mb-10 leading-8 text-stone-300">
          طعم قهوه‌های خاص، نوشیدنی‌های تازه و لحظه‌هایی که دوست دارید دوباره تجربه‌شان کنید.
        </p>

        <a
          href="/menu"
          className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-black transition hover:scale-105 hover:bg-amber-400"
        >
          مشاهده منو
        </a>
      </section>
    </main>
  );
}
