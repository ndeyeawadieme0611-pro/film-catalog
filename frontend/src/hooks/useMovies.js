import { useState, useEffect, useCallback } from 'react'
import { fetchMovies } from '../services/api'

/**
 * Hook pour charger et filtrer les films depuis l'API.
 * Gère le chargement, les erreurs et les filtres.
 */
export function useMovies(filters = {}) {
  const [movies, setMovies]   = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMovies(filters)
      setMovies(data.movies ?? data)
      setTotal(data.total ?? (data.movies ?? data).length)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { load() }, [load])

  return { movies, total, loading, error, refetch: load }
}

/**
 * Hook pour gérer les favoris (persistés en localStorage).
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cinedb_favorites') || '[]') }
    catch { return [] }
  })

  const toggle = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem('cinedb_favorites', JSON.stringify(next))
      return next
    })
  }, [])

  return { favorites, toggleFav: toggle }
}
