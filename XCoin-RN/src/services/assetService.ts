import { configGetData } from '../api/configClient';
import { ENDPOINTS } from '../api/endpoints';
import { AssetData } from '../types/asset';
import { ImageSourcePropType } from 'react-native';

class AssetService {
    private assets: Record<string, string | undefined> = {};

    /**
     * Fetches asset URLs from the backend and stores them in memory.
     */
    async fetchAssets(): Promise<void> {
        try {
            const data = await configGetData<AssetData>(ENDPOINTS.ASSET_CONFIG);
            if (data.assets) {
                this.assets = data.assets;
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
