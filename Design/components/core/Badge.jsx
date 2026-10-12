import React from 'react';
const TONE={green:'var(--green-500)',blue:'var(--blue-500)',red:'var(--red-500)',orange:'var(--orange-400)',gray:'var(--navy-500)'};
export function Badge({variant='count',tone='blue',children,style}){
  if(variant==='dot') return <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:TONE[tone],boxShadow:'0 0 0 2px var(--navy-900)',...style}}/>;
  if(variant==='count') return (
    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:20,height:20,padding:'0 6px',boxSizing:'border-box',borderRadius:'var(--radius-pill)',background:TONE[tone],color:'var(--white)',font:'var(--fw-bold) 10px/1 var(--font-sans)',...style}}>{children}</span>
  );
  const filled=variant==='solid';
  return (
    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',height:25,padding:'0 10.5px',boxSizing:'border-box',borderRadius:'var(--radius-sm)',background:filled?TONE[tone]:'transparent',boxShadow:filled?'none':'inset 0 0 0 1px var(--white)',color:'var(--white)',font:'var(--fw-regular) 14px/1.4 var(--font-sans)',whiteSpace:'nowrap',...style}}>{children}</span>
  );
}
export default Badge;
