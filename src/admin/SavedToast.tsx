import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../components/icons/Icon';

interface SavedToastProps {
  show: boolean;
  onDone: () => void;
  message?: string;
}

export function SavedToast({ show, onDone, message = 'Збережено' }: SavedToastProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed inset-x-0 bottom-24 z-[70] mx-auto flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-float"
        >
          <Icon name="check" size={18} /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
