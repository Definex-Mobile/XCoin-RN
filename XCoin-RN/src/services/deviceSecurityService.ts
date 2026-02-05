import { checkDeviceSecurity } from '../../modules/expo-device-security/src';

export interface DeviceSecurityResult {
    isCompromised: boolean;
    reason?: 'jailbroken' | 'rooted';
}

/**
 * Check if the device is jailbroken (iOS) or rooted (Android)
 * @returns Promise with security check result
 */
export async function checkDeviceSecurityStatus(): Promise<DeviceSecurityResult> {
    console.log('🔒 [DeviceSecurity] Starting device security check...');

    try {
        const result = await checkDeviceSecurity();

        console.log('🔒 [DeviceSecurity] Check completed:', {
            isCompromised: result.isCompromised,
            reason: result.reason
        });

        if (result.isCompromised) {
            console.warn('⚠️ [DeviceSecurity] DEVICE IS COMPROMISED:', result.reason);
        } else {
            console.log('✅ [DeviceSecurity] Device security check passed - device is secure');
        }

        return {
            isCompromised: result.isCompromised,
            reason: result.reason as 'jailbroken' | 'rooted' | undefined,
        };
    } catch (error) {
        console.error('❌ [DeviceSecurity] Error during security check:', error);
        throw error;
    }
}

/**
 * Get user-friendly message for compromised device
 */
export function getSecurityWarningMessage(reason?: string): string {
    if (reason === 'jailbroken') {
        return 'This app cannot run on jailbroken devices for security reasons.';
    }
    if (reason === 'rooted') {
        return 'This app cannot run on rooted devices for security reasons.';
    }
    return 'This app cannot run on compromised devices for security reasons.';
}
