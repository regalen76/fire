import React from 'react';
import { IconTile } from '../core/IconTile.jsx';
import { ProgressBar } from '../core/ProgressBar.jsx';
export function MiniStat({icon='IONIconWWalletDefault',label,value,progress,style}){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8,minWidth:100,fontFamily:'var(--font-sans)',...style}}>
      <span style={{display:'flex',alignItems:'center',gap:10}}>
        <IconTile icon={icon} size="xs" tone="blue"/>
        <span style={{fontSize:14,lineHeight:1.5,color:'var(--gray-400)'}}>{label}</span>
      </span>
      <span style={{fontWeight:700,fontSize:18,lineHeight:1.4,color:'var(--white)'}}>{value}</span>
      {progress!==undefined?<ProgressBar value={progress} width="100%"/>:null}
    </div>
  );
}
export default MiniStat;
