import React from 'react';
import { IconTile } from '../core/IconTile.jsx';
import { Badge } from '../core/Badge.jsx';
export function NavItem({icon,label,active=false,collapsed=false,badge,onClick,style}){
  const [hover,setHover]=React.useState(false);
  const bg=active?'var(--surface-nav-active)':hover?'rgba(26,31,55,0.55)':'transparent';
  return (
    <button type="button" title={collapsed?label:undefined} onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{position:'relative',display:'flex',alignItems:'center',gap:collapsed?0:15,width:'100%',height:54,padding:collapsed?'12px 7px':'12px 16px',border:'none',borderRadius:'var(--radius-nav)',background:bg,boxShadow:active?'var(--shadow-tile)':'none',cursor:'pointer',boxSizing:'border-box',textAlign:'left',transition:'background var(--dur-base) var(--ease-out), padding var(--dur-slow) var(--ease-out), gap var(--dur-slow) var(--ease-out)',...style}}>
      <IconTile icon={icon} size="sm" tone={active?'blue':'navy'} style={{transform:hover&&!active?'translateX(2px)':'none',transition:'transform var(--dur-fast) var(--ease-out), background var(--dur-base)'}}/>
      <span style={{flex:1,minWidth:0,overflow:'hidden',whiteSpace:'nowrap',font:'var(--fw-regular) 14px/1 var(--font-sans)',color:'var(--white)',opacity:collapsed?0:1,maxWidth:collapsed?0:200,transition:'opacity var(--dur-base) var(--ease-out), max-width var(--dur-slow) var(--ease-out)'}}>{label}</span>
      {badge!==undefined&&badge!==null?(collapsed
        ?<Badge variant="dot" tone="blue" style={{position:'absolute',top:12,left:34}}/>
        :<Badge variant="count" tone="blue">{badge}</Badge>):null}
    </button>
  );
}
export default NavItem;
