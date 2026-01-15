import React from 'react';
import { Pressable, Text, View, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface ButtonProps {
  containerClassName: string;
  textClassName: string;
  title: string;
  onPress?: (() => void) | null;
  disabled?: boolean;
  enableSmallShadow?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const smallShadowStyle: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.075,
    shadowRadius: 4,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) as ViewStyle;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  containerClassName = '',
  textClassName = '',
  containerStyle,
  textStyle,
  enableSmallShadow = true,
  style,
}) => {
  return (
    <View style={[enableSmallShadow ? smallShadowStyle : null, style]} className="rounded">
      <Pressable
        onPress={disabled ? undefined : onPress || undefined}
        disabled={disabled}
        hitSlop={8}
        style={containerStyle}
        className={`h-[48px] rounded-[4px] items-center justify-center overflow-hidden ${
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