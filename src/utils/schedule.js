// The local records describe weekdays. Show the next complete Monday–Sunday week.
export function nextWeekDate(weekdayOffset, now = new Date()) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const daysUntilMonday = (8 - monday.getDay()) % 7 || 7;
  monday.setDate(monday.getDate() + daysUntilMonday + weekdayOffset);
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const day = String(monday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function classDate(item) {
  if (!item.date) return "Date to be confirmed";
  const [year, month, day] = item.date.split("-").map(Number);
  if (!year || !month || !day) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(year, month - 1, day));
}
