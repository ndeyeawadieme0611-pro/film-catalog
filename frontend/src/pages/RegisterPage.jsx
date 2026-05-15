import { useState } from "react";
import PropTypes from "prop-types";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!fname || !lname || !email || !password || !confirm) {
      setError("Remplis tous les champs.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Adresse email invalide.");
      return;
    }
    if (getStrength(password) < 2) {
      setError("Mot de passe trop faible.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await onRegister({ email, password, fname, lname });
      setSuccess(
        "Compte créé ! Vérifie ton email pour l'activer, puis connecte-toi.",
      );
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Un compte existe déjà avec cet email.");
      } else {
        setError(err.message || "Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(password);
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Faible", "Moyen", "Bon", "Fort"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "22px",
          padding: "40px 36px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          color: "#f0f2ff",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "800",
              marginBottom: "6px",
            }}
          >
            Créer un compte
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "rgba(200,210,255,0.4)",
            }}
          >
            Rejoins-nous pour sauvegarder tes films favoris
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <Field
            label="Prénom"
            icon={<UserIcon style={{ width: "14px", height: "14px" }} />}
          >
            <input
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Jean"
              style={inputStyle}
            />
          </Field>

          <Field
            label="Nom"
            icon={<UserIcon style={{ width: "14px", height: "14px" }} />}
          >
            <input
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Dupont"
              style={inputStyle}
            />
          </Field>
        </div>

        <Field
          label="Email"
          icon={<EnvelopeIcon style={{ width: "14px", height: "14px" }} />}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="ton@email.com"
            style={inputStyle}
          />
        </Field>

        <Field
          label="Mot de passe"
          icon={<LockClosedIcon style={{ width: "14px", height: "14px" }} />}
        >
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: "42px" }}
            />

            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              style={eyeBtn}
            >
              {showPw ? (
                <EyeSlashIcon style={{ width: "15px", height: "15px" }} />
              ) : (
                <EyeIcon style={{ width: "15px", height: "15px" }} />
              )}
            </button>
          </div>

          {password && (
            <div style={{ marginTop: "6px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  marginBottom: "4px",
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "2px",
                      background:
                        i <= strength
                          ? strengthColors[strength]
                          : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: strengthColors[strength],
                }}
              >
                {strengthLabels[strength]}
              </div>
            </div>
          )}
        </Field>

        <Field
          label="Confirmer le mot de passe"
          icon={<LockClosedIcon style={{ width: "14px", height: "14px" }} />}
        >
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: "42px" }}
            />

            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              style={eyeBtn}
            >
              {showConfirm ? (
                <EyeSlashIcon style={{ width: "15px", height: "15px" }} />
              ) : (
                <EyeIcon style={{ width: "15px", height: "15px" }} />
              )}
            </button>
          </div>
        </Field>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "12px",
              color: "#fca5a5",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "12px",
              color: "#86efac",
              marginBottom: "16px",
            }}
          >
            {success}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: loading
              ? "rgba(61,124,255,0.45)"
              : "linear-gradient(97deg,#3d7cff,#8b5cf6)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 20px rgba(61,124,255,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? <Spinner /> : "Créer mon compte"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "12px",
            color: "rgba(200,210,255,0.35)",
          }}
        >
          Déjà un compte ?{" "}
          <span
            onClick={onSwitchToLogin}
            style={{
              color: "#7ca3ff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Se connecter
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: "15px", flex: 1 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          fontWeight: "600",
          color: "rgba(200,210,255,0.4)",
          marginBottom: "7px",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
        }}
      >
        {icon}
        {label}
      </label>

      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "11px",
  color: "#f0f2ff",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const eyeBtn = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "rgba(200,210,255,0.35)",
  padding: 0,
  display: "flex",
};

RegisterPage.propTypes = {
  onRegister: PropTypes.func,
  onSwitchToLogin: PropTypes.func,
};

Field.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node,
};
