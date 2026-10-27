import { NavLink, Outlet } from 'react-router-dom';
import { MapPinned, LayoutDashboard, ClipboardList, LogIn, Menu, X, UserRound, Building2 } from 'lucide-react';
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
    <header className="topbar"><NavLink to="/" className="brand"><span className="brand-mark"><MapPinned size={22}/></span><span>CivicMap <small>PALGHAR</small></span></NavLink>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'nav-links open' : 'nav-links'}>{links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}><Icon size={17}/>{label}</NavLink>)}<NavLink to="/profile" onClick={()=>setOpen(false)}><UserRound size={17}/>Profile</NavLink><NavLink to="/login" onClick={()=>setOpen(false)}><LogIn size={17}/>Sign in</NavLink></nav>
    </header>
    <main><Outlet/></main>
    <footer><span>© {new Date().getFullYear()} CivicMap Palghar</span><span className="footer-links"><NavLink to="/about">About</NavLink><NavLink to="/help">Help</NavLink><NavLink to="/contact">Contact</NavLink><NavLink to="/privacy">Privacy</NavLink><NavLink to="/terms">Terms</NavLink><NavLink to="/accessibility">Accessibility</NavLink></span></footer>
  </div>;
}
