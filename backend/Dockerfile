# Image de base Python
FROM python:3.12-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie les dépendances en premier (optimisation cache Docker)
COPY requirements.txt .

# Installe les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copie tout le code
COPY . .

# Expose le port 8000
EXPOSE 8000

# Lance le serveur FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]