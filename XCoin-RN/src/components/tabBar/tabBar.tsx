import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";

export interface Tab {
    id: string;
    labelKey: string;
}

interface TabBarProps {
    tabs: Tab[];
    selectedTabId: string;
    onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, selectedTabId, onTabChange }: TabBarProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
        >
            {tabs.map((tab, index) => {
                const isActive = tab.id === selectedTabId;
                const isLast = index === tabs.length - 1;

                return (
                    <Pressable
                        key={tab.id}
                        onPress={() => onTabChange(tab.id)}
                        className={`${!isLast ? 'mr-6' : ''}`}
                    >
                        <Text
                            className={`medium14 ${isActive ? "text-tab-activeText" : "text-tab-inactiveText"
                                }`}
                        >
                            {useTranslation(tab.labelKey)}
                        </Text>
                        {isActive && (
                            <View
                                className="bg-tab-activeBorder mt-[3px] h-[3px]"
                            />
                        )}
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
