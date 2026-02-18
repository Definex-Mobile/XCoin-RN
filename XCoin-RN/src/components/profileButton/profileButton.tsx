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

import { useTheme } from "../../context/ThemeContext";

export default function ProfileButton({
  title,
  icon,
  onPress,
  isLast = false,
}: ProfileButtonProps) {
  const { activeScheme } = useTheme();

  return (
    <View className="bg-surface">
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between py-[26px] px-4"
      >
        <View className="flex-row items-center gap-4">
          <Svg width={24} height={24} viewBox={icon.viewBox} fill="none">
            <Path d={icon.path} fill={activeScheme?.primary} />
          </Svg>
          <Text className="thinItalic18 text-onSurface">{title}</Text>
        </View>

        <Ionicons
          className="px-4"
          name="chevron-forward"
          size={20}
          color={activeScheme?.onSurfaceVariant}
        />
      </Pressable>
      {!isLast && (
        <View
          style={{ backgroundColor: activeScheme?.outlineVariant }}
          className="h-[1px] mx-4"
        />
      )}
    </View>
  );
}
