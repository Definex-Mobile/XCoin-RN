import React from "react";
import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface ProfileButtonProps {
  title: string;
  icon: {
    viewBox: string;
    path: string;
  };
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
        <Svg width={24} height={24} viewBox={icon.viewBox} fill="none">
          <Path d={icon.path} fill={colors.primaryBlue.DEFAULT} />
        </Svg>
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
