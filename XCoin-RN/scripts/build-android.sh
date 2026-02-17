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

    # 2. Expo Prebuild (Android klasörünü oluştur)
    log "Expo Prebuild çalıştırılıyor..."
    npx expo prebuild --platform android --no-install

    # 3. ABI Filtreleme — Sadece arm64-v8a için derle (build süresini ~%75 azaltır)
    log "ABI filtresi uygulanıyor (sadece arm64-v8a)..."
    if ! grep -q "reactNativeArchitectures" android/gradle.properties 2>/dev/null; then
        echo "" >> android/gradle.properties
        echo "# CI Optimization: Sadece arm64-v8a derle" >> android/gradle.properties
        echo "reactNativeArchitectures=arm64-v8a" >> android/gradle.properties
    fi

    # 4. Android build dizinine gir
    cd android

    # 5. Bellek dostu Gradle Build
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

    DISTRIBUTE_ARGS=(
        "$APK_PATH"
        "--app" "$FIREBASE_APP_ID_ANDROID"
        "--token" "$FIREBASE_TOKEN"
        "--release-notes" "Jenkins tarafından otomatik yüklenen sürüm."
    )

    # Tester grubu tanımlıysa ekle
    if [ -n "$FIREBASE_TESTER_GROUP" ]; then
        DISTRIBUTE_ARGS+=("--groups" "$FIREBASE_TESTER_GROUP")
    fi

    npx firebase-tools appdistribution:distribute "${DISTRIBUTE_ARGS[@]}" || fail "Firebase yüklemesi başarısız!"
        
    log "✅ Firebase App Distribution tamamlandı!"
}

bump_version() {
    log "Version bilgileri güncelleniyor..."
    node "$(dirname "$0")/bump-version.js"
    
    git config user.email "jenkins-bot@definex.com"
    git config user.name "Jenkins Bot"
    git add app.json
    git commit -m "chore(version): bump version [ci skip]" || echo "Değişiklik yok."
}

push_version() {
    log "Değişiklikler repoya pushlanıyor..."
    
    # Jenkins'ten gelen GIT_AUTH_TOKEN veya benzeri bir değişkeni kullanabiliriz
    # Veya URL zaten authenticated olabilir.
    
    CLEAN_BRANCH=${GIT_BRANCH#origin/}
    TARGET_BRANCH=${CLEAN_BRANCH:-feature/jenkins-setup}

    log "Pushing to: $TARGET_BRANCH"
    
    # Çakışmaları önlemek için rebase pull
    if [[ -n "$GIT_TOKEN" ]]; then
        REMOTE_URL=$(git remote get-url origin | sed -E "s|https://([^@]+@)?|https://$GIT_TOKEN@|")
        git pull --rebase "$REMOTE_URL" "$TARGET_BRANCH" || log "Rebase failed"
        git push "$REMOTE_URL" HEAD:refs/heads/"$TARGET_BRANCH" || fail "Git push başarısız!"
    else
        git pull --rebase origin "$TARGET_BRANCH" || log "Rebase failed"
        git push origin HEAD:refs/heads/"$TARGET_BRANCH" || log "Push başarısız olabilir (yetki yoksa)"
    fi
}

# Komut kontrolü
case "$1" in
    bump) bump_version ;;
    build) build_apk ;;
    upload) upload_firebase ;;
    push) push_version ;;
    *) echo "Kullanım: $0 {bump|build|upload|push}" ;;
esac
