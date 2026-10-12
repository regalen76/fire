import React from 'react';
export function AvatarsGroup({srcs=[],size=46,overlap,max,style}){
  const ring=Math.max(1.5,size/11.5);
  const step=size-(overlap??size*0.33);
  const list=max?srcs.slice(0,max):srcs;
  return (
    <div style={{position:'relative',display:'inline-flex',height:size,width:size+step*(list.length-1),...style}}>
      {list.map((s,i)=>(
        <span key={i} style={{position:'absolute',left:i*step,top:0,width:size,height:size,borderRadius:'50%',background:`url(${s}) center/cover no-repeat, var(--violet-600)`,boxShadow:`0 0 0 ${ring}px var(--navy-800)`}}/>
      ))}
    </div>
  );
}
export default AvatarsGroup;
