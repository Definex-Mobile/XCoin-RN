import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-secondary items-center justify-center p-5">
            <StatusBar style="light" />
            <Text className="text-5xl font-bold text-white mb-2">XCoin</Text>
            <Text className="text-xl text-text-light mb-16">Hoş Geldiniz</Text>

            <TouchableOpacity
                className="bg-primary px-12 py-4 rounded-full shadow-lg active:opacity-80"
                onPress={() => router.push('/(tabs)')}
            >
                <Text className="text-white text-lg font-semibold">Başla</Text>
            </TouchableOpacity>
        </View>
    );
}
