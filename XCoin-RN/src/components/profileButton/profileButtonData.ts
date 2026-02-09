import { ProfileButtonData } from "../../types/profileButtonType";
import {
  ic_history,
  ic_bank_details,
  ic_notifications,
  ic_security,
  ic_help_support,
  ic_terms_conditions,
  ic_atm,
} from "../../constants/icons";
import { Linking, Platform, Alert } from "react-native";
import * as Location from "expo-location";
import i18n from "../../constants/i18n";

export const profileButtonData: ProfileButtonData[] = [
  {
    id: "history",
    titleKey: "profile.history",
    icon: ic_history,
    onPress: () => { },
  },
  {
    id: "bankDetails",
    titleKey: "profile.bankDetails",
    icon: ic_bank_details,
    onPress: () => { },
  },
  {
    id: "notifications",
    titleKey: "profile.notifications",
    icon: ic_notifications,
    onPress: () => { },
  },
  {
    id: "security",
    titleKey: "profile.security",
    icon: ic_security,
    onPress: () => { },
  },
  {
    id: "helpSupport",
    titleKey: "profile.helpSupport",
    icon: ic_help_support,
    onPress: () => { },
  },
  {
    id: "termsConditions",
    titleKey: "profile.termsConditions",
    icon: ic_terms_conditions,
    onPress: () => { },
  },
  {
    id: "atmRoute",
    titleKey: "profile.atmRoute",
    icon: ic_atm,
    onPress: async () => {
      try {
        const isEnabled = await Location.hasServicesEnabledAsync();
        if (!isEnabled) {
          Alert.alert(
            i18n.t("common.errorTitle"),
            i18n.t("location.servicesDisabled")
          );
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            i18n.t("location.permissionDeniedTitle"),
            i18n.t("location.permissionDenied")
          );
          return;
        }

        const providerStatus = await Location.getProviderStatusAsync();

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch(async (err) => {
          return await Location.getLastKnownPositionAsync({});
        });

        if (!location) {
          Alert.alert(
            i18n.t("common.errorTitle"),
            i18n.t("location.fetchError")
          );
          return;
        }

        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        // Random offset ~300m
        const randomLat = lat + (Math.random() - 0.5) * 0.005;
        const randomLon = lon + (Math.random() - 0.5) * 0.005;

        const url = Platform.select({
          ios: `http://maps.apple.com/?daddr=${randomLat},${randomLon}&dirflg=d`,
          android: `google.navigation:q=${randomLat},${randomLon}`,
        });

        if (url) {
          Linking.openURL(url).catch((err) => { });
        }
      } catch (error) {
        Alert.alert(
          i18n.t("common.errorTitle"),
          i18n.t("location.genericError")
        );
      }
    },
  },
  {
    id: "nearbyAtms",
    titleKey: "profile.nearbyAtms",
    icon: ic_atm,
    onPress: () => {
      const url = Platform.select({
        ios: "maps://app?q=ATM",
        android: "geo:0,0?q=ATM",
      });
      if (url) {
        Linking.openURL(url).catch((err) => { });
      }
    },
  },
];
