import * as React from 'react';
import { IconName } from '../icons/Icon';
/** Vision UI "Satisfaction Rate" radial progress — 3/4 arc in blue over navy track, center icon disc, and a glass readout pill. Good for budget-used %. */
export interface GaugeProps {
  value: number;
  caption?: string;
  icon?: IconName;
  minLabel?: string;
  maxLabel?: string;
  style?: React.CSSProperties;
}
export declare function Gauge(props: GaugeProps): JSX.Element;
