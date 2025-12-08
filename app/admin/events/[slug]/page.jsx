'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminMenu from '@/components/AdminMenu'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(true)
  const slug = 'grand-music-night-2025'

  useEffect(() => {
    async function init() {
      // 1️⃣ Check admin session
      const sessionRes = await fetch('/api/admin/check-session')
      if (!sessionRes.ok) {
        router.push('/admin/login')
        return
      }
      const sessionJson = await sessionRes.json()
      setAdmin(sessionJson.admin)

      // 2️⃣ Fetch event & seats
      await fetchSeats()
    }
    init()
  }, [])

  async function fetchSeats() {
    setLoading(true)
    const res = await fetch(`/api/admin/events/${slug}/seats`)
    const json = await res.json()
    if (res.ok && json.event) setEventData(json.event)
    setLoading(false)
  }

  async function toggleSeat(seatId, currentStatus) {
    const newStatus = currentStatus === 'BOOKED' ? 'AVAILABLE' : 'BOOKED'
    const res = await fetch(`/api/admin/seats/${seatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) await fetchSeats()
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading)
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loader}></div>
        <p>Loading dashboard...</p>
      </div>
    )

  if (!eventData)
    return (
      <div style={styles.noData}>
        <p>No data found</p>
      </div>
    )

  return (
    <div style={styles.page}>
      {/* ✅ Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🎫 Admin Dashboard</h1>
        <AdminMenu adminRole={admin?.role} onLogout={handleLogout} />
      </header>

      {/* ✅ Event Overview */}
      <div style={styles.eventBox}>
        <h2 style={styles.eventTitle}>{eventData.title}</h2>
        <p style={styles.eventInfo}>Total Tables: {eventData.tables.length}</p>
      </div>

      {/* ✅ Table Cards */}
      <div style={styles.tablesWrap}>
        {eventData.tables.map((t) => (
          <div key={t.number} style={styles.tableCard}>
            <h3 style={styles.tableHeader}>
              Table {t.number}
              <span style={styles.priceTag}>{Number(t.price).toFixed(3)} AED</span>
            </h3>

            <div style={styles.seatsWrap}>
              {t.seats.map((s) => (
                <div
                  key={s.id}
                  style={{
                    ...styles.seatItem,
                    background:
                      s.status === 'BOOKED'
                        ? '#e74c3c'
                        : s.status === 'BLOCKED'
                        ? '#7f8c8d'
                        : '#27ae60',
                    boxShadow:
                      s.status === 'BOOKED'
                        ? '0 0 8px rgba(231,76,60,0.6)'
                        : s.status === 'BLOCKED'
                        ? '0 0 6px rgba(127,140,141,0.5)'
                        : '0 0 8px rgba(39,174,96,0.6)',
                  }}
                  onClick={() => toggleSeat(s.id, s.status)}
                  title={`Seat ${t.number}-${s.seatNo} (${s.status})`}
                >
                  {t.number}-{s.seatNo}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ✅ Modern Styles */
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    padding: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: 30,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  title: { fontSize: '1.5rem', fontWeight: 600, color: '#f5c400' },
  eventBox: {
    textAlign: 'center',
    marginBottom: 30,
    padding: 20,
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  eventTitle: { fontSize: '1.4rem', color: '#f5c400', marginBottom: 6 },
  eventInfo: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' },
  tablesWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  tableCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, color: '#fff' },
  priceTag: { background: '#f5c400', color: '#111', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem' },
  seatsWrap: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  seatItem: {
    flex: '1 1 28%',
    minWidth: 70,
    textAlign: 'center',
    padding: '8px 0',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  loadingWrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#f5c400', fontFamily: "'Poppins', sans-serif'" },
  loader: { width: 40, height: 40, border: '4px solid rgba(255,255,255,0.2)', borderTop: '4px solid #f5c400', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  noData: { padding: 40, textAlign: 'center', color: '#999' },
}
