import httpx
import os
import json
import redis
from datetime import datetime
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Connexion Redis
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    print("Redis connecté")
except Exception as e:
    print(f"Redis non disponible : {e}")
    redis_client = None

CACHE_TTL = 60 * 10  # 10 minutes


async def tmdb_get(endpoint: str, params: dict | None = None):
    if not TMDB_API_KEY or not TMDB_BASE_URL:
        raise HTTPException(status_code=500, detail="TMDB configuration missing")

    params = params or {}
    params.update({
        "api_key": TMDB_API_KEY,
        "language": "fr-FR",
    })

    cache_key = f"tmdb:{endpoint}:{str(sorted(params.items()))}"

    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                print(f"Cache hit: {cache_key}")
                return json.loads(cached)
        except Exception as e:
            print(f"Redis read error: {e}")

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            f"{TMDB_BASE_URL}{endpoint}",
            params=params,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    data = response.json()

    if redis_client:
        try:
            redis_client.setex(cache_key, CACHE_TTL, json.dumps(data))
            print(f"✅ Cache set: {cache_key}")
        except Exception as e:
            print(f"⚠️ Redis write error: {e}")

    return data


async def get_popular_films(page: int = 1):
    return await tmdb_get("/movie/popular", {"page": page})


async def search_films(query: str, page: int = 1):
    return await tmdb_get("/search/movie", {
        "query": query,
        "page": page,
    })


async def get_film_details(tmdb_id: int):
    return await tmdb_get(f"/movie/{tmdb_id}")


async def search_person_id(name: str):
    data = await tmdb_get("/search/person", {"query": name})
    results = data.get("results", [])
    if not results:
        return None
    return results[0].get("id")


async def discover_films(
    page: int = 1,
    year: int | None = None,
    genre: int | None = None,
    person: str | None = None,
):
    params = {"page": page}
    if year:
        params["primary_release_year"] = year
    if genre:
        params["with_genres"] = genre
    if person:
        person_id = await search_person_id(person)
        if not person_id:
            return {
                "page": page,
                "results": [],
                "total_pages": 1,
                "total_results": 0,
            }
        params["with_people"] = person_id
    return await tmdb_get("/discover/movie", params)


async def get_genres():
    return await tmdb_get("/genre/movie/list")


async def get_years():
    current_year = datetime.now().year
    return {
        "years": list(range(current_year, current_year - 50, -1))
    }
