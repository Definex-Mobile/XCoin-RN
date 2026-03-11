const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREBUILD = process.argv.some(arg => arg.includes("prebuild") || arg.includes("configure"));

export default {
    expo: {
        name: IS_DEV ? "XCoin-RN Dev" : "XCoin-RN",
        slug: "XCoin-RN",
        version: "1.0.0",
        orientation: "portrait",
        icon: IS_DEV ? "./assets/ic_dev.png" : "./assets/ic_prod.png",
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
            googleServicesFile: "./GoogleService-Info.plist",
            backgroundModes: ["remote-notification"],
            entitlements: {
                "aps-environment": IS_DEV ? "development" : "production"
            }
        },
        android: {
            package: IS_DEV ? "com.definex.xcoin.dev" : "com.definex.xcoin",
            googleServicesFile: "./google-services.json",
            adaptiveIcon: {
                foregroundImage: IS_DEV ? "./assets/ic_dev.png" : "./assets/ic_prod.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            permissions: [
                "android.permission.DETECT_SCREEN_CAPTURE",
                "android.permission.DETECT_SCREEN_RECORDING"
            ]
        },
        web: {
            favicon: "./assets/favicon.png",
            bundler: "metro"
        },
        plugins: [
            "expo-router",
            "expo-font",
            [
                "expo-build-properties",
                {
                    "ios": {
                        "useFrameworks": "static"
                    }
                }
            ],
            "@react-native-firebase/app",
            "@react-native-firebase/crashlytics",
            "@react-native-firebase/messaging",
            [
                "freerasp-react-native/app.plugin.js",
                {
                    "android": {
                        "minSdkVersion": "24"
                    }
                }
            ]
        ],
        scheme: "xcoin",
        experiments: {
            typedRoutes: true
        }
    }
};
