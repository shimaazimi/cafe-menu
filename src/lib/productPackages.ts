import { toPersianDigits } from "@/lib/price";

export const STANDARD_PACKAGE_WEIGHTS = [250, 500, 1000] as const;
export const WEIGHT_PRICED_CATEGORIES = ["beans", "ground-coffee", "instant-coffee"] as const;

export function usesPackagePricing(category: string) {
  return WEIGHT_PRICED_CATEGORIES.includes(category as (typeof WEIGHT_PRICED_CATEGORIES)[number]);
}

export interface PackagePriceFields {
  price250g?: number | null;
  price500g?: number | null;
  price1000g?: number | null;
}

export function getPackageOptions(product: PackagePriceFields) {
  return [
    { weightGrams: 250, priceToman: product.price250g },
    { weightGrams: 500, priceToman: product.price500g },
    { weightGrams: 1000, priceToman: product.price1000g },
  ].filter((option): option is { weightGrams: number; priceToman: number } =>
    Number.isInteger(option.priceToman),
  );
}

export function formatPackageWeight(weightGrams: number) {
  if (weightGrams >= 1000 && weightGrams % 1000 === 0) {
    return `${toPersianDigits(weightGrams / 1000)} کیلوگرم`;
  }

  return `${toPersianDigits(weightGrams)} گرم`;
}
