import * as React from 'react';
/** Top bar: "Pages / X" breadcrumb + page title on the left; search, user, settings, notifications on the right. */
export interface PageHeaderProps {
  trail?: string[];
  title?: string;
  searchPlaceholder?: string;
  /** Path to assets/icons/search.svg relative to the page */
  searchIconSrc?: string;
  userLabel?: string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Replace the right-hand icon cluster */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
