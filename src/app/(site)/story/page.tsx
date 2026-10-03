import BrandMark from "@/components/shared/BrandMark";
import { siteInfo } from "@/data/site";

export default function StoryPage() {
  return (
    <main dir="rtl" className="bg-latte min-h-screen">
      <div className="bg-ink flex flex-col items-center gap-2 px-6 pt-8 pb-8 text-center md:py-14">
        <BrandMark size={44} />
        <h1 className="font-farsi-display text-gold-light mt-4 text-2xl md:text-3xl">داستان ما</h1>
      </div>

      <div className="divider-ornate" aria-hidden />

      <div className="mx-auto max-w-md px-6 pt-6 pb-16 md:max-w-2xl md:pt-12 md:pb-24">
        <div className="font-farsi text-clay space-y-4 leading-8 md:text-lg md:leading-9">
          <p>
            {siteInfo.name} از سال {siteInfo.establishedYear} با یک ایده ساده شروع شد: جایی که
            دوستان دور هم جمع می‌شوند، قهوه‌ای تازه می‌نوشند و لحظه‌هایی ساده اما به‌یادماندنی
            می‌سازند.
          </p>

          <p>
            هر فنجان با دقت و عشق دم می‌شود، از دانه‌های تازه برشته‌شده تا شیرینی‌های خانگی، تا حس
            آشنای رفاقت را در هر نوشیدنی حس کنید.
          </p>

          <p>
            ما را در {siteInfo.addressFa} پیدا کنید، یا از طریق اینستاگرام{" "}
            {siteInfo.instagramHandle} همراه ما باشید.
          </p>
        </div>
      </div>

      <div className="h-16 md:hidden" aria-hidden />
    </main>
  );
}
