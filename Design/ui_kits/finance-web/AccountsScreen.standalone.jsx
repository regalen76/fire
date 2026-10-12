function AccountsScreen({onOpenTx}){
  const {Card,CreditCard,Balance,TransactionItem,Button,Icon}=window.VisionFinanceDesignSystem_6fe7b7;
  const d=window.FIN_DATA,f=window.FIN;
  const [sel,setSel]=React.useState(d.accounts[0].id);
  const a=f.acct(sel);
  const tx=d.transactions.filter(t=>t.account===sel);
  return (
    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.35fr) minmax(0,1fr)',gap:24,alignItems:'start'}}>
      <div style={{display:'flex',flexDirection:'column',gap:24}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.1fr) minmax(0,1fr)',gap:24}}>
          <CreditCard image={window.__resources.cardBg} brand={a.bank} number={a.number.slice(0,15)+'XXXX'} validThru={a.validThru} cvv={a.cvv}/>
          <Card padding="25px 24px" style={{display:'flex',flexDirection:'column',gap:22}}>
            <Balance title={a.name+' balance'} amount={f.money(a.balance)} graphSrc={window.__resources.balanceGraph}/>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <span style={{font:'var(--text-overline)',color:'var(--gray-400)'}}>NEWEST</span>
              {tx[0]?<TransactionItem title={tx[0].merchant} meta={f.date(tx[0].date)} amount={f.money(tx[0].amount,true)} type={tx[0].amount>0?'income':'expense'}/>:null}
            </div>
          </Card>
        </div>
        <Card title="Linked accounts" action={<Button>Link account</Button>}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
            {d.accounts.map(x=>(
              <button key={x.id} onClick={()=>setSel(x.id)} style={{display:'flex',alignItems:'center',gap:14,height:74,padding:'0 22px',borderRadius:20,border:'none',cursor:'pointer',textAlign:'left',fontFamily:'var(--font-sans)',color:'var(--white)',background:'var(--gradient-tile)',boxShadow:x.id===sel?'inset 0 0 0 1.5px var(--blue-500)':'inset 0 0 0 1px rgba(226,232,240,0.3)'}}>
                <span style={{display:'flex',flexDirection:'column',flex:1,gap:2}}><span style={{fontSize:14}}>{x.name}</span><span style={{fontSize:12,color:'var(--gray-400)'}}>{x.bank} · •••• {x.number.slice(-4)}</span></span>
                <span style={{fontWeight:700,fontSize:14,color:x.balance<0?'var(--red-500)':'var(--white)'}}>{f.money(x.balance)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card title={a.name+' activity'} action={<span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-400)'}}><Icon name="IONIconCCalendarOutline" size={15} style={{color:'var(--white)'}}/>1 – 9 Oct 2026</span>}>
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {tx.length?tx.map(t=><TransactionItem key={t.id} onClick={()=>onOpenTx(t)} title={t.merchant} meta={f.date(t.date)} category={f.cat(t.category).label} amount={f.money(t.amount,true)} type={t.amount>0?'income':'expense'}/>):<span style={{color:'var(--gray-400)',fontSize:14}}>No activity yet.</span>}
        </div>
      </Card>
    </div>
  );
}
window.AccountsScreen=AccountsScreen;
