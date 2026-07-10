import { useEffect, useRef } from "react";
import type { Category } from "../../types/categories";

interface Props {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}
export default function CategoryNav({ categories, activeCategory, onSelectCategory }: Props) {
  function scrollToCategory(id: string) {
    const element = document.getElementById(id);

    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  return (
    <nav className="w-full px-4 py-3">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth">
        {categories.map((category: Category) => (
          <li key={category.id} className="shrink-0">
            <button
              onClick={() => onSelectCategory(category.id)}
              ref={activeCategory === category.id ? activeRef : undefined}

              className={`font-farsi rounded-full px-5 py-2 text-sm transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-espresso text-latte shadow-md"
                  : "text-espresso bg-white"
              } `}
            >
              {category.titleFa}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
