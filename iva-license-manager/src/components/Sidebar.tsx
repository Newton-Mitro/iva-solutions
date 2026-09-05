import { KeyRound, LayoutDashboard, LogOut, Settings, ShieldCheck } from "lucide-react";

export default function Sidebar({ active, onChange, onLogout }: { active: string; onChange: (x: string) => void; onLogout: () => void }) {
  const items = [["dashboard","Dashboard",LayoutDashboard],["licenses","Licenses",KeyRound],["activations","Activations",ShieldCheck],["events","Events",ShieldCheck],["settings","Settings",Settings]] as const;
  return <aside className="sidebar">
    <div className="brand"><div className="brand-icon"><ShieldCheck size={20}/></div><div><strong>IVAC</strong><span>License Manager</span></div></div>
    <nav>{items.map(([id,label,Icon])=><button key={id} className={`nav-item ${active===id?"active":""}`} onClick={()=>onChange(id)}><Icon size={17}/>{label}</button>)}</nav>
    <button className="logout" onClick={onLogout}><LogOut size={15}/> Sign out</button>
  </aside>;
}