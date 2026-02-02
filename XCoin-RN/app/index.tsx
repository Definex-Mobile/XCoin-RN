import React, { useEffect, useState } from "react";
import { Text, View, Image, Platform, Linking, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { constants } from "../src/constants/constants";
import { useTranslation } from "../src/hooks/useTranslation";
import { checkAppVersion, type VersionCheckResult } from "../src/services/versionService";
import { UpdateDialog } from "../src/components/updateDialog/updateDialog";

const IS_IOS = Platform.OS === constants.platform.IOS;

export default function SplashScreen() {
  const router = useRouter();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionCheckResult | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const result = await checkAppVersion();

        if (result.needsUpdate) {
          setVersionInfo(result);
          setShowUpdateDialog(true);
        } else {
          const timer = setTimeout(() => {
            router.push("/(tabs)");
          }, constants.splash.loadingTime);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Version check failed:', error);
        const timer = setTimeout(() => {
          router.push("/(tabs)");
        }, constants.splash.loadingTime);

        return () => clearTimeout(timer);
      }
    };

    checkVersion();
  }, [router]);

  const handleUpdate = () => {
    const storeUrl = IS_IOS
      ? constants.appStoreUrls.ios
      : constants.appStoreUrls.android;

    Linking.openURL(storeUrl);
  };

  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <View className="flex-1 bg-white items-center justify-between pb-8">
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-center justify-center">
          <Image
            source={require("../assets/images/xcoin_logo.png")}
            className="w-16 h-16"
            resizeMode="contain"
          />
          <Text className="bold42 text-gray-800 ml-3">
            {useTranslation("splash.appName")}
          </Text>
        </View>
      </View>
      <Text className="semibold12 text-gray-400 italic">
        {useTranslation("splash.tagline")}
      </Text>

      <UpdateDialog
        visible={showUpdateDialog}
        currentVersion={versionInfo?.currentVersion || ''}
        requiredVersion={versionInfo?.requiredVersion || ''}
        onUpdate={handleUpdate}
        onExit={handleExit}
      />
    </View>
  );
}
