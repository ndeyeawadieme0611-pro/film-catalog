# Étape 1 — Build de l'application React
FROM node:24-alpine AS build

WORKDIR /app

# Copie les dépendances en premier
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code
COPY . .

# Build l'application pour la production
RUN npm run build

# Étape 2 — Servir avec Nginx
FROM nginx:alpine

# Copie les fichiers buildés dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]