function SignInScreen({onSignIn}){
  const {Input,Button,Switch}=window.VisionFinanceDesignSystem_6fe7b7;
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'linear-gradient(160.269deg,rgb(15,18,59) 17.24%,rgb(9,13,46) 54.11%,rgb(2,5,21) 80.06%)'}}>
      <div style={{flex:1,minWidth:0,position:'relative',background:'url('+window.__resources.authHero+') center/cover',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center',display:'flex',flexDirection:'column',gap:18}}>
          <span style={{fontSize:20,letterSpacing:'0.18em',color:'var(--white)'}}>INSPIRED BY THE FUTURE:</span>
          <span style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:36,letterSpacing:'0.18em',color:'var(--white)'}}>VISION FINANCE</span>
        </div>
      </div>
      <form onSubmit={e=>{e.preventDefault();onSignIn();}} style={{width:'min(520px,100%)',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 85px',boxSizing:'border-box',gap:24}}>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <span style={{fontWeight:700,fontSize:30,lineHeight:1.3}}>Nice to see you!</span>
          <span style={{fontSize:14,color:'var(--gray-400)'}}>Enter your email and password to sign in</span>
        </div>
        <Input label="Email" type="email" placeholder="Your email..." defaultValue="mark@simmmple.com"/>
        <Input label="Password" type="password" placeholder="Your password..." defaultValue="password"/>
        <Switch defaultChecked label="Remember me"/>
        <Button size="lg" fullWidth type="submit">Sign in</Button>
        <span style={{fontSize:14,color:'var(--gray-400)',textAlign:'center'}}>Don't have an account? <a href="#" style={{color:'var(--white)',fontWeight:700}}>Sign up</a></span>
      </form>
    </div>
  );
}
window.SignInScreen=SignInScreen;
