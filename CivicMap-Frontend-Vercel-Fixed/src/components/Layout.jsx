import { NavLink, Outlet, Link } from 'react-router-dom';
import { MapPinned, LayoutDashboard, ClipboardList, LogIn, Menu, X, UserRound, Building2, Info, Mail } from 'lucide-react';
import { useState } from 'react';
export default function Layout() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/map', label: 'Explore map', icon: MapPinned },
    { to: '/report', label: 'Report an issue', icon: ClipboardList },
    { to: '/infrastructure', label: 'Infrastructure', icon: Building2 },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];
  return <div className="app-shell">
    <header className="topbar"><Link to="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark"><MapPinned size={22}/></span><span>CivicMap <small>PALGHAR</small></span></Link>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">{links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}><Icon size={17}/>{label}</NavLink>)}<NavLink to="/profile" onClick={()=>setOpen(false)}><UserRound size={17}/>Profile</NavLink><NavLink to="/login" onClick={()=>setOpen(false)}><LogIn size={17}/>Sign in</NavLink></nav>
    </header>
    <main><Outlet/></main>
    <footer className="site-footer"><div className="footer-main"><div className="footer-brand-block"><Link to="/" className="brand"><span className="brand-mark"><MapPinned size={21}/></span><span>CivicMap <small>PALGHAR</small></span></Link><p>Document local infrastructure observations with clear locations and useful evidence.</p></div><div className="footer-col"><h2>Explore</h2><Link to="/map">Civic map</Link><Link to="/report">Report an issue</Link><Link to="/dashboard">Dashboard</Link><Link to="/profile">My profile</Link></div><div className="footer-col"><h2>About</h2><Link to="/about"><Info size={15}/>About CivicMap</Link><Link to="/help">Help centre</Link><Link to="/contact"><Mail size={15}/>Contact us</Link></div><div className="footer-col"><h2>Policies</h2><Link to="/privacy">Privacy notice</Link><Link to="/terms">Terms of use</Link><Link to="/accessibility">Accessibility</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} CivicMap Palghar</span><span>Community observations · Palghar District, Maharashtra</span></div></footer>
  </div>;
}
