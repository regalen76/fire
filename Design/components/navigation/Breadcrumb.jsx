import React from 'react';
export function Breadcrumb({items=['Pages'],current,style}){
  return (
    <nav aria-label="Breadcrumb" style={{display:'flex',alignItems:'center',gap:5,font:'var(--fw-regular) 12px/1 var(--font-sans)',whiteSpace:'nowrap',...style}}>
      {items.map((it,i)=>(<React.Fragment key={i}><span style={{color:'var(--gray-400)'}}>{it}</span><span style={{color:'var(--gray-400)'}}>/</span></React.Fragment>))}
      {current?<span style={{color:'var(--white)'}}>{current}</span>:null}
    </nav>
  );
}
export default Breadcrumb;
