const {Sidebar,PageHeader}=window.VisionFinanceDesignSystem_6fe7b7;
const NAV=[
  {items:[{id:'dashboard',label:'Dashboard',icon:'IONIconHHomeDefault'},{id:'transactions',label:'Transactions',icon:'IONIconSStatsChart'},{id:'accounts',label:'Accounts',icon:'IONIconWWalletDefault'},{id:'receipts',label:'Receipts',icon:'IONIconDDocumentText',badge:1}]},
  {label:'ACCOUNT PAGES',items:[{id:'profile',label:'Profile',icon:'IONIconPPersonDefault'},{id:'signin',label:'Sign Out',icon:'IONIconDDocumentDefault'}]}
];
const TITLES={dashboard:'Dashboard',transactions:'Transactions',accounts:'Accounts',receipts:'Receipts',profile:'Profile'};
function Shell({page,onNav,collapsed,onToggle,children}){
  const u=window.FIN_DATA.user;
  return (
    <div style={{display:'flex',gap:24,padding:10,minHeight:'100vh',boxSizing:'border-box'}}>
      <div style={{position:'sticky',top:10,height:'calc(100vh - 20px)',flexShrink:0}}>
        <Sidebar brand="VISION FINANCE" brandShort="VF" sections={NAV} activeId={page} onSelect={onNav} collapsed={collapsed} onToggle={onToggle}
          help={{image:'../../assets/images/help-card-bg.jpg',title:'Scan a bill',text:'Send a receipt from your phone',cta:'HOW IT WORKS'}}
          user={{src:u.avatar,name:u.name,email:u.email}}/>
      </div>
      <main style={{flex:1,minWidth:0,padding:'12px 12px 24px 0',display:'flex',flexDirection:'column',gap:24}}>
        <PageHeader title={TITLES[page]} searchIconSrc="../../assets/icons/search.svg" searchPlaceholder="Search transactions..." userLabel={u.name}/>
        {children}
        <footer style={{marginTop:'auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,fontFamily:'var(--font-alt)',fontSize:14,lineHeight:1.5,color:'var(--white)'}}>
          <span>© 2026, Vision Finance</span>
          <span style={{display:'flex',gap:44}}><a href="#" style={{color:'var(--white)'}}>Privacy</a><a href="#" style={{color:'var(--white)'}}>Help</a></span>
        </footer>
      </main>
    </div>
  );
}
window.Shell=Shell;
