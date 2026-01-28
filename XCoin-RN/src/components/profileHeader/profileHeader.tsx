import React from "react";
import { View, Text, ImageSourcePropType } from "react-native";
import { SmartImage } from "../smartImage/smartImage";

export type ProfileHeaderProps = {
  image?: string;
  name: string;
  mail: string;
  phone: string;
};

const fallbackLogo: ImageSourcePropType = require("../../../assets/images/xcoin_logo.png")

export function ProfileHeader(data: ProfileHeaderProps) {
  const { image, name, mail, phone } = data

  return (
    <View className="mx-4 mt-3 rounded-xl bg-primaryBlue overflow-hidden items-center justify-center">
      <SmartImage
        uri={image}
        fallback={fallbackLogo}
        className="mt-6 h-[88px] w-[88px] rounded-full"
        width={88}
        height={88}
      />

      <Text className="mt-3 bold20 text-white text-center">{name}</Text>
      <Text className="mt-3 lightItalic12 text-white text-center">{mail}</Text>
      <Text className="mt-1 mb-5 lightItalic12 text-white text-center">{phone}</Text>
    </View>
  );
}
