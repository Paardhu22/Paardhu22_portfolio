import './text-accent.css';

function AccentIcon({ icon }) {
  return <svg className="text-accent-icon" viewBox="0 0 18 18" aria-hidden="true">
    {icon === 'pixels' && <><rect x="2" y="2" width="6" height="6" rx="1.4" /><rect x="10" y="2" width="6" height="6" rx="1.4" opacity=".5" /><rect x="2" y="10" width="6" height="6" rx="1.4" opacity=".5" /><rect x="10" y="10" width="6" height="6" rx="1.4" /></>}
    {icon === 'cursor' && <path d="m3.5 2.5 10.5 7-5 .8-2.5 4.2z" />}
    {icon === 'spark' && <path d="m9 2 1.9 4.9L16 9l-5.1 2.1L9 16l-1.9-4.9L2 9l5.1-2.1z" />}
    {icon === 'search' && <><circle cx="7.5" cy="7.5" r="4.6" className="text-accent-outline" /><path d="m11 11 4.2 4.2" className="text-accent-outline" /></>}
    {icon === 'heart' && <path d="M9 15.5 3.1 9.7C-1 5.6 5.2.2 9 5c3.8-4.8 10 .6 5.9 4.7z" />}
    {icon === 'code' && <><path d="m5.5 4-4 5 4 5m7-10 4 5-4 5m-2-11-3 12" className="text-accent-outline" /></>}
  </svg>;
}

export default function TextAccent({ children, tone = 'blue', icon }) {
  const lastSpace = children.lastIndexOf(' ');
  const lead = lastSpace === -1 ? '' : children.slice(0, lastSpace + 1);
  const end = children.slice(lastSpace + 1);
  return <span className={`text-accent text-accent-${tone}`}>{lead}<span className="text-accent-end">{end}{icon && <AccentIcon icon={icon} />}</span></span>;
}
