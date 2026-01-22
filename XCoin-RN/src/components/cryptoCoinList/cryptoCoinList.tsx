import React from "react";
import { View } from "react-native";
import type { CryptoCoin } from "../../types/cryptoCoin";
import { CryptoCoinListItem } from "./cryptoCoinListItem";

type Props = {
    data?: CryptoCoin[] | null;
};

export function CryptoCoinList({ data }: Props) {
    if (!data?.length) return null;

    return (
        <View>
            {data.map((coin) => (
                <CryptoCoinListItem key={coin.shortName} coin={coin} />
            ))}
        </View>
    );
}
