import { useEffect, useState, type CSSProperties } from 'react';
import { Card } from '@design/components/core/Card';
import { Button } from '@design/components/core/Button';
import { Badge } from '@design/components/core/Badge';
import { IconTile } from '@design/components/core/IconTile';
import { TransactionItem } from '@design/components/data/TransactionItem';
import { getTransactions, type Direction, type Transaction } from '../api';
import { iconName, useAsync, useBaseCurrency, useCategories, useIsPhone } from '../data';
import { amountColor, longDate, longDateTime, signedMoney } from '../format';
import { Chip, Empty, ErrorState, Loading, Segmented } from '../ui';

const PAGE_SIZE = 20;

type Filter = 'all' | 'in' | 'out';

interface Props {
  /** Search text from the header. */
  search: string;
  onOpenTx: (id: number) => void;
  onAdd: () => void;
}

export function Transactions({ search, onOpenTx, onAdd }: Props) {
  const categories = useCategories();
  const phone = useIsPhone();
  const [filter, setFilter] = useState<Filter>('all');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(0);
  const q = useDebounced(search.trim(), 250);

  // Any filter change starts again from the first page.
  useEffect(() => setPage(0), [filter, category, q]);

  const chips = filter === 'all' ? categories.list : categories.forDirection(filter as Direction);
  useEffect(() => {
    if (category !== 'all' && categories.list.length && !chips.some((c) => c.id === category)) setCategory('all');
  }, [filter, categories.list.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const result = useAsync(
    () =>
      getTransactions({
        direction: filter === 'all' ? undefined : filter,
        category: category === 'all' ? undefined : category,
        q: q || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }),
    [filter, category, q, page],
  );
  const data = result.data;
  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min(total, (page + 1) * PAGE_SIZE);

  let body;
  if (!data) {
    body = result.state === 'error' ? <ErrorState message={result.error} onRetry={result.reload} /> : <Loading />;
  } else if (data.items.length === 0) {
    const filtered = filter !== 'all' || category !== 'all' || q;
    body = filtered ? (
      <Empty icon="IONIconSStatsChart" title="No matches" text={q ? `Nothing matches "${q}" with these filters.` : 'No transactions match these filters.'} />
    ) : (
      <Empty
        icon="IONIconSStatsChart"
        title="No transactions yet"
        text="Bills you send from your phone and income you add by hand show up here."
        action={<Button onClick={onAdd}>Add Transaction</Button>}
      />
    );
  } else {
    body = phone ? <TxList items={data.items} onOpenTx={onOpenTx} /> : <TxTable items={data.items} onOpenTx={onOpenTx} />;
  }

  return (
    <Card
      title="Transactions"
      subtitle={
        <span>
          <b style={{ color: 'var(--text-primary)' }}>{total}</b> {total === 1 ? 'result' : 'results'}
          {q ? ` for "${q}"` : ''}
        </span>
      }
      action={
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'in', label: 'Income' },
            { value: 'out', label: 'Outcome' },
          ]}
        />
      }
      style={{ opacity: result.state === 'loading' && data ? 0.7 : 1, transition: 'opacity var(--dur-fast) var(--ease-out)' }}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <Chip active={category === 'all'} onClick={() => setCategory('all')}>
          All categories
        </Chip>
        {chips.map((c) => (
          <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>
      {body}
      {total > PAGE_SIZE ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--text-label)', color: 'var(--text-secondary)' }}>
            {from}–{to} of {total}
          </span>
          <span style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="ghost" disabled={to >= total} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </span>
        </div>
      ) : null}
    </Card>
  );
}

const th: CSSProperties = {
  font: 'var(--text-overline)',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  textAlign: 'left',
  padding: '0 12px 12px 0',
  borderBottom: '0.5px solid var(--border-subtle)',
};
const td: CSSProperties = {
  padding: '14px 12px 14px 0',
  borderBottom: '0.5px solid var(--border-subtle)',
  fontSize: 14,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

function TxTable({ items, onOpenTx }: { items: Transaction[]; onOpenTx: (id: number) => void }) {
  const categories = useCategories();
  const base = useBaseCurrency();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
        <thead>
          <tr>
            <th style={th}>Merchant</th>
            <th style={th}>Category</th>
            <th style={th}>Payment</th>
            <th style={th}>Source</th>
            <th style={th}>Date</th>
            <th style={{ ...th, textAlign: 'right', paddingRight: 0 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => {
            const c = categories.get(t.categoryId);
            const foreign = t.currency !== base;
            return (
              <tr
                key={t.id}
                className="fire-row"
                tabIndex={0}
                onClick={() => onOpenTx(t.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpenTx(t.id))}
              >
                <td style={td}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <IconTile icon={iconName(c.icon)} size="sm" tone={t.direction === 'in' ? 'blue' : 'navy'} />
                    {t.merchant}
                  </span>
                </td>
                <td style={{ ...td, color: 'var(--text-secondary)' }}>{c.label}</td>
                <td style={{ ...td, color: t.paymentMethod ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{t.paymentMethod ?? '—'}</td>
                <td style={td}>
                  {t.source === 'receipt' ? (
                    <Badge variant="solid" tone="green">
                      Receipt
                    </Badge>
                  ) : (
                    <Badge variant="outline">Manual</Badge>
                  )}
                </td>
                <td style={{ ...td, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{longDate(t.occurredAt)}</td>
                <td style={{ ...td, textAlign: 'right', paddingRight: 0, whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 700, color: amountColor(t.direction) }}>
                      {signedMoney(t.amountBaseMinor, base, t.direction)}
                    </span>
                    {foreign ? (
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{signedMoney(t.amountMinor, t.currency, t.direction)}</span>
                    ) : null}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Phone layout: the table becomes a list of transaction rows. */
function TxList({ items, onOpenTx }: { items: Transaction[]; onOpenTx: (id: number) => void }) {
  const categories = useCategories();
  const base = useBaseCurrency();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map((t) => (
        <TransactionItem
          key={t.id}
          onClick={() => onOpenTx(t.id)}
          title={t.merchant}
          meta={longDateTime(t.occurredAt)}
          category={categories.get(t.categoryId).label}
          amount={<span style={{ color: amountColor(t.direction) }}>{signedMoney(t.amountBaseMinor, base, t.direction)}</span>}
          type={t.direction === 'in' ? 'income' : t.direction === 'out' ? 'expense' : 'pending'}
        />
      ))}
    </div>
  );
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}
