const IS_DEV = process.env.APP_VARIANT === "development";

export default {
    expo: {
        name: IS_DEV ? "XCoin-RN Dev" : "XCoin-RN",
        slug: "XCoin-RN",
        version: "1.0.0",
        orientation: "portrait",
        icon: IS_DEV ? "./assets/icon-dev.png" : "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: IS_DEV ? "com.definex.xcoin.dev" : "com.definex.xcoin",
            googleServicesFile: "./GoogleService-Info.plist"
        },
        android: {
            package: IS_DEV ? "com.definex.xcoin.dev" : "com.definex.xcoin",
            googleServicesFile: "./google-services.json",
            adaptiveIcon: {
                foregroundImage: IS_DEV ? "./assets/icon-dev.png" : "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false
        },
        web: {
            favicon: "./assets/favicon.png",
            bundler: "metro"
        },
        plugins: [
            "expo-router",
            "expo-font",
            "@react-native-firebase/app",
            "@react-native-firebase/crashlytics"
        ],
        scheme: "xcoin",
        experiments: {
            typedRoutes: true
        }
    }
};
