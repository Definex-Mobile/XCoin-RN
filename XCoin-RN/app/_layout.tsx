import '../global.css';
import { Stack } from 'expo-router';
import '../src/constants/i18n'; // i18n konfigürasyonunu yükle

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
