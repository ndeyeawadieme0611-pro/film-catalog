# CineDB — Frontend

Interface React + Vite pour l'application CineDB.  
Design inspiré de [Vision UI Dashboard](https://demos.creative-tim.com/vision-ui-dashboard-pro-chakra).

---

## Structure du dossier

```
frontend/
├── public/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieModal.jsx
│   │   └── Loader.jsx
│   ├── pages/            # Pages de l'application
│   │   ├── HomePage.jsx      (accueil Netflix-style)
│   │   ├── DataPage.jsx      (dashboard + graphiques)
│   │   ├── CataloguePage.jsx (catalogue filtrable)
│   │   └── OtherPages.jsx    (favoris, tendances, paramètres)
│   ├── data/
│   │   └── movies.js     # Données mock (fallback)
│   ├── services/
│   │   └── api.js        # Couche API axios (avec fallback)
│   ├── hooks/
│   │   └── useMovies.js  # Hooks React custom
│   ├── styles/
│   │   └── index.css     # CSS global + variables
│   ├── App.jsx           # Racine de l'app
│   └── main.jsx          # Point d'entrée
├── Dockerfile
├── nginx.conf
├── vite.config.js
└── package.json
```

---

## Lancement en développement

```bash
# 1. Installer les dépendances
npm install

# 2. Copier la config d'environnement
cp .env.example .env

# 3. Lancer le serveur de dev (port 3000)
npm run dev
```

> Le front fonctionne **sans back-end** grâce aux données mock dans `src/data/movies.js`.  
> Avec le back-end actif sur `localhost:8000`, le proxy Vite route automatiquement `/api/*`.

---

## Build de production

```bash
npm run build
# → dist/ prêt à servir
```

---

## Docker

```bash
# Build de l'image
docker build -t cinedb-frontend .

# Lancer le conteneur (port 80)
docker run -p 80:80 cinedb-frontend
```

---

## Variables d'environnement

| Variable       | Description                  | Défaut                      |
|----------------|------------------------------|-----------------------------|
| `VITE_API_URL` | URL du back-end FastAPI      | `/api` (proxy Vite en dev)  |

---

## Technologies

| Outil          | Rôle                          |
|----------------|-------------------------------|
| React 18       | UI                            |
| Vite 5         | Bundler + dev server          |
| Recharts       | Graphiques dashboard          |
| Axios          | Appels HTTP vers le back-end  |
| Nginx          | Serveur de production         |
| Docker         | Conteneurisation              |
