import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { IconName } from '@design/components/icons/Icon';
import { Card } from '@design/components/core/Card';
import { StatCard } from '@design/components/data/StatCard';
import { getSummary, type Summary } from './api';
import { change, money } from './format';

export function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSummary().then(setSummary, (e: Error) => setError(e.message));
  }, []);

  const cur = summary?.baseCurrency ?? 'IDR';
  const stats: { label: string; value: string; change?: string; trend?: 'up' | 'down'; icon: IconName }[] =
    summary
      ? [
          { label: 'Net This Month', value: money(summary.netMinor, cur), icon: 'IONIconWWalletDefault' },
          {
            label: 'Income',
            value: money(summary.incomeMinor, cur),
            change: change(summary.incomeMinor, summary.previous.incomeMinor),
            icon: 'IONIconSStatsChart',
          },
          {
            label: 'Spending',
            value: money(summary.spendingMinor, cur),
            change: change(summary.spendingMinor, summary.previous.spendingMinor),
            // Spending going up is bad news.
            trend: summary.spendingMinor > summary.previous.spendingMinor ? 'down' : 'up',
            icon: 'IONIconCCartDefault',
          },
          { label: 'Receipts Scanned', value: String(summary.receiptCount), icon: 'IONIconDDocumentText' },
        ]
      : [];

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24, display: 'grid', gap: 24 }}>
      <Card title="Overview" subtitle="Your money this month">
        {error ? <div style={{ color: 'var(--red-500)' }}>{error}</div> : null}
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            >
              <StatCard label={s.label} value={s.value} change={s.change} trend={s.trend} icon={s.icon} />
            </motion.div>
          ))}
        </div>
      </Card>
    </main>
  );
}
