export const constants = {
    splash: {
        loadingTime: 5000,
    },
    axiosStatus: {
        fullFilled: "fulfilled",
        rejected: "rejected"
    } as const,
    appStoreUrls: {
        ios: 'https://apps.apple.com/app/idXXXXXXXXXX',
        android: 'https://play.google.com/store/apps/details?id=com.definex.xcoin',
    },
    platform: {
        IOS: 'ios' as const,
        ANDROID: 'android' as const,
    } as const,
};

