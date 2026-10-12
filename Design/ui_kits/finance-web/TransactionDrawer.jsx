function TransactionDrawer({tx,onClose}){
  const {Card,Button,Badge,IconTile,Icon}=window.VisionFinanceDesignSystem_6fe7b7;
  const f=window.FIN;
  const open=!!tx;
  const c=tx&&f.cat(tx.category),a=tx&&f.acct(tx.account);
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:20,background:open?'rgba(2,5,21,0.55)':'transparent',pointerEvents:open?'auto':'none',transition:'background var(--dur-base) var(--ease-out)'}}>
      <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:10,right:10,bottom:10,width:400,maxWidth:'calc(100% - 20px)',transform:open?'none':'translateX(110%)',transition:'transform var(--dur-slow) var(--ease-out)'}}>
        {tx?(
        <Card style={{height:'100%',overflowY:'auto',background:'linear-gradient(127.569deg,rgba(6,11,40,0.98) 19.41%,rgba(10,14,35,0.92) 76.65%)'}} title={tx.merchant} subtitle={f.date(tx.date)} action={<button onClick={onClose} aria-label="Close" style={{width:37,height:37,borderRadius:12,border:'none',background:'var(--surface-ghost)',color:'var(--white)',cursor:'pointer',fontSize:18}}>×</button>}>
          <div style={{display:'flex',flexDirection:'column',gap:22}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <IconTile icon={c.icon} size="lg" tone="blue"/>
              <span style={{display:'flex',flexDirection:'column',flex:1}}><span style={{fontSize:12,color:'var(--gray-400)'}}>{c.label}</span><span style={{fontWeight:700,fontSize:34,lineHeight:'42px',color:tx.amount>0?'var(--green-500)':'var(--white)'}}>{f.money(tx.amount,true)}</span></span>
            </div>
            <div style={{display:'flex',gap:8}}>{tx.source==='receipt'?<Badge variant="solid" tone="green">From receipt</Badge>:<Badge variant="outline">Bank sync</Badge>}<Badge variant="outline">{a.name} •••• {a.number.slice(-4)}</Badge></div>
            {tx.items?(
              <div style={{display:'flex',flexDirection:'column',gap:0,padding:'20px 22px',borderRadius:20,background:'var(--gradient-row)'}}>
                <span style={{font:'var(--text-overline)',color:'var(--gray-400)',marginBottom:10}}>ITEMS READ FROM RECEIPT</span>
                {tx.items.map(([n,v],i)=>(<div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'0.5px solid var(--navy-400)',fontSize:14}}><span>{n}</span><span style={{color:'var(--gray-400)'}}>{f.money(v)}</span></div>))}
                <div style={{display:'flex',justifyContent:'space-between',paddingTop:12,fontWeight:700,fontSize:14}}><span>Total</span><span>{f.money(Math.abs(tx.amount))}</span></div>
              </div>
            ):null}
            <div style={{display:'flex',gap:16,alignItems:'center'}}><Button variant="text" icon="Edit">Edit category</Button><Button variant="danger" icon="Delete">Delete</Button></div>
          </div>
        </Card>):null}
      </div>
    </div>
  );
}
window.TransactionDrawer=TransactionDrawer;
