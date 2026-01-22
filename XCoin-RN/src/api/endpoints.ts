// API URL LIST
export const BASE_URL = "https://xcoin-70afa.web.app"

export const ENDPOINTS = {
    MARKET_LIST: "/api/market/ALL/marketList.json",
    FAVORITES: "/api/market/FAVORITES/marketList.json",
    GAINERS: "/api/market/GAINERS/marketList.json",
    LOSERS: "/api/market/LOSERS/marketList.json",
    MARKET_STATUS: "/api/market/status.json",
    
    PORTFOLIO_SUMMARY: "/api/portfolio/summary.json",
    PORTFOLIO_LIST: "/api/portfolio/portfolioList.json",

    TRENDING: "/api/trending.json"
} as const
