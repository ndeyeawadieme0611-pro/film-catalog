import axios from 'axios'
import { MOVIES } from '../data/movies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
})

// ── Intercepteur : log les erreurs en dev ────────────────────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    if (import.meta.env.DEV) {
      console.warn('[API] Erreur réseau — fallback données locales', err.message)
    }
    return Promise.reject(err)
  }
)

// ── Films ────────────────────────────────────────────────────────────────────

/**
 * Récupère la liste des films depuis le back-end.
 * Fallback sur les données locales si le back-end est indisponible.
 */
export async function fetchMovies(params = {}) {
  try {
    const { data } = await api.get('/movies', { params })
    return data
  } catch {
    // Fallback : filtrage/tri côté client sur les données mockées
    let list = [...MOVIES]
    if (params.genre && params.genre !== 'All') list = list.filter(m => m.genre === params.genre)
    if (params.search) {
      const q = params.search.toLowerCase()
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q)
      )
    }
    if (params.year) list = list.filter(m => String(m.year) === String(params.year))
    list.sort((a, b) => {
      if (params.sort === 'year')  return b.year - a.year
      if (params.sort === 'title') return a.title.localeCompare(b.title)
      return b.rating - a.rating
    })
    return { movies: list, total: list.length }
  }
}

/**
 * Récupère un film par son id.
 */
export async function fetchMovie(id) {
  try {
    const { data } = await api.get(`/movies/${id}`)
    return data
  } catch {
    return MOVIES.find(m => m.id === Number(id)) || null
  }
}

/**
 * Récupère les films similaires (même genre).
 */
export async function fetchSimilar(id) {
  try {
    const { data } = await api.get(`/movies/${id}/similar`)
    return data
  } catch {
    const movie = MOVIES.find(m => m.id === Number(id))
    if (!movie) return []
    return MOVIES.filter(m => m.genre === movie.genre && m.id !== movie.id).slice(0, 6)
  }
}

// ── Recherche ────────────────────────────────────────────────────────────────

export async function searchMovies(query) {
  try {
    const { data } = await api.get('/movies/search', { params: { q: query } })
    return data
  } catch {
    const q = query.toLowerCase()
    return MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.director?.toLowerCase().includes(q) ||
      m.cast?.some(a => a.toLowerCase().includes(q))
    )
  }
}

// ── Stats ────────────────────────────────────────────────────────────────────

export async function fetchStats() {
  try {
    const { data } = await api.get('/stats')
    return data
  } catch {
    return {
      total: MOVIES.length,
      genres: [...new Set(MOVIES.map(m => m.genre))].length,
      avgRating: (MOVIES.reduce((acc, m) => acc + m.rating, 0) / MOVIES.length).toFixed(1),
      topGenre: 'Drama',
    }
  }
}

// ── Favoris (localStorage comme fallback si pas de back-end auth) ─────────────
const FAV_KEY = 'cinedb_favorites'

export function getFavoritesLocal() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') }
  catch { return [] }
}

export function saveFavoritesLocal(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids))
}

export default api
