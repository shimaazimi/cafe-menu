export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 text-5xl font-bold">کافه فرندز</h1>

      <p className="mb-16 text-lg text-[#8B7355]">به منوی دیجیتال خوش آمدید</p>

      <button className="flex h-32 w-32 items-center justify-center rounded-full bg-[#4B3621] text-2xl font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95">
        منو
      </button>

      <div className="mt-10 animate-bounce text-4xl">↓.</div>
    </section>
  );
}
