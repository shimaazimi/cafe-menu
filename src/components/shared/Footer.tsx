import Link from "next/link";
import { AtSign, MapPin } from "lucide-react";

import BrandMark from "@/components/shared/BrandMark";
import { siteInfo } from "@/data/site";

const links = [
  { href: "/shop", label: "فروشگاه" },
  { href: "/coffee-finder", label: "انتخاب قهوه" },
  { href: "/about", label: "درباره ما" },
  { href: "/business", label: "همکاری با ما" },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-ink text-latte border-gold/15 border-t pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr_1fr] md:px-10 md:py-14">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark size={42} />
            <div>
              <p className="font-farsi-display text-gold-light text-2xl">{siteInfo.name}</p>
              <p className="font-farsi text-latte/50 text-xs">قهوه تازه از قلب بازار تهران</p>
            </div>
          </div>
          <p className="font-farsi text-latte/60 mt-4 max-w-sm text-sm leading-7">
            انتخاب ساده قهوه برای خانه، محل کار و کافه؛ با توضیح روشن، وزن دلخواه و آسیاب متناسب با
            روش دم‌آوری شما.
          </p>
        </div>

        <div>
          <p className="font-farsi text-gold-light text-sm font-bold">دسترسی سریع</p>
          <nav className="mt-4 grid gap-3">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-farsi text-latte/60 hover:text-gold-light text-sm transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="font-farsi text-gold-light text-sm font-bold">راه‌های ارتباطی</p>
          <div className="font-farsi text-latte/60 mt-4 space-y-3 text-sm leading-7">
            <p className="flex items-start gap-2">
              <MapPin className="text-gold mt-1 h-4 w-4 shrink-0" />
              {siteInfo.addressFa}
            </p>
            {siteInfo.instagramHandle && (
              <p className="flex items-center gap-2">
                <AtSign className="text-gold h-4 w-4" />
                {siteInfo.instagramHandle}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="border-gold/10 font-farsi text-latte/40 border-t px-6 py-4 text-center text-xs">
        © {new Date().getFullYear()} {siteInfo.name} — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
