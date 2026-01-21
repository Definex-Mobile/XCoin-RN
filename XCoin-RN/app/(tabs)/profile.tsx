import React from "react";
import { ScrollView, View } from "react-native";
import { ProfileHeader } from "../../src/components/profileHeader/profileHeader";
import ProfileButton from "../../src/components/profileButton/profileButton";

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
          icon={require("../../assets/images/icon_history.png")}
          onPress={() => console.log("History pressed")}
        />
        <ProfileButton
          title="Bank Details"
          icon={require("../../assets/images/icon_bank_details.png")}
          onPress={() => console.log("Bank Details pressed")}
        />
        <ProfileButton
          title="Notifications"
          icon={require("../../assets/images/icon_notifications.png")}
          onPress={() => console.log("Notifications pressed")}
        />
        <ProfileButton
          title="Security"
          icon={require("../../assets/images/icon_security.png")}
          onPress={() => console.log("Security pressed")}
        />
        <ProfileButton
          title="Help and Support"
          icon={require("../../assets/images/icon_help_support.png")}
          onPress={() => console.log("Help and Support pressed")}
        />
        <ProfileButton
          title="Terms and Conditions"
          icon={require("../../assets/images/icon_terms_conditions.png")}
          onPress={() => console.log("Terms and Conditions pressed")}
          isLast={true}
        />
      </View>
    </ScrollView>
  );
}
