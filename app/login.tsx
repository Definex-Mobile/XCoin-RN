import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from './src/constants/colors';
import { typography } from './src/constants/typography';

export default function LoginScreen({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      setError('');
      onLogin && onLogin();
    } else {
      setError('Kullanıcı adı ve şifre gereklidir.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XCoin Giriş</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        placeholderTextColor={colors.gray}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor={colors.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#fff',
    padding: 24,
  },
  title: {
    ...typography.h1,
    marginBottom: 32,
    color: colors.primary || '#222',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    borderColor: colors.border || '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: colors.text || '#222',
    ...typography.body,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    backgroundColor: colors.primary || '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    ...typography.button,
  },
  error: {
    color: colors.error || 'red',
    marginBottom: 8,
    ...typography.body,
  },
});
