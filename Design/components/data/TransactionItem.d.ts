import * as React from 'react';
/** Billing "Your Transactions" row — 35px outlined circle (green in / red out / gray pending) with arrow, title + date, signed amount. Optional category chip for receipt-scanned spend. */
export interface TransactionItemProps {
  title: React.ReactNode;
  /** Secondary line, e.g. "27 March 2020, at 12:30 PM" */
  meta?: React.ReactNode;
  /** Pre-formatted, e.g. "+$2500" / "-$2500" / "Pending" */
  amount: React.ReactNode;
  type?: 'income' | 'expense' | 'pending';
  category?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function TransactionItem(props: TransactionItemProps): JSX.Element;
