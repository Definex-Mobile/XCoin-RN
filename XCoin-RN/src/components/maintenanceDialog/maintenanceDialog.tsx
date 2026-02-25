import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useTranslation as useI18nTranslation } from '../../constants/i18n';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';

export interface MaintenanceDialogProps {
    visible: boolean;
    title?: Record<string, string>;
    message?: Record<string, string>;
    onExit: () => void;
}

export const MaintenanceDialog: React.FC<MaintenanceDialogProps> = ({
    visible,
    title,
    message,
    onExit,
}) => {
    const { t } = useI18nTranslation();
    const { currentLanguage: language } = useLanguage();

    const displayTitle = title?.[language] || title?.['en'] || t('maintenance.defaultTitle');
    const displayMessage = message?.[language] || message?.['en'] || t('maintenance.defaultMessage');

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => { }}
        >
            <View
                style={{ backgroundColor: colors.scrim }}
                className="flex-1 justify-center items-center px-6"
            >
                <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                    <View className="items-center mb-4">
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-secondaryContainer"
                        >
                            <Text style={{ fontSize: 32 }}>🛠️</Text>
                        </View>
                        <Text className="bold22 text-onSurface text-center">
                            {displayTitle}
                        </Text>
                    </View>

                    <Text className="regular15 text-onSurfaceVariant text-center mb-8 leading-5">
                        {displayMessage}
                    </Text>

                    <Pressable
                        onPress={onExit}
                        className="h-12 rounded-lg items-center justify-center shadow-sm"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Text className="medium16 text-white">
                            {t('updateDialog.exitButton')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};
