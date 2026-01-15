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
