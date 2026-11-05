export function formatEGP(amount: number | null | undefined, lang: "ar" | "en" = "ar"): string {
  if (amount == null || isNaN(amount)) return "—";
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US").format(amount);
  return lang === "ar" ? `${formatted} ج.م` : `${formatted} EGP`;
}

export function formatDate(date: Date | string | number | null | undefined, lang: "ar" | "en" = "ar"): string {
  if (!date) return "—";
  const d = typeof date === "object" && "toDate" in (date as any)
    ? (date as any).toDate()
    : new Date(date);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
