import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import type { CryptoCoin } from "../../types/cryptoCoin";
import {
  getCurrencySymbol,
  formatPercentage,
  formatMoney,
} from "../../utils/money";

type Props = {
  coin: CryptoCoin;
};

export function CryptoCoinListItem({ coin }: Props) {
  const router = useRouter();
  const isPositive = coin.changeRatio >= 0;
  const valueColor = isPositive
    ? "text-secondary"
    : "text-error";
  const currencySymbol = getCurrencySymbol(coin.currency);

  const handlePress = () => {
    router.push({
      pathname: "/screens/coin-detail",
      params: {
        symbol: coin.shortName,
        name: coin.longName,
        currentPrice: coin.currentPrice.toString(),
        priceChangePercentage: coin.changeRatio.toString(),
        imageUrl: coin.imageUrl,
        currency: coin.currency,
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="bg-surface rounded-xl ps-4 pe-1.5 pt-4 pb-4 mb-2 flex-row items-center shadow-sm"
    >
      <View className="w-10 h-10 rounded-full overflow-hidden bg-white mr-3">
        <Image
          source={{ uri: coin.imageUrl }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1">
        <Text className="thinItalic16 text-onSurface">{coin.longName}</Text>
        <Text className="thinItalic12 text-onSurfaceVariant mt-1">
          {coin.shortName}
        </Text>
      </View>

      <View className="items-end">
        <Text className="thinItalic16 text-onSurface me-[24px]">
          {formatMoney(coin.currentPrice, currencySymbol)}
        </Text>
        <Text
          className={`medium10 ${valueColor} mt-[5px] me-[16px] leading-[10px]`}
        >
          {formatPercentage(coin.changeRatio)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
