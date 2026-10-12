import { useState, type FormEvent } from 'react';
import { Card } from '@design/components/core/Card';
import { Button } from '@design/components/core/Button';
import { Input } from '@design/components/core/Input';
import { Icon } from '@design/components/icons/Icon';
import { StatCard } from '@design/components/data/StatCard';
import { MiniStat } from '@design/components/data/MiniStat';
import { TransactionItem } from '@design/components/data/TransactionItem';
import { LineChart } from '@design/components/charts/LineChart';
import { BarChart } from '@design/components/charts/BarChart';
import { Gauge } from '@design/components/charts/Gauge';
import welcomeImage from '@design/assets/images/welcome-jellyfish.jpg';
import { getCashflow, getSummary, getTransactions, putBudget, type Summary, type Transaction } from '../api';
import { iconName, useAsync, useBaseCurrency, useCategories, useRefresh } from '../data';
import {
  amountColor,
  change,
  chartScale,
  compactMoney,
  countChange,
  longDateTime,
  money,
  monthName,
  shortMonth,
  signedMoney,
} from '../format';
import { Empty, ErrorState, FormError, Legend, Loading, Reveal } from '../ui';
import type { Page } from '../Shell';

interface Props {
  onOpenTx: (id: number) => void;
  onNav: (p: Page) => void;
  onAdd: () => void;
}

export function Dashboard({ onOpenTx, onNav, onAdd }: Props) {
  const summary = useAsync(() => getSummary(), []);
  const s = summary.data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      {summary.state === 'error' && !s ? <ErrorState message={summary.error} onRetry={summary.reload} /> : null}
      <Stats summary={s} />
      <div className="fire-grid fire-grid--welcome">
        <Reveal style={{ display: 'flex' }}>
          <Welcome summary={s} onNav={onNav} />
        </Reveal>
        <Reveal delay={0.05} style={{ display: 'flex' }}>
          <BudgetCard summary={s} loading={summary.state === 'loading' && !s} />
        </Reveal>
      </div>
      <div className="fire-grid fire-grid--wide">
        <Reveal delay={0.1}>
          <CashFlowCard />
        </Reveal>
        <Reveal delay={0.15}>
          <CategoryCard summary={s} loading={summary.state === 'loading' && !s} />
        </Reveal>
      </div>
      <Reveal delay={0.2}>
        <RecentCard summary={s} onOpenTx={onOpenTx} onNav={onNav} onAdd={onAdd} />
      </Reveal>
    </div>
  );
}

function Stats({ summary: s }: { summary?: Summary }) {
  const cur = s?.baseCurrency ?? 'IDR';
  const dash = '—';
  const month = s ? monthName(s.month, { year: false }) : '';
  return (
    <div className="fire-stats">
      <Reveal>
        <StatCard
          label={s ? `Net · ${month}` : 'Net'}
          value={s ? money(s.netMinor, cur, { signed: s.netMinor !== 0 }) : dash}
          change={s ? change(s.netMinor, s.previous.netMinor) : undefined}
          icon="IONIconWWalletDefault"
        />
      </Reveal>
      <Reveal delay={0.04}>
        <StatCard
          label={s ? `Income · ${month}` : 'Income'}
          value={s ? money(s.incomeMinor, cur) : dash}
          change={s ? change(s.incomeMinor, s.previous.incomeMinor) : undefined}
          icon="IONIconSStatsChart"
        />
      </Reveal>
      <Reveal delay={0.08}>
        <StatCard
          label={s ? `Spending · ${month}` : 'Spending'}
          value={s ? money(s.spendingMinor, cur) : dash}
          change={s ? change(s.spendingMinor, s.previous.spendingMinor) : undefined}
          // Spending going up is bad news, so it shows red.
          trend={s && s.spendingMinor > s.previous.spendingMinor ? 'down' : 'up'}
          icon="IONIconCCartDefault"
        />
      </Reveal>
      <Reveal delay={0.12}>
        <StatCard
          label="Receipts Scanned"
          value={s ? String(s.receiptCount) : dash}
          change={s ? countChange(s.receiptCount, s.previous.receiptCount) : undefined}
          icon="IONIconDDocumentText"
        />
      </Reveal>
    </div>
  );
}

