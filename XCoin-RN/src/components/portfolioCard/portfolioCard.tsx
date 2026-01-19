import React from "react";
import { View, Text } from "react-native";
import type { PortfolioApiResponse } from "../../types/portfolio/portfolio";
import { mapPortfolioToCardVM } from "../../utils/portfolioMapper";
import { PortfolioInfoItem } from "../portfolioCard/portfolioInfoItem";

type Props = {
  data: PortfolioApiResponse;
  className?: string;
};

export default function PortfolioCard({ data, className = '' }: Props) {
  const vm = mapPortfolioToCardVM(data);

  return (
    <View className={`rounded-xl bg-[#0063F5] px-5 pt-6 pb-[26px] ${className}`}>
      <Text className="pb-4 text-white bold20">Portfolio</Text>

      <Text className="pb-[2px] text-white lightItalic10">Holding value</Text>

      <View className="flex-row items-baseline pb-6">
        <Text className="text-white bold28">{vm.holdingText}</Text>
        <Text className="ml-[7px] text-white opacity-[0.68] medium14">
          {vm.changeText}
        </Text>
      </View>

      <View className="flex-row items-center">
        <PortfolioInfoItem label="Invested value" value={vm.investedText} />

        <View className="w-[1px] h-10 bg-white opacity-50 mx-4" />

        <PortfolioInfoItem label="Available INR" value={vm.availableText} />
      </View>
    </View>
  );
}
