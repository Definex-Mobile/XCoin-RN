let crashlyticsModule: any = null;
let firebaseAppModule: any = null;

try {
  crashlyticsModule = require('@react-native-firebase/crashlytics');
  firebaseAppModule = require('@react-native-firebase/app');
} catch (error) {
  console.warn('Firebase modules not available');
}

function getCrashlytics() {
  if (!crashlyticsModule || !firebaseAppModule) return null;
  const { getApp } = firebaseAppModule;
  const { getCrashlytics: getCrashlyticsFunc } = crashlyticsModule;
  return getCrashlyticsFunc(getApp());
}

export const CrashlyticsService = {
  initialize: async () => {
    const crashlytics = getCrashlytics();
    if (!crashlytics) {
      console.log('Crashlytics skip - native module not available');
      return;
    }
    try {
      await crashlytics.setCrashlyticsCollectionEnabled(true);
      crashlytics.log('Crashlytics başlatıldı');
    } catch (error) {
      console.error('Crashlytics başlatılamadı:', error);
    }
  },

  recordError: (error: Error, context?: string) => {
    const crashlytics = getCrashlytics();
    if (!crashlytics) return;
    try {
      if (context) {
        crashlytics.log(`Context: ${context}`);
      }
      crashlytics.recordError(error);
    } catch (e) {
      console.error('Hata kaydedilemedi:', e);
    }
  },

  log: (message: string) => {
    const crashlytics = getCrashlytics();
    if (!crashlytics) return;
    try {
      crashlytics.log(message);
    } catch (error) {
      console.error('Log eklenemedi:', error);
    }
  },

  setUserId: (userId: string) => {
    const crashlytics = getCrashlytics();
    if (!crashlytics) return;
    try {
      crashlytics.setUserId(userId);
    } catch (error) {
      console.error('User ID ayarlanamadı:', error);
    }
  },

  setAttribute: (key: string, value: string) => {
    const crashlytics = getCrashlytics();
    if (!crashlytics) return;
    try {
      crashlytics.setAttribute(key, value);
    } catch (error) {
      console.error('Attribute eklenemedi:', error);
    }
  },

  testCrash: () => {
    const crashlytics = getCrashlytics();
    if (!crashlytics) return;
    if (__DEV__) {
      console.warn('Test crash tetikleniyor...');
      crashlytics.crash();
    } else {
      console.warn('Test crash sadece development modunda çalışır');
    }
  },
};
