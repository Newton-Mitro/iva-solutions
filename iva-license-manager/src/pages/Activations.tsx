import { useEffect, useState } from "react";
import { Monitor, Power } from "lucide-react";
import type { LicenseActivation } from "../types/license";
import { deactivateActivation, listActivations } from "../services/license.service";
import { formatDate } from "../utils/format";
import StatusBadge from "../components/StatusBadge";

export default function Activations({refreshKey}:{refreshKey:number}) {
  const [items,setItems]=useState<LicenseActivation[]>([]);
  async function load(){setItems(await listActivations())}
  useEffect(()=>{load()},[refreshKey]);
  return <><div className="page-title"><div><h1>Activations</h1><p>View and deactivate registered devices.</p></div></div><section className="panel"><div className="table-wrap"><table><thead><tr><th>Device</th><th>License</th><th>Platform</th><th>Status</th><th>Activated</th><th>Last Seen</th><th/></tr></thead><tbody>{items.map(x=><tr key={x.id}><td><div className="key-cell"><Monitor size={14}/><div><strong>{x.deviceName||"Unknown"}</strong><small>{x.deviceId}</small></div></div></td><td><code>{x.licenseId}</code></td><td>{x.platform||"—"}</td><td><StatusBadge status={x.status}/></td><td>{formatDate(x.activatedAt)}</td><td>{formatDate(x.lastSeenAt)}</td><td>{x.status==="active"&&<button className="mini-button danger" onClick={async()=>{await deactivateActivation(x.id);await load()}}><Power size={14}/></button>}</td></tr>)}{!items.length&&<tr><td colSpan={7}><div className="empty">No activations.</div></td></tr>}</tbody></table></div></section></>;
}