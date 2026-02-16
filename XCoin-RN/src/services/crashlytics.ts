let crashlytics: any = null;

try {
  crashlytics = require('@react-native-firebase/crashlytics').default;
} catch (error) {
  console.warn('Firebase Crashlytics native module not available');
}

export const CrashlyticsService = {
  initialize: async () => {
    if (!crashlytics) {
      console.log('Crashlytics skip - native module not available');
      return;
    }
    try {
      await crashlytics().setCrashlyticsCollectionEnabled(true);
      crashlytics().log('Crashlytics başlatıldı');
    } catch (error) {
      console.error('Crashlytics başlatılamadı:', error);
    }
  },

  recordError: (error: Error, context?: string) => {
    if (!crashlytics) return;
    try {
      if (context) {
        crashlytics().log(`Context: ${context}`);
      }
      crashlytics().recordError(error);
    } catch (e) {
      console.error('Hata kaydedilemedi:', e);
    }
  },

  log: (message: string) => {
    if (!crashlytics) return;
    try {
      crashlytics().log(message);
    } catch (error) {
      console.error('Log eklenemedi:', error);
    }
  },

  setUserId: (userId: string) => {
    try {
      crashlytics().setUserId(userId);
    } catch (error) {
      console.error('User ID ayarlanamadı:', error);
    }
  },

  setAttribute: (key: string, value: string) => {
    try {
      crashlytics().setAttribute(key, value);
    } catch (error) {
      console.error('Attribute eklenemedi:', error);
    }
  },

  testCrash: () => {
    if (__DEV__) {
      console.warn('Test crash tetikleniyor...');
      crashlytics().crash();
    } else {
      console.warn('Test crash sadece development modunda çalışır');
    }
  },
};
