'use client'; // mark this as a client component

export default function CancelPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #111, #1a1a1a)",
        fontFamily: "'Poppins', sans-serif",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          padding: "50px 40px",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(255,0,0,0.4)",
          border: "1px solid rgba(255,0,0,0.3)",
          maxWidth: "400px",
          width: "100%",
          animation: "fadeIn 1s ease",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", color: "#ff4c4c", marginBottom: "20px" }}>
          ❌ Payment Cancelled
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>
          Your payment was not completed. You can try again.
        </p>
        <a
          href="/event/grand-music-night-2025"
          style={{
            display: "inline-block",
            padding: "12px 25px",
            background: "linear-gradient(135deg, #ff4c4c, #ff7b7b)",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to Events
        </a>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
