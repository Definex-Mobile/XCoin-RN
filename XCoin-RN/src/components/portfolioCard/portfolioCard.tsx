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
  const { t } = useTranslation();
  const vm = mapPortfolioToCardVM(data);

  return (
    <View className={`rounded-xl bg-primary pb-[26px] ${className}`}>
      <Text className="pt-[24px] pl-[20px] text-onPrimary bold20">{t("portfolio.portfolio")}</Text>

      <Text className="pb-[2px] pt-[16px] pl-[20px] text-onPrimary lightItalic10">{t("portfolio.holdingValue")}</Text>

      <View className="flex-row pl-[20px] items-baseline pb-6">
        <Text className="text-onPrimary bold28">{vm.holdingText}</Text>
        <Text className="ml-[7px] text-onPrimary opacity-[0.68] medium14">
          {vm.changeText}
        </Text>
      </View>

      <View className="flex-row items-center pl-[20px]">
        <PortfolioInfoItem label={t("portfolio.investedValue")} value={vm.investedText} />

        <View className="w-[1px] h-10 bg-onPrimary opacity-50 mx-4" />

        <PortfolioInfoItem label={t("portfolio.availableINR")} value={vm.availableText} />
      </View>
    </View>
  );
}
