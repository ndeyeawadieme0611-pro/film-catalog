# Guide de contribution — Film Catalog

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Git](https://git-scm.com)
- [Node.js v20+](https://nodejs.org)
- [Python 3.12+](https://python.org)
- [PostgreSQL 16](https://www.postgresql.org)
- [Docker](https://www.docker.com)

---

## 1. Cloner le projet

```bash
git clone https://github.com/ndeyeawadieme0611-pro/film-catalog.git
cd film-catalog
```

---

## 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://filmuser:filmpassword@localhost:5432/filmcatalog
TMDB_API_KEY=bd75cd88347f751f04c0ab2fcff7ba80
TMDB_BASE_URL=https://api.themoviedb.org/3
```

> ⚠️ Ne jamais commiter le fichier `.env` sur GitHub — il est dans le `.gitignore`.

---

## 3. Configurer la base de données PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE filmcatalog;
CREATE USER filmuser WITH PASSWORD 'filmpassword';
GRANT ALL PRIVILEGES ON DATABASE filmcatalog TO filmuser;
GRANT ALL ON SCHEMA public TO filmuser;
ALTER DATABASE filmcatalog OWNER TO filmuser;
\q
```

---

## 4. Lancer le backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Le backend est accessible sur : http://localhost:8000
La documentation API est sur : http://localhost:8000/docs

---

## 5. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend est accessible sur : http://localhost:5173

---

## 6. Workflow Git

### Règles importantes
- Ne jamais travailler directement sur la branche `main`
- Créer une branche par fonctionnalité
- Faire une Pull Request pour merger sur `main`

### Créer une branche

```bash
git checkout -b feat/nom-de-la-fonctionnalite
```

### Exemples de noms de branches

```
feat/auth-login
feat/films-search
feat/favorites
feat/docker-compose
feat/kubernetes
```

### Faire un commit

```bash
git add .
git commit -m "feat: description de ce que tu as fait"
git push origin feat/nom-de-la-fonctionnalite
```

### Convention des messages de commit

| Préfixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `docs:` | Documentation |
| `style:` | Mise en forme |
| `refactor:` | Refactorisation |
| `test:` | Tests |

---

## 7. Répartition des tâches

| Membre | Responsabilité |
|--------|---------------|
| Ndeyawa | TMDB + Base de données PostgreSQL + models  |
| Hafsa | Routes API (schemas, routers, auth) |
| Oum | Frontend React (pages, composants, appels API) |

---

## 8. Architecture du projet

```
film-catalog/
├── frontend/          → React + Vite + TypeScript
├── backend/           → FastAPI + PostgreSQL
│   ├── app/
│   │   ├── models/    → Tables PostgreSQL
│   │   ├── schemas/   → Format des données API
│   │   ├── routers/   → Routes API
│   │   ├── services/  → Appels TMDB
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
├── k8s/               → Manifests Kubernetes
├── docker-compose.yml
├── .env               → Variables d'environnement (ne pas commiter)
└── README.md
```

---

## 9. Routes API à implémenter (Hafsa)

```
EXEMPLE

POST /auth/register         → Inscription
POST /auth/login            → Connexion (retourne JWT)

GET  /films                 → Catalogue paginé
GET  /films/search          → Recherche par titre
GET  /films/{id}            → Détail d'un film
GET  /films/{id}/similar    → Films similaires
GET  /films/genres          → Liste des genres

GET    /favorites           → Mes favoris
POST   /favorites/{tmdb_id} → Ajouter un favori
DELETE /favorites/{tmdb_id} → Retirer un favori
```

---

## 10. En cas de problème

- Vérifier que PostgreSQL tourne : `sudo systemctl status postgresql`
- Vérifier que le backend tourne : http://localhost:8000/health
- Consulter la doc API : http://localhost:8000/docs
- Contacter Ndeyawa sur le groupe
