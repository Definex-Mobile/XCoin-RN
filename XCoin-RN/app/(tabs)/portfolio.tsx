import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { MultipleSegmentButton } from '../../src/components/multipSegmentButton/multipleSegmentButton';
import PortfolioCard from '../../src/components/portfolioCard/portfolioCard';
import type { PortfolioApiResponse, PortfolioCoin } from '../../src/types/portfolio/portfolio';
import { getPortfolioSummary, getPortfolioList } from '../../src/api/services/portfolioService';
import { useTranslation } from "../../src/hooks/useTranslation";
import { CryptoCoinList } from '../../src/components/cryptoCoinList/cryptoCoinList';
import { constants } from "../../src/constants/constants";

export default function Portfolio() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [portfolioData, setPortfolioData] = useState<PortfolioApiResponse | null>(null);
  const [portfolioListData, setPortfolioListData] = useState<PortfolioCoin[]>([]);

  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setSummaryError(null);
      setListError(null);

      const [summaryRes, listRes] = await Promise.allSettled([
        getPortfolioSummary(),
        getPortfolioList(),
      ]);

      const popupMessages: string[] = [];
      if (summaryRes.status === constants.axiosStatus.fullFilled) {
        setPortfolioData(summaryRes.value);
      } else {
        const msg =
          summaryRes.reason?.message ?? "Summary fetch failed";
        setSummaryError(msg);
        console.error("Summary fetch error:", summaryRes.reason);
        popupMessages.push(`Özet: ${msg}`);
      }

      if (listRes.status === constants.axiosStatus.fullFilled) {
        setPortfolioListData(listRes.value.portfolioList);
      } else {
        const msg =
          listRes.reason?.message ?? "List fetch failed";
        setListError(msg);
        console.error("List fetch error:", listRes.reason);
        popupMessages.push(`Liste: ${msg}`);
      }

      if (popupMessages.length > 0) {
        Alert.alert(
          useTranslation("common.errorText"),
          popupMessages.join("\n"),
          [{ text: useTranslation("common.ok") }],
          { cancelable: true }
        );
      }

      setLoading(false);
    };

    fetchPortfolio();
  }, []);

  return (
    <View className="flex-1 mt-3 bg-mainLightBackground">
      <View>
        {loading && !portfolioData && (
          <View className="mx-4 pt-3 h-48 rounded-xl" />
        )}

        {!loading && !summaryError && portfolioData && (
          <PortfolioCard className="pt-3 mx-4" data={portfolioData} />
        )}

        <MultipleSegmentButton
          className="mt-3 mx-4"
          buttons={[
            useTranslation('portfolio.depositINR'),
            useTranslation('portfolio.withDrawINR'),
          ]}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={setSelectedIndex}
        />

        <Text className="mt-8 mx-5 bold20 text-coin-name">
          {useTranslation('portfolio.yourCoins')}
        </Text>
      </View>

      <ScrollView className="flex-1 mt-3" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-10">

          {!listError && <CryptoCoinList data={portfolioListData} />}
        </View>
      </ScrollView>
    </View>
  );
}
