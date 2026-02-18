import React from "react";
import { View, Text, Pressable } from "react-native";
import { colors } from "../../constants/colors";

interface BottomSheetItemProps {
  title: string;
  value: string;
  isSelected: boolean;
  onPress: () => void;
  isLast?: boolean;
}

export default function BottomSheetItem({
  title,
  value,
  isSelected,
  onPress,
  isLast = false,
}: BottomSheetItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ borderBottomColor: colors.outlineVariant }}
      className={`flex-row items-center justify-between py-[17px] ${
        !isLast ? "border-b" : ""
      }`}
    >
      <Text className="regular16 text-text">{title}</Text>

      <View
        style={{
          borderColor: isSelected
            ? colors.primary
            : colors.outline,
        }}
        className="items-center justify-center w-6 h-6 rounded-full border-2"
      >
        {isSelected && (
          <View
            style={{ backgroundColor: colors.primary }}
            className="w-[14px] h-[14px] rounded-full"
          />
        )}
      </View>
    </Pressable>
  );
}
