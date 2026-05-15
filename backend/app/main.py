from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import films, auth
import app.models.film
import app.models.favorite
import app.models.user    
app = FastAPI(
    title="Film Catalog API",
    description="API pour parcourir et rechercher des films",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(films.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Film Catalog API is running !"}


@app.get("/health")
def health():
    return {"status": "ok"}