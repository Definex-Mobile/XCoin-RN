import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { CoinDetailData, TimeRange } from "../../src/types/coinDetail";
import { CoinDetailHeader } from "../../src/components/coinDetailHeader/coinDetailHeader";
import { PriceChart } from "../../src/components/priceChart/priceChart";
import { TimeRangeSelector } from "../../src/components/timeRangeSelector/timeRangeSelector";
import { CoinBalanceCard } from "../../src/components/coinBalanceCard/coinBalanceCard";
import { useTranslation as useI18nTranslation } from "../../src/constants/i18n";

const generateMockChartData = () => {
  const now = Date.now() / 1000;
  const points = 10;
  const graphArray = [];
  
  let currentPrice = 94500;
  
  for (let i = 0; i < points; i++) {
    const progress = i / points;
    
    if (progress < 0.1) {
      currentPrice = 94500 + Math.random() * 300;
    } else if (progress < 0.25) {
      currentPrice = currentPrice + 100 + Math.random() * 200;
    } else if (progress < 0.40) {
      currentPrice = currentPrice - 50 - Math.random() * 100;
    } else if (progress < 0.60) {
      currentPrice = currentPrice + 80 + Math.random() * 150;
    } else if (progress < 0.80) {
      currentPrice = currentPrice + 150 + Math.random() * 250;
    } else if (progress < 0.95) {
      currentPrice = currentPrice - 100 - Math.random() * 150;
    } else {
      currentPrice = currentPrice + 50 + Math.random() * 100;
    }
    
    graphArray.push({
      timestamp: now - ((points - i) * 180),
      price: currentPrice,
    });
  }
  
  return graphArray;
};

const calculatePointArray = (graphArray: any[]) => {
  const prices = graphArray.map(point => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  const pointCount = 5;
  const step = (max - min) / (pointCount - 1);
  
  const pointArray = [];
  for (let i = 0; i < pointCount; i++) {
    pointArray.push(min + (step * i));
  }
  
  return pointArray;
};

const mockGraphArray = generateMockChartData();
const mockPointArray = calculatePointArray(mockGraphArray);

const MOCK_COIN_DETAIL: CoinDetailData = {
  symbol: "BTC",
  name: "Bitcoin",
  currentPrice: 98509.75,
  priceChange: 1700.254,
  priceChangePercentage: 9.77,
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png",
  chartData: mockGraphArray,
  userBalance: 0.00,
  userBalanceFiat: 0.00,
  currency: "inr",
};

export default function CoinDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useI18nTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1H');
  const [isFavorite, setIsFavorite] = useState(false);

  const coinData = MOCK_COIN_DETAIL;

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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
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
          <Text className="medium24 text-coin-name">
            ₹{coinData.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text className={`text-sm mt-1 pl-3 ${coinData.priceChangePercentage >= 0 ? 'text-crypto-positive' : 'text-crypto-negative'}`}>
            + {coinData.priceChange.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ({coinData.priceChangePercentage.toFixed(2)}%)
          </Text>
        </View>

        <PriceChart
          graphArray={mockGraphArray}
          pointArray={mockPointArray}
          currency={coinData.currency}
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
          <Text className="regular16 text-coin-symbol">{t('coinDetail.transactions')}</Text>
          <Text className="text-xl text-coin-symbol">›</Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 flex-row" style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      }}>
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
    </SafeAreaView>
  );
}