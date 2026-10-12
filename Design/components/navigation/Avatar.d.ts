import * as React from 'react';
/** User chip — Animated Sidebar "Avatar" (Collapsed: No/Yes). 40px photo (12px radius) + name/email; collapsed shows the photo only. */
export interface AvatarProps {
  src?: string;
  name?: string;
  email?: string;
  collapsed?: boolean;
  size?: number;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
