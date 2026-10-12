import * as React from 'react';
/** Vision UI "Active Users" bar chart — 6px white rounded bars on a nested navy gradient panel with white 10px y-axis. */
export interface BarChartProps {
  data: number[];
  labels?: string[];
  max?: number;
  ticks?: number;
  height?: number;
  barColor?: string;
  style?: React.CSSProperties;
}
export declare function BarChart(props: BarChartProps): JSX.Element;
