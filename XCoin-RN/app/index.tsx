import React, { useEffect, useState } from "react";
import { Text, View, Image, Linking, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { constants } from "../src/constants/constants";
import { useTranslation } from "../src/hooks/useTranslation";
import { checkAppVersion, type VersionCheckResult, UpdateType } from "../src/services/versionService";
import { logButtonClick } from "../src/services/analyticsService";
import { SCREENS, PARAMS } from "../src/constants/analyticsEvents";
import { UpdateDialog } from "../src/components/updateDialog/updateDialog";

export default function SplashScreen() {
  const router = useRouter();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionCheckResult | null>(null);

  const navigateToLogin = () => {
    const timer = setTimeout(() => {
      router.replace("/screens/login");
    }, constants.splash.loadingTime);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const result = await checkAppVersion();

        if (result.updateType !== UpdateType.NONE) {
          setVersionInfo(result);
          setShowUpdateDialog(true);
        } else {
          navigateToLogin();
        }
      } catch (error) {
        if (__DEV__) console.error('Version check failed:', error);
        navigateToLogin();
      }
    };

    checkVersion();
  }, [router]);

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
    <View className="flex-1 bg-white items-center justify-between pb-12">
      <StatusBar style="dark" backgroundColor="white" />
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-center justify-center">
          <Image
            source={require("../assets/images/xcoin_logo.png")}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <Text className="bold48 text-gray-800 ml-4">
            {useTranslation("splash.appName")}
          </Text>
        </View>
      </View>

      <View className="items-center px-8">
        <Text className="semibold14 text-gray-400 italic text-center">
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
    </View>
  );
}
