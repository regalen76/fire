function ReceiptsScreen({onOpenTx}){
  const {Card,InvoiceItem,Button,Badge,ProgressBar,IconTile}=window.VisionFinanceDesignSystem_6fe7b7;
  const d=window.FIN_DATA,f=window.FIN;
  const rec=d.transactions.filter(t=>t.source==='receipt');
  const pending=rec.filter(t=>t.status==='processing');
  const [p,setP]=React.useState(35);
  React.useEffect(()=>{const id=setInterval(()=>setP(v=>v>=95?35:v+6),700);return ()=>clearInterval(id);},[]);
  return (
    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1.2fr)',gap:24,alignItems:'start'}}>
      <div style={{display:'flex',flexDirection:'column',gap:24}}>
        <Card title="Processing" subtitle="Bills sent from your phone">
          {pending.map(t=>(
            <div key={t.id} style={{display:'flex',alignItems:'center',gap:14,padding:'18px 20px',borderRadius:20,background:'var(--gradient-row)'}}>
              <IconTile icon="IONIconDDocumentText" size="lg" tone="ghost" round/>
              <span style={{flex:1,display:'flex',flexDirection:'column',gap:8}}><span style={{fontSize:14}}>Reading receipt…</span><ProgressBar value={p} width="100%"/></span>
              <Badge variant="outline">{p}%</Badge>
            </div>
          ))}
        </Card>
        <Card title="How it works">
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[['IONIconDDocumentDefault','Take a screenshot of the bill on your phone'],['IONIconRRocketSharp','It is sent to your finance service'],['IONIconCCubeDefault','The service reads merchant, items and category'],['IONIconSStatsChart','It appears here in your history']].map(([i,t],k)=>(
              <span key={k} style={{display:'flex',alignItems:'center',gap:14,fontSize:14}}><IconTile icon={i} size="sm" tone="navy"/>{t}</span>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Scanned receipts" action={<Button>View all</Button>}>
        <div style={{display:'flex',flexDirection:'column',gap:24}}>
          {rec.filter(t=>t.status==='done').map(t=>(
            <div key={t.id} onClick={()=>onOpenTx(t)} style={{cursor:'pointer'}}>
              <InvoiceItem date={t.merchant} id={f.cat(t.category).label+' · '+new Date(t.date).toLocaleDateString('en-GB')} amount={f.money(t.amount)} format="VIEW"/>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
window.ReceiptsScreen=ReceiptsScreen;
