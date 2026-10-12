import React from 'react';
export function CreditCard({brand='Vision UI',number='7812 2139 0823 XXXX',validThru='05/24',cvv='09X',image,style}){
  const lbl={fontSize:10,lineHeight:1.5,color:'var(--white)'};
  const val={fontWeight:700,fontSize:14,lineHeight:1.4,color:'var(--white)'};
  return (
    <div style={{position:'relative',overflow:'hidden',minHeight:240,borderRadius:20,background:image?`url(${image}) center/cover no-repeat, var(--gradient-card-violet)`:'var(--gradient-card-violet)',padding:'22px 31px 37px',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between',fontFamily:'var(--font-sans)',...style}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:700,fontSize:18,lineHeight:1.4,color:'var(--white)',marginTop:4}}>{brand}</span>
        <span style={{position:'relative',width:49.2,height:32.8}}>
          <span style={{position:'absolute',left:0,width:32.8,height:32.8,borderRadius:'50%',background:'var(--white)',opacity:0.4}}/>
          <span style={{position:'absolute',left:16.4,width:32.8,height:32.8,borderRadius:'50%',background:'var(--white)',opacity:0.4}}/>
        </span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <span style={{fontWeight:700,fontSize:24,lineHeight:1.4,color:'var(--white)',whiteSpace:'nowrap'}}>{number}</span>
        <div style={{display:'flex',gap:34.5}}>
          <span style={{display:'flex',flexDirection:'column'}}><span style={lbl}>VALID THRU</span><span style={val}>{validThru}</span></span>
          <span style={{display:'flex',flexDirection:'column'}}><span style={lbl}>CVV</span><span style={val}>{cvv}</span></span>
        </div>
      </div>
    </div>
  );
}
export default CreditCard;
