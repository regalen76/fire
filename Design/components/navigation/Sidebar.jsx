import React from 'react';
import { Logo } from './Logo.jsx';
import { NavItem } from './NavItem.jsx';
import { SidebarToggle } from './SidebarToggle.jsx';
import { Avatar } from './Avatar.jsx';
import { HelpCard } from './HelpCard.jsx';
export function Sidebar({brand='VISION UI FREE',brandShort,sections=[],activeId,onSelect,collapsed,defaultCollapsed=false,onToggle,user,help,style}){
  const [inner,setInner]=React.useState(defaultCollapsed);
  const c=collapsed??inner;
  const toggle=()=>{if(collapsed===undefined)setInner(!c);onToggle&&onToggle(!c);};
  return (
    <aside style={{position:'relative',flexShrink:0,width:c?'var(--sidebar-width-collapsed)':'var(--sidebar-width)',height:'100%',borderRadius:20,background:'var(--gradient-sidebar)',backdropFilter:'var(--blur-card)',WebkitBackdropFilter:'var(--blur-card)',boxSizing:'border-box',padding:c?'36px 22px 24px':'36px 22px 24px 23px',display:'flex',flexDirection:'column',transition:'width var(--dur-slow) var(--ease-out)',fontFamily:'var(--font-sans)',...style}}>
      <SidebarToggle collapsed={c} onClick={toggle} style={{position:'absolute',top:22,right:-14,zIndex:2}}/>
      <Logo name={brand} short={brandShort} collapsed={c}/>
      <nav style={{display:'flex',flexDirection:'column',gap:0,marginTop:22,flex:1,minHeight:0,overflowY:'auto',overflowX:'hidden'}}>
        {sections.map((sec,si)=>(
          <div key={si} style={{display:'flex',flexDirection:'column',gap:12,marginTop:si?12:0}}>
            {sec.label?<span style={{height:18,paddingLeft:c?0:16,textAlign:c?'center':'left',font:'var(--fw-regular) 12px/1.5 var(--font-sans)',color:'var(--white)',whiteSpace:'nowrap',overflow:'hidden'}}>{c?'•••':sec.label}</span>:null}
            {sec.items.map(it=>(
              <NavItem key={it.id} icon={it.icon} label={it.label} badge={it.badge} collapsed={c} active={it.id===activeId} onClick={()=>onSelect&&onSelect(it.id)}/>
            ))}
          </div>
        ))}
      </nav>
      {help?<HelpCard {...help} collapsed={c} style={{marginTop:24}}/>:null}
      {user?<Avatar {...user} collapsed={c} style={{marginTop:20,paddingLeft:c?2:4}}/>:null}
    </aside>
  );
}
export default Sidebar;
