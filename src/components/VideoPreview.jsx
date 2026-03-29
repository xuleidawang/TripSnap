import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Share2, MapPin, Clock, Volume2, VolumeX } from 'lucide-react'

// ─── Theme fallbacks — only used when slidePhotos is empty ────────────────────
const FALLBACK_SLIDES = {
  coastal: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520116468816-95b69f847357?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800&auto=format&fit=crop',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800&auto=format&fit=crop',
  ],
  urban: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop',
  ],
  desert: [
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531974338395-2e2d5f4f5b52?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525811902-f2342640856e?q=80&w=800&auto=format&fit=crop',
  ],
  tropical: [
    'https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?q=80&w=800&auto=format&fit=crop',
  ],
  zen: [
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
  ],
  cultural: [
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=800&auto=format&fit=crop',
  ],
}

// ─── getPlanPhotos ─────────────────────────────────────────────────────────────
// Priority order:
//   1. plan.slidePhotos — if the plan already has photos (feed cards or wikipedia hits), use them as-is
//   2. plan.userPhoto   — user's own snapped photo goes first, then fill with fallbacks
//   3. theme fallbacks  — when there's nothing else
function getPlanPhotos(plan) {
  const theme    = plan.destinationTheme || 'zen'
  const fallback = FALLBACK_SLIDES[theme] || FALLBACK_SLIDES.zen

  // Feed plans & plans with Wikipedia photos: slidePhotos is already complete — use directly
  if (plan.slidePhotos?.length >= 1) {
    const photos = plan.slidePhotos.filter(Boolean)
    // pad to 4 if needed
    while (photos.length < 4) photos.push(fallback[photos.length % fallback.length])
    return photos.slice(0, 4)
  }

  // User-created plans with no Wikipedia results: lead with their own photo
  if (plan.userPhoto) {
    const result = [plan.userPhoto, ...fallback].filter(Boolean).slice(0, 4)
    while (result.length < 4) result.push(fallback[result.length % fallback.length])
    return result
  }

  // Last resort
  return fallback
}

// ─── Web Audio ambient engine ─────────────────────────────────────────────────
function createAmbientAudio(theme) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2)
  master.connect(ctx.destination)

  const themeFreqs = {
    coastal:  [220, 330, 440, 165],
    mountain: [196, 294, 392, 147],
    urban:    [261, 349, 523, 174],
    desert:   [174, 261, 349, 130],
    tropical: [293, 440, 587, 220],
    zen:      [256, 384, 512, 192],
    cultural: [240, 360, 480, 180],
  }
  const freqs = themeFreqs[theme] || themeFreqs.zen

  const oscs = freqs.map((freq, i) => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 800

    osc.type = i % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(freq * 1.002, ctx.currentTime + 4)

    gain.gain.setValueAtTime(0.3 / freqs.length, ctx.currentTime)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(master)
    osc.start()
    return osc
  })

  return {
    stop: () => {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(() => {
        oscs.forEach(o => { try { o.stop() } catch {} })
        ctx.close()
      }, 1600)
    },
  }
}

// ─── VideoPreview ─────────────────────────────────────────────────────────────
export default function VideoPreview({ plan, onClose }) {
  const photos    = getPlanPhotos(plan)
  const [slide, setSlide]       = useState(0)
  const [playing, setPlaying]   = useState(true)
  const [muted, setMuted]       = useState(false)
  const [loaded, setLoaded]     = useState({})
  const audioRef  = useRef(null)
  const timerRef  = useRef(null)
  const DURATION  = 4000

  // Preload all images
  useEffect(() => {
    photos.forEach((url, i) => {
      if (!url) return
      const img = new Image()
      img.onload  = () => setLoaded(prev => ({ ...prev, [i]: true }))
      img.onerror = () => setLoaded(prev => ({ ...prev, [i]: 'err' }))
      img.src = url
    })
  }, [])

  // Audio
  useEffect(() => {
    if (!muted) {
      try { audioRef.current = createAmbientAudio(plan.destinationTheme || 'zen') } catch {}
    }
    return () => { try { audioRef.current?.stop() } catch {} }
  }, [])

  const toggleMute = () => {
    setMuted(m => {
      if (!m) { try { audioRef.current?.stop(); audioRef.current = null } catch {} }
      else     { try { audioRef.current = createAmbientAudio(plan.destinationTheme || 'zen') } catch {} }
      return !m
    })
  }

  // Auto-advance
  useEffect(() => {
    if (!playing) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % photos.length)
    }, DURATION)
    return () => clearInterval(timerRef.current)
  }, [playing, photos.length])

  const goTo = useCallback((i) => {
    setSlide(i)
    clearInterval(timerRef.current)
    if (playing) {
      timerRef.current = setInterval(() => setSlide(s => (s + 1) % photos.length), DURATION)
    }
  }, [playing, photos.length])

  const currentPhoto = photos[slide]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col max-w-[430px] mx-auto"
    >
      {/* ── Slide background ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div key={slide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt={`Slide ${slide + 1}`}
                className="w-full h-full object-cover"
                style={{ display: loaded[slide] === 'err' ? 'none' : 'block' }}
              />
            ) : null}
            {/* fallback gradient if image errors */}
            {(!currentPhoto || loaded[slide] === 'err') && (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
            )}
          </motion.div>
        </AnimatePresence>
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      </div>

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <X size={18} className="text-white" />
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {photos.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        <button onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          {muted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
        </button>
      </div>

      {/* ── Bottom info ── */}
      <div className="relative z-10 mt-auto px-5 pb-10">
        <motion.div key={slide} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={13} className="text-white/70" />
            <span className="text-xs text-white/70 font-medium">{plan.location}</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1 leading-tight">{plan.title}</h2>
          <div className="flex items-center gap-1.5 mb-5">
            <Clock size={13} className="text-white/60" />
            <span className="text-xs text-white/60">{plan.days} days · {plan.estimatedBudget || 'Budget varies'}</span>
          </div>

          {/* Highlights */}
          {plan.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {plan.highlights.slice(0, 3).map((h, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                  {h}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setPlaying(p => !p)}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            {playing
              ? <Pause size={20} className="text-white" />
              : <Play  size={20} className="text-white ml-0.5" />}
          </button>
          <button
            className="flex-1 h-12 rounded-full bg-white text-sm font-bold flex items-center justify-center gap-2"
            style={{ color: 'var(--color-accent, #6c63ff)' }}>
            <Share2 size={16} /> Share Trip
          </button>
        </div>
      </div>
    </motion.div>
  )
}
