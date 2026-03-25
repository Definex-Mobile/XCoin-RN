import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { NativeModules } from "react-native";
import type * as KeychainType from "react-native-keychain";
import type { UserInfo } from "../types/userInfo";

const KEYCHAIN_SERVICE = "xcoin.user.info";
const KEYCHAIN_USERNAME = "xcoin-user";
const RN_KEYCHAIN_MODULE_NAME = "RNKeychainManager";
const SECURE_STORE_KEY = "xcoin.user.info.secure-store";

let keychainModule: typeof KeychainType | null | undefined;
let didWarnUnavailable = false;

function warnUnavailableOnce() {
  if (didWarnUnavailable) {
    return;
  }
  didWarnUnavailable = true;
  console.warn(
    "Keychain native module not available, falling back to expo-secure-store"
  );
}

function isKeychainNativeAvailable(): boolean {
  if (Constants.appOwnership === "expo") {
    return false;
  }

  const nativeModules = NativeModules as Record<string, unknown>;
  return Boolean(nativeModules[RN_KEYCHAIN_MODULE_NAME]);
}

function getKeychainModule(): typeof KeychainType | null {
  if (!isKeychainNativeAvailable()) {
    keychainModule = null;
    warnUnavailableOnce();
    return null;
  }

  if (keychainModule === undefined) {
    try {
      keychainModule = require("react-native-keychain") as typeof KeychainType;
    } catch {
      keychainModule = null;
      warnUnavailableOnce();
      return null;
    }
  }

  if (!keychainModule) {
    warnUnavailableOnce();
    return null;
  }

  return keychainModule;
}

export async function saveUserInfo(userInfo: UserInfo): Promise<boolean> {
  const keychain = getKeychainModule();
  if (keychain) {
    try {
      await keychain.setGenericPassword(
        KEYCHAIN_USERNAME,
        JSON.stringify(userInfo),
        {
          service: KEYCHAIN_SERVICE,
          accessible: keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        }
      );
      return true;
    } catch (error) {
      console.error("Failed to save user info in keychain:", error);
    }
  }

  try {
    await SecureStore.setItemAsync(SECURE_STORE_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error("Failed to save user info in expo-secure-store:", error);
    return false;
  }
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const keychain = getKeychainModule();
  if (keychain) {
    try {
      const credentials = await keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });

      if (credentials) {
        return JSON.parse(credentials.password) as UserInfo;
      }
    } catch (error) {
      console.error("Failed to read user info from keychain:", error);
    }
  }

  try {
    const rawValue = await SecureStore.getItemAsync(SECURE_STORE_KEY);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as UserInfo;
  } catch (error) {
    console.error("Failed to read user info from expo-secure-store:", error);
    return null;
  }
}

export async function clearUserInfo(): Promise<void> {
  const keychain = getKeychainModule();
  if (keychain) {
    try {
      await keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
    } catch (error) {
      console.error("Failed to clear user info from keychain:", error);
    }
  }

  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEY);
  } catch (error) {
    console.error("Failed to clear user info from expo-secure-store:", error);
  }
}
