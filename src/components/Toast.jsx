import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Info } from 'lucide-react'

export default function Toast({ message, show, onHide, type = 'info' }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onHide, 2800)
    return () => clearTimeout(t)
  }, [show, onHide])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] max-w-[320px] w-[90vw]"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1a1a2e] shadow-xl">
            {type === 'success'
              ? <CheckCircle2 size={18} className="text-green-400 shrink-0" />
              : <Info          size={18} className="text-blue-400  shrink-0" />}
            <span className="text-sm font-medium text-white">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
