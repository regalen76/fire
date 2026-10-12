import React from 'react';
import { Icon } from '../icons/Icon.jsx';
import { Input } from '../core/Input.jsx';
import { Breadcrumb } from './Breadcrumb.jsx';
export function PageHeader({trail=['Pages'],title,searchPlaceholder='Type here...',searchIconSrc,userLabel='Sign In',onSearch,actions,style}){
  return (
    <header style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:24,flexWrap:'wrap',fontFamily:'var(--font-sans)',...style}}>
      <div style={{display:'flex',flexDirection:'column',gap:6,paddingTop:14.5}}>
        <Breadcrumb items={trail} current={title}/>
        <span style={{fontSize:14,lineHeight:1.4,color:'var(--white)'}}>{title}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:18}}>
        <Input variant="search" iconSrc={searchIconSrc} placeholder={searchPlaceholder} onChange={onSearch} style={{width:199}}/>
        {actions??(
          <>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,lineHeight:1.5,color:'var(--gray-500)'}}><Icon name="IONIconPPersonDefault" size={12}/>{userLabel}</span>
            <Icon name="IONIconSSettingsSharp" size={12} style={{color:'var(--gray-500)'}}/>
            <Icon name="IONIconNNotificationsDefault" size={12} style={{color:'var(--gray-500)'}}/>
          </>
        )}
      </div>
    </header>
  );
}
export default PageHeader;
