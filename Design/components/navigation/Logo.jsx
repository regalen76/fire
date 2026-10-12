import React from 'react';
export function Logo({name='VISION UI FREE',short,collapsed=false,divider=true,style}){
  const s=short??name.split(/\s+/).map(w=>w[0]).join('').slice(0,2);
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:31.5,width:'100%',...style}}>
      <div style={{position:'relative',height:14,width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <span style={{position:'absolute',font:'var(--fw-regular) 14px/1 var(--font-sans)',letterSpacing:'var(--ls-logo)',color:'var(--white)',whiteSpace:'nowrap',opacity:collapsed?0:1,transform:collapsed?'scale(0.9)':'none',transition:'opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)'}}>{name}</span>
        <span style={{position:'absolute',font:'var(--fw-bold) 14px/1 var(--font-sans)',letterSpacing:'var(--ls-logo)',color:'var(--white)',opacity:collapsed?1:0,transition:'opacity var(--dur-base) var(--ease-out)'}}>{s}</span>
      </div>
      {divider?<span style={{display:'block',height:1,width:'100%',background:'linear-gradient(90deg,rgba(224,225,226,0) 0%,rgba(224,225,226,0.5) 50%,rgba(224,225,226,0.16) 100%)'}}/>:null}
    </div>
  );
}
export default Logo;
