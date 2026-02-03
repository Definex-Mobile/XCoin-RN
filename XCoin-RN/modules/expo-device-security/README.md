# Expo Device Security Module

Native jailbreak (iOS) and root (Android) detection for React Native using Expo Modules.

## Features

### iOS Jailbreak Detection
- Suspicious file/path checks (Cydia, Sileo, etc.)
- System write permission tests
- Symbolic link detection
- URL scheme checks
- Fork detection
- Dyld environment variable checks

### Android Root Detection
- SU binary detection in common paths
- Root management app detection (Magisk, SuperSU, etc.)
- Build tags verification
- System property checks
- Busybox detection
- System partition mount status

## Usage

```typescript
import { checkDeviceSecurityStatus } from './src/services/deviceSecurityService';

const result = await checkDeviceSecurityStatus();
if (result.isCompromised) {
  console.log('Device is compromised:', result.reason);
}
```

## Implementation Details

The module uses Expo Modules API to bridge native Swift (iOS) and Kotlin (Android) code to React Native.

### Files Structure
```
modules/expo-device-security/
├── expo-module.config.json
├── package.json
├── src/
│   └── index.ts
├── ios/
│   └── DeviceSecurityModule.swift
└── android/
    └── src/main/java/expo/modules/devicesecurity/
        └── DeviceSecurityModule.kt
```

## Testing

To test on a rooted Android emulator:
1. Use Android Studio AVD Manager
2. Download a system image with "Google APIs" (not "Google Play")
3. Root the emulator using Magisk or similar tools

For iOS, testing requires a jailbroken device as simulators cannot be jailbroken.
