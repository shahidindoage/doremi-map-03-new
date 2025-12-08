// app/admin/bookings/page.jsx
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminBookingsPage() {
  const cookieStore = cookies();
  const adminToken = cookieStore.get("admin_session")?.value;

  if (!adminToken) redirect("/admin/login");

  const admin = await prisma.admin.findFirst({
    where: { /* your token verification logic */ },
  });
  if (!admin) redirect("/admin/login");

  const bookings = await prisma.booking.findMany({
    orderBy: { bookedAt: "desc" },
  });

  return (
    <div style={{ padding: "40px", fontFamily: "'Poppins', sans-serif", background: "#111", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "30px", color: "#f5c400" }}>All Bookings</h1>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: "#222", textAlign: "left" }}>
              
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Table</th>
              <th style={thStyle}>Seat</th>
              <th style={thStyle}>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => (
              <tr key={b.id} style={{ background: idx % 2 === 0 ? "#1a1a1a" : "#111", transition: "background 0.2s" }}>
                
                <td style={tdStyle}>{b.name}</td>
                <td style={tdStyle}>{b.email}</td>
                <td style={tdStyle}>{b.phone}</td>
                <td style={tdStyle}>{b.tableNumber}</td>
                <td style={tdStyle}>{b.seatNo}</td>
                <td style={tdStyle}>{new Date(b.bookedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        table tr:hover {
          background: #333;
        }
          table td {
          text-align:center;
        }
          table th {
         text-align:center;
        }
      `}</style>
    </div>
  )
}

const thStyle = {
  padding: "12px 15px",
  borderBottom: "2px solid #f5c400",
  fontWeight: 600,
  fontSize: "0.95rem",
};

const tdStyle = {
  padding: "10px 15px",
  fontSize: "0.9rem",
};
