import { useTranslation as useI18nTranslation } from '../constants/i18n';

export const useTranslation = (key: string): string => {
    const { t } = useI18nTranslation();
    return t(key);
};

