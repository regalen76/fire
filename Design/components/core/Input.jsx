import React from 'react';
import { Icon } from '../icons/Icon.jsx';
export function Input({label,icon,iconSrc,variant='field',style,inputStyle,...rest}){
  const search=variant==='search';
  return (
    <label style={{display:'flex',flexDirection:'column',gap:4.5,fontFamily:'var(--font-sans)',minWidth:0,...style}}>
      {label?<span style={{fontSize:14,lineHeight:1.4,color:'var(--white)',paddingLeft:4.5}}>{label}</span>:null}
      <span style={{display:'flex',alignItems:'center',gap:5,height:search?39.5:50,padding:search?'0 12px':'0 20px',borderRadius:search?'var(--radius-input)':'var(--radius-xl)',
        background:search?'var(--surface-input)':'var(--gradient-tile)',boxShadow:search?'inset 0 0 0 0.5px var(--border-input)':'inset 0 0 0 1px rgba(226,232,240,0.3)',backdropFilter:search?undefined:'blur(42px)',boxSizing:'border-box'}}>
        {iconSrc?<img src={iconSrc} alt="" style={{width:15,height:15,flexShrink:0,opacity:0.7}}/>:icon?<Icon name={icon} size={15} style={{color:'var(--gray-400)',flexShrink:0}}/>:null}
        <input {...rest} style={{flex:1,minWidth:0,background:'transparent',border:'none',outline:'none',color:'var(--white)',font:`var(--fw-regular) ${search?12:14}px/1.5 var(--font-sans)`,...inputStyle}}/>
      </span>
    </label>
  );
}
export default Input;
