import { useEffect } from 'react';
import { useMarisStore } from '../../lib/store';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toast() {
  const toastMessage = useMarisStore((state) => state.toastMessage);
  const clearToast = useMarisStore((state) => state.clearToast);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-sec-bg/95 border border-cyan-acc/40 text-tx-primary shadow-[0_0_30px_rgba(34,211,238,0.25)] backdrop-blur-md"
        >
          <CheckCircle2 className="w-5 h-5 text-cyan-acc flex-shrink-0" />
          <span className="text-sm font-medium pr-2">{toastMessage}</span>
          <button 
            onClick={clearToast}
            className="p-1 text-tx-muted hover:text-tx-primary rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
