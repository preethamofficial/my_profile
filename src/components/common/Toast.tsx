import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
}

const styles = {
  success: {
    wrapper: 'border-emerald-400/45 bg-emerald-500/15 text-emerald-100',
    icon: <CheckCircle2 className="h-4 w-4" aria-hidden />,
  },
  error: {
    wrapper: 'border-rose-400/45 bg-rose-500/15 text-rose-100',
    icon: <AlertTriangle className="h-4 w-4" aria-hidden />,
  },
  info: {
    wrapper: 'border-cyan-400/45 bg-cyan-500/15 text-cyan-100',
    icon: <Info className="h-4 w-4" aria-hidden />,
  },
}

export function Toast({ message, type, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22 }}
          className={`fixed bottom-5 right-5 z-[120] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${styles[type].wrapper}`}
        >
          {styles[type].icon}
          <p>{message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
