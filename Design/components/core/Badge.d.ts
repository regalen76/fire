import * as React from 'react';
/** Badge. "count" / "dot" come from the Animated Sidebar file's Badge (nav notification count); "solid" / "outline" are the Tables status chips (Online / Offline). */
export interface BadgeProps {
  variant?: 'count' | 'dot' | 'solid' | 'outline';
  tone?: 'green' | 'blue' | 'red' | 'orange' | 'gray';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
