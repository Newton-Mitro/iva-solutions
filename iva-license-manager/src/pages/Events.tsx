import { useEffect,useState } from "react";
import type { LicenseEvent } from "../types/license";
import { listEvents } from "../services/license.service";
import { formatDate } from "../utils/format";
import StatusBadge from "../components/StatusBadge";

export default function Events({refreshKey}:{refreshKey:number}) {
  const [items,setItems]=useState<LicenseEvent[]>([]);
  useEffect(()=>{listEvents().then(setItems)},[refreshKey]);
  return <><div className="page-title"><div><h1>Events</h1><p>License audit history.</p></div></div><section className="panel"><div className="table-wrap"><table><thead><tr><th>Event</th><th>License</th><th>Message</th><th>Time</th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td><StatusBadge status={x.type}/></td><td><code>{x.licenseId}</code></td><td>{x.message||"—"}</td><td>{formatDate(x.createdAt)}</td></tr>)}</tbody></table></div></section></>;
}