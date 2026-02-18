import { ThemeResponse } from "../types/theme";

const THEME_BASE_URL = "https://bank-config-api.vercel.app/api/v1";
const THEME_ENDPOINT = "/config/theme";
const API_KEY = "ak_demo_32charslongapikeyforsecurity12";

export class ThemeService {
    static async fetchTheme(): Promise<ThemeResponse> {
        try {
            const response = await fetch(`${THEME_BASE_URL}${THEME_ENDPOINT}`, {
                method: "GET",
                headers: {
                    "X-API-Key": API_KEY,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Theme fetch failed with status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching theme:", error);
            throw error;
        }
    }
}
