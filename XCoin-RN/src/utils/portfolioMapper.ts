import type { PortfolioApiResponse, PortfolioCardVM } from "../types/portfolio/portfolio";
import { getCurrencySymbol, formatMoney, formatPercentage } from "./money";

export function mapPortfolioToCardVM(api: PortfolioApiResponse): PortfolioCardVM {
  const symbol = getCurrencySymbol(api.currency);
  const holding = Number.parseFloat(api.holdingValue) || 0

  return {
    holdingText: formatMoney(holding, symbol),
    changeText: formatPercentage(api.changeRatio ?? 0),
    investedText: formatMoney(api.investedValue ?? 0, symbol),
    availableText: formatMoney(api.availableINR ?? 0, symbol),
  };
}