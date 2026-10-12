import React from 'react';
import { Icon } from '../icons/Icon.jsx';
export function Balance({title='Credit Balance',amount,graphSrc,onMore,style}){
  return (
    <div style={{position:'relative',overflow:'hidden',height:103,borderRadius:20,background:'var(--gradient-balance)',backdropFilter:'var(--blur-card)',padding:'18px 15px',boxSizing:'border-box',fontFamily:'var(--font-sans)',...style}}>
      <span style={{position:'absolute',right:-18,top:-61,width:194,height:212,opacity:0.1,background:'linear-gradient(187.582deg,rgb(255,255,255) -9.19%,rgba(255,255,255,0) 87.52%)',clipPath:'polygon(0 100%, 62.7% 0, 97.1% 0, 100% 100%)'}}/>
      <div style={{position:'relative',display:'flex',flexDirection:'column'}}>
        <span style={{fontSize:12,lineHeight:'20px',letterSpacing:'var(--ls-tight)',color:'var(--gray-100)'}}>{title}</span>
        <span style={{fontWeight:700,fontSize:34,lineHeight:'42px',color:'var(--white)',whiteSpace:'nowrap'}}>{amount}</span>
      </div>
      <button type="button" onClick={onMore} aria-label="More" style={{position:'absolute',right:17,top:15,width:24,height:24,padding:0,border:'none',background:'transparent',color:'var(--white)',cursor:'pointer'}}><Icon name="MoreHoriz" size={24}/></button>
      {graphSrc?<img src={graphSrc} alt="" style={{position:'absolute',right:20,top:49,width:59,height:17}}/>:null}
    </div>
  );
}
export default Balance;
