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
            <View className="w-10 h-10 rounded-full overflow-hidden bg-white mr-3">
                <Image
                    source={{ uri: coin.imageUrl }}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-1">
                <Text
                    className="thinItalic16 text-coin-name"
                >
                    {coin.longName}
                </Text>
                <Text
                    className="thinItalic12 text-coin-symbol mt-1"
                >
                    {coin.shortName}
                </Text>
            </View>

            <View className="items-end">
                <Text
                    className="thinItalic16 text-coin-price me-2"
                >
                    {formatMoney(coin.currentPrice, currencySymbol)}
                </Text>
                <Text
                    className={`medium10 ${changeColor} mt-1`}
                    style={{ lineHeight: 10 }}
                >
                    {formatPercentage(coin.changeRatio)}
                </Text>
            </View>
        </View>
    );
}
