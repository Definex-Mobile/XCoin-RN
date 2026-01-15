import React from "react";
import { View, Text, Pressable, Image, DimensionValue } from "react-native";

const tailwindConfig = require("../../tailwind.config.js");
const colors = tailwindConfig.theme.extend.colors;

export enum BannerType {
  HOME = "Home",
  REFER = "Refer",
  LIKE = "Like",
}

interface BannerCardProps {
  greeting?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  image?: any;
  imageRotation?: number;
  bannerType?: BannerType;
  width?: DimensionValue;
  height?: DimensionValue;
  minHeight?: number;
}

const getBannerColor = (type?: BannerType): string => {
  switch (type) {
    case BannerType.HOME:
      return colors.primaryBlue.DEFAULT;
    case BannerType.REFER:
      return colors.accent.DEFAULT;
    case BannerType.LIKE:
      return colors.primary.DEFAULT;
    default:
      return colors.primaryBlue.DEFAULT;
  }
};

export default function BannerCard({
  title,
  description,
  buttonText,
  onButtonPress,
  image,
  bannerType,
  width,
  height,
}: BannerCardProps) {
  const backgroundColor = getBannerColor(bannerType);

  return (
    <View
      style={{
        backgroundColor,
        ...(width && { width }),
        ...(height && { height }),
      }}
      className="mx-4 px-6 py-6 relative rounded-2xl overflow-hidden shadow-lg"
    >
      {image && (
        <Image
          source={image}
          className="w-[140px] h-[140px] absolute -bottom-2 right-0 z-0 opacity-70"
          resizeMode="contain"
        />
      )}

      <View className="relative z-10">
        {title && (
          <Text className="text-white/90 text-s italic mb-2">{title}</Text>
        )}

        {description && (
          <Text className="text-white text-xl font-semibold leading-tight mb-3 ">
            {description}
          </Text>
        )}

        {buttonText && (
          <Pressable
            onPress={onButtonPress}
            className="h-[30px] bg-white rounded px-4 items-center justify-center self-start mt-3 active:opacity-80"
          >
            <Text className="text-primaryBlue text-sm italic font-medium">
              {buttonText}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
