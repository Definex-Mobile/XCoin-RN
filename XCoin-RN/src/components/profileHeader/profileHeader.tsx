import React from "react";
import { View, Text, ImageSourcePropType, TouchableOpacity } from "react-native";
import { SmartImage } from "../smartImage/smartImage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

export type ProfileHeaderProps = {
  image?: string;
  name: string;
  mail: string;
  phone: string;
  onImagePress?: () => void;
};

const fallbackLogo: ImageSourcePropType = require("../../../assets/images/xcoin_logo.png");

import { useTheme } from "../../context/ThemeContext";

export function ProfileHeader(data: ProfileHeaderProps) {
  const { image, name, mail, phone, onImagePress } = data;
  const { activeScheme } = useTheme();

  return (
    <View className="mx-[16px] mt-[25px] rounded-xl bg-primary overflow-hidden items-center justify-center">
      <View className="mt-[24px] relative">
        <SmartImage
          uri={image}
          fallback={fallbackLogo}
          className="h-[88px] w-[88px] rounded-full"
          width={88}
          height={88}
        />
        {onImagePress && (
          <TouchableOpacity
            onPress={onImagePress}
            className="absolute bottom-0 right-0 bg-surface rounded-full p-1.5 shadow-md shadow-shadow"
          >
            <Ionicons name="camera" size={16} color={activeScheme?.primary || colors.loader} />
          </TouchableOpacity>
        )}
      </View>

      <Text className="mt-[12px] bold20 text-onPrimary text-center">{name}</Text>
      <Text className="mt-[12px] lightItalic12 text-onPrimary text-center">
        {mail}
      </Text>
      <Text className="mt-[4px] mb-[20px] lightItalic12 text-onPrimary text-center">
        {phone}
      </Text>
    </View>
  );
}
