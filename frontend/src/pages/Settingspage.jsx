import { useState } from "react";
import PropTypes from "prop-types";

/* ── Helpers UI ── */
function Section({ title, children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "#3d7cff",
          marginBottom: "20px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, sub, children, danger }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: danger ? "#ff6b6b" : "#f0f2ff",
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: "12px",
              color: "rgba(200,210,255,0.4)",
              marginTop: "3px",
            }}
          >
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Badge({ children, color = "#3d7cff" }) {
  return (
    <span
      style={{
        background: `${color}18`,
        border: `1px solid ${color}35`,
        borderRadius: "8px",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: "600",
        color,
      }}
    >
      {children}
    </span>
  );
}

function DangerButton({ label, onClick, confirm }) {
  const [pending, setPending] = useState(false);

  if (!confirm) {
    return (
      <button
        onClick={onClick}
        style={{
          background: "rgba(255,80,80,0.1)",
          border: "1px solid rgba(255,80,80,0.25)",
          borderRadius: "9px",
          color: "#ff6b6b",
          fontSize: "12px",
          fontWeight: "600",
          padding: "7px 14px",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }

  return pending ? (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={() => {
          onClick();
          setPending(false);
        }}
        style={{
          background: "rgba(255,80,80,0.85)",
          border: "none",
          borderRadius: "9px",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "700",
          padding: "7px 14px",
          cursor: "pointer",
        }}
      >
        Confirmer
      </button>
      <button
        onClick={() => setPending(false)}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "9px",
          color: "rgba(200,210,255,0.5)",
          fontSize: "12px",
          padding: "7px 14px",
          cursor: "pointer",
        }}
      >
        Annuler
      </button>
    </div>
  ) : (
    <button
      onClick={() => setPending(true)}
      style={{
        background: "rgba(255,80,80,0.1)",
        border: "1px solid rgba(255,80,80,0.25)",
        borderRadius: "9px",
        color: "#ff6b6b",
        fontSize: "12px",
        fontWeight: "600",
        padding: "7px 14px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

/* ── Formulaire changement mot de passe ── */
function ChangePasswordForm({ onSubmit, onCancel }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#f0f2ff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "10px",
  };

  const handle = async () => {
    setError("");
    if (next !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (next.length < 6) {
      setError("Minimum 6 caractères.");
      return;
    }
    try {
      await onSubmit(current, next);
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Erreur serveur.");
    }
  };

  if (success)
    return (
      <div style={{ fontSize: "13px", color: "#00d9b0", padding: "12px 0" }}>
        ✓ Mot de passe mis à jour.
      </div>
    );

  return (
    <div style={{ marginTop: "14px", maxWidth: "340px" }}>
      <input
        type="password"
        placeholder="Mot de passe actuel"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirmer"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={inputStyle}
      />
      {error && (
        <div
          style={{ fontSize: "12px", color: "#ff6b6b", marginBottom: "10px" }}
        >
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handle}
          style={{
            background: "linear-gradient(97deg,#3d7cff,#8b5cf6)",
            border: "none",
            borderRadius: "9px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "700",
            padding: "9px 18px",
            cursor: "pointer",
          }}
        >
          Enregistrer
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px",
            color: "rgba(200,210,255,0.5)",
            fontSize: "13px",
            padding: "9px 14px",
            cursor: "pointer",
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SettingsPage
══════════════════════════════════════════ */
export function SettingsPage({ user, onLogout, userId }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const clearFavorites = () => {
    if (userId) localStorage.removeItem(`cinedb_favorites_${userId}`);
    window.location.reload();
  };

  const clearLists = () => {
    if (userId) localStorage.removeItem(`cinedb_lists_${userId}`);
    window.location.reload();
  };

  const clearAll = () => {
    if (userId) {
      localStorage.removeItem(`cinedb_favorites_${userId}`);
      localStorage.removeItem(`cinedb_lists_${userId}`);
    }
    onLogout();
  };

  const handleChangePassword = async (current, newPassword) => {
    const res = await fetch("/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        current_password: current,
        new_password: newPassword,
      }),
    });
    if (!res.ok) throw new Error("Mot de passe actuel incorrect.");
  };

  return (
    <div className="fade-in" style={{ maxWidth: "620px" }}>
      {/* ── Compte ── */}
      {user ? (
        <Section title="Mon compte">
          <Row label="Email" sub="Adresse de connexion">
            <Badge>{user.email}</Badge>
          </Row>
          <Row label="Nom" sub="Affiché dans l'interface">
            <Badge color="#8b5cf6">
              {user.prenom} {user.nom}
            </Badge>
          </Row>
          <Row label="Mot de passe" sub="Modifier votre mot de passe">
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                style={{
                  background: "rgba(61,124,255,0.12)",
                  border: "1px solid rgba(61,124,255,0.25)",
                  borderRadius: "9px",
                  color: "#7ca3ff",
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "7px 14px",
                  cursor: "pointer",
                }}
              >
                Modifier
              </button>
            )}
          </Row>
          {showPasswordForm && (
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              onCancel={() => setShowPasswordForm(false)}
            />
          )}
        </Section>
      ) : (
        <Section title="Mon compte">
          <div
            style={{
              fontSize: "13px",
              color: "rgba(200,210,255,0.4)",
              padding: "8px 0",
            }}
          >
            Connectez-vous pour accéder aux paramètres de compte.
          </div>
        </Section>
      )}

      {/* ── Données ── */}
      <Section title=" Mes données">
        <Row label="Favoris" sub="Films enregistrés comme favoris">
          <DangerButton
            label="Vider les favoris"
            confirm
            onClick={clearFavorites}
          />
        </Row>
        <Row label="Listes" sub="Toutes vos listes personnalisées">
          <DangerButton label="Vider les listes" confirm onClick={clearLists} />
        </Row>
      </Section>

      {/* ── À propos ── */}
      <Section title=" À propos">
        <Row label="Application" sub="Catalogue de films">
          <Badge>CineDB v1.0</Badge>
        </Row>
        <Row label="Stack" sub="Technologies">
          <span style={{ fontSize: "12px", color: "rgba(200,210,255,0.35)" }}>
            React · FastAPI · PostgreSQL · Docker
          </span>
        </Row>
        <Row label="Source des données" sub="API films">
          <Badge color="#00c8e0">TMDB API</Badge>
        </Row>
      </Section>

      {/* ── Déconnexion ── */}
      {user && (
        <Section title=" Session">
          <Row label="Déconnexion" sub="Vous serez redirigé vers l'accueil">
            <DangerButton label="Se déconnecter" onClick={onLogout} />
          </Row>
          <Row
            label="Supprimer mes données"
            sub="Efface favoris, listes et déconnecte"
            danger
          >
            <DangerButton label="Tout supprimer" confirm onClick={clearAll} />
          </Row>
        </Section>
      )}
    </div>
  );
}

SettingsPage.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  userId: PropTypes.string,
};
