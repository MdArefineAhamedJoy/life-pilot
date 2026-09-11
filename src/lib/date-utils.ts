export function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) {
    return "-";
  }

  return `${startDate || "No start"} to ${endDate || "No end"}`;
}

export function formatMonthTitle(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

export function formatReadableDate(dateKey: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
}
