import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  freeRaspConfig,
  createThreatActions,
  createRaspExecutionStateActions,
  ThreatState,
  useOptionalFreeRasp,
} from "../src/services/freeRaspService";
import { SecurityBlockDialog } from "../src/components/securityBlockDialog/securityBlockDialog";
import { CrashlyticsService } from "../src/services/crashlytics";
import { AuthProvider } from "../src/hooks/useAuth";
import { ThemeProvider } from "../src/context/ThemeContext";
import { colors } from "../src/constants/colors";

import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { notificationService } from "../src/services/notificationService";

SplashScreen.preventAutoHideAsync();
import "../src/constants/i18n";

export default function RootLayout() {
  console.log("🚀 [RootLayout] MOUNTED");
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    "Roboto-Thin": require("../assets/fonts/roboto/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("../assets/fonts/roboto/Roboto-ThinItalic.ttf"),

    "Roboto-ExtraLight": require("../assets/fonts/roboto/Roboto-ExtraLight.ttf"),
    "Roboto-ExtraLightItalic": require("../assets/fonts/roboto/Roboto-ExtraLightItalic.ttf"),

    "Roboto-Light": require("../assets/fonts/roboto/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("../assets/fonts/roboto/Roboto-LightItalic.ttf"),

    "Roboto-Regular": require("../assets/fonts/roboto/Roboto-Regular.ttf"),
    "Roboto-Italic": require("../assets/fonts/roboto/Roboto-Italic.ttf"),

    "Roboto-Medium": require("../assets/fonts/roboto/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("../assets/fonts/roboto/Roboto-MediumItalic.ttf"),

    "Roboto-SemiBold": require("../assets/fonts/roboto/Roboto-SemiBold.ttf"),
    "Roboto-SemiBoldItalic": require("../assets/fonts/roboto/Roboto-SemiBoldItalic.ttf"),

    "Roboto-Bold": require("../assets/fonts/roboto/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("../assets/fonts/roboto/Roboto-BoldItalic.ttf"),

    "Roboto-ExtraBold": require("../assets/fonts/roboto/Roboto-ExtraBold.ttf"),
    "Roboto-ExtraBoldItalic": require("../assets/fonts/roboto/Roboto-ExtraBoldItalic.ttf"),

    "Roboto-Black": require("../assets/fonts/roboto/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("../assets/fonts/roboto/Roboto-BlackItalic.ttf"),
  });

  const [threatState, setThreatState] = useState<ThreatState>({
    isBlocked: false,
  });

  const actions = useMemo(() => createThreatActions(setThreatState), []);
  const raspStateActions = useMemo(() => createRaspExecutionStateActions(), []);

  useOptionalFreeRasp(freeRaspConfig, actions, raspStateActions);

  useEffect(() => {
    CrashlyticsService.initialize().catch(console.error);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isActive = true;

    const setupNotifications = async () => {
      const hasPermission = await notificationService.requestUserPermission();
      if (hasPermission) {
        await notificationService.getFcmToken();
      }

      const listenersUnsubscribe = notificationService.setupListeners((url) => {
        try {
          console.log("[RootLayout] Received Deep Link URL:", url);
          const parsed = Linking.parse(url);
          console.log("[RootLayout] Parsed Deep Link Object:", JSON.stringify(parsed, null, 2));

          // Construct the full path by joining hostname and path if necessary
          let fullPath = "";
          if (parsed.hostname && parsed.hostname !== 'localhost') {
            fullPath += parsed.hostname;
          }
          if (parsed.path) {
            fullPath += (fullPath ? "/" : "") + parsed.path;
          }

          // Ensure we have a valid path
          if (fullPath && fullPath !== "/") {
            const pathname = fullPath.startsWith("/") ? fullPath : `/${fullPath}`;
            console.log("[RootLayout] Navigating to:", pathname, "with params:", parsed.queryParams);

            router.push({
              pathname: pathname as any,
              params: parsed.queryParams as any
            });
          } else {
            console.warn("[RootLayout] Deep link received but path resolved to root or is empty:", url);
          }
        } catch (error) {
          console.error("[RootLayout] Deep linking error:", error);
        }
      });

      if (isActive) {
        unsubscribe = listenersUnsubscribe;
      } else {
        listenersUnsubscribe();
      }
    };

    void setupNotifications();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [router]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.loader} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <SecurityBlockDialog
            visible={threatState.isBlocked}
            threatType={threatState.threatType}
          />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'none',
              contentStyle: { backgroundColor: colors.background }
            }}
            initialRouteName="index"
          >
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="screens/login" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="screens/contact" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="screens/coin-detail" />
          </Stack>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
