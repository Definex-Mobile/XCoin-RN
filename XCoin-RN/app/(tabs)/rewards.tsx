import React from "react";
import { ScrollView, View } from "react-native";
import { RewardsCoupons, RewardsCouponsSection } from "../../src/components/rewardsCoupons/rewardsCoupons";
import { useTranslation } from "../../src/hooks/useTranslation";

const Sections: RewardsCouponsSection[] = [
  {
    title: useTranslation("rewards.coupons"),
    rows: [
      { label: useTranslation("rewards.noOfCouponsWon"), value: "6", tone: "accent" },
      { label: useTranslation("rewards.tokensWonFromSpinSoFar"), value: "8" },
      { label: useTranslation("rewards.remainingCouponsToSpin"), value: "1" },
    ],
  },
  {
    title: useTranslation("rewards.referral"),
    rows: [
      { label: useTranslation("rewards.totalNoOfReferral"), value: "12", tone: "accent" },
      { label: useTranslation("rewards.totalNoOfQualifiedReferral"), value: "5" },
    ],
  },
];

export default function RewardsCouponsScreen() {
  return (
    <ScrollView className="flex-1 bg-rewards">
      <RewardsCoupons sections={Sections} />
    </ScrollView>
  );
}
