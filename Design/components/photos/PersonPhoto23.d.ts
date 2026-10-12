import * as React from 'react';
/** Vision UI "Person Photo 23" symbol — a 320×320 square portrait, used inside avatars and Avatars Group 3. */
export interface PersonPhoto23Props {
  /** Image URL; defaults to assets/images/avatar-4.png resolved from components/photos/. Pass an explicit path from other locations. */
  src?: string;
  /** Square edge in px. Figma symbol is 320. */
  size?: number;
  /** Corner radius; avatars use 12–15px or '50%'. */
  radius?: number | string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function PersonPhoto23(props: PersonPhoto23Props): JSX.Element;
export default PersonPhoto23;
