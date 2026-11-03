// Shared locale-aware market formatting utilities.

export function formatMarketPrice(value, locale = "en") {
  const price = Number(value);
  if (!Number.isFinite(price)) return "—";
  const maximumFractionDigits = price >= 1000 ? 2 : price >= 1 ? 4 : 8;
  return "$" + price.toLocaleString(locale, { maximumFractionDigits });
}

export function formatMarketVolume(value, prefix = "$", locale = "en") {
  const volume = Number(value);
  if (!Number.isFinite(volume)) return "—";
  return prefix + new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 }).format(volume);
}

export function formatMarketPeriodReturn(candles, days) {
  if (!Array.isArray(candles) || candles.length <= days) return "—";
  const current = Number(candles[candles.length - 1]?.close);
  const previous = Number(candles[candles.length - 1 - days]?.close);
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return "—";
  const change = ((current - previous) / previous) * 100;
  return (change > 0 ? "+" : "") + change.toFixed(2) + "%";
}
