import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { MOVIES, GENRES } from "../data/movies";
import {
  FilmIcon,
  HeartIcon,
  FireIcon,
  PlayIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";

// ── Poster Card ───────────────────────────────────────────────────────────────
function PosterCard({ movie, onClick, isFav, onToggleFav }) {
  const [hov, setHov] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <div
      onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        flexShrink: 0,
        width: "160px",
        height: "240px",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        background: "rgba(255,255,255,0.06)",
        transform: hov ? "scale(1.05) translateY(-6px)" : "scale(1)",
        boxShadow: hov
          ? "0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(61,124,255,0.2)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        transition:
          "transform 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.28s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {!err ? (
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          onError={() => setErr(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(160deg, rgba(61,124,255,0.18), rgba(139,92,246,0.18))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "10px",
          }}
        >
          <FilmIcon
            style={{
              width: "36px",
              height: "36px",
              color: "rgba(200,210,255,0.4)",
              marginBottom: "8px",
            }}
          />
          <div
            style={{ fontSize: "12px", color: "#f0f2ff", fontWeight: "600" }}
          >
            {movie.title}
          </div>
        </div>
      )}

      {/* Overlay hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          opacity: hov ? 1 : 0,
          transition: "opacity 0.25s",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "12px",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: "13px",
            marginBottom: "5px",
            lineHeight: 1.3,
          }}
        >
          {movie.title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "9px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#f5c518",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <StarSolid style={{ width: "11px", height: "11px" }} />{" "}
            {movie.rating?.toFixed(1)}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(200,210,255,0.5)" }}>
            {movie.year}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(movie.id);
          }}
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "7px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "600",
            color: "#fff",
            background: isFav
              ? "linear-gradient(97deg,#3d7cff,#8b5cf6)"
              : "rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
            transition: "background 0.2s",
          }}
        >
          {isFav ? (
            <>
              <HeartSolid
                style={{
                  width: "13px",
                  height: "13px",
                  display: "inline",
                  marginRight: "4px",
                }}
              />
              Favori
            </>
          ) : (
            <>
              <HeartIcon
                style={{
                  width: "13px",
                  height: "13px",
                  display: "inline",
                  marginRight: "4px",
                }}
              />
              Ajouter
            </>
          )}
        </button>
      </div>

      {/* Badge note */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(4px)",
          borderRadius: "6px",
          padding: "2px 7px",
          fontSize: "11px",
          color: "#f5c518",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <StarSolid style={{ width: "10px", height: "10px" }} />
        {movie.rating?.toFixed(1)}
      </div>

      {/* Badge favori */}
      {isFav && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(61,124,255,0.5)",
          }}
        >
          <HeartSolid
            style={{ width: "12px", height: "12px", color: "#fff" }}
          />
        </div>
      )}
    </div>
  );
}

