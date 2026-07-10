"use client";

import { BookOpen } from "lucide-react";

interface NavButtonProps {
  variant: "circle" | "bar";
  label: string;
  onClick: () => void;
}

export default function NavButton({ variant, label, onClick }: NavButtonProps) {
  if (variant === "circle") {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        className="bg-espresso text-latte flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <BookOpen className="h-7 w-7" strokeWidth={1.5} />
        <span className="tracking-widest2 text-xs font-semibold">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="bg-espresso text-latte hover:bg-espresso/90 absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full items-center justify-center gap-2 rounded-t-3xl py-4 transition-colors"
    >
      <BookOpen className="h-4 w-4" strokeWidth={1.5} />
      <span className="tracking-widest2 text-sm font-semibold">{label}</span>
    </button>
  );
}
