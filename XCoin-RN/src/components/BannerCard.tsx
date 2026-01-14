import React from "react";
import { View, Text, Pressable, Image, DimensionValue } from "react-native";

interface BannerCardProps {
  greeting?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  image?: any;
  imageRotation?: number;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  minHeight?: number;
}

export default function BannerCard({
  title,
  description,
  buttonText,
  onButtonPress,
  image,
  imageRotation = 0,
  backgroundColor = "#4169E1",
  width,
  height,
  minHeight = 280,
}: BannerCardProps) {
  return (
    <View style={{ ...(width && { width }) }} className="mx-4 mt-6 mb-0">
      <View
        style={{
          backgroundColor,
          ...(height ? { height } : { minHeight }),
        }}
        className="px-6 pt-6 pb-0 relative rounded-2xl overflow-hidden shadow-lg"
      >
        {image && (
          <Image
            source={image}
            style={{
              width: 140,
              height: 140,
              position: "absolute",
              bottom: -10,
              right: 0,
              zIndex: 0,
            }}
            className="opacity-70"
            resizeMode="contain"
          />
        )}

        <View style={{ position: "relative", zIndex: 10 }}>
          {title && (
            <Text className="text-white/90 text-s italic mb-2">{title}</Text>
          )}

          {description && (
            <Text className="text-white text-xl font-semibold leading-tight mb-3 max-w-[280px]">
              {description}
            </Text>
          )}

          {buttonText && (
            <Pressable
              onPress={onButtonPress}
              style={{
                height: 30,
              }}
              className="bg-white rounded px-4 items-center justify-center self-start mt-3 active:opacity-80"
            >
              <Text className="text-[#4169E1] text-sm italic font-medium">
                {buttonText}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
