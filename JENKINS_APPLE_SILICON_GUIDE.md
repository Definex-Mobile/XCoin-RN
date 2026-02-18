# Professional Android CI/CD Kurulum ve Bakım Rehberi (UAB & XCoin)

**Platform:** Apple Silicon (ARM64) | **Altyapı:** Docker + Jenkins + openfortivpn
**Desteklenen Teknolojiler:** Native Android (Java/Kotlin) & React Native (Expo/Bare)

Bu doküman, Docker üzerinde çalışan Jenkins ile Android projeleri için otomatik build, versiyonlama ve Firebase App Distribution entegrasyonu süreçlerini kapsar. Sistem, Apple Silicon (M1/M2/M3) mimarisi için optimize edilmiştir.

---

## 🛠 1. Apple Silicon & Performans Optimizasyonları

### Mimari Uyumsuzluğu (Rosetta 2)

- **Sorun:** Android build araçları (AAPT2 vb.) ARM64 container içinde çöküyor.
- **Çözüm:** Container **x86_64 (amd64)** mimarisinde çalışmaya zorlandı. Rosetta 2 üzerinden emülasyon ile %100 uyumluluk sağlanır.
- **Dockerfile:** `FROM --platform=linux/amd64 jenkins/jenkins:lts`

### OOM (Out of Memory) ve Swap Yönetimi

- **Sorun:** Gradle build işlemleri yüksek RAM tüketir ve container'ı kilitler.
- **Çözüm:** Docker Desktop RAM limiti **8GB** olmalıdır. Scriptlerde **`./gradlew --stop`** kullanılarak bellek anında boşaltılır.

### Dosya İzleme (Watch FS) Hatası

- **Sorun:** `NativeException: Couldn't poll for events` hatası.
- **Çözüm:** Gradle komutuna **`--no-watch-fs`** eklenerek dosya izleme yükü kaldırılır.

---

## 📂 2. Teknik Dosyalar (Tam İçerik)

### A. Dockerfile

```dockerfile
FROM --platform=linux/amd64 jenkins/jenkins:lts

ARG JAVA_VERSION=17
USER root

RUN apt-get update && \
    apt-get install -y curl unzip wget python3 python3-pip openfortivpn sudo iproute2 iputils-ping net-tools nano vim && \
    apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g firebase-tools

RUN echo "jenkins ALL=(ALL) NOPASSWD: /usr/bin/openfortivpn" >> /etc/sudoers && \
    apt-get update && apt-get install -y temurin-${JAVA_VERSION}-jdk

ENV JAVA_HOME=/usr/lib/jvm/temurin-${JAVA_VERSION}-jdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${JAVA_HOME}/bin:${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx2560m -Dfile.encoding=UTF-8"
ENV JAVA_OPTS="-Xmx1536m"

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER jenkins
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

### B. entrypoint.sh

```bash
#!/bin/bash
VPN_CONFIG="/tmp/vpn.conf"
VPN_LOG="/var/jenkins_home/vpn.log"

cat <<EOF > "$VPN_CONFIG"
host = 212.154.18.150
port = 4043
username = server
password = 124578as
trusted-cert = 0016a1de2ab5f4c6937e588e495d7033e5a550e5541c5c89941c55f328259dc7
set-dns = 0
pppd-use-peerdns = 0
insecure-ssl = 1
EOF

(
    while true; do
        sudo openfortivpn -c "$VPN_CONFIG" >> "$VPN_LOG" 2>&1
        sleep 10
    done
) &

exec /usr/bin/tini -- /usr/local/bin/jenkins.sh
```

### C. Build Script (XCoin-RN / React Native)

```bash
#!/bin/bash
set -e
log() { echo -e "\n\033[1;34m▶️  $1\033[0m"; }
fail() { echo -e "\n\033[1;31m❌ $1\033[0m"; exit 1; }

cd "$(dirname "$0")/.."

