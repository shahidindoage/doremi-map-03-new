'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) router.push('/admin/events/grand-music-night-2025')
    else {
      const json = await res.json()
      setError(json.error)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
        fontFamily: "'Poppins', sans-serif",
        color: '#fff',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: 180,
          height: 180,
          background: 'radial-gradient(circle, rgba(245,196,0,0.5), transparent 60%)',
          filter: 'blur(80px)',
          animation: 'float 6s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '20%',
          width: 220,
          height: 220,
          background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float2 7s ease-in-out infinite alternate',
        }}
      />

      {/* Card Container */}
      <div
        style={{
          zIndex: 2,
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          padding: '45px 35px',
          boxShadow: '0 0 40px rgba(0,0,0,0.4)',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'fadeIn 1s ease',
        }}
      >
        <h1
          style={{
            color: '#f5c400',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '10px',
          }}
        >
          Welcome Back 👋
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '25px',
          }}
        >
          Admin access panel for managing <strong>Grand Music Night 2025</strong>
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: '0.3s border',
              }}
              onFocus={(e) => (e.currentTarget.style.border = '1px solid #f5c400')}
              onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)')}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 40px 12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: '0.3s border',
              }}
              onFocus={(e) => (e.currentTarget.style.border = '1px solid #f5c400')}
              onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)')}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f5c400, #ffde6a)',
              color: '#111',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: '0.2s transform, 0.2s box-shadow',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,196,0,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Login
          </button>
        </form>

        {error && (
          <p style={{ color: '#ff6b6b', marginTop: 15, fontWeight: 500 }}>{error}</p>
        )}

        <p
          style={{
            fontSize: '0.8rem',
            marginTop: '25px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Having trouble logging in? Contact system support.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-25px); }
        }
        @keyframes float2 {
          from { transform: translateY(0); }
          to { transform: translateY(25px); }
        }
      `}</style>
    </div>
  )
}
