import React from 'react';
import { View, Text, Modal, StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';

interface SecurityBlockDialogProps {
    visible: boolean;
    message: string;
}

import { useTheme } from '../../context/ThemeContext';

export function SecurityBlockDialog({ visible, message }: SecurityBlockDialogProps) {
    const { activeScheme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View
                style={{ backgroundColor: activeScheme?.scrim + '80' || 'rgba(0,0,0,0.5)' }}
                className="flex-1 justify-center items-center p-5"
            >
                <View
                    style={{
                        backgroundColor: activeScheme?.surface || '#FFFFFF',
                        shadowColor: activeScheme?.shadow || '#000000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                    className="rounded-2xl p-6 w-full max-w-[400px] items-center"
                >
                    <View
                        style={{ backgroundColor: activeScheme?.errorContainer || '#F9DEDC' }}
                        className="w-16 h-16 rounded-full justify-center items-center mb-4"
                    >
                        <Text className="text-3xl">🔒</Text>
                    </View>

                    <Text className="text-xl font-bold text-onSurface mb-3 text-center">
                        Security Alert
                    </Text>
                    <Text className="text-base text-onSurfaceVariant text-center leading-6 mb-5">
                        {message}
                    </Text>

                    <View
                        style={{ borderTopColor: activeScheme?.outlineVariant || '#E0E0E0' }}
                        className="pt-4 border-t w-full"
                    >
                        <Text className="text-sm text-onSurfaceVariant text-center italic">
                            Please use a standard device to access this app.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
