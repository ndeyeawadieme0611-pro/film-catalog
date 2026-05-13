import { useState } from 'react'
import PropTypes from 'prop-types'
import { GENRE_COLORS } from '../data/movies'

export default function MovieCard({ movie, onClick, isFav, onToggleFav }) {
  const [hover, setHover]   = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const gc = GENRE_COLORS[movie.genre] || '#3d7cff'

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        background: hover ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.045)',
        border: `1px solid ${hover ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.09)'}`,
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        transform: hover ? 'translateY(-4px)' : 'none',
        boxShadow: hover
          ? '0 20px 50px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* ── Poster ── */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
        {!imgErr ? (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgErr(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 0.3s',
              transform: hover ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${gc}22, rgba(7,9,26,0.9))`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', fontSize: '40px',
          }}>
            🎬
            <div style={{ fontSize: '12px', color: 'rgba(200,210,255,0.5)', marginTop: '8px', padding: '0 10px', textAlign: 'center' }}>
              {movie.title}
            </div>
          </div>
        )}

        {/* Gradient bas */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(7,9,26,0.85) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Badge note */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(7,9,26,0.8)', backdropFilter: 'blur(8px)',
          borderRadius: '8px', padding: '4px 9px',
          fontSize: '12px', fontWeight: '700', color: '#f4a320',
          border: '1px solid rgba(244,163,32,0.3)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          ★ {movie.rating}
        </div>

        {/* Bouton favori */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(movie.id) }}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '30px', height: '30px', borderRadius: '50%', border: 'none',
            background: isFav ? 'rgba(61,124,255,0.9)' : 'rgba(7,9,26,0.7)',
            backdropFilter: 'blur(8px)', color: '#fff', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: isFav ? '0 4px 12px rgba(61,124,255,0.5)' : 'none',
          }}
        >
          {isFav ? '♥' : '♡'}
        </button>

        {/* Tag genre */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '10px',
          background: `${gc}25`, backdropFilter: 'blur(8px)',
          borderRadius: '7px', padding: '3px 10px',
          fontSize: '11px', fontWeight: '600', color: gc,
          border: `1px solid ${gc}40`,
        }}>
          {movie.genre}
        </div>
      </div>

      {/* ── Infos ── */}
      <div style={{ padding: '14px 14px 16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', lineHeight: 1.3, color: '#f0f2ff' }}>
          {movie.title}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(200,210,255,0.45)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>{movie.year}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{movie.runtime}</span>
        </div>
      </div>
    </article>
  )
}

MovieCard.propTypes = {
  movie:       PropTypes.object.isRequired,
  onClick:     PropTypes.func.isRequired,
  isFav:       PropTypes.bool.isRequired,
  onToggleFav: PropTypes.func.isRequired,
}
