import React from 'react';
import { IconTile } from '../core/IconTile.jsx';
export function StatCard({label,value,change,trend,icon='IONIconWWalletDefault',style}){
  const t=trend??(String(change||'').trim().startsWith('-')?'down':'up');
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,height:80,padding:'0 17.5px 0 21.5px',borderRadius:20,background:'var(--gradient-stat)',backdropFilter:'var(--blur-card)',WebkitBackdropFilter:'var(--blur-card)',boxSizing:'border-box',fontFamily:'var(--font-sans)',minWidth:0,...style}}>
      <div style={{display:'flex',flexDirection:'column',gap:2,minWidth:0}}>
        <span style={{fontWeight:500,fontSize:12,lineHeight:1.5,color:'var(--gray-400)',whiteSpace:'nowrap'}}>{label}</span>
        <span style={{display:'flex',alignItems:'baseline',gap:5,whiteSpace:'nowrap'}}>
          <span style={{fontWeight:700,fontSize:18,lineHeight:1.4,color:'var(--white)'}}>{value}</span>
          {change?<span style={{fontWeight:700,fontSize:14,lineHeight:1.4,color:t==='down'?'var(--red-500)':'var(--green-500)'}}>{change}</span>:null}
        </span>
      </div>
      <IconTile icon={icon} size="lg" tone="blue"/>
    </div>
  );
}
export default StatCard;
