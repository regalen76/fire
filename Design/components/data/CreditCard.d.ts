import * as React from 'react';
/** Billing "Credit Card" — 20px radius violet card with textured photo fill, brand wordmark, double-circle mark, number, VALID THRU and CVV. Use for linked bank cards. */
export interface CreditCardProps {
  brand?: string;
  number?: string;
  validThru?: string;
  cvv?: string;
  /** Texture photo (assets/images/credit-card-bg.jpg) */
  image?: string;
  style?: React.CSSProperties;
}
export declare function CreditCard(props: CreditCardProps): JSX.Element;
