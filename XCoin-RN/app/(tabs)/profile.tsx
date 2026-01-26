import React from "react";
import { ScrollView, View } from "react-native";
import { ProfileHeader } from "../../src/components/profileHeader/profileHeader";
import ProfileButton from "../../src/components/profileButton/profileButton";
import { profileButtonData } from "../../src/components/profileButton/profileButtonData";
import { useTranslation } from "../../src/hooks/useTranslation";

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-white">
      <ProfileHeader
        image="https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png"
        name="DefineX"
        mail="definex@teamdefinex.com"
        phone="+90 555 555 55 55"
      />
      <View className="mt-8">
        {profileButtonData.map((button, index) => (
          <ProfileButton
            key={button.id}
            title={useTranslation(button.titleKey)}
            icon={button.icon}
            onPress={button.onPress}
            isLast={index === profileButtonData.length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
}
