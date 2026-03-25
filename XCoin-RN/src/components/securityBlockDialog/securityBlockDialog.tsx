import React from 'react';
import { View, Text, Modal, StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';

import { useTranslation } from 'react-i18next';

interface SecurityBlockDialogProps {
    visible: boolean;
    threatType?: string;
}

import { useTheme } from '../../context/ThemeContext';

export function SecurityBlockDialog({ visible, threatType }: SecurityBlockDialogProps) {
    const { activeScheme } = useTheme();
    const { t } = useTranslation();

    const getMessage = () => {
        if (!threatType) return t('security.threat.generic');
        return t(`security.threat.${threatType}`, t('security.threat.generic'));
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View
                style={{ backgroundColor: activeScheme?.scrim + '80' }}
                className="flex-1 justify-center items-center p-5"
            >
                <View
                    style={{
                        backgroundColor: activeScheme?.surface,
                        shadowColor: activeScheme?.shadow,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                    className="rounded-2xl p-6 w-full max-w-[400px] items-center"
                >
                    <View
                        style={{ backgroundColor: activeScheme?.errorContainer }}
                        className="w-16 h-16 rounded-full justify-center items-center mb-4"
                    >
                        <Text className="text-3xl">🔒</Text>
                    </View>

                    <Text className="text-xl font-bold text-onSurface mb-3 text-center">
                        {t('security.block.title')}
                    </Text>
                    <Text className="text-base text-onSurfaceVariant text-center leading-6 mb-5">
                        {getMessage()}
                    </Text>

                    <View
                        style={{ borderTopColor: activeScheme?.outlineVariant }}
                        className="pt-4 border-t w-full"
                    >
                        <Text className="text-sm text-onSurfaceVariant text-center italic">
                            {t('security.block.subtitle')}
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
