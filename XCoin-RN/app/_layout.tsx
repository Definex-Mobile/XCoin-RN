import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  checkDeviceSecurityStatus,
  getSecurityWarningMessage,
} from "../src/services/deviceSecurityService";
import { SecurityBlockDialog } from "../src/components/securityBlockDialog/securityBlockDialog";
import { CrashlyticsService } from "../src/services/crashlytics";

SplashScreen.preventAutoHideAsync();
import "../src/constants/i18n";

export default function RootLayout() {
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

  const [isDeviceCompromised, setIsDeviceCompromised] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");

  useEffect(() => {
    CrashlyticsService.initialize().catch(console.error);

    const setupGlobalErrorHandler = () => {
      const ErrorUtils = (global as any).ErrorUtils;
      if (!ErrorUtils) return;

      const originalHandler = ErrorUtils.getGlobalHandler?.();

      ErrorUtils.setGlobalHandler?.((error: Error, isFatal?: boolean) => {
        CrashlyticsService.recordError(
          error,
          isFatal ? "Fatal Error" : "Non-Fatal Error"
        );
        originalHandler?.(error, isFatal);
      });
    };

    setupGlobalErrorHandler();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Check device security on app startup
  useEffect(() => {
    const checkSecurity = async () => {
      const result = await checkDeviceSecurityStatus();
      if (result.isCompromised) {
        setIsDeviceCompromised(true);
        setSecurityMessage(getSecurityWarningMessage(result.reason));
      }
    };

    checkSecurity();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SecurityBlockDialog
        visible={isDeviceCompromised}
        message={securityMessage}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/coin-detail" />
      </Stack>
    </SafeAreaProvider>
  );
}
