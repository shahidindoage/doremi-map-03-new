"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= PAGE ================= */
export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // for auth check
  const router = useRouter();

  // ------------------- CHECK ADMIN SESSION -------------------
  async function checkAdmin() {
    try {
      const res = await fetch("/api/admin/check-session"); // create this API
      if (!res.ok) {
        router.push("/admin/login"); // redirect if not logged in
      } else {
        setAuthChecked(true);
      }
    } catch (err) {
      router.push("/admin/login");
    }
  }

  useEffect(() => {
    checkAdmin();
  }, []);

  // ------------------- LOAD COUPONS -------------------
  async function loadCoupons() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authChecked) loadCoupons();
  }, [authChecked]);

  // ------------------- DELETE COUPON -------------------
  async function deleteCoupon(id) {
    if (!confirm("Delete this coupon?")) return;
    setLoading(true);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    loadCoupons();
  }

  if (!authChecked) {
    return (
      <div style={{ paddingTop: "20%", color: "#fff",display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'100%' }}>
        <p>Checking admin session...</p>
      </div>
    );
  }

  return (
    <div style={page}>
      <h1 style={title}>All Coupons</h1>

      <button onClick={() => setOpen(true)} style={addBtn}>
        + Add Coupon
      </button>

      {/* ================= LOADER ================= */}
      {loading ? (
        <div style={loaderWrap}>
          <div className="spinner" />
          <p style={{ marginTop: 10 }}>Loading coupons...</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr style={{ background: "#222" }}>
                <th style={th}>Code</th>
                <th style={th}>Discount</th>
                <th style={th}>Type</th>
                <th style={th}>Expiry</th>
                <th style={th}>Usage</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    background: i % 2 === 0 ? "#1a1a1a" : "#111",
                  }}
                >
                  <td style={td}>{c.code}</td>
                  <td style={td}>
                    {c.type === "FIXED"
                      ? `AED ${c.discount}`
                      : `${c.discount}%`}
                  </td>
                  <td style={td}>{c.type}</td>
                  <td style={td}>
                    {new Date(c.expiry).toLocaleString()}
                  </td>
                  <td style={td}>
                    {c.usageCount}
                    {c.maxUsage ? ` / ${c.maxUsage}` : ""}
                  </td>
                  <td style={td}>
                    <button onClick={() => setEditing(c)} style={actionBtn}>
                      Edit
                    </button>{" "}
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      style={{ ...actionBtn, background: "#b91c1c" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {(open || editing) && (
        <CouponModal
          coupon={editing}
          onCancel={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSaved={() => {
            setOpen(false);
            setEditing(null);
            loadCoupons(); // reload after save
          }}
        />
      )}

      {/* ================= CSS ================= */}
      <style>{`
        table tr:hover {
          background: #333;
        }
        table td, table th {
          text-align: center;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 5px solid #333;
          border-top: 5px solid #f5c400;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ================= MODAL ================= */
function CouponModal({ coupon, onCancel, onSaved }) {
  const [code, setCode] = useState(coupon?.code || "");
  const [discount, setDiscount] = useState(coupon?.discount || "");
  const [type, setType] = useState(coupon?.type || "FIXED");
  const [expiry, setExpiry] = useState(
    coupon?.expiry ? coupon.expiry.slice(0, 16) : ""
  );
  const [maxUsage, setMaxUsage] = useState(coupon?.maxUsage || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const payload = { code, discount, type, expiry, maxUsage };

    const url = coupon
      ? `/api/admin/coupons/${coupon.id}`
      : "/api/admin/coupons";

    await fetch(url, {
      method: coupon ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    onSaved(); // reload after save
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ color: "#f5c400", marginBottom: 10 }}>
          {coupon ? "Edit Coupon" : "Add Coupon"}
        </h3>

        <input
          style={input}
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          style={input}
          type="number"
          placeholder="Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <select style={input} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="FIXED">Fixed (AED)</option>
          <option value="PERCENT">Percent (%)</option>
        </select>

        <input
          style={input}
          type="datetime-local"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />

        <input
          style={input}
          type="number"
          placeholder="Max Usage (optional)"
          value={maxUsage}
          onChange={(e) => setMaxUsage(e.target.value)}
        />

        <div style={{ marginTop: 15, textAlign: "right" }}>
          <button onClick={onCancel} style={cancelBtn}>
            Cancel
          </button>{" "}
          <button onClick={save} style={saveBtn} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const page = {
  padding: "40px",
  fontFamily: "'Poppins', sans-serif",
  background: "#111",
  minHeight: "100vh",
  color: "#fff",
};

const title = {
  fontSize: "2rem",
  fontWeight: 700,
  marginBottom: "20px",
  color: "#f5c400",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "900px",
};

const th = {
  padding: "12px 15px",
  borderBottom: "2px solid #f5c400",
  fontWeight: 600,
};

const td = {
  padding: "10px 15px",
  fontSize: "0.9rem",
};

const addBtn = {
  marginBottom: 15,
  padding: "8px 14px",
  background: "#f5c400",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const actionBtn = {
  padding: "4px 10px",
  background: "#2563eb",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  margin: "0 4px",
};

const loaderWrap = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "60px 0",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
};

const modal = {
  background: "#1a1a1a",
  padding: 20,
  width: 360,
  borderRadius: 8,
};

const input = {
  width: "100%",
  padding: 8,
  marginBottom: 8,
  background: "#111",
  color: "#fff",
  border: "1px solid #333",
};

const cancelBtn = {
  padding: "6px 12px",
  background: "#444",
  border: "none",
  color: "#fff",
};

const saveBtn = {
  padding: "6px 12px",
  background: "#f5c400",
  border: "none",
  fontWeight: 600,
};
