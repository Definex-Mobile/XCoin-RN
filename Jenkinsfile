pipeline {
    agent any

    parameters {
        choice(name: 'BUILD_PLATFORM', choices: ['android', 'ios (future)'], description: 'Hangi platform için build alınacak?')
    }

    environment {
        PROJECT_DIR = "XCoin-RN"
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    sh "chmod +x ${env.PROJECT_DIR}/scripts/*.sh"
                    echo "🚀 Build başlatıldı: ${env.BUILD_PLATFORM}"
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

        stage('Build Android') {
            when {
                expression { params.BUILD_PLATFORM == 'android' }
            }
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh './scripts/build-android.sh build'
                }
            }
        }

        stage('Firebase Upload') {
            when {
                expression { params.BUILD_PLATFORM == 'android' }
            }
            environment {
                // Bu değerleri Jenkins Credentials veya Environment üzerinden sağlamalısınız
                FIREBASE_APP_ID_ANDROID = "1:115076399325:android:5724a4179db35d937f1b34"
            }
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh './scripts/build-android.sh upload'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: "${env.PROJECT_DIR}/build-output/*.apk", fingerprint: true
                }
            }
        }

        /* Gelecekte iOS Build eklemek isterseniz burayı kullanabileceğiz
        stage('Build iOS') {
            when {
                expression { params.BUILD_PLATFORM == 'ios' }
            }
            steps {
                dir("${env.PROJECT_DIR}") {
                    echo "iOS Build süreçleri eklenecek..."
                }
            }
        }
        */
    }

    post {
        always {
            echo "🏁 İşlem tamamlandı."
        }
    }
}
