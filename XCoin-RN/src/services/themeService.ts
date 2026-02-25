import { CONFIG_API_BASE_URL, CONFIG_API_KEY, ENDPOINTS } from "../api/endpoints";
import { ThemeResponse } from "../types/theme";

export class ThemeService {
    static async fetchTheme(): Promise<ThemeResponse> {
        try {
            const response = await fetch(`${CONFIG_API_BASE_URL}${ENDPOINTS.THEME_CONFIG}`, {
                method: "GET",
                headers: {
                    "X-API-Key": CONFIG_API_KEY,
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
