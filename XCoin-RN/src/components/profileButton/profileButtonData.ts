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
import { logButtonClick } from "../../services/analyticsService";
import { SCREENS, PARAMS } from "../../constants/analyticsEvents";

export const profileButtonData: ProfileButtonData[] = [
  {
    id: "history",
    titleKey: "profile.history",
    icon: ic_history,
    onPress: () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.HISTORY);
    },
  },
  {
    id: "bankDetails",
    titleKey: "profile.bankDetails",
    icon: ic_bank_details,
    onPress: () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.BANK_DETAILS);
    },
  },
  {
    id: "notifications",
    titleKey: "profile.notifications",
    icon: ic_notifications,
    onPress: () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.NOTIFICATION);
    },
  },
  {
    id: "security",
    titleKey: "profile.security",
    icon: ic_security,
    onPress: () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.SECURITY);
    },
  },
  {
    id: "helpSupport",
    titleKey: "profile.helpSupport",
    icon: ic_help_support,
    onPress: () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.HELP_SUPPORT);
    },
  },
  {
    id: "termsConditions",
    titleKey: "profile.termsConditions",
    icon: ic_terms_conditions,
    onPress: () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.TERMS_COND);
    },
  },
  {
    id: "atmRoute",
    titleKey: "profile.atmRoute",
    icon: ic_atm,
    onPress: async () => {
      logButtonClick(SCREENS.PROFILE, PARAMS.ATM_ROUTE);
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
      logButtonClick(SCREENS.PROFILE, PARAMS.NEARBY_ATMS);
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
