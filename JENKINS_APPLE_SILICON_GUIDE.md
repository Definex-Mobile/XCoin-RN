# Professional Android CI/CD Kurulum ve Bakım Rehberi (UAB & XCoin)

**Platform:** Apple Silicon (ARM64) | **Altyapı:** Docker + Jenkins + openfortivpn
**Desteklenen Teknolojiler:** Native Android (Java/Kotlin) & React Native (Expo/Bare)

Bu doküman, Docker üzerinde çalışan Jenkins ile Android projeleri için otomatik build, versiyonlama ve Firebase App Distribution entegrasyonu süreçlerini kapsar. Sistem, Apple Silicon (M1/M2/M3) mimarisi için optimize edilmiştir.

---

## 🛠 1. Apple Silicon & Performans Optimizasyonları

Apple Silicon (ARM64) üzerinde x86 tabanlı Android build araçlarını çalıştırırken yaşanan sorunlar ve çözümleri:

### Mimari Uyumsuzluğu (Rosetta 2)

- **Sorun:** Android build araçları (AAPT2 vb.) ARM64 container içinde çöküyor.
- **Çözüm:** Container **x86_64 (amd64)** mimarisinde çalışmaya zorlandı. Rosetta 2 üzerinden emülasyon ile %100 uyumluluk sağlanır.
- **Dockerfile:** `FROM --platform=linux/amd64 jenkins/jenkins:lts`

### OOM (Out of Memory) ve Swap Yönetimi

- **Sorun:** Gradle build işlemleri 4GB+ RAM tüketebilir ve container'ı kilitler.
- **Çözüm 1:** Docker Desktop RAM limiti en az **8GB** olmalıdır.
- **Çözüm 2 (Kritik):** Her build sonunda **`./gradlew --stop`** komutu çalıştırılarak Gradle Daemon'ın RAM'i serbest bırakması sağlanır.
- **Çözüm 3:** Gradle heap boyutu `-Xmx2560m` olarak sınırlanarak Jenkins ve OS için alan bırakılır.

### Dosya İzleme (Watch FS) Hatası

- **Sorun:** Docker/Mac katmanında `NativeException: Couldn't poll for events` hatası.
- **Çözüm:** Gradle komutuna **`--no-watch-fs`** eklenerek dosya izleme yükü kaldırılır.

---

## 📂 2. Teknik Dosyalar (Full İçerik)

### A. Dockerfile (Genel Build Motoru)

```dockerfile
FROM --platform=linux/amd64 jenkins/jenkins:lts

# Build Arguments
ARG JAVA_VERSION=17
ARG ANDROID_SDK_VERSION=11076708
ARG ANDROID_BUILD_TOOLS=34.0.0
ARG ANDROID_PLATFORM=34

USER root

# Sistem Araçları & VPN
RUN apt-get update && \
    apt-get install -y curl unzip wget python3 python3-pip openfortivpn sudo iproute2 iputils-ping net-tools nano vim && \
    apt-get clean

# Node.js & Firebase CLI (React Native Desteği İçin)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g firebase-tools

# Sudo & Java
RUN echo "jenkins ALL=(ALL) NOPASSWD: /usr/bin/openfortivpn, /usr/bin/pkill" >> /etc/sudoers && \
    apt-get update && apt-get install -y temurin-${JAVA_VERSION}-jdk

# Env Vars & Android SDK setup
ENV JAVA_HOME=/usr/lib/jvm/temurin-${JAVA_VERSION}-jdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${JAVA_HOME}/bin:${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools
ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx2560m -Dorg.gradle.workers.max=1 -Dfile.encoding=UTF-8 -Dkotlin.daemon.jvm.options=-Xmx2560m"
ENV JAVA_OPTS="-Xmx1536m"

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER jenkins
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

### B. Entrypoint Script (Hızlı Jenkins Başlatma)

VPN bağlantısının Jenkins UI hızını etkilememesi için bağlantı arka planda başlatılır.

```bash
#!/bin/bash
VPN_CONFIG="/tmp/vpn.conf"
VPN_LOG="/var/jenkins_home/vpn.log"

# VPN Config (Embedded)
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

# 1. VPN Başlat (Arka planda sessizce çalışsın, Jenkins'i bekletmesin)
echo "🔌 Starting VPN in background..."
(
    while true; do
        sudo openfortivpn -c "$VPN_CONFIG" >> "$VPN_LOG" 2>&1
        sleep 10
    done
) &

