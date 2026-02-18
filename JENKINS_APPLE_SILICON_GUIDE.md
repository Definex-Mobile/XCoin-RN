# Apple Silicon (M1/M2/M3) Jenkins CI/CD Master Rehberi

Bu doküman, Apple Silicon işlemcili Mac'ler üzerinde Docker kullanarak **Android Native** ve **React Native** projeleri için sıfırdan profesyonel bir CI/CD ortamı kurma rehberidir.

---

## 🚀 1. Kurulum Yol Haritası (Sıfırdan Başlayanlar İçin)

### Adım 0: Sistem Hazırlığı

1.  **Rosetta 2 Kurulumu:** Apple Silicon'da x86_64 araçlarını (Android SDK) çalıştırmak için şarttır.
    ```bash
    softwareupdate --install-rosetta
    ```
2.  **Docker Desktop Ayarları:**
    - **Memory:** En az 8GB (İdeal 12GB).
    - **CPU:** 4-6 Core.
    - **Swap:** 4GB.
    - **Disk:** 64GB+.

### Adım 1: Jenkins Image Oluşturma

Jenkins'i Apple Silicon üzerinde en stabil şekilde çalıştırmak için `linux/amd64` (x86_64) emülasyon modunu kullanıyoruz. Bu, Native kütüphane çakışmalarını tamamen önler.

1.  `jenkins-custom` klasörü oluşturun.
2.  Aşağıdaki `Dockerfile` ve `entrypoint.sh` dosyalarını buraya koyun.
3.  Image'ı build edin:
    ```bash
    docker build --platform linux/amd64 -t jenkins-android .
    ```

### Adım 2: Container'ı Başlatma

```bash
docker run -d --name jenkins-android \
  --platform linux/amd64 \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins-android
```

### Adım 3: Jenkins Konfigürasyonu

1.  **Pluginler:** Git, Pipeline, Credentials Binding, Firebase App Distribution.
2.  **Credentials:**
    - `xcoin-git-token` (Secret Text): GitHub token.
    - `xcoin-firebase-token` (Secret Text): Firebase CI token.
    - `gitlab-uab` (Username with password): GitLab yetkileri.

---

## ⚛️ vs 🤖 2. Proje Tipleri Arasındaki Farklar

| Özellik           | Android Native (uab-android) | React Native (XCoin-RN)             |
| :---------------- | :--------------------------- | :---------------------------------- |
| **Ön Gereksinim** | JDK 17, Android SDK          | **Node.js (LTS)**, JDK, Android SDK |
| **Bağımlılıklar** | Gradle Sync                  | **npm install / yarn**              |
| **Versiyonlama**  | `build.gradle` (sed ile)     | **app.json** (Node.js ile)          |
| **Build Komutu**  | `./gradlew assembleRelease`  | **npx expo prebuild** + Gradle      |
| **Hız Optimize**  | Build Cache                  | **ABI Filter (sadece arm64-v8a)**   |

---

## ⚠️ 3. Kritik Optimizasyonlar (Hayat Kurtaranlar)

### 1. Bellek Çıkmazı (RAM Limitleri)

Docker'a 8GB verdiniz ama Jenkins'in içinde çalışan Gradle, build bittikten sonra "Daemon" olarak RAM'i tutmaya devam eder.

- **Çözüm:** Her build sonunda mutlaka **`./gradlew --stop`** komutunu çalıştırın. Bu, RAM'i o saniye serbest bırakır ve Jenkins UI'ın kilitlenmesini önler.

### 2. Dosya İzleme (Watch FS) Çökmesi

Docker Mac üzerinde çok fazla dosya izlemeye çalıştığında `NativeException` hatası verir.

- **Çözüm:** Gradle komutuna mutlaka **`--no-watch-fs`** ekleyin.

### 3. VPN ve UI Hızı

Jenkins açılırken VPN'in bağlanmasını beklemek arayüzün çok geç gelmesine sebep olur.

- **Çözüm:** VPN bağlantısını arka planda (background) başlatın, Jenkins UI hemen ayağa kalksın.

---

## 📂 4. Tam Kod Dosyaları (Full Version)

### A. Dockerfile

Android SDK 34 ve Java 17 ile uyumlu, emülasyon destekli yapı.

```dockerfile
FROM --platform=linux/amd64 jenkins/jenkins:lts

ARG JAVA_VERSION=17
ARG ANDROID_SDK_VERSION=11076708
ARG ANDROID_BUILD_TOOLS=34.0.0
ARG ANDROID_PLATFORM=34

USER root

# Paketler
RUN apt-get update && \
    apt-get install -y curl unzip wget python3 python3-pip openfortivpn sudo iproute2 iputils-ping net-tools nano vim && \
    apt-get clean

# Node.js & Firebase (React Native İçin Şart)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g firebase-tools

# Java Kurulumu (Adoptium Temurin)
RUN apt-get update && apt-get install -y wget apt-transport-https gnupg && \
    mkdir -p /etc/apt/keyrings && \
    wget -O /etc/apt/keyrings/adoptium.asc https://packages.adoptium.net/artifactory/api/gpg/key/public && \
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && \
    apt-get install -y temurin-${JAVA_VERSION}-jdk

ENV JAVA_HOME=/usr/lib/jvm/temurin-${JAVA_VERSION}-jdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${JAVA_HOME}/bin:${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools
ENV JAVA_OPTS="-Xmx1536m"

# Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && cd ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip && \
    unzip commandlinetools-linux-*.zip && rm *.zip && mv cmdline-tools latest && \
    yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-${ANDROID_PLATFORM}" "build-tools;${ANDROID_BUILD_TOOLS}"

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh && chown -R jenkins:jenkins ${ANDROID_HOME}

USER jenkins
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

### B. entrypoint.sh (Optimize Edilmiş)

Jenkins'in hızlı açılması için VPN arka planda çalışır.

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

# VPN'i arka planda başlat (Jenkins'i bekletme)
echo "🔌 Starting VPN Monitor in background..."
(
    while true; do
        sudo openfortivpn -c "$VPN_CONFIG" >> "$VPN_LOG" 2>&1
        sleep 10
    done
) &

# Jenkins'i hemen başlat
echo "🚀 Starting Jenkins UI..."
exec /usr/bin/tini -- /usr/local/bin/jenkins.sh
```

