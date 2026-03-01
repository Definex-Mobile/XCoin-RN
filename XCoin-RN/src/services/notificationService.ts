import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';

class NotificationService {
    /**
     * Requesst permissions for push notifications (iOS mostly)
     */
    async requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('[NotificationService] Authorization status:', authStatus);
            return true;
        }
        return false;
    }

    /**
     * Get the device FCM token
     */
    async getFcmToken() {
        try {
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
     * Set up notification listeners
     */
    setupListeners(onNotificationOpened: (url: string) => void) {
        // 1. Foreground messaging
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('[NotificationService] Foreground Message:', remoteMessage);

            // For now, let's just show an alert or handle it based on requirements
            // In a real app, you might want to show a custom local notification/banner
            if (remoteMessage.notification) {
                Alert.alert(
                    remoteMessage.notification.title || 'New Notification',
                    remoteMessage.notification.body || '',
                    [
                        {
                            text: 'View',
                            onPress: () => {
                                const url = remoteMessage.data?.url as string;
                                if (url) onNotificationOpened(url);
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
            }
        });

        // 2. Background / Interaction handling
        // This is called when the app is in background and user taps the notification
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('[NotificationService] Notification caused app to open from background state:', remoteMessage);
            const url = remoteMessage.data?.url as string;
            if (url) onNotificationOpened(url);
        });

        // 3. Quit state handling
        // Check if the app was opened from a notification when it was completely closed
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('[NotificationService] Notification caused app to open from quit state:', remoteMessage);
                    const url = remoteMessage.data?.url as string;
                    if (url) onNotificationOpened(url);
                }
            });

        return unsubscribe;
    }
}

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[NotificationService] Message handled in the background!', remoteMessage);
});

export const notificationService = new NotificationService();
