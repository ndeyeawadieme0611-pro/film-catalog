import { useRef } from "react";
import PropTypes from "prop-types";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

const LABELS = {
  home: "Accueil",
  data: "Dashboard",
  catalogue: "Catalogue",
  favorites: "Favoris",
  trending: "Tendances",
  settings: "Paramètres",
};

export default function Navbar({
  search,
  setSearch,
  page,
  onMenuClick,
  user,
  onLogout,
  onLoginClick,
}) {
  const searchWrapperRef = useRef(null);

  const displayName = [user?.prenom, user?.nom].filter(Boolean).join(" ");
  const initiale = user?.prenom?.charAt(0).toUpperCase() || "?";
  const handleFocus = () => {
    if (searchWrapperRef.current) {
      searchWrapperRef.current.style.borderColor = "rgba(61,124,255,0.6)";
      searchWrapperRef.current.style.boxShadow =
        "0 0 0 3px rgba(61,124,255,0.15)";
      searchWrapperRef.current.style.background = "rgba(61,124,255,0.07)";
    }
  };

  const handleBlur = () => {
    if (searchWrapperRef.current) {
      searchWrapperRef.current.style.borderColor = "rgba(255,255,255,0.15)";
      searchWrapperRef.current.style.boxShadow = "none";
      searchWrapperRef.current.style.background = "rgba(255,255,255,0.07)";
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 0",
        marginBottom: "28px",
        gap: "12px",
        flexWrap: "nowrap",
      }}
    >
      {/* LEFT — fil d'ariane + titre */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onMenuClick}
          className="show-mobile"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "9px",
            color: "#fff",
            width: "38px",
            height: "38px",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Ouvrir le menu"
        >
          <Bars3Icon style={{ width: "18px", height: "18px" }} />
        </button>

        <div>
          <div
            style={{
              fontSize: "12px",
              color: "rgba(200,210,255,0.4)",
              marginBottom: "4px",
            }}
          >
            Pages /{" "}
            <span style={{ color: "#f0f2ff", fontWeight: "500" }}>
              {LABELS[page]}
            </span>
          </div>
          <div
            style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: "700" }}
          >
            {LABELS[page]}
          </div>
        </div>
      </div>

      {/* RIGHT — recherche + icônes */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          maxWidth: "520px",
          justifyContent: "flex-end",
        }}
      >
        {/* Search bar */}
        <div
          ref={searchWrapperRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "11px",
            padding: "10px 14px",
            flex: 1,
            minWidth: "140px",
            transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
          }}
        >
          <MagnifyingGlassIcon
            style={{
              width: "15px",
              height: "15px",
              opacity: 0.5,
              flexShrink: 0,
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Rechercher un film, réalisateur..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#f0f2ff",
              fontSize: "13px",
              width: "100%",
            }}
          />
          {search && (
            <XMarkIcon
              onClick={() => setSearch("")}
              style={{
                width: "14px",
                height: "14px",
                cursor: "pointer",
                opacity: 0.4,
                flexShrink: 0,
              }}
            />
          )}
        </div>

        {/* Avatar connecté / bouton Se connecter */}
        {user ? (
          <div
            onClick={onLogout}
            title="Se déconnecter"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              padding: "4px 10px 4px 4px",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3d7cff, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initiale}
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(200,210,255,0.65)",
                maxWidth: "90px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </span>
            <ArrowRightStartOnRectangleIcon
              style={{
                width: "14px",
                height: "14px",
                color: "rgba(200,210,255,0.35)",
                flexShrink: 0,
              }}
            />
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            style={{
              background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "700",
              padding: "9px 18px",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(61,124,255,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            Se connecter
          </button>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func,
  onLoginClick: PropTypes.func,
};
