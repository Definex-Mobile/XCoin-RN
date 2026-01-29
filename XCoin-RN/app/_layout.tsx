import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../src/hooks/useAuth";

import LoginScreen from "./login";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();
import "../src/constants/i18n";

function RootLayoutContent() {
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

  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      // Splash ekranını 2 saniye göster
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 1. Splash Ekranı göster
  if (showSplash) {
    return (
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaProvider>
    );
  }

  // 2. Login Ekranı (isAuthenticated false ise)
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <LoginScreen />
      </SafeAreaProvider>
    );
  }

  // 3. Ana Ekran - Tabs (isAuthenticated true ise)
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
