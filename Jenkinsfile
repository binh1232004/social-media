pipeline {
    agent any 
    stages {
        stage('Checkout') {
            steps {
                git url: 'git@gitlab.com:dev-op4/dev-op-final.git', branch: 'main'
            }
        }
        stage('Build') {
            steps {
                dir('./frontend'){
                    sh 'npm i'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy'){
            steps{
                dir('./frontend'){
                    sh 'pm2 start "npm run start"'
                }
            }
        }
    }
}