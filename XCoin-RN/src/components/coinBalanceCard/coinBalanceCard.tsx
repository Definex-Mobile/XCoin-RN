import React from "react";
import { View, Text, Image } from "react-native";
import { getCurrencySymbol } from "../../utils/money";

interface CoinBalanceCardProps {
  name: string;
  symbol: string;
  imageUrl: string;
  balance: number;
  balanceFiat: number;
  percentage: number;
  currency: string;
}

export function CoinBalanceCard({
  name,
  symbol,
  imageUrl,
  balance,
  balanceFiat,
  percentage,
  currency,
}: CoinBalanceCardProps) {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <View
      className="mx-4 my-4 bg-surface rounded-xl p-4 flex-row items-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="w-12 h-12 rounded-full overflow-hidden bg-white mr-4">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1">
        <Text className="thinItalic16 text-onSurface">{name}</Text>
        <Text className="thinItalic12 text-onSurfaceVariant mt-0.5">
          {balance.toFixed(2)} {symbol}
        </Text>
      </View>

      <View className="items-end">
        <Text className="thinItalic16 text-onSurface">
          {currencySymbol}{balanceFiat.toFixed(2)}
        </Text>
        <Text className="medium10 text-onSurfaceVariant mt-0.5">
          {percentage.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}
