import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
    /**
     * Request permissions for push notifications (iOS mostly)
     */
    async requestUserPermission() {
        // Firebase permission
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        // Notifee permission (required for some Android 13+ and iOS features)
        await notifee.requestPermission();

        if (enabled) {
            console.log('[NotificationService] Authorization status:', authStatus);
            return true;
        }
        return false;
    }

    /**
     * Wait for APNS token to be available (iOS only)
     */
    private async waitForAPNSToken(maxRetries = 5, delayMs = 1500): Promise<string | null> {
        for (let i = 0; i < maxRetries; i++) {
            const apnsToken = await messaging().getAPNSToken();
            if (apnsToken) {
                console.log('[NotificationService] APNS Token available');
                return apnsToken;
            }
            console.log(`[NotificationService] Waiting for APNS token... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        console.warn('[NotificationService] APNS token not available after retries');
        return null;
    }

    /**
     * Get the device FCM token
     */
    async getFcmToken() {
        try {
            // Required for iOS to fetch the FCM token
            if (Platform.OS === 'ios' && !messaging().isDeviceRegisteredForRemoteMessages) {
                await messaging().registerDeviceForRemoteMessages();
            }
            // iOS: APNS token must be available before fetching FCM token
            if (Platform.OS === 'ios') {
                const apnsToken = await this.waitForAPNSToken();
                if (!apnsToken) {
                    console.error('[NotificationService] Cannot get FCM token: APNS token not available');
                    return null;
                }
            }
            const token = await messaging().getToken();
            if (token) {
                console.log('[NotificationService] FCM Token:', token);
                return token;
            }
        } catch (error) {
            console.error('[NotificationService] Error getting FCM token:', error);
        }
        return null;
    }

    /**
     * Create necessary notification channels for Android
     */
    async createDefaultChannel() {
        if (Platform.OS === 'android') {
            await notifee.createChannel({
                id: 'default',
                name: 'Default Notifications',
                importance: AndroidImportance.HIGH,
            });
            console.log('[NotificationService] Android Notification Channel created');
        }
    }

    /**
     * Set up notification listeners
     */
    setupListeners(onNotificationOpened: (url: string) => void) {
        this.createDefaultChannel();

        // 1. Foreground messaging (Firebase -> Notifee Banner)
        const unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
            console.log('[NotificationService] Foreground Message Received:', JSON.stringify(remoteMessage, null, 2));

            // If it has a notification payload, display a local banner using Notifee
            if (remoteMessage.notification) {
                await notifee.displayNotification({
                    title: remoteMessage.notification.title,
                    body: remoteMessage.notification.body,
                    android: {
                        channelId: 'default',
                        smallIcon: 'ic_launcher', // Use standard icon
                        pressAction: {
                            id: 'default',
                        },
                    },
                    data: remoteMessage.data, // Keep the URL data
                });
            }
        });

        // 2. Local Foreground Event (Notifee Banner Tapped)
        const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS && detail.notification?.data?.url) {
                console.log('[NotificationService] Notifee Banner Tapped:', detail.notification.data.url);
                onNotificationOpened(detail.notification.data.url as string);
            }
        });

        // 3. Background / Interaction handling (Firebase Remote)
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('[NotificationService] Background Notification Tapped:', JSON.stringify(remoteMessage, null, 2));
            const url = remoteMessage.data?.url as string;
            if (url) onNotificationOpened(url);
        });

        // 4. Quit state handling (Firebase Remote)
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('[NotificationService] Quit State Notification Tapped:', JSON.stringify(remoteMessage, null, 2));
                    const url = remoteMessage.data?.url as string;
                    if (url) onNotificationOpened(url);
                }
            });

        return () => {
            unsubscribeMessaging();
            unsubscribeNotifee();
        };
    }
}

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[NotificationService] Message handled in the background!', remoteMessage);
});

export const notificationService = new NotificationService();
