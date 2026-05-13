import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  HomeIcon,
  ChartBarIcon,
  FilmIcon,
  HeartIcon,
  FireIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const NAV = [
  { icon: HomeIcon, label: "Accueil", page: "home" },
  { icon: ChartBarIcon, label: "Dashboard", page: "data" },
  { icon: FilmIcon, label: "Catalogue", page: "catalogue" },
  { icon: HeartIcon, label: "Favoris", page: "favorites" },
  { icon: FireIcon, label: "Tendances", page: "trending" },
  { icon: Cog6ToothIcon, label: "Paramètres", page: "settings" },
];

export default function Sidebar({
  page,
  setPage,
  open,
  onClose,
  collapsed,
  onCollapse,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const w = !isMobile && collapsed ? "72px" : "var(--sidebar-w)";
  const translateX = isMobile && !open ? "translateX(-100%)" : "translateX(0)";

  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: w,
          minWidth: w,
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, rgba(13,16,51,0.98) 0%, rgba(7,9,26,0.98) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 12px 24px",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          transform: translateX,
          transition:
            "transform 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "0 4px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed && !isMobile ? "center" : "space-between",
          }}
        >
          {!(collapsed && !isMobile) && (
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              {/* Logo */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3d7cff, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 12px rgba(139,92,246,0.6)",
                }}
              >
                <FilmIcon
                  style={{ width: "20px", height: "20px", color: "#fff" }}
                />
              </div>
              {/* Texte */}
              <div>
                <div style={{ fontSize: "17px", fontWeight: "700" }}>
                  Cine<span style={{ color: "#8b5cf6" }}>DB</span>
                </div>
                <div
                  style={{ fontSize: "11px", color: "rgba(200,210,255,0.4)" }}
                >
                  FILM EXPLORER
                </div>
              </div>
            </div>
          )}

          {/* Bouton collapse — uniquement sur desktop */}
          {!isMobile && (
            <button
              onClick={() => onCollapse((c) => !c)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "8px",
                color: "rgba(200,210,255,0.6)",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(61,124,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(61,124,255,0.35)";
                e.currentTarget.style.color = "#7ca3ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                e.currentTarget.style.color = "rgba(200,210,255,0.6)";
              }}
            >
              {collapsed ? (
                <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
              ) : (
                <ChevronLeftIcon style={{ width: "14px", height: "14px" }} />
              )}
            </button>
          )}

          {/* Bouton fermer — uniquement sur mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "8px",
                color: "rgba(200,210,255,0.6)",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <ChevronLeftIcon style={{ width: "14px", height: "14px" }} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {NAV.map((item) => {
            const active = page === item.page;
            const Icon = item.icon;
            const isCollapsed = collapsed && !isMobile;

            return (
              <button
                key={item.page}
                onClick={() => {
                  setPage(item.page);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isCollapsed ? 0 : "12px",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: "11px",
                  borderRadius: "10px",
                  marginBottom: "4px",
                  border: "none",
                  width: "100%",
                  background: active
                    ? "linear-gradient(97deg, #3d7cff 0%, rgba(139,92,246,0.8) 100%)"
                    : "transparent",
                  color: active ? "#fff" : "rgba(200,210,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: active
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    style={{
                      width: "18px",
                      height: "18px",
                      opacity: active ? 1 : 0.7,
                    }}
                  />
                </span>

                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {active && (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#fff",
                        }}
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!(collapsed && !isMobile) && (
          <div
            style={{
              padding: "16px 14px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: "12px",
              color: "rgba(200,210,255,0.25)",
            }}
          >
            CineDB v1.0 · React + FastAPI
          </div>
        )}
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  page: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onCollapse: PropTypes.func.isRequired,
};
