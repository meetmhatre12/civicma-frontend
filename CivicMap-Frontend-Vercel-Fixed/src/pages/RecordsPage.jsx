import {useCallback,useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {RefreshCw,Search,AlertCircle,Building2,ClipboardList,BarChart3,Plus,Save,MapPin,CheckCircle2} from 'lucide-react';
import {api} from '../services/api';

const defs={
 '/infrastructure':{title:'Infrastructure register',eyebrow:'ASSET INVENTORY',icon:Building2,path:'/infrastructure',intro:'Browse and register real infrastructure assets returned by the connected CivicMap API.'},
 '/survey':{title:'Field survey workspace',eyebrow:'FIELDWORK',icon:ClipboardList,path:'/field-visits',intro:'Review field visits and observations available to your account.'},
 '/dashboard':{title:'CivicMap dashboard',eyebrow:'LIVE PROJECT DATA',icon:BarChart3,path:'/analytics/dashboard',intro:'View summary metrics from the configured CivicMap backend.'}
};
function rowsOf(value){if(Array.isArray(value))return value;if(!value||typeof value!=='object')return [];for(const key of ['items','records','issues','visits','assets','users'])if(Array.isArray(value[key]))return value[key];if(Array.isArray(value.data))return value.data;if(value.data&&typeof value.data==='object')return rowsOf(value.data);return []}
function text(v){if(v==null||v==='')return '—';if(typeof v==='object')return v.name||v.title||v.label||JSON.stringify(v);return String(v)}
export default function RecordsPage(){
 const def=defs[location.pathname]||defs['/dashboard'];const Icon=def.icon;const isInfrastructure=def.path==='/infrastructure';
 const [data,setData]=useState([]),[raw,setRaw]=useState(null),[areas,setAreas]=useState([]),[error,setError]=useState(''),[notice,setNotice]=useState(''),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[q,setQ]=useState(''),[showForm,setShowForm]=useState(false);
 const [form,setForm]=useState({name:'',asset_type:'',study_area_id:'',description:'',latitude:'',longitude:'',current_condition:'unknown',location_name:''});
 const setField=(key,value)=>setForm(old=>({...old,[key]:value}));
 const load=useCallback(async()=>{setLoading(true);setError('');try{
   const r=await api(def.path);const d=r?.data??r;setRaw(d);setData(rowsOf(d));
   if(isInfrastructure){try{const ar=await api('/study-areas');const parsed=rowsOf(ar?.data??ar);setAreas(parsed.filter(a=>a.active===true||Number(a.active)===1));}catch(e){setAreas([]);}}
 }catch(e){setData([]);if(e.status===401||e.status===403){setError('Access is required to view these records. Sign in with an authorized account or request access from the CivicMap administrator.');}else if(e.status===503){setError('The records service is temporarily unavailable because the backend or database is not ready. Please try again later or contact the administrator.');}else{setError(e.message||'The records service could not be reached. Please try again or contact the administrator.');}}finally{setLoading(false)}},[def.path,isInfrastructure]);
 useEffect(()=>{load()},[load]);
 const filtered=useMemo(()=>data.filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase())),[data,q]);
 async function submit(e){e.preventDefault();setSaving(true);setError('');setNotice('');try{
   const payload={...form,latitude:Number(form.latitude),longitude:Number(form.longitude)};
   if(!payload.study_area_id)throw new Error('Select an active study area before registering an asset.');
   const result=await api('/infrastructure',{method:'POST',body:JSON.stringify(payload)});
   setNotice('Infrastructure asset saved successfully to the connected API.');setForm({name:'',asset_type:'',study_area_id:'',description:'',latitude:'',longitude:'',current_condition:'unknown',location_name:''});setShowForm(false);await load();
 }catch(e){if(e.status===401||e.status===403){setError('You do not currently have permission to register infrastructure assets. Sign in with an authorized account or request SURVEYOR, ADMIN, or SUPER_ADMIN access from the CivicMap administrator.');}else{setError(e.message||'Infrastructure registration could not be completed. Please try again or contact the administrator.');}}finally{setSaving(false)}}
 return <section className="page-container">
  <div className="page-title-row"><div><div className="eyebrow">{def.eyebrow}</div><h1>{def.title}</h1><p>{def.intro}</p></div><div className="page-actions"><button className="btn btn-secondary" onClick={load} disabled={loading}><RefreshCw size={16}/> Refresh data</button>{isInfrastructure&&<button className="btn btn-primary" onClick={()=>{setShowForm(v=>!v);setError('');setNotice('')}}><Plus size={16}/>{showForm?'Close form':'Register asset'}</button>}</div></div>
  {error&&<div className="notice notice-error"><AlertCircle size={17}/><span>{error}{/unauthorized|forbidden|sign in|administrator/i.test(error)&&<> — <Link to="/login">Sign in</Link></>}</span></div>}
  {notice&&<div className="notice"><CheckCircle2 size={17}/><span>{notice}</span></div>}
  {isInfrastructure&&showForm&&<article className="chart-card"><h2><Plus size={18}/> Register infrastructure asset</h2><p className="muted">Submits to the live API. The backend enforces account permissions and Palghar coverage. No demo record is created.</p><form className="report-form" onSubmit={submit}>
   <div className="form-grid"><label>Asset name *<input required maxLength={180} value={form.name} onChange={e=>setField('name',e.target.value)} placeholder="e.g. Community water tap"/></label><label>Asset type *<input required maxLength={100} value={form.asset_type} onChange={e=>setField('asset_type',e.target.value)} placeholder="e.g. Water supply"/></label>
   <label>Study area / neighbourhood *<select required value={form.study_area_id} onChange={e=>setField('study_area_id',e.target.value)}><option value="">Select active study area</option>{areas.map(a=><option key={a.id} value={a.id}>{a.name}{a.city?', '+a.city:''}</option>)}</select>{!areas.length&&<small className="muted">No active study areas were returned. Check API access and database setup.</small>}</label>
   <label>Current condition<select value={form.current_condition} onChange={e=>setField('current_condition',e.target.value)}>{['unknown','excellent','good','fair','poor','critical','missing'].map(v=><option key={v} value={v}>{v[0].toUpperCase()+v.slice(1)}</option>)}</select></label>
   <label>Latitude *<input required type="number" step="any" min="19.25" max="20.70" value={form.latitude} onChange={e=>setField('latitude',e.target.value)} placeholder="19.6967"/></label><label>Longitude *<input required type="number" step="any" min="72.35" max="73.70" value={form.longitude} onChange={e=>setField('longitude',e.target.value)} placeholder="72.7699"/></label>
   <label className="form-full">Location description<input maxLength={255} value={form.location_name} onChange={e=>setField('location_name',e.target.value)} placeholder="Street, village or landmark (optional)"/></label>
   <label className="form-full">Description *<textarea required maxLength={20000} rows={3} value={form.description} onChange={e=>setField('description',e.target.value)} placeholder="Describe the asset and its current state"/></label></div>
   <button className="btn btn-primary" disabled={saving||!areas.length}><Save size={16}/>{saving?'Saving…':'Save infrastructure asset'}</button>
  </form></article>}
  <div className="toolbar"><div className="search-field"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search records…"/></div><span className="result-count">{loading?'Loading…':`${filtered.length} record${filtered.length===1?'':'s'}`}</span></div>
  {loading?<p>Loading records from the API…</p>:filtered.length?<div className="record-grid">{filtered.map((item,i)=><article className="issue-card" key={item.id||item.uuid||i}><div className="issue-card-top"><span className="issue-id">{text(item.asset_code||item.id||item.issue_id||item.visit_date||`Record ${i+1}`)}</span><span className="status-pill">{text(item.current_condition||item.status||item.condition||item.severity||'Available')}</span></div><h3>{text(item.name||item.title||item.location_name||item.asset_name||item.category||`Civic record ${i+1}`)}</h3><p>{text(item.description||item.address||item.notes||item.location_name)}</p><div className="issue-meta"><span>{text(item.asset_type||item.category_name||item.category||item.study_area_name||item.area||'CivicMap')}</span><span>{text(item.created_at||item.observed_at||item.updated_at)}</span></div>{item.latitude!=null&&item.longitude!=null&&<p><MapPin size={14}/> {text(item.latitude)}, {text(item.longitude)}</p>}</article>)}</div>:<div className="empty-state"><Icon size={27}/><h3>{error?'Records could not be loaded':isInfrastructure?'No infrastructure assets available':'No records to display'}</h3><p>{error?'Check the API connection, permissions, and database readiness.':isInfrastructure?'There are no infrastructure assets available to show for this account yet. If you expected to see existing assets, request access from the CivicMap administrator or ask them to verify the infrastructure register. You can register an asset if your account has permission.':'No records are available for this view yet. If you expected to see records, request access from the CivicMap administrator. This page does not create sample data.'}</p><button className="btn btn-secondary" onClick={load}>Try again</button></div>}

 </section>
}
