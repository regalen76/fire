import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Active Users "Items" — 25px icon tile + label, bold value, thin progress bar. */
export interface MiniStatProps {
  icon?: IconName;
  label: string;
  value: React.ReactNode;
  progress?: number;
  style?: React.CSSProperties;
}
export declare function MiniStat(props: MiniStatProps): JSX.Element;
