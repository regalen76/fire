import * as React from 'react';
/** Collapse/expand control — Animated Sidebar "Button" (Hover: No/Yes). Navy circle that turns blue on hover; arrow rotates with state. */
export interface SidebarToggleProps {
  collapsed?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function SidebarToggle(props: SidebarToggleProps): JSX.Element;
