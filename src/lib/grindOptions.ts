export const WHOLE_BEAN_GRIND_OPTION = "دانه کامل (بدون آسیاب)";

export const GRIND_OPTION_PRESETS = [
  "اسپرسوساز خانگی",
  "اسپرسوساز صنعتی",
  "موکاپات",
  "فرنچ پرس",
  "قهوه‌ساز فیلتری",
  "V60 و پوراور",
  "ایروپرس",
  "قهوه ترک",
] as const;

export function normalizeGrindOptions(values: string[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => value.split(/[,،\n]/))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export function getCustomerGrindOptions(grindingAvailable: boolean, grindOptions: string[]) {
  if (!grindingAvailable) return [];
  return [
    WHOLE_BEAN_GRIND_OPTION,
    ...grindOptions.filter((item) => item !== WHOLE_BEAN_GRIND_OPTION),
  ];
}

export function buildCartItemId(slug: string, weightGrams?: number, grindOption?: string) {
  return [
    slug,
    weightGrams ? `w=${weightGrams}` : "w=default",
    `g=${encodeURIComponent(grindOption ?? "")}`,
  ].join("::");
}
