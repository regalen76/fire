import * as React from 'react';
/** Vision UI "Balance" component — 103px gradient tile with light wedge, 12px label, 34px bold amount, sparkline and more button. */
export interface BalanceProps {
  title?: string;
  amount: React.ReactNode;
  /** Sparkline image (assets/images/balance-graph.svg) */
  graphSrc?: string;
  onMore?: () => void;
  style?: React.CSSProperties;
}
export declare function Balance(props: BalanceProps): JSX.Element;
