export interface CryptoCoin {
    longName: string;
    shortName: string;
    currentPrice: number;
    changeRatio: number; // percentage, positive = green, negative = red
    currency: string;
    imageUrl: string;
}

export interface TrendingListResponse {
    trendingList: CryptoCoin[];
}

export type TrendingApiResponse = TrendingListResponse;

export interface MarketStatusResponse {
    marketStatus: 'UP' | 'DOWN';
    ratio: number;
}

export interface MarketListResponse {
    marketList: CryptoCoin[];
}
