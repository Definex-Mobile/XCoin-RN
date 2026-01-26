import { get } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { MarketStatusResponse, MarketListResponse } from "../../types/cryptoCoin"

export type MarketCategory = 'ALL' | 'FAVORITES' | 'GAINERS' | 'LOSERS';

const CATEGORY_ENDPOINTS: Record<MarketCategory, string> = {
    'ALL': ENDPOINTS.MARKET_LIST,
    'FAVORITES': ENDPOINTS.FAVORITES,
    'GAINERS': ENDPOINTS.GAINERS,
    'LOSERS': ENDPOINTS.LOSERS,
};

export async function getMarketStatus(): Promise<MarketStatusResponse> {
    return await get<MarketStatusResponse>(ENDPOINTS.MARKET_STATUS)
}

export async function getMarketList(category: MarketCategory): Promise<MarketListResponse> {
    const endpoint = CATEGORY_ENDPOINTS[category];
    return await get<MarketListResponse>(endpoint)
}
