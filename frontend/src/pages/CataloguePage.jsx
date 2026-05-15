import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  fetchMovies,
  searchMovies,
  discoverMovies,
  fetchGenres,
  fetchYears,
} from "../services/api";

import PropTypes from "prop-types";
import MovieCard from "../components/MovieCard";
import { EmptyState } from "../components/Loader";

import {
  Squares2X2Icon,
  Bars3Icon,
  CalendarIcon,
  XMarkIcon,
  HeartIcon,
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";

/* ── Constantes ── */

const SORT_OPTIONS = [
  { value: "rating", label: "Note", Icon: StarSolid },
  { value: "year", label: "Année", Icon: CalendarIcon },
  { value: "title", label: "Titre", Icon: ChevronDownIcon },
];

/* ── CustomSelect ── */
function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = options.find((o) => (o.value ?? o) === value)?.label ?? value;

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? "rgba(61,124,255,0.5)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "10px",
          padding: "9px 14px",
          color: "#f0f2ff",
          fontSize: "13px",
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
      >
        <span>{label}</span>
        <ChevronDownIcon
          style={{
            width: "13px",
            height: "13px",
            opacity: 0.5,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "#1a1d2e",
            border: "1px solid rgba(61,124,255,0.25)",
            borderRadius: "12px",
            padding: "6px",
            zIndex: 999,
            minWidth: "100%",
            maxHeight: "220px",
            overflowY: "auto",
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          }}
        >
          {options.map((opt) => {
            const val = opt.value ?? opt;
            const lbl = opt.label ?? opt;
            const active = val === value;
            return (
              <div
                key={val}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  color: active ? "#3d7cff" : "rgba(200,210,255,0.7)",
                  background: active ? "rgba(61,124,255,0.12)" : "transparent",
                  fontWeight: active ? "600" : "400",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {lbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── FilterBadge ── */
function FilterBadge({ label, onRemove }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "rgba(61,124,255,0.15)",
        border: "1px solid rgba(61,124,255,0.3)",
        borderRadius: "99px",
        padding: "3px 10px 3px 12px",
        fontSize: "12px",
        color: "#7ca3ff",
        fontWeight: "500",
        animation: "fadeIn 0.15s ease",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#7ca3ff",
          display: "flex",
          alignItems: "center",
          padding: 0,
        }}
      >
        <XMarkIcon style={{ width: "12px", height: "12px" }} />
      </button>
    </div>
  );
}

/* ── Checkbox ── */
function Checkbox({ checked, onChange, label }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
      }}
    >
      <div
        onClick={onChange}
        style={{
          width: "18px",
          height: "18px",
          flexShrink: 0,
          border: `1.5px solid ${checked ? "#3d7cff" : "rgba(200,210,255,0.3)"}`,
          borderRadius: "5px",
          background: checked ? "rgba(61,124,255,0.25)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path
              d="M1 4L4 7L10 1"
              stroke="#3d7cff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        style={{
          fontSize: "13px",
          color: "rgba(200,210,255,0.65)",
          userSelect: "none",
        }}
      >
        {label}
      </span>
    </label>
  );
}

/* ── ListRow ── */
function ListRow({ m, onClick, isFav, onToggleFav }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: hovered
          ? "rgba(61,124,255,0.07)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(61,124,255,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "12px",
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.18s",
      }}
    >
      <div
        style={{
          width: "46px",
          height: "65px",
          flexShrink: 0,
          borderRadius: "7px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.07)",
        }}
      >
        <img
          src={m.poster}
          alt={m.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#f0f2ff",
            marginBottom: "5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {m.title}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(200,210,255,0.4)",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {m.director && <span>{m.director}</span>}
          <span>{m.year}</span>
          <span
            style={{
              background: "rgba(61,124,255,0.12)",
              color: "#7ca3ff",
              padding: "1px 8px",
              borderRadius: "99px",
              fontSize: "11px",
            }}
          >
        Film</span>
        </div>
      </div>

      <span
        style={{
          color: "#f5c518",
          fontSize: "13px",
          fontWeight: "700",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <StarSolid style={{ width: "11px", height: "11px" }} />
        {m.rating?.toFixed(1)}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav(m.id);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          color: isFav ? "#3d7cff" : "rgba(200,210,255,0.3)",
          transition: "color 0.15s, transform 0.15s",
          transform: isFav ? "scale(1.1)" : "scale(1)",
        }}
      >
        {isFav ? (
          <HeartSolid style={{ width: "17px", height: "17px" }} />
        ) : (
          <HeartIcon style={{ width: "17px", height: "17px" }} />
        )}
      </button>
    </div>
  );
}
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function normalizeMovie(m) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    rating: m.vote_average || 0,
    poster: m.poster_path
      ? `${IMAGE_BASE_URL}${m.poster_path}`
      : "/placeholder-poster.png",
    overview: m.overview,
    genre_ids: m.genre_ids || [],
    genre: m.genre_ids?.[0] || null,
    director: "",
    cast: [],
    raw: m,
  };
}

