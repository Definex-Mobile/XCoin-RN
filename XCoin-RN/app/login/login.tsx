import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { useTranslation } from '../../src/hooks/useTranslation';
import { colors } from '../../src/constants/colors';
import XCoinTextInput from '../../src/components/XCoinTextInput';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRequired = useTranslation('login.errors.emailRequired');
  const passwordRequired = useTranslation('login.errors.passwordRequired');
  const emailInvalid = useTranslation('login.errors.emailInvalid');
  const loginFailed = useTranslation('login.errors.loginFailed');
  const loginTitle = useTranslation('login.title');
  const loginSubtitle = useTranslation('login.subtitle');
  const emailLabel = useTranslation('login.email');
  const passwordLabel = useTranslation('login.password');
  const loginButton = useTranslation('login.button');
  const signupText = useTranslation('login.signupText');
  const signupLink = useTranslation('login.signupLink');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email.trim()) {
      setError(emailRequired);
      return;
    }
    if (!password.trim()) {
      setError(passwordRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(emailInvalid);
      return;
    }

    setLoading(true);
    setError('');

    try {
      setTimeout(() => {
        login();
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(loginFailed);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-mainLightBackground" edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-12">
            <Text className="text-4xl mt-24 text-center font-bold text-coin-name mb-2">{loginTitle}</Text>
            <Text className="text-lg text-center text-coin-symbol">{loginSubtitle}</Text>
          </View>

          <View className="gap-4">
            <XCoinTextInput
              label={emailLabel}
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />


            <XCoinTextInput
              label={passwordLabel}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!loading}
            />

            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-error text-sm font-medium">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              className="bg-primaryBlue rounded-lg py-4 mt-2"
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>

              {loading ? (
                <ActivityIndicator color={colors.text.white} />
              ) : (
                <Text className="text-white text-center font-bold text-base">{loginButton}</Text>
              )}

            </TouchableOpacity>
          </View>

          <View className="mt-auto mb-8">
            <Text className="text-center text-coin-symbol text-sm">
              {signupText}{' '}
              <Text className="text-primaryBlue font-semibold">{signupLink}</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
