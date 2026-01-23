export interface ProfileButtonData {
  id: string;
  titleKey: string; // i18n translation key
  icon: {
    viewBox: string;
    path: string;
  };
  onPress: () => void;
}
