import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MovieModal from "./components/MovieModal";
import HomePage from "./pages/HomePage";
import DataPage from "./pages/DataPage";
import CataloguePage from "./pages/CataloguePage";
import { FavoritesPage, TrendingPage, SettingsPage } from "./pages/OtherPages";
import { useFavorites } from "./hooks/useMovies";
import { useLists } from "./hooks/useLists";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages/Forgotpasswordpage";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "./services/api";

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const prenom = localStorage.getItem("userPrenom");
    const nom = localStorage.getItem("userNom");
    return token ? { email, prenom, nom, token } : null;
  });

  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token") ? "reset-password" : "home";
  });

  const [resetToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token") ?? "";
  });

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

  const { favorites, toggleFav } = useFavorites(user?.email || "guest");
  const listsHook = useLists(user?.email || null); // null = pas de listes si non connecté

  const handleSetPage = (p) => {
    setPage(p);
    setSearch("");
    setSidebarOpen(false);
  };

  const commonProps = {
    onMovieClick: setSelectedMovie,
    favorites,
    onToggleFav: toggleFav,
    lists: listsHook.lists,
    addMovieToList: listsHook.addMovieToList,
    isMovieInList: listsHook.isMovieInList,
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim() !== "") setPage("catalogue");
  };

  const handleLogin = async ({ email, password }) => {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userEmail", data.email || email);
    localStorage.setItem("userPrenom", data.prenom || "");
    localStorage.setItem("userNom", data.nom || "");
    setUser({
      email: data.email || email,
      prenom: data.prenom || "",
      nom: data.nom || "",
      token: data.access_token,
    });
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPrenom");
    localStorage.removeItem("userNom");
    setUser(null);
    setPage("home");
  };

  const handleRegister = async ({ email, password, fname, lname }) => {
    await registerUser(email, password, fname, lname);
  };

  const marginLeft = isMobile
    ? 0
    : sidebarCollapsed
      ? "72px"
      : "var(--sidebar-w)";

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        setPage={handleSetPage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
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
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => setPage("login")}
        />

        {page === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setPage("register")}
            onForgotPassword={() => setPage("forgot-password")}
          />
        )}
        {page === "register" && (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setPage("login")}
          />
        )}
        {page === "forgot-password" && (
          <ForgotPasswordPage
            onSubmit={(email) => forgotPassword(email)}
            onBack={() => setPage("login")}
          />
        )}
        {page === "reset-password" && (
          <ResetPasswordPage
            token={resetToken}
            onSubmit={(token, new_password) =>
              resetPassword(token, new_password)
            }
            onBack={() => setPage("login")}
          />
        )}

        {page === "home" && <HomePage {...commonProps} />}
        {page === "data" && (
          <DataPage favorites={favorites} onMovieClick={setSelectedMovie} />
        )}
        {page === "catalogue" && (
          <CataloguePage {...commonProps} search={search} />
        )}
        {page === "favorites" && (
          <FavoritesPage
            {...commonProps}
            user={user}
            lists={listsHook.lists}
            createList={listsHook.createList}
            renameList={listsHook.renameList}
            deleteList={listsHook.deleteList}
            addMovieToList={listsHook.addMovieToList}
            removeMovieFromList={listsHook.removeMovieFromList}
          />
        )}
        {page === "trending" && <TrendingPage {...commonProps} />}
        {page === "settings" && (
          <SettingsPage
            user={user}
            onLogout={handleLogout}
            userId={user?.email || null}
          />
        )}
        <div style={{ height: "40px" }} />
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFav={favorites.some((fav) => fav.id === selectedMovie.id)}
          onToggleFav={toggleFav}
          onMovieClick={setSelectedMovie}
          lists={listsHook.lists}
          addMovieToList={listsHook.addMovieToList}
          isMovieInList={listsHook.isMovieInList}
        />
      )}
    </div>
  );
}
