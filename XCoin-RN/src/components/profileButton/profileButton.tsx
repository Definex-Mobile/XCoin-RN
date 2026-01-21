import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface ProfileButtonProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  isLast?: boolean;
}

export default function ProfileButton({
  title,
  icon,
  onPress,
  isLast = false,
}: ProfileButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ borderBottomColor: colors.border.light }}
      className={`flex-row items-center justify-between py-[26px] px-4 bg-white ${
        !isLast ? "border-b" : ""
      }`}
    >
      <View className="flex-row items-center gap-4">
        <Image source={icon} className="w-6 h-6" resizeMode="contain" />
        <Text className="thinItalic18 text-text">{title}</Text>
      </View>

      <Ionicons
        className="px-4"
        name="chevron-forward"
        size={20}
        color={colors.text.light}
      />
    </Pressable>
  );
}
