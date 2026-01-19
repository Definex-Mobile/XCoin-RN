export type PortfolioApiResponse = {
  holdingValue: string;
  investedValue: number;
  availableINR: number;
  changeRatio: number;
  currency: string;
};

export type PortfolioCardVM = {
  holdingText: string;
  changeText: string;
  investedText: string;
  availableText: string;
};