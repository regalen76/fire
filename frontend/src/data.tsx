// Shared app state: categories (fetched once), a refresh signal that screens
// re-fetch on after any write, and a small async-data hook.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { IconName } from '@design/components/icons/Icon';
import { getBudget, getCategories, type Category, type CategoryKind, type Direction } from './api';

// The 34 names from Icon.d.ts; a category icon outside this set falls back to MoreHoriz.
const ICONS = new Set<string>([
  'Delete', 'Domain', 'Edit', 'IONIconAArrowForward', 'IONIconBBuildDefault', 'IONIconCCalendarOutline',
  'IONIconCCardDefault', 'IONIconCCartDefault', 'IONIconCCheckmarkCCircle', 'IONIconCCubeDefault',
  'IONIconCCubeSharp', 'IONIconDDocumentDefault', 'IONIconDDocumentText', 'IONIconDDocumentsDefault',
  'IONIconGGlobeOutline', 'IONIconHHelpCircle', 'IONIconHHomeDefault', 'IONIconKKeyDefault',
  'IONIconLLogoApple', 'IONIconLLogoCss3', 'IONIconLLogoGoogle', 'IONIconLLogoInstagram',
  'IONIconLLogoTwitter', 'IONIconNNotificationsDefault', 'IONIconPPersonCircle', 'IONIconPPersonDefault',
  'IONIconRRocketSharp', 'IONIconSSettingsSharp', 'IONIconSStatsChart', 'IONIconWWalletDefault',
  'MoreHoriz', 'MoreVert', 'PriorityHigh', 'TagFaces',
]);

export function iconName(name: string | undefined): IconName {
  return (name && ICONS.has(name) ? name : 'MoreHoriz') as IconName;
}

/** Which category kind fits a direction. */
export function kindFor(direction: Direction): CategoryKind {
  return direction === 'in' ? 'income' : direction === 'out' ? 'expense' : 'internal';
}

interface Categories {
  list: Category[];
  get: (id: string) => Category;
  forDirection: (d: Direction) => Category[];
}

const CategoriesContext = createContext<Categories | null>(null);
const BaseCurrencyContext = createContext('IDR');

interface Refresh {
  /** Bumps after any write; include it in effect deps to re-fetch. */
  version: number;
  refresh: () => void;
}

const RefreshContext = createContext<Refresh>({ version: 0, refresh: () => {} });

export function DataProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Category[]>([]);
  const [version, setVersion] = useState(0);
  const [base, setBase] = useState('IDR');
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    // Retry quietly: until categories arrive, labels fall back to ids.
    let stop = false;
    let timer: number | undefined;
    const load = () =>
      Promise.all([getCategories(), getBudget()]).then(
        ([c, b]) => {
          if (stop) return;
          setList(c);
          // The budget endpoint names the base currency (FIRE_BASE_CURRENCY).
          setBase(b.currency);
        },
        () => {
          if (!stop) timer = window.setTimeout(load, 3000);
        },
      );
    load();
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, []);

  const categories: Categories = {
    list,
    get: (id) => list.find((c) => c.id === id) ?? { id, label: id, icon: 'MoreHoriz', kind: 'expense' },
    forDirection: (d) => list.filter((c) => c.kind === kindFor(d)),
  };

  return (
    <CategoriesContext.Provider value={categories}>
      <BaseCurrencyContext.Provider value={base}>
        <RefreshContext.Provider value={{ version, refresh }}>{children}</RefreshContext.Provider>
      </BaseCurrencyContext.Provider>
    </CategoriesContext.Provider>
  );
}

export function useCategories(): Categories {
  const c = useContext(CategoriesContext);
  if (!c) throw new Error('useCategories outside DataProvider');
  return c;
}

/** Currency every total and `amountBaseMinor` is in. */
export function useBaseCurrency(): string {
  return useContext(BaseCurrencyContext);
}

export function useRefresh(): Refresh {
  return useContext(RefreshContext);
}

export type Async<T> =
  | { state: 'loading'; data?: T }
  | { state: 'error'; error: string; data?: T }
  | { state: 'ready'; data: T };

/**
 * Runs `load` when `deps` (or the global refresh version) change. Keeps the previous
 * data while re-loading so screens don't flash back to a spinner.
 */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): Async<T> & { reload: () => void } {
  const { version } = useRefresh();
  const [result, setResult] = useState<Async<T>>({ state: 'loading' });
  const [nonce, setNonce] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let live = true;
    setResult((r) => ({ state: 'loading', data: r.data }));
    loadRef.current().then(
      (data) => live && setResult({ state: 'ready', data }),
      (e: Error) => live && setResult((r) => ({ state: 'error', error: e.message, data: r.data })),
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version, nonce]);

  return { ...result, reload: () => setNonce((n) => n + 1) };
}

export function useMediaQuery(q: string): boolean {
  const [match, setMatch] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mql = window.matchMedia(q);
    const on = () => setMatch(mql.matches);
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, [q]);
  return match;
}

/** Phone layout: sidebar becomes a drawer, tables become lists. */
export const useIsPhone = () => useMediaQuery('(max-width: 760px)');

/** Reads and writes a string in localStorage, ignoring storage errors. */
export function usePersisted<T extends string>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      return (localStorage.getItem(key) as T | null) ?? initial;
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, v);
    } catch {
      // Private mode or blocked storage: keep it in memory only.
    }
  };
  return [value, set];
}