/* ══════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════ */
export default function CataloguePage({
  search,
  onMovieClick,
  favorites,
  onToggleFav,
}) {
  const [genre, setGenre] = useState("Tous");
  const [year, setYear] = useState("Toutes");
  const [person, setPerson] = useState("");
  const [excFut, setExcFut] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiTotalPages, setApiTotalPages] = useState(1);
  const [genres, setGenres] = useState([{ value: "Tous", label: "Tous" }]);
  const [years, setYears] = useState(["Toutes"]);

useEffect(() => {
  setPage(1);
}, [search, genre, year, excFut, sortBy]);

useEffect(() => {
  let cancelled = false;

  async function loadMovies() {
    try {
      setLoading(true);
      setError(null);

      let data;

      if (search && search.trim()) {
        data = await searchMovies(search.trim(), page);
      } else {
        data = await discoverMovies({
          page,
          year: year !== "Toutes" ? year : undefined,
          genre: genre !== "Tous" ? genre : undefined,
          person: person.trim() ? person.trim() : undefined,
        });
      }

      const list = Array.isArray(data) ? data : data.movies || data.results || [];

      if (!cancelled) {
        setMovies(list.map(normalizeMovie));
        setApiTotalPages(data.totalPages || data.total_pages || 1);
      }
    } catch {
      if (!cancelled) {
        setError("Impossible de charger les films.");
        setMovies([]);
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  loadMovies();

  return () => {
    cancelled = true;
  };
}, [search, page, genre, year, person]);

useEffect(() => {
  async function loadFilters() {
    const [genresData, yearsData] = await Promise.all([
      fetchGenres(),
      fetchYears(),
    ]);

    setGenres(genresData);
    setYears(yearsData);
  }

  loadFilters();
}, []);

  const resetFilters = useCallback(() => {
    setGenre("Tous");
    setYear("Toutes");
    setPerson("");
    setExcFut(false);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let list = [...movies];

    if (excFut) {
      list = list.filter((m) => m.year <= new Date().getFullYear());
    }

    list.sort((a, b) =>
      sortBy === "rating"
        ? b.rating - a.rating
        : sortBy === "year"
          ? (b.year || 0) - (a.year || 0)
          : a.title.localeCompare(b.title),
    );

    return list;
  }, [movies, excFut, sortBy]);

  const totalPages = apiTotalPages;
  const displayed = filtered;

  const activeBadges = [
    genre !== "Tous" && {
      key: "genre",
      label: genres.find((g) => g.value === genre)?.label,
      clear: () => {
        setGenre("Tous");
        setPage(1);
      },
    },
    year !== "Toutes" && {
      key: "year",
      label: year,
      clear: () => {
        setYear("Toutes");
        setPage(1);
      },
    },
    person && {
      key: "person",
      label: person,
      clear: () => {
        setPerson("");
        setPage(1);
      },
    },
    excFut && {
      key: "excFut",
      label: "Sans futures sorties",
      clear: () => setExcFut(false),
    },
  ].filter(Boolean);

  const hasActiveFilters = activeBadges.length > 0;

  return (
    <div className="fade-in">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      {/* ── Panneau filtres ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(61,124,255,0.12)",
          borderRadius: "16px",
          marginBottom: "20px",
          // PAS de overflow:hidden ici → laisse les dropdowns déborder
        }}
      >
        {/* Header */}
        <div
          onClick={() => setFiltersOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FunnelIcon
              style={{ width: "15px", height: "15px", color: "#3d7cff" }}
            />
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#f0f2ff" }}
            >
              Filtres
            </span>
            {hasActiveFilters && (
              <div
                style={{
                  background: "#3d7cff",
                  borderRadius: "99px",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                {activeBadges.length}
              </div>
            )}
          </div>
          <ChevronDownIcon
            style={{
              width: "15px",
              height: "15px",
              opacity: 0.4,
              transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s",
            }}
          />
        </div>

        {/* Corps — overflow:visible pour que les dropdowns passent */}
        {filtersOpen && (
          <div
            style={{
              padding: "0 20px 20px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              overflow: "visible",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "16px",
                marginTop: "18px",
                marginBottom: "18px",
                overflow: "visible",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(61,124,255,0.7)",
                    marginBottom: "8px",
                  }}
                >
                  Genre
                </div>
                <CustomSelect
                  value={genre}
                  onChange={(v) => {
                    setGenre(v);
                    setPage(1);
                  }}
                  options={genres}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(61,124,255,0.7)",
                    marginBottom: "8px",
                  }}
                >
                  Année
                </div>
                <CustomSelect
                  value={year}
                  onChange={(v) => {
                    setYear(v);
                    setPage(1);
                  }}
                  options={years}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(61,124,255,0.7)",
                    marginBottom: "8px",
                  }}
                >
                  Réal. ou Acteur
                </div>
                <input
                  type="text"
                  placeholder="Entrer un nom…"
                  value={person}
                  onChange={(e) => {
                    setPerson(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "9px 14px",
                    color: "#f0f2ff",
                    fontSize: "13px",
                    width: "100%",
                    outline: "none",
                    transition: "border-color 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(61,124,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <Checkbox
                checked={excFut}
                onChange={() => setExcFut((v) => !v)}
                label="Exclure les prochaines sorties"
              />
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "rgba(200,210,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(200,210,255,0.8)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(200,210,255,0.4)")
                  }
                >
                  <XMarkIcon style={{ width: "13px", height: "13px" }} />
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Badges filtres actifs ── */}
      {activeBadges.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {activeBadges.map((b) => (
            <FilterBadge key={b.key} label={b.label} onRemove={b.clear} />
          ))}
        </div>
      )}

      {/* ── Barre résultats + tri + vue ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
          <span style={{ color: "#f0f2ff", fontWeight: "600" }}>
            {filtered.length}
          </span>{" "}
          film{filtered.length > 1 ? "s" : ""} trouvé
          {filtered.length > 1 ? "s" : ""}
          {search && (
            <span style={{ color: "rgba(200,210,255,0.35)" }}>
              {" "}
              · "{search}"
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Boutons tri */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(200,210,255,0.4)",
                fontWeight: "500",
              }}
            >
              Trier
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              {SORT_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 11px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: sortBy === value ? "600" : "400",
                    border: `1px solid ${sortBy === value ? "rgba(61,124,255,0.4)" : "rgba(255,255,255,0.07)"}`,
                    background:
                      sortBy === value
                        ? "rgba(61,124,255,0.12)"
                        : "transparent",
                    color:
                      sortBy === value ? "#3d7cff" : "rgba(200,210,255,0.45)",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon style={{ width: "11px", height: "11px" }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle grid / list */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "9px",
              padding: "3px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {[
              { key: "grid", Icon: Squares2X2Icon },
              { key: "list", Icon: Bars3Icon },
            ].map(({ key, Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                style={{
                  width: "30px",
                  height: "26px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    view === key
                      ? "linear-gradient(135deg,#3d7cff,#6d5aff)"
                      : "transparent",
                  color: view === key ? "#fff" : "rgba(200,210,255,0.4)",
                  transition: "all 0.15s",
                }}
              >
                <Icon style={{ width: "14px", height: "14px" }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Résultats ── */}
      {loading && (
        <div style={{ color: "rgba(200,210,255,0.6)", marginBottom: "20px" }}>
          Chargement des films...
        </div>
      )}

      {error && (
        <div style={{ color: "#ff6b6b", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <EmptyState subtitle="Essayez un autre terme ou genre" />
      ) : view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: "18px",
            padding: "12px",
            margin: "-12px",
          }}
        >
          {displayed.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              onClick={() => onMovieClick(m)}
              isFav={favorites.includes(m.id)}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {displayed.map((m) => (
            <ListRow
              key={m.id}
              m={m}
              onClick={() => onMovieClick(m)}
              isFav={favorites.includes(m.id)}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            marginTop: "36px",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              cursor: page === 1 ? "default" : "pointer",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              fontSize: "12px",
              color:
                page === 1 ? "rgba(200,210,255,0.2)" : "rgba(200,210,255,0.6)",
            }}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span
                  key={`dot-${i}`}
                  style={{
                    color: "rgba(200,210,255,0.3)",
                    fontSize: "13px",
                    padding: "0 4px",
                  }}
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "9px",
                    border: `1px solid ${p === page ? "rgba(61,124,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background:
                      p === page ? "rgba(61,124,255,0.18)" : "transparent",
                    color: p === page ? "#3d7cff" : "rgba(200,210,255,0.45)",
                    fontWeight: p === page ? "700" : "400",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.15s",
                  }}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              cursor: page === totalPages ? "default" : "pointer",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              fontSize: "12px",
              color:
                page === totalPages
                  ? "rgba(200,210,255,0.2)"
                  : "rgba(200,210,255,0.6)",
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

CataloguePage.propTypes = {
  search: PropTypes.string,
  onMovieClick: PropTypes.func.isRequired,
  favorites: PropTypes.array.isRequired,
  onToggleFav: PropTypes.func.isRequired,
};
