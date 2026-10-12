import React from 'react';
export function Avatar({src,name,email,collapsed=false,size=40,style}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:collapsed?0:15,minWidth:0,transition:'gap var(--dur-slow) var(--ease-out)',fontFamily:'var(--font-sans)',...style}}>
      <span style={{width:size,height:size,borderRadius:12,flexShrink:0,background:src?`url(${src}) center/cover no-repeat`:'var(--violet-600)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontWeight:700,fontSize:14}}>{src?null:(name||'?').slice(0,1)}</span>
      <span style={{display:'flex',flexDirection:'column',gap:0,minWidth:0,overflow:'hidden',maxWidth:collapsed?0:180,opacity:collapsed?0:1,transition:'opacity var(--dur-base) var(--ease-out), max-width var(--dur-slow) var(--ease-out)'}}>
        {name?<span style={{fontSize:14,lineHeight:1.4,color:'var(--white)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</span>:null}
        {email?<span style={{fontSize:12,lineHeight:1.5,color:'var(--gray-400)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{email}</span>:null}
      </span>
    </div>
  );
}
export default Avatar;
