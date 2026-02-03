import { NativeModulesProxy } from 'expo-modules-core';

export interface DeviceSecurityModule {
    isJailbroken?: () => Promise<boolean>;
    isRooted?: () => Promise<boolean>;
}

const DeviceSecurity: DeviceSecurityModule = NativeModulesProxy.DeviceSecurity as DeviceSecurityModule ?? {};

export async function checkDeviceSecurity(): Promise<{
    isCompromised: boolean;
    reason?: string;
}> {
    try {
        console.log('🔍 [DeviceSecurity Module] Checking platform-specific security...');

        // iOS check
        if (DeviceSecurity.isJailbroken) {
            console.log('📱 [DeviceSecurity Module] Running iOS jailbreak detection...');
            const isJailbroken = await DeviceSecurity.isJailbroken();
            console.log('📱 [DeviceSecurity Module] iOS jailbreak check result:', isJailbroken);

            if (isJailbroken) {
                return {
                    isCompromised: true,
                    reason: 'jailbroken',
                };
            }
        }

        // Android check
        if (DeviceSecurity.isRooted) {
            console.log('🤖 [DeviceSecurity Module] Running Android root detection...');
            const isRooted = await DeviceSecurity.isRooted();
            console.log('🤖 [DeviceSecurity Module] Android root check result:', isRooted);

            if (isRooted) {
                return {
                    isCompromised: true,
                    reason: 'rooted',
                };
            }
        }

        console.log('✅ [DeviceSecurity Module] No security issues detected');
        return { isCompromised: false };
    } catch (error) {
        console.error('❌ [DeviceSecurity Module] Device security check failed:', error);
        // Fail open - don't block users if check fails
        return { isCompromised: false };
    }
}

export default DeviceSecurity;
