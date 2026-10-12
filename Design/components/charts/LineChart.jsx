import React from 'react';
function smooth(pts){
  if(pts.length<2) return '';
  let d='M '+pts[0][0]+' '+pts[0][1];
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=' C '+c1.join(' ')+' '+c2.join(' ')+' '+p2.join(' ');
  }
  return d;
}
const COLORS={blue:['rgb(0,117,255)','rgb(0,117,255)',1],cyan:['rgb(44,217,255)','rgba(44,217,255,0.36)',1],green:['rgb(1,181,116)','rgba(1,181,116,0.14)',1]};
export function LineChart({series=[],labels=[],max,ticks=5,height=296,style}){
  const id=React.useId?React.useId().replace(/:/g,''):'lc';
  const W=840,H=250,top=7.5;
  const all=series.flatMap(s=>s.data);
  const m=max??Math.ceil(Math.max(1,...all)/100)*100;
  const n=Math.max(...series.map(s=>s.data.length),labels.length,2);
  const x=i=>i*(W/(n-1)),y=v=>top+H-(v/m)*H;
  const tickVals=Array.from({length:ticks+1},(_,i)=>Math.round(m/ticks*(ticks-i)));
  return (
    <div style={{position:'relative',width:'100%',height,fontFamily:'var(--font-sans)',...style}}>
      <svg viewBox={`-41 0 ${W+43} ${H+top+40}`} preserveAspectRatio="none" style={{width:'100%',height:'100%',overflow:'visible'}}>
        <defs>{series.map((s,i)=>{const c=COLORS[s.color||'blue'];return (
          <linearGradient key={i} id={id+'g'+i} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c[1]} stopOpacity={s.color==='blue'||!s.color?0.9:1}/><stop offset="1" stopColor={c[0]} stopOpacity="0"/></linearGradient>);})}</defs>
        {tickVals.map((v,i)=>(<g key={i}><line x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="rgb(86,87,122)" strokeWidth="1" strokeDasharray="5 5" vectorEffect="non-scaling-stroke"/></g>))}
        {series.map((s,i)=>{const pts=s.data.map((v,j)=>[x(j),y(v)]);const d=smooth(pts);const c=COLORS[s.color||'blue'];return (
          <g key={i}><path d={d+` L ${x(s.data.length-1)} ${top+H} L 0 ${top+H} Z`} fill={`url(#${id}g${i})`}/><path d={d} fill="none" stroke={c[0]} strokeWidth="3" vectorEffect="non-scaling-stroke"/></g>);})}
      </svg>
      <div style={{position:'absolute',left:0,top:0,bottom:40,width:30,pointerEvents:'none'}}>
        {tickVals.map((v,i)=>(<span key={i} style={{position:'absolute',left:0,top:`calc(${(y(v))/(H+top+40)*100}% - 7px)`,fontWeight:700,fontSize:10,lineHeight:1.5,color:'var(--gray-400)'}}>{v}</span>))}
      </div>
      <div style={{position:'absolute',left:'4.6%',right:0,bottom:0,display:'flex',justifyContent:'space-between'}}>
        {labels.map((l,i)=>(<span key={i} style={{fontWeight:700,fontSize:10,lineHeight:1.5,color:'var(--gray-400)'}}>{l}</span>))}
      </div>
    </div>
  );
}
export default LineChart;
