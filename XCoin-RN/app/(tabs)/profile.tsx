import React from "react";
import { View, Text, ScrollView } from "react-native";
import ProfileButton from "../../src/components/profileButton/profileButton";

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-mainLightBackground">
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
