'use client';

export default function SuccessPage({ searchParams }) {
  const { table, seat } = searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
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
          boxShadow: "0 0 40px rgba(0,255,0,0.3)",
          border: "1px solid rgba(0,255,0,0.2)",
          maxWidth: "400px",
          width: "100%",
          animation: "fadeIn 1s ease",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", color: "#00ff7f", marginBottom: "20px" }}>
          ✅ Payment Successful!
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>
          Your seats <strong>{table}{seat}</strong> are confirmed.
        </p>
        <a
          href="/event/grand-music-night-2025"
          style={{
            display: "inline-block",
            padding: "12px 25px",
            background: "linear-gradient(135deg, #00ff7f, #66ffb3)",
            borderRadius: "10px",
            color: "#111",
            fontWeight: 600,
            textDecoration: "none",
            transition: "0.3s transform, 0.3s box-shadow",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,255,127,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
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
