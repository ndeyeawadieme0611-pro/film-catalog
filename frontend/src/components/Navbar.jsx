import { useRef } from "react";
import PropTypes from "prop-types";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const LABELS = {
  home: "Accueil",
  data: "Dashboard",
  catalogue: "Catalogue",
  favorites: "Favoris",
  trending: "Tendances",
  settings: "Paramètres",
};

export default function Navbar({ search, setSearch, page, onMenuClick }) {
  const searchWrapperRef = useRef(null);

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
          maxWidth: "420px",
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

        {/* Icônes actions */}
        {[
          { Icon: BellIcon, badge: true, title: "Notifications" },
          { Icon: Cog6ToothIcon, badge: false, title: "Paramètres" },
        ].map(({ Icon, badge, title }, i) => (
          <div
            key={i}
            title={title}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <Icon style={{ width: "17px", height: "17px" }} />
            {badge && (
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#3d7cff",
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};
