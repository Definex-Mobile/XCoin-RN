import React from "react";
import { View, Text, ScrollView } from "react-native";
import BannerCard, {
  BannerType,
} from "../../src/components/bannerCard/bannerCard";
import { useTranslation } from "../../src/hooks/useTranslation";

export default function Home() {
  function handleBannerPress(): void {
    console.log("Button Pressed");
  }

  return (
    <ScrollView className="flex-1 bg-background-gray">
      <View className="pt-4">
        <BannerCard
          title={useTranslation("bannerCard.title") + " <Username>,"}
          description={useTranslation("bannerCard.description")}
          buttonText={useTranslation("bannerCard.buttonText")}
          onButtonPress={handleBannerPress}
          image={require("../../assets/images/img-welcome-card.png")}
          bannerType={BannerType.HOME}
        />
      </View>
    </ScrollView>
  );
}
