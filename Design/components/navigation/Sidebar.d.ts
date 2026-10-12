import * as React from 'react';
import { IconName } from '../icons/Icon';
import { HelpCardProps } from './HelpCard';
export interface SidebarItem { id: string; label: string; icon: IconName; badge?: React.ReactNode; }
export interface SidebarSection { label?: string; items: SidebarItem[]; }
/** Animated collapsible sidebar — Animated Sidebar "Sidebar" (Collapsed: No/Yes) skinned with Vision UI's dark glass. 264px ↔ 88px width animation, label fade, toggle on the edge. */
export interface SidebarProps {
  brand?: string;
  brandShort?: string;
  sections: SidebarSection[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Controlled collapsed state; omit to let the sidebar manage it */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  user?: { src?: string; name?: string; email?: string };
  help?: HelpCardProps;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
