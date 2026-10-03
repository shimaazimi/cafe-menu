const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function parseTomanPrice(price: string): number {
  const latinDigits = price.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  const digitsOnly = latinDigits.replace(/[^\d]/g, "");

  return Number(digitsOnly);
}

export function formatToman(amount: number): string {
  const latin = amount.toLocaleString("en-US");
  const persian = latin.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);

  return `${persian} تومان`;
}

export function formatDiscountPercent(priceToman: number, compareAtPrice: number): string {
  const percent = Math.round(((compareAtPrice - priceToman) / compareAtPrice) * 100);
  const persian = String(percent).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);

  return `${persian}٪`;
}