build_apk() {
    log "React Native (Expo) Build Süreci Başlıyor..."
    if [ ! -d "node_modules" ]; then
        log "node_modules bulunamadı, yükleniyor..."
        npm install
    fi
    log "Expo Prebuild çalıştırılıyor..."
    npx expo prebuild --platform android --no-install
    log "ABI filtresi uygulanıyor (sadece arm64-v8a)..."
    if ! grep -q "reactNativeArchitectures" android/gradle.properties 2>/dev/null; then
        echo "" >> android/gradle.properties
        echo "# CI Optimization: Sadece arm64-v8a derle" >> android/gradle.properties
        echo "reactNativeArchitectures=arm64-v8a" >> android/gradle.properties
    fi
    cd android
    log "Gradle Build Başlatılıyor (Release APK)..."
    ./gradlew --stop || true
    GRADLE_ARGS=(
        "assembleRelease"
        "--build-cache"
        "--parallel"
        "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx2560m -XX:MaxMetaspaceSize=512m"
        "-Pkotlin.compiler.execution.strategy=in-process"
        "-x" "lint"
        "-x" "lintVitalAnalyzeRelease"
        "-x" "test"
    )
    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Gradle Build başarısız oldu!"; }
    ./gradlew --stop
    log "✅ Build Başarıyla Tamamlandı!"
    mkdir -p ../build-output
    cp app/build/outputs/apk/release/app-release.apk ../build-output/XCoin-Release.apk
    cd ..
}

upload_firebase() {
    log "Firebase App Distribution Yüklemesi Başlıyor..."
    if [ -z "$FIREBASE_APP_ID_ANDROID" ]; then fail "FIREBASE_APP_ID_ANDROID tanımlı değil!"; fi
    if [ -z "$FIREBASE_TOKEN" ]; then fail "FIREBASE_TOKEN tanımlı değil!"; fi
    APK_PATH="./build-output/XCoin-Release.apk"
    DISTRIBUTE_ARGS=("$APK_PATH" "--app" "$FIREBASE_APP_ID_ANDROID" "--token" "$FIREBASE_TOKEN" "--release-notes" "Jenkins automated release.")
    if [ -n "$FIREBASE_TESTER_GROUP" ]; then DISTRIBUTE_ARGS+=("--groups" "$FIREBASE_TESTER_GROUP"); fi
    npx firebase-tools appdistribution:distribute "${DISTRIBUTE_ARGS[@]}" || fail "Firebase yüklemesi başarısız!"
}

bump_version() {
    log "Version bilgileri okununuyor ve güncelleniyor (app.json)..."
    node -e "
        const fs = require('fs');
        const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
        const parts = appJson.expo.version.split('.');
        parts[2] = parseInt(parts[2]) + 1;
        appJson.expo.version = parts.join('.');
        if (!appJson.expo.android) appJson.expo.android = {};
        appJson.expo.android.versionCode = (appJson.expo.android.versionCode || 0) + 1;
        fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2) + '\n');
    "
    git config user.email "jenkins-bot@definex.com"
    git config user.name "Jenkins Bot"
    git add app.json
    git commit -m "chore(version): bump version to $(grep 'version' app.json | head -1 | awk -F'\"' '{print $4}') [ci skip]" || true
}

push_version() {
    CLEAN_BRANCH=${GIT_BRANCH#origin/}
    TARGET_BRANCH=${CLEAN_BRANCH:-feature/jenkins-setup}
    REMOTE_URL=$(git remote get-url origin | sed -E "s|https://([^@]+@)?|https://$GIT_TOKEN@|")
    git pull --rebase "$REMOTE_URL" "$TARGET_BRANCH"
    git push "$REMOTE_URL" HEAD:refs/heads/"$TARGET_BRANCH"
}

case "$1" in
    bump) bump_version ;;
    build) build_apk ;;
    upload) upload_firebase ;;
    push) push_version ;;
esac
```

### D. Build Script (uab-android / Native)

```bash
#!/bin/bash
set -e
log()  { echo "▶️  $1"; }
ok()   { echo "✅ $1"; }
fail() { echo "❌ $1"; exit 1; }

if [[ "$OSTYPE" == "darwin"* ]]; then SED_INPLACE=(-i ''); else SED_INPLACE=(-i); fi

