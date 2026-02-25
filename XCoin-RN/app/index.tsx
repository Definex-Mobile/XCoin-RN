import React, { useEffect, useState } from "react";
import { Text, View, Image, Linking, BackHandler, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useRootNavigationState } from "expo-router";
import { constants } from "../src/constants/constants";
import { useTranslation } from "../src/hooks/useTranslation";
import { checkAppVersion, type VersionCheckResult, UpdateType } from "../src/services/versionService";
import { checkMaintenanceStatus, type MaintenanceCheckResult } from "../src/services/maintenanceService";
import { logButtonClick } from "../src/services/analyticsService";
import { SCREENS, PARAMS } from "../src/constants/analyticsEvents";
import { UpdateDialog } from "../src/components/updateDialog/updateDialog";
import { assetService } from "../src/services/assetService";
import { MaintenanceDialog } from "../src/components/maintenanceDialog/maintenanceDialog";

const IS_IOS = Platform.OS === constants.platform.IOS;

export default function SplashScreen() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionCheckResult | null>(null);
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceCheckResult | null>(null);

  const navigateToLogin = () => {
    const timer = setTimeout(() => {
      router.replace("/screens/login");
    }, constants.splash.loadingTime);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const checkAppStatus = async () => {
      // Wait for navigation state to be ready
      if (!rootNavigationState?.key) return;

      try {
        // 1. Fetch dynamic assets
        await assetService.fetchAssets();

        // 2. Check Maintenance First
        const maintenance = await checkMaintenanceStatus();
        if (maintenance.isActive) {
          setMaintenanceInfo(maintenance);
          setShowMaintenanceDialog(true);
          return; // Block everything
        }

        // 3. Check Version
        const result = await checkAppVersion();

        if (result.updateType !== UpdateType.NONE) {
          setVersionInfo(result);
          setShowUpdateDialog(true);
        } else {
          navigateToLogin();
        }
      } catch (error) {
        if (__DEV__) console.error('App status check failed:', error);
        navigateToLogin();
      }
    };

    checkAppStatus();
  }, [router, rootNavigationState?.key]);

  const handleUpdate = () => {
    logButtonClick(SCREENS.SPLASH, PARAMS.UPDATE);
    const storeUrl = versionInfo?.storeUrl;

    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  const handleExit = () => {
    logButtonClick(SCREENS.SPLASH, PARAMS.EXIT);
    BackHandler.exitApp();
  };

  const handleLater = () => {
    setShowUpdateDialog(false);
    navigateToLogin();
  };

  return (
    <View className="flex-1 bg-surface items-center justify-between pb-12">
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-center justify-center">
          <Image
            source={require("../assets/images/xcoin_logo.png")}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <Text className="bold48 text-onSurface ml-4">
            {useTranslation("splash.appName")}
          </Text>
        </View>
      </View>
      <View className="items-center px-8">
        <Text className="semibold14 text-onSurfaceVariant italic text-center">
          {useTranslation("splash.tagline")}
        </Text>
      </View>

      <UpdateDialog
        visible={showUpdateDialog}
        updateType={versionInfo?.updateType || UpdateType.NONE}
        currentVersion={versionInfo?.currentVersion || ''}
        targetVersion={versionInfo?.latestVersion || ''}
        releaseNotes={versionInfo?.releaseNotes}
        onUpdate={handleUpdate}
        onExit={handleExit}
        onLater={handleLater}
      />

      <MaintenanceDialog
        visible={showMaintenanceDialog}
        title={maintenanceInfo?.title}
        message={maintenanceInfo?.message}
        onExit={handleExit}
      />
    </View>
  );
}
