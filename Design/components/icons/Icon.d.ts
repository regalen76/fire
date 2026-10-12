import * as React from 'react';
export type IconName =
  | "Delete"
  | "Domain"
  | "Edit"
  | "IONIconAArrowForward"
  | "IONIconBBuildDefault"
  | "IONIconCCalendarOutline"
  | "IONIconCCardDefault"
  | "IONIconCCartDefault"
  | "IONIconCCheckmarkCCircle"
  | "IONIconCCubeDefault"
  | "IONIconCCubeSharp"
  | "IONIconDDocumentDefault"
  | "IONIconDDocumentText"
  | "IONIconDDocumentsDefault"
  | "IONIconGGlobeOutline"
  | "IONIconHHelpCircle"
  | "IONIconHHomeDefault"
  | "IONIconKKeyDefault"
  | "IONIconLLogoApple"
  | "IONIconLLogoCss3"
  | "IONIconLLogoGoogle"
  | "IONIconLLogoInstagram"
  | "IONIconLLogoTwitter"
  | "IONIconNNotificationsDefault"
  | "IONIconPPersonCircle"
  | "IONIconPPersonDefault"
  | "IONIconRRocketSharp"
  | "IONIconSSettingsSharp"
  | "IONIconSStatsChart"
  | "IONIconWWalletDefault"
  | "MoreHoriz"
  | "MoreVert"
  | "PriorityHigh"
  | "TagFaces";
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}
export declare const Icon: React.FC<IconProps>;
export default Icon;
