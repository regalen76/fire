import { useCallback, useEffect, useRef, useState } from 'react';
import { getReceipts } from './api';
import { AddTransaction } from './AddTransaction';
import { DataProvider, usePersisted, useRefresh } from './data';
import { Dashboard } from './screens/Dashboard';
import { Receipts } from './screens/Receipts';
import { Transactions } from './screens/Transactions';
import { PAGES, Shell, type Page } from './Shell';
import { TransactionDrawer } from './TransactionDrawer';

export function App() {
  return (
    <DataProvider>
      <Main />
    </DataProvider>
  );
}

function Main() {
  const [page, setPage] = usePersisted<Page>('fire-page', 'dashboard');
  const [collapsed, setCollapsed] = usePersisted<'0' | '1'>('fire-collapsed', '0');
  const [search, setSearch] = useState('');
  const [openTx, setOpenTx] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const processing = useProcessingCount();
  const current = PAGES.includes(page) ? page : 'dashboard';

  const onSearch = (q: string) => {
    setSearch(q);
    if (q.trim() && current !== 'transactions') setPage('transactions');
  };

  return (
    <>
      <Shell
        page={current}
        onNav={setPage}
        collapsed={collapsed === '1'}
        onToggle={(c) => setCollapsed(c ? '1' : '0')}
        processing={processing}
        onSearch={onSearch}
        onAdd={() => setAdding(true)}
      >
        {current === 'dashboard' ? <Dashboard onOpenTx={setOpenTx} onNav={setPage} onAdd={() => setAdding(true)} /> : null}
        {current === 'transactions' ? <Transactions search={search} onOpenTx={setOpenTx} onAdd={() => setAdding(true)} /> : null}
        {current === 'receipts' ? <Receipts onOpenTx={setOpenTx} /> : null}
      </Shell>
      <TransactionDrawer id={openTx} onClose={() => setOpenTx(null)} />
      <AddTransaction
        open={adding}
        onClose={() => setAdding(false)}
        onCreated={(id) => {
          setAdding(false);
          setOpenTx(id);
        }}
      />
    </>
  );
}

/**
 * Polls receipts still being read: every 2s while any exist, every 5s otherwise
 * (a Back Tap can add one at any time). Whenever the processing set or the newest
 * receipt changes, every screen re-fetches, so new and finished receipts show up
 * without a reload, even one that was read entirely between two polls.
 */
function useProcessingCount(): number {
  const { refresh } = useRefresh();
  const [count, setCount] = useState(0);
  const last = useRef<string | null>(null);
  const onChange = useCallback(refresh, [refresh]);

  useEffect(() => {
    let stop = false;
    let timer: number | undefined;
    const tick = async () => {
      let next = 5000;
      try {
        const [list, newest] = await Promise.all([
          getReceipts({ status: 'processing', limit: 100 }),
          getReceipts({ limit: 1 }),
        ]);
        if (stop) return;
        const key = `${list.map((r) => r.id).join(',')}|${newest[0]?.id ?? ''}`;
        if (last.current !== null && key !== last.current) onChange();
        last.current = key;
        setCount(list.length);
        if (list.length > 0) next = 2000;
      } catch {
        // Backend down: try again later; screens show their own errors.
      }
      if (!stop) timer = window.setTimeout(tick, next);
    };
    tick();
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, [onChange]);

  return count;
}
