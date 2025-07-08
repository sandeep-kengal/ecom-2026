pipeline {
  agent any

  environment {
    DOCKER_IMAGE_BACKEND = 'your-dockerhub-username/backend:latest'
    DOCKER_IMAGE_FRONTEND = 'your-dockerhub-username/frontend:latest'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'docker build -t $DOCKER_IMAGE_BACKEND .'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'docker build -t $DOCKER_IMAGE_FRONTEND .'
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $DOCKER_IMAGE_BACKEND
            docker push $DOCKER_IMAGE_FRONTEND
          '''
        }
      }
    }
  }
}
