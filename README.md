# CineDB: Film Catalog

> Application web de catalogue de films conteneurisée, développée dans le cadre d'un projet universitaire à **Sorbonne Université** - Master Informatique, parcours RES/Networks.

---

## Description

CineDB est une application web full-stack permettant de parcourir, rechercher et gérer des films en s'appuyant sur l'API TMDB (The Movie Database). Le projet met en œuvre les pratiques DevOps modernes : conteneurisation Docker, orchestration Kubernetes et pipeline CI/CD automatisé.

---

## Démo en ligne

| Service | URL |
|---------|-----|
| Application | https://film-catalog-one.vercel.app |
| API Swagger | https://film-catalog-production-cf2f.up.railway.app/docs |

> ⚠️ **Note** : L'authentification (inscription/connexion) n'est pas disponible 
> en production car l'envoi d'emails est bloqué par l'hébergeur gratuit. 
> Toutes les autres fonctionnalités (catalogue, recherche, filtres, films populaires) 
> sont pleinement opérationnelles.
> Pour tester l'authentification complète, lancez l'application en local 
> avec Docker Compose (voir instructions ci-dessous).

## Lancement rapide

### Avec Docker Compose
```bash
./run.sh
```

### Avec Kubernetes
```bash
./run-k8s.sh
```
## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Utilisateur                       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│           Frontend React + Vite (Nginx)             │
│                  Port 80 / 3000                     │
└──────────────────────┬──────────────────────────────┘
                       │ /api/*
┌──────────────────────▼──────────────────────────────┐
│              Backend FastAPI (Python)               │
│                    Port 8000                        │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
┌──────────▼──────────┐ ┌─────────▼──────────────────┐
│  PostgreSQL (DB)    │ │      Redis (Cache)         │
│     Port 5432       │ │       Port 6379            │
└─────────────────────┘ └────────────────────────────┘
```

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | FastAPI (Python 3.12) |
| Base de données | PostgreSQL 16 |
| Cache | Redis 7 |
| Conteneurisation | Docker + Docker Compose |
| Orchestration | Kubernetes / Minikube |
| CI/CD | GitHub Actions |
| API externe | TMDB API |
| Reverse proxy | Nginx |

---

## Équipe

| Membre | Rôle |
|--------|------|
| Ndeye Awa DIEME | DevOps: Docker, Kubernetes, CI/CD |
| Hafsa AKZOUN | Backend: FastAPI, Auth JWT, TMDB, Test Docker |
| Oum LAMRABET | Frontend: React, pages, composants, Test Docker |

**Encadrant :** Binh-Minh Bui-Xuan

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) >= 1.29
- [Git](https://git-scm.com/)
- Clé API TMDB — [obtenir ici](https://www.themoviedb.org/settings/api)
- *(Optionnel pour Kubernetes)* [Minikube](https://minikube.sigs.k8s.io/) + [kubectl](https://kubernetes.io/docs/tasks/tools/)

---

## Lancement avec Docker Compose

### 1. Cloner le dépôt

```bash
git clone https://github.com/ndeyeawadieme0611-pro/film-catalog.git
cd film-catalog
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# TMDB API
TMDB_API_KEY=votre_clé_tmdb
TMDB_BASE_URL=https://api.themoviedb.org/3

# PostgreSQL
POSTGRES_USER=filmuser
POSTGRES_PASSWORD=filmpassword
POSTGRES_DB=filmcatalog
DATABASE_URL=postgresql://filmuser:filmpassword@postgres:5432/filmcatalog

# Redis
REDIS_URL=redis://redis:6379

# JWT
SECRET_KEY=votre_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# URLs
FRONTEND_URL=http://localhost
BACKEND_URL=http://localhost:8000

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_app_password
SMTP_FROM=votre_email@gmail.com
```

### 3. Lancer l'application

```bash
docker-compose up -d
```

### 4. Accéder à l'application

| Service | URL |
|---------|-----|
| Application | http://localhost |
| API Swagger | http://localhost:8000/docs |
| Portainer (optionnel) | http://localhost:9000 |

### 5. Arrêter l'application

```bash
docker-compose down
```

---

## Déploiement Kubernetes (Minikube)

### 1. Démarrer Minikube

```bash
minikube start
```

### 2. Construire les images dans le contexte Minikube

```bash
eval $(minikube docker-env)
docker-compose build
```

### 3. Appliquer les manifests

```bash
kubectl apply -f k8s/
```

### 4. Accéder à l'application

```bash
minikube service frontend --url
```

### 5. Vérifier l'état des pods

```bash
kubectl get all
```

---

## Endpoints API

### Films

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/films/popular` | Films populaires (paginé) |
| GET | `/api/films/search?query=` | Recherche par titre |
| GET | `/api/films/discover` | Filtrage par genre, année, acteur |
| GET | `/api/films/genres` | Liste des genres |
| GET | `/api/films/years` | Années disponibles |
| GET | `/api/films/{id}` | Détail d'un film |

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| GET | `/api/auth/verify-email` | Vérification email |
| POST | `/api/auth/login` | Connexion (JWT) |
| POST | `/api/auth/forgot-password` | Mot de passe oublié |
| POST | `/api/auth/reset-password` | Réinitialisation mot de passe |

---

## Structure du projet

```
film-catalog/
├── backend/                  # API FastAPI
│   ├── app/
│   │   ├── models/           # Modèles SQLAlchemy
│   │   ├── routes/           # Routes API
│   │   ├── schemas/          # Schémas Pydantic
│   │   ├── services/         # Logique métier
│   │   └── main.py           # Point d'entrée
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/            # Pages de l'application
│   │   ├── hooks/            # Hooks React
│   │   └── services/         # Appels API
│   ├── Dockerfile
│   └── nginx.conf
├── k8s/                      # Manifests Kubernetes
│   ├── configmaps/
│   ├── secrets/
│   ├── deployments/
│   ├── services/
│   ├── ingress/
│   └── hpa/
├── .github/
│   └── workflows/            # Pipeline CI/CD
├── docker-compose.yml
└── README.md
```

---

## Cache Redis

L'application intègre Redis comme système de cache pour optimiser les performances :

- Les réponses de l'API TMDB sont mises en cache pendant **10 minutes**
- Au premier appel → les données sont récupérées depuis TMDB et stockées dans Redis
- Aux appels suivants → les données sont servies directement depuis Redis (Cache hit)
- Si Redis est indisponible → l'application continue de fonctionner normalement (fallback)

**Vérifier que Redis fonctionne :**
```bash
# Docker Compose
docker exec filmcatalog-redis redis-cli ping
# Réponse : PONG

# Kubernetes
kubectl exec -it deployment/redis -- redis-cli ping
# Réponse : PONG
```

## Pipeline CI/CD

Le pipeline GitHub Actions se déclenche à chaque push sur `main` et exécute :

1. **Tests** : vérification du code
2. **Build** : construction des images Docker
3. **Deploy** : déploiement automatique

---

## Licence

Projet universitaire - Sorbonne Université 2025-2026
