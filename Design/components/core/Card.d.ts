import * as React from 'react';
/** Translucent navy glass panel (20px radius, 120px backdrop blur) — the base surface of every Vision UI screen. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** default = main panel · soft = lower-contrast panel · inset = nested tile inside a card · row = list row (Billing Information) */
  variant?: 'default' | 'soft' | 'inset' | 'row';
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Top-right slot, e.g. a Button or MoreHoriz icon button */
  action?: React.ReactNode;
  padding?: number | string;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
