import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../constants/colors';

interface XCoinTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
}

import { useTheme } from '../../context/ThemeContext';

const XCoinTextInput = React.forwardRef<TextInput, XCoinTextInputProps>(
  ({ label, error, secureTextEntry = false, editable = true, ...props }, ref) => {
    const { activeScheme } = useTheme();

    return (
      <View>
        <Text className="text-sm font-semibold text-onSurface mb-2">{label}</Text>
        <TextInput
          ref={ref}
          className="bg-surface border border-outlineVariant rounded-lg px-4 py-3 text-onSurface"
          placeholderTextColor={activeScheme?.onSurfaceVariant}
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
