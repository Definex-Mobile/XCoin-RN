import React from 'react';
import { View } from 'react-native';
import { Button } from './segmentButton';
import { colors } from "../../constants/colors";

export interface MultiButtonProps {
  buttons: string[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onPress?: (index: number) => void;
  className?: string;
}

export const MultipleSegmentButton: React.FC<MultiButtonProps> = ({
  buttons = [],
  selectedIndex,
  onSelectedIndexChange,
  onPress,
}) => {
  if (!buttons || buttons.length === 0) return null;

  const handleButtonPress = (index: number) => {
    if (index !== selectedIndex) onSelectedIndexChange(index);
    onPress?.(index);
  };

  return (
    <View className={`flex-row gap-4 mx-4 mt-3`}>
      {buttons.map((button, index) => {
        const isSelected = index === selectedIndex;

        const containerClassName = isSelected
          ? 'bg-primaryBlue'
          : 'bg-mainLightBackground border border-primaryBlue';

        const textClassName = isSelected
          ? 'text-mainLightBackground'
          : 'text-primaryBlue';

        return (
          <View key={index} className="flex-1">
            <Button
              title={button}
              onPress={() => handleButtonPress(index)}
              disabled={false}
              containerClassName={containerClassName}
              textClassName={textClassName}
            />
          </View>
        );
      })}
    </View>
  );
};
