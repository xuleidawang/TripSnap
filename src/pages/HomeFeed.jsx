import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Bookmark, MapPin, Play, Users, Compass } from 'lucide-react'
import { FEED_PLANS } from '../data/feedData.js'

const TABS = ['All', 'Coastal', 'Tropical', 'Urban', 'Mountain']

function PlanCard({ plan, onView, isSaved, onSave }) {
  const [liked, setLiked]     = useState(false)
  const [likeCount, setCount] = useState(plan.likes || 0)

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(l => !l)
    setCount(c => liked ? c - 1 : c + 1)
  }

  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={() => onView(plan)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[var(--color-line)] mb-4 cursor-pointer">
      {/* Hero image */}
      <div className="relative h-52 bg-gray-100">
        <img
          src={plan.img}
          alt={plan.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play button */}
        <button onClick={(e) => { e.stopPropagation(); onView(plan) }}
          className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <Play size={20} className="text-white ml-1" />
          </div>
        </button>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={11} className="text-white/80" />
            <span className="text-xs text-white/80 font-medium">{plan.location}</span>
          </div>
          <h3 className="text-white font-black text-base leading-tight">{plan.title}</h3>
        </div>

        {/* Days badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-white text-xs font-bold">{plan.days}d</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
            {plan.authorAvatar}
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{plan.author}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLike} className="flex items-center gap-1.5">
            <Heart size={17} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'var(--color-text-secondary)'} />
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{likeCount}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onSave(plan) }}>
            <Bookmark size={17}
              fill={isSaved ? 'var(--color-accent)' : 'none'}
              color={isSaved ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function HomeFeed({ onViewPlan, savedPlans, onSavePlan, sharedPlans }) {
  const [activeTab, setActiveTab] = useState('All')

  const themeMap = { Coastal: 'coastal', Tropical: 'tropical', Urban: 'urban', Mountain: 'mountain' }

  const feedPlans = [
    ...sharedPlans,
    ...FEED_PLANS.filter(p => !sharedPlans.find(s => s.id === p.id)),
  ]

  const filtered = activeTab === 'All'
    ? feedPlans
    : feedPlans.filter(p => p.destinationTheme === themeMap[activeTab])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 bg-[var(--color-bg)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Explore</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Discover amazing trips</p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-2xl bg-white border border-[var(--color-line)] flex items-center justify-center">
              <Users size={17} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <button className="w-9 h-9 rounded-2xl bg-white border border-[var(--color-line)] flex items-center justify-center">
              <Compass size={17} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTab === t
                  ? 'text-white shadow-sm'
                  : 'bg-white border border-[var(--color-line)] text-[var(--color-text-secondary)]'
              }`}
              style={activeTab === t ? { background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-4">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-3">
              <Compass size={40} className="text-[var(--color-text-secondary)] opacity-30" />
              <p className="text-[var(--color-text-secondary)] text-sm">No trips here yet</p>
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {filtered.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onView={onViewPlan}
                  isSaved={savedPlans.some(s => s.id === plan.id)}
                  onSave={onSavePlan}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