### C. Build Script: React Native (XCoin-RN)

`app.json` üzerinden versiyon artırır, sadece `arm64-v8a` için derler (HIZ!).

```bash
#!/bin/bash
set -e
log() { echo -e "\n\033[1;34m▶️  $1\033[0m"; }
fail() { echo -e "\n\033[1;31m❌ $1\033[0m"; exit 1; }

cd "$(dirname "$0")/.."

build_apk() {
    log "React Native Build Başlıyor..."
    if [ ! -d "node_modules" ]; then npm install; fi
    npx expo prebuild --platform android --no-install

    # HIZ: Sadece arm64-v8a derle
    echo "reactNativeArchitectures=arm64-v8a" >> android/gradle.properties

    cd android
    ./gradlew --stop || true

    ./gradlew assembleRelease \
        --no-watch-fs \
        "-Dorg.gradle.jvmargs=-Xmx2560m" \
        "-Pkotlin.compiler.execution.strategy=in-process" \
        -x lint -x test || { ./gradlew --stop; fail "Build failed!"; }

    ./gradlew --stop # Belleği boşalt
    cd ..
}

bump_version() {
    log "Versiyon Artırılıyor (app.json)..."
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
    git add app.json && git commit -m "chore(version): bump version [ci skip]" || true
}

case "$1" in
    bump) bump_version ;;
    build) build_apk ;;
    # push, upload...
esac
```

### D. Jenkinsfile: React Native

Sadece build başarılıysa `push` ve `upload` yapar.

```groovy
pipeline {
    agent any
    parameters { choice(name: 'BUILD_PLATFORM', choices: ['android', 'ios']) }
    environment { PROJECT_DIR = "XCoin-RN" }
    stages {
        stage('Initialize') { steps { sh "chmod +x ${env.PROJECT_DIR}/scripts/*.sh" } }
        stage('Install') { steps { dir("${env.PROJECT_DIR}") { sh 'npm install' } } }
        stage('Bump Version') { steps { dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh bump' } } }
        stage('Build Android') {
            when { expression { params.BUILD_PLATFORM == 'android' } }
            steps { dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh build' } }
        }
        stage('Push & Upload') {
            parallel {
                stage('Push Version') {
                    steps {
                        withCredentials([string(credentialsId: 'xcoin-git-token', variable: 'GIT_TOKEN')]) {
                            dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh push' }
                        }
                    }
                }
                stage('Firebase Upload') {
                    steps {
                        withCredentials([string(credentialsId: 'xcoin-firebase-token', variable: 'FIREBASE_TOKEN')]) {
                            dir("${env.PROJECT_DIR}") { sh './scripts/build-android.sh upload' }
                        }
                    }
                }
            }
        }
    }
}
```

### E. Build Script: Native Android (uab-android)

`sed` ile versiyon artırır, varyant desteği sunar.

```bash
#!/bin/bash
set -e
log()  { echo "▶️  $1"; }
ok()   { echo "✅ $1"; }
fail() { echo "❌ $1"; exit 1; }

bump_version() {
    log "Versiyon Artırılıyor (build.gradle)..."
    APP_GRADLE_FILE=$(grep -rl "com.android.application" . --include "build.gradle" --include "build.gradle.kts" | head -n1)
    CURRENT_CODE=$(grep -E "versionCode[[:space:]]+[0-9]+" "$APP_GRADLE_FILE" | grep -o '[0-9]\+' | head -n1)
    NEW_CODE=$((CURRENT_CODE + 1))
    sed -i -E "s/versionCode[[:space:]]+$CURRENT_CODE/versionCode $NEW_CODE/" "$APP_GRADLE_FILE"
    git add "$APP_GRADLE_FILE" && git commit -m "chore(version): bump to $NEW_CODE [ci skip]" || true
}

build_apk() {
    VARIANT=${1:-"dev"}
    VARIANT_CAP=$(echo "$VARIANT" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
    ./gradlew --stop || true
    GRADLE_ARGS=(
        "assemble${VARIANT_CAP}Release"
        "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx2560m"
        "-Pkotlin.compiler.execution.strategy=in-process"
        -x lint -x test
    )
    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Build failed!"; }
    ./gradlew --stop
}

case "$1" in
    bump) bump_version ;;
    build) build_apk "$2" ;;
    # push, upload...
esac
```

---

Bu rehber ve kodlar, Apple Silicon üzerindeki en stabil Android otomasyon yapısını oluşturur. 🚀
