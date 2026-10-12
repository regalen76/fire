import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar, type SidebarSection } from '@design/components/navigation/Sidebar';
import { PageHeader } from '@design/components/navigation/PageHeader';
import { Button } from '@design/components/core/Button';
import { Icon } from '@design/components/icons/Icon';
import helpImage from '@design/assets/images/help-card-bg.jpg';
import searchIcon from '@design/assets/icons/search.svg';
import { useIsPhone } from './data';
import { EASE_OUT } from './ui';

export type Page = 'dashboard' | 'transactions' | 'receipts';

export const PAGES: Page[] = ['dashboard', 'transactions', 'receipts'];

const TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  receipts: 'Receipts',
};

interface ShellProps {
  page: Page;
  onNav: (p: Page) => void;
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  /** Receipts still being read; shown as a nav badge. */
  processing: number;
  onSearch: (q: string) => void;
  onAdd: () => void;
  children: ReactNode;
}

export function Shell({ page, onNav, collapsed, onToggle, processing, onSearch, onAdd, children }: ShellProps) {
  const phone = useIsPhone();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!phone) setMenuOpen(false);
  }, [phone]);

  const sections: SidebarSection[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'IONIconHHomeDefault' },
        { id: 'transactions', label: 'Transactions', icon: 'IONIconSStatsChart' },
        { id: 'receipts', label: 'Receipts', icon: 'IONIconDDocumentText', badge: processing > 0 ? processing : undefined },
      ],
    },
  ];

  const go = (id: string) => {
    onNav(id as Page);
    setMenuOpen(false);
  };

  const sidebar = (c: boolean, toggle: (c: boolean) => void) => (
    <Sidebar
      brand="FIRE FINANCE"
      brandShort="FF"
      sections={sections}
      activeId={page}
      onSelect={go}
      collapsed={c}
      onToggle={toggle}
      help={{
        image: helpImage,
        title: 'Scan a bill',
        text: 'Double-tap the back of your phone',
        cta: 'HOW IT WORKS',
        onCta: () => go('receipts'),
      }}
    />
  );

  return (
    <div className="fire-shell">
      {phone ? (
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              key="menu"
              className="fire-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                className="fire-menu"
                initial={{ x: '-110%' }}
                animate={{ x: 0 }}
                exit={{ x: '-110%' }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                onClick={(e) => e.stopPropagation()}
              >
                {sidebar(false, () => setMenuOpen(false))}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : (
        <div className="fire-sidebar">{sidebar(collapsed, onToggle)}</div>
      )}
      <main className="fire-main">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {phone ? (
            <button type="button" className="fire-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Icon name="MoreVert" size={20} />
              {processing > 0 ? <span className="fire-menu-dot" /> : null}
            </button>
          ) : null}
          <PageHeader
            title={TITLES[page]}
            trail={['Fire']}
            searchIconSrc={searchIcon}
            searchPlaceholder="Search transactions..."
            onSearch={(e) => onSearch(e.target.value)}
            actions={
              <Button size="sm" icon="IONIconWWalletDefault" onClick={onAdd} aria-label="Add Transaction">
                {phone ? 'Add' : 'Add Transaction'}
              </Button>
            }
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <footer className="fire-footer">
          <span>© 2026, Fire</span>
          <a href="#receipts" onClick={(e) => (e.preventDefault(), go('receipts'))}>
            How It Works
          </a>
        </footer>
      </main>
    </div>
  );
}
