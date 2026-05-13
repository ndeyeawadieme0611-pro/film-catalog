import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MovieModal from "./components/MovieModal";
import HomePage from "./pages/HomePage";
import DataPage from "./pages/DataPage";
import CataloguePage from "./pages/CataloguePage";
import { FavoritesPage, TrendingPage, SettingsPage } from "./pages/OtherPages";
import { useFavorites } from "./hooks/useMovies";

export default function App() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const { favorites, toggleFav } = useFavorites();

  const handleSetPage = (p) => {
    setPage(p);
    setSearch("");
    setSidebarOpen(false);
  };

  const commonProps = {
    onMovieClick: setSelectedMovie,
    favorites,
    onToggleFav: toggleFav,
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim() !== "") setPage("catalogue");
  };

  const marginLeft = isMobile
    ? 0
    : sidebarCollapsed
      ? "72px"
      : "var(--sidebar-w)";

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <Sidebar
        page={page}
        setPage={handleSetPage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      {/* ── Contenu principal ── */}
      <main
        className="main-content"
        style={{
          marginLeft,
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Navbar
          search={search}
          setSearch={handleSearch}
          page={page}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {page === "home" && <HomePage {...commonProps} />}
        {page === "data" && (
          <DataPage favorites={favorites} onMovieClick={setSelectedMovie} />
        )}
        {page === "catalogue" && (
          <CataloguePage {...commonProps} search={search} />
        )}
        {page === "favorites" && <FavoritesPage {...commonProps} />}
        {page === "trending" && <TrendingPage {...commonProps} />}
        {page === "settings" && <SettingsPage />}

        <div style={{ height: "40px" }} />
      </main>

      {/* ── Modal film ── */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFav={favorites.includes(selectedMovie.id)}
          onToggleFav={toggleFav}
          onMovieClick={setSelectedMovie}
        />
      )}
    </div>
  );
}
