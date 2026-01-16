import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "../../src/hooks";
import BannerCard, { BannerType } from "../../src/components/BannerCard";

export default function Home() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="semibold24 text-text">Home Screen</Text>
    </View>
  );
}
