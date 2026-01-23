import React from "react";
import { ScrollView, View } from "react-native";
import { RewardsCoupons, RewardsCouponsSection } from "../../src/components/rewardsCoupons/rewardsCoupons";
import { useTranslation } from "../../src/hooks/useTranslation";
import BannerCard, { BannerType, BannerCardProps } from "../../src/components/bannerCard/bannerCard";

function handleBannerPress(type: BannerType): void {
  console.log(`${type} Button Pressed`);
}

export default function RewardsCouponsScreen() {
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
  
  const Cards: BannerCardProps[] = [
    {
      title: useTranslation("bannerCard.referTitle"),
      description: useTranslation("bannerCard.referDesc"),
      buttonText: useTranslation("bannerCard.referButtonText"), 
      onButtonPress: () => handleBannerPress(BannerType.REFER),
      image: require("../../assets/images/img-refer-card.png"), 
      bannerType: BannerType.REFER,
      height: 160
    },
    {
      title: useTranslation("bannerCard.likeTitle"), 
      description: useTranslation("bannerCard.likeDesc"), 
      buttonText: useTranslation("bannerCard.likeButtonText"), 
      onButtonPress: () => handleBannerPress(BannerType.LIKE), 
      image: require("../../assets/images/img-like-card.png"), 
      bannerType: BannerType.LIKE,
      height: 160
    }
  ]

  return (
    <ScrollView className="flex-1 bg-rewards">
      <RewardsCoupons sections={Sections} />
      <View className="pt-4 gap-y-2">
        {Cards.map((card, index) => (
          <BannerCard key={index} {...card} />
        ))}
      </View>
    </ScrollView>
  );
}