import React from "react";
import { View, Text } from "react-native";

type Props = {
  label: string;
  value: string;
};

export function PortfolioInfoItem({ label, value }: Props) {
  return (
    <View>
      <Text className="text-white mb-1 lightItalic10">
        {label}
      </Text>
      <Text className="text-white medium18">
        {value}
      </Text>
    </View>
  );
}