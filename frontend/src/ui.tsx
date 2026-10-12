// Small pieces the Design system doesn't have: state messages, a styled select,
// segmented buttons, a two-step delete, and an indeterminate progress bar.

import { useEffect, useState, type CSSProperties, type ReactNode, type SelectHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { Button } from '@design/components/core/Button';
import { IconTile } from '@design/components/core/IconTile';
import type { IconName } from '@design/components/icons/Icon';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Fade + 8px rise on mount, per the motion guideline (short, no bounce). */
export function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT, delay }}
      style={{ minWidth: 0, ...style }}
    >
      {children}
    </motion.div>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" style={{ padding: '24px 0', textAlign: 'center', font: 'var(--text-body)', color: 'var(--text-secondary)' }}>
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 18px', borderRadius: 'var(--radius-card)', background: 'var(--gradient-row)' }}
    >
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ font: 'var(--text-body)', color: 'var(--danger)' }}>Couldn't load this</span>
        <span style={{ font: 'var(--text-label)', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}>{message}</span>
      </span>
      {onRetry ? (
        <Button size="sm" variant="ghost" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon: IconName; title: string; text?: ReactNode; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '24px 12px' }}>
      <IconTile icon={icon} size="lg" tone="navy" />
      <span style={{ font: 'var(--fw-bold) var(--fs-body)/var(--lh-body) var(--font-sans)', color: 'var(--text-primary)' }}>{title}</span>
      {text ? <span style={{ font: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: 340 }}>{text}</span> : null}
      {action ? <div style={{ marginTop: 6 }}>{action}</div> : null}
    </div>
  );
}

const fieldBox: CSSProperties = {
  height: 50,
  padding: '0 20px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--gradient-tile)',
  boxShadow: 'inset 0 0 0 1px var(--border-input)',
  boxSizing: 'border-box',
};

/** A <select> styled like the Design Input "field" variant. */
export function Select({ label, style, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label?: ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4.5, fontFamily: 'var(--font-sans)', minWidth: 0, ...style }}>
      {label ? <span style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--text-primary)', paddingLeft: 4.5 }}>{label}</span> : null}
      <span style={{ ...fieldBox, display: 'flex', alignItems: 'center' }}>
        <select
          {...rest}
          className="fire-select"
          style={{ flex: 1, minWidth: 0, height: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', font: 'var(--text-body)', cursor: 'pointer' }}
        >
          {children}
        </select>
      </span>
    </label>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--text-primary)', paddingLeft: 4.5 }}>{children}</span>;
}

/** Row of small buttons where one is selected (All / Income / Outcome). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <Button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          size="sm"
          variant={o.value === value ? 'primary' : 'ghost'}
          disabled={disabled}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}

/** Category filter chip (8px radius), as in the prototype's Transactions screen. */
export function Chip({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="fire-chip"
      style={{
        height: 28,
        padding: '0 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        whiteSpace: 'nowrap',
        background: active ? 'var(--accent)' : 'transparent',
        color: 'var(--text-primary)',
        boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--border-subtle)',
        transition: 'background var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
      }}
    >
      {children}
    </button>
  );
}

/** DELETE that asks once: the first click turns it into CONFIRM / CANCEL. */
export function ConfirmDelete({ onConfirm, label = 'Delete', busy }: { onConfirm: () => void; label?: string; busy?: boolean }) {
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!asking) return;
    const t = window.setTimeout(() => setAsking(false), 5000);
    return () => window.clearTimeout(t);
  }, [asking]);
  if (!asking) {
    return (
      <Button type="button" variant="danger" icon="Delete" disabled={busy} onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 14, alignItems: 'center' }}>
      <Button type="button" variant="danger" icon="Delete" disabled={busy} onClick={onConfirm}>
        Confirm Delete
      </Button>
      <Button type="button" variant="text" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  );
}

/** A 3px track with a sliding blue segment: work is happening, with no fake percentage. */
export function IndeterminateBar() {
  return (
    <span
      role="progressbar"
      aria-busy="true"
      style={{ position: 'relative', display: 'block', height: 3, borderRadius: 1.5, background: 'var(--track)', overflow: 'hidden' }}
    >
      <motion.span
        style={{ position: 'absolute', top: 0, bottom: 0, width: '35%', borderRadius: 1.5, background: 'var(--accent)' }}
        initial={{ left: '-35%' }}
        animate={{ left: '100%' }}
        transition={{ duration: 1.4, ease: EASE_OUT, repeat: Infinity }}
      />
    </span>
  );
}

/** Coloured legend dot + label for charts. */
export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
      {items.map((i) => (
        <span key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <span role="alert" style={{ font: 'var(--text-label)', color: 'var(--danger)' }}>
      {children}
    </span>
  );
}