# 2. Jenkins'i HEMEN Başlat
echo "🚀 Starting Jenkins immediately..."
exec /usr/bin/tini -- /usr/local/bin/jenkins.sh
```

---

## ⚛️ 3. React Native / Expo (XCoin Örneği)

### build-android.sh (RN Özel)

React Native projelerinde versiyon `app.json` üzerinden inline Node.js ile artırılır.

```bash
#!/bin/bash
set -e
log() { echo -e "\n\033[1;34m▶️  $1\033[0m"; }
fail() { echo -e "\n\033[1;31m❌ $1\033[0m"; exit 1; }

build_apk() {
    log "Expo Prebuild..."
    npx expo prebuild --platform android --no-install

    # ABI Filtreleme: Sadece arm64-v8a derle (Build süresini %75 azaltır)
    echo "reactNativeArchitectures=arm64-v8a" >> android/gradle.properties

    cd android
    log "Gradle Build & Memory Cleanup..."
    ./gradlew --stop || true

    GRADLE_ARGS=(
        "assembleRelease"
        "--build-cache"
        "--parallel"
        "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx2560m -XX:MaxMetaspaceSize=512m"
        "-Pkotlin.compiler.execution.strategy=in-process"
    )

    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Build failed!"; }
    ./gradlew --stop # Belleği boşalt
    cd ..
}

bump_version() {
    log "Bumping Version in app.json..."
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
    git add app.json && git commit -m "chore(version): bump [ci skip]" || true
}
# push ve upload fonksiyonları buraya eklenebilir.
case "$1" in
    bump) bump_version ;;
    build) build_apk ;;
    # ... Diğer komutlar
esac
```

---

## 🤖 4. Native Android (uab-android Örneği)

### build-and-upload.sh (Native Özel)

Native projelerde versiyonlama `sed` komutu ile `build.gradle` içinden yapılır.

```bash
#!/bin/bash
set -e
log() { echo "▶️ $1"; }
fail() { echo "❌ $1"; exit 1; }

bump_version() {
    log "Bumping Version in build.gradle..."
    APP_GRADLE_FILE=$(grep -rl "com.android.application" . --include "build.gradle*" | head -n1)
    CURRENT_CODE=$(grep -E "versionCode[[:space:]]+[0-9]+" "$APP_GRADLE_FILE" | grep -o '[0-9]\+' | head -n1)
    NEW_CODE=$((CURRENT_CODE + 1))

    sed -i -E "s/versionCode[[:space:]]+$CURRENT_CODE/versionCode $NEW_CODE/" "$APP_GRADLE_FILE"
    git add "$APP_GRADLE_FILE" && git commit -m "chore(version): bump to $NEW_CODE [ci skip]" || true
}

build_apk() {
    VARIANT=${1:-"dev"}
    ./gradlew --stop || true
    GRADLE_ARGS=(
        "assemble${VARIANT}Release"
        "--build-cache"
        "--parallel"
        "--no-watch-fs"
        "-Dorg.gradle.jvmargs=-Xmx2560m"
        "-Pkotlin.compiler.execution.strategy=in-process"
    )
    ./gradlew "${GRADLE_ARGS[@]}" || { ./gradlew --stop; fail "Build failed!"; }
    ./gradlew --stop
}
```

---

## 💡 5. Kritik Sorunlar ve Çözümleri (Troubleshooting)

| Sorun                         | Neden                                  | Çözüm                                                                          |
| :---------------------------- | :------------------------------------- | :----------------------------------------------------------------------------- |
| **Jenkins UI Çok Yavaş**      | Düşük RAM veya Dosya İzleme (Watch FS) | RAM limitini 8GB yapın, `--no-watch-fs` ekleyin.                               |
| **Gradle Daemon Disappeared** | OOM (Out of Memory)                    | Gradle RAM limitini (`-Xmx`) düşürün ve build sonunda `--stop` yapın.          |
| **VPN Bağlanmıyor**           | DNS Çakışması                          | `entrypoint.sh` içinde `set-dns = 0` ve `peerdns = 0` ayarlarını kontrol edin. |
| **Build Sona Ermiyor**        | Kotlin Daemon'ın Asılı Kalması         | `kotlin.compiler.execution.strategy=in-process` parametresini kullanın.        |
| **Invalid Crumb / 403**       | Yavaşlıktan Kaynaklı Session Kaybı     | Jenkins -> Security -> Enable proxy compatibility işaretleyin.                 |

Bu rehber, Apple Silicon üzerinde hem Native hem de React Native projeleri için standart, stabil ve performanslı bir CI/CD yolu sunar. 🚀
