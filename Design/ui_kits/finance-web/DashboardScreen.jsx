const DS=window.VisionFinanceDesignSystem_6fe7b7;
function DashboardScreen({onOpenTx,onNav}){
  const {Card,StatCard,LineChart,BarChart,Gauge,TransactionItem,MiniStat,Button,IconTile}=DS;
  const d=window.FIN_DATA,f=window.FIN;
  const total=d.accounts.reduce((s,a)=>s+a.balance,0);
  const month=d.transactions.filter(t=>t.amount!==null&&t.date.startsWith('2026-10'));
  const inc=month.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const out=-month.filter(t=>t.amount<0&&t.category!=='transfer').reduce((s,t)=>s+t.amount,0);
  const byCat=d.categories.filter(c=>!['salary','transfer'].includes(c.id)).map(c=>({c,v:-month.filter(t=>t.category===c.id).reduce((s,t)=>s+t.amount,0)}));
  const budget=2400;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:24}}>
        <StatCard label="Total Balance" value={f.money(total)} icon="IONIconWWalletDefault"/>
        <StatCard label="Income · Oct" value={f.money(inc)} change="+6%" icon="IONIconSStatsChart"/>
        <StatCard label="Spending · Oct" value={f.money(out)} change="-12%" trend="up" icon="IONIconCCartDefault"/>
        <StatCard label="Receipts scanned" value="24" change="+3" icon="IONIconDDocumentText"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.9fr) minmax(0,1fr)',gap:24}}>
        <div style={{position:'relative',overflow:'hidden',borderRadius:20,minHeight:344,background:'url(../../assets/images/welcome-jellyfish.jpg) center/cover',padding:'36px 31px',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <span style={{fontSize:14,color:'var(--gray-400)'}}>Welcome back,</span>
            <span style={{fontWeight:700,fontSize:28,lineHeight:1.4}}>{d.user.name}</span>
            <span style={{fontSize:16,lineHeight:1.5,color:'var(--gray-400)',maxWidth:260}}>You spent {f.money(out)} this month across {byCat.filter(x=>x.v>0).length} categories.</span>
          </div>
          <button onClick={()=>onNav('transactions')} style={{alignSelf:'flex-start',display:'flex',alignItems:'center',gap:5,background:'none',border:'none',padding:0,color:'var(--white)',fontSize:12,fontFamily:'var(--font-sans)',cursor:'pointer'}}>View transactions <DS.Icon name="IONIconAArrowForward" size={13}/></button>
        </div>
        <Card title="Monthly budget" subtitle={f.money(out)+' of '+f.money(budget)} padding="26px 27px">
          <Gauge value={Math.round(out/budget*100)} caption="Of budget used" icon="IONIconWWalletDefault" minLabel="$0" maxLabel={'$'+budget.toLocaleString()} style={{height:240}}/>
        </Card>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.4fr) minmax(0,1fr)',gap:24}}>
        <Card title="Cash flow" subtitle={<span><b style={{color:'var(--green-500)'}}>(+{f.money(inc-out)})</b> net in October</span>}>
          <LineChart height={300} labels={d.cashflow.labels} series={[{color:'blue',data:d.cashflow.income.map(v=>v/10)},{color:'cyan',data:d.cashflow.expense.map(v=>v/10)}]} max={700}/>
          <div style={{display:'flex',gap:20,marginTop:10,fontSize:12,color:'var(--gray-400)'}}><span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:8,height:8,borderRadius:'50%',background:'var(--blue-500)'}}/>Income ($×10)</span><span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:8,height:8,borderRadius:'50%',background:'var(--cyan-400)'}}/>Spending ($×10)</span></div>
        </Card>
        <Card padding={16}>
          <BarChart data={byCat.map(x=>Math.max(4,x.v))} labels={byCat.map(x=>x.c.label)} max={Math.ceil(Math.max(...byCat.map(x=>x.v))/100)*100}/>
          <div style={{padding:'28px 6px 6px',display:'flex',flexDirection:'column',gap:6}}>
            <span style={{font:'var(--text-card-title)'}}>Spending by category</span>
            <span style={{fontSize:14,color:'var(--gray-400)'}}>From receipts and bank sync</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,padding:'18px 6px 6px'}}>
            {byCat.sort((a,b)=>b.v-a.v).slice(0,3).map(x=><MiniStat key={x.c.id} icon={x.c.icon} label={x.c.label.split(' ')[0]} value={f.money(x.v)} progress={x.v/out*100}/>)}
          </div>
        </Card>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.4fr) minmax(0,1fr)',gap:24}}>
        <Card title="Recent transactions" subtitle={<span><b style={{color:'var(--white)'}}>{month.length} entries</b> this month</span>} action={<Button onClick={()=>onNav('transactions')}>View all</Button>}>
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            {d.transactions.filter(t=>t.status==='done').slice(0,5).map(t=>(
              <TransactionItem key={t.id} onClick={()=>onOpenTx(t)} title={t.merchant} meta={f.date(t.date)} category={f.cat(t.category).label} amount={f.money(t.amount,true)} type={t.amount>0?'income':'expense'}/>
            ))}
          </div>
        </Card>
        <Card title="Where your money is" subtitle="Balances by account">
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {d.accounts.map(a=>(
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 18px',borderRadius:20,background:'var(--gradient-row)'}}>
                <IconTile icon={a.type==='Credit'?'IONIconCCardDefault':'IONIconWWalletDefault'} size="lg" tone={a.type==='Credit'?'navy':'blue'}/>
                <span style={{flex:1,display:'flex',flexDirection:'column',gap:2,minWidth:0}}><span style={{fontSize:14}}>{a.name}</span><span style={{fontSize:12,color:'var(--gray-400)'}}>{a.bank} · •••• {a.number.slice(-4)}</span></span>
                <span style={{fontWeight:700,fontSize:18,color:a.balance<0?'var(--red-500)':'var(--white)'}}>{f.money(a.balance)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
window.DashboardScreen=DashboardScreen;
