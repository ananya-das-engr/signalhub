export function todayKey() {
  const today = new Date().toISOString().split("T")[0];
  return `summary-${today}`;
}
