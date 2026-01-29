import Constants from 'expo-constants';

export interface VersionCheckResult {
    needsUpdate: boolean;
    currentVersion: string;
    requiredVersion: string;
}

const DEFAULT_VERSION = '1.0.0';
const CACHE_INTERVAL_MS = 300000;

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
    try {
        const {
            getRemoteConfig,
            fetchAndActivate,
            getValue,
            setDefaults,
            setConfigSettings
        } = await import('@react-native-firebase/remote-config');

        const config = getRemoteConfig();

        await setDefaults(config, {
            minimum_version: DEFAULT_VERSION,
        });

        await setConfigSettings(config, {
            minimumFetchIntervalMillis: CACHE_INTERVAL_MS,
        });

        await fetchAndActivate(config);

        const requiredVersion = getValue(config, 'minimum_version').asString();
        const currentVersion = Constants.expoConfig?.version || DEFAULT_VERSION;
        const needsUpdate = compareVersions(currentVersion, requiredVersion) < 0;

        return {
            needsUpdate,
            currentVersion,
            requiredVersion,
        };
    } catch (error) {
        console.error('Version check error:', error);

        const currentVersion = Constants.expoConfig?.version || DEFAULT_VERSION;
        return {
            needsUpdate: false,
            currentVersion,
            requiredVersion: currentVersion,
        };
    }
}
