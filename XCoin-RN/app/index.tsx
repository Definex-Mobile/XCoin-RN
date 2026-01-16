import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { constants } from "../src/constants/constants";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(tabs)");
    }, constants.splash.loadingTime);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-white items-center justify-between pb-8">
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-center justify-center">
          <Image
            source={require("../assets/images/xcoin_logo.png")}
            className="w-16 h-16"
            resizeMode="contain"
          />
          <Text className="bold42 text-gray-800 ml-3">{"COINS"}</Text>
        </View>
      </View>
      <Text className="semibold12 text-gray-400 italic">
        {"Turkey's Highly Rated Cryptocurrency Exchange"}
      </Text>
    </View>
  );
}
