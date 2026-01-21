import React from "react";
import { View, Image, Text, ImageSourcePropType } from "react-native";

export type ProfileHeaderProps = {
  image?: string;
  name: string;
  mail: string;
  phone: string;
};

const fallbackLogo: ImageSourcePropType = require("../../../assets/images/xcoin_logo.png")

export function ProfileHeader(data: ProfileHeaderProps) {
  const { image, name, mail, phone } = data
  const uri = image?.trim() ?? ""
  const hasImage = uri.length > 0
  const imgSource: ImageSourcePropType = hasImage ? { uri } : fallbackLogo

  return (
    <View className="mx-4 mt-3 rounded-xl bg-primaryBlue overflow-hidden items-center justify-center">
      <Image
        source={imgSource}
        className="mt-6 h-[88px] w-[88px] rounded-full"
        resizeMode="cover"
      />

      <Text className="mt-3 bold20 text-white text-center">{name}</Text>
      <Text className="mt-3 lightItalic12 text-white text-center">{mail}</Text>
      <Text className="mt-1 mb-5 lightItalic12 text-white text-center">{phone}</Text>
    </View>
  );
}
