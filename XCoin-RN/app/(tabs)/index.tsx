import React, { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import BannerCard, {
  BannerType,
} from "../../src/components/bannerCard/bannerCard";
import { useTranslation as useI18nTranslation } from "../../src/constants/i18n";
import { CryptoCoinList } from "../../src/components/cryptoCoinList/cryptoCoinList";
import type { CryptoCoin } from "../../src/types/cryptoCoin";
import { getTrendingCoins } from "../../src/api/services/trendingService";
import { logButtonClick } from "../../src/services/analyticsService";
import { SCREENS, PARAMS } from "../../src/constants/analyticsEvents";
import { getAnnouncements } from "../../src/services/announcementService";
import { Announcement } from "../../src/types/announcement";
import { useLanguage } from "../../src/hooks/useLanguage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DISMISSED_ANNOUNCEMENTS_KEY = "dismissed_announcements";

export default function Home() {
  const { t } = useI18nTranslation();
  const { currentLanguage: language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [trendingCoins, setTrendingCoins] = useState<CryptoCoin[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [trendingResponse, announcementsResponse] = await Promise.all([
          getTrendingCoins(),
          getAnnouncements(),
        ]);

        setTrendingCoins(trendingResponse.trendingList);

        // Filter out dismissed announcements
        const dismissedIdsJson = await AsyncStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
        const dismissedIds: string[] = dismissedIdsJson ? JSON.parse(dismissedIdsJson) : [];

        const activeAnnouncements = announcementsResponse.filter(
          (a) => !dismissedIds.includes(a.id)
        );
        setAnnouncements(activeAnnouncements);
      } catch (err) {
        setError(t("common.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnnouncementDismiss = async (id: string) => {
    try {
      const dismissedIdsJson = await AsyncStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
      const dismissedIds: string[] = dismissedIdsJson ? JSON.parse(dismissedIdsJson) : [];

      if (!dismissedIds.includes(id)) {
        dismissedIds.push(id);
        await AsyncStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(dismissedIds));
      }

      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to dismiss advertisement:", error);
    }
  };

  function handleBannerPress(): void {
    logButtonClick(SCREENS.HOME, PARAMS.WELCOME_BANNER_CTA)
    console.log("Button Pressed")
  }

  return (
    <ScrollView className="flex-1 bg-background-gray">
      {announcements.map((announcement) => (
        <View key={announcement.id} className="pt-4">
          <BannerCard
            title={announcement.title[language] || announcement.title["en"]}
            description={announcement.content[language] || announcement.content["en"]}
            onClose={announcement.dismissible ? () => handleAnnouncementDismiss(announcement.id) : undefined}
            bannerType={BannerType.REFER} // Using REFER type for announcement style (amber)
          />
        </View>
      ))}

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

        {error && <Text className="regular14 text-accent">{error}</Text>}

        {!loading && !error && <CryptoCoinList data={trendingCoins} />}
      </View>
    </ScrollView>
  );
}
