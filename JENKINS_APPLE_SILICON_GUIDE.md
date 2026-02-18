# Apple Silicon (M1/M2/M3) Üzerinde Jenkins CI/CD Rehberi

Bu doküman, Apple Silicon işlemcili bilgisayarlar üzerinde Docker kullanarak koşturulan Jenkins ortamında **Android Native** ve **React Native** projelerinin CI/CD süreçlerini otomatize etmek için hazırlanmıştır. Karşılaşılan sorunlar, çözümleri ve örnek kod yapıları burada toplanmıştır.

## 🏁 Temel Gereksinimler ve Docker Yapılandırması

Apple Silicon (arm64) mimarisinde, özellikle eski Android SDK araçları ve Gradle versiyonları ile uyum sağlamak için Jenkins container'ını emülasyon modunda çalıştırmak en stabil yoldur.

### Docker Platform Seçimi

Jenkins container'ını başlatırken `--platform linux/amd64` bayrağını kullanmak, Rosetta 2 üzerinden x86_64 emülasyonu sağlar. Bu, native kütüphanelerin derlenmesindeki çakışmaları %100 çözer.

```bash
docker run -d --name jenkins-android \
  --platform linux/amd64 \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

### Kaynak Yönetimi (RAM/CPU)

Apple Silicon üzerinde emülasyon ek işlemci yükü getirir. Başarılı bir build için Apple Silicon Mac'inizde:

- **Docker Memory:** En az 6GB (İdeal: 8GB+)
- **Docker Swap:** En az 4GB
- **CPU:** En az 4 Core (İdeal: 8+)
  ayrılmalıdır.

---

## 🛠️ Android Native vs. React Native Farklılıkları

| Özellik                 | Android Native (uab-android)      | React Native (XCoin-RN)                        |
| :---------------------- | :-------------------------------- | :--------------------------------------------- |
| **Bağımlılık Yönetimi** | Doğrudan Gradle (Maven/Google)    | `npm install` veya `yarn` (Node.js)            |
| **Ön Hazırlık**         | Yok                               | `npx expo prebuild` (Expo) veya Bundle         |
| **Versiyonlama**        | `build.gradle` (versionCode/Name) | `app.json` veya `package.json`                 |
| **Gereksinimler**       | JDK, Android SDK                  | Node.js, JDK, Android SDK                      |
| **Hız Optimize**        | `parallel`, `build-cache`         | `ABI Filter (arm64-v8a)`, `node_modules` cache |

---

## 🚀 Kritik Optimizasyonlar ve Sorun Giderme

### 1. Bellek Çıkmazı ve Gradle Daemon

**Sorun:** Jenkins UI çok yavaşlıyor veya "Daemon disappeared" hatasıyla build fail oluyor.
**Çözüm:** Build sonunda Gradle Daemon'ı durdurarak RAM'i anında serbest bırakın.

```bash
./gradlew assembleRelease || { ./gradlew --stop; exit 1; }
./gradlew --stop # RAM'i Jenkins'e geri ver
```

### 2. Dosya İzleme (Watch FS) Çökmesi

**Sorun:** `NativeException: Couldn't poll for events` hatası.
**Çözüm:** Docker container içinde dosya izleme yükünü kaldırmak için `--no-watch-fs` parametresini kullanın.

```bash
./gradlew assembleRelease --no-watch-fs
```

### 3. VPN ve UI Yavaşlığı

**Sorun:** `entrypoint.sh` içinde VPN beklerken Jenkins arayüzünün gelmemesi veya yavaşlaması.
**Çözüm:** VPN bağlantısını arka plana atın ve Jenkins'i hemen başlatın. VPN hazır olunca network katmanı otomatik olarak bağlanacaktır.

### 4. Build Süresini Kısaltma (ABI Filtering)

**Sorun:** Native kütüphanelerin (C++) tüm mimariler için derlenmesi saatler sürüyor.
**Çözüm:** Sadece test cihazlarının kullandığı mimariyi (`arm64-v8a`) hedefleyin.

```properties
# gradle.properties içine ekle
reactNativeArchitectures=arm64-v8a
```

