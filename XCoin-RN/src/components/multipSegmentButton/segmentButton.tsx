import React from 'react';
import { Pressable, Text, View, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface ButtonProps {
  containerClassName: string;
  textClassName: string;
  title: string;
  onPress?: (() => void) | null;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const shadowSmallStyle = {
  shadowColor: "text-text-dark",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.075,
  shadowRadius: 4,
  elevation: 2,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  containerClassName = '',
  textClassName = '',
  containerStyle,
  textStyle,
}) => {
  return (
    <View>
      <Pressable
        onPress={disabled ? undefined : onPress || undefined}
        disabled={disabled}
        hitSlop={8}
        style={[shadowSmallStyle, containerStyle]}
        className={`h-[48px] rounded items-center justify-center overflow-hidden ${
          disabled ? 'opacity-50' : ''
        } ${containerClassName}`}
      >
        <Text
          style={textStyle}
          className={`semibold16 ${textClassName}`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
};
