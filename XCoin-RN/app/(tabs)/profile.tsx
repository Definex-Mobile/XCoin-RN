import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ProfileHeader } from "../../src/components/profileHeader/profileHeader";
import ProfileButton from "../../src/components/profileButton/profileButton";
import { profileButtonData } from "../../src/components/profileButton/profileButtonData";
import { useTranslation } from "react-i18next";
import { CrashlyticsService } from "../../src/services/crashlytics";
import { openCamera, openGallery } from "../../src/services/imagePickerService";
import {
  saveProfileImage,
  getProfileImage,
} from "../../src/services/profileStorageService";
import ActionBottomSheet, { Action } from "../../src/components/actionBottomSheet/actionBottomSheet";
import { useAuth } from "../../src/hooks/useAuth";
import { colors } from "../../src/constants/colors";

export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageSheetVisible, setIsImageSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { userInfo } = useAuth();

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    const savedImage = await getProfileImage();
    if (savedImage) {
      setProfileImage(savedImage);
    }
  };

  const handleImagePress = () => {
    setIsImageSheetVisible(true);
  };

  const handleButtonPress = async (onPress: any) => {
    setLoading(true);
    try {
      await onPress?.();
    } finally {
      setLoading(false);
    }
  };

  const imageActions: Action[] = [
    {
      id: "camera",
      label: t("imagePicker.takePhoto"),
      icon: "camera",
      onPress: async () => {
        const result = await openCamera();
        if (result.assets && result.assets[0]) {
          const uri = result.assets[0].uri;
          if (uri) {
            setProfileImage(uri);
            await saveProfileImage(uri);
          }
        }
      },
    },
    {
      id: "gallery",
      label: t("imagePicker.chooseFromGallery"),
      icon: "image",
      onPress: async () => {
        const result = await openGallery();
        if (result.assets && result.assets[0]) {
          const uri = result.assets[0].uri;
          if (uri) {
            setProfileImage(uri);
            await saveProfileImage(uri);
          }
        }
      },
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <ProfileHeader
          image={profileImage || "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif"}
          name="DefineX"
          mail={userInfo?.email || "definex@teamdefinex.com"}
          phone="+90 555 555 55 55"
          onImagePress={handleImagePress}
        />
        <View className="mt-8">
          {profileButtonData.map((button, index) => (
            <ProfileButton
              key={button.id}
              title={t(button.titleKey)}
              icon={button.icon}
              onPress={() => handleButtonPress(button.onPress)}
              isLast={index === profileButtonData.length - 1}
            />
          ))}
        </View>

        {__DEV__ && (
          <View className="mt-8 px-4 pb-8">
            <TouchableOpacity
              onPress={() => {
                CrashlyticsService.log("Test log mesajı gönderildi");
                CrashlyticsService.recordError(
                  new Error("Test hatası - Crashlytics çalışıyor!"),
                  "Test Context"
                );
                Alert.alert(
                  t("profile.debug.crashlyticsTestTitle"),
                  t("profile.debug.crashlyticsTestMessage")
                );
              }}
              className="bg-blue-500 py-4 rounded-lg mb-3"
            >
              <Text className="text-white text-center font-bold">
                {t("profile.debug.crashlyticsTestButton")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  t("profile.debug.crashTitle"),
                  t("profile.debug.crashMessage"),
                  [
                    { text: t("common.cancel"), style: "cancel" },
                    {
                      text: t("profile.debug.crashConfirm"),
                      style: "destructive",
                      onPress: () => {
                        setTimeout(() => {
                          CrashlyticsService.testCrash();
                        }, 500);
                      },
                    },
                  ]
                );
              }}
              className="bg-red-500 py-4 rounded-lg"
            >
              <Text className="text-white text-center font-bold">
                {t("profile.debug.crashButton")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ActionBottomSheet
        isVisible={isImageSheetVisible}
        onClose={() => setIsImageSheetVisible(false)}
        title={t("imagePicker.title")}
        actions={imageActions}
      />

      {loading && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/30"
          style={{ zIndex: 999 }}
        >
          <View className="bg-white p-6 rounded-2xl items-center shadow-lg">
            <ActivityIndicator
              size="large"
              color={colors.primaryBlue.DEFAULT}
            />
            <Text className="mt-4 regular16 text-text">
              {t("common.loading")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
