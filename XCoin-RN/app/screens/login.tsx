import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useTheme } from '../../src/context/ThemeContext';
import XCoinTextInput from '../../src/components/textInput/XCoinTextInput';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const emailRequired = t('login.errors.emailRequired');
  const passwordRequired = t('login.errors.passwordRequired');
  const emailInvalid = t('login.errors.emailInvalid');
  const loginFailed = t('login.errors.loginFailed');
  const loginTitle = t('login.title');
  const loginSubtitle = t('login.subtitle');
  const emailLabel = t('login.email');
  const passwordLabel = t('login.password');
  const loginButton = t('login.button');
  const signupText = t('login.signupText');
  const signupLink = t('login.signupLink');
  const { activeScheme } = useTheme();

  const handleNavigateToSignUp = () => {
    router.push('/screens/sign-up');
  };

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await login({
        email: email.trim(),
        password,
        lastLoginDate: new Date().toISOString(),
      });
      router.replace('/(tabs)');
    } catch (err) {
      setError(loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-12">
            <Text className="text-4xl mt-24 text-center font-bold text-onSurface mb-2">{loginTitle}</Text>
            <Text className="text-lg text-center text-onSurfaceVariant">{loginSubtitle}</Text>
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
              <View className="bg-errorContainer border border-outlineVariant rounded-lg p-3">
                <Text className="text-error text-sm font-medium">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              className="bg-primary rounded-lg py-4 mt-2"
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>

              {loading ? (
                <ActivityIndicator color={activeScheme?.onPrimary} />
              ) : (
                <Text className="text-onPrimary text-center font-bold text-base">{loginButton}</Text>
              )}

            </TouchableOpacity>
          </View>

          <View className="mt-auto mb-8">
            <Text className="text-center text-onSurfaceVariant text-sm">
              {signupText}{' '}
              <Text className="text-primary font-semibold" onPress={handleNavigateToSignUp}>
                {signupLink}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
