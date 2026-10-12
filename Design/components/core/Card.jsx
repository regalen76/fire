import React from 'react';
const BG={default:'var(--gradient-card)',soft:'var(--gradient-card-soft)',inset:'var(--gradient-inset)',row:'var(--gradient-row)'};
export function Card({variant='default',title,subtitle,action,padding,children,style,...rest}){
  const pad=padding??(variant==='row'?'26px 27px':'28px 22px 22px');
  return (
    <div style={{position:'relative',borderRadius:'var(--radius-card)',background:BG[variant],backdropFilter:'var(--blur-card)',WebkitBackdropFilter:'var(--blur-card)',padding:pad,boxSizing:'border-box',color:'var(--white)',fontFamily:'var(--font-sans)',minWidth:0,...style}} {...rest}>
      {(title||action)?(
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:children?24:0}}>
          <div style={{display:'flex',flexDirection:'column',gap:6,minWidth:0}}>
            {title?<div style={{font:'var(--text-card-title)',color:'var(--white)'}}>{title}</div>:null}
            {subtitle?<div style={{font:'var(--fw-regular) var(--fs-body)/1.4 var(--font-sans)',color:'var(--gray-400)'}}>{subtitle}</div>:null}
          </div>
          {action||null}
        </div>
      ):null}
      {children}
    </div>
  );
}
export default Card;
