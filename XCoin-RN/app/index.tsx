import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { strings } from '../src/constants/strings';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/(tabs)');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View className="flex-1 bg-white items-center justify-between pb-8">
            <View className="flex-1 items-center justify-center">
                <View className="flex-row items-center justify-center">
                    <Image
                        source={require('../assets/images/xcoin_logo.png')}
                        className="w-16 h-16"
                        resizeMode="contain"
                    />
                    <Text className="text-gray-800 text-4xl font-bold ml-3">
                        {strings.splash.appName}
                    </Text>
                </View>
            </View>
            <Text className="text-gray-400 text-sm italic">
                {strings.splash.tagline}
            </Text>
        </View>
    );
}
