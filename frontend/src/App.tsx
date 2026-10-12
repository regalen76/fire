import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@design/components/core/Card';
import { StatCard } from '@design/components/data/StatCard';
import { getSummary, type Stat } from './api';

export function App() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSummary().then(setStats, (e: Error) => setError(e.message));
  }, []);

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24, display: 'grid', gap: 24 }}>
      <Card title="Overview" subtitle="Your money at a glance">
        {error ? <div style={{ color: 'var(--red-500)' }}>{error}</div> : null}
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            >
              <StatCard label={s.label} value={s.value} change={s.change} />
            </motion.div>
          ))}
        </div>
      </Card>
    </main>
  );
}
