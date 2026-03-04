type CrashlyticsModule = {
  getCrashlytics: () => unknown;
  setCrashlyticsCollectionEnabled: (crashlytics: unknown, enabled: boolean) => Promise<null>;
  log: (crashlytics: unknown, message: string) => void;
  recordError: (crashlytics: unknown, error: Error) => void;
  setUserId: (crashlytics: unknown, userId: string) => Promise<null>;
  setAttribute: (crashlytics: unknown, key: string, value: string) => Promise<null>;
  crash: (crashlytics: unknown) => void;
};

let crashlyticsModule: CrashlyticsModule | null = null;
let crashlyticsInstance: unknown = null;
let crashlyticsAvailabilityChecked = false;

function getCrashlyticsModule(): CrashlyticsModule | null {
  if (crashlyticsAvailabilityChecked) return crashlyticsModule;

  crashlyticsAvailabilityChecked = true;
  try {
    crashlyticsModule = require('@react-native-firebase/crashlytics') as CrashlyticsModule;
    return crashlyticsModule;
  } catch {
    console.warn('Firebase Crashlytics native module not available');
    return null;
  }
}

function getCrashlyticsInstance(): unknown | null {
  if (crashlyticsInstance) return crashlyticsInstance;

  const module = getCrashlyticsModule();
  if (!module) return null;

  try {
    crashlyticsInstance = module.getCrashlytics();
    return crashlyticsInstance;
  } catch (error) {
    console.error('Crashlytics instance oluşturulamadı:', error);
    return null;
  }
}

export const CrashlyticsService = {
  initialize: async () => {
    const module = getCrashlyticsModule();
    const instance = getCrashlyticsInstance();
    if (!module || !instance) {
      console.log('Crashlytics skip - native module not available');
      return;
    }

    const {
      setCrashlyticsCollectionEnabled,
      log: crashlyticsLog,
    } = module;

    try {
      await setCrashlyticsCollectionEnabled(instance, true);
      crashlyticsLog(instance, 'Crashlytics başlatıldı');
    } catch (error) {
      console.error('Crashlytics başlatılamadı:', error);
    }
  },

  recordError: (error: Error, context?: string) => {
    const module = getCrashlyticsModule();
    const instance = getCrashlyticsInstance();
    if (!module || !instance) return;

    const {
      log: crashlyticsLog,
      recordError: crashlyticsRecordError,
    } = module;

    try {
      if (context) {
        crashlyticsLog(instance, `Context: ${context}`);
      }
      crashlyticsRecordError(instance, error);
    } catch (err) {
      console.error('Hata kaydedilemedi:', err);
    }
  },

  log: (message: string) => {
    const module = getCrashlyticsModule();
    const instance = getCrashlyticsInstance();
    if (!module || !instance) return;

    const { log: crashlyticsLog } = module;

    try {
      crashlyticsLog(instance, message);
    } catch (error) {
      console.error('Log eklenemedi:', error);
    }
  },

  setUserId: (userId: string) => {
    const module = getCrashlyticsModule();
    const instance = getCrashlyticsInstance();
    if (!module || !instance) return;

    const { setUserId: crashlyticsSetUserId } = module;

    try {
      void crashlyticsSetUserId(instance, userId).catch(error => {
        console.error('User ID ayarlanamadı:', error);
      });
    } catch (error) {
      console.error('User ID ayarlanamadı:', error);
    }
  },

  setAttribute: (key: string, value: string) => {
    const module = getCrashlyticsModule();
    const instance = getCrashlyticsInstance();
    if (!module || !instance) return;

    const { setAttribute: crashlyticsSetAttribute } = module;

    try {
      void crashlyticsSetAttribute(instance, key, value).catch(error => {
        console.error('Attribute eklenemedi:', error);
      });
    } catch (error) {
      console.error('Attribute eklenemedi:', error);
    }
  },

  testCrash: () => {
    const module = getCrashlyticsModule();
    const instance = getCrashlyticsInstance();
    if (!module || !instance) return;

    const { crash: triggerCrash } = module;

    if (__DEV__) {
      console.warn('Test crash tetikleniyor...');
      triggerCrash(instance);
    } else {
      console.warn('Test crash sadece development modunda çalışır');
    }
  },
};
