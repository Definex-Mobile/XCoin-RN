const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  inr: "₹",
  try: "₺",
  eur: "€",
  gbp: "£",
};

export function getCurrencySymbol(code?: string): string {
  const key = (code ?? "").toLowerCase();
  return CURRENCY_SYMBOLS[key] ?? "";
}

export function formatMoney(value: number, symbol: string): string {
  const decimals = Number.isInteger(value) ? 0 : 2;
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}