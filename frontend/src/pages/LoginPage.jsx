import { useState } from "react";
import PropTypes from "prop-types";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage({
  onLogin,
  onSwitchToRegister,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Remplis tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await onLogin({ email, password });
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Compte non activé. Vérifie ton email avant de te connecter.");
      } else if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Erreur de connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}
          >
            Bon retour 👋
          </div>
          <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
            Connecte-toi pour accéder à ta liste de favoris
          </div>
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
              onClick={() => setShowPw((s) => !s)}
              style={{
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
              }}
            >
              {showPw ? (
                <EyeSlashIcon style={{ width: "15px", height: "15px" }} />
              ) : (
                <EyeIcon style={{ width: "15px", height: "15px" }} />
              )}
            </button>
          </div>
        </Field>

        <div
          style={{
            textAlign: "right",
            marginTop: "-8px",
            marginBottom: "22px",
          }}
        >
          <span
            onClick={onForgotPassword}
            style={{ fontSize: "12px", color: "#7ca3ff", cursor: "pointer" }}
          >
            Mot de passe oublié ?
          </span>
        </div>

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

        <button
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
          {loading ? <Spinner /> : "Se connecter"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "22px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.07)",
            }}
          />
          <span style={{ fontSize: "11px", color: "rgba(200,210,255,0.25)" }}>
            ou continuer avec
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.07)",
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "12px",
            color: "rgba(200,210,255,0.35)",
          }}
        >
          Pas encore de compte ?{" "}
          <span
            onClick={onSwitchToRegister}
            style={{ color: "#7ca3ff", cursor: "pointer", fontWeight: "600" }}
          >
            S'inscrire
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: "15px" }}>
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

LoginPage.propTypes = {
  onLogin: PropTypes.func,
  onSwitchToRegister: PropTypes.func,
  onForgotPassword: PropTypes.func,
};
Field.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node,
};
