import { get, post } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { PortfolioApiResponse, PortfolioListApiResponse } from "../../types/portfolio/portfolio"

export async function getPortfolioSummary(): Promise<PortfolioApiResponse> {
    return await get<PortfolioApiResponse>(ENDPOINTS.PORTFOLIO_SUMMARY)
}

export async function getPortfolioList(): Promise<PortfolioListApiResponse> {
    const res = await get<PortfolioListApiResponse>(ENDPOINTS.PORTFOLIO_LIST)

    return {
        portfolioList: (res.portfolioList ?? []).map((c) => ({
            ...c,
            imageUrl: c.imageUrl?.trim?.() ?? c.imageUrl,
        })),
    }
}

export async function examplePOSTRequest(): Promise<PortfolioListApiResponse> {
    return await post<PortfolioListApiResponse>(ENDPOINTS.PORTFOLIO_LIST, {amount: 1000})
}
