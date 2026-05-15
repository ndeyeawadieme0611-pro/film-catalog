import { useState, useEffect, useCallback } from "react";
import { fetchMovies } from "../services/api";

/**
 * Hook pour charger et filtrer les films depuis l'API.
 * Gère le chargement, les erreurs et les filtres.
 */
export function useMovies(filters = {}) {
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovies(filters);
      setMovies(data.movies ?? data);
      setTotal(data.total ?? (data.movies ?? data).length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  return { movies, total, loading, error, refetch: load };
}

/**
 * Hook pour gérer les favoris (persistés en localStorage).
 */
export function useFavorites(userId = "guest") {
  const KEY = `cinedb_favorites_${userId}`;

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  // Recharge les favoris quand l'utilisateur change (login/logout)
  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setFavorites([]);
    }
  }, [KEY]);

  const toggle = useCallback(
    (movie) => {
      setFavorites((prev) => {
        const exists = prev.some((fav) => String(fav.id) === String(movie.id));
        const next = exists
          ? prev.filter((fav) => String(fav.id) !== String(movie.id))
          : [...prev, movie];
        localStorage.setItem(KEY, JSON.stringify(next));
        return next;
      });
    },
    [KEY],
  );

  return { favorites, toggleFav: toggle };
}
