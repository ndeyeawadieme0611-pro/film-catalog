import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { EmptyState } from "../components/Loader";
import { fetchMovies } from "../services/api";
import PropTypes from "prop-types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function normalizeMovie(m) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date
      ? Number(m.release_date.slice(0, 4))
      : (m.year ?? null),
    rating: m.vote_average ?? m.rating ?? 0,
    votes: m.vote_count || m.votes || 0,
    poster: m.poster_path
      ? `${IMAGE_BASE_URL}${m.poster_path}`
      : m.poster || "/placeholder-poster.png",
    overview: m.overview || "",
    genre: m.genre || "TMDB",
    raw: m,
  };
}

/* ── Tab Button ── */
function Tab({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active
          ? "linear-gradient(97deg,#3d7cff,#8b5cf6)"
          : "transparent",
        border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "10px",
        color: active ? "#fff" : "rgba(200,210,255,0.5)",
        padding: "8px 18px",
        fontSize: "13px",
        fontWeight: active ? "700" : "400",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        transition: "all 0.2s",
      }}
    >
      {label}
      {count !== undefined && (
        <span
          style={{
            background: active
              ? "rgba(255,255,255,0.25)"
              : "rgba(255,255,255,0.08)",
            borderRadius: "99px",
            padding: "1px 7px",
            fontSize: "11px",
            fontWeight: "700",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Liste Card ── */
function ListCard({ list, onClick, onDelete, onRename }) {
  const [hover, setHover] = useState(false);
  const covers = list.movies.slice(0, 4).map((m) => m.poster);

  return (
    <div
      onClick={() => onClick(list)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        background: hover
          ? "rgba(255,255,255,0.075)"
          : "rgba(255,255,255,0.045)",
        border: `1px solid ${hover ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.09)"}`,
        cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover
          ? "0 20px 50px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Cover mosaïque */}
      <div
        style={{
          position: "relative",
          height: "140px",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {covers.length === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            {list.emoji}
          </div>
        ) : covers.length === 1 ? (
          <img
            src={covers[0]}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              height: "100%",
            }}
          >
            {covers.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ))}
          </div>
        )}
        {/* Badge privé */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            borderRadius: "6px",
            padding: "2px 8px",
            fontSize: "10px",
            color: "rgba(200,210,255,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {list.isPrivate ? "🔒 Privée" : "🌐 Publique"}
        </div>
        {/* Emoji */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          {covers.length > 0 ? list.emoji : ""}
        </div>
      </div>

      {/* Infos */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#f0f2ff",
            marginBottom: "4px",
          }}
        >
          {list.name}
        </div>
        <div style={{ fontSize: "12px", color: "rgba(200,210,255,0.4)" }}>
          {list.movies.length} film{list.movies.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Actions */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          gap: "6px",
          padding: "0 14px 12px",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename(list);
          }}
          style={{
            flex: 1,
            background: "rgba(61,124,255,0.15)",
            border: "1px solid rgba(61,124,255,0.25)",
            borderRadius: "7px",
            color: "#7ca3ff",
            fontSize: "11px",
            fontWeight: "600",
            padding: "5px",
            cursor: "pointer",
          }}
        >
          ✏️ Renommer
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(list.id);
          }}
          style={{
            flex: 1,
            background: "rgba(255,80,80,0.1)",
            border: "1px solid rgba(255,80,80,0.2)",
            borderRadius: "7px",
            color: "#ff6b6b",
            fontSize: "11px",
            fontWeight: "600",
            padding: "5px",
            cursor: "pointer",
          }}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
}

/* ── Modal Créer/Renommer liste ── */
function ListModal({ initial, onSave, onClose }) {
  const EMOJIS = ["🎬", "⭐", "🍿", "❤️", "🔥", "🎭", "👻", "🚀", "🧠", "🏆"];
  const [name, setName] = useState(initial?.name || "");
  const [emoji, setEmoji] = useState(initial?.emoji || "🎬");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f1123",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "28px",
          width: "360px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#f0f2ff",
            marginBottom: "20px",
          }}
        >
          {initial ? "Renommer la liste" : "Nouvelle liste"}
        </div>

        {/* Emoji picker */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                fontSize: "20px",
                background:
                  emoji === e ? "rgba(61,124,255,0.2)" : "transparent",
                border: `1px solid ${emoji === e ? "rgba(61,124,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "8px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Nom */}
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la liste…"
          onKeyDown={(e) =>
            e.key === "Enter" && name.trim() && onSave(name.trim(), emoji)
          }
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px",
            padding: "10px 14px",
            color: "#f0f2ff",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "16px",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "rgba(200,210,255,0.5)",
              fontSize: "13px",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => name.trim() && onSave(name.trim(), emoji)}
            disabled={!name.trim()}
            style={{
              flex: 1,
              background: name.trim()
                ? "linear-gradient(97deg,#3d7cff,#8b5cf6)"
                : "rgba(255,255,255,0.05)",
              border: "none",
              borderRadius: "10px",
              color: name.trim() ? "#fff" : "rgba(200,210,255,0.3)",
              fontSize: "13px",
              fontWeight: "700",
              padding: "10px",
              cursor: name.trim() ? "pointer" : "default",
            }}
          >
            {initial ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Vue détail d'une liste ── */
function ListDetail({
  list,
  onBack,
  onMovieClick,
  onToggleFav,
  favorites,
  removeMovieFromList,
}) {
  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(200,210,255,0.5)",
          fontSize: "13px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "20px",
          padding: 0,
        }}
      >
        ← Retour aux listes
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "32px" }}>{list.emoji}</span>
        <div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#f0f2ff" }}
          >
            {list.name}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(200,210,255,0.4)" }}>
            {list.movies.length} film{list.movies.length > 1 ? "s" : ""} ·{" "}
            {list.isPrivate ? "🔒 Privée" : "🌐 Publique"}
          </div>
        </div>
      </div>

      {list.movies.length === 0 ? (
        <EmptyState
          icon="🎬"
          title="Liste vide"
          subtitle="Ajoutez des films depuis le catalogue."
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: "18px",
          }}
        >
          {list.movies.map((m) => (
            <div key={m.id} style={{ position: "relative" }}>
              <MovieCard
                movie={m}
                onClick={() => onMovieClick(m)}
                isFav={favorites.some((f) => f.id === m.id)}
                onToggleFav={onToggleFav}
              />
              <button
                onClick={() => removeMovieFromList(list.id, m.id)}
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  background: "rgba(255,50,50,0.85)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "3px 7px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   FavoritesPage — Ma collection
══════════════════════════════════════════ */
export function FavoritesPage({
  favorites,
  onMovieClick,
  onToggleFav,
  // props listes (optionnelles — uniquement si connecté)
  user,
  lists,
  createList,
  renameList,
  deleteList,
  addMovieToList,
  removeMovieFromList,
}) {
  const [tab, setTab] = useState("favorites");
  const [selectedList, setSelectedList] = useState(null);
  const [modal, setModal] = useState(null); // null | "create" | { list } pour rename
  const isLoggedIn = !!user;

  // Si on était sur "lists" et on se déconnecte → retour favoris
  if (!isLoggedIn && tab === "lists") setTab("favorites");

  if (selectedList) {
    // Synchronise la liste sélectionnée avec l'état courant
    const current =
      lists?.find((l) => l.id === selectedList.id) || selectedList;
    return (
      <ListDetail
        list={current}
        onBack={() => setSelectedList(null)}
        onMovieClick={onMovieClick}
        onToggleFav={onToggleFav}
        favorites={favorites}
        removeMovieFromList={removeMovieFromList}
      />
    );
  }

  return (
    <div className="fade-in">
      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <Tab
          label="Favoris"
          active={tab === "favorites"}
          onClick={() => setTab("favorites")}
          count={favorites.length}
        />
        {isLoggedIn && (
          <Tab
            label="Mes listes"
            active={tab === "lists"}
            onClick={() => setTab("lists")}
            count={lists?.length ?? 0}
          />
        )}
      </div>

      {/* ── Onglet Favoris ── */}
      {tab === "favorites" &&
        (favorites.length === 0 ? (
          <EmptyState
            icon="♡"
            title="Aucun favori"
            subtitle="Cliquez sur le cœur d'un film pour l'ajouter."
          />
        ) : (
          <>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(200,210,255,0.4)",
                marginBottom: "22px",
              }}
            >
              <span style={{ color: "#f0f2ff", fontWeight: "600" }}>
                {favorites.length}
              </span>{" "}
              film{favorites.length > 1 ? "s" : ""} en favori
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                gap: "18px",
              }}
            >
              {favorites.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onClick={() => onMovieClick(m)}
                  isFav={true}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
          </>
        ))}

      {/* ── Onglet Mes listes ── */}
      {tab === "lists" && isLoggedIn && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
            }}
          >
            <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
              <span style={{ color: "#f0f2ff", fontWeight: "600" }}>
                {lists?.length ?? 0}
              </span>{" "}
              liste{(lists?.length ?? 0) > 1 ? "s" : ""}
            </div>
            <button
              onClick={() => setModal("create")}
              style={{
                background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "700",
                padding: "9px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              + Nouvelle liste
            </button>
          </div>

          {!lists || lists.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Aucune liste"
              subtitle="Créez votre première liste pour organiser vos films."
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                gap: "18px",
              }}
            >
              {lists.map((l) => (
                <ListCard
                  key={l.id}
                  list={l}
                  onClick={setSelectedList}
                  onDelete={deleteList}
                  onRename={(list) => setModal({ list })}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Modals ── */}
      {modal === "create" && (
        <ListModal
          onClose={() => setModal(null)}
          onSave={(name, emoji) => {
            createList(name, emoji);
            setModal(null);
          }}
        />
      )}
      {modal?.list && (
        <ListModal
          initial={modal.list}
          onClose={() => setModal(null)}
          onSave={(name, emoji) => {
            renameList(modal.list.id, name, emoji);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

FavoritesPage.propTypes = {
  favorites: PropTypes.array.isRequired,
  onMovieClick: PropTypes.func.isRequired,
  onToggleFav: PropTypes.func.isRequired,
  user: PropTypes.object,
  lists: PropTypes.array,
  createList: PropTypes.func,
  renameList: PropTypes.func,
  deleteList: PropTypes.func,
  addMovieToList: PropTypes.func,
  removeMovieFromList: PropTypes.func,
};

// ── Tendances ────────────────────────────────────────────
export function TrendingPage({ onMovieClick, favorites, onToggleFav }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadMovies() {
      const data = await fetchMovies({ page: 1 });
      const list = data.movies || data.results || [];
      setMovies(list.map(normalizeMovie));
    }
    loadMovies();
  }, []);

  const trending = [...movies].sort(
    (a, b) => Number(b.votes) - Number(a.votes),
  );
  const top = trending[0];
  const rest = trending.slice(1);

  return (
    <div className="fade-in">
      {top && (
        <div
          onClick={() => onMovieClick(top)}
          style={{
            position: "relative",
            borderRadius: "18px",
            overflow: "hidden",
            marginBottom: "30px",
            cursor: "pointer",
            height: "280px",
          }}
        >
          <img
            src={top.poster}
            alt={top.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              display: "block",
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(7,9,26,0.92) 0%, rgba(7,9,26,0.6) 50%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              padding: "40px",
            }}
          >
            <div style={{ maxWidth: "460px" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: "700",
                  marginBottom: "14px",
                  letterSpacing: "1px",
                }}
              >
                🔥 N°1 DES TENDANCES
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  lineHeight: 1.2,
                  marginBottom: "10px",
                }}
              >
                {top.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(200,210,255,0.6)",
                  marginBottom: "14px",
                  lineHeight: 1.6,
                }}
              >
                {(top.overview || "").slice(0, 130)}…
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "center",
                  fontSize: "13px",
                  color: "rgba(200,210,255,0.5)",
                }}
              >
                <span style={{ color: "#f4a320", fontWeight: "700" }}>
                  ★ {top.rating?.toFixed(1)}
                </span>
                <span>·</span>
                <span>{top.year}</span>
                <span>·</span>
                <span>{top.genre}</span>
                <span>·</span>
                <span>{top.votes} votes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{ fontSize: "15px", fontWeight: "700", marginBottom: "18px" }}
      >
        Autres tendances
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: "18px",
        }}
      >
        {rest.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            onClick={() => onMovieClick(m)}
            isFav={favorites.some((fav) => fav.id === m.id)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>
    </div>
  );
}

TrendingPage.propTypes = {
  onMovieClick: PropTypes.func.isRequired,
  favorites: PropTypes.array.isRequired,
  onToggleFav: PropTypes.func.isRequired,
};

export { SettingsPage } from "./Settingspage";
