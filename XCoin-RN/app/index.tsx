import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTranslation, useLanguage } from '../src/hooks';

export default function SplashScreen() {
    const router = useRouter();
    const { toggleLanguage, currentLanguage } = useLanguage();

    return (
        <View className="flex-1 bg-secondary items-center justify-center p-5">
            <StatusBar style="light" />
            
            <View className="absolute top-14 right-5">
                <TouchableOpacity
                    onPress={toggleLanguage}
                    className="bg-primary/20 px-4 py-2 rounded-full border border-primary/30 active:opacity-80"
                >
                    <Text className="text-white text-sm font-semibold">
                        {currentLanguage === 'tr' ? 'EN' : 'TR'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text className="text-5xl font-bold text-white mb-2">XCoin</Text>
            <Text className="text-xl text-text-light mb-16">
                {useTranslation('splash.subtitle')}
            </Text>

            <TouchableOpacity
                className="bg-primary px-12 py-4 rounded-full shadow-lg active:opacity-80"
                onPress={() => router.push('/(tabs)')}
            >
                <Text className="text-white text-lg font-semibold">
                    {useTranslation('splash.startButton')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
