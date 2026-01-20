import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { TabBar, Tab } from "../../src/components/tabBar/tabBar";
import { CryptoCoinList } from "../../src/components/cryptoCoinList/cryptoCoinList";
import type { CryptoCoin } from "../../src/types/cryptoCoin";

const TABS: Tab[] = [
  { id: "all", labelKey: "tabs.all" },
  { id: "gainer", labelKey: "tabs.gainer" },
  { id: "loser", labelKey: "tabs.loser" },
  { id: "favourites", labelKey: "tabs.favourites" },
];

const MOCK_DATA: Record<string, CryptoCoin[]> = {
  all: [
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
      longName: "Cardano",
      shortName: "ADA",
      currentPrice: 1234.5,
      changeRatio: 11.98,
      currency: "usd",
      imageUrl:
        "https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png",
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
      longName: "Caizcoin",
      shortName: "CAIZ",
      currentPrice: 0.0000012,
      changeRatio: -12.66,
      currency: "usd",
      imageUrl:
        "https://blockchainjobseurope.com/wp-content/uploads/job-manager-uploads/company_logo/2021/10/caiz.png",
    },
  ],
  favourites: [
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
  ],
  gainer: [
    {
      longName: "Cardano",
      shortName: "ADA",
      currentPrice: 1234.5,
      changeRatio: 11.98,
      currency: "usd",
      imageUrl:
        "https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png",
    },
  ],
  loser: [
    {
      longName: "Caizcoin",
      shortName: "CAIZ",
      currentPrice: 0.0000012,
      changeRatio: -12.66,
      currency: "usd",
      imageUrl:
        "https://blockchainjobseurope.com/wp-content/uploads/job-manager-uploads/company_logo/2021/10/caiz.png",
    },
  ],
};

export default function Market() {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <ScrollView className="flex-1 bg-background-gray">
      <View className="px-4 pt-4">
        <TabBar
          tabs={TABS}
          selectedTabId={selectedTab}
          onTabChange={setSelectedTab}
        />
      </View>
      <View className="px-4 mt-4">
        <CryptoCoinList data={MOCK_DATA[selectedTab]} />
      </View>
    </ScrollView>
  );
}
