import { Link } from 'react-router-dom';
export default function NotFound(){return <section className="empty-state page-container"><div className="eyebrow">404 · PAGE NOT FOUND</div><h1>This route doesn't exist.</h1><p>Use the navigation to return to CivicMap.</p><Link className="btn btn-primary" to="/">Go to overview</Link></section>;}
