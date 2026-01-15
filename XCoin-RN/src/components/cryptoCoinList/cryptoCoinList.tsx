import React from "react";
import { View, Text } from "react-native";
import type { CryptoCoin } from "../../types/cryptoCoin";
import { CryptoCoinListItem } from "./cryptoCoinListItem";

// Mock data for testing
const MOCK_TRENDING_DATA: CryptoCoin[] = [
    {
        longName: "Bitcoin",
        shortName: "BTC",
        currentPrice: 32312.12,
        changeRatio: 1.86,
        currency: "usd",
        imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png",
    },
    {
        longName: "Ethereum",
        shortName: "ETH",
        currentPrice: 1234.5,
        changeRatio: -2.12,
        currency: "usd",
        imageUrl:
            "https://www.kindpng.com/picc/m/128-1287761_persystance-networks-ethereum-logo-ethereum-sign-transparent-background.png",
    },
    {
        longName: "Band Protocol",
        shortName: "BAND",
        currentPrice: 50.21,
        changeRatio: -10.86,
        currency: "usd",
        imageUrl:
            "https://seeklogo.com/images/B/band-protocol-band-logo-76B57A8CE4-seeklogo.com.png",
    },
    {
        longName: "Cardano",
        shortName: "ADA",
        currentPrice: 1234.5,
        changeRatio: 11.98,
        currency: "usd",
        imageUrl: "https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png",
    },
    {
        longName: "Tron",
        shortName: "TRX",
        currentPrice: 0.00021,
        changeRatio: 1234.5,
        currency: "usd",
        imageUrl:
            "https://cdn3d.iconscout.com/3d/premium/thumb/tron-coin-7105847-5752946.png",
    },
    {
        longName: "Raven",
        shortName: "RVN",
        currentPrice: 5.12,
        changeRatio: 0.05,
        currency: "usd",
        imageUrl: "https://www.iconbolt.com/preview/facebook/cryptocurrency/rvn.svg",
    },
    {
        longName: "Atom",
        shortName: "COSMOS",
        currentPrice: 1234.5,
        changeRatio: 1.86,
        currency: "usd",
        imageUrl:
            "https://cdn3d.iconscout.com/3d/premium/thumb/cosmos-5655809-4713522.png",
    },
    {
        longName: "Caizcoin",
        shortName: "CAIZ",
        currentPrice: 0.0000012,
        changeRatio: -12.66,
        currency: "usd",
        imageUrl:
            "https://blockchainjobseurope.com/wp-content/uploads/job-manager-uploads/company_logo/2021/10/caiz.png",
    },
];

type Props = {
    data?: CryptoCoin[];
};

export function CryptoCoinList({ data = MOCK_TRENDING_DATA }: Props) {
    return (
        <View>
            {data.map((coin) => (
                <CryptoCoinListItem key={coin.shortName} coin={coin} />
            ))}
        </View>
    );
}
