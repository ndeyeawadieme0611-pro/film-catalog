#!/bin/bash

echo "============================================"
echo "        Lancement de CineDB sur Kubernetes"
echo "============================================"

# Vérifier que minikube est installé
if ! command -v minikube &> /dev/null; then
    echo "Erreur : Minikube n'est pas installe. Veuillez l'installer."
    exit 1
fi

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    echo "Erreur : kubectl n'est pas installe. Veuillez l'installer."
    exit 1
fi

# Vérifier que docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "Erreur : Docker Compose n'est pas installe. Veuillez l'installer."
    exit 1
fi

# Créer le .env frontend si absent
if [ ! -f frontend/.env ]; then
    echo "VITE_API_URL=/api" > frontend/.env
    echo "Fichier frontend/.env cree."
fi

echo "Prerequis verifies."
echo ""

# Démarrer Minikube
echo "Demarrage de Minikube..."
minikube start

# Construire les images dans le contexte Minikube
echo ""
echo "Construction des images Docker dans le contexte Minikube..."
eval $(minikube docker-env)
docker-compose build
docker tag film-catalog_backend:latest film-catalog_backend:latest 2>/dev/null || true
docker tag $(docker images --format "{{.Repository}}:{{.Tag}}" | grep backend | head -1) film-catalog_backend:latest
docker tag $(docker images --format "{{.Repository}}:{{.Tag}}" | grep frontend | head -1) film-catalog_frontend:latest

# Appliquer les manifests Kubernetes
echo ""
echo "Application des manifests Kubernetes..."
kubectl apply -R -f k8s/

# Attendre que PostgreSQL et Redis soient prêts en premier
echo ""
echo "Attente de PostgreSQL..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=60s

echo "Attente de Redis..."
kubectl wait --for=condition=ready pod -l app=redis --timeout=60s

# Redémarrer le backend pour qu'il se connecte correctement
echo ""
echo "Demarrage du backend..."
kubectl rollout restart deployment/backend
sleep 10

# Attendre les pods par label
echo ""
echo "Attente du demarrage du backend (120 secondes max)..."
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

echo "Attente du demarrage du frontend (60 secondes max)..."
kubectl wait --for=condition=ready pod -l app=frontend --timeout=60s

if [ $? -eq 0 ]; then
    echo "Tous les pods sont prets."
else
    echo "Certains pods prennent plus de temps, verifiez avec : kubectl get pods"
fi

# Afficher l'état des pods
echo ""
echo "Etat des pods :"
kubectl get pods

echo ""
echo "Etat des services :"
kubectl get services

# Récupérer l'URL du frontend
OS=$(uname)
if [ "$OS" = "Darwin" ]; then
    echo ""
    echo "Sur Mac, ouvrez un nouveau terminal et lancez :"
    echo "minikube service frontend"
    echo ""
    echo "============================================"
    echo "CineDB est pret sur Kubernetes !"
    echo "============================================"
else
    FRONTEND_URL=$(minikube service frontend --url)
    echo ""
    echo "============================================"
    echo "CineDB est pret sur Kubernetes !"
    echo ""
    echo "Application  : $FRONTEND_URL"
    echo "============================================"
fi