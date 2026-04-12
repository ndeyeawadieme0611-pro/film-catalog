from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Film Catalog API",
    description="API pour parcourir et rechercher des films",
    version="1.0.0"
)

# CORS : permet au front-end React de communiquer avec le back-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # adresse du front-end Vite
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