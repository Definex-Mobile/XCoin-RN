import { ProfileButtonData } from "../../types/profileButtonType";
import {
  ic_history,
  ic_bank_details,
  ic_notifications,
  ic_security,
  ic_help_support,
  ic_terms_conditions,
} from "../../constants/icons";
import { logButtonClick } from "../../services/analyticsService";
import { SCREENS } from "../../constants/analyticsEvents";

export const profileButtonData: ProfileButtonData[] = [
  {
    id: "history",
    titleKey: "profile.history",
    icon: ic_history,
    onPress: () => logButtonClick(SCREENS.PROFILE, "history"),
  },
  {
    id: "bankDetails",
    titleKey: "profile.bankDetails",
    icon: ic_bank_details,
    onPress: () => logButtonClick(SCREENS.PROFILE, "bank_details"),
  },
  {
    id: "notifications",
    titleKey: "profile.notifications",
    icon: ic_notifications,
    onPress: () => logButtonClick(SCREENS.PROFILE, "notifications"),
  },
  {
    id: "security",
    titleKey: "profile.security",
    icon: ic_security,
    onPress: () => logButtonClick(SCREENS.PROFILE, "security"),
  },
  {
    id: "helpSupport",
    titleKey: "profile.helpSupport",
    icon: ic_help_support,
    onPress: () => logButtonClick(SCREENS.PROFILE, "help_support"),
  },
  {
    id: "termsConditions",
    titleKey: "profile.termsConditions",
    icon: ic_terms_conditions,
    onPress: () => logButtonClick(SCREENS.PROFILE, "terms_conditions"),
  },
];
