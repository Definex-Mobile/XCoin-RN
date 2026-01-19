import React from "react";
import { View, Text, Image } from "react-native";
import type { CryptoCoin } from "../../types/cryptoCoin";
import { getCurrencySymbol, formatPercentage, formatMoney } from "../../utils/money";

type Props = {
    coin: CryptoCoin;
};

export function CryptoCoinListItem({ coin }: Props) {
    const isPositive = coin.changeRatio >= 0;
    const changeColor = isPositive ? "text-crypto-positive" : "text-crypto-negative";
    const currencySymbol = getCurrencySymbol(coin.currency);

    return (
        <View className="bg-crypto-cardBg rounded-xl ps-4 pe-1.5 pt-4 pb-4 mb-2 flex-row items-center" style={{ elevation: 2 }}>
            <View className="w-12 h-12 rounded-full overflow-hidden bg-white mr-3">
                <Image
                    source={{ uri: coin.imageUrl }}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-1">
                <Text className="semibold16 text-crypto-title">{coin.longName}</Text>
                <Text className="regular12 text-crypto-subtitle">{coin.shortName}</Text>
            </View>

            <View className="items-end">
                <Text className="semibold16 text-crypto-title me-2">
                    {formatMoney(coin.currentPrice, currencySymbol)}
                </Text>
                <Text className={`semibold12 ${changeColor}`}>
                    {formatPercentage(coin.changeRatio)}
                </Text>
            </View>
        </View>
    );
}
