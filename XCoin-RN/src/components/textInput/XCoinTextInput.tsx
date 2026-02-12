import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../constants/colors';

interface XCoinTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
}

const XCoinTextInput = React.forwardRef<TextInput, XCoinTextInputProps>(
  ({ label, error, secureTextEntry = false, editable = true, ...props }, ref) => {
    return (
      <View>
        <Text className="text-sm font-semibold text-coin-name mb-2">{label}</Text>
        <TextInput
          ref={ref}
          className="bg-white border border-border-light rounded-lg px-4 py-3 text-coin-price"
          placeholderTextColor={colors.text.light}
          secureTextEntry={secureTextEntry}
          editable={editable}
          {...props}
        />
        {error && (
          <Text className="text-error text-xs font-medium mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

XCoinTextInput.displayName = 'XCoinTextInput';

export default XCoinTextInput;
