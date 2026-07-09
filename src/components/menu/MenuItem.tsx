// import Image from "next/image";
// import { ChevronRight } from "lucide-react";
// import type { Category } from "../../types/categories";

// interface MenuItemProps {
//   category: Category;
//   onSelect?: (category: Category) => void;
// }

// /**
//  * A single row in the category list: thumbnail photo, English +
//  * Farsi title, chevron. Wire up `onSelect` to navigate to a
//  * category detail page/panel.
//  */
// export default function MenuItem({ category, onSelect }: MenuItemProps) {
//   return (
//     <li>
//       <button
//         onClick={() => onSelect?.(category)}
//         className="hover:bg-espresso/5 -mx-2 flex w-full items-center gap-4 rounded-lg px-2 py-4 text-left transition-colors"
//       >
//         <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
//           <Image
//             src={category.image}
//             alt={category.titleEn}
//             fill
//             sizes="48px"
//             className="object-cover"
//           />
//         </span>

//         <span className="flex-1">
//           <span className="text-espresso block text-sm font-semibold tracking-wide">
//             {category.titleEn}
//           </span>
//           <span dir="rtl" className="text-clay block text-sm">
//             {category.titleFa}
//           </span>
//         </span>

//         <ChevronRight className="text-espresso/40 h-5 w-5 shrink-0" />
//       </button>
//     </li>
//   );
// }
import Image from "next/image";

interface Props {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
  };
}

export default function MenuItem({ item }: Props) {
  return (
    <li>
      <div className="flex items-center gap-4 py-4" dir="rtl">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
        </div>

        <div className="flex-1 text-right">
          <h3 className="font-farsi text-espresso font-semibold">{item.name}</h3>

          <p className="font-farsi text-clay text-sm">{item.description}</p>
        </div>

        <span className="text-espresso font-semibold">{item.price}</span>
      </div>
    </li>
  );
}
