import React from 'react';
import { Icon } from '../icons/Icon.jsx';
const SIZES={xs:{box:25,icon:12.5,r:6},sm:{box:30,icon:15,r:12},md:{box:35,icon:24,r:12},lg:{box:45,icon:22.5,r:12}};
const TONES={
  blue:{bg:'var(--blue-500)',fg:'var(--white)'},
  navy:{bg:'var(--navy-700)',fg:'var(--blue-500)'},
  white:{bg:'var(--white)',fg:'var(--blue-500)'},
  ghost:{bg:'var(--surface-ghost)',fg:'var(--violet-500)'}
};
export function IconTile({icon,size='lg',tone='blue',round=false,style,...rest}){
  const s=SIZES[size]||SIZES.lg,t=TONES[tone]||TONES.blue;
  return (
    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,width:s.box,height:s.box,borderRadius:round?'50%':s.r,background:t.bg,color:t.fg,boxShadow:'var(--shadow-tile)',transition:'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',...style}} {...rest}>
      <Icon name={icon} size={s.icon}/>
    </span>
  );
}
export default IconTile;
