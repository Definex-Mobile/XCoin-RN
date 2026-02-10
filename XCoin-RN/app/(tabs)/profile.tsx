import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
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

export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { t } = useTranslation();

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
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            t("imagePicker.cancel"),
            t("imagePicker.takePhoto"),
            t("imagePicker.chooseFromGallery"),
          ],
          cancelButtonIndex: 0,
          title: t("imagePicker.title"),
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleCamera();
          } else if (buttonIndex === 2) {
            handleGallery();
          }
        }
      );
    } else {
      // Android - using Alert as a simple alternative
      Alert.alert(
        t("imagePicker.title"),
        "",
        [
          {
            text: t("imagePicker.takePhoto"),
            onPress: handleCamera,
          },
          {
            text: t("imagePicker.chooseFromGallery"),
            onPress: handleGallery,
          },
          {
            text: t("imagePicker.cancel"),
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleCamera = async () => {
    const result = await openCamera();
    if (result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (uri) {
        setProfileImage(uri);
        await saveProfileImage(uri);
      }
    }
  };

  const handleGallery = async () => {
    const result = await openGallery();
    if (result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (uri) {
        setProfileImage(uri);
        await saveProfileImage(uri);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <ProfileHeader
        image={profileImage || "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif"}
        name="DefineX"
        mail="definex@teamdefinex.com"
        phone="+90 555 555 55 55"
        onImagePress={handleImagePress}
      />
      <View className="mt-8">
        {profileButtonData.map((button, index) => (
          <ProfileButton
            key={button.id}
            title={t(button.titleKey)}
            icon={button.icon}
            onPress={button.onPress}
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
                "Crashlytics Test",
                "Log ve hata kaydedildi! Firebase Console'da 5-10 dakika içinde görünecek."
              );
            }}
            className="bg-blue-500 py-4 rounded-lg mb-3"
          >
            <Text className="text-white text-center font-bold">
              Test Crashlytics (Log + Error)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Crash Test",
                "Uygulama şimdi kapanacak. Tekrar açtığınızda crash raporu Firebase'e gönderilecek.",
                [
                  { text: "İptal", style: "cancel" },
                  {
                    text: "Crash Yap",
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
              Test Crash (Uygulamayı Kapatır!)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
