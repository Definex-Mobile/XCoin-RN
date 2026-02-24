import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../src/hooks/useTranslation';
import { colors } from '../../src/constants/colors';
import XCoinTextInput from '../../src/components/textInput/XCoinTextInput';
import { generateSignUpJwt } from '../../src/services/jwtService';
import { saveUserInfo } from '../../src/services/userInfoStorage';
import type { UserInfo } from '../../src/types/userInfo';
import * as SecureStore from 'expo-secure-store';

const JWT_TOKEN_KEY = 'xcoin_auth_token';
const SIGN_UP_FIELD_COUNT = 8;
const DEFAULT_COUNTRY_CODE = '90';
const MAX_COUNTRY_CODE_LENGTH = 4;
const MAX_PHONE_NUMBER_LENGTH = 15;
const DEFAULT_SESSION_CODE = 'secure-code-base64';
const DEFAULT_EXPIRATION_DATE = 7425783568;

type SignUpFormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  birthDate?: string;
};

const nameRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü\s'-]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const normalizeCountryCode = (value: string): string =>
  value.replace(/\D/g, '').slice(0, MAX_COUNTRY_CODE_LENGTH);

const normalizePhoneNumber = (value: string): string =>
  value.replace(/\D/g, '').slice(0, MAX_PHONE_NUMBER_LENGTH);

const buildFullPhoneNumber = (countryCode: string, phoneNumber: string): string =>
  `+${normalizeCountryCode(countryCode)}${normalizePhoneNumber(phoneNumber)}`;

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

