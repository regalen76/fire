import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Rounded square holding a single glyph — used in stat cards, nav items, mini-stats and the help card. */
export interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconName;
  /** xs 25 (mini stat) · sm 30 (nav) · md 35 (help card) · lg 45 (stat card) */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** blue = active/stat · navy = inactive nav · white = help card · ghost = 8% white (transaction category) */
  tone?: 'blue' | 'navy' | 'white' | 'ghost';
  round?: boolean;
}
export declare function IconTile(props: IconTileProps): JSX.Element;