function Welcome({ summary: s, onNav }: { summary?: Summary; onNav: (p: Page) => void }) {
  const categories = s?.byCategory.filter((c) => c.spendingMinor > 0).length ?? 0;
  let line = 'Your month at a glance.';
  if (s && s.transactionCount === 0) {
    line = 'Nothing recorded yet this month. Double-tap the back of your phone on a bill to add one.';
  } else if (s) {
    line = `You spent ${money(s.spendingMinor, s.baseCurrency)} this month across ${categories} ${categories === 1 ? 'category' : 'categories'}.`;
  }
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
        borderRadius: 'var(--radius-card)',
        minHeight: 344,
        background: `url(${welcomeImage}) center/cover`,
        padding: '36px 31px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Welcome back,</span>
        <span style={{ fontWeight: 700, fontSize: 28, lineHeight: 1.4 }}>{s ? monthName(s.month) : 'This Month'}</span>
        <span style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--text-secondary)', maxWidth: 280 }}>{line}</span>
      </div>
      <button
        type="button"
        onClick={() => onNav('transactions')}
        className="fire-link"
        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: 0, color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}
      >
        View transactions <Icon name="IONIconAArrowForward" size={13} />
      </button>
    </div>
  );
}

function BudgetCard({ summary: s, loading }: { summary?: Summary; loading: boolean }) {
  const { refresh } = useRefresh();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cur = s?.baseCurrency ?? 'IDR';
  const budget = s?.budgetMinor ?? null;

  const save = async (amount: string | null) => {
    setBusy(true);
    setError(null);
    try {
      await putBudget(amount);
      setEditing(false);
      refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = () => {
    setValue(budget !== null ? String(budget / 100) : '');
    setError(null);
    setEditing(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) save(value.trim());
  };

  const form = (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input
        label={`Monthly limit (${cur})`}
        placeholder="e.g. 5.000.000"
        inputMode="decimal"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FormError>{error}</FormError>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button type="submit" disabled={busy || !value.trim()}>
          Save
        </Button>
        {budget !== null ? (
          <Button type="button" variant="danger" icon="Delete" disabled={busy} onClick={() => save(null)}>
            Clear Budget
          </Button>
        ) : null}
        <Button type="button" variant="text" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  let body;
  if (loading) {
    body = <Loading />;
  } else if (!s) {
    body = <Loading label="Waiting for data…" />;
  } else if (editing) {
    body = form;
  } else if (budget === null) {
    body = (
      <Empty
        icon="IONIconWWalletDefault"
        title="No budget set"
        text="Set a monthly spending limit to see how much of it you have used."
        action={<Button onClick={startEdit}>Set Budget</Button>}
      />
    );
  } else {
    const pct = Math.round((s.spendingMinor / budget) * 100);
    const left = budget - s.spendingMinor;
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Gauge
          value={Math.min(pct, 100)}
          caption={pct > 100 ? `${pct}% · Over budget` : 'Of budget used'}
          icon="IONIconWWalletDefault"
          minLabel={compactMoney(0, cur)}
          maxLabel={compactMoney(budget, cur)}
          style={{ height: 240 }}
        />
        <span style={{ textAlign: 'center', font: 'var(--text-body)', color: left < 0 ? 'var(--expense)' : 'var(--text-secondary)' }}>
          {left >= 0 ? `${money(left, cur)} left this month` : `${money(-left, cur)} over budget`}
        </span>
      </div>
    );
  }

  return (
    <Card
      title="Monthly Budget"
      subtitle={s && budget !== null ? `${money(s.spendingMinor, cur)} of ${money(budget, cur)}` : 'Spending limit for this month'}
      action={
        s && budget !== null && !editing ? (
          <Button variant="text" icon="Edit" onClick={startEdit}>
            Edit
          </Button>
        ) : null
      }
      padding="26px 27px"
      style={{ flex: 1 }}
    >
      {body}
    </Card>
  );
}

function CashFlowCard() {
  const year = new Date().getFullYear();
  const flow = useAsync(() => getCashflow(year), [year]);
  const f = flow.data;

  let body;
  if (!f) {
    body = flow.state === 'error' ? <ErrorState message={flow.error} onRetry={flow.reload} /> : <Loading />;
  } else {
    const peak = Math.max(0, ...f.months.flatMap((m) => [m.incomeMinor, m.spendingMinor]));
    if (peak === 0) {
      body = <Empty icon="IONIconSStatsChart" title="No cash flow yet" text={`Income and spending for ${year} will show here.`} />;
    } else {
      const scale = chartScale(peak, f.baseCurrency);
      body = (
        <>
          <div className="fire-linechart">
            <LineChart
              height={300}
              labels={f.months.map((m) => shortMonth(m.month))}
              max={scale.max}
              series={[
                { name: 'Income', color: 'blue', data: f.months.map((m) => m.incomeMinor / scale.divisor) },
                { name: 'Spending', color: 'cyan', data: f.months.map((m) => m.spendingMinor / scale.divisor) },
              ]}
            />
          </div>
          <Legend
            items={[
              { color: 'var(--blue-500)', label: `Income (${scale.unit})` },
              { color: 'var(--cyan-400)', label: `Spending (${scale.unit})` },
            ]}
          />
        </>
      );
    }
  }

  const net = f ? f.months.reduce((n, m) => n + m.incomeMinor - m.spendingMinor, 0) : 0;
  return (
    <Card
      title="Cash Flow"
      subtitle={
        f ? (
          <span>
            <b style={{ color: net >= 0 ? 'var(--income)' : 'var(--expense)' }}>({money(net, f.baseCurrency, { signed: true })})</b> net in {year}
          </span>
        ) : (
          `Income and spending in ${year}`
        )
      }
    >
      {body}
    </Card>
  );
}

function CategoryCard({ summary: s, loading }: { summary?: Summary; loading: boolean }) {
  const categories = useCategories();
  const cur = s?.baseCurrency ?? 'IDR';
  const expense = categories.list.filter((c) => c.kind === 'expense');
  const spend = (id: string) => s?.byCategory.find((b) => b.categoryId === id)?.spendingMinor ?? 0;
  const total = s?.spendingMinor ?? 0;

  let body;
  if (loading || !s) {
    body = <Loading />;
  } else if (total === 0) {
    body = <Empty icon="IONIconCCartDefault" title="No spending yet" text="Spending this month, split by category, will show here." />;
  } else {
    const peak = Math.max(...expense.map((c) => spend(c.id)));
    const scale = chartScale(peak, cur);
    // A tiny stub keeps empty categories visible as a position on the axis.
    const stub = scale.max * 0.015;
    const top = [...s.byCategory].sort((a, b) => b.spendingMinor - a.spendingMinor).slice(0, 3);
    body = (
      <>
        <BarChart
          data={expense.map((c) => Math.max(stub, spend(c.id) / scale.divisor))}
          labels={expense.map((c) => c.label)}
          max={scale.max}
        />
        <div style={{ padding: '28px 6px 6px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: 'var(--text-card-title)' }}>Spending by Category</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {monthName(s.month)} · axis in {scale.unit}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, padding: '18px 6px 6px' }}>
          {top.map((b) => {
            const c = categories.get(b.categoryId);
            return (
              <MiniStat
                key={b.categoryId}
                icon={iconName(c.icon)}
                label={c.label.split(' ')[0]}
                value={compactMoney(b.spendingMinor, cur)}
                progress={(b.spendingMinor / total) * 100}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <Card padding={16} title={loading || !s || total === 0 ? 'Spending by Category' : undefined}>
      {body}
    </Card>
  );
}

function RecentCard({
  summary: s,
  onOpenTx,
  onNav,
  onAdd,
}: {
  summary?: Summary;
  onOpenTx: (id: number) => void;
  onNav: (p: Page) => void;
  onAdd: () => void;
}) {
  const categories = useCategories();
  const recent = useAsync(() => getTransactions({ limit: 5 }), []);
  const items = recent.data?.items;

  let body;
  if (!items) {
    body = recent.state === 'error' ? <ErrorState message={recent.error} onRetry={recent.reload} /> : <Loading />;
  } else if (items.length === 0) {
    body = (
      <Empty
        icon="IONIconDDocumentText"
        title="No transactions yet"
        text="Send a bill from your phone, or add income by hand."
        action={<Button onClick={onAdd}>Add Transaction</Button>}
      />
    );
  } else {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {items.map((t) => (
          <RecentRow key={t.id} t={t} label={categories.get(t.categoryId).label} onClick={() => onOpenTx(t.id)} />
        ))}
      </div>
    );
  }

  return (
    <Card
      title="Recent Transactions"
      subtitle={
        s ? (
          <span>
            <b style={{ color: 'var(--text-primary)' }}>
              {s.transactionCount} {s.transactionCount === 1 ? 'entry' : 'entries'}
            </b>{' '}
            this month
          </span>
        ) : undefined
      }
      action={<Button onClick={() => onNav('transactions')}>View All</Button>}
    >
      {body}
    </Card>
  );
}

function RecentRow({ t, label, onClick }: { t: Transaction; label: string; onClick: () => void }) {
  const base = useBaseCurrency();
  return (
    <TransactionItem
      onClick={onClick}
      title={t.merchant}
      meta={longDateTime(t.occurredAt)}
      category={label}
      amount={<span style={{ color: amountColor(t.direction) }}>{signedMoney(t.amountBaseMinor, base, t.direction)}</span>}
      type={t.direction === 'in' ? 'income' : t.direction === 'out' ? 'expense' : 'pending'}
    />
  );
}