const formatBirthDateForStorage = (value: string): string => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return value;
  }

  const [, day, month, year] = match;
  return `${year}-${month}-${day}T00:00:00Z`;
};

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const title = useTranslation('signup.title');
  const subtitle = useTranslation('signup.subtitle');
  const firstNameLabel = useTranslation('signup.firstName');
  const lastNameLabel = useTranslation('signup.lastName');
  const emailLabel = useTranslation('signup.email');
  const passwordLabel = useTranslation('signup.password');
  const confirmPasswordLabel = useTranslation('signup.confirmPassword');
  const phoneLabel = useTranslation('signup.phone');
  const birthDateLabel = useTranslation('signup.birthDate');
  const signUpButton = useTranslation('signup.button');
  const loginText = useTranslation('signup.loginText');
  const loginLink = useTranslation('signup.loginLink');
  const signUpSuccessTitle = useTranslation('signup.success.title');
  const signUpSuccessSubtitle = useTranslation('signup.success.subtitle');
  const signUpSuccessButton = useTranslation('signup.success.button');

  const firstNameRequired = useTranslation('signup.errors.firstNameRequired');
  const firstNameInvalid = useTranslation('signup.errors.firstNameInvalid');
  const lastNameRequired = useTranslation('signup.errors.lastNameRequired');
  const lastNameInvalid = useTranslation('signup.errors.lastNameInvalid');
  const emailRequired = useTranslation('signup.errors.emailRequired');
  const emailInvalid = useTranslation('signup.errors.emailInvalid');
  const passwordRequired = useTranslation('signup.errors.passwordRequired');
  const passwordInvalid = useTranslation('signup.errors.passwordInvalid');
  const confirmPasswordRequired = useTranslation('signup.errors.confirmPasswordRequired');
  const confirmPasswordMismatch = useTranslation('signup.errors.confirmPasswordMismatch');
  const phoneRequired = useTranslation('signup.errors.phoneRequired');
  const phoneInvalid = useTranslation('signup.errors.phoneInvalid');
  const birthDateRequired = useTranslation('signup.errors.birthDateRequired');
  const birthDateInvalid = useTranslation('signup.errors.birthDateInvalid');

  const focusInput = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(SIGN_UP_FIELD_COUNT - 1, index));
    const targetInput = inputRefs.current[boundedIndex];

    if (!targetInput) {
      return;
    }

    setTimeout(() => {
      targetInput.focus();
    }, 0);
  };

  const validate = (): boolean => {
    const nextErrors: SignUpFormErrors = {};

    const firstNameTrimmed = firstName.trim();
    const lastNameTrimmed = lastName.trim();
    const emailTrimmed = email.trim();
    const countryCodeDigits = normalizeCountryCode(countryCode);
    const phoneDigits = normalizePhoneNumber(phoneNumber);
    const fullPhoneDigits = `${countryCodeDigits}${phoneDigits}`;

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

    if (!emailTrimmed) {
      nextErrors.email = emailRequired;
    } else if (!emailRegex.test(emailTrimmed)) {
      nextErrors.email = emailInvalid;
    }

    if (!password.trim()) {
      nextErrors.password = passwordRequired;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = passwordInvalid;
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = confirmPasswordRequired;
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = confirmPasswordMismatch;
    }

    if (!countryCodeDigits || !phoneDigits) {
      nextErrors.phone = phoneRequired;
    } else if (fullPhoneDigits.length < 10 || fullPhoneDigits.length > 15) {
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
      const normalizedCountryCode = normalizeCountryCode(countryCode);
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      const fullPhoneNumber = buildFullPhoneNumber(normalizedCountryCode, normalizedPhoneNumber);
      const formattedBirthDate = formatBirthDateForStorage(birthDate.trim());

      const token = await generateSignUpJwt({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: fullPhoneNumber,
        birthDate: formattedBirthDate,
      });

      await SecureStore.setItemAsync(JWT_TOKEN_KEY, token);

      const userInfo: UserInfo = {
        name: firstName.trim(),
        surname: lastName.trim(),
        email: email.trim(),
        password,
        birthDate: formattedBirthDate,
        phoneNumber: fullPhoneNumber,
        countryCode: `+${normalizedCountryCode}`,
        sessionCode: DEFAULT_SESSION_CODE,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        token,
        lastLoginDate: new Date().toISOString(),
        isActive: false,
      };
      const isSaved = await saveUserInfo(userInfo);
      if (!isSaved) {
        console.warn('User info could not be persisted in secure storage');
      }

      Keyboard.dismiss();
      setShowSuccessScreen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace('/screens/login');
  };

  if (showSuccessScreen) {
    return (
      <SafeAreaView className="flex-1 bg-mainLightBackground" edges={['top', 'bottom']}>
        <View className="flex-1 justify-center px-6">
          <View className="bg-white rounded-2xl px-6 py-8 border border-border-light">
            <Text className="bold36 text-center text-coin-name mb-3">{signUpSuccessTitle}</Text>
            <Text className="text-base text-center text-coin-symbol mb-8">{signUpSuccessSubtitle}</Text>

            <TouchableOpacity
              className="bg-primaryBlue rounded-lg py-4"
              onPress={handleGoToLogin}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-base">{signUpSuccessButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-mainLightBackground" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            <View className="mb-8 mt-8">
              <Text className="bold36 text-center text-coin-name mb-2">{title}</Text>
              <Text className="text-lg text-center text-coin-symbol">{subtitle}</Text>
            </View>

            <View className="gap-4">
              <XCoinTextInput
                ref={(ref) => {
                  inputRefs.current[0] = ref;
                }}
                label={firstNameLabel}
                placeholder="John"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
                onSubmitEditing={() => focusInput(1)}
                returnKeyType="next"
                autoCapitalize="words"
                editable={!loading}
                error={errors.firstName}
              />

              <XCoinTextInput
                ref={(ref) => {
                  inputRefs.current[1] = ref;
                }}
                label={lastNameLabel}
                placeholder="Doe"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
                onSubmitEditing={() => focusInput(2)}
                returnKeyType="next"
                autoCapitalize="words"
                editable={!loading}
                error={errors.lastName}
              />

              <XCoinTextInput
                ref={(ref) => {
                  inputRefs.current[2] = ref;
                }}
                label={emailLabel}
                placeholder="example@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onSubmitEditing={() => focusInput(3)}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                error={errors.email}
              />

              <XCoinTextInput
                ref={(ref) => {
                  inputRefs.current[3] = ref;
                }}
                label={passwordLabel}
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                onSubmitEditing={() => focusInput(4)}
                returnKeyType="next"
                secureTextEntry
                editable={!loading}
                error={errors.password}
              />

              <XCoinTextInput
                ref={(ref) => {
                  inputRefs.current[4] = ref;
                }}
                label={confirmPasswordLabel}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                onSubmitEditing={() => focusInput(5)}
                returnKeyType="next"
                secureTextEntry
                editable={!loading}
                error={errors.confirmPassword}
              />

              <View>
                <Text className="text-sm font-semibold text-coin-name mb-2">{phoneLabel}</Text>
                <View className="bg-white border border-border-light rounded-lg px-4 py-3 flex-row items-center">
                  <View className="flex-row items-center min-w-16">
                    <Text className="text-coin-price text-base leading-5 mr-1">+</Text>
                    <TextInput
                      ref={(ref) => {
                        inputRefs.current[5] = ref;
                      }}
                      className="text-coin-price text-base leading-5 min-w-10"
                      placeholder="90"
                      placeholderTextColor={colors.text.light}
                      value={countryCode}
                      onChangeText={(text) => {
                        setCountryCode(normalizeCountryCode(text));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      onSubmitEditing={() => focusInput(6)}
                      returnKeyType="next"
                      keyboardType="number-pad"
                      editable={!loading}
                      maxLength={MAX_COUNTRY_CODE_LENGTH}
                      style={{ paddingVertical: 0, marginVertical: 0, height: 20 }}
                    />
                  </View>

                  <View className="w-px h-6 bg-border-light mx-3" />

                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[6] = ref;
                    }}
                    className="flex-1 text-coin-price text-base"
                    placeholder="5551112233"
                    placeholderTextColor={colors.text.light}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(normalizePhoneNumber(text));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    onSubmitEditing={() => focusInput(7)}
                    returnKeyType="next"
                    keyboardType="number-pad"
                    editable={!loading}
                    maxLength={MAX_PHONE_NUMBER_LENGTH}
                  />
                </View>
                {errors.phone ? (
                  <Text className="text-error text-xs font-medium mt-1">{errors.phone}</Text>
                ) : null}
              </View>

              <XCoinTextInput
                ref={(ref) => {
                  inputRefs.current[7] = ref;
                }}
                label={birthDateLabel}
                placeholder="DD/MM/YYYY"
                value={birthDate}
                onChangeText={(text) => {
                  setBirthDate(normalizeBirthDate(text));
                  if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: undefined }));
                }}
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="done"
                blurOnSubmit
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

            <View className="mt-8">
              <Text className="text-center text-coin-symbol text-sm">
                {loginText}{' '}
                <Text className="text-primaryBlue font-semibold" onPress={handleGoToLogin}>
                  {loginLink}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
