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
  // Determine decimal places based on value magnitude (for crypto)
  let decimals: number;
  if (value < 0.01) {
    decimals = 8;
  } else if (value < 1) {
    decimals = 4;
  } else if (value < 100) {
    decimals = 2;
  } else {
    decimals = 2;
  }

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}