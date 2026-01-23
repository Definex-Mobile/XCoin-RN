import React from "react";
import { View, Text } from "react-native";
import type { PortfolioApiResponse } from "../../types/portfolio/portfolio";
import { mapPortfolioToCardVM } from "../../utils/portfolioMapper";
import { PortfolioInfoItem } from "../portfolioCard/portfolioInfoItem";
import { useTranslation } from "../../../src/hooks/useTranslation";

type Props = {
  data: PortfolioApiResponse;
  className?: string;
};

export default function PortfolioCard({ data, className = '' }: Props) {
  const vm = mapPortfolioToCardVM(data);

  return (
    <View className={`rounded-xl bg-primaryBlue px-5 pt-6 pb-[26px] ${className}`}>
      <Text className="pb-4 text-white bold20">{useTranslation("portfolio.portfolio")}</Text>

      <Text className="pb-[2px] text-white lightItalic10">{useTranslation("portfolio.holdingValue")}</Text>

      <View className="flex-row items-baseline pb-6">
        <Text className="text-white bold28">{vm.holdingText}</Text>
        <Text className="ml-[7px] text-white opacity-[0.68] medium14">
          {vm.changeText}
        </Text>
      </View>

      <View className="flex-row items-center">
        <PortfolioInfoItem label={useTranslation("portfolio.investedValue")} value={vm.investedText} />

        <View className="w-[1px] h-10 bg-white opacity-50 mx-4" />

        <PortfolioInfoItem label={useTranslation("portfolio.availableINR")} value={vm.availableText} />
      </View>
    </View>
  );
}
