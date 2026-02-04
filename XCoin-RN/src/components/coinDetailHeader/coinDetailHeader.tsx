import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTranslation as useI18nTranslation } from "../../constants/i18n";

interface CoinDetailHeaderProps {
  name: string;
  symbol: string;
  imageUrl: string;
  isFavorite: boolean;
  onBack: () => void;
  onFavoriteToggle: () => void;
  onExchange: () => void;
}

export function CoinDetailHeader({
  name,
  symbol,
  imageUrl,
  isFavorite,
  onBack,
  onFavoriteToggle,
  onExchange,
}: CoinDetailHeaderProps) {
  const { t } = useI18nTranslation();

  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={onBack}
            className="mr-3 items-center justify-center"
            style={{ width: 32, height: 32 }}
          >
            <Text className="text-2xl text-coin-name">‹</Text>
          </TouchableOpacity>

          <View className="rounded-full overflow-hidden mr-2" style={{ width: 40, height: 40 }}>
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="flex-row items-baseline">
            <Text className="thin16 text-coin-name mr-1" numberOfLines={1}>
              {name}
            </Text>
            <Text className="thin10 text-coin-symbol mr-2">
              ({symbol})
            </Text>
          </View>

          <TouchableOpacity
            onPress={onFavoriteToggle}
            activeOpacity={1}
            className="ml-1"
          >
            <Text className={`text-xl ${isFavorite ? "text-yellow-400" : "text-black"}`}>
              {isFavorite ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onExchange}
          className="bg-coin-timeSelectorSelectedBg px-4 py-2 rounded-full flex-row items-center"
          style={{
            shadowColor: '#0066FF',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className="w-6 h-6 bg-primaryBlue rounded-full mr-2 items-center justify-center">
            <Text className="text-white bold16">⇄</Text>
          </View>
          <Text className="text-primaryBlue thinItalic10">
            {t('coinDetail.exchange')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}