# Code Obfuscation Documentation

## Overview

XCoin-RN projesi, JavaScript kodunu korumak için **obfuscator-io-metro-plugin** kullanır. Bu dokümantasyon obfuscation'ın nasıl çalıştığını ve nasıl yönetileceğini açıklar.

## Obfuscation Nedir?

Code obfuscation, JavaScript kodunu okunamaz ve reverse-engineer edilmesi zor hale getiren bir güvenlik tekniğidir. Aşağıdaki teknikleri kullanır:

- **String Encryption**: API URL'leri ve hassas string'leri base64 ile şifreler
- **Variable Renaming**: `baseUrl` → `_0x1a2b3c` gibi anlamsız isimler
- **Control Flow Flattening**: Kod akışını karmaşıklaştırır
- **Dead Code Injection**: Sahte kod ekleyerek analizi zorlaştırır

## Ne Zaman Aktif?

| Build Type | Obfuscation | Açıklama |
|------------|-------------|----------|
| Debug | ❌ Kapalı | Hızlı build, okunabilir kod |
| Release | ✅ Açık | Production için güvenli kod |

## Kullanım

### Debug Build (Obfuscation Kapalı)
```bash
npm start
# veya
npm run android
npm run ios
```

### Release Build (Obfuscation Açık)
```bash
npm run android:release
npm run ios:release
```

### Manuel Obfuscation Toggle
```bash
# Obfuscation'ı debug build'de de açmak için:
OBFUSCATE=true npm start

# Obfuscation'ı release build'de kapatmak için:
OBFUSCATE=false npm run android:release
```

## Konfigürasyon

### Obfuscation Ayarları
Dosya: `obfuscation.config.js`

```javascript
{
  controlFlowFlattening: true,        // Kod akışını karıştır
  controlFlowFlatteningThreshold: 0.75, // %75 oranında uygula
  deadCodeInjection: true,            // Sahte kod ekle
  deadCodeInjectionThreshold: 0.4,    // %40 sahte kod
  stringArrayEncoding: ['base64'],    // String'leri şifrele
  // ...
}
```

**Ayarları değiştirmek için**: `obfuscation.config.js` dosyasını düzenleyin.

### Android ProGuard
Dosya: `android/app/proguard-rules.pro`

ProGuard, native Java/Kotlin kodunu minify eder. Keep rules ile hangi sınıfların korunacağını belirtiyoruz:

```proguard
-keep class com.facebook.hermes.** { *; }
-keep class com.google.firebase.** { *; }
-keep class expo.modules.** { *; }
```

## Bundle Analizi

Obfuscation'ın çalıştığını doğrulamak için:

```bash
npm run bundle:analyze
```

Bu komut `bundle-output.js` dosyası oluşturur. İçeriğini kontrol edin:

```bash
head -c 2000 bundle-output.js
```

**Beklenen**: Değişken isimleri `_0x...` formatında, string'ler base64 encoded.

## Sorun Giderme

### Build Süresi Çok Uzun

Obfuscation build süresini 2-3x artırabilir. Eğer bu problem ise:

1. `obfuscation.config.js` dosyasında threshold değerlerini düşürün:
```javascript
controlFlowFlatteningThreshold: 0.5,  // 0.75'ten düşür
deadCodeInjectionThreshold: 0.2,      // 0.4'ten düşür
```

### Release Build Crash Oluyor

Bazı aggressive obfuscation teknikleri Hermes ile uyumsuz olabilir:

1. `obfuscation.config.js` dosyasında şunları kapatın:
```javascript
debugProtection: false,
selfDefending: false,
```

2. Eğer hala crash oluyorsa, dead code injection'ı kapatın:
```javascript
deadCodeInjection: false,
```

### Metro Bundler Hatası

Eğer Metro bundler obfuscation plugin'i bulamazsa:

```bash
# node_modules'u temizle ve yeniden yükle
rm -rf node_modules
npm install
```

### ProGuard Hatası

Eğer Android build'de ProGuard hatası alıyorsanız:

1. `android/app/proguard-rules.pro` dosyasına ilgili keep rule'u ekleyin
2. Veya geçici olarak ProGuard'ı kapatın:
```bash
# android/gradle.properties dosyasına ekle
android.enableMinifyInReleaseBuilds=false
```

## Güvenlik Notları

### Obfuscation != Tam Güvenlik

Obfuscation kod okumayı zorlaştırır ama **imkansız hale getirmez**. Hassas bilgiler için:

- ✅ API key'leri backend'de tutun
- ✅ Firebase Security Rules kullanın
- ✅ SSL Pinning ekleyin
- ❌ Kritik secret'ları JS kodunda saklamayın

### Firebase Config Dosyaları

`GoogleService-Info.plist` ve `google-services.json` dosyaları **obfuscate edilmez** (native tarafta). Bu normal bir durumdur - Firebase Security Rules ile korunurlar.

## Dosya Yapısı

```
XCoin-RN/
├── obfuscation.config.js          # Obfuscation ayarları
├── metro.config.js                # Metro + obfuscation entegrasyonu
├── android/
│   └── app/
│       ├── build.gradle           # ProGuard aktif
│       └── proguard-rules.pro     # Keep rules
└── package.json                   # Release scripts
```

## Referanslar

- [obfuscator-io-metro-plugin](https://github.com/javascript-obfuscator/obfuscator-io-metro-plugin)
- [JavaScript Obfuscator Options](https://github.com/javascript-obfuscator/javascript-obfuscator#options)
- [Android ProGuard](https://developer.android.com/build/shrink-code)
- [Hermes Engine](https://hermesengine.dev/)
