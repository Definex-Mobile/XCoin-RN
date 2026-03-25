import { configGetData } from "../api/configClient";
import { ENDPOINTS } from "../api/endpoints";
import { ThemeResponse } from "../types/theme";

export class ThemeService {
    static async fetchTheme(): Promise<ThemeResponse["data"]> {
        try {
            return await configGetData<ThemeResponse["data"]>(ENDPOINTS.THEME_CONFIG);
        } catch (error) {
            console.error("Error fetching theme:", error);
            throw error;
        }
    }
}
