import Constants from 'expo-constants';

export interface VersionCheckResult {
    needsUpdate: boolean;
    currentVersion: string;
    requiredVersion: string;
}

const DEFAULT_VERSION = '1.0.0';
const CACHE_INTERVAL_MS = 3600000; // 1 hour

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

export async function checkAppVersion(): Promise<VersionCheckResult> {
    console.log('🔥 [Version Check] Starting version check...');

    try {
        console.log('🔥 [Version Check] Importing Firebase Remote Config...');
        const {
            getRemoteConfig,
            fetchAndActivate,
            getValue,
            setDefaults,
            setConfigSettings
        } = await import('@react-native-firebase/remote-config');

        console.log('🔥 [Version Check] Getting Remote Config instance...');
        const config = getRemoteConfig();

        console.log('🔥 [Version Check] Setting default values...');
        await setDefaults(config, {
            minimum_version: DEFAULT_VERSION,
        });

        console.log('🔥 [Version Check] Setting config settings...');
        await setConfigSettings(config, {
            minimumFetchIntervalMillis: CACHE_INTERVAL_MS,
        });

        console.log('🔥 [Version Check] Fetching and activating Remote Config...');
        const activated = await fetchAndActivate(config);
        console.log('🔥 [Version Check] Remote Config activated:', activated);

        const requiredVersion = getValue(config, 'minimum_version').asString();
        console.log('🔥 [Version Check] Required version from Firebase:', requiredVersion);

        const currentVersion = Constants.expoConfig?.version || DEFAULT_VERSION;
        console.log('🔥 [Version Check] Current app version:', currentVersion);

        const needsUpdate = compareVersions(currentVersion, requiredVersion) < 0;
        console.log('🔥 [Version Check] Needs update:', needsUpdate);

        const result = {
            needsUpdate,
            currentVersion,
            requiredVersion,
        };

        console.log('🔥 [Version Check] Final result:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('❌ [Version Check] Error occurred:', error);

        const currentVersion = Constants.expoConfig?.version || DEFAULT_VERSION;
        const fallbackResult = {
            needsUpdate: false,
            currentVersion,
            requiredVersion: currentVersion,
        };

        console.log('🔥 [Version Check] Fallback result:', JSON.stringify(fallbackResult, null, 2));
        return fallbackResult;
    }
}
