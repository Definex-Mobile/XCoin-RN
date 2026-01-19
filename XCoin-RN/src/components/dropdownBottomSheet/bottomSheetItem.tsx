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
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#E5E7EB",
      }}
      className="flex-row items-center justify-between py-[17px]"
    >
      <Text className="regular16 text-text">{title}</Text>

      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isSelected ? colors.primaryBlue.DEFAULT : "#D1D5DB",
        }}
        className="items-center justify-center"
      >
        {isSelected && (
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 6,
              backgroundColor: colors.primaryBlue.DEFAULT,
            }}
          />
        )}
      </View>
    </Pressable>
  );
}
