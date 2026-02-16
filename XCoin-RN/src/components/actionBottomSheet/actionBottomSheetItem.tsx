import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

interface ActionBottomSheetItemProps {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    isDestructive?: boolean;
}

export default function ActionBottomSheetItem({
    label,
    icon,
    onPress,
    isDestructive,
}: ActionBottomSheetItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 border-b border-gray-100 last:border-b-0"
        >
            {icon && (
                <View className="mr-4 w-8 items-center">
                    <Ionicons
                        name={icon}
                        size={22}
                        color={isDestructive ? colors.market.down : colors.primaryBlue.DEFAULT}
                    />
                </View>
            )}
            <Text
                className={`medium16 ${isDestructive ? "text-market-down" : "text-text"
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
