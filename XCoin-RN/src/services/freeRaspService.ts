import { useMemo } from 'react';
import { useFreeRasp, TalsecConfig } from 'freerasp-react-native';
import { CrashlyticsService } from './crashlytics';

const IS_DEV = __DEV__;

export const freeRaspConfig: TalsecConfig = {
    androidConfig: {
        packageName: IS_DEV ? 'com.definex.xcoin.dev' : 'com.definex.xcoin',
        certificateHashes: ['+sYXRdwJA3hvue3mKpYrOZ9zSPC7b4mbgzJmdZEDO5w='], // Derived from provided SHA256 HEX
        supportedAlternativeStores: ['com.sec.android.app.samsungapps'],
    },
    iosConfig: {
        appBundleId: IS_DEV ? 'com.definex.xcoin.dev' : 'com.definex.xcoin',
        appTeamId: 'SARRR957TK',
    },
    watcherMail: 'onur.kuscuoglu@teamdefinex.com',
    isProd: !IS_DEV,
    killOnBypass: !IS_DEV,
};

export type ThreatType =
    | 'privilegedAccess'
    | 'debug'
    | 'simulator'
    | 'appIntegrity'
    | 'unofficialStore'
    | 'hooks'
    | 'deviceBinding'
    | 'secureHardwareNotAvailable'
    | 'systemVPN'
    | 'passcode'
    | 'deviceID'
    | 'obfuscationIssues'
    | 'devMode'
    | 'adbEnabled'
    | 'screenshot'
    | 'screenRecording'
    | 'multiInstance'
    | 'timeSpoofing'
    | 'locationSpoofing'
    | 'unsecureWifi'
    | 'automation';

export interface ThreatState {
    isBlocked: boolean;
    threatType?: ThreatType;
    message?: string;
}

// Critical threats that blocks the app
export const CRITICAL_THREATS: ThreatType[] = [
    'privilegedAccess',
    'hooks',
    'appIntegrity',
];

export const createThreatActions = (
    setThreatState: (state: ThreatState) => void
) => {
    const handleThreat = (type: ThreatType) => {
        console.warn(`⚠️ [freeRASP] Threat detected: ${type}`);

        // Record to Crashlytics
        CrashlyticsService.recordError(
            new Error(`[freeRASP] Threat detected: ${type}`),
            `freeRASP_${type}`
        );

        if (CRITICAL_THREATS.includes(type)) {
            setThreatState({
                isBlocked: true,
                threatType: type,
            });
        }
    };

    return {
        privilegedAccess: () => handleThreat('privilegedAccess'),
        debug: () => handleThreat('debug'),
        simulator: () => handleThreat('simulator'),
        appIntegrity: () => handleThreat('appIntegrity'),
        unofficialStore: () => handleThreat('unofficialStore'),
        hooks: () => handleThreat('hooks'),
        deviceBinding: () => handleThreat('deviceBinding'),
        secureHardwareNotAvailable: () => handleThreat('secureHardwareNotAvailable'),
        systemVPN: () => handleThreat('systemVPN'),
        passcode: () => handleThreat('passcode'),
        deviceID: () => handleThreat('deviceID'),
        obfuscationIssues: () => handleThreat('obfuscationIssues'),
        devMode: () => handleThreat('devMode'),
        adbEnabled: () => handleThreat('adbEnabled'),
        screenshot: () => handleThreat('screenshot'),
        screenRecording: () => handleThreat('screenRecording'),
        multiInstance: () => handleThreat('multiInstance'),
        timeSpoofing: () => handleThreat('timeSpoofing'),
        locationSpoofing: () => handleThreat('locationSpoofing'),
        unsecureWifi: () => handleThreat('unsecureWifi'),
        automation: () => handleThreat('automation'),
    };
};

export const createRaspExecutionStateActions = () => {
    return {
        allChecksFinished: () => {
            console.log('✅ [freeRASP] All initial checks finished');
        },
        started: () => {
            console.log('🚀 [freeRASP] Service started successfully');
        },
        initializationError: (error: any) => {
            console.error('❌ [freeRASP] Initialization error:', error);
        }
    };
};
