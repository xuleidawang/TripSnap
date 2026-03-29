import { motion } from 'framer-motion'
import { MapPin, Bookmark, Calendar, Settings } from 'lucide-react'

function PlanThumb({ plan, onView }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={() => onView(plan)}
      className="flex gap-3 bg-white rounded-2xl border border-[var(--color-line)] p-3 mb-3 cursor-pointer">
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
        <img src={plan.img} alt={plan.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[var(--color-text-primary)] text-sm leading-tight truncate">{plan.title}</h4>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-[var(--color-text-secondary)]" />
          <span className="text-xs text-[var(--color-text-secondary)] truncate">{plan.location}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Calendar size={10} className="text-[var(--color-text-secondary)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">{plan.days} days</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Profile({ myPlans, savedPlans, onViewPlan }) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Profile</h1>
          <button className="w-9 h-9 rounded-2xl bg-white border border-[var(--color-line)] flex items-center justify-center">
            <Settings size={17} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
            Y
          </div>
          <div>
            <h2 className="font-black text-[var(--color-text-primary)] text-lg">You</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Travel explorer</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: 'Trips', value: myPlans.length },
            { label: 'Saved', value: savedPlans.length },
            { label: 'Days', value: myPlans.reduce((sum, p) => sum + (p.days || 0), 0) },
          ].map(s => (
            <div key={s.label} className="flex-1 text-center py-3 bg-white rounded-2xl border border-[var(--color-line)]">
              <p className="font-black text-[var(--color-text-primary)] text-lg">{s.value}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8">
        {/* My trips */}
        <h3 className="font-black text-[var(--color-text-primary)] mb-3 text-sm">My Trips</h3>
        {myPlans.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-text-secondary)] text-sm">
            No trips yet — tap + to create one!
          </div>
        ) : myPlans.map(p => <PlanThumb key={p.id} plan={p} onView={onViewPlan} />)}

        {/* Saved */}
        {savedPlans.length > 0 && (
          <>
            <h3 className="font-black text-[var(--color-text-primary)] mb-3 mt-6 text-sm flex items-center gap-2">
              <Bookmark size={14} style={{ color: 'var(--color-accent)' }} /> Saved
            </h3>
            {savedPlans.map(p => <PlanThumb key={p.id} plan={p} onView={onViewPlan} />)}
          </>
        )}
      </div>
    </div>
  )
}
