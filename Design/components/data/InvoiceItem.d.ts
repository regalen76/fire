import * as React from 'react';
/** Billing "Invoices" row — date, reference id, amount and a PDF link. Also suits scanned-receipt history. */
export interface InvoiceItemProps {
  date: React.ReactNode;
  id: React.ReactNode;
  amount: React.ReactNode;
  format?: string;
  onDownload?: () => void;
  style?: React.CSSProperties;
}
export declare function InvoiceItem(props: InvoiceItemProps): JSX.Element;
