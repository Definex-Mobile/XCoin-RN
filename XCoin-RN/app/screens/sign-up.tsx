import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../src/hooks/useTranslation';
import { colors } from '../../src/constants/colors';
import XCoinTextInput from '../../src/components/textInput/XCoinTextInput';
import { generateSignUpJwt } from '../../src/services/jwtService';
import * as SecureStore from 'expo-secure-store';

const JWT_TOKEN_KEY = 'xcoin_auth_token';

type SignUpFormErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
};

const nameRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü\s'-]{2,}$/;

const normalizePhone = (value: string): string => {
  if (value.startsWith('+')) {
    return `+${value.slice(1).replace(/\D/g, '')}`.slice(0, 16);
  }

  return value.replace(/\D/g, '').slice(0, 15);
};

const normalizeBirthDate = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 8);

  if (digitsOnly.length <= 2) return digitsOnly;
  if (digitsOnly.length <= 4) return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
};

const isValidBirthDate = (value: string): boolean => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const now = new Date();

  if (year < 1900 || year > now.getFullYear()) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isRealDate && date <= now;
};

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [loading, setLoading] = useState(false);

  const title = useTranslation('signup.title');
  const subtitle = useTranslation('signup.subtitle');
  const firstNameLabel = useTranslation('signup.firstName');
  const lastNameLabel = useTranslation('signup.lastName');
  const phoneLabel = useTranslation('signup.phone');
  const birthDateLabel = useTranslation('signup.birthDate');
  const signUpButton = useTranslation('signup.button');
  const loginText = useTranslation('signup.loginText');
  const loginLink = useTranslation('signup.loginLink');

  const firstNameRequired = useTranslation('signup.errors.firstNameRequired');
  const firstNameInvalid = useTranslation('signup.errors.firstNameInvalid');
  const lastNameRequired = useTranslation('signup.errors.lastNameRequired');
  const lastNameInvalid = useTranslation('signup.errors.lastNameInvalid');
  const phoneRequired = useTranslation('signup.errors.phoneRequired');
  const phoneInvalid = useTranslation('signup.errors.phoneInvalid');
  const birthDateRequired = useTranslation('signup.errors.birthDateRequired');
  const birthDateInvalid = useTranslation('signup.errors.birthDateInvalid');

  const validate = (): boolean => {
    const nextErrors: SignUpFormErrors = {};

    const firstNameTrimmed = firstName.trim();
    const lastNameTrimmed = lastName.trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (!firstNameTrimmed) {
      nextErrors.firstName = firstNameRequired;
    } else if (!nameRegex.test(firstNameTrimmed)) {
      nextErrors.firstName = firstNameInvalid;
    }

    if (!lastNameTrimmed) {
      nextErrors.lastName = lastNameRequired;
    } else if (!nameRegex.test(lastNameTrimmed)) {
      nextErrors.lastName = lastNameInvalid;
    }

    if (!phone.trim()) {
      nextErrors.phone = phoneRequired;
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = phoneInvalid;
    }

    if (!birthDate.trim()) {
      nextErrors.birthDate = birthDateRequired;
    } else if (!isValidBirthDate(birthDate)) {
      nextErrors.birthDate = birthDateInvalid;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const token = await generateSignUpJwt({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        birthDate: birthDate.trim(),
      });

      await SecureStore.setItemAsync(JWT_TOKEN_KEY, token);

      router.replace('/screens/login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace('/screens/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-mainLightBackground" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-12">
            <Text className="bold36 mt-24 text-center text-coin-name mb-2">{title}</Text>
            <Text className="text-lg text-center text-coin-symbol">{subtitle}</Text>
          </View>

          <View className="gap-4">
            <XCoinTextInput
              label={firstNameLabel}
              placeholder="John"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
              }}
              autoCapitalize="words"
              editable={!loading}
              error={errors.firstName}
            />

            <XCoinTextInput
              label={lastNameLabel}
              placeholder="Doe"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
              }}
              autoCapitalize="words"
              editable={!loading}
              error={errors.lastName}
            />

            <XCoinTextInput
              label={phoneLabel}
              placeholder="+905551112233"
              value={phone}
              onChangeText={(text) => {
                setPhone(normalizePhone(text));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              keyboardType="phone-pad"
              editable={!loading}
              error={errors.phone}
            />

            <XCoinTextInput
              label={birthDateLabel}
              placeholder="DD/MM/YYYY"
              value={birthDate}
              onChangeText={(text) => {
                setBirthDate(normalizeBirthDate(text));
                if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: undefined }));
              }}
              keyboardType="number-pad"
              editable={!loading}
              maxLength={10}
              error={errors.birthDate}
            />

            <TouchableOpacity
              className="bg-primaryBlue rounded-lg py-4 mt-2"
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.text.white} />
              ) : (
                <Text className="text-white text-center font-bold text-base">{signUpButton}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-auto mb-8">
            <Text className="text-center text-coin-symbol text-sm">
              {loginText}{' '}
              <Text className="text-primaryBlue font-semibold" onPress={handleGoToLogin}>
                {loginLink}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
