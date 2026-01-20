import React from "react";
import { View, ScrollView } from "react-native";
import BannerCard, {
    BannerType,
} from "../../src/components/bannerCard/bannerCard";
import { useTranslation } from "../../src/hooks/useTranslation";
import { CryptoCoinList } from '../../src/components/cryptoCoinList/cryptoCoinList';
import type { CryptoCoin } from '../../src/types/cryptoCoin';

const HOME_MOCK_DATA: CryptoCoin[] = [
    {
        longName: "Bitcoin",
        shortName: "BTC",
        currentPrice: 32312.12,
        changeRatio: 1.86,
        currency: "usd",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png",
    },
    {
        longName: "Ethereum",
        shortName: "ETH",
        currentPrice: 1234.5,
        changeRatio: -2.12,
        currency: "usd",
        imageUrl: "https://www.kindpng.com/picc/m/128-1287761_persystance-networks-ethereum-logo-ethereum-sign-transparent-background.png",
    },
    {
        longName: "Cardano",
        shortName: "ADA",
        currentPrice: 1234.5,
        changeRatio: 11.98,
        currency: "usd",
        imageUrl: "https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png",
    },
];

export default function Home() {
    function handleBannerPress(): void {
        console.log("Button Pressed");
    }

    return (
        <ScrollView className="flex-1 bg-background-gray">
            <View className="pt-4">
                <BannerCard
                    title={useTranslation("bannerCard.title") + " <Username>,"}
                    description={useTranslation("bannerCard.description")}
                    buttonText={useTranslation("bannerCard.buttonText")}
                    onButtonPress={handleBannerPress}
                    image={require("../../assets/images/img-welcome-card.png")}
                    bannerType={BannerType.HOME}
                />
            </View>
            <View className="px-4">
                <CryptoCoinList data={HOME_MOCK_DATA} />
            </View>
        </ScrollView>
    );
}
