"use client";

import { forwardRef, useEffect, useState, useRef } from "react";
import { MapPin } from "lucide-react";

import NavButton from "@/components/shared/NavButton";

import { categories } from "@/data/categories";
import { siteInfo } from "@/data/site";

import type { Category } from "@/types/categories";
import CategoryNav from "./CategoryNav";
import CategorySection from "./CategorySection";
import Logo from "../shared/Logo";

interface MenuProps {
  onBack: () => void;
  onSelectCategory?: (category: Category) => void;
}

const Menu = forwardRef<HTMLElement, MenuProps>(({ onBack, onSelectCategory }, ref) => {
  const menuScrollRef = useRef<HTMLElement | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  useEffect(() => {
    const container = menuScrollRef.current;

    if (!container) return;

    const sections = container.querySelectorAll("[data-category]");

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (visibleSection) {
          const id = visibleSection.target.getAttribute("data-category");

          if (id) {
            setActiveCategory(id);
          }
        }
      },
      {
        root: container,
        threshold: 0.4,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={menuScrollRef}
      className="relative flex h-screen w-full shrink-0 snap-start flex-col bg-[#faf7f2]"
    >
      {/* Header */}

      <div className="flex flex-col items-center gap-2 px-8 pt-10 pb-5">
        <Logo />
      </div>

      {/* Sticky categories */}

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryClick}
      />
      {/* Scroll content */}

      <main className="flex-1 overflow-y-auto px-6 pb-5">
        <div className="mx-auto max-w-md">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </main>

      {/* Footer */}

      <div className="border-espresso/10 text-espresso mx-auto mb-14 flex w-full max-w-md items-center justify-between rounded-2xl border bg-white/60 px-4 py-4">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4" strokeWidth={1.5} />

          <div>
            <p className="text-sm font-semibold">{siteInfo.name}</p>

            <p className="font-farsi text-clay text-xs">{siteInfo.addressFa}</p>
          </div>
        </div>
      </div>

      <NavButton variant="bar" label="MENU" onClick={onBack} />
    </section>
  );
});

Menu.displayName = "Menu";

export default Menu;
