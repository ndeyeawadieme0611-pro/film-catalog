import { useState } from "react";
import PropTypes from "prop-types";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// ─── Shared primitives ──────────────────────────────────────────────────────

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

function Card({ children }) {
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
        {children}
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

function ErrorBox({ message }) {
  return (
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
      {message}
    </div>
  );
}

function SuccessBox({ message }) {
  return (
    <div
      style={{
        background: "rgba(34,197,94,0.08)",
        border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        color: "#86efac",
        marginBottom: "16px",
      }}
    >
      {message}
    </div>
  );
}

function PrimaryButton({ onClick, disabled, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
      {loading ? <Spinner /> : children}
    </button>
  );
}

function BackLink({ onClick, label = "← Retour à la connexion" }) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "24px",
        fontSize: "12px",
        color: "rgba(200,210,255,0.35)",
      }}
    >
      <span
        onClick={onClick}
        style={{ color: "#7ca3ff", cursor: "pointer", fontWeight: "600" }}
      >
        {label}
      </span>
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

// ─── ForgotPasswordPage ──────────────────────────────────────────────────────

/**
 * Étape 1 : l'utilisateur saisit son email.
 * Props:
 *   onSubmit(email: string) → Promise  — appelle POST /auth/forgot-password
 *   onBack()                           — retour vers LoginPage
 */
export function ForgotPasswordPage({ onSubmit, onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handle = async () => {
    setError("");
    if (!email) {
      setError("Saisis ton email.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(email);
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}
        >
          Mot de passe oublié 🔑
        </div>
        <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
          Saisis ton email et on t'envoie un lien de réinitialisation.
        </div>
      </div>

      {sent ? (
        <>
          <SuccessBox message="Si cet email est enregistré, un lien vient d'être envoyé. Vérifie ta boîte (et tes spams 🙂)." />
          <BackLink onClick={onBack} />
        </>
      ) : (
        <>
          <Field
            label="Email"
            icon={<EnvelopeIcon style={{ width: "14px", height: "14px" }} />}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              placeholder="ton@email.com"
              style={inputStyle}
            />
          </Field>

          {error && <ErrorBox message={error} />}

          <PrimaryButton onClick={handle} disabled={loading} loading={loading}>
            Envoyer le lien
          </PrimaryButton>

          <BackLink onClick={onBack} />
        </>
      )}
    </Card>
  );
}

ForgotPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

// ─── ResetPasswordPage ───────────────────────────────────────────────────────

/**
 * Étape 2 : l'utilisateur choisit son nouveau mot de passe.
 * À monter sur la route qui reçoit le token depuis l'URL, ex. /reset-password?token=xxx
 * Props:
 *   token: string                            — extrait de l'URL (useSearchParams)
 *   onSubmit(token, newPassword) → Promise   — appelle POST /auth/reset-password
 *   onBack()                                 — retour vers LoginPage
 */
export function ResetPasswordPage({ token, onSubmit, onBack }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handle = async () => {
    setError("");
    if (!password || !confirm) {
      setError("Remplis les deux champs.");
      return;
    }
    if (password.length < 6) {
      setError("Minimum 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(token, password);
      setDone(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Lien invalide ou expiré. Refais une demande.");
      } else {
        setError("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setLoading(false);
    }
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button
      onClick={onToggle}
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
      {show ? (
        // EyeSlash inline SVG
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: 15, height: 15 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      ) : (
        // Eye inline SVG
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: 15, height: 15 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      )}
    </button>
  );

  return (
    <Card>
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}
        >
          Nouveau mot de passe 🔒
        </div>
        <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
          Choisis un mot de passe sécurisé (6 caractères minimum).
        </div>
      </div>

      {done ? (
        <>
          <SuccessBox message="Mot de passe mis à jour ! Tu peux te connecter." />
          <PrimaryButton onClick={onBack} loading={false}>
            Se connecter
          </PrimaryButton>
        </>
      ) : (
        <>
          <Field
            label="Nouveau mot de passe"
            icon={<LockClosedIcon style={{ width: "14px", height: "14px" }} />}
          >
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handle()}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "42px" }}
              />
              <EyeToggle show={showPw} onToggle={() => setShowPw((s) => !s)} />
            </div>
          </Field>

          <Field
            label="Confirmer le mot de passe"
            icon={<LockClosedIcon style={{ width: "14px", height: "14px" }} />}
          >
            <input
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              placeholder="••••••••"
              style={inputStyle}
            />
          </Field>

          {/* Indicateur de force */}
          {password.length > 0 && <StrengthBar password={password} />}

          {error && <ErrorBox message={error} />}

          <PrimaryButton onClick={handle} disabled={loading} loading={loading}>
            Réinitialiser
          </PrimaryButton>

          <BackLink onClick={onBack} />
        </>
      )}
    </Card>
  );
}

ResetPasswordPage.propTypes = {
  token: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

// ─── Password strength bar ───────────────────────────────────────────────────

function StrengthBar({ password }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s; // 0-4
  })();

  const labels = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

  return (
    <div style={{ marginBottom: "14px", marginTop: "-4px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: i < score ? colors[score] : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div
        style={{ fontSize: "11px", color: colors[score], textAlign: "right" }}
      >
        {labels[score]}
      </div>
    </div>
  );
}

StrengthBar.propTypes = { password: PropTypes.string };
