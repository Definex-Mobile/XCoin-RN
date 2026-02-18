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

Jenkins'i Apple Silicon üzerinde en stabil şekilde çalıştırmak için `linux/amd64` (x86_64) emülasyon modunu kullanıyoruz.

1.  `jenkins-custom` klasörü oluşturun.
2.  Aşağıdaki `Dockerfile` ve `entrypoint.sh` dosyalarını kullanarak image'ı build edin:
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

---

## ⚠️ 2. Kritik Performans Optimizasyonları

### 1. Bellek Çıkmazı (RAM Limitleri)

Docker'a 8GB verdiniz ama Gradle build bittikten sonra "Daemon" olarak RAM'i tutmaya devam eder.

- **Çözüm:** Her build sonunda mutlaka **`./gradlew --stop`** komutunu çalıştırın. Bu, RAM'i o saniye serbest bırakır ve Jenkins UI'ın kilitlenmesini önler.

### 2. Dosya İzleme (Watch FS) Çökmesi

Docker Mac üzerinde çok fazla dosya izlemeye çalıştığında `NativeException` hatası verir.

- **Çözüm:** Gradle komutuna mutlaka **`--no-watch-fs`** ekleyin.

### 3. VPN ve UI Hızı

Jenkins açılırken VPN'in bağlanmasını beklemek arayüzün çok geç gelmesine sebep olur.

- **Çözüm:** `entrypoint.sh` içinde VPN bağlantısını arka planda (background) başlatın.

---

## 📂 3. Tam Kod Dosyaları (FULL SÜRÜMLER)

### A. Dockerfile (Genel Android Altyapısı)

```dockerfile
FROM --platform=linux/amd64 jenkins/jenkins:lts

# Build Arguments
ARG JAVA_VERSION=17
ARG ANDROID_SDK_VERSION=11076708
ARG ANDROID_BUILD_TOOLS=34.0.0
ARG ANDROID_PLATFORM=34

USER root

# 1. Temel Paketler (VPN, Python, Node.js)
RUN apt-get update && \
    apt-get install -y curl unzip wget python3 python3-pip openfortivpn sudo iproute2 iputils-ping net-tools nano vim && \
    apt-get clean

# 2. Araçlar (AWS, Firebase) - RN için Node.js şarttır
RUN pip3 install awscli --break-system-packages && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g firebase-tools

# 3. Sudo İzinleri
RUN echo "jenkins ALL=(ALL) NOPASSWD: /usr/bin/openfortivpn, /usr/bin/pkill" >> /etc/sudoers

# 4. Java Kurulumu (Adoptium Temurin)
RUN apt-get update && apt-get install -y wget apt-transport-https gnupg && \
    mkdir -p /etc/apt/keyrings && \
    wget -O /etc/apt/keyrings/adoptium.asc https://packages.adoptium.net/artifactory/api/gpg/key/public && \
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list && \
    apt-get update && \
    apt-get install -y temurin-${JAVA_VERSION}-jdk && \
    apt-get clean

# Environment Variables
ENV JAVA_HOME=/usr/lib/jvm/temurin-${JAVA_VERSION}-jdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${JAVA_HOME}/bin:${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools
ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx2560m -Dorg.gradle.workers.max=1 -Dfile.encoding=UTF-8"
ENV JAVA_OPTS="-Xmx1536m"

# 5. Android SDK Kurulumu
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    cd ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip && \
    unzip commandlinetools-linux-*_latest.zip && rm *.zip && \
    mv cmdline-tools latest && \
    yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-${ANDROID_PLATFORM}" "build-tools;${ANDROID_BUILD_TOOLS}"

# 6. Yetkilendirme ve Entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    chown -R jenkins:jenkins ${ANDROID_HOME}

USER jenkins
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

### B. entrypoint.sh (VPN & Hızlı Başlatma)

```bash
#!/bin/bash

# VPN Konfigürasyonu
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

# 1. VPN Başlat ve İzle (Arka planda)
echo "🔌 Starting VPN Monitor..."
(
    while true; do
        sudo openfortivpn -c "$VPN_CONFIG" >> "$VPN_LOG" 2>&1
        echo "⚠️ VPN lost at $(date). Retrying in 10s..." >> "$VPN_LOG"
        sleep 10
    done
) &

