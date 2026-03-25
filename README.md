
# XCoin RN

XCoin RN, Expo ve React Native ile geliştirilmiş, kripto para odaklı bir mobil uygulamadır. Uygulama; splash, giriş, kayıt ol, ana sayfa, market, portföy, ödüller, profil, iletişim ve coin detay akışlarını içerir. Tema, asset, versiyon, bakım ve iletişim verileri config API üzerinden yönetilir.

## Öne Çıkan Özellikler

- Expo tabanlı React Native mimarisi
- Expo Router ile dosya tabanlı yönlendirme
- Light, Dark ve System tema desteği
- Market, portföy, ödüller ve profil akışları
- Coin detay ekranı ve fiyat grafiği
- Firebase Analytics, Messaging ve Crashlytics entegrasyonu
- Push notification ve deep link desteği
- Config API üzerinden dinamik tema ve asset yönetimi
- freeRASP ile temel runtime güvenlik kontrolleri
- Türkçe ve İngilizce dil desteği

## Ekran Görselleri

<table>
  <tr>
    <td align="center">
      <strong>Splash</strong><br /><br />
      <img src="XCoin-RN/docs/screens/splash.png" alt="Splash" width="260" />
    </td>
    <td align="center">
      <strong>Giriş</strong><br /><br />
      <img src="XCoin-RN/docs/screens/sign-in.png" alt="Giriş" width="260" />
    </td>
    <td align="center">
      <strong>Kayıt Ol</strong><br /><br />
      <img src="XCoin-RN/docs/screens/sign-up.png" alt="Kayıt Ol" width="260" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Ana Sayfa</strong><br /><br />
      <img src="XCoin-RN/docs/screens/home.png" alt="Ana Sayfa" width="260" />
    </td>
    <td align="center">
      <strong>Portföy</strong><br /><br />
      <img src="XCoin-RN/docs/screens/portfolio.png" alt="Portföy" width="260" />
    </td>
    <td align="center">
      <strong>Ödüller</strong><br /><br />
      <img src="XCoin-RN/docs/screens/rewards.png" alt="Ödüller" width="260" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Market</strong><br /><br />
      <img src="XCoin-RN/docs/screens/market.png" alt="Market" width="260" />
    </td>
    <td align="center">
      <strong>Coin Detay</strong><br /><br />
      <img src="XCoin-RN/docs/screens/coin-detail.png" alt="Coin Detay" width="260" />
    </td>
    <td align="center">
      <strong>Profil</strong><br /><br />
      <img src="XCoin-RN/docs/screens/profile.png" alt="Profil" width="260" />
    </td>
    <td align="center">
      <strong>İletişim</strong><br /><br />
      <img src="XCoin-RN/docs/screens/contact.png" alt="İletişim" width="260" />
    </td>
  </tr>
</table>

## Teknoloji Yığını

- Expo 54
- React Native 0.81
- React 19
- Expo Router
- TypeScript
- NativeWind
- Firebase Analytics
- Firebase Messaging
- Firebase Crashlytics
- Notifee
- i18next
- react-native-chart-kit

## Proje Yapısı

```text
app/
  _layout.tsx
  index.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    market.tsx
    portfolio.tsx
    rewards.tsx
    profile.tsx
  screens/
    login.tsx
    sign-up.tsx
    contact.tsx
    coin-detail.tsx

src/
  api/
  components/
  constants/
  context/
  hooks/
  services/
  types/
  utils/

assets/
docs/
ios/
android/
```

## Kurulum

### Gereksinimler

- Node.js
- npm
- Xcode
- CocoaPods
- Android Studio

### Bağımlılıkları kur

```bash
npm install
```

### Geliştirme sunucusunu başlat

```bash
npm run start
```

### iOS

```bash
npx pod-install
npm run ios
```

### Android

```bash
npm run android
```

## Scriptler

```bash
npm run start
npm run ios
npm run android
npm run ios:release
npm run android:release
npm run bundle:analyze
npm run firebase-debug:android
npm run firebase-debug:android:off
```

## Konfigürasyon

Uygulama aşağıdaki alanlarda config API kullanır:

- Theme config
- Asset config
- Version config
- Maintenance config
- Contact config

İlgili endpoint tanımları `src/api/endpoints.ts` dosyasında yer alır.

## Notlar

- Tema renkleri runtime sırasında config servisinden gelir.
- Bazı native modüller Expo Go yerine development build gerektirir.
- Firebase yapılandırma dosyaları proje içinde yer alır:
  - `google-services.json`
  - `GoogleService-Info.plist`
- Release scriptleri obfuscation desteğiyle tanımlanmıştır.

## Dil Desteği

- Türkçe
- İngilizce



<div align="center">
  <sub>Crafted with Expo, React Native and by</sub>
  <br />
  <strong>DefineX Mobile Team</strong>
  <br /><br />

  <img src="https://img.shields.io/badge/Expo-54-000000?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/React%20Native-0.81-20232A?logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</div>
