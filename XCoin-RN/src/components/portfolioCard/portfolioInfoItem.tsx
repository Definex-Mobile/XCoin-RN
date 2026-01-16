import React from "react";
import { View, Text } from "react-native";
import { T } from "../../constants/typography";

type Props = {
  label: string;
  value: string;
};

export function PortfolioInfoItem({ label, value }: Props) {
  return (
    <View>
      <Text className="text-white mb-1" style={T.lightItalic12}>
        {label}
      </Text>
      <Text className="text-white" style={T.medium18}>
        {value}
      </Text>
    </View>
  );
}