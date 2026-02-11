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

function getFallbackResult(): VersionCheckResult {
    const currentVersion = Constants.expoConfig?.version ?? DEFAULT_VERSION;
    return {
        needsUpdate: false,
        currentVersion,
        requiredVersion: currentVersion,
    };
}

/** Expo Go has no Firebase native module – skip import to avoid RNFBAppModule error. */
function shouldSkipFirebase(): boolean {
    try {
        const ownership = (Constants as { appOwnership?: string }).appOwnership;
        return ownership === 'expo';
    } catch {
        return true;
    }
}

export async function checkAppVersion(): Promise<VersionCheckResult> {
    if (shouldSkipFirebase()) {
        return getFallbackResult();
    }

    try {
        const { getApp } = await import('@react-native-firebase/app');
        const {
            getRemoteConfig,
            setDefaults,
            setConfigSettings,
            fetchAndActivate,
            getValue,
        } = await import('@react-native-firebase/remote-config');

        const app = getApp();
        const config = getRemoteConfig(app);

        await setDefaults(config, { minimum_version: DEFAULT_VERSION });
        await setConfigSettings(config, { minimumFetchIntervalMillis: CACHE_INTERVAL_MS });
        await fetchAndActivate(config);

        const value = getValue(config, 'minimum_version');
        const requiredVersion = value?.asString?.() ?? DEFAULT_VERSION;
        const currentVersion = Constants.expoConfig?.version ?? DEFAULT_VERSION;
        const needsUpdate = compareVersions(currentVersion, requiredVersion) < 0;

        return {
            needsUpdate,
            currentVersion,
            requiredVersion,
        };
    } catch (error) {
        if (__DEV__) console.log('[Version] Remote config unavailable:', (error as Error)?.message ?? error);
        return getFallbackResult();
    }
}
