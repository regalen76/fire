import * as React from 'react';
/** Vision UI "Sales overview" / "Line Chart 2" (Type: Increased) — smooth area chart with gradient fills (blue, cyan, green), dashed navy grid and 10px bold axis labels. */
export interface LineChartSeries { name?: string; data: number[]; color?: 'blue' | 'cyan' | 'green'; }
export interface LineChartProps {
  series: LineChartSeries[];
  labels?: string[];
  /** Y max; defaults to data max rounded up to 100 */
  max?: number;
  ticks?: number;
  height?: number;
  style?: React.CSSProperties;
}
export declare function LineChart(props: LineChartProps): JSX.Element;
