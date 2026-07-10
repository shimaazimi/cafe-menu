"use client";

import { useRef } from "react";
import Hero from "@/components/hero/Hero";
import Menu from "@/components/menu/Menu";
import type { Category } from "../../types/categories";

export default function CafeApp() {
  const heroRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToHero = () => heroRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSelectCategory = (category: Category) => {};

  return (
    <div className="h-screen w-full snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Hero ref={heroRef} onOpenMenu={scrollToMenu} />
      <Menu ref={menuRef} onBack={scrollToHero} onSelectCategory={handleSelectCategory} />
    </div>
  );
}
