import * as React from 'react';
/** 3px rounded track (navy-500) with a blue fill — Tables "COMPLETION" and Active Users mini-stats. */
export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  /** Bold 14px label above the bar, e.g. "60%" */
  label?: React.ReactNode;
  width?: number | string;
  color?: string;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
