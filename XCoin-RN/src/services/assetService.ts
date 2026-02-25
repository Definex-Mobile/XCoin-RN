import { CONFIG_API_BASE_URL, CONFIG_API_KEY, ENDPOINTS } from '../api/endpoints';
import { AssetResponse } from '../types/asset';
import { ImageSourcePropType } from 'react-native';

class AssetService {
    private assets: Record<string, string | undefined> = {};

    /**
     * Fetches asset URLs from the backend and stores them in memory.
     */
    async fetchAssets(): Promise<void> {
        const url = `${CONFIG_API_BASE_URL}${ENDPOINTS.ASSET_CONFIG}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-API-Key': CONFIG_API_KEY,
                },
            });

            if (!response.ok) return;

            const json: AssetResponse = await response.json();
            if (json.success && json.data?.assets) {
                this.assets = json.data.assets;
            }
        } catch (error) {
            console.error('[AssetService] Failed to fetch assets:', error);
        }
    }

    /**
     * Returns an image source (remote uri if available, otherwise local fallback).
     * @param key The key of the asset in the backend response (e.g., 'img_welcome_card')
     * @param fallback The local require(...) statement to use as a fallback
     */
    getAssetSource(key: string, fallback: ImageSourcePropType): ImageSourcePropType {
        const remoteUrl = this.assets[key];
        if (remoteUrl && (remoteUrl.startsWith('http://') || remoteUrl.startsWith('https://'))) {
            return { uri: remoteUrl };
        }
        return fallback;
    }
}

export const assetService = new AssetService();
