import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Card } from '@design/components/core/Card';
import { Button } from '@design/components/core/Button';
import { Badge, type BadgeProps } from '@design/components/core/Badge';
import { IconTile } from '@design/components/core/IconTile';
import type { IconName } from '@design/components/icons/Icon';
import { deleteReceipt, getReceipts, receiptImageUrl, retryReceipt, type Receipt, type ReceiptStatus } from '../api';
import { useAsync, useCategories, useRefresh } from '../data';
import { longDateTime, signedMoney } from '../format';
import { ConfirmDelete, EASE_OUT, Empty, ErrorState, IndeterminateBar, Loading, Reveal } from '../ui';

const PAGE = 20;

interface Props {
  onOpenTx: (id: number) => void;
}

export function Receipts({ onOpenTx }: Props) {
  const [limit, setLimit] = useState(PAGE);
  // The app polls processing receipts and bumps the refresh version when the set
  // changes, so this list follows along without its own timer.
  const receipts = useAsync(() => getReceipts({ limit: limit + 1 }), [limit]);
  const all = receipts.data;
  const processing = all?.filter((r) => r.status === 'processing') ?? [];
  const history = all?.filter((r) => r.status !== 'processing') ?? [];
  const more = (all?.length ?? 0) > limit;

  return (
    <div className="fire-grid fire-grid--receipts">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)', minWidth: 0 }}>
        <Reveal>
          <ProcessingCard items={all ? processing : undefined} error={receipts.state === 'error' ? receipts.error : undefined} />
        </Reveal>
        <Reveal delay={0.05}>
          <HowItWorks />
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <Card
          title="Scanned Receipts"
          subtitle="Every screenshot sent from your phone"
          action={
            more ? (
              <Button variant="ghost" size="sm" onClick={() => setLimit(limit + PAGE)}>
                Load More
              </Button>
            ) : null
          }
        >
          {!all ? (
            receipts.state === 'error' ? (
              <ErrorState message={receipts.error} onRetry={receipts.reload} />
            ) : (
              <Loading />
            )
          ) : history.length === 0 ? (
            <Empty
              icon="IONIconDDocumentText"
              title="No receipts yet"
              text="Double-tap the back of your phone while a bill or transfer is on screen. It shows up here once it has been read."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence initial={false}>
                {history.slice(0, limit).map((r) => (
                  <motion.div
                    key={r.id}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  >
                    <ReceiptRow r={r} onOpenTx={onOpenTx} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </Reveal>
    </div>
  );
}

function ProcessingCard({ items, error }: { items?: Receipt[]; error?: string }) {
  let body: ReactNode;
  if (!items) {
    body = error ? <ErrorState message={error} /> : <Loading />;
  } else if (items.length === 0) {
    body = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderRadius: 'var(--radius-card)', background: 'var(--gradient-row)' }}>
        <IconTile icon="IONIconCCheckmarkCCircle" size="lg" tone="ghost" round />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14 }}>All caught up</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Nothing is being read right now.</span>
        </span>
      </div>
    );
  } else {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((r) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderRadius: 'var(--radius-card)', background: 'var(--gradient-row)' }}>
            <Thumb id={r.id} />
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 14 }}>Reading receipt…</span>
              <IndeterminateBar />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sent {longDateTime(r.createdAt)}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <Card title="Processing" subtitle="Bills sent from your phone">
      {body}
    </Card>
  );
}

const STATUS: Record<Exclude<ReceiptStatus, 'processing'>, { label: string; badge: BadgeProps }> = {
  done: { label: 'Done', badge: { variant: 'solid', tone: 'green' } },
  failed: { label: 'Failed', badge: { variant: 'solid', tone: 'red' } },
  duplicate: { label: 'Duplicate', badge: { variant: 'solid', tone: 'orange' } },
  rejected: { label: 'Rejected', badge: { variant: 'outline' } },
};

