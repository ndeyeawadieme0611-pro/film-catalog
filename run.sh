#!/bin/bash

echo "============================================"
echo "        Lancement de CineDB"
echo "============================================"

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "Erreur : Docker n'est pas installe. Veuillez l'installer."
    exit 1
fi

# Vérifier que docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "Erreur : Docker Compose n'est pas installe. Veuillez l'installer."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "Erreur : Fichier .env manquant. Creez-le a partir du README.md"
    exit 1
fi

echo "Prerequis verifies."
echo ""
echo "Demarrage des services..."
docker-compose up -d

echo ""
echo "Attente du demarrage des services..."
sleep 10

echo ""
echo "Etat des services :"
docker-compose ps

echo ""
echo "============================================"
echo "CineDB est pret !"
echo ""
echo "Application  : http://localhost"
echo "API Swagger  : http://localhost:8000/docs"
echo "============================================"
