import React from 'react';
import { Icon } from '../icons/Icon.jsx';
const C={income:'var(--green-500)',expense:'var(--red-500)',pending:'var(--gray-400)'};
export function TransactionItem({title,meta,amount,type='expense',category,onClick,style}){
  const ring=C[type];
  const amountColor=type==='income'?'var(--green-500)':type==='pending'?'var(--white)':'var(--gray-400)';
  const rot=type==='income'?'rotate(-90deg)':type==='expense'?'rotate(90deg)':'none';
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:14,minHeight:45,fontFamily:'var(--font-sans)',cursor:onClick?'pointer':'default',...style}}>
      <span style={{width:35,height:35,borderRadius:'50%',boxShadow:`inset 0 0 0 1px ${ring}`,display:'inline-flex',alignItems:'center',justifyContent:'center',color:ring,flexShrink:0}}>
        {type==='pending'?<Icon name="PriorityHigh" size={12}/>:<Icon name="IONIconAArrowForward" size={12} style={{transform:rot}}/>}
      </span>
      <span style={{display:'flex',flexDirection:'column',gap:4,flex:1,minWidth:0}}>
        <span style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
          <span style={{fontSize:14,lineHeight:1.4,color:'var(--white)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</span>
          {category?<span style={{flexShrink:0,height:18,padding:'0 7px',borderRadius:6,background:'var(--surface-ghost)',font:'var(--fw-regular) 10px/18px var(--font-sans)',color:'var(--gray-300)',textTransform:'uppercase'}}>{category}</span>:null}
        </span>
        {meta?<span style={{fontSize:14,lineHeight:1.5,color:'var(--gray-400)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{meta}</span>:null}
      </span>
      <span style={{fontSize:14,lineHeight:1.5,color:amountColor,whiteSpace:'nowrap',fontWeight:type==='income'?500:400}}>{amount}</span>
    </div>
  );
}
export default TransactionItem;
