import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Upload, MapPin, CheckCircle2, ChevronRight, Loader2, Sliders, RefreshCw } from 'lucide-react'

const INTERESTS = ['History', 'Food', 'Nature', 'Art', 'Adventure', 'Shopping', 'Nightlife', 'Wellness']
const BUDGETS   = [
  { id: 'budget',   label: 'Budget',   desc: 'Hostels, street food, free sights' },
  { id: 'moderate', label: 'Moderate', desc: 'Mid-range hotels, local restaurants' },
  { id: 'luxury',   label: 'Luxury',   desc: 'Premium stays, fine dining, VIP access' },
]

const DESTINATION_THEME_MAP = {
  coastal: 'coastal', mountain: 'mountain', urban: 'urban',
  desert: 'desert', tropical: 'tropical', zen: 'zen', cultural: 'cultural',
}

function compressImage(file, maxWidth = 1024) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale  = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width  = img.width  * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.src = url
  })
}

// ── Step 1: Upload ─────────────────────────────────────────────────────────────
function StepUpload({ onPhotoSelected }) {
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const base64 = await compressImage(file)
    onPhotoSelected(base64)
  }, [onPhotoSelected])

  return (
    <div className="flex-1 flex flex-col px-4 pb-8 pt-4">
      <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-1">Where to?</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">Snap or upload a photo — AI figures out the rest.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => fileRef.current?.click()}
        className={`flex-1 min-h-[280px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed cursor-pointer transition-colors ${
          dragging ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--color-line)] bg-white'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, var(--color-accent)20, var(--color-accent-light)20)' }}>
          <Upload size={28} style={{ color: 'var(--color-accent)' }} />
        </div>
        <p className="font-bold text-[var(--color-text-primary)] mb-1">Upload a photo</p>
        <p className="text-sm text-[var(--color-text-secondary)]">or drag and drop</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[var(--color-line)]" />
        <span className="text-xs text-[var(--color-text-secondary)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-line)]" />
      </div>

      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => fileRef.current && Object.assign(fileRef.current, { capture: 'environment' }) && fileRef.current.click()}
        className="w-full h-13 rounded-2xl border border-[var(--color-line)] bg-white font-bold text-sm flex items-center justify-center gap-2"
        style={{ color: 'var(--color-text-secondary)' }}>
        <Camera size={18} /> Take a Photo
      </motion.button>
    </div>
  )
}

// ── Step 2: Analyzing ──────────────────────────────────────────────────────────
function StepAnalyzing({ photoBase64 }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
      <div className="w-full max-w-sm rounded-3xl overflow-hidden mb-8 shadow-xl">
        <img src={photoBase64} alt="Uploaded" className="w-full h-64 object-cover" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        <p className="font-bold text-[var(--color-text-primary)]">Identifying your destination...</p>
        <p className="text-sm text-[var(--color-text-secondary)] text-center">AI is reading the photo and finding the best match</p>
      </div>
    </div>
  )
}

// ── Step 3: Confirm ────────────────────────────────────────────────────────────
function StepConfirm({ photoBase64, analysis, onConfirm, onRetry }) {
  return (
    <div className="flex-1 flex flex-col px-4 pb-8 pt-2">
      <div className="w-full rounded-2xl overflow-hidden mb-5 shadow-md">
        <img src={photoBase64} alt="Uploaded" className="w-full h-48 object-cover" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[var(--color-line)] shadow-sm mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-accent)15' }}>
            <MapPin size={18} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-[var(--color-text-primary)] text-base">{analysis.location}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{analysis.city}, {analysis.country}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)18', color: 'var(--color-accent)' }}>
              {Math.round((analysis.confidence || 0.9) * 100)}% match
            </span>
          </div>
        </div>
        {analysis.description && (
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{analysis.description}</p>
        )}
      </div>

      {analysis.visualFeatures?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {analysis.visualFeatures.map((f, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>{f}</span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-auto">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onRetry}
          className="flex-1 h-13 rounded-2xl border border-[var(--color-line)] bg-white text-sm font-bold flex items-center justify-center gap-2"
          style={{ color: 'var(--color-text-secondary)' }}>
          <RefreshCw size={16} /> Try Again
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onConfirm}
          className="flex-[2] h-13 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
          <CheckCircle2 size={18} /> Looks right!
        </motion.button>
      </div>
    </div>
  )
}

// ── Step 4: Customize ──────────────────────────────────────────────────────────
function StepCustomize({ analysis, onGenerate }) {
  const [days, setDays]           = useState(2)
  const [budget, setBudget]       = useState('moderate')
  const [interests, setInterests] = useState([])

  const toggleInterest = (i) =>
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  return (
    <div className="flex-1 flex flex-col px-4 pb-8 pt-2 overflow-y-auto no-scrollbar">
      <h3 className="font-black text-[var(--color-text-primary)] mb-1">Customize your trip</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">
        to <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>{analysis.location}</span>
      </p>

      {/* Days */}
      <div className="mb-5">
        <label className="text-sm font-bold text-[var(--color-text-primary)] mb-3 block">
          Trip length — <span style={{ color: 'var(--color-accent)' }}>{days} days</span>
        </label>
        <input type="range" min={1} max={14} value={days} onChange={e => setDays(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)]" />
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
          <span>1 day</span><span>14 days</span>
        </div>
      </div>

      {/* Budget */}
      <div className="mb-5">
        <label className="text-sm font-bold text-[var(--color-text-primary)] mb-3 block">Budget</label>
        <div className="flex flex-col gap-2">
          {BUDGETS.map(b => (
            <button key={b.id} onClick={() => setBudget(b.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                budget === b.id ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--color-line)] bg-white'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                budget === b.id ? 'border-[var(--color-accent)]' : 'border-gray-300'
              }`}>
                {budget === b.id && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />}
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">{b.label}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{b.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <label className="text-sm font-bold text-[var(--color-text-primary)] mb-3 block">Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
            <button key={i} onClick={() => toggleInterest(i)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                interests.includes(i) ? 'text-white border-transparent' : 'bg-white border-[var(--color-line)] text-[var(--color-text-secondary)]'
              }`}
              style={interests.includes(i) ? { background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' } : {}}>
              {i}
            </button>
          ))}
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={() => onGenerate({ days, budget, interests })}
        className="w-full h-13 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 mt-auto"
        style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
        <Sliders size={16} /> Generate My Plan <ChevronRight size={16} />
      </motion.button>
    </div>
  )
}

// ── Step 5: Generating ─────────────────────────────────────────────────────────
function StepGenerating({ analysis }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-6">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--color-accent)20, var(--color-accent-light)20)' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
      <div className="text-center">
        <p className="font-black text-[var(--color-text-primary)] text-lg mb-2">Building your itinerary</p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Crafting the perfect trip to {analysis?.location}...
        </p>
      </div>
    </div>
  )
}

// ── Main Create ────────────────────────────────────────────────────────────────
export default function Create({ onClose, onPlanCreated }) {
  const [step, setStep]           = useState('upload')
  const [photoBase64, setPhotoB64] = useState(null)
  const [analysis, setAnalysis]   = useState(null)
  const [error, setError]         = useState(null)

  const STEPS = ['upload', 'analyzing', 'confirm', 'customize', 'generating']
  const stepIdx = STEPS.indexOf(step)

  const handlePhotoSelected = async (base64) => {
    setPhotoB64(base64)
    setStep('analyzing')
    setError(null)
    try {
      const res = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoBase64: base64 }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysis(data)
      setStep('confirm')
    } catch {
      setError('Could not identify the destination. Please try a different photo.')
      setStep('upload')
    }
  }

  const handleGenerate = async ({ days, budget, interests }) => {
    setStep('generating')
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: analysis.location,
          city: analysis.city,
          country: analysis.country,
          days, budget, interests,
          photoDescriptions: analysis.visualFeatures || [],
        }),
      })
      if (!res.ok) throw new Error('Plan generation failed')
      const data = await res.json()

      // userPhoto = user's own snap, always used as cover slide in VideoPreview
      // slidePhotos = Wikipedia-sourced photos for slides 1-3
      // img = thumbnail shown on cards (user's own photo)
      const plan = {
        id: `plan-${Date.now()}`,
        title: data.title,
        location: `${analysis.location}, ${analysis.city}`,
        destinationTheme: DESTINATION_THEME_MAP[analysis.destinationType] || 'zen',
        days,
        userPhoto: photoBase64,
        img: photoBase64,
        slidePhotos: data.slidePhotos || [],
        highlights: data.highlights || [],
        bestSeason: data.bestSeason,
        estimatedBudget: data.estimatedBudget,
        author: 'You',
        authorAvatar: 'Y',
        likes: 0,
        days_data: (data.days || []).map(d => ({
          dayNumber: d.dayNumber,
          theme: d.theme,
          activities: d.activities || [],
        })),
      }
      onPlanCreated(plan)
    } catch {
      setError('Failed to generate plan. Please try again.')
      setStep('customize')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 max-w-[430px] mx-auto bg-[var(--color-bg)] flex flex-col">

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-12 pb-4">
        <h2 className="text-lg font-black text-[var(--color-text-primary)]">New Trip</h2>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-white border border-[var(--color-line)] flex items-center justify-center">
          <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="shrink-0 flex gap-1.5 px-4 mb-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= stepIdx ? 'var(--color-accent)' : 'var(--color-line)' }} />
        ))}
      </div>

      {error && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'tween', duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
            <StepUpload onPhotoSelected={handlePhotoSelected} />
          </motion.div>
        )}
        {step === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col">
            <StepAnalyzing photoBase64={photoBase64} />
          </motion.div>
        )}
        {step === 'confirm' && analysis && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'tween', duration: 0.2 }} className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <StepConfirm photoBase64={photoBase64} analysis={analysis}
              onConfirm={() => setStep('customize')} onRetry={() => setStep('upload')} />
          </motion.div>
        )}
        {step === 'customize' && analysis && (
          <motion.div key="customize" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'tween', duration: 0.2 }} className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <StepCustomize analysis={analysis} onGenerate={handleGenerate} />
          </motion.div>
        )}
        {step === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col">
            <StepGenerating analysis={analysis} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
