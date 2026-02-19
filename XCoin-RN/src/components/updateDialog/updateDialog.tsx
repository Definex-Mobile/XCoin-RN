import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation as useI18nTranslation } from '../../constants/i18n';
import { colors } from '../../constants/colors';
import { UpdateType } from '../../services/versionService';
import { useLanguage } from '../../hooks/useLanguage';

export interface UpdateDialogProps {
    visible: boolean;
    updateType: UpdateType;
    currentVersion: string;
    targetVersion: string;
    releaseNotes?: Record<string, string>;
    onUpdate: () => void;
    onExit: () => void;
    onLater?: () => void;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
    visible,
    updateType,
    currentVersion,
    targetVersion,
    releaseNotes,
    onUpdate,
    onExit,
    onLater,
}) => {
    const { t } = useI18nTranslation();
    const { currentLanguage: language } = useLanguage();

    if (updateType === UpdateType.NONE) return null;

    const isForceUpdate = updateType === UpdateType.FORCE;
    const releaseNoteText = releaseNotes?.[language] || releaseNotes?.['en'] || '';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => !isForceUpdate}
        >
            <View
                style={{ backgroundColor: colors.overlay.dark }}
                className="flex-1 justify-center items-center px-6"
            >
                <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                    <Text className="bold22 text-text text-center mb-4">
                        {t('updateDialog.title')}
                    </Text>

                    <Text className="regular15 text-text-light text-center mb-6 leading-5">
                        {isForceUpdate
                            ? t('updateDialog.messageForce')
                            : t('updateDialog.messageSoft')}
                    </Text>

                    {releaseNoteText ? (
                        <View className="bg-background-gray rounded-2xl p-4 mb-6 max-h-40">
                            <Text className="semibold14 text-text mb-2">
                                {t('updateDialog.releaseNotes')} ({targetVersion})
                            </Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text className="regular13 text-text-light">
                                    {releaseNoteText}
                                </Text>
                            </ScrollView>
                        </View>
                    ) : (
                        <View className="bg-background-gray rounded-2xl p-4 mb-6">
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
                                    {targetVersion}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View className="space-y-3">
                        <Pressable
                            onPress={onUpdate}
                            className="h-14 rounded-2xl items-center justify-center shadow-sm"
                            style={{ backgroundColor: colors.primaryBlue.DEFAULT }}
                        >
                            <Text className="bold16 text-white">
                                {t('updateDialog.updateButton')}
                            </Text>
                        </Pressable>

                        {isForceUpdate ? (
                            <Pressable
                                onPress={onExit}
                                className="h-12 rounded-2xl items-center justify-center"
                            >
                                <Text className="semibold15 text-error">
                                    {t('updateDialog.exitButton')}
                                </Text>
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={onLater}
                                className="h-12 rounded-2xl items-center justify-center"
                            >
                                <Text className="semibold15 text-text-light">
                                    {t('updateDialog.laterButton')}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
