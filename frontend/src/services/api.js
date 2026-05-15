import axios from 'axios'
import { MOVIES } from '../data/movies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 8000,
})

api.interceptors.response.use(
  res => res,
  err => {
    if (import.meta.env.DEV) {
      console.warn('[API] Erreur réseau — fallback données locales', err.message)
    }
    return Promise.reject(err)
  }
)

export async function fetchMovies(params = {}) {
  try {
    const page = params.page || 1
    const { data } = await api.get('/films/popular', { params: { page } })

    return {
      movies: data.results || [],
      total: data.total_results || 0,
      page: data.page,
      totalPages: data.total_pages,
    }
  } catch {
    return { movies: MOVIES, total: MOVIES.length }
  }
}

export async function fetchMovie(id) {
  try {
    const { data } = await api.get(`/films/${id}`)
    return data
  } catch {
    return MOVIES.find(m => m.id === Number(id)) || null
  }
}

export async function searchMovies(query, page = 1) {
  try {
    const { data } = await api.get('/films/search', {
      params: { query, page },
    })

    return data.results || []
  } catch {
    const q = query.toLowerCase()
    return MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.director?.toLowerCase().includes(q) ||
      m.cast?.some(a => a.toLowerCase().includes(q))
    )
  }
}

export async function fetchSimilar(id) {
  return []
}

export async function fetchStats() {
  try {
    const data = await fetchMovies()
    const movies = data.movies || []

    return {
      total: data.total || movies.length,
      genres: 0,
      avgRating: movies.length
        ? (movies.reduce((acc, m) => acc + (m.vote_average || 0), 0) / movies.length).toFixed(1)
        : 0,
      topGenre: 'N/A',
    }
  } catch {
    return {
      total: MOVIES.length,
      genres: [...new Set(MOVIES.map(m => m.genre))].length,
      avgRating: (MOVIES.reduce((acc, m) => acc + m.rating, 0) / MOVIES.length).toFixed(1),
      topGenre: 'Drama',
    }
  }
}

const FAV_KEY = 'cinedb_favorites'

export function getFavoritesLocal() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') }
  catch { return [] }
}

export function saveFavoritesLocal(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids))
}

export default api

export async function discoverMovies({ page = 1, year, genre, person } = {}) {
  const params = { page }

  if (year && year !== 'Toutes') params.year = year
  if (genre && genre !== 'Tous') params.genre = genre
  if (person && person.trim()) params.person = person.trim()

  const { data } = await api.get('/films/discover', { params })

  return {
    movies: data.results || [],
    total: data.total_results || 0,
    page: data.page,
    totalPages: data.total_pages,
  }
}

export async function fetchGenres() {
  const { data } = await api.get('/films/genres')

  return [
    { value: 'Tous', label: 'Tous' },
    ...(data.genres || []).map(g => ({
      value: g.id,
      label: g.name,
    })),
  ]
}

export async function fetchYears() {
  const { data } = await api.get('/films/years')

  return [
    'Toutes',
    ...(data.years || []).map(String),
  ]
}
