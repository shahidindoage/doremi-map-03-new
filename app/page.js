'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at top right, #1a1a1a, #000)',
        color: '#fff',
        fontFamily: "'Poppins', Arial, sans-serif",
        textAlign: 'center',
        padding: '40px 20px'
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: '2.4rem',
          fontWeight: 700,
          letterSpacing: '1px',
          marginBottom: 10,
          color: '#f5c400',
          textShadow: '0 0 12px rgba(245,196,0,0.4)'
        }}
      >
        Event Seat Booking
      </h1>

      <p
        style={{
          fontSize: '1rem',
          opacity: 0.85,
          marginBottom: 30,
          maxWidth: 400,
          lineHeight: 1.6
        }}
      >
        Explore the live seat layout or manage bookings via the admin dashboard.
      </p>

      {/* Links Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          maxWidth: '320px'
        }}
      >
        <Link
          href="/event/grand-music-night-2025"
          style={{
            display: 'inline-block',
            width: '100%',
            padding: '14px 20px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f5c400, #ffde6a)',
            color: '#111',
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.3px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 10px rgba(245,196,0,0.25)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)'
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(245,196,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(245,196,0,0.25)'
          }}
        >
          🎟 Visit Event Page
        </Link>

        <Link
          href="/admin/events/grand-music-night-2025"
          style={{
            display: 'inline-block',
            width: '100%',
            padding: '14px 20px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #333, #111)',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.3px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)'
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)'
          }}
        >
          ⚙️ Admin Dashboard
        </Link>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: 20,
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        © {new Date().getFullYear()} Grand Music Night — Demo
      </footer>
    </main>
  )
}
