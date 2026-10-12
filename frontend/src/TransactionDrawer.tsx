import { useEffect, useState, type ReactNode } from 'react';
import { Badge } from '@design/components/core/Badge';
import { IconTile } from '@design/components/core/IconTile';
import { deleteTransaction, getTransaction, patchTransaction, receiptImageUrl, type Direction, type TransactionDetail, type TransactionPatch } from './api';
import { iconName, useBaseCurrency, useCategories, useRefresh } from './data';
import { Drawer } from './Drawer';
import { amountColor, longDateTime, money, signedMoney } from './format';
import { ConfirmDelete, ErrorState, FormError, Loading, Segmented, Select } from './ui';

interface Props {
  id: number | null;
  onClose: () => void;
}

export function TransactionDrawer({ id, onClose }: Props) {
  const { version, refresh } = useRefresh();
  const [tx, setTx] = useState<TransactionDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (id === null) return;
    let live = true;
    setLoadError(null);
    getTransaction(id).then(
      (t) => live && setTx(t),
      (e: Error) => live && setLoadError(e.message),
    );
    return () => {
      live = false;
    };
  }, [id, version, nonce]);

  // Forget the old one once closed, so reopening never flashes stale data.
  useEffect(() => {
    if (id === null) setTx(null);
  }, [id]);

  const shown = tx && tx.id === id ? tx : null;

  return (
    <Drawer
      open={id !== null}
      onClose={onClose}
      title={shown?.merchant ?? (loadError ? 'Transaction' : 'Loading…')}
      subtitle={shown ? longDateTime(shown.occurredAt) : undefined}
    >
      {shown ? (
        <Detail tx={shown} onChanged={(t) => (setTx(t), refresh())} onDeleted={() => (onClose(), refresh())} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={() => setNonce((n) => n + 1)} />
      ) : (
        <Loading />
      )}
    </Drawer>
  );
}

function Detail({
  tx,
  onChanged,
  onDeleted,
}: {
  tx: TransactionDetail;
  onChanged: (t: TransactionDetail) => void;
  onDeleted: () => void;
}) {
  const categories = useCategories();
  const base = useBaseCurrency();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const c = categories.get(tx.categoryId);
  const foreign = tx.currency !== base;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const patch = (p: TransactionPatch) => run(async () => onChanged(await patchTransaction(tx.id, p)));

  const itemsTotal = tx.items.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconTile icon={iconName(c.icon)} size="lg" tone="blue" />
        <span style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.label}</span>
          <span style={{ fontWeight: 700, fontSize: 'var(--fs-amount)', lineHeight: '42px', color: tx.direction === 'in' ? 'var(--income)' : 'var(--text-primary)', overflowWrap: 'anywhere' }}>
            {signedMoney(tx.amountBaseMinor, base, tx.direction)}
          </span>
          {foreign ? (
            <span style={{ fontSize: 14, color: amountColor(tx.direction) }}>
              {signedMoney(tx.amountMinor, tx.currency, tx.direction)} · 1 {tx.currency} = {money(Math.round(tx.fxRate * 100), base)}
            </span>
          ) : null}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tx.source === 'receipt' ? (
          <Badge variant="solid" tone="green">
            From receipt
          </Badge>
        ) : (
          <Badge variant="outline">Manual</Badge>
        )}
        {tx.paymentMethod ? <Badge variant="outline">{tx.paymentMethod}</Badge> : null}
        {tx.direction === 'internal' ? <Badge variant="outline">Not in totals</Badge> : null}
      </div>

      <Section title="Direction">
        <Segmented<Direction>
          value={tx.direction}
          disabled={busy}
          onChange={(d) => d !== tx.direction && patch({ direction: d })}
          options={[
            { value: 'out', label: 'Spending' },
            { value: 'in', label: 'Income' },
            { value: 'internal', label: 'Internal' },
          ]}
        />
      </Section>

      <Select label="Category" value={tx.categoryId} disabled={busy} onChange={(e) => patch({ categoryId: e.target.value })}>
        {categories.forDirection(tx.direction).map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </Select>

      <FormError>{error}</FormError>

      {itemsTotal ? (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 22px', borderRadius: 'var(--radius-card)', background: 'var(--gradient-row)' }}>
          <span style={{ font: 'var(--text-overline)', color: 'var(--text-secondary)', marginBottom: 10 }}>ITEMS READ FROM RECEIPT</span>
          {tx.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '0.5px solid var(--border-subtle)', fontSize: 14 }}>
              <span style={{ minWidth: 0 }}>
                {it.quantity && it.quantity !== 1 ? <span style={{ color: 'var(--text-secondary)' }}>{it.quantity}× </span> : null}
                {it.name}
              </span>
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{it.amountMinor !== null ? money(it.amountMinor, tx.currency) : '—'}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 700, fontSize: 14 }}>
            <span>Total</span>
            <span>{money(Math.abs(tx.amountMinor), tx.currency)}</span>
          </div>
        </div>
      ) : null}

      {tx.note ? (
        <Section title="Note">
          <span style={{ font: 'var(--text-body)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{tx.note}</span>
        </Section>
      ) : null}

      {tx.receiptId !== null ? (
        <Section title="Original Screenshot">
          <a href={receiptImageUrl(tx.receiptId)} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'var(--surface-ghost)' }}>
            <img src={receiptImageUrl(tx.receiptId)} alt={`Screenshot of ${tx.merchant}`} style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'cover', objectPosition: 'top' }} />
          </a>
        </Section>
      ) : null}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <ConfirmDelete busy={busy} onConfirm={() => run(async () => (await deleteTransaction(tx.id), onDeleted()))} />
      </div>
      {tx.receiptId !== null ? (
        <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)', marginTop: -12 }}>
          Deleting also removes the screenshot, so the same bill can be sent again.
        </span>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ font: 'var(--text-overline)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{title}</span>
      {children}
    </div>
  );
}
