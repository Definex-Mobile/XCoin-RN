import React, { useState, useMemo } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CoinDetailData, TimeRange, ChartDataPoint } from "../../src/types/coinDetail";
import { CoinDetailHeader } from "../../src/components/coinDetailHeader/coinDetailHeader";
import { PriceChart } from "../../src/components/priceChart/priceChart";
import { TimeRangeSelector } from "../../src/components/timeRangeSelector/timeRangeSelector";
import { CoinBalanceCard } from "../../src/components/coinBalanceCard/coinBalanceCard";
import { useTranslation as useI18nTranslation } from "../../src/constants/i18n";
import { getCurrencySymbol } from "../../src/utils/money";

const POINTS_COUNT = 28;

function generateRandomChartData(): ChartDataPoint[] {
  const now = Date.now() / 1000;
  const graphArray: ChartDataPoint[] = [];
  let currentPrice = 94500;
  const upwardDriftPerStep = 60;

  for (let i = 0; i < POINTS_COUNT; i++) {
    const randomWiggle = (Math.random() - 0.5) * 450;
    currentPrice = currentPrice + upwardDriftPerStep + randomWiggle;
    currentPrice = Math.max(90000, Math.min(104000, currentPrice));
    graphArray.push({
      timestamp: now - (POINTS_COUNT - i) * 180,
      price: currentPrice,
    });
  }
  return graphArray;
}

function calculatePointArray(graphArray: ChartDataPoint[]): number[] {
  if (graphArray.length === 0) return [];
  const prices = graphArray.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pointCount = 5;
  const step = (max - min) / (pointCount - 1);
  return Array.from({ length: pointCount }, (_, i) => min + step * i);
}

const DEFAULT_COIN_DETAIL: CoinDetailData = {
  symbol: "BTC",
  name: "Bitcoin",
  currentPrice: 98509.75,
  priceChange: 1700.254,
  priceChangePercentage: 9.77,
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png",
  chartData: [],
  userBalance: 0.00,
  userBalanceFiat: 0.00,
  currency: "inr",
};

function parseCoinDetailFromParams(params: Record<string, string | string[] | undefined>): CoinDetailData {
  const symbol = (params.symbol as string) ?? DEFAULT_COIN_DETAIL.symbol;
  const name = (params.name as string) ?? DEFAULT_COIN_DETAIL.name;
  const currentPrice = Number(params.currentPrice) || DEFAULT_COIN_DETAIL.currentPrice;
  const priceChangePercentage = Number(params.priceChangePercentage) ?? DEFAULT_COIN_DETAIL.priceChangePercentage;
  const priceChange = currentPrice * (priceChangePercentage / 100);
  const imageUrl = (params.imageUrl as string) ?? DEFAULT_COIN_DETAIL.imageUrl;
  const currency = (params.currency as string) ?? DEFAULT_COIN_DETAIL.currency;

  return {
    ...DEFAULT_COIN_DETAIL,
    symbol,
    name,
    currentPrice,
    priceChange,
    priceChangePercentage,
    imageUrl,
    currency,
  };
}

export default function CoinDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  const { t } = useI18nTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1H");
  const [isFavorite, setIsFavorite] = useState(false);

  const coinData = useMemo(() => parseCoinDetailFromParams(params), [params.symbol, params.name, params.currentPrice, params.priceChangePercentage, params.imageUrl, params.currency]);

  const graphArray = useMemo(
    () => generateRandomChartData(),
    [selectedTimeRange]
  );
  const pointArray = useMemo(() => calculatePointArray(graphArray), [graphArray]);

  const handleBack = () => {
    router.back();
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleExchange = () => {
    console.log("Exchange pressed");
  };

  const handleBuy = () => {
    console.log("Buy pressed");
  };

  const handleSell = () => {
    console.log("Sell pressed");
  };

  const handleTransactions = () => {
    console.log("Transactions pressed");
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <CoinDetailHeader
          name={coinData.name}
          symbol={coinData.symbol}
          imageUrl={coinData.imageUrl}
          isFavorite={isFavorite}
          onBack={handleBack}
          onFavoriteToggle={handleFavoriteToggle}
          onExchange={handleExchange}
        />

        <View className="px-4 flex-row p-3 items-end content-between">
          <Text className="medium24 text-onSurface">
            {getCurrencySymbol(coinData.currency)}{coinData.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text className={`text-sm mt-1 pl-3 ${coinData.priceChangePercentage >= 0 ? 'text-secondary' : 'text-error'}`}>
            {coinData.priceChangePercentage >= 0 ? '+' : ''}{coinData.priceChange.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ({coinData.priceChangePercentage >= 0 ? '+' : ''}{coinData.priceChangePercentage.toFixed(2)}%)
          </Text>
        </View>

        <PriceChart
          graphArray={graphArray}
          pointArray={pointArray}
          currency={coinData.currency}
          timeRange={selectedTimeRange}
        />

        <TimeRangeSelector
          selectedRange={selectedTimeRange}
          onRangeChange={setSelectedTimeRange}
        />

        <CoinBalanceCard
          name={coinData.name}
          symbol={coinData.symbol}
          imageUrl={coinData.imageUrl}
          balance={coinData.userBalance}
          balanceFiat={coinData.userBalanceFiat}
          percentage={coinData.userBalance > 0 ? (coinData.userBalanceFiat / coinData.currentPrice) * 100 : 0}
          currency={coinData.currency}
        />

        <TouchableOpacity
          onPress={handleTransactions}
          className="mx-4 my-2 bg-white rounded-xl p-4 flex-row items-center justify-between border border-gray-200"
        >
          <Text className="regular16 text-onSurfaceVariant">{t('coinDetail.transactions')}</Text>
          <Text className="text-xl text-onSurfaceVariant">›</Text>
        </TouchableOpacity>

        {/* Padding for bottom buttons */}
        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 flex-row border-t border-gray-100"
        style={{
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={handleBuy}
          className="flex-1 bg-blue-500 py-4 rounded-xl mr-2"
        >
          <Text className="text-white text-center font-bold text-lg">{t('coinDetail.buy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSell}
          className="flex-1 bg-blue-500 py-4 rounded-xl ml-2"
        >
          <Text className="text-white text-center font-bold text-lg">{t('coinDetail.sell')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
