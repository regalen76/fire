import React from 'react';
export function ProgressBar({value=0,label,width=125,color='var(--blue-500)',style}){
  const v=Math.max(0,Math.min(100,value));
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4,width,fontFamily:'var(--font-sans)',...style}}>
      {label!==undefined?<span style={{fontWeight:700,fontSize:14,lineHeight:1.4,color:'var(--white)'}}>{label}</span>:null}
      <span style={{position:'relative',height:3,borderRadius:1.5,background:'var(--track)'}}>
        <span style={{position:'absolute',left:0,top:0,bottom:0,width:v+'%',borderRadius:1.5,background:color,transition:'width var(--dur-slow) var(--ease-out)'}}/>
      </span>
    </div>
  );
}
export default ProgressBar;
