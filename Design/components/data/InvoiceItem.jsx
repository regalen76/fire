import React from 'react';
import { Icon } from '../icons/Icon.jsx';
export function InvoiceItem({date,id,amount,format='PDF',onDownload,style}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:16,fontFamily:'var(--font-sans)',...style}}>
      <span style={{display:'flex',flexDirection:'column',gap:4,flex:1,minWidth:0}}>
        <span style={{fontWeight:500,fontSize:14,lineHeight:1.4,color:'var(--white)'}}>{date}</span>
        <span style={{fontSize:12,lineHeight:1.5,color:'var(--gray-400)'}}>{id}</span>
      </span>
      <span style={{fontSize:12,lineHeight:1.5,color:'var(--gray-400)'}}>{amount}</span>
      <button type="button" onClick={onDownload} style={{display:'inline-flex',alignItems:'center',gap:5,padding:0,border:'none',background:'transparent',cursor:'pointer',color:'var(--white)',fontWeight:700,fontSize:10,lineHeight:1.5,fontFamily:'var(--font-sans)'}}>
        <Icon name="IONIconDDocumentText" size={12}/>{format}
      </button>
    </div>
  );
}
export default InvoiceItem;
