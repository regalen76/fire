import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Card } from '@design/components/core/Card';
import { EASE_OUT } from './ui';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

/** Right-hand panel that slides in on the standard ease, as in the prototype's TransactionDrawer. */
export function Drawer({ open, onClose, title, subtitle, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'color-mix(in srgb, var(--navy-950) 55%, transparent)' }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'absolute', top: 10, right: 10, bottom: 10, width: 420, maxWidth: 'calc(100% - 20px)' }}
          >
            <Card
              title={title}
              subtitle={subtitle}
              action={
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="fire-chip"
                  style={{ flexShrink: 0, width: 37, height: 37, borderRadius: 'var(--radius-button)', border: 'none', background: 'var(--surface-ghost)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 18 }}
                >
                  ×
                </button>
              }
              style={{ height: '100%', overflowY: 'auto', background: 'var(--gradient-card), var(--navy-900)' }}
            >
              {children}
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
