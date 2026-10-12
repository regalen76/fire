import React from 'react';
export function Switch({checked,defaultChecked=false,onChange,label,style}){
  const [inner,setInner]=React.useState(defaultChecked);
  const on=checked??inner;
  const toggle=()=>{const v=!on;if(checked===undefined)setInner(v);onChange&&onChange(v);};
  return (
    <label onClick={toggle} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:12,lineHeight:1.5,color:'var(--white)',userSelect:'none',...style}}>
      <span style={{position:'relative',width:36,height:18.484,borderRadius:97.74,background:on?'var(--blue-500)':'var(--navy-500)',transition:'background var(--dur-base) var(--ease-out)',flexShrink:0}}>
        <span style={{position:'absolute',top:2.49,left:on?20:2.5,width:13.5,height:13.5,borderRadius:'50%',background:'var(--white)',transition:'left var(--dur-base) var(--ease-out)'}}/>
      </span>
      {label}
    </label>
  );
}
export default Switch;
