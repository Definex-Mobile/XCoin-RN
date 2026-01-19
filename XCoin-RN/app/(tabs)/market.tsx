import React, { useState } from "react";
import { View, Text } from "react-native";
import DropdownBottomSheet from "../../src/components/dropdownBottomSheet/dropdownBottomSheet";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

export default function Market() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-white">
      {/* Header with Dropdown on the right */}
      <View className="flex-row items-center justify-end pt-4 pb-2 px-4">
        <DropdownBottomSheet
          selectedValue={selectedMarket}
          onValueChange={setSelectedMarket}
          placeholder={t("dropdownBottomSheet.defaultMarket")}
        />
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="semibold24 text-text">Market Screen</Text>
        <Text className="regular16 text-text-light mt-2">
          Selected: {selectedMarket || "None"}
        </Text>
      </View>
    </View>
  );
}
