import React from "react";
import { View, Text, ImageSourcePropType } from "react-native";
import { SmartImage } from "../smartImage/smartImage";

export type ProfileHeaderProps = {
  image?: string;
  name: string;
  mail: string;
  phone: string;
};

const fallbackLogo: ImageSourcePropType = require("../../../assets/images/xcoin_logo.png");

export function ProfileHeader(data: ProfileHeaderProps) {
  const { image, name, mail, phone } = data;

  return (
    <View className="mx-[16px] mt-[25px] rounded-xl bg-primaryBlue overflow-hidden items-center justify-center">
      <SmartImage
        uri={image}
        fallback={fallbackLogo}
        className="mt-[24px] h-[88px] w-[88px] rounded-full"
        width={88}
        height={88}
      />

      <Text className="mt-[12px] bold20 text-white text-center">{name}</Text>
      <Text className="mt-[12px] lightItalic12 text-white text-center">
        {mail}
      </Text>
      <Text className="mt-[4px] mb-[20px] lightItalic12 text-white text-center">
        {phone}
      </Text>
    </View>
  );
}
