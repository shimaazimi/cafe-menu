import MenuItem from "./MenuItem";
import type { Category } from "@/types/categories";

interface Props {
  category: Category;
  onSelectCategory?: (category: Category) => void;
}

export default function CategorySection({ category, onSelectCategory }: Props) {
  return (
    <section id={category.id} data-category={category.id} className="mb-8 scroll-mt-32">
      <h2 className="font-farsi text-espresso mb-3 text-xl font-bold">{category.titleFa}</h2>

      <ul className="divide-espresso/10 divide-y">
        {category.items.map((item) => (
          <MenuItem
            key={item.id}

            item={item}
          />
        ))}
      </ul>
    </section>
  );
}
