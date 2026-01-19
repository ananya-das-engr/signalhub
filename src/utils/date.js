export function todayKey() {
  return `summary-${new Date().toISOString().split("T")[0]}`;
}