function ReceiptRow({ r, onOpenTx }: { r: Receipt; onOpenTx: (id: number) => void }) {
  const categories = useCategories();
  const { refresh } = useRefresh();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = STATUS[r.status as keyof typeof STATUS] ?? STATUS.failed;
  const t = r.transaction;

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  const title = t
    ? t.merchant
    : r.status === 'rejected'
      ? 'Not a receipt'
      : r.status === 'duplicate'
        ? 'Already saved'
        : r.status === 'failed'
          ? "Couldn't read this one"
          : `Receipt ${r.id}`;
  const reason =
    r.status === 'rejected'
      ? 'The screenshot did not look like a bill or transfer.'
      : r.status === 'done'
        ? null
        : r.error;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: '0.5px solid var(--border-subtle)' }}>
      <Thumb id={r.id} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontWeight: 500, fontSize: 14, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          {t ? (
            <span style={{ fontSize: 14, whiteSpace: 'nowrap', color: t.direction === 'in' ? 'var(--income)' : 'var(--text-secondary)' }}>
              {signedMoney(t.amountMinor, t.currency, t.direction)}
            </span>
          ) : null}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Badge {...status.badge} style={{ height: 20, fontSize: 12, padding: '0 8px' }}>
            {status.label}
          </Badge>
          <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            {t ? `${categories.get(t.categoryId).label} · ` : ''}
            {t ? longDateTime(t.occurredAt) : `Sent ${longDateTime(r.createdAt)}`}
          </span>
        </span>
        {reason ? <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}>{reason}</span> : null}
        {error ? <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span> : null}
        <span style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
          {t ? (
            <Button variant="text" icon="IONIconDDocumentText" onClick={() => onOpenTx(t.id)}>
              View
            </Button>
          ) : null}
          {r.status === 'duplicate' && r.duplicateOf !== null ? (
            <Button variant="text" icon="IONIconDDocumentText" onClick={() => onOpenTx(r.duplicateOf!)}>
              View Original
            </Button>
          ) : null}
          {r.status === 'failed' ? (
            <Button variant="text" icon="IONIconRRocketSharp" disabled={busy} onClick={() => act(() => retryReceipt(r.id))}>
              Retry
            </Button>
          ) : null}
          <ConfirmDelete busy={busy} onConfirm={() => act(() => deleteReceipt(r.id))} />
        </span>
      </div>
    </div>
  );
}

/** The original screenshot, opening full size in a new tab. */
function Thumb({ id }: { id: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <a
      href={receiptImageUrl(id)}
      target="_blank"
      rel="noreferrer"
      aria-label="Open screenshot"
      style={{ flexShrink: 0, width: 45, height: 60, borderRadius: 'var(--radius-button)', overflow: 'hidden', background: 'var(--surface-ghost)', display: 'block' }}
    >
      {broken ? null : (
        <img
          src={receiptImageUrl(id)}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
        />
      )}
    </a>
  );
}

const STEPS: [IconName, string][] = [
  ['IONIconDDocumentDefault', 'Open a bill, receipt or transfer confirmation on your iPhone'],
  ['IONIconLLogoApple', 'Double-tap the back of the phone. Back Tap runs the "Send to Fire" shortcut'],
  ['IONIconRRocketSharp', 'The screenshot goes to your Fire server over Tailscale'],
  ['IONIconCCubeDefault', 'A vision model reads the merchant, items, total and category'],
  ['IONIconSStatsChart', 'It appears here and in your transactions within seconds'],
];

function HowItWorks() {
  return (
    <Card title="How It Works" subtitle="One gesture per bill">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {STEPS.map(([icon, text]) => (
          <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, lineHeight: 1.4 }}>
            <IconTile icon={icon} size="sm" tone="navy" />
            {text}
          </span>
        ))}
        <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          Identical screenshots are refused, and a second screenshot of the same bill is marked as a duplicate, so nothing is
          counted twice. Fix anything the model got wrong from the transaction itself.
        </span>
      </div>
    </Card>
  );
}
