// Mock of the finance-service API: receipts are uploaded from phone, parsed server-side into merchant/category/items.
window.FIN_DATA={
  user:{name:'Mark Johnson',email:'mark@simmmple.com',avatar:window.__resources.avatar1},
  accounts:[
    {id:'chk',name:'Main Checking',bank:'Vision Bank',number:'7812 2139 0823 4412',validThru:'05/27',cvv:'09X',balance:18420.55,type:'Debit'},
    {id:'sav',name:'Savings',bank:'Vision Bank',number:'5531 8820 1173 0098',validThru:'11/28',cvv:'31X',balance:42100.00,type:'Savings'},
    {id:'cc',name:'Credit Card',bank:'Nova Credit',number:'4024 0071 5520 1987',validThru:'02/26',cvv:'77X',balance:-1265.40,type:'Credit'}
  ],
  categories:[
    {id:'food',label:'Food & Dining',icon:'IONIconCCartDefault'},
    {id:'groceries',label:'Groceries',icon:'IONIconCCubeDefault'},
    {id:'transport',label:'Transport',icon:'IONIconRRocketSharp'},
    {id:'bills',label:'Bills & Utilities',icon:'Domain'},
    {id:'subs',label:'Subscriptions',icon:'IONIconDDocumentsDefault'},
    {id:'shopping',label:'Shopping',icon:'IONIconCCardDefault'},
    {id:'salary',label:'Salary',icon:'IONIconWWalletDefault'},
    {id:'transfer',label:'Transfer',icon:'IONIconKKeyDefault'}
  ],
  transactions:[
    {id:'t1',merchant:'Fresh Market',category:'groceries',account:'chk',date:'2026-10-09T09:12',amount:-86.40,source:'receipt',status:'done',items:[['Milk 2L',3.2],['Eggs x12',4.5],['Chicken breast',12.9],['Vegetables',18.3],['Rice 5kg',14.2],['Coffee beans',22.1],['Tax',11.2]]},
    {id:'t2',merchant:'Payroll — Simmmple Inc.',category:'salary',account:'chk',date:'2026-10-08T08:00',amount:5200.00,source:'bank',status:'done'},
    {id:'t3',merchant:'Netflix',category:'subs',account:'cc',date:'2026-10-08T00:30',amount:-15.49,source:'bank',status:'done'},
    {id:'t4',merchant:'Blue Bottle Coffee',category:'food',account:'cc',date:'2026-10-07T16:36',amount:-12.80,source:'receipt',status:'done',items:[['Latte',5.5],['Croissant',4.2],['Tip',3.1]]},
    {id:'t5',merchant:'City Power & Water',category:'bills',account:'chk',date:'2026-10-07T10:05',amount:-154.50,source:'receipt',status:'done',items:[['Electricity',98.2],['Water',41.3],['Service fee',15.0]]},
    {id:'t6',merchant:'Metro Transit',category:'transport',account:'cc',date:'2026-10-06T07:45',amount:-42.00,source:'bank',status:'done'},
    {id:'t7',merchant:'Transfer to Savings',category:'transfer',account:'chk',date:'2026-10-05T12:00',amount:-1000.00,source:'bank',status:'done'},
    {id:'t8',merchant:'Uniqlo',category:'shopping',account:'cc',date:'2026-10-04T18:20',amount:-129.90,source:'receipt',status:'done',items:[['Jacket',79.9],['T-shirt x2',39.8],['Tax',10.2]]},
    {id:'t9',merchant:'Freelance — Creative Tim',category:'salary',account:'sav',date:'2026-10-03T14:10',amount:1700.00,source:'bank',status:'done'},
    {id:'t10',merchant:'Receipt scan',category:null,account:null,date:'2026-10-09T10:41',amount:null,source:'receipt',status:'processing'}
  ],
  cashflow:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],income:[5200,5400,5200,6100,5200,6900,5200,5800,6500,6900,0,0],expense:[3100,2800,3500,3300,4200,3900,3600,4100,3700,2400,0,0]}
};
window.FIN={
  money:(v,sign)=>{if(v===null||v===undefined)return '—';const s=Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});return (sign?(v<0?'-':'+'):(v<0?'-':''))+'$'+s;},
  date:(iso)=>{const d=new Date(iso);return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+', at '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});},
  cat:(id)=>window.FIN_DATA.categories.find(c=>c.id===id),
  acct:(id)=>window.FIN_DATA.accounts.find(a=>a.id===id)
};
