import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bookmark, Share2, MapPin, Calendar, DollarSign, Sun, Clock, Lightbulb, Play, ChevronDown, ChevronUp, Users } from 'lucide-react'
import VideoPreview from '../components/VideoPreview.jsx'
import Toast from '../components/Toast.jsx'

const TYPE_COLORS = {
  Sightseeing: '#6c63ff', Food: '#f59e0b', Nature: '#10b981',
  Adventure: '#ef4444', Culture: '#8b5cf6', Shopping: '#ec4899',
  Beach: '#06b6d4', Hiking: '#16a34a', Ride: '#f97316',
  Entertainment: '#a855f7', Experience: '#14b8a6', default: '#6b7280',
}

function ActivityCard({ activity, index }) {
  const [expanded, setExpanded] = useState(false)
  const color = TYPE_COLORS[activity.type] || TYPE_COLORS.default

  return (
    <motion.div layout className="bg-white rounded-2xl border border-[var(--color-line)] overflow-hidden mb-3">
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ backgroundColor: color }}>
              {index + 1}
            </div>
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">{activity.time}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[var(--color-text-primary)] text-sm leading-tight">{activity.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: color }}>{activity.type}</span>
              <span className="text-[10px] text-[var(--color-text-secondary)] flex items-center gap-1">
                <Clock size={9} /> {activity.duration}
              </span>
            </div>
          </div>
          {expanded ? <ChevronUp size={16} className="text-[var(--color-text-secondary)] shrink-0 mt-1" />
                     : <ChevronDown size={16} className="text-[var(--color-text-secondary)] shrink-0 mt-1" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 border-t border-[var(--color-line)]">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3 mb-3">{activity.description}</p>
              {activity.tip && (
                <div className="flex gap-2 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-accent)10' }}>
                  <Lightbulb size={14} style={{ color: 'var(--color-accent)' }} className="shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{activity.tip}</p>
                </div>
              )}
              {activity.travelTimeToNext && activity.travelTimeToNext !== '0' && (
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-2 flex items-center gap-1">
                  <Clock size={9} /> {activity.travelTimeToNext} to next stop
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DaySection({ day }) {
  const [open, setOpen] = useState(day.dayNumber === 1)

  return (
    <div className="mb-4">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-[var(--color-line)] mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
            {day.dayNumber}
          </div>
          <div className="text-left">
            <p className="font-bold text-[var(--color-text-primary)] text-sm">Day {day.dayNumber}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{day.theme}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[var(--color-text-secondary)]" />
               : <ChevronDown size={16} className="text-[var(--color-text-secondary)]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {day.activities.map((a, i) => <ActivityCard key={a.id || i} activity={a} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PlanDetail({ plan, onBack, onSave, savedPlans, onShareToFeed, isSharedToFeed }) {
  const [showVideo, setShowVideo]   = useState(false)
  const [toast, setToast]           = useState({ show: false, message: '', type: 'info' })

  const isSaved = savedPlans?.some(p => p.id === plan.id)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type })
  }, [])

  const hideToast = useCallback(() => setToast(t => ({ ...t, show: false })), [])

  const handleSave = () => {
    onSave(plan)
    showToast(isSaved ? 'Removed from saved trips' : 'Trip saved to your collection!', 'success')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: plan.title, text: `Check out this trip: ${plan.title}`, url: window.location.href })
    } else {
      showToast('Link copied to clipboard!', 'success')
    }
  }

  const handleShareToFeed = () => {
    if (isSharedToFeed) { showToast('Already shared to the community feed', 'info'); return }
    onShareToFeed(plan)
    showToast('Shared to the community feed!', 'success')
  }

  const handleBook = () => showToast('Booking integration coming soon — stay tuned!', 'info')

  return (
    <div data-theme={plan.destinationTheme} className="flex-1 flex flex-col min-h-0">
      {/* Hero */}
      <div className="relative h-64 shrink-0">
        <img src={plan.img} alt={plan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back */}
        <button onClick={onBack}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        {/* Save */}
        <button onClick={handleSave}
          className="absolute top-12 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Bookmark size={17} fill={isSaved ? 'white' : 'none'} className="text-white" />
        </button>

        {/* Play video */}
        <button onClick={() => setShowVideo(true)}
          className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
            <Play size={22} className="text-white ml-1" />
          </div>
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={12} className="text-white/80" />
            <span className="text-xs text-white/80 font-medium">{plan.location}</span>
          </div>
          <h1 className="text-xl font-black text-white leading-tight">{plan.title}</h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Quick stats */}
        <div className="flex gap-3 px-4 py-4">
          {[
            { icon: Calendar, label: `${plan.days} days` },
            { icon: Sun,      label: plan.bestSeason || 'Year-round' },
            { icon: DollarSign, label: plan.estimatedBudget || 'Budget varies' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1 py-3 bg-white rounded-2xl border border-[var(--color-line)]">
              <Icon size={16} style={{ color: 'var(--color-accent)' }} />
              <span className="text-[10px] font-semibold text-[var(--color-text-secondary)] text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Highlights */}
        {plan.highlights?.length > 0 && (
          <div className="px-4 mb-4">
            <h3 className="font-black text-[var(--color-text-primary)] mb-2 text-sm">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {plan.highlights.map((h, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        <div className="px-4 mb-4">
          <h3 className="font-black text-[var(--color-text-primary)] mb-3 text-sm">Itinerary</h3>
          {(plan.days_data || []).map(day => <DaySection key={day.dayNumber} day={day} />)}
        </div>

        {/* Actions */}
        <div className="px-4 pb-8 flex flex-col gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleBook}
            className="w-full h-13 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
            Book Everything
          </motion.button>

          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleShare}
              className="flex-1 h-12 rounded-2xl border border-[var(--color-line)] bg-white text-sm font-bold flex items-center justify-center gap-2"
              style={{ color: 'var(--color-text-secondary)' }}>
              <Share2 size={15} /> Share
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleShareToFeed}
              className="flex-1 h-12 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              style={isSharedToFeed
                ? { borderColor: 'var(--color-accent)', backgroundColor: 'var(--color-accent)15', color: 'var(--color-accent)' }
                : { borderColor: 'var(--color-line)', backgroundColor: 'white', color: 'var(--color-text-secondary)' }}>
              <Users size={15} /> {isSharedToFeed ? 'In Feed' : 'Post to Feed'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Video preview overlay */}
      <AnimatePresence>
        {showVideo && <VideoPreview plan={plan} onClose={() => setShowVideo(false)} />}
      </AnimatePresence>

      <Toast message={toast.message} show={toast.show} onHide={hideToast} type={toast.type} />
    </div>
  )
}
