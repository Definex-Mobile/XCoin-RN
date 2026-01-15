import '../global.css';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Thin': require('../assets/fonts/roboto/Roboto-Thin.ttf'),
    'Roboto-ThinItalic': require('../assets/fonts/roboto/Roboto-ThinItalic.ttf'),

    'Roboto-ExtraLight': require('../assets/fonts/roboto/Roboto-ExtraLight.ttf'),
    'Roboto-ExtraLightItalic': require('../assets/fonts/roboto/Roboto-ExtraLightItalic.ttf'),

    'Roboto-Light': require('../assets/fonts/roboto/Roboto-Light.ttf'),
    'Roboto-LightItalic': require('../assets/fonts/roboto/Roboto-LightItalic.ttf'),

    'Roboto-Regular': require('../assets/fonts/roboto/Roboto-Regular.ttf'),
    'Roboto-Italic': require('../assets/fonts/roboto/Roboto-Italic.ttf'),

    'Roboto-Medium': require('../assets/fonts/roboto/Roboto-Medium.ttf'),
    'Roboto-MediumItalic': require('../assets/fonts/roboto/Roboto-MediumItalic.ttf'),

    'Roboto-SemiBold': require('../assets/fonts/roboto/Roboto-SemiBold.ttf'),
    'Roboto-SemiBoldItalic': require('../assets/fonts/roboto/Roboto-SemiBoldItalic.ttf'),

    'Roboto-Bold': require('../assets/fonts/roboto/Roboto-Bold.ttf'),
    'Roboto-BoldItalic': require('../assets/fonts/roboto/Roboto-BoldItalic.ttf'),

    'Roboto-ExtraBold': require('../assets/fonts/roboto/Roboto-ExtraBold.ttf'),
    'Roboto-ExtraBoldItalic': require('../assets/fonts/roboto/Roboto-ExtraBoldItalic.ttf'),

    'Roboto-Black': require('../assets/fonts/roboto/Roboto-Black.ttf'),
    'Roboto-BlackItalic': require('../assets/fonts/roboto/Roboto-BlackItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
