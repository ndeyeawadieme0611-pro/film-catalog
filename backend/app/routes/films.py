from typing import Optional
from fastapi import APIRouter, Query

from app.services.tmdb import (
    get_popular_films,
    search_films,
    get_film_details,
    discover_films,
    get_genres,
    get_years,
)

router = APIRouter(prefix="/films", tags=["Films"])


@router.get("/popular")
async def popular_films(page: int = Query(1, ge=1)):
    return await get_popular_films(page)


@router.get("/search")
async def search_movies(
    query: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
):
    return await search_films(query, page)


@router.get("/discover")
async def discover_movies(
    page: int = Query(1, ge=1),
    year: Optional[int] = None,
    genre: Optional[int] = None,
    person: Optional[str] = None,
):
    return await discover_films(
        page=page,
        year=year,
        genre=genre,
        person=person,
    )


@router.get("/genres")
async def genres():
    return await get_genres()


@router.get("/years")
async def years():
    return await get_years()


@router.get("/{tmdb_id}")
async def film_details(tmdb_id: int):
    return await get_film_details(tmdb_id)