# 2. Jenkins'i Hemen Başlat (Arayüz kilitlenmemesi için)
echo "🚀 Starting Jenkins..."
exec /usr/bin/tini -- /usr/local/bin/jenkins.sh
```

### C. Build Script: React Native (XCoin-RN)

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
    npx expo prebuild --platform android --no-install

    # HIZ OPTİMİZASYONU: Sadece test cihazı mimarisi (arm64-v8a)
    if ! grep -q "reactNativeArchitectures" android/gradle.properties 2>/dev/null; then
        echo "reactNativeArchitectures=arm64-v8a" >> android/gradle.properties
    fi

    cd android
    ./gradlew --stop || true # Eski daemonları temizle

    GRADLE_ARGS=(
        "assembleRelease"
        "--build-cache"
        "--parallel"
        "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx2560m -XX:MaxMetaspaceSize=512m"
        "-Pkotlin.compiler.execution.strategy=in-process"
        "-x" "lint" "-x" "lintVitalAnalyzeRelease" "-x" "test"
    )

    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Build failed!"; }
    ./gradlew --stop # RAM'İ HEMEN SERBEST BIRAK

    mkdir -p ../build-output
    cp app/build/outputs/apk/release/app-release.apk ../build-output/XCoin-Release.apk
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
    git config user.email "jenkins-bot@definex.com"
    git config user.name "Jenkins Bot"
    git add app.json
    git commit -m "chore(version): bump version [ci skip]" || true
}

push_version() {
    CLEAN_BRANCH=${GIT_BRANCH#origin/}
    TARGET_BRANCH=${CLEAN_BRANCH:-feature/jenkins-setup}
    REMOTE_URL=$(git remote get-url origin | sed -E "s|https://([^@]+@)?|https://$GIT_TOKEN@|")
    git pull --rebase "$REMOTE_URL" "$TARGET_BRANCH" || true
    git push "$REMOTE_URL" HEAD:refs/heads/"$TARGET_BRANCH"
}

upload_firebase() {
    APK_PATH="./build-output/XCoin-Release.apk"
    npx firebase-tools appdistribution:distribute "$APK_PATH" \
        --app "$FIREBASE_APP_ID_ANDROID" \
        --token "$FIREBASE_TOKEN" \
        --groups "$FIREBASE_TESTER_GROUP" \
        --release-notes "Jenkins Build"
}

case "$1" in
    bump) bump_version ;;
    build) build_apk ;;
    upload) upload_firebase ;;
    push) push_version ;;
esac
```

### D. Jenkinsfile: React Native (XCoin-RN)

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
            steps {
                withCredentials([string(credentialsId: 'xcoin-git-token', variable: 'GIT_TOKEN'),
                                 string(credentialsId: 'xcoin-firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    dir("${env.PROJECT_DIR}") {
                        sh './scripts/build-android.sh push'
                        sh './scripts/build-android.sh upload'
                    }
                }
            }
            post { success { archiveArtifacts artifacts: "${env.PROJECT_DIR}/build-output/*.apk" } }
        }
    }
}
```

### E. Build Script: Native Android (uab-android)

```bash
#!/bin/bash
set -e
log()  { echo "▶️  $1"; }
ok()   { echo "✅ $1"; }
fail() { echo "❌ $1"; exit 1; }

if [[ "$OSTYPE" == "darwin"* ]]; then SED_INPLACE=(-i ''); else SED_INPLACE=(-i); fi

bump_version() {
    log "Versiyon Artırılıyor (build.gradle)..."
    APP_GRADLE_FILE=$(grep -rl "com.android.application" . --include "build.gradle" --include "build.gradle.kts" | head -n1)
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
        "-Dorg.gradle.jvmargs=-Xmx2560m -XX:MaxMetaspaceSize=512m"
        "-Pkotlin.compiler.execution.strategy=in-process"
        "-x" "lint" "-x" "test"
    )

    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Build failed!"; }
    ./gradlew --stop
}

push_version() {
    REMOTE_URL=$(git remote get-url origin | sed -E "s|http://([^@]+@)?|http://$GIT_CREDENTIALS_USR:$GIT_CREDENTIALS_PSW@|")
    CLEAN_BRANCH=${GIT_BRANCH#origin/}
    git pull --rebase "$REMOTE_URL" "$CLEAN_BRANCH" || true
    git push "$REMOTE_URL" HEAD:refs/heads/"$CLEAN_BRANCH"
}

case "$1" in
    bump) bump_version ;;
    build) build_apk "$2" ;;
    push) push_version ;;
esac
```

### F. Jenkinsfile: Native Android (uab-android)

```groovy
pipeline {
    agent any
    parameters { choice(name: 'BUILD_VARIANT', choices: ['dev', 'uat', 'production']) }
    triggers { pollSCM('H/2 * * * *') }
    stages {
        stage('Initialize & Filter') {
            steps {
                sh 'chmod +x scripts/build-and-upload.sh'
                script {
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    def author = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                    if (author == "Jenkins Bot" || commitMsg.contains("[ci skip]")) {
                        error "🛑 Loop detected. Skipping."
                    }
                    if (currentBuild.getBuildCauses().toString().contains('UserIdCause')) {
                        env.FINAL_VARIANT = params.BUILD_VARIANT
                    } else if (env.GIT_BRANCH.contains('develop-cicd') && commitMsg.contains("PUBLISH")) {
                        env.FINAL_VARIANT = "dev"
                    } else {
                        error "⏭️ SKIP: Not a trigger event."
                    }
                }
            }
        }
        stage('Build & Push') {
            steps {
                sh 'scripts/build-and-upload.sh bump'
                withCredentials([string(credentialsId: 'AWS_TOKEN_ID', variable: 'AWS_TOKEN')]) {
                    sh "scripts/build-and-upload.sh build ${env.FINAL_VARIANT} -PcodeartifactToken=${AWS_TOKEN}"
                }
                withCredentials([usernamePassword(credentialsId: 'gitlab-uab', passwordVariable: 'GIT_PSW', usernameVariable: 'GIT_USR')]) {
                    sh 'scripts/build-and-upload.sh push'
                }
            }
        }
        stage('Upload') { steps { sh 'scripts/build-and-upload.sh upload' } }
    }
}
```
