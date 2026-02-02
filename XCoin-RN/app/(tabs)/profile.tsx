import React from "react";
import { ScrollView, View, TouchableOpacity, Text, Alert } from "react-native";
import { ProfileHeader } from "../../src/components/profileHeader/profileHeader";
import ProfileButton from "../../src/components/profileButton/profileButton";
import { profileButtonData } from "../../src/components/profileButton/profileButtonData";
import { useTranslation } from "../../src/hooks/useTranslation";
import { CrashlyticsService } from "../../src/services/crashlytics";

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-mainLightBackground">
      <ProfileHeader
        image="https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png"
        name="DefineX"
        mail="definex@teamdefinex.com"
        phone="+90 555 555 55 55"
      />
      <View className="mt-8">
        {profileButtonData.map((button, index) => (
          <ProfileButton
            key={button.id}
            title={useTranslation(button.titleKey)}
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
              CrashlyticsService.log('Test log mesajı gönderildi');
              CrashlyticsService.recordError(
                new Error('Test hatası - Crashlytics çalışıyor!'),
                'Test Context'
              );
              Alert.alert(
                'Crashlytics Test',
                'Log ve hata kaydedildi! Firebase Console\'da 5-10 dakika içinde görünecek.'
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
                'Crash Test',
                'Uygulama şimdi kapanacak. Tekrar açtığınızda crash raporu Firebase\'e gönderilecek.',
                [
                  { text: 'İptal', style: 'cancel' },
                  {
                    text: 'Crash Yap',
                    style: 'destructive',
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
