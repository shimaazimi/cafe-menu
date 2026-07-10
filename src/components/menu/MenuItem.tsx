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
