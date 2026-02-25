import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../constants/colors";
import ActionBottomSheetItem from "./actionBottomSheetItem";
import { Ionicons } from "@expo/vector-icons";

export interface Action {
    id: string;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    isDestructive?: boolean;
}

interface ActionBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    actions: Action[];
}

export default function ActionBottomSheet({
    isVisible,
    onClose,
    title,
    actions,
}: ActionBottomSheetProps) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    style={{ backgroundColor: colors.scrim }}
                    className="flex-1 justify-end"
                >
                    <TouchableWithoutFeedback>
                        <SafeAreaView className="bg-white rounded-t-3xl overflow-hidden">
                            <View className="px-6 pt-6 pb-2">
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="bold20 text-text">
                                        {title || t("common.selectOptions")}
                                    </Text>
                                    <TouchableWithoutFeedback onPress={onClose}>
                                        <Ionicons name="close" size={24} color={colors.onSurfaceVariant} />
                                    </TouchableWithoutFeedback>
                                </View>

                                <ScrollView className="max-h-[60%]">
                                    {actions.map((action) => (
                                        <ActionBottomSheetItem
                                            key={action.id}
                                            label={action.label}
                                            icon={action.icon}
                                            isDestructive={action.isDestructive}
                                            onPress={() => {
                                                action.onPress();
                                                onClose();
                                            }}
                                        />
                                    ))}
                                </ScrollView>

                                <View className="mt-4 mb-6">
                                    <ActionBottomSheetItem
                                        label={t("common.cancel")}
                                        onPress={onClose}
                                        isDestructive={false}
                                    />
                                </View>
                            </View>
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
