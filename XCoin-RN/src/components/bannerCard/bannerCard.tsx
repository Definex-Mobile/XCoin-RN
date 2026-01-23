import React from "react";
import { View, Text, Pressable, Image, DimensionValue } from "react-native";
import { colors } from "../../constants/colors";

export enum BannerType {
  HOME = "Home",
  REFER = "Refer",
  LIKE = "Like",
}

export interface BannerCardProps {
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

const getImageFrame = (type?: BannerType): string => {
  switch (type) {
    case BannerType.HOME:
      return "w-[140px] h-[140px] absolute mb-4 right-0 z-0";
    case BannerType.REFER:
      return "w-[102px] h-[102px] mb-3";
    case BannerType.LIKE: 
      return "w-[102px] h-[102px] absolute mb-4 right-5";
    default:
      return "w-[102px] h-[102px] absolute mb-4 right-0";
  }
}

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
          className= "w-[140px] h-[140px] absolute -bottom-2 right-0 z-0 opacity-70"
          resizeMode="contain"
        />
      )}

      <View className="relative z-10 mx-5 mt-6">
        {title && <Text className="text-white thinItalic12 ">{title}</Text>}

        {description && (
          <Text 
          style={bannerType !== BannerType.HOME ? { width: 167 } : undefined} 
          className="text-white medium18 leading-tight mt-[9px]"
          numberOfLines={bannerType !== BannerType.HOME ? 2 : 1}
        >
          {description}
        </Text>
        )}

        {buttonText && (
          <Pressable
            onPress={onButtonPress}
            className="bg-white rounded mt-[22px] mb-[21px] px-3 py-2 items-center justify-center self-start"
          >
            <Text 
            style={{ color: backgroundColor }}
            className="thinItalic12 font-medium">
              {buttonText}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
