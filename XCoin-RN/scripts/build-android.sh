#!/bin/bash

# Hata durumunda scripti durdur
set -e

# Renkli loglar için fonksiyonlar
log() { echo -e "\n\033[1;34m▶️  $1\033[0m"; }
fail() { echo -e "\n\033[1;31m❌ $1\033[0m"; exit 1; }

# Proje dizinine gel
cd "$(dirname "$0")/.."

build_apk() {
    log "React Native (Expo) Build Süreci Başlıyor..."

    # 1. Bağımlılıkları kontrol et
    if [ ! -d "node_modules" ]; then
        log "node_modules bulunamadı, yükleniyor..."
        npm install
    fi

    # 2. Expo Prebuild (Android klasörünü sıfırdan oluştur)
    log "Expo Prebuild çalıştırılıyor..."
    npx expo prebuild --platform android --no-install --clean

    # 3. Android build dizinine gir
    cd android

    # 4. Bellek dostu Gradle Build
    log "Gradle Build Başlatılıyor (Release APK)..."
    ./gradlew --stop || true

    GRADLE_ARGS=(
        "assembleRelease"
        "--build-cache"
        "--parallel"
        "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx3584m -XX:MaxMetaspaceSize=512m"
        "-Pkotlin.compiler.execution.strategy=in-process"
        "-x" "lint"
        "-x" "lintVitalAnalyzeRelease"
        "-x" "test"
    )

    ./gradlew "${GRADLE_ARGS[@]}" || fail "Gradle Build başarısız oldu!"

    log "✅ Build Başarıyla Tamamlandı!"

    # APK'yı çıktı klasörüne kopyala
    mkdir -p ../build-output
    cp app/build/outputs/apk/release/app-release.apk ../build-output/XCoin-Release.apk
    cd ..
}

upload_firebase() {
    log "Firebase App Distribution Yüklemesi Başlıyor..."
    
    if [ -z "$FIREBASE_APP_ID_ANDROID" ]; then
        fail "FIREBASE_APP_ID_ANDROID tanımlı değil!"
    fi

    if [ -z "$FIREBASE_TOKEN" ]; then
        fail "FIREBASE_TOKEN tanımlı değil! 'npx firebase-tools login:ci' komutuyla token oluşturun."
    fi

    APK_PATH="./build-output/XCoin-Release.apk"
    
    npx firebase-tools appdistribution:distribute "$APK_PATH" \
        --app "$FIREBASE_APP_ID_ANDROID" \
        --token "$FIREBASE_TOKEN" \
        --groups "tester-group" \
        --release-notes "Jenkins tarafından otomatik yüklenen sürüm." || fail "Firebase yüklemesi başarısız!"
        
    log "✅ Firebase App Distribution tamamlandı!"
}

# Komut kontrolü
case "$1" in
    build) build_apk ;;
    upload) upload_firebase ;;
    *) echo "Kullanım: $0 {build|upload}" ;;
esac
