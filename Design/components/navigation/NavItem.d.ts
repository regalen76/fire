import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Sidebar row — Animated Sidebar "Nav item" (State: Default/Hover/Active × Collapsed: No/Yes) rendered in Vision UI dark styling: 54px, 15px radius, 30px icon tile. */
export interface NavItemProps {
  icon: IconName;
  label: string;
  /** Active = navy-700 fill + blue icon tile */
  active?: boolean;
  /** Collapsed hides the label (animated) and turns the badge into a dot */
  collapsed?: boolean;
  badge?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function NavItem(props: NavItemProps): JSX.Element;
