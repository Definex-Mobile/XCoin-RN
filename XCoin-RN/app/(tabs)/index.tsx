import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "../../src/hooks";
import BannerCard from "../../src/components/BannerCard";

export default function Home() {
  const handleBannerPress = () => {
    console.log("Banner butonuna tıklandı!");
  };

  return (
    <ScrollView className="flex-1 bg-background-gray">
      <View className="pt-4">
        <BannerCard
          height={140}
          title={useTranslation("bannerCard.title") + " <Username>,"}
          description={useTranslation("bannerCard.description")}
          buttonText={useTranslation("bannerCard.buttonText")}
          onButtonPress={handleBannerPress}
          image={require("../../assets/images/img-welcome-card.png")}
          backgroundColor="#0063F5"
        />
      </View>
    </ScrollView>
  );
}
