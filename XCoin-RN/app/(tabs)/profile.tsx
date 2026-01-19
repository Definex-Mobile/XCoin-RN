import React from "react";
import { View } from "react-native";
import { ProfileHeader } from "../../src/components/profileHeader/profileHeader";

export default function Profile() {
  return (
    <View className="flex-1">
      <ProfileHeader
        image="https://www.pngall.com/wp-content/uploads/10/Cardano-Crypto-Logo.png"
        name="DefineX"
        mail="definex@teamdefinex.com"
        phone="+90 555 555 55 55"
      />
    </View>
  );
}
