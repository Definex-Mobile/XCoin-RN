import { get } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { TrendingApiResponse } from "../../types/cryptoCoin"

export async function getTrendingCoins(): Promise<TrendingApiResponse> {
    return await get<TrendingApiResponse>(ENDPOINTS.TRENDING)
}
