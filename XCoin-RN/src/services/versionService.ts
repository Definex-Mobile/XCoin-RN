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
        const [appModule, remoteConfigModule] = await Promise.all([
            import('@react-native-firebase/app'),
            import('@react-native-firebase/remote-config')
        ]);

        const getApp = appModule.default?.getApp ?? appModule.getApp;
        if (typeof getApp !== 'function') {
            if (__DEV__) console.log('[Version] Firebase native module not available – skipping remote config.');
            return getFallbackResult();
        }

        const app = getApp();
        const getRemoteConfig = remoteConfigModule.default?.getRemoteConfig ?? remoteConfigModule.getRemoteConfig;
        if (typeof getRemoteConfig !== 'function') return getFallbackResult();

        const config = getRemoteConfig(app);

        const setDefaults = remoteConfigModule.default?.setDefaults ?? remoteConfigModule.setDefaults;
        const setConfigSettings = remoteConfigModule.default?.setConfigSettings ?? remoteConfigModule.setConfigSettings;
        const fetchAndActivate = remoteConfigModule.default?.fetchAndActivate ?? remoteConfigModule.fetchAndActivate;
        const getValue = remoteConfigModule.default?.getValue ?? remoteConfigModule.getValue;

        if (typeof setDefaults === 'function') {
            await setDefaults(config, { minimum_version: DEFAULT_VERSION });
        }
        if (typeof setConfigSettings === 'function') {
            await setConfigSettings(config, { minimumFetchIntervalMillis: CACHE_INTERVAL_MS });
        }
        if (typeof fetchAndActivate === 'function') {
            await fetchAndActivate(config);
        }
        if (typeof getValue !== 'function') return getFallbackResult();

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
