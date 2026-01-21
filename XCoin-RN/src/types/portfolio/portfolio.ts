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

export type PortfolioCoin = {
  longName: string;
  shortName: string;
  currentPrice: number;
  changeRatio: number;
  currency: string;
  amount: number;
  imageUrl: string;
};

export type PortfolioListApiResponse = {
  portfolioList: PortfolioCoin[];
};
