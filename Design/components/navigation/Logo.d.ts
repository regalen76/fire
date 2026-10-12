import * as React from 'react';
/** Typographic wordmark (no logo file in the sources) — 14px, 0.18em tracking, with the sidebar's gradient hairline. Collapsed shows initials. */
export interface LogoProps {
  name?: string;
  /** Text shown when collapsed; defaults to initials */
  short?: string;
  collapsed?: boolean;
  divider?: boolean;
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;
