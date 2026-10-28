import {useCallback,useEffect,useState} from 'react';
import {AlertCircle,RefreshCw,ShieldCheck,Users,Database,MapPinned,ClipboardList,HardDrive,Activity,CheckCircle2,Clock3,UserCheck,UserX} from 'lucide-react';
import {Link} from 'react-router-dom';
import {api} from '../services/api';

function rowsOf(value){if(Array.isArray(value))return value;if(!value||typeof value!=='object')return [];for(const key of ['data','items','records','users','issues','assets'])if(Array.isArray(value[key]))return value[key];return []}
function fmt(value){if(value==null||value==='')return '—';if(typeof value==='boolean')return value?'Yes':'No';return String(value)}
function Metric({icon:Icon,label,value,detail}){return <article className="metric-card"><span><Icon size={17}/> {label}</span><strong>{value}</strong><small>{detail}</small></article>}
export default function AdminPage(){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('civicmap_user')||'null')}catch{return null}});
 const [health,setHealth]=useState(null),[users,setUsers]=useState([]),[assets,setAssets]=useState([]),[analytics,setAnalytics]=useState(null),[logs,setLogs]=useState([]);
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[query,setQuery]=useState('');
 const role=String(user?.role||'').toUpperCase();
 const load=useCallback(async()=>{setLoading(true);setError('');setNotice('');try{
   const me=await api('/auth/me');const current=me.data?.user||me.user||me.data||me;
   if(current&&typeof current==='object'){setUser(current);localStorage.setItem('civicmap_user',JSON.stringify(current))}
   const currentRole=String(current?.role||user?.role||'').toUpperCase();
   if(!['ADMIN','SUPER_ADMIN'].includes(currentRole))throw new Error('Administrator access is required. Sign in with an active authorised administrator account.');
   const results=await Promise.allSettled([api('/system/health'),api('/users'),api('/infrastructure'),api('/analytics/dashboard'),api('/system/activity-logs?limit=20')]);
   const [h,u,a,k,l]=results;
   if(h.status==='fulfilled')setHealth(h.value.data||h.value);else setHealth({success:false,status:'unavailable',message:h.reason?.message||'Health check failed'});
   if(u.status==='fulfilled')setUsers(rowsOf(u.value));else throw new Error(u.reason?.message||'Could not load administrator user list.');
   if(a.status==='fulfilled')setAssets(rowsOf(a.value));else setNotice('Infrastructure records could not be loaded: '+(a.reason?.message||'API error'));
   if(k.status==='fulfilled')setAnalytics(k.value.data||k.value);else setNotice('Analytics unavailable: '+(k.reason?.message||'API error'));
   if(l.status==='fulfilled')setLogs(rowsOf(l.value));else setLogs([]);
 }catch(e){setError(e.message||'Could not load admin data.')}finally{setLoading(false)}},[]);
 useEffect(()=>{load()},[load]);
 async function toggleActive(target){const next=!Boolean(target.active);try{await api('/users/'+encodeURIComponent(target.id)+'/status',{method:'PATCH',body:JSON.stringify({active:next})});setNotice('Account status updated.');await load()}catch(e){setError(e.message||'Could not update account status.')}}
 const kpis=analytics?.kpis||analytics?.data?.kpis||{};
 const filtered=users.filter(u=>JSON.stringify([u.full_name,u.email,u.role,u.active,u.email_otp_verified]).toLowerCase().includes(query.toLowerCase()));
 if(!loading&&error&&!users.length)return <section className="page-container"><div className="page-title-row"><div><div className="eyebrow">RESTRICTED ACCESS</div><h1>CivicMap <em>Admin Console.</em></h1><p>Administration and system diagnostics for authorised accounts.</p></div></div><div className="notice notice-error"><AlertCircle size={18}/><span>{error}</span></div><Link className="btn btn-primary" to="/admin-login">Sign in as administrator</Link><p className="muted">Access is checked by the backend. A visible route alone does not grant permissions.</p></section>;
 return <section className="page-container">
  <div className="page-title-row"><div><div className="eyebrow">RESTRICTED ACCESS · {role||'VERIFYING ROLE'}</div><h1>CivicMap <em>Admin Console.</em></h1><p>Live records and configuration diagnostics from the connected API. No sample data is generated.</p></div><button className="btn btn-secondary" onClick={load} disabled={loading}><RefreshCw size={16}/>{loading?'Refreshing…':'Refresh data'}</button></div>
  {error&&<div className="notice notice-error"><AlertCircle size={17}/>{error}</div>}{notice&&<div className="notice"><CheckCircle2 size={17}/>{notice}</div>}
  <div className="dashboard-kpis">
   <Metric icon={Users} label="User accounts" value={loading?'—':users.length} detail="Returned by protected users API"/>
   <Metric icon={MapPinned} label="Infrastructure assets" value={loading?'—':assets.length} detail="Rows returned by infrastructure API"/>
   <Metric icon={ClipboardList} label="Total observations" value={loading?'—':fmt(kpis.total_observations)} detail="From live analytics response"/>
   <Metric icon={UserCheck} label="Verified accounts" value={loading?'—':users.filter(u=>Boolean(Number(u.email_otp_verified)||u.email_otp_verified===true)).length} detail="Email verification flag"/>
  </div>
  <div className="dashboard-chart-grid">
   <article className="chart-card"><h2><Activity size={18}/> Database & service health</h2>{health?<><p><strong>Status:</strong> {fmt(health.status)}</p><p><strong>Database:</strong> {fmt(health.database)}</p><p><strong>Schema:</strong> {fmt(health.schema)}</p><p><strong>Evidence storage:</strong> {fmt(health.mediaStorage||health.storage)}</p><p className="muted">{fmt(health.message)}</p></>:<p>Checking system health…</p>}</article>
   <article className="chart-card"><h2><HardDrive size={18}/> Record and storage notes</h2><p><strong>Infrastructure rows:</strong> {assets.length}</p><p><strong>Pending verification:</strong> {fmt(kpis.pending_verification)}</p><p><strong>Open issues:</strong> {fmt(kpis.open_issues_count)}</p><p className="muted">Storage usage in bytes is not reported by the current health endpoint. File metadata and the configured provider must be checked separately; no usage value is fabricated.</p></article>
  </div>
  <article className="chart-card admin-users"><div className="page-title-row"><div><h2><Users size={18}/> User access management</h2><p>Activate or deactivate existing accounts. Role changes remain restricted to the Super Admin API.</p></div><div className="search-field"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users…"/></div></div>
   {loading?<p>Loading users…</p>:filtered.length?<div className="table-scroll"><table><thead><tr><th>User</th><th>Role</th><th>Email verified</th><th>Account</th><th>Action</th></tr></thead><tbody>{filtered.map(u=><tr key={u.id}><td><strong>{fmt(u.full_name)}</strong><br/><small>{fmt(u.email)}</small></td><td>{fmt(u.role)}</td><td>{Boolean(Number(u.email_otp_verified)||u.email_otp_verified===true)?'Verified':'Not verified'}</td><td>{Boolean(Number(u.active)||u.active===true)?'Active':'Inactive'}</td><td><button className="btn btn-secondary" disabled={u.id===user?.id} onClick={()=>toggleActive(u)}>{Boolean(Number(u.active)||u.active===true)?<><UserX size={15}/> Deactivate</>:<><UserCheck size={15}/> Activate</>}</button></td></tr>)}</tbody></table></div>:<p>No user accounts were returned by the API.</p>}
  </article>
  <article className="chart-card"><h2><Clock3 size={18}/> Recent administrator activity</h2>{logs.length?<div className="table-scroll"><table><thead><tr><th>Action</th><th>Record type</th><th>Record ID</th><th>Time</th></tr></thead><tbody>{logs.map((log,i)=><tr key={log.id||i}><td>{fmt(log.action)}</td><td>{fmt(log.entity_type)}</td><td>{fmt(log.entity_id)}</td><td>{fmt(log.created_at)}</td></tr>)}</tbody></table></div>:<p className="muted">No activity rows returned, or the activity endpoint is not available to this account.</p>}</article>
 </section>
}
