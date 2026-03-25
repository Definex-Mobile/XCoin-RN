import Constants, { ExecutionEnvironment } from 'expo-constants';
import { NativeModules } from 'react-native';
import { ANALYTICS_EVENTS, ANALYTICS_PARAMS, SCREENS } from '../constants/analyticsEvents';

type EventParams = Record<string, string | number | boolean>;

type AnalyticsMod = {
  getAnalytics: (app?: unknown) => unknown;
  logEvent: (analytics: unknown, name: string, params?: object) => Promise<void>;
};

let analyticsMod: AnalyticsMod | null = null;
let analyticsInstance: unknown = null;
let firebaseChecked = false;

function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

function isFirebaseNativeAvailable(): boolean {
  const nativeModules = NativeModules as Record<string, unknown>;
  return Boolean(nativeModules.RNFBAppModule);
}

function getAnalytics(): unknown {
  if (firebaseChecked) return analyticsInstance;
  firebaseChecked = true;
  if (isExpoGo()) {
    if (__DEV__) console.log('[Analytics] Expo Go – events will only log to console.');
    return null;
  }
  if (!isFirebaseNativeAvailable()) {
    if (__DEV__) console.log('[Analytics] Firebase native app module not available – events will only log to console.');
    return null;
  }
  try {
    analyticsMod = require('@react-native-firebase/analytics') as AnalyticsMod;
    const { getApp } = require('@react-native-firebase/app');
    analyticsInstance = analyticsMod.getAnalytics(getApp());
    return analyticsInstance;
  } catch {
    if (__DEV__) {
      console.log('[Analytics] Firebase native module not available – events will only log to console.');
    }
    return null;
  }
}

export function logEvent(eventName: string, params?: EventParams): void {
  const analytics = getAnalytics();
  if (analytics && analyticsMod) {
    try {
      void analyticsMod.logEvent(analytics, eventName, params ?? {});
    } catch (error) {
      if (__DEV__) console.warn('[Analytics] logEvent failed:', eventName, error);
    }
  }
  if (__DEV__) {
    console.log('[Analytics]', eventName, params ?? {});
  }
}

export function logButtonClick(screenName: string, buttonName: string, extraParams?: EventParams): void {
  logEvent(ANALYTICS_EVENTS.BUTTON_CLICK, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
    [ANALYTICS_PARAMS.BUTTON_NAME]: buttonName,
    ...extraParams,
  });
}

export function logTabSelect(screenName: string, tabId: string): void {
  logEvent(ANALYTICS_EVENTS.TAB_SELECT, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
    [ANALYTICS_PARAMS.TAB_ID]: tabId,
  });
}

export function logSegmentSelect(screenName: string, segment: string): void {
  logEvent(ANALYTICS_EVENTS.SEGMENT_SELECT, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
    [ANALYTICS_PARAMS.SEGMENT]: segment,
  });
}

export function logDropdownOpen(screenName: string): void {
  logEvent(ANALYTICS_EVENTS.DROPDOWN_OPEN, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
  });
}

export function logDropdownSelect(screenName: string, value: string): void {
  logEvent(ANALYTICS_EVENTS.DROPDOWN_SELECT, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
    [ANALYTICS_PARAMS.VALUE]: value,
  });
}

export function logDropdownConfirm(screenName: string, value: string): void {
  logEvent(ANALYTICS_EVENTS.DROPDOWN_CONFIRM, {
    [ANALYTICS_PARAMS.SCREEN_NAME]: screenName,
    [ANALYTICS_PARAMS.VALUE]: value,
  });
}

export { ANALYTICS_EVENTS, ANALYTICS_PARAMS, SCREENS };
