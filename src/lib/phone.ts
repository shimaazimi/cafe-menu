const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/**
 * Normalizes Iranian mobile numbers (+98, 0098, 98, or 0 prefixed) to the
 * canonical "09xxxxxxxxx" form. Returns null when the input isn't a valid
 * 11-digit Iranian mobile number.
 */
export function normalizePhone(input: string): string | null {
  let digits = toEnglishDigits(input.trim()).replace(/[\s-]/g, "");

  if (digits.startsWith("+98")) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith("0098")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("98") && digits.length === 12) digits = `0${digits.slice(2)}`;

  if (!/^09\d{9}$/.test(digits)) return null;

  return digits;
}

export function formatIranPhone(phone: string): string {
  const persian = phone.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
  return persian.replace(/^(.{4})(.{3})(.{4})$/, "$1 $2 $3");
}
