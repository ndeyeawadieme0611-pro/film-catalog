import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Loader({ text = "Chargement..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: "16px",
      }}
    >
      <div className="spinner" />
      <p style={{ fontSize: "14px", color: "rgba(200,210,255,0.4)" }}>{text}</p>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,100,100,0.15)",
        borderRadius: "14px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "rgba(255,80,80,0.1)",
          border: "1px solid rgba(255,100,100,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <ExclamationTriangleIcon
          style={{ width: "26px", height: "26px", color: "#ff6464" }}
        />
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "6px",
          color: "#f0f2ff",
        }}
      >
        Erreur de chargement
      </div>
      <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
        {message}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title = "Aucun résultat", subtitle }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "18px",
          background: "rgba(61,124,255,0.08)",
          border: "1px solid rgba(61,124,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        {icon ? (
          <span style={{ fontSize: "28px" }}>{icon}</span>
        ) : (
          <MagnifyingGlassIcon
            style={{
              width: "28px",
              height: "28px",
              color: "rgba(61,124,255,0.6)",
            }}
          />
        )}
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "8px",
          color: "#f0f2ff",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: "13px", color: "rgba(200,210,255,0.4)" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
