export const COFFEE_TYPE_LABELS: Record<string, string> = {
  arabica: "عربیکا",
  robusta: "روبوستا",
  blend: "ترکیبی",
};

export const ROAST_LEVEL_LABELS: Record<string, string> = {
  light: "روشن",
  medium: "متوسط",
  dark: "تیره",
};

export const BREW_METHOD_LABELS: Record<string, string> = {
  espresso: "اسپرسوساز",
  moka: "موکاپات",
  french_press: "فرنچ‌پرس",
  filter: "قهوه دمی",
};

export const SUITABLE_FOR_LABELS: Record<string, string> = {
  home: "خانه",
  office: "محل کار",
  cafe: "کافه",
};

export const FLAVOR_NOTE_LABELS: Record<string, string> = {
  chocolate: "شکلاتی",
  caramel: "کاراملی",
  nuts: "آجیلی",
  fruity: "میوه‌ای",
  floral: "گلی",
  spicy: "ادویه‌ای",
};

export function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function intensityDots(value: number | null) {
  if (!value) return "—";
  return `${"●".repeat(value)}${"○".repeat(5 - value)}`;
}