// ── Genre Row ─────────────────────────────────────────────────────────────────
function GenreRow({ genre, movies, onMovieClick, favorites, onToggleFav }) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * 540, behavior: "smooth" });
  if (!movies.length) return null;

  return (
    <section
      style={{ marginBottom: "44px", overflow: "hidden", width: "100%" }}
    >
      {/* Header — sans barre violette */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
              color: "#f0f2ff",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            {genre}
          </h2>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(200,210,255,0.35)",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "99px",
              padding: "2px 9px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {movies.length} film{movies.length > 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(61,124,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(61,124,255,0.35)";
                e.currentTarget.style.color = "#7ca3ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                e.currentTarget.style.color = "rgba(200,210,255,0.45)";
              }}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(200,210,255,0.45)",
                fontSize: "18px",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
              }}
            >
              {dir === -1 ? (
                <ChevronLeftIcon style={{ width: "16px", height: "16px" }} />
              ) : (
                <ChevronRightIcon style={{ width: "16px", height: "16px" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll area */}
      <div
        ref={ref}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          padding: "12px 12px",
          margin: "-12px -12px",
          width: "100%",
          minWidth: 0,
        }}
      >
        {movies.map((m) => (
          <PosterCard
            key={m.id}
            movie={m}
            onClick={onMovieClick}
            isFav={favorites.includes(m.id)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>
    </section>
  );
}

// ── Hero Banner ───────────────────────────────────────────────────────────────
function HeroBanner({ movie, onMovieClick }) {
  if (!movie) return null;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "18px",
        overflow: "hidden",
        marginBottom: "52px",
        cursor: "pointer",
        background:
          "linear-gradient(135deg, rgba(61,124,255,0.10) 0%, rgba(139,92,246,0.10) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        gap: "32px",
        padding: "32px",
        backdropFilter: "blur(2px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
      }}
      onClick={() => onMovieClick(movie)}
    >
      {/* Glow décoratif */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "80px",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Poster */}
      <img
        src={movie.poster}
        alt={movie.title}
        style={{
          height: "210px",
          width: "140px",
          objectFit: "cover",
          borderRadius: "12px",
          flexShrink: 0,
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      />

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
            borderRadius: "6px",
            padding: "3px 11px",
            fontSize: "10px",
            fontWeight: "800",
            color: "#fff",
            marginBottom: "14px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <FireIcon style={{ width: "13px", height: "13px" }} /> À la une
        </div>

        <h1
          style={{
            fontSize: "clamp(22px, 3vw, 38px)",
            fontWeight: "800",
            color: "#fff",
            marginBottom: "12px",
            lineHeight: 1.1,
            margin: "0 0 12px 0",
          }}
        >
          {movie.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "#f5c518",
              fontWeight: "700",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <StarSolid style={{ width: "14px", height: "14px" }} />{" "}
            {movie.rating?.toFixed(1)}
          </span>
          <span style={{ color: "rgba(200,210,255,0.45)", fontSize: "14px" }}>
            {movie.year}
          </span>
          <span
            style={{
              background: "rgba(61,124,255,0.15)",
              border: "1px solid rgba(61,124,255,0.25)",
              color: "#7ca3ff",
              padding: "2px 11px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {movie.genre}
          </span>
        </div>

        <p
          style={{
            color: "rgba(200,210,255,0.55)",
            fontSize: "13px",
            lineHeight: "1.65",
            maxWidth: "520px",
            margin: "0 0 20px 0",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {movie.overview}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMovieClick(movie);
          }}
          style={{
            background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "700",
            padding: "12px 26px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(61,124,255,0.45)",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <PlayIcon
            style={{
              width: "15px",
              height: "15px",
              display: "inline",
              marginRight: "6px",
              verticalAlign: "middle",
            }}
          />
          Voir le film
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage({ onMovieClick, favorites, onToggleFav }) {
  const hero = [...MOVIES].sort((a, b) => b.rating - a.rating)[0];
  const top = [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 20);
  const genreGroups = GENRES.filter((g) => g !== "All")
    .map((genre) => ({
      genre,
      movies: MOVIES.filter((m) => m.genre === genre).sort(
        (a, b) => b.rating - a.rating,
      ),
    }))
    .filter((g) => g.movies.length > 0);

  return (
    <div style={{ width: "100%", minWidth: 0, overflowX: "hidden" }}>
      <HeroBanner movie={hero} onMovieClick={onMovieClick} />
      <GenreRow
        genre="Les mieux notés"
        movies={top}
        onMovieClick={onMovieClick}
        favorites={favorites}
        onToggleFav={onToggleFav}
      />
      {genreGroups.map(({ genre, movies }) => (
        <GenreRow
          key={genre}
          genre={genre}
          movies={movies}
          onMovieClick={onMovieClick}
          favorites={favorites}
          onToggleFav={onToggleFav}
        />
      ))}
    </div>
  );
}

HomePage.propTypes = {
  onMovieClick: PropTypes.func.isRequired,
  favorites: PropTypes.array.isRequired,
  onToggleFav: PropTypes.func.isRequired,
};
