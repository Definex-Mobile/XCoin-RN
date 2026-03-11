import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ENDPOINTS } from '../api/endpoints';
import { configGetData } from '../api/configClient';
import { VersionData } from '../types/version';

export enum UpdateType {
    NONE = 'NONE',
    SOFT = 'SOFT',
    FORCE = 'FORCE'
}

export interface VersionCheckResult {
    updateType: UpdateType;
    currentVersion: string;
    minVersion: string;
    recommendedVersion: string;
    latestVersion: string;
    storeUrl: string;
    releaseNotes: Record<string, string>;
}

const DEFAULT_VERSION = '1.0.0';

function compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;

        if (part1 > part2) return 1;
        if (part1 < part2) return -1;
    }
    return 0;
}

function getFallbackResult(): VersionCheckResult {
    const currentVersion = Constants.expoConfig?.version ?? DEFAULT_VERSION;
    return {
        updateType: UpdateType.NONE,
        currentVersion,
        minVersion: currentVersion,
        recommendedVersion: currentVersion,
        latestVersion: currentVersion,
        storeUrl: '',
        releaseNotes: {}
    };
}

export async function checkAppVersion(): Promise<VersionCheckResult> {
    const platform = Platform.OS;

    try {
        const data = await configGetData<VersionData>(`${ENDPOINTS.VERSION_CONFIG}?platform=${platform}`);
        const currentVersion = Constants.expoConfig?.version ?? DEFAULT_VERSION;

        let updateType = UpdateType.NONE;

        if (compareVersions(currentVersion, data.min_version) < 0) {
            updateType = UpdateType.FORCE;
        } else if (compareVersions(currentVersion, data.recommended_version) < 0) {
            updateType = UpdateType.SOFT;
        }

        return {
            updateType,
            currentVersion,
            minVersion: data.min_version,
            recommendedVersion: data.recommended_version,
            latestVersion: data.latest_version,
            storeUrl: data.store_url,
            releaseNotes: data.release_notes
        };
    } catch (error) {
        if (__DEV__) console.log('[Version] Fetching version config failed:', (error as Error)?.message ?? error);
        return getFallbackResult();
    }
}
