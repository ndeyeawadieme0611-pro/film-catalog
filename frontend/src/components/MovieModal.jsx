import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GENRE_COLORS } from '../data/movies'
import { fetchSimilar } from '../services/api'
import MovieCard from './MovieCard'

export default function MovieModal({ movie, onClose, isFav, onToggleFav, onMovieClick }) {
  const [imgErr,   setImgErr]   = useState(false)
  const [similar,  setSimilar]  = useState([])
  const gc = GENRE_COLORS[movie.genre] || '#3d7cff'

  // Fermer sur Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Charger films similaires
  useEffect(() => {
    fetchSimilar(movie.id).then(setSimilar).catch(() => {})
  }, [movie.id])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={movie.title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(7,9,26,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '780px',
          background: 'linear-gradient(135deg, rgba(13,16,51,0.98) 0%, rgba(7,9,26,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* ── Partie principale ── */}
        <div style={{ display: 'flex', overflow: 'hidden', flex: 1, minHeight: 0 }}>
          {/* Poster */}
          <div style={{ width: '240px', flexShrink: 0, position: 'relative' }}>
            {!imgErr ? (
              <img
                src={movie.poster}
                alt={movie.title}
                onError={() => setImgErr(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%', minHeight: '380px',
                background: `linear-gradient(135deg, ${gc}22, rgba(7,9,26,0.9))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px',
              }}>🎬</div>
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 60%, rgba(7,9,26,0.6) 100%)',
            }} />
          </div>

          {/* Contenu */}
          <div style={{ flex: 1, padding: '28px 28px 24px', overflowY: 'auto' }}>
            {/* Fermer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                onClick={onClose}
                aria-label="Fermer"
                style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: 'rgba(200,210,255,0.6)',
                  width: '30px', height: '30px', cursor: 'pointer', fontSize: '14px',
                }}
              >✕</button>
            </div>

            {/* Genre + année */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                background: `${gc}20`, border: `1px solid ${gc}40`,
                borderRadius: '7px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '600', color: gc,
              }}>{movie.genre}</span>
              <span style={{ fontSize: '13px', color: 'rgba(200,210,255,0.4)' }}>
                {movie.year} · {movie.runtime}
              </span>
            </div>

            {/* Titre */}
            <h2 style={{ fontSize: '24px', fontWeight: '700', lineHeight: 1.2, marginBottom: '16px' }}>
              {movie.title}
            </h2>

            {/* Note + favori */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '22px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(244,163,32,0.12)', border: '1px solid rgba(244,163,32,0.25)',
                borderRadius: '10px', padding: '8px 14px',
              }}>
                <span style={{ fontSize: '16px' }}>★</span>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#f4a320' }}>{movie.rating}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(200,210,255,0.4)' }}>{movie.votes} votes</div>
                </div>
              </div>
              <button
                onClick={() => onToggleFav(movie.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: isFav ? 'rgba(61,124,255,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isFav ? 'rgba(61,124,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
                  color: isFav ? '#3d7cff' : 'rgba(200,210,255,0.5)',
                  fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
                }}
              >
                {isFav ? '♥ Favori' : '♡ Ajouter'}
              </button>
            </div>

            {/* Synopsis */}
            <ModalSection label="Synopsis">
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'rgba(200,210,255,0.7)' }}>
                {movie.overview}
              </p>
            </ModalSection>

            {/* Réalisateur */}
            <ModalSection label="Réalisateur">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.05)', borderRadius: '9px',
                padding: '8px 14px', fontSize: '13px', fontWeight: '500',
              }}>
                🎬 {movie.director}
              </div>
            </ModalSection>

            {/* Casting */}
            <ModalSection label="Casting">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(movie.cast || []).map((actor, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '8px', padding: '6px 12px',
                    fontSize: '13px', color: 'rgba(200,210,255,0.7)',
                  }}>{actor}</span>
                ))}
              </div>
            </ModalSection>
          </div>
        </div>

        {/* ── Films similaires ── */}
        {similar.length > 0 && (
          <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{
              fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
              textTransform: 'uppercase', color: 'rgba(200,210,255,0.35)', marginBottom: '14px',
            }}>Films similaires</div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {similar.slice(0, 5).map(m => (
                <div
                  key={m.id}
                  onClick={() => onMovieClick(m)}
                  style={{
                    flexShrink: 0, width: '80px', cursor: 'pointer',
                    borderRadius: '8px', overflow: 'hidden',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={m.poster}
                    alt={m.title}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block', borderRadius: '8px' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <div style={{ fontSize: '10px', color: 'rgba(200,210,255,0.5)', marginTop: '4px',
                    textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {m.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ModalSection({ label, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
        textTransform: 'uppercase', color: 'rgba(200,210,255,0.35)', marginBottom: '10px',
      }}>{label}</div>
      {children}
    </div>
  )
}

MovieModal.propTypes = {
  movie:       PropTypes.object.isRequired,
  onClose:     PropTypes.func.isRequired,
  isFav:       PropTypes.bool.isRequired,
  onToggleFav: PropTypes.func.isRequired,
  onMovieClick:PropTypes.func.isRequired,
}
