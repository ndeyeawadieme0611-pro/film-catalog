from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models

app = FastAPI(
    title="Film Catalog API",
    description="API pour parcourir et rechercher des films",
    version="1.0.0"
)

# Crée toutes les tables dans PostgreSQL au démarrage
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Film Catalog API is running !"}

@app.get("/health")
def health():
    return {"status": "ok"}