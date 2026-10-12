function TransactionsScreen({onOpenTx}){
  const {Card,Button,Badge,IconTile,Icon}=window.VisionFinanceDesignSystem_6fe7b7;
  const d=window.FIN_DATA,f=window.FIN;
  const [type,setType]=React.useState('all');
  const [cat,setCat]=React.useState('all');
  const rows=d.transactions.filter(t=>t.status==='done').filter(t=>type==='all'||(type==='in'?t.amount>0:t.amount<0)).filter(t=>cat==='all'||t.category===cat);
  const th={fontSize:10,lineHeight:1.5,color:'var(--gray-400)',textTransform:'uppercase',fontWeight:400,textAlign:'left',padding:'0 0 12px',borderBottom:'0.5px solid var(--navy-400)'};
  const td={padding:'14px 12px 14px 0',borderBottom:'0.5px solid var(--navy-400)',fontSize:14,lineHeight:1.4,verticalAlign:'middle'};
  const Seg=({v,l})=>(<Button size="sm" variant={type===v?'primary':'ghost'} onClick={()=>setType(v)}>{l}</Button>);
  return (
    <Card title="Transactions" subtitle={<span><b style={{color:'var(--white)'}}>{rows.length}</b> results</span>} action={<div style={{display:'flex',gap:8}}><Seg v="all" l="All"/><Seg v="in" l="Income"/><Seg v="out" l="Outcome"/></div>}>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
        <button onClick={()=>setCat('all')} style={{height:28,padding:'0 12px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:12,background:cat==='all'?'var(--navy-700)':'transparent',color:'var(--white)',boxShadow:'inset 0 0 0 1px var(--navy-400)'}}>All categories</button>
        {d.categories.map(c=>(<button key={c.id} onClick={()=>setCat(c.id)} style={{height:28,padding:'0 12px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:12,background:cat===c.id?'var(--blue-500)':'transparent',color:'var(--white)',boxShadow:cat===c.id?'none':'inset 0 0 0 1px var(--navy-400)'}}>{c.label}</button>))}
      </div>
      <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',minWidth:760}}>
        <thead><tr><th style={th}>Merchant</th><th style={th}>Category</th><th style={th}>Account</th><th style={th}>Source</th><th style={th}>Date</th><th style={{...th,textAlign:'right'}}>Amount</th></tr></thead>
        <tbody>{rows.map(t=>{const c=f.cat(t.category),a=f.acct(t.account);return (
          <tr key={t.id} onClick={()=>onOpenTx(t)} style={{cursor:'pointer'}}>
            <td style={td}><span style={{display:'flex',alignItems:'center',gap:14}}><IconTile icon={c.icon} size="sm" tone={t.amount>0?'blue':'navy'}/>{t.merchant}</span></td>
            <td style={{...td,color:'var(--gray-400)'}}>{c.label}</td>
            <td style={td}><span style={{display:'flex',flexDirection:'column'}}><span>{a.name}</span><span style={{fontSize:12,color:'var(--gray-400)'}}>•••• {a.number.slice(-4)}</span></span></td>
            <td style={td}>{t.source==='receipt'?<Badge variant="solid" tone="green">Receipt</Badge>:<Badge variant="outline">Bank</Badge>}</td>
            <td style={{...td,color:'var(--gray-400)'}}>{new Date(t.date).toLocaleDateString('en-GB')}</td>
            <td style={{...td,textAlign:'right',paddingRight:0,fontWeight:700,color:t.amount>0?'var(--green-500)':'var(--white)'}}>{f.money(t.amount,true)}</td>
          </tr>);})}</tbody>
      </table>
      </div>
    </Card>
  );
}
window.TransactionsScreen=TransactionsScreen;
