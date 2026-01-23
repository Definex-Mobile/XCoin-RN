import { ProfileButtonData } from "../../types/profileButtonType";
import {
  ic_history,
  ic_bank_details,
  ic_notifications,
  ic_security,
  ic_help_support,
  ic_terms_conditions,
} from "../../constants/icons";

export const profileButtonData: ProfileButtonData[] = [
  {
    id: "history",
    titleKey: "profile.history",
    icon: ic_history,
    onPress: () => console.log("History pressed"),
  },
  {
    id: "bankDetails",
    titleKey: "profile.bankDetails",
    icon: ic_bank_details,
    onPress: () => console.log("Bank Details pressed"),
  },
  {
    id: "notifications",
    titleKey: "profile.notifications",
    icon: ic_notifications,
    onPress: () => console.log("Notifications pressed"),
  },
  {
    id: "security",
    titleKey: "profile.security",
    icon: ic_security,
    onPress: () => console.log("Security pressed"),
  },
  {
    id: "helpSupport",
    titleKey: "profile.helpSupport",
    icon: ic_help_support,
    onPress: () => console.log("Help and Support pressed"),
  },
  {
    id: "termsConditions",
    titleKey: "profile.termsConditions",
    icon: ic_terms_conditions,
    onPress: () => console.log("Terms and Conditions pressed"),
  },
];
