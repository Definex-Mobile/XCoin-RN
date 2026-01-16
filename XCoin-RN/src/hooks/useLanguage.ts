import { useTranslation as useI18nTranslation } from '../constants/i18n';

export const useLanguage = () => {
    const { i18n } = useI18nTranslation();

    const currentLanguage = i18n.language;

    const changeLanguage = (lang: 'tr' | 'en') => {
        i18n.changeLanguage(lang);
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    const isTurkish = i18n.language === 'tr';

    const isEnglish = i18n.language === 'en';

    return {
        currentLanguage,
        changeLanguage,
        toggleLanguage,
        isTurkish,
        isEnglish,
    };
};

