import { FormEvent, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { login } from "../services/auth.service";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setError("");setLoading(true);try{await login(email,password);onLogin()}catch(err){setError(err instanceof Error?err.message:"Login failed")}finally{setLoading(false)}}
  return <div className="login-shell"><div className="login-card"><div className="login-logo"><ShieldCheck size={28}/></div><h1>IVAC License Manager</h1><p>Sign in with your Firebase admin account.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>{error&&<div className="error">{error}</div>}<button className="primary-button full" disabled={loading}><KeyRound size={15}/>{loading?"Signing in...":"Sign in"}</button></form></div></div>;
}