import * as React from 'react';
/** Vision UI "Need Help" sidebar promo — 15px radius blue card with photo fill, white icon tile and glass button. Collapsed shows icon only. */
export interface HelpCardProps {
  title?: string;
  text?: string;
  cta?: string;
  /** Background photo URL (assets/images/help-card-bg.jpg) */
  image?: string;
  collapsed?: boolean;
  onCta?: () => void;
  style?: React.CSSProperties;
}
export declare function HelpCard(props: HelpCardProps): JSX.Element;
