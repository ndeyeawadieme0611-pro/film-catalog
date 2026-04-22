import httpx
import os
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")

async def get_popular_films(page: int = 1):
    """Récupère les films populaires depuis TMDB"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/popular",
            params={
                "api_key": TMDB_API_KEY,
                "language": "fr-FR",
                "page": page
            }
        )
        return response.json()

async def search_films(query: str, page: int = 1):
    """Recherche des films par titre"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/movie",
            params={
                "api_key": TMDB_API_KEY,
                "language": "fr-FR",
                "query": query,
                "page": page
            }
        )
        return response.json()

async def get_film_details(tmdb_id: int):
    """Récupère les détails d'un film par son ID TMDB"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/{tmdb_id}",
            params={
                "api_key": TMDB_API_KEY,
                "language": "fr-FR"
            }
        )
        return response.json()