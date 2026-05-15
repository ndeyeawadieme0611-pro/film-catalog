import { useState, useEffect, useCallback } from "react";

export function useLists(userId = null) {
  const KEY = userId ? `cinedb_lists_${userId}` : null;

  const [lists, setLists] = useState(() => {
    if (!KEY) return [];
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  // Recharge quand l'utilisateur change (login/logout)
  useEffect(() => {
    if (!KEY) {
      setLists([]);
      return;
    }
    try {
      setLists(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setLists([]);
    }
  }, [KEY]);

  const save = useCallback(
    (next) => {
      if (!KEY) return;
      setLists(next);
      localStorage.setItem(KEY, JSON.stringify(next));
    },
    [KEY],
  );

  const createList = useCallback(
    (name, emoji = "🎬") => {
      const newList = {
        id: Date.now().toString(),
        name,
        emoji,
        isPrivate: true,
        createdAt: new Date().toISOString(),
        movies: [],
      };
      save([...lists, newList]);
      return newList;
    },
    [lists, save],
  );

  const renameList = useCallback(
    (listId, name, emoji) => {
      save(lists.map((l) => (l.id === listId ? { ...l, name, emoji } : l)));
    },
    [lists, save],
  );

  const deleteList = useCallback(
    (listId) => {
      save(lists.filter((l) => l.id !== listId));
    },
    [lists, save],
  );

  const togglePrivate = useCallback(
    (listId) => {
      save(
        lists.map((l) =>
          l.id === listId ? { ...l, isPrivate: !l.isPrivate } : l,
        ),
      );
    },
    [lists, save],
  );

  const addMovieToList = useCallback(
    (listId, movie) => {
      save(
        lists.map((l) => {
          if (l.id !== listId) return l;
          if (l.movies.some((m) => m.id === movie.id)) return l;
          return {
            ...l,
            movies: [
              ...l.movies,
              { ...movie, addedAt: new Date().toISOString() },
            ],
          };
        }),
      );
    },
    [lists, save],
  );

  const removeMovieFromList = useCallback(
    (listId, movieId) => {
      save(
        lists.map((l) =>
          l.id === listId
            ? { ...l, movies: l.movies.filter((m) => m.id !== movieId) }
            : l,
        ),
      );
    },
    [lists, save],
  );

  const isMovieInList = useCallback(
    (listId, movieId) => {
      return (
        lists
          .find((l) => l.id === listId)
          ?.movies.some((m) => m.id === movieId) ?? false
      );
    },
    [lists],
  );

  const getListsForMovie = useCallback(
    (movieId) => {
      return lists.filter((l) => l.movies.some((m) => m.id === movieId));
    },
    [lists],
  );

  return {
    lists,
    createList,
    renameList,
    deleteList,
    togglePrivate,
    addMovieToList,
    removeMovieFromList,
    isMovieInList,
    getListsForMovie,
  };
}
