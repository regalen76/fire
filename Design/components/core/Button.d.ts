import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Vision UI "_Button/Base" — 10px bold uppercase label, 12px radius. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = solid blue (VIEW ALL / ADD A NEW CARD); glass = translucent navy (DOCUMENTATION); ghost = 8% white; text/danger = inline EDIT / DELETE actions */
  variant?: 'primary' | 'glass' | 'ghost' | 'text' | 'danger';
  /** sm 28px · md 35px (default) · lg 45px (sign-in CTA) */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: IconName;
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
