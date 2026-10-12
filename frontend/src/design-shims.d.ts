// Design/*.d.ts use the pre-React-19 global JSX namespace.
import type * as React from 'react';

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
  }
}
