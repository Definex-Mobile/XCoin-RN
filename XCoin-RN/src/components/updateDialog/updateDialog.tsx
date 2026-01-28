import React from 'react';
import { Modal, View, Text, Pressable, BackHandler } from 'react-native';
import { useTranslation as useI18nTranslation } from '../../constants/i18n';
import { colors } from '../../constants/colors';

export interface UpdateDialogProps {
    visible: boolean;
    currentVersion: string;
    requiredVersion: string;
    onUpdate: () => void;
    onExit: () => void;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
    visible,
    currentVersion,
    requiredVersion,
    onUpdate,
    onExit,
}) => {
    const { t } = useI18nTranslation();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => true}
        >
            <View
                style={{ backgroundColor: colors.overlay.dark }}
                className="flex-1 justify-center items-center px-6"
            >
                <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                    <Text className="bold20 text-text text-center mb-4">
                        {t('updateDialog.title')}
                    </Text>

                    <Text className="regular14 text-text-light text-center mb-6">
                        {t('updateDialog.message')}
                    </Text>

                    <View className="bg-background-gray rounded-xl p-4 mb-6">
                        <View className="flex-row justify-between mb-2">
                            <Text className="regular14 text-text-light">
                                {t('updateDialog.currentVersion')}:
                            </Text>
                            <Text className="medium14 text-text">
                                {currentVersion}
                            </Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="regular14 text-text-light">
                                {t('updateDialog.requiredVersion')}:
                            </Text>
                            <Text className="medium14 text-text">
                                {requiredVersion}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        onPress={onUpdate}
                        className="h-12 rounded-lg items-center justify-center mb-3"
                        style={{ backgroundColor: colors.primaryBlue.DEFAULT }}
                    >
                        <Text className="medium16 text-white">
                            {t('updateDialog.updateButton')}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={onExit}
                        className="h-12 rounded-lg items-center justify-center border border-gray-300"
                    >
                        <Text className="medium16 text-text-light">
                            {t('updateDialog.exitButton')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};
