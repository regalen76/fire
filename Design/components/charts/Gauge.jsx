import React from 'react';
import { Icon } from '../icons/Icon.jsx';
export function Gauge({value=95,caption='Based on likes',icon='TagFaces',minLabel='0%',maxLabel='100%',style}){
  const v=Math.max(0,Math.min(100,value));
  const r=100,c=Math.PI*r*1.5;
  return (
    <div style={{position:'relative',width:'100%',maxWidth:293,height:250,margin:'0 auto',fontFamily:'var(--font-sans)',...style}}>
      <svg viewBox="0 0 220 220" style={{position:'absolute',left:'50%',top:0,width:212,height:212,transform:'translateX(-50%) rotate(135deg)'}}>
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgb(34,35,75)" strokeWidth="12" strokeLinecap="round" strokeDasharray={c+' 999'}/>
        <circle cx="110" cy="110" r={r} fill="none" stroke="var(--blue-500)" strokeWidth="12" strokeLinecap="round" strokeDasharray={(c*v/100)+' 999'} style={{transition:'stroke-dasharray var(--dur-slow) var(--ease-out)'}}/>
      </svg>
      <span style={{position:'absolute',left:'50%',top:82,transform:'translateX(-50%)',width:48,height:48,borderRadius:'50%',background:'var(--blue-500)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)'}}><Icon name={icon} size={30}/></span>
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:82,borderRadius:20,background:'var(--gradient-card-soft)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',boxSizing:'border-box'}}>
        <span style={{fontSize:12,color:'var(--gray-400)'}}>{minLabel}</span>
        <span style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <span style={{fontWeight:700,fontSize:28,lineHeight:1.4,color:'var(--white)'}}>{v}%</span>
          <span style={{fontSize:12,color:'var(--gray-400)'}}>{caption}</span>
        </span>
        <span style={{fontSize:12,color:'var(--gray-400)'}}>{maxLabel}</span>
      </div>
    </div>
  );
}
export default Gauge;
