import React from "react";
import { View, Text, Pressable, Image, DimensionValue } from "react-native";
import { colors } from "../../constants/colors";

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
      className="mx-4 rounded-2xl overflow-hidden shadow-lg"
    >
      {image && (
        <Image
          source={image}
          className="w-[140px] h-[140px] absolute -bottom-2 right-0 z-0 opacity-70"
          resizeMode="contain"
        />
      )}

      <View className="relative z-10 mx-5 mt-6">
        {title && <Text className="text-white thinItalic12 ">{title}</Text>}

        {description && (
          <Text className="text-white semibold20 leading-tight mt-[9px] ">
            {description}
          </Text>
        )}

        {buttonText && (
          <Pressable
            onPress={onButtonPress}
            className="bg-white rounded mt-[22px] mb-[21px] px-3 py-2 items-center justify-center self-start"
          >
            <Text className="text-primaryBlue thinItalic12 font-medium">
              {buttonText}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
