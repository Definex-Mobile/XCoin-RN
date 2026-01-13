import React from "react";
import { View, Text } from "react-native";
import type { PortfolioApiResponse } from "../../types/portfolio";
import { mapPortfolioToCardVM } from "../../utils/portfolioMapper";
import { PortfolioInfoItem } from "../portfolioCard/portfolioInfoItem";

type Props = {
  data: PortfolioApiResponse;
};

export default function PortfolioCard({ data }: Props) {
  const vm = mapPortfolioToCardVM(data);

  return (
    <View className="mx-4 rounded-xl bg-[#0063F5] px-5 pt-6 pb-[26px]">
      <Text className="mb-4 text-white font-bold text-xl">
        Portfolio
      </Text>

      <Text className="mb-[2px] text-white text-[10px] font-thin">
        Holding value
      </Text>

      <View className="flex-row items-baseline mb-6">
        <Text className="text-white font-bold text-[28px]">
          {vm.holdingText}
        </Text>
        <Text className="ml-[7px] text-white font-medium opacity-[0.68] text-[14px]">
          {vm.changeText}
        </Text>
      </View>

      <View className="flex-row items-center">
        <PortfolioInfoItem 
          label="Invested value" 
          value={vm.investedText} 
        />
        
        <View className="w-[1px] h-10 bg-white opacity-50 mx-4" />
        
        <PortfolioInfoItem 
          label="Available INR" 
          value={vm.availableText} 
        />
      </View>
    </View>
  );
}