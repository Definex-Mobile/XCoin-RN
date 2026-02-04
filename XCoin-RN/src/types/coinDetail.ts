export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export type TimeRange = '1H' | '24H' | '1W' | '1M' | '6M' | '1Y' | 'All';

export interface CoinDetailData {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  imageUrl: string;
  chartData: ChartDataPoint[];
  userBalance: number;
  userBalanceFiat: number;
  currency: string;
  minPrice?: number;
  maxPrice?: number;
}
