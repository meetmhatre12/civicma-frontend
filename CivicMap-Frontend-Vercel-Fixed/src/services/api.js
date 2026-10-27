const API_BASE=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');
function token(){return localStorage.getItem('civicmap_token')||''}
export async function api(path,options={}){
 const headers={Accept:'application/json',...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...(options.headers||{})};
 if(token())headers.Authorization=`Bearer ${token()}`;
 const response=await fetch(`${API_BASE}/api${path.startsWith('/')?path:'/'+path}`,{...options,headers,credentials:'include'});
 const type=response.headers.get('content-type')||'';let body;
 try{body=type.includes('application/json')?await response.json():await response.text()}catch{body=null}
 if(!response.ok||body?.success===false){const e=new Error(body?.error?.message||body?.message||body?.error||`Request failed (${response.status})`);e.status=response.status;e.code=body?.error?.code||'';throw e}
 return body;
}
export const issuesApi={list:()=>api('/issues'),create:(data)=>api('/issues',{method:'POST',body:JSON.stringify(data)})};
export const authApi={login:(email,password)=>api('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),me:()=>api('/auth/me'),logout:()=>api('/auth/logout',{method:'POST'})};
export const systemApi={health:()=>api('/system/health'),publicConfig:()=>api('/system/public-config')};

export async function uploadEvidence(issueId, file, publicDisplay=false){const form=new FormData();form.append('photo',file);form.append('issue_id',String(issueId));form.append('public_display',publicDisplay?'true':'false');return api('/evidence/upload',{method:'POST',body:form});}
