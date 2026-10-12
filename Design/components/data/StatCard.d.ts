import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Vision UI "Total Sales" KPI tile — 80px tall glass card, gray label, bold value, green/red change, 45px blue icon tile. */
export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** e.g. "+55%" / "-14%" */
  change?: string;
  /** Inferred from the sign of change when omitted */
  trend?: 'up' | 'down';
  icon?: IconName;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
