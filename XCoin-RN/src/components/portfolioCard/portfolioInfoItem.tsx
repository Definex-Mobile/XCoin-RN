import React from "react";
import { View, Text } from "react-native";

type Props = {
  label: string;
  value: string;
};

export function PortfolioInfoItem({ label, value }: Props) {
  return (
    <View>
      <Text className="text-white font-thin italic text-[10px] mb-1">
        {label}
      </Text>
      <Text className="text-white text-[18px] font-medium">
        {value}
      </Text>
    </View>
  );
}