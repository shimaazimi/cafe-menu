"use client";

import { useRef } from "react";
import Hero from "@/components/hero/Hero";
import Menu from "@/components/menu/Menu";
import type { Category } from "../../types/categories";

/**
 * Owns the scroll behavior between the two full-screen sections.
 * Hero's button scrolls down to Menu; Menu's bottom bar scrolls
 * back up to Hero. Swap scrollIntoView for a router push here if
 * you ever split these into real routes/pages.
 */
export default function CafeApp() {
  const heroRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToHero = () => heroRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSelectCategory = (category: Category) => {
    // Hook up navigation to a category detail page/panel here, e.g.:
    // router.push(`/menu/${category.id}`);
    console.log("selected category:", category.id);
  };

  return (
    <div className="h-screen w-full snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Hero ref={heroRef} onOpenMenu={scrollToMenu} />
      <Menu ref={menuRef} onBack={scrollToHero} onSelectCategory={handleSelectCategory} />
    </div>
  );
}
