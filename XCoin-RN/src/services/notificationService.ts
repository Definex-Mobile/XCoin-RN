import Constants, { AppOwnership } from 'expo-constants';
import { Platform } from 'react-native';

type NotifeeModule = typeof import('@notifee/react-native');
type MessagingModule = typeof import('@react-native-firebase/messaging');

type NotificationModules = {
    notifee: NotifeeModule['default'];
    AndroidImportance: NotifeeModule['AndroidImportance'];
    EventType: NotifeeModule['EventType'];
    AuthorizationStatus: MessagingModule['AuthorizationStatus'];
    getAPNSToken: MessagingModule['getAPNSToken'];
    getInitialNotification: MessagingModule['getInitialNotification'];
    getMessaging: MessagingModule['getMessaging'];
    getToken: MessagingModule['getToken'];
    isDeviceRegisteredForRemoteMessages: MessagingModule['isDeviceRegisteredForRemoteMessages'];
    onMessage: MessagingModule['onMessage'];
    onNotificationOpenedApp: MessagingModule['onNotificationOpenedApp'];
    registerDeviceForRemoteMessages: MessagingModule['registerDeviceForRemoteMessages'];
    requestPermission: MessagingModule['requestPermission'];
    setBackgroundMessageHandler: MessagingModule['setBackgroundMessageHandler'];
    messagingInstance: ReturnType<MessagingModule['getMessaging']>;
};

let notificationModules: NotificationModules | null | undefined;
let didWarnUnavailable = false;
let backgroundHandlerRegistered = false;

function isExpoGo(): boolean {
    return Constants.appOwnership === AppOwnership.Expo;
}

function warnUnavailableOnce(message: string, error?: unknown) {
    if (didWarnUnavailable) {
        return;
    }

    didWarnUnavailable = true;
    console.warn(`[NotificationService] ${message}`);
    if (error) {
        console.warn(error);
    }
}

function ensureBackgroundHandlerRegistered(modules: NotificationModules) {
    if (backgroundHandlerRegistered) {
        return;
    }

    modules.setBackgroundMessageHandler(modules.messagingInstance, async remoteMessage => {
        console.log('[NotificationService] Message handled in the background!', remoteMessage);
    });
    backgroundHandlerRegistered = true;
}

function getNotificationModules(): NotificationModules | null {
    if (notificationModules !== undefined) {
        return notificationModules;
    }

    if (isExpoGo()) {
        notificationModules = null;
        warnUnavailableOnce('Skipped in Expo Go. Use a development build for push notifications.');
        return null;
    }

    try {
        const notifeePackage = require('@notifee/react-native') as NotifeeModule;
        const messagingPackage = require('@react-native-firebase/messaging') as MessagingModule;
        const messagingInstance = messagingPackage.getMessaging();

        notificationModules = {
            notifee: notifeePackage.default,
            AndroidImportance: notifeePackage.AndroidImportance,
            EventType: notifeePackage.EventType,
            AuthorizationStatus: messagingPackage.AuthorizationStatus,
            getAPNSToken: messagingPackage.getAPNSToken,
            getInitialNotification: messagingPackage.getInitialNotification,
            getMessaging: messagingPackage.getMessaging,
            getToken: messagingPackage.getToken,
            isDeviceRegisteredForRemoteMessages: messagingPackage.isDeviceRegisteredForRemoteMessages,
            onMessage: messagingPackage.onMessage,
            onNotificationOpenedApp: messagingPackage.onNotificationOpenedApp,
            registerDeviceForRemoteMessages: messagingPackage.registerDeviceForRemoteMessages,
            requestPermission: messagingPackage.requestPermission,
            setBackgroundMessageHandler: messagingPackage.setBackgroundMessageHandler,
            messagingInstance,
        };

        ensureBackgroundHandlerRegistered(notificationModules);
        return notificationModules;
    } catch (error) {
        notificationModules = null;
        warnUnavailableOnce('Native notification modules are not available. Notification setup skipped.', error);
        return null;
    }
}

