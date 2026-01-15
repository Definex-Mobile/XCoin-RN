import React from 'react';
import { View, ColorValue } from 'react-native';
import { Button } from './segmentButton';

export interface MultiButtonProps {
  buttons: string[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onPress?: (index: number) => void;
  mainColor?: ColorValue;
  secondaryColor?: ColorValue;
  className?: string;
}

export const MultipleSegmentButton: React.FC<MultiButtonProps> = ({
  buttons = [],
  selectedIndex,
  onSelectedIndexChange,
  onPress,
  mainColor = '#0D6EFD',
  secondaryColor = '#FFFFFF',
  className = '',
}) => {
  if (!buttons || buttons.length === 0) return null;

  const handleButtonPress = (index: number) => {
    if (index !== selectedIndex) onSelectedIndexChange(index);
    onPress?.(index);
  };

  return (
    <View className={`flex-row gap-4 ${className}`}>
      {buttons.map((button, index) => {
        const isSelected = index === selectedIndex;

        const containerStyle = isSelected
          ? { backgroundColor: mainColor }
          : { backgroundColor: secondaryColor, borderWidth: 1, borderColor: mainColor };

        const textStyle = isSelected
          ? { color: secondaryColor }
          : { color: mainColor };

        return (
          <View key={index} className="flex-1">
            <Button
              title={button}
              onPress={() => handleButtonPress(index)}
              disabled={false}
              containerStyle={containerStyle}
              textStyle={textStyle}
              containerClassName=""
              textClassName=""
            />
          </View>
        );
      })}
    </View>
  );
};
