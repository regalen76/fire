import * as React from 'react';
/** Vision UI "Breadcrumb/Item/Previous" — 12px gray trail separated by "/", current page in white. */
export interface BreadcrumbProps {
  items?: string[];
  current?: string;
  style?: React.CSSProperties;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
