import React from 'react';
import { IconTile } from '../core/IconTile.jsx';
import { Button } from '../core/Button.jsx';
export function HelpCard({title='Need help?',text='Please check our docs',cta='DOCUMENTATION',image,collapsed=false,onCta,style}){
  return (
    <div style={{position:'relative',overflow:'hidden',borderRadius:15,background:image?`url(${image}) center/cover no-repeat, var(--blue-500)`:'var(--blue-500)',padding:collapsed?7:16,display:'flex',flexDirection:'column',gap:collapsed?0:20.5,boxSizing:'border-box',transition:'padding var(--dur-slow) var(--ease-out)',fontFamily:'var(--font-sans)',...style}}>
      <IconTile icon="IONIconHHelpCircle" size="md" tone="white"/>
      {collapsed?null:(
        <>
          <div style={{display:'flex',flexDirection:'column',gap:3.5}}>
            <span style={{fontWeight:700,fontSize:14,lineHeight:1.4,color:'var(--white)'}}>{title}</span>
            <span style={{fontSize:12,lineHeight:1,color:'var(--white)'}}>{text}</span>
          </div>
          <Button variant="glass" fullWidth onClick={onCta}>{cta}</Button>
        </>
      )}
    </div>
  );
}
export default HelpCard;
