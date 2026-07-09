// export default function Hero() {
//   return (
//     <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
//       <h1 className="mb-3 text-5xl font-bold">کافه فرندز</h1>

//       <p className="mb-16 text-lg text-[#8B7355]">به منوی دیجیتال خوش آمدید</p>

//       <button className="flex h-32 w-32 items-center justify-center rounded-full bg-[#4B3621] text-2xl font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95">
//         منو
//       </button>

//       <div className="mt-10 animate-bounce text-4xl">↓.</div>
//     </section>
//   );
// }
// "use client";

// import { forwardRef } from "react";
// import Image from "next/image";
// import NavButton from "../shared/NavButton";

// interface HeroProps {
//   onOpenMenu: () => void;
// }

// /**
//  * Full-screen landing section. Shows the cafe photo and a single
//  * round "MENU" button that scrolls the page down to <Menu />.
//  */
// const Hero = forwardRef<HTMLElement, HeroProps>(({ onOpenMenu }, ref) => {
//   return (
//     <section
//       ref={ref}
//       className="bg-latte relative h-screen w-full shrink-0 snap-start overflow-hidden"
//     >
//       <Image src="/images/hero.jpg" alt="Cafe interior" fill priority className="object-cover" />

//       {/* decorative leaf shadow, top-left */}
//       <svg
//         className="text-espresso/10 absolute -top-6 left-6 h-64 w-64 rotate-[20deg]"
//         viewBox="0 0 200 200"
//         fill="none"
//         aria-hidden
//       >
//         <path
//           d="M100 10 C 60 40, 40 90, 100 190 C 160 90, 140 40, 100 10 Z"
//           stroke="currentColor"
//           strokeWidth="2"
//         />
//         <path d="M100 20 L100 180" stroke="currentColor" strokeWidth="1.5" />
//         <path d="M100 60 L60 40 M100 60 L140 40" stroke="currentColor" strokeWidth="1.5" />
//         <path d="M100 100 L55 85 M100 100 L145 85" stroke="currentColor" strokeWidth="1.5" />
//         <path d="M100 140 L60 130 M100 140 L140 130" stroke="currentColor" strokeWidth="1.5" />
//       </svg>

//       {/* button + hint, centered */}
//       <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
//         <NavButton variant="circle" label="MENU" onClick={onOpenMenu} />

//         <svg width="40" height="40" viewBox="0 0 40 40" className="text-espresso" aria-hidden>
//           <path
//             d="M8 6 C 8 22, 20 26, 30 24"
//             stroke="currentColor"
//             strokeWidth="2"
//             fill="none"
//             strokeLinecap="round"
//           />
//           <path
//             d="M22 20 L30 24 L27 15"
//             stroke="currentColor"
//             strokeWidth="2"
//             fill="none"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>

//         <p dir="rtl" className="font-farsi text-espresso/90 text-center leading-8">
//           با زدن دکمه منو
//           <br />
//           منو باز می‌شود
//         </p>
//       </div>
//     </section>
//   );
// });

// Hero.displayName = "Hero";
// export default Hero;
"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { siteInfo } from "../../data/site";

interface HeroProps {
  onOpenMenu: () => void;
}

/**
 * Full-screen landing section. Shows the cafe photo, the cafe's
 * Farsi name/tagline, and a round "منو" button that scrolls the
 * page down to <Menu />.
 */
const Hero = forwardRef<HTMLElement, HeroProps>(({ onOpenMenu }, ref) => {
  return (
    <section
      ref={ref}
      className="bg-latte relative flex h-screen w-full shrink-0 snap-start flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* background photo */}
      <Image src="/images/hero.jpg" alt="Cafe interior" fill priority className="object-cover" />
      {/* lighten the photo so the dark text/button stay readable */}
      <div className="bg-latte/70 absolute inset-0" />

      {/* decorative leaf shadow, top-left */}
      <svg
        className="text-espresso/10 absolute -top-6 left-6 h-64 w-64 rotate-[20deg]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
      >
        <path
          d="M100 10 C 60 40, 40 90, 100 190 C 160 90, 140 40, 100 10 Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M100 20 L100 180" stroke="currentColor" strokeWidth="1.5" />
        <path d="M100 60 L60 40 M100 60 L140 40" stroke="currentColor" strokeWidth="1.5" />
        <path d="M100 100 L55 85 M100 100 L145 85" stroke="currentColor" strokeWidth="1.5" />
        <path d="M100 140 L60 130 M100 140 L140 130" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* content */}
      <div className="relative z-10 flex flex-col items-center" dir="rtl">
        <h1 className="font-display text-espresso mb-3 text-5xl font-bold">
          {siteInfo.heroTitleFa}
        </h1>

        <p className="font-farsi text-clay mb-16 text-lg">{siteInfo.heroSubtitleFa}</p>

        <button
          onClick={onOpenMenu}
          aria-label="باز کردن منو"
          className="text-latte bg-espresso flex h-32 w-32 items-center justify-center rounded-full text-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          منو
        </button>

        <button
          onClick={onOpenMenu}
          aria-label="پیمایش به سمت منو"
          className="text-clay mt-10 animate-bounce text-4xl"
        >
          ↓
        </button>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