bump_version() {
    log "Version bilgileri okunuyor..."
    APP_GRADLE_FILE=$(grep -rl "com.android.application" . --include "build.gradle*" | head -n1)
    CURRENT_CODE=$(grep -E "versionCode[[:space:]]+[0-9]+" "$APP_GRADLE_FILE" | grep -o '[0-9]\+' | head -n1)
    CURRENT_NAME=$(grep -E 'versionName[[:space:]]+"[0-9]+\.[0-9]+\.[0-9]+"' "$APP_GRADLE_FILE" | sed -E 's/.*"([^"]+)".*/\1/' | head -n1)
    IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_NAME"
    NEW_CODE=$((CURRENT_CODE + 1))
    NEW_NAME="$MAJOR.$MINOR.$((PATCH + 1))"
    sed "${SED_INPLACE[@]}" -E "s/versionCode[[:space:]]+$CURRENT_CODE/versionCode $NEW_CODE/" "$APP_GRADLE_FILE"
    sed "${SED_INPLACE[@]}" -E "s/versionName[[:space:]]+\"$CURRENT_NAME\"/versionName \"$NEW_NAME\"/" "$APP_GRADLE_FILE"
    git config user.email "jenkins-bot@uab.com"
    git config user.name "Jenkins Bot"
    git add "$APP_GRADLE_FILE"
    git commit -m "chore(version): bump to $NEW_NAME ($NEW_CODE) [ci skip]" || true
}

build_apk() {
    VARIANT=${1:-"dev"}
    VARIANT_CAP=$(echo "$VARIANT" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
    ./gradlew --stop || true
    GRADLE_ARGS=(
        "assemble${VARIANT_CAP}Release"
        "--build-cache" "--parallel" "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx2560m"
        "-Pkotlin.compiler.execution.strategy=in-process"
        "-x" "lint" "-x" "test"
    )
    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Build failed!"; }
    ./gradlew --stop
    mkdir -p "$OUTPUT_DIR"
    APK_PATH=$(find . -path "*outputs/apk/${VARIANT}/release*" -name "*.apk" | head -n1)
    cp "$APK_PATH" "$OUTPUT_DIR"
}

push_version() {
    REMOTE_URL=$(git remote get-url origin | sed -E "s|http://([^@]+@)?|http://$GIT_CREDENTIALS_USR:$GIT_CREDENTIALS_PSW@|")
    CLEAN_BRANCH=${GIT_BRANCH#origin/}
    git pull --rebase "$REMOTE_URL" "$CLEAN_BRANCH"
    git push "$REMOTE_URL" HEAD:refs/heads/"$CLEAN_BRANCH"
}

case "$1" in
    bump) bump_version ;;
    build) build_apk "$2" ;;
    push) push_version ;;
esac
```

### E. Jenkinsfile (XCoin-RN)

```groovy
pipeline {
    agent any
    parameters { choice(name: 'BUILD_PLATFORM', choices: ['android', 'ios']) }
    environment { PROJECT_DIR = "XCoin-RN" }
    stages {
        stage('Initialize') { steps { sh "chmod +x ${env.PROJECT_DIR}/scripts/*.sh" } }
        stage('Install Dependencies') { steps { dir("${env.PROJECT_DIR}") { sh 'npm install' } } }
        stage('Bump Version') { steps { dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh bump' } } }
        stage('Build Android') {
            when { expression { params.BUILD_PLATFORM == 'android' } }
            steps { dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh build' } }
        }
        stage('Push Version') {
            steps {
                withCredentials([string(credentialsId: 'xcoin-git-token', variable: 'GIT_TOKEN')]) {
                    dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh push' }
                }
            }
        }
        stage('Upload') {
            steps {
                withCredentials([string(credentialsId: 'xcoin-firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh upload' }
                }
            }
        }
    }
}
```

### F. Jenkinsfile (uab-android)

```groovy
pipeline {
    agent any
    parameters { choice(name: 'BUILD_VARIANT', choices: ['dev', 'uat', 'production']) }
    triggers { pollSCM('H/2 * * * *') }
    stages {
        stage('Initialize') { steps { sh 'chmod +x scripts/build-and-upload.sh' } }
        stage('Bump Version') { steps { sh 'scripts/build-and-upload.sh bump' } }
        stage('Build APK') {
            steps {
                withCredentials([string(credentialsId: 'AWS_TOKEN_ID', variable: 'AWS_TOKEN')]) {
                    sh "scripts/build-and-upload.sh build ${params.BUILD_VARIANT} -PcodeartifactToken=${AWS_TOKEN}"
                }
            }
        }
        stage('Push Version') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'gitlab-uab', passwordVariable: 'GIT_PSW', usernameVariable: 'GIT_USR')]) {
                    sh 'scripts/build-and-upload.sh push'
                }
            }
        }
        stage('Upload') { steps { sh 'scripts/build-and-upload.sh upload' } }
    }
}
```
