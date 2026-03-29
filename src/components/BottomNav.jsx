import { Home, Plus, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNav({ active, onTabChange, onCreatePress }) {
  const tabs = [
    { id: 'home',    icon: Home, label: 'Explore' },
    { id: 'create',  icon: Plus, label: 'Create',  special: true },
    { id: 'profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="shrink-0 bg-white border-t border-[var(--color-line)] flex items-center justify-around px-4 py-2 pb-safe">
      {tabs.map(t => {
        const Icon    = t.icon
        const isActive = active === t.id
        if (t.special) return (
          <motion.button key={t.id} whileTap={{ scale: 0.92 }} onClick={onCreatePress}
            className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg -mt-5"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
            <Icon size={22} className="text-white" />
          </motion.button>
        )
        return (
          <motion.button key={t.id} whileTap={{ scale: 0.9 }} onClick={() => onTabChange(t.id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1">
            <Icon size={22} style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }} />
            <span className="text-[10px] font-semibold" style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>{t.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
