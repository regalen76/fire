import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Text field. "field" = 50px auth/form input (20px radius, faint glass); "search" = 39.5px header search with icon addon. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: IconName;
  /** Image icon, e.g. assets/icons/search.svg (the source search glyph) */
  iconSrc?: string;
  variant?: 'field' | 'search';
  inputStyle?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
