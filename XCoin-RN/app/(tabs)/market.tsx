import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, Tab } from "../../src/components/tabBar/tabBar";
import { CryptoCoinList } from "../../src/components/cryptoCoinList/cryptoCoinList";
import DropdownBottomSheet from "../../src/components/dropdownBottomSheet/dropdownBottomSheet";
import { useTranslation as useI18nTranslation } from "../../src/constants/i18n";
import { getMarketStatus, getMarketList, type MarketCategory } from "../../src/api/services/marketService";
import type { CryptoCoin, MarketStatusResponse } from "../../src/types/cryptoCoin";
import { colors } from "../../src/constants/colors";
import SearchIcon from "../../assets/icons/ic_search.svg";

const TABS: Tab[] = [
    { id: "all", labelKey: "tabs.all" },
    { id: "gainer", labelKey: "tabs.gainer" },
    { id: "loser", labelKey: "tabs.loser" },
    { id: "favourites", labelKey: "tabs.favourites" },
];

const TAB_TO_CATEGORY: Record<string, MarketCategory> = {
    'all': 'ALL',
    'gainer': 'GAINERS',
    'loser': 'LOSERS',
    'favourites': 'FAVORITES',
};

export default function Market() {
    const { t } = useI18nTranslation();

    const [selectedTab, setSelectedTab] = useState("all");
    const [marketStatus, setMarketStatus] = useState<MarketStatusResponse | null>(null);
    const [coins, setCoins] = useState<CryptoCoin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMarket, setSelectedMarket] = useState<string | null>(null);


    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await getMarketStatus();
                setMarketStatus(status);
            } catch (err) {
                console.error('Market status fetch error:', err);
            }
        };

        fetchStatus();
    }, []);

    useEffect(() => {
        const fetchMarketList = async () => {
            setLoading(true);
            setError(null);

            try {
                const category = TAB_TO_CATEGORY[selectedTab];
                const response = await getMarketList(category);
                setCoins(response.marketList);
            } catch (err) {
                setError(t('common.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchMarketList();
    }, [selectedTab]);

    const handleSearchPress = () => {
        console.log("Search pressed");
        // TODO: Implement search functionality
    };

    const isMarketUp = marketStatus?.marketStatus === 'UP';
    const statusColor = isMarketUp ? colors.market.up : colors.market.down;

    return (
        <SafeAreaView className="flex-1 bg-background-gray" edges={['top']}>
            <ScrollView className="flex-1">
                <View className="px-4 pt-4 flex-row justify-between items-start">
                    <View className="flex-1">
                        <View className="flex-row items-baseline">
                            <Text className="medium20 text-text">
                                {isMarketUp ? t('market.marketUp') : t('market.marketDown')}
                            </Text>
                            {marketStatus && (
                                <Text className="regular16 ms-1" style={{ color: statusColor }}>
                                    {' '}- {Math.abs(marketStatus.ratio).toFixed(2)}%
                                </Text>
                            )}
                        </View>
                        <Text className="lightItalic12 text-text-light mt-1">
                            {t('market.inThePast24Hours')}
                        </Text>
                    </View>

                    <Pressable onPress={handleSearchPress} className="p-2">
                        <SearchIcon width={21} height={23} />
                    </Pressable>
                </View>

                <View className="px-4 mt-6 flex-row justify-between items-center">
                    <Text className="bold20 text-coin-name">
                        {t('market.coins')}
                    </Text>
                    <DropdownBottomSheet
                        selectedValue={selectedMarket}
                        onValueChange={setSelectedMarket}
                    />
                </View>

                <View className="px-4 pt-4">
                    <TabBar
                        tabs={TABS}
                        selectedTabId={selectedTab}
                        onTabChange={setSelectedTab}
                    />
                </View>

                <View className="px-4 mt-4">
                    {loading && !error && (
                        <Text className="regular14 text-coin-symbol">
                            {t("common.loading")}
                        </Text>
                    )}

                    {error && (
                        <Text className="regular14 text-accent">
                            {error}
                        </Text>
                    )}

                    {!loading && !error && <CryptoCoinList data={coins} />}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
