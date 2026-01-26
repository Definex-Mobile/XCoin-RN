import React, { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import BannerCard, {
    BannerType,
} from "../../src/components/bannerCard/bannerCard";
import { useTranslation as useI18nTranslation } from "../../src/constants/i18n";
import { CryptoCoinList } from '../../src/components/cryptoCoinList/cryptoCoinList';
import type { CryptoCoin } from '../../src/types/cryptoCoin';
import { getTrendingCoins } from '../../src/api/services/trendingService';

export default function Home() {
    const { t } = useI18nTranslation();

    const [loading, setLoading] = useState(true);
    const [trendingCoins, setTrendingCoins] = useState<CryptoCoin[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendingCoins = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getTrendingCoins();
                setTrendingCoins(response.trendingList);
            } catch (err) {
                setError(t('common.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingCoins();
    }, []);

    function handleBannerPress(): void {
        console.log("Button Pressed");
    }

    return (
        <ScrollView className="flex-1 bg-background-gray">
            <View className="pt-4">
                <BannerCard
                    title={t("bannerCard.title") + " Agilan,"}
                    description={t("bannerCard.description")}
                    buttonText={t("bannerCard.buttonText")}
                    onButtonPress={handleBannerPress}
                    image={require("../../assets/images/img-welcome-card.png")}
                    bannerType={BannerType.HOME}
                />
            </View>

            <View className="px-4 mt-6">
                <Text className="bold20 text-coin-name mb-3">
                    {t("home.trendingCoins")}
                </Text>

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

                {!loading && !error && <CryptoCoinList data={trendingCoins} />}
            </View>
        </ScrollView>
    );
}