class NotificationService {
    /**
     * Request permissions for push notifications (iOS mostly)
     */
    async requestUserPermission() {
        const modules = getNotificationModules();
        if (!modules) {
            return false;
        }

        // Firebase permission
        const authStatus = await modules.requestPermission(modules.messagingInstance);
        const enabled =
            authStatus === modules.AuthorizationStatus.AUTHORIZED ||
            authStatus === modules.AuthorizationStatus.PROVISIONAL;

        // Notifee permission (required for some Android 13+ and iOS features)
        await modules.notifee.requestPermission();

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
        const modules = getNotificationModules();
        if (!modules) {
            return null;
        }

        for (let i = 0; i < maxRetries; i++) {
            const apnsToken = await modules.getAPNSToken(modules.messagingInstance);
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
        const modules = getNotificationModules();
        if (!modules) {
            return null;
        }

        try {
            // Required for iOS to fetch the FCM token
            if (Platform.OS === 'ios' && !modules.isDeviceRegisteredForRemoteMessages(modules.messagingInstance)) {
                await modules.registerDeviceForRemoteMessages(modules.messagingInstance);
            }
            // iOS: APNS token must be available before fetching FCM token
            if (Platform.OS === 'ios') {
                const apnsToken = await this.waitForAPNSToken();
                if (!apnsToken) {
                    console.error('[NotificationService] Cannot get FCM token: APNS token not available');
                    return null;
                }
            }
            const token = await modules.getToken(modules.messagingInstance);
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
        const modules = getNotificationModules();
        if (!modules) {
            return;
        }

        if (Platform.OS === 'android') {
            await modules.notifee.createChannel({
                id: 'default',
                name: 'Default Notifications',
                importance: modules.AndroidImportance.HIGH,
            });
            console.log('[NotificationService] Android Notification Channel created');
        }
    }

    /**
     * Set up notification listeners
     */
    setupListeners(onNotificationOpened: (url: string) => void) {
        const modules = getNotificationModules();
        if (!modules) {
            return () => { };
        }

        void this.createDefaultChannel();

        // 1. Foreground messaging (Firebase -> Notifee Banner)
        const unsubscribeMessaging = modules.onMessage(modules.messagingInstance, async remoteMessage => {
            console.log('[NotificationService] Foreground Message Received:', JSON.stringify(remoteMessage, null, 2));

            // If it has a notification payload, display a local banner using Notifee
            if (remoteMessage.notification) {
                await modules.notifee.displayNotification({
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
        const unsubscribeNotifee = modules.notifee.onForegroundEvent(({ type, detail }) => {
            if (type === modules.EventType.PRESS && detail.notification?.data?.url) {
                console.log('[NotificationService] Notifee Banner Tapped:', detail.notification.data.url);
                onNotificationOpened(detail.notification.data.url as string);
            }
        });

        // 3. Background / Interaction handling (Firebase Remote)
        const unsubscribeNotificationOpened = modules.onNotificationOpenedApp(modules.messagingInstance, remoteMessage => {
            console.log('[NotificationService] Background Notification Tapped:', JSON.stringify(remoteMessage, null, 2));
            const url = remoteMessage.data?.url as string;
            if (url) onNotificationOpened(url);
        });

        // 4. Quit state handling (Firebase Remote)
        void modules.getInitialNotification(modules.messagingInstance).then(remoteMessage => {
            if (remoteMessage) {
                console.log('[NotificationService] Quit State Notification Tapped:', JSON.stringify(remoteMessage, null, 2));
                const url = remoteMessage.data?.url as string;
                if (url) onNotificationOpened(url);
            }
        });

        return () => {
            unsubscribeMessaging();
            unsubscribeNotifee();
            unsubscribeNotificationOpened();
        };
    }
}

export const notificationService = new NotificationService();
