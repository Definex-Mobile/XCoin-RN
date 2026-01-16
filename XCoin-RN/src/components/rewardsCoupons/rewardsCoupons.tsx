import React from "react";
import { ScrollView, Text, View } from "react-native";

export type CouponRow = {
  label: string;
  value: string;
  tone?: "default" | "accent";
};

export type RewardsCouponsSection = {
  title: string;
  rows: CouponRow[];
};

export type RewardsCouponsProps = {
  sections: RewardsCouponsSection[];
};

const shadowSmallStyle = {
  shadowColor: "#text-dark",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.075,
  shadowRadius: 4,
  elevation: 2,
};

function SectionCard({ title, rows }: RewardsCouponsSection) {
  const valueClassName = "medium14 text-primaryBlue";
  const accentValueClassName = "medium14 text-rewards-darkText";

  return (
    <View style={shadowSmallStyle} className="pl-5 pr-6 pt-5 pb-6 rounded-xl bg-white">
      <Text className="bold20 text-slate-900">{title}</Text>

      <View className="pt-5 gap-4">
        {rows.map((row, index) => {
          const isAccent = row.tone === "accent";
          return (
            <View key={`${row.label}-${index}`} className="flex-row items-center justify-between">
              <Text className="lightItalic12 text-crypto-subtitle">{row.label}</Text>
              <Text className={isAccent ? accentValueClassName : valueClassName}>
                {row.value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function RewardsCoupons({ sections }: RewardsCouponsProps) {
  return (
    <ScrollView className="flex-1 bg-rewards">
      <View className="px-4 pt-6 space-y-6 gap-[4px]">
        {sections.map((section, idx) => (
          <SectionCard key={`${section.title}-${idx}`} title={section.title} rows={section.rows} />
        ))}
      </View>
    </ScrollView>
  );
}
