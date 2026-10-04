import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useNavigationType } from 'react-router';
import { Identity, WorkIntro, WorkContent, AboutContent, ContactContent, ProjectDialog, MusicMarkup } from './views.jsx';
import { projects } from '../assets/projects.js';
import { music } from '../assets/music.js';
import { initializeMusicPlayer } from '../assets/music-player.js';
import { initializeProjectViewer } from '../assets/project-viewer.js';
import { useScrollDock } from './useScrollDock.js';

const routes = {
  '/': 'work', '/work': 'work', '/index.html': 'work',
  '/about': 'about', '/about.html': 'about',
  '/contact': 'contact', '/contact.html': 'contact',
};
const pages = {
  work: { title: 'Work · Paardhiv Reddy', description: 'Selected work by Paardhiv Reddy Tumma, creative developer. Thoughtful interfaces, useful ideas, and the little details.' },
  about: { title: 'About · Paardhiv Reddy', description: 'About Paardhiv Reddy Tumma, a creative developer who enjoys the space where design meets code.' },
  contact: { title: 'Contact · Paardhiv Reddy', description: 'Get in touch with Paardhiv Reddy Tumma. An idea, a question, or just a hello.' },
  missing: { title: 'Page not found · Paardhiv Reddy', description: 'Return to Paardhiv’s portfolio.' },
};

function NavigationIcon({ type }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    {type === 'work' ? <><path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" /><path d="M3.5 11.5h17" /></>
      : type === 'about' ? <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" /></>
        : <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4.5 7 7.5 6L19.5 7" /></>}
  </svg>;
}

function useIndiaTime() {
  const formatter = useRef(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }));
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    let timer;
    function update() {
      clearTimeout(timer);
      if (document.hidden) return;
      setTime(new Date());
      timer = setTimeout(update, 60000 - Date.now() % 60000);
    }
    update();
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  return { label: formatter.current.format(time), iso: time.toISOString() };
}

function Footer({ page }) {
  const time = useIndiaTime();
  return <footer className="site-footer page">
    <div className="footer-main">
      <a href="https://github.com/Paardhu22" target="_blank" rel="noopener noreferrer">@paardhu22<span className="sr-only"> (opens in a new tab)</span></a>
      <div className="footer-socials">
        <a href="https://github.com/Paardhu22" target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a>
        <a href="https://www.linkedin.com/in/paardhiv-reddy-tumma/" target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
    <div className="footer-meta"><span>Made with care.</span><span className="local-time"><span>IST</span><time id="local-time" aria-label="Current time in India" dateTime={time.iso}>{time.label}</time></span></div>
    <a className="player-credit" href="https://skiper-ui.com/" target="_blank" rel="noopener noreferrer">Music and {page === 'contact' ? 'link' : 'project'} interactions by Skiper UI<span className="sr-only"> (opens in a new tab)</span></a>
  </footer>;
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const path = location.pathname.replace(/\/$/, '') || '/';
  const page = routes[path] || 'missing';
  const main = useRef(null);
  const viewer = useRef(null);
  const positions = useRef(new Map());
  const activeKey = useRef(location.key);
  const previousKey = useRef(null);
  const [announcement, setAnnouncement] = useState('');
  const { dock, hidden: dockHidden } = useScrollDock(location.key);

  // The shell, audio element, and project controllers mount once, never per route.
  useEffect(() => {
    const player = initializeMusicPlayer(music);
    viewer.current = initializeProjectViewer(projects);
    return () => { player?.dispose(); viewer.current?.dispose(); viewer.current = null; };
  }, []);

  useEffect(() => {
    const canonical = page === 'work' ? '/' : `/${page}`;
    if (page !== 'missing' && location.pathname !== canonical) {
      navigate({ pathname: canonical, search: location.search, hash: location.hash }, { replace: true });
    }
  }, [page, location.pathname, location.search, location.hash, navigate]);

  useLayoutEffect(() => {
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const rememberScroll = () => positions.current.set(activeKey.current, scrollY);
    window.addEventListener('scroll', rememberScroll, { passive: true });
    return () => { history.scrollRestoration = oldRestoration; window.removeEventListener('scroll', rememberScroll); };
  }, []);

  useLayoutEffect(() => {
    const changed = previousKey.current !== null && previousKey.current !== location.key;
    activeKey.current = location.key;
    previousKey.current = location.key;
    document.title = pages[page].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pages[page].description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pages[page].title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', pages[page].description);
    if (!changed) return;
    viewer.current?.closeImmediately();
    window.scrollTo({ top: navigationType === 'POP' ? positions.current.get(location.key) || 0 : 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
    setAnnouncement(`${page === 'missing' ? 'Page not found' : page[0].toUpperCase() + page.slice(1)} page`);
  }, [location.key, page, navigationType]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className={`header-controls${dockHidden ? ' is-scroll-hidden' : ''}`} ref={dock}>
      <nav className="navigation" aria-label="Primary navigation">
        {[['work', '/', 'Work', 'Selected work'], ['about', '/about', 'About', 'About me'], ['contact', '/contact', 'Contact', 'Contact me']].map(([type, to, label, aria]) =>
          <NavLink key={type} to={to} end className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} aria-label={aria}><NavigationIcon type={type} /><span>{label}</span></NavLink>,
        )}
      </nav>
      <MusicMarkup />
    </div></header>
    <main id="main" className="page" tabIndex={-1} ref={main}>
      <section className="intro" aria-labelledby="intro-title"><Identity /></section>
      <div className="route-view" hidden={page !== 'work'} data-page="work"><WorkIntro /><WorkContent /></div>
      <div className="route-view" hidden={page !== 'about'} data-page="about"><AboutContent active={page === 'about'} /></div>
      <div className="route-view" hidden={page !== 'contact'} data-page="contact"><ContactContent /></div>
      {page === 'missing' && <section className="section standalone-section route-view"><h2>That page isn’t here.</h2><Link className="text-link" to="/">Back to work</Link></section>}
    </main>
    <ProjectDialog />
    <Footer page={page} />
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </>;
}
