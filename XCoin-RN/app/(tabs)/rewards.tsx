import React from "react";
import { ScrollView, View } from "react-native";
import { RewardsCoupons, RewardsCouponsSection } from "../../src/components/rewardsCoupons/rewardsCoupons";
import { useTranslation } from "../../src/hooks/useTranslation";
import BannerCard, { BannerType, BannerCardProps } from "../../src/components/bannerCard/bannerCard";
import { logButtonClick } from "../../src/services/analyticsService";
import { SCREENS } from "../../src/constants/analyticsEvents";
import { assetService } from "../../src/services/assetService";

function handleBannerPress(type: BannerType): void {
  const buttonName = type === BannerType.REFER ? "refer_banner" : "like_banner";
  logButtonClick(SCREENS.REWARDS, buttonName);
}

export default function RewardsCouponsScreen() {
  const { t } = useTranslation();

  const Sections: RewardsCouponsSection[] = [
    {
      title: t("rewards.coupons"),
      rows: [
        { label: t("rewards.noOfCouponsWon"), value: "6", tone: "accent" },
        { label: t("rewards.tokensWonFromSpinSoFar"), value: "8" },
        { label: t("rewards.remainingCouponsToSpin"), value: "1" },
      ],
    },
    {
      title: t("rewards.referral"),
      rows: [
        { label: t("rewards.totalNoOfReferral"), value: "12", tone: "accent" },
        { label: t("rewards.totalNoOfQualifiedReferral"), value: "5" },
      ],
    },
  ];

  const Cards: BannerCardProps[] = [
    {
      title: t("bannerCard.referTitle"),
      description: t("bannerCard.referDesc"),
      buttonText: t("bannerCard.referButtonText"),
      onButtonPress: () => handleBannerPress(BannerType.REFER),
      image: assetService.getAssetSource('img_refer_card', require("../../assets/images/xcoin_logo.png")),
      bannerType: BannerType.REFER,
      height: 160
    },
    {
      title: t("bannerCard.likeTitle"),
      description: t("bannerCard.likeDesc"),
      buttonText: t("bannerCard.likeButtonText"),
      onButtonPress: () => handleBannerPress(BannerType.LIKE),
      image: assetService.getAssetSource('img_like_card', require("../../assets/images/xcoin_logo.png")),
      bannerType: BannerType.LIKE,
      height: 160
    }
  ]

  return (
    <ScrollView className="flex-1 bg-background">
      <RewardsCoupons sections={Sections} />
      <View className="pt-[16px] gap-y-[8px]">
        {Cards.map((card, index) => (
          <BannerCard key={index} {...card} />
        ))}
      </View>
    </ScrollView>
  );
}
