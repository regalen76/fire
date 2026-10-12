import * as React from 'react';
/** Vision UI "_Switch/Base" — 36×18.5 pill, blue when on (e.g. "Remember me"). */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
