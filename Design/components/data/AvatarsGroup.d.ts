import * as React from 'react';
/** Vision UI "Avatars Group 3 (Horizontal)" — overlapping circular photos with a ring. Ring uses navy on dark surfaces (source: 4px white on 46px). */
export interface AvatarsGroupProps {
  srcs: string[];
  size?: number;
  overlap?: number;
  max?: number;
  style?: React.CSSProperties;
}
export declare function AvatarsGroup(props: AvatarsGroupProps): JSX.Element;
