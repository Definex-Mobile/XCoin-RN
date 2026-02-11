export const constants = {
    splash: {
        loadingTime: 5000,
    },
    platform: {
        IOS: "ios",
        ANDROID: "android",
    } as const,
    appStoreUrls: {
        ios: "https://apps.apple.com/app/idXXXXXXXXX",
        android: "https://play.google.com/store/apps/details?id=com.xcoinrn",
    },
    axiosStatus: {
        fullFilled: "fulfilled",
        rejected: "rejected"
    } as const,
};

