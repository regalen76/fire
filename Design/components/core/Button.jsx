import React from 'react';
import { Icon } from '../icons/Icon.jsx';
const VARIANTS={
  primary:{background:'var(--blue-500)',color:'var(--white)'},
  glass:{background:'var(--gradient-button-glass)',backdropFilter:'var(--blur-button)',color:'var(--white)'},
  ghost:{background:'var(--surface-ghost)',color:'var(--white)'},
  text:{background:'transparent',color:'var(--gray-400)'},
  danger:{background:'transparent',color:'var(--red-400)'}
};
export function Button({variant='primary',size='md',fullWidth=false,icon,disabled=false,children,style,...rest}){
  const [hover,setHover]=React.useState(false);
  const h=size==='lg'?45:size==='sm'?28:35;
  const isText=variant==='text'||variant==='danger';
  return (
    <button disabled={disabled} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:4,height:isText?'auto':h,
        padding:isText?0:(size==='sm'?'0 12px':'0 24px'),minWidth:isText?0:24,width:fullWidth?'100%':undefined,
        border:'none',borderRadius:'var(--radius-button)',cursor:disabled?'not-allowed':'pointer',
        font:isText?'var(--fw-regular) var(--fs-small)/1.5 var(--font-sans)':'var(--text-button)',
        textTransform:'uppercase',letterSpacing:0,whiteSpace:'nowrap',boxSizing:'border-box',
        opacity:disabled?0.4:1,filter:hover&&!disabled&&!isText?'brightness(1.12)':'none',
        transition:'filter var(--dur-fast) var(--ease-out), opacity var(--dur-fast)',
        ...VARIANTS[variant],...(hover&&isText&&!disabled?{color:variant==='danger'?'var(--red-400)':'var(--white)'}:{}),...style}} {...rest}>
      {icon?<Icon name={icon} size={isText?14:14} style={{color:'currentColor'}}/>:null}
      {children}
    </button>
  );
}
export default Button;