---

## 📄 Örnek Kodlar (Full Sürümler)

### 1. Jenkinsfile (React Native Örneği)

Bu dosya Jenkins pipeline'ını yönetir. `Bump` ve `Push` aşamaları sadece ana build başarılı olursa çalışacak şekilde kurgulanmıştır.

<details>
<summary>Jenkinsfile içeriğini gör</summary>

```groovy
pipeline {
    agent any
    parameters {
        choice(name: 'BUILD_PLATFORM', choices: ['android', 'ios'], description: 'Hangi platform için build alınacak?')
    }
    environment {
        PROJECT_DIR = "XCoin-RN"
    }
    stages {
        stage('Initialize') {
            steps {
                script {
                    sh "chmod +x ${env.PROJECT_DIR}/scripts/*.sh"
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh 'npm install'
                }
            }
        }
        stage('Bump Version') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh './scripts/build-android.sh bump'
                }
            }
        }
        stage('Build Android') {
            when { expression { params.BUILD_PLATFORM == 'android' } }
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh './scripts/build-android.sh build'
                }
            }
        }
        stage('Push Version') {
            steps {
                withCredentials([string(credentialsId: 'xcoin-git-token', variable: 'GIT_TOKEN')]) {
                    dir("${env.PROJECT_DIR}") {
                        sh './scripts/build-android.sh push'
                    }
                }
            }
        }
        stage('Firebase Upload') {
            when { expression { params.BUILD_PLATFORM == 'android' } }
            environment {
                FIREBASE_APP_ID_ANDROID = "YOUR_APP_ID"
            }
            steps {
                withCredentials([string(credentialsId: 'xcoin-firebase-token', variable: 'FIREBASE_TOKEN')]) {
                    dir("${env.PROJECT_DIR}") {
                        sh './scripts/build-android.sh upload'
                    }
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: "${env.PROJECT_DIR}/build-output/*.apk", fingerprint: true
                }
            }
        }
    }
}
```

</details>

### 2. build-android.sh (React Native / Expo)

JS bazlı versiyon artırımı ve bellek yönetimi içerir.

<details>
<summary>build-android.sh içeriğini gör</summary>

```bash
#!/bin/bash
set -e
cd "$(dirname "$0")/.."

build_apk() {
    # Expo Prebuild
    npx expo prebuild --platform android --no-install

    # ABI Filter eklentisi (opsiyonel)
    echo "reactNativeArchitectures=arm64-v8a" >> android/gradle.properties

    cd android
    ./gradlew --stop || true
    ./gradlew assembleRelease \
        --no-watch-fs \
        -Dorg.gradle.jvmargs=-Xmx2560m \
        -Pkotlin.compiler.execution.strategy=in-process || { ./gradlew --stop; exit 1; }
    ./gradlew --stop

    mkdir -p ../build-output
    cp app/build/outputs/apk/release/app-release.apk ../build-output/XCoin-Release.apk
}

bump_version() {
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
    git add app.json
    git commit -m "chore(version): bump version [ci skip]" || true
}

case "$1" in
    bump) bump_version ;;
    build) build_apk ;;
    push) # Push logic... ;;
    upload) # Firebase upload logic... ;;
esac
```

</details>

---

## 💡 Yeni Projeler İçin Yol Haritası

1.  **Script Hazırlığı:** Projenin türüne göre yukarıdaki scriptlerden birini `scripts/` altına kopyalayın.
2.  **Bellek Ayarı:** Script içindeki `-Xmx` değerini, Docker'ın toplam RAM'inin yarısından fazlasına çekmeyin.
3.  **Jenkins Credentials:** Git token (`GIT_TOKEN`) ve Firebase token (`FIREBASE_TOKEN`) bilgilerini Jenkins Credential Manager'a ekleyin.
4.  **No-Watch-FS:** Her zaman `--no-watch-fs` bayrağını Gradle komutunda tutun.
5.  **Clean Build:** Çok sıkışırsanız `expo prebuild --clean` yapabilirsiniz ancak her build'de yapılması süreyi uzatır.
