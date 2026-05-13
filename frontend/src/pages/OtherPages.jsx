import MovieCard from '../components/MovieCard'
import { EmptyState } from '../components/Loader'
import { MOVIES } from '../data/movies'
import PropTypes from 'prop-types'

// ── Favoris ───────────────────────────────────────────────────────────────────
export function FavoritesPage({ favorites, onMovieClick, onToggleFav }) {
  const favMovies = MOVIES.filter(m => favorites.includes(m.id))

  if (favMovies.length === 0) {
    return (
      <EmptyState
        icon="♡"
        title="Aucun favori"
        subtitle="Cliquez sur le cœur d'un film pour l'ajouter à vos favoris."
      />
    )
  }

  return (
    <div className="fade-in">
      <div style={{ fontSize: '13px', color: 'rgba(200,210,255,0.4)', marginBottom: '22px' }}>
        <span style={{ color: '#f0f2ff', fontWeight: '600' }}>{favMovies.length}</span>{' '}
        film{favMovies.length > 1 ? 's' : ''} en favori
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '18px' }}>
        {favMovies.map(m => (
          <MovieCard key={m.id} movie={m} onClick={() => onMovieClick(m)}
            isFav={true} onToggleFav={onToggleFav} />
        ))}
      </div>
    </div>
  )
}

FavoritesPage.propTypes = {
  favorites:   PropTypes.array.isRequired,
  onMovieClick:PropTypes.func.isRequired,
  onToggleFav: PropTypes.func.isRequired,
}

// ── Tendances ─────────────────────────────────────────────────────────────────
export function TrendingPage({ onMovieClick, favorites, onToggleFav }) {
  const trending = [...MOVIES].sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
  const top  = trending[0]
  const rest = trending.slice(1)

  return (
    <div className="fade-in">
      {/* Hero tendance N°1 */}
      {top && (
        <div onClick={() => onMovieClick(top)}
          style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', marginBottom: '30px', cursor: 'pointer', height: '280px' }}>
          <img src={top.poster} alt={top.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
            onError={e => e.target.style.display = 'none'} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(7,9,26,0.92) 0%, rgba(7,9,26,0.6) 50%, transparent 100%)',
            display: 'flex', alignItems: 'center', padding: '40px',
          }}>
            <div style={{ maxWidth: '460px' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(97deg,#3d7cff,#8b5cf6)',
                borderRadius: '8px', padding: '4px 12px', fontSize: '11px',
                fontWeight: '700', marginBottom: '14px', letterSpacing: '1px',
              }}>🔥 N°1 DES TENDANCES</div>
              <div style={{ fontSize: '32px', fontWeight: '700', lineHeight: 1.2, marginBottom: '10px' }}>{top.title}</div>
              <div style={{ fontSize: '13px', color: 'rgba(200,210,255,0.6)', marginBottom: '14px', lineHeight: 1.6 }}>
                {top.overview.slice(0, 130)}…
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '13px', color: 'rgba(200,210,255,0.5)' }}>
                <span style={{ color: '#f4a320', fontWeight: '700' }}>★ {top.rating}</span>
                <span>·</span><span>{top.year}</span>
                <span>·</span><span>{top.genre}</span>
                <span>·</span><span>{top.votes} votes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px' }}>Autres tendances</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '18px' }}>
        {rest.map(m => (
          <MovieCard key={m.id} movie={m} onClick={() => onMovieClick(m)}
            isFav={favorites.includes(m.id)} onToggleFav={onToggleFav} />
        ))}
      </div>
    </div>
  )
}

TrendingPage.propTypes = {
  onMovieClick:PropTypes.func.isRequired,
  favorites:   PropTypes.array.isRequired,
  onToggleFav: PropTypes.func.isRequired,
}

// ── Paramètres ────────────────────────────────────────────────────────────────
export function SettingsPage() {
  return (
    <div className="fade-in" style={{ maxWidth: '680px' }}>
      <SettingSection title="🎨 Apparence">
        <SettingRow label="Thème sombre" sub="Interface optimisée pour les films">
          <Toggle on={true} />
        </SettingRow>
        <SettingRow label="Langue" sub="Langue de l'interface">
          <select style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f0f2ff', padding: '6px 12px', fontSize: '13px' }}>
            <option>🇫🇷 Français</option>
            <option>🇬🇧 English</option>
          </select>
        </SettingRow>
      </SettingSection>

      <SettingSection title="🔔 Notifications">
        <SettingRow label="Notifications push" sub="Nouvelles sorties et recommandations">
          <Toggle on={true} />
        </SettingRow>
        <SettingRow label="Newsletter" sub="Résumé hebdomadaire par email">
          <Toggle on={false} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="🗄️ Données">
        <SettingRow label="Source" sub="Source des données films">
          <span style={{ fontSize: '13px', color: 'rgba(200,210,255,0.5)' }}>TMDB API</span>
        </SettingRow>
        <SettingRow label="Cache" sub="Durée de validité du cache">
          <span style={{ fontSize: '13px', color: '#3d7cff', fontWeight: '600' }}>Redis — 5 min</span>
        </SettingRow>
      </SettingSection>

      <SettingSection title="ℹ️ À propos">
        <SettingRow label="Version" sub="CineDB">
          <span style={{ fontSize: '12px', color: 'rgba(200,210,255,0.4)' }}>v1.0.0</span>
        </SettingRow>
        <SettingRow label="Stack" sub="Technologies utilisées">
          <span style={{ fontSize: '12px', color: 'rgba(200,210,255,0.4)' }}>React · FastAPI · PostgreSQL · Docker</span>
        </SettingRow>
        <SettingRow label="Films" sub="Catalogue actuel">
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#3d7cff' }}>25</span>
        </SettingRow>
      </SettingSection>
    </div>
  )
}

function SettingSection({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '14px', fontWeight: '700', color: '#3d7cff', marginBottom: '16px' }}>{title}</div>
      {children}
    </div>
  )
}

function SettingRow({ label, sub, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '500' }}>{label}</div>
        {sub && <div style={{ fontSize: '12px', color: 'rgba(200,210,255,0.4)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ on }) {
  return (
    <div style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: on ? 'linear-gradient(97deg,#3d7cff,#8b5cf6)' : 'rgba(255,255,255,0.15)',
      position: 'relative', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: '3px', left: on ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}
