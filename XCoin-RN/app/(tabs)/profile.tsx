import React from "react";
import { ScrollView, View } from "react-native";
import { ProfileHeader } from "../../src/components/profileHeader/profileHeader";
import ProfileButton from "../../src/components/profileButton/profileButton";

// SVG Icons
import IconHistory from "../../assets/images/icon_history.svg";
import IconBankDetails from "../../assets/images/icon_bank_details.svg";
import IconNotifications from "../../assets/images/icon_notifications.svg";
import IconSecurity from "../../assets/images/icon_security.svg";
import IconHelpSupport from "../../assets/images/icon_help_support.svg";
import IconTermsConditions from "../../assets/images/icon_terms_conditions.svg";

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-mainLightBackground">
      <ProfileHeader
        image="https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png"
        name="DefineX"
        mail="definex@teamdefinex.com"
        phone="+90 555 555 55 55"
      />
      <View className="mt-6">
        <ProfileButton
          title="History"
          icon={IconHistory}
          onPress={() => console.log("History pressed")}
        />
        <ProfileButton
          title="Bank Details"
          icon={IconBankDetails}
          onPress={() => console.log("Bank Details pressed")}
        />
        <ProfileButton
          title="Notifications"
          icon={IconNotifications}
          onPress={() => console.log("Notifications pressed")}
        />
        <ProfileButton
          title="Security"
          icon={IconSecurity}
          onPress={() => console.log("Security pressed")}
        />
        <ProfileButton
          title="Help and Support"
          icon={IconHelpSupport}
          onPress={() => console.log("Help and Support pressed")}
        />
        <ProfileButton
          title="Terms and Conditions"
          icon={IconTermsConditions}
          onPress={() => console.log("Terms and Conditions pressed")}
          isLast={true}
        />
      </View>
    </ScrollView>
  );
}
