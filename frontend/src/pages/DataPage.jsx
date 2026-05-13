import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { MOVIES } from '../data/movies'
import { fetchStats } from '../services/api'

// ── Données graphiques ────────────────────────────────────────────────────────
const monthData = [
  { m:'Jan', films:18 }, { m:'Fév', films:24 }, { m:'Mar', films:20 },
  { m:'Avr', films:34 }, { m:'Mai', films:29 }, { m:'Juin', films:38 },
  { m:'Juil', films:42 }, { m:'Aoû', films:36 }, { m:'Sep', films:45 },
  { m:'Oct', films:52 }, { m:'Nov', films:48 }, { m:'Déc', films:56 },
]

const genreData = [
  { g:'Action', n:2800 }, { g:'Drama', n:3200 }, { g:'Sci-Fi', n:1900 },
  { g:'Horror', n:1400 }, { g:'Comedy', n:2100 },
]

// ── Tooltip personnalisé ──────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(13,16,51,0.97)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '9px', padding: '10px 14px',
    }}>
      <div style={{ fontSize: '11px', color: 'rgba(200,210,255,0.45)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: '700', color: '#3d7cff' }}>{payload[0].value} films</div>
    </div>
  )
}

// ── Card de stats ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, change }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(200,210,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
          <div style={{ fontSize: '12px', color, marginTop: '4px', fontWeight: '500' }}>{change}</div>
        </div>
        <div style={{
          width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
          background: `${color}20`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DataPage({ favorites, onMovieClick }) {
  const [stats, setStats] = useState(null)
  const topMovies = [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 5)

  useEffect(() => { fetchStats().then(setStats) }, [])

  const STAT_CARDS = [
    { label:'Films total',   value: stats?.total ?? MOVIES.length, icon:'🎬', color:'#3d7cff', change:'+5 ce mois' },
    { label:'Genres',        value: stats?.genres ?? 7,             icon:'✦',  color:'#8b5cf6', change:'catégories' },
    { label:'Note moyenne',  value: stats?.avgRating ?? '8.5',      icon:'★',  color:'#f4a320', change:'/10 IMDb' },
    { label:'Mes favoris',   value: favorites.length,               icon:'♥',  color:'#00d9b0', change:'dans ma liste' },
  ]

  return (
    <div className="fade-in">
      {/* Stats cards */}
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginBottom: '24px' }}>
        {STAT_CARDS.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Graphiques */}
      <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px', marginBottom: '24px' }}>
        {/* Area chart */}
        <div className="card">
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '2px' }}>Ajouts par mois</div>
          <div style={{ fontSize: '12px', color: 'rgba(200,210,255,0.4)', marginBottom: '20px' }}>
            <span style={{ color: '#00d9b0', fontWeight: '600' }}>+22% </span>vs année précédente
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthData} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="filmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d7cff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3d7cff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: 'rgba(200,210,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(200,210,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="films" stroke="#3d7cff" strokeWidth={2.5} fill="url(#filmGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="card">
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '2px' }}>Par genre</div>
          <div style={{ fontSize: '12px', color: 'rgba(200,210,255,0.4)', marginBottom: '20px' }}>Distribution du catalogue</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={genreData} margin={{ top:5, right:5, left:-20, bottom:0 }} barSize={20}>
              <XAxis dataKey="g" tick={{ fill: 'rgba(200,210,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(200,210,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,16,51,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px' }}
                itemStyle={{ color: '#8b5cf6' }} labelStyle={{ color: 'rgba(200,210,255,0.5)', fontSize: '11px' }} />
              <Bar dataKey="n" fill="#8b5cf6" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top films */}
      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px' }}>🏆 Top films notés</div>
        {topMovies.map((m, i) => (
          <div key={m.id} onClick={() => onMovieClick(m)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '12px 0', cursor: 'pointer',
              borderBottom: i < topMovies.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
              background: i === 0 ? 'linear-gradient(135deg,#f4a320,#ff6b35)' : 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700',
              color: i === 0 ? '#fff' : 'rgba(200,210,255,0.4)',
            }}>{i + 1}</div>
            <img src={m.poster} alt={m.title} onError={e => e.target.style.display = 'none'}
              style={{ width: '36px', height: '54px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(200,210,255,0.4)' }}>{m.year} · {m.genre}</div>
            </div>
            <div style={{
              background: 'rgba(244,163,32,0.12)', borderRadius: '8px',
              padding: '4px 10px', fontSize: '13px', fontWeight: '700', color: '#f4a320',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>★ {m.rating}</div>
            {favorites.includes(m.id) && <div style={{ color: '#3d7cff', fontSize: '16px' }}>♥</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
