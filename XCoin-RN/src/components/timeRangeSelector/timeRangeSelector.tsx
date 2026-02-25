import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { TimeRange } from "../../types/coinDetail";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const TIME_RANGES: TimeRange[] = ['1H', '24H', '1W', '1M', '6M', '1Y', 'All'];

export function TimeRangeSelector({
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <View className="px-[22px] py-3">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row"
      >
        {TIME_RANGES.map((range, index) => {
          const isSelected = selectedRange === range;
          
          return (
            <TouchableOpacity
              key={range}
              onPress={() => onRangeChange(range)}
              className={`px-3 py-2 rounded-full border-[1px] ${index > 0 ? 'ml-2' : ''} ${
                isSelected ? 'bg-coin-timeSelectorBg border-primaryBlue' : 'bg-background border-coin-timeSelectedUnselectedBg'
              }`}
              style={isSelected ? {
                shadowColor: '#0066FF',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2,
              } : {}}
              activeOpacity={0.7}
            >
              <Text 
                className={`thinItalic12 ${
                  isSelected ? 'text-primary' : 'text-tab-inactiveText'
                }`}
              >
                {range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
