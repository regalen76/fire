import React from 'react';
export function BarChart({data=[],labels,max,ticks=5,height=222,barColor='var(--white)',style}){
  const m=max??Math.ceil(Math.max(1,...data)/100)*100;
  const tickVals=Array.from({length:ticks+1},(_,i)=>Math.round(m/ticks*(ticks-i)));
  return (
    <div style={{position:'relative',height,borderRadius:20,background:'var(--gradient-inset)',padding:'31.5px 35px 31px 30px',boxSizing:'border-box',display:'flex',gap:47,fontFamily:'var(--font-sans)',...style}}>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',flexShrink:0}}>
        {tickVals.map((v,i)=>(<span key={i} style={{fontWeight:700,fontSize:10,lineHeight:1.5,color:'var(--white)'}}>{v}</span>))}
      </div>
      <div style={{flex:1,display:'flex',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:6,paddingTop:2}}>
        {data.map((v,i)=>(
          <div key={i} title={labels?labels[i]+': '+v:String(v)} style={{display:'flex',flexDirection:'column',alignItems:'center',height:'100%',justifyContent:'flex-end'}}>
            <span style={{width:6,height:(v/m*100)+'%',borderRadius:3,background:barColor,transition:'height var(--dur-slow) var(--ease-out)'}}/>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BarChart;
