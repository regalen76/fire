import React from 'react';
import { Icon } from '../icons/Icon.jsx';
export function SidebarToggle({collapsed=false,onClick,style}){
  const [hover,setHover]=React.useState(false);
  return (
    <button type="button" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,padding:0,border:'none',borderRadius:'50%',cursor:'pointer',
        background:hover?'var(--blue-500)':'var(--navy-700)',color:'var(--white)',boxShadow:'0 0 0 3px var(--navy-900)',transition:'background var(--dur-fast) var(--ease-out)',...style}}>
      <Icon name="IONIconAArrowForward" size={14} style={{transform:collapsed?'none':'rotate(180deg)',transition:'transform var(--dur-slow) var(--ease-out)'}}/>
    </button>
  );
}
export default SidebarToggle;
