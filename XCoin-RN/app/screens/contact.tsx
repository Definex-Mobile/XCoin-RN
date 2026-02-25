import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getContactInfo } from '../../src/services/contactService';
import { ContactData } from '../../src/types/contact';
import { colors } from '../../src/constants/colors';

export default function ContactScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [contact, setContact] = useState<ContactData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        setLoading(true);
        const data = await getContactInfo();
        setContact(data);
        setLoading(false);
    };

    const handlePress = async (type: 'phone' | 'whatsapp' | 'email' | 'social', value: string) => {
        let url = '';
        switch (type) {
            case 'phone':
                url = `tel:${value.replace(/\s/g, '')}`;
                break;
            case 'whatsapp':
                url = `whatsapp://send?phone=${value.replace(/\s/g, '')}`;
                break;
            case 'email':
                url = `mailto:${value}`;
                break;
            case 'social':
                url = value;
                break;
        }

        if (url) {
            try {
                await Linking.openURL(url);
            } catch (error) {
                console.error(`Error opening URL: ${url}`, error);
                if (type === 'whatsapp') {
                    // Fallback to web whatsapp if app is not installed
                    Linking.openURL(`https://wa.me/${value.replace(/\s/g, '')}`).catch(err => {
                        Alert.alert(t('common.errorTitle'), t('common.error'));
                    });
                } else {
                    Alert.alert(t('common.errorTitle'), t('common.error'));
                }
            }
        }
    };

    const currentLang = i18n.language as 'tr' | 'en' | 'ar';
    const workingHours = contact?.working_hours[currentLang] || contact?.working_hours['en'] || '';

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color={colors.primaryBlue.DEFAULT} />
            </View>
        );
    }

    if (!contact) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-4">
                <Text className="medium18 text-text text-center">{t('common.fetchError')}</Text>
                <TouchableOpacity
                    onPress={fetchContact}
                    className="mt-4 bg-primaryBlue px-6 py-3 rounded-xl"
                >
                    <Text className="bold16 text-white">{t('common.retry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-row items-center px-4 py-2 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Text className="text-primaryBlue text-3xl">←</Text>
                </TouchableOpacity>
                <Text className="bold20 text-text ml-2">{t('contact.title')}</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <Text className="regular16 text-gray-500 mb-8">{t('contact.message')}</Text>

                {/* Contact List */}
                <ContactItem
                    label={t('contact.phone')}
                    value={contact.phone}
                    onPress={() => handlePress('phone', contact.phone)}
                />
                <ContactItem
                    label={t('contact.whatsapp')}
                    value={contact.whatsapp}
                    onPress={() => handlePress('whatsapp', contact.whatsapp)}
                />
                <ContactItem
                    label={t('contact.email')}
                    value={contact.email}
                    onPress={() => handlePress('email', contact.email)}
                />

                <View className="h-[1px] bg-gray-100 my-6" />

                {/* Social Media */}
                <Text className="bold18 text-text mb-4">{t('contact.socialHeader')}</Text>
                <View className="flex-row justify-between mb-8">
                    <SocialButton
                        name="Twitter"
                        onPress={() => handlePress('social', contact.social.twitter)}
                    />
                    <SocialButton
                        name="Instagram"
                        onPress={() => handlePress('social', contact.social.instagram)}
                    />
                    <SocialButton
                        name="Facebook"
                        onPress={() => handlePress('social', contact.social.facebook)}
                    />
                </View>

                <View className="h-[1px] bg-gray-100 my-6" />

                {/* Working Hours */}
                <View className="bg-gray-50 p-6 rounded-2xl mb-12">
                    <Text className="bold18 text-text mb-2">{t('contact.workingHours')}</Text>
                    <Text className="regular16 text-gray-600">{workingHours}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ContactItem({ label, value, onPress }: { label: string, value: string, onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="mb-6"
        >
            <Text className="regular14 text-gray-400 mb-1">{label}</Text>
            <Text className="medium18 text-primaryBlue">{value}</Text>
        </TouchableOpacity>
    );
}

function SocialButton({ name, onPress }: { name: string, onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-gray-100 px-4 py-3 rounded-xl flex-1 mx-1 items-center"
        >
            <Text className="medium14 text-text">{name}</Text>
        </TouchableOpacity>
    );
}
