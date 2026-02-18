import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  checkDeviceSecurityStatus,
  getSecurityWarningMessage,
} from "../src/services/deviceSecurityService";
import { SecurityBlockDialog } from "../src/components/securityBlockDialog/securityBlockDialog";
import { CrashlyticsService } from "../src/services/crashlytics";
import { AuthProvider } from "../src/hooks/useAuth";
import { ThemeProvider, getThemeVars } from "../src/context/ThemeContext";
import { ThemeService } from "../src/services/themeService";
import { ThemeColors } from "../src/types/theme";
import { colors } from "../src/constants/colors";

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

  const [theme, setTheme] = useState<ThemeColors | null>(null);
  const [themeLoading, setThemeLoading] = useState(true);
  const [isDeviceCompromised, setIsDeviceCompromised] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await ThemeService.fetchTheme();
        if (response.success) {
          setTheme(response.data.default_theme);
        }
      } catch (err) {
        console.error("Failed to fetch theme:", err);
      } finally {
        setThemeLoading(false);
      }
    };

    loadData();
    CrashlyticsService.initialize().catch(console.error);

    // Check device security
    const checkSecurity = async () => {
      const result = await checkDeviceSecurityStatus();
      if (result.isCompromised) {
        setIsDeviceCompromised(true);
        setSecurityMessage(getSecurityWarningMessage(result.reason));
      }
    };
    checkSecurity();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !themeLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, themeLoading]);

  const activeScheme = useMemo(() => {
    if (!theme) return null;
    return systemColorScheme === 'dark' ? theme.dark_scheme : theme.light_scheme;
  }, [theme, systemColorScheme]);

  if ((!fontsLoaded && !fontError) || themeLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.loader} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <View style={[{ flex: 1 }, getThemeVars(activeScheme)]}>
        <AuthProvider>
          <SafeAreaProvider>
            <SecurityBlockDialog
              visible={isDeviceCompromised}
              message={securityMessage}
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
              <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="screens/coin-detail" />
            </Stack>
          </SafeAreaProvider>
        </AuthProvider>
      </View>
    </ThemeProvider>
  );
}
