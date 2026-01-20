import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../constants/colors";
import BottomSheetItem from "./bottomSheetItem";
import { DropdownItem } from "./types";

const MOCK_MARKETS: DropdownItem[] = [
  { title: "TRY - TL", value: "TRY" },
  { title: "Bitcoin - BTC", value: "BTC" },
  { title: "TetherUS - USDT", value: "USDT" },
];

interface DropdownBottomSheetProps {
  selectedValue?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
}

export default function DropdownBottomSheet({
  selectedValue,
  onValueChange,
  placeholder,
}: DropdownBottomSheetProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue);

  const selectedItem = MOCK_MARKETS.find(
    (item) => item.value === selectedValue
  );

  const handleOpen = () => {
    setTempSelectedValue(selectedValue);
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleItemPress = (value: string) => {
    setTempSelectedValue(value);
  };

  const handleUpdate = () => {
    if (tempSelectedValue) {
      onValueChange(tempSelectedValue);
    }
    handleClose();
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        style={{ borderColor: colors.border.gray }}
        className="flex-row items-center rounded-3xl px-[9px] py-[5px] border bg-white"
      >
        <Text
          className="lightItalic12 me-3"
          style={{
            color: selectedItem ? colors.text.DEFAULT : colors.text.light,
          }}
        >
          {selectedItem
            ? selectedItem.title
            : placeholder || t("dropdownBottomSheet.defaultMarket")}
        </Text>

        <Image
          source={require("../../../assets/images/arrow-down.png")}
          className="w-2 h-2"
          resizeMode="contain"
        />
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View
            style={{ backgroundColor: colors.overlay.dark }}
            className="flex-1 justify-end"
          >
            <TouchableWithoutFeedback>
              <View className="px-[24px] bg-white rounded-t-xl max-h-[70%]">
                <View className="pt-[33px] ">
                  <Text className="medium18 text-text">
                    {t("dropdownBottomSheet.markets")}
                  </Text>
                </View>

                <ScrollView>
                  {MOCK_MARKETS.map((item, index) => (
                    <BottomSheetItem
                      key={item.value}
                      title={item.title}
                      value={item.value}
                      isSelected={tempSelectedValue === item.value}
                      onPress={() => handleItemPress(item.value)}
                      isLast={index === MOCK_MARKETS.length - 1}
                    />
                  ))}
                </ScrollView>

                <View className="py-4 mb-11">
                  <Pressable
                    onPress={handleUpdate}
                    className="h-12 rounded items-center justify-center"
                    style={{ backgroundColor: colors.primaryBlue.DEFAULT }}
                  >
                    <Text className="medium16 text-white">
                      {t("dropdownBottomSheet.updateMarket")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
