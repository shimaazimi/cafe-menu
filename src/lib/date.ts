const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatJalaliDate(date: Date): string {
  return formatter.format(date);
}
