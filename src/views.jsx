import { Link } from 'react-router';
import AboutProfile from './components/AboutProfile.jsx';
import TextAccent from './components/TextAccent.jsx';

export function Identity() {
  return (<>
<div className="identity">
          <div className="avatar-wrap">
            <img className="avatar" src="assets/avatar.png" alt="Paardhiv's black cat GitHub avatar" width="56" height="56" fetchPriority="high" />
            <span className="avatar-note" aria-hidden="true">hi, I’m Paardhiv.</span>
          </div>
          <div>
            <h1 id="intro-title">Paardhiv Reddy<span className="name-dot" aria-hidden="true">.</span></h1>
            <p className="role">Creative developer</p>
          </div>
        </div>
  </>);
}

export function WorkIntro() {
  return (<>
<p className="intro-copy">I build <TextAccent tone="blue" icon="cursor">websites</TextAccent>, <TextAccent tone="violet" icon="pixels">web apps</TextAccent>, and <TextAccent tone="green" icon="code">mobile apps</TextAccent>. My work includes client projects, <TextAccent tone="amber" icon="search">AI tools</TextAccent>, <TextAccent tone="rose" icon="code">security testing</TextAccent>, and image registration.</p>

        <div className="intro-links">
          <Link className="hello-link" to="/contact">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6L19.5 7"/></svg>
            Contact
          </Link>
          <a className="quiet-link" href="https://github.com/Paardhu22" target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a>
          <a className="quiet-link" href="https://www.linkedin.com/in/paardhiv-reddy-tumma/" target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
        </div>

  </>);
}

export function WorkContent() {
  return (<>
<section id="work" className="section work-section" aria-labelledby="work-title">
        <div className="section-heading">
          <h2 id="work-title">Selected work</h2>
          <span className="section-aside" id="work-status">A collection in progress</span>
        </div>
        <div className="work-empty-preview" id="work-empty">
          <article className="project project-example">
            <button id="preview-example-button" className="project-preview-trigger" type="button" aria-label="View preview example" aria-haspopup="dialog" aria-controls="project-viewer" disabled>
              <span className="project-preview">
                <img src="assets/preview-example.png" alt="Paardhiv’s portfolio introduction" loading="lazy" />
                <span className="project-example-tag">Preview example</span>
              </span>
            </button>
            <div className="project-title-row"><h3>Try the preview</h3><span className="section-aside">A small example</span></div>
            <p className="project-description">Selected projects will be here soon.</p>
          </article>
        </div>
        <div className="project-grid" id="project-grid" hidden></div>
      </section>
  </>);
}

export function AboutContent({ active }) {
  return active ? <AboutProfile /> : null;
}

export function ContactContent() {
  return (<>
<section id="contact" className="section contact-section standalone-section" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact<span className="name-dot" aria-hidden="true">.</span></h2>
        <div className="contact-links">
          <a className="contact-link" href="mailto:paardhivreddy22@gmail.com">
            <span className="contact-link-label">paardhivreddy22@gmail.com</span>
            <svg className="contact-link-arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"/></svg>
          </a>
          <a className="contact-link" href="https://www.linkedin.com/in/paardhiv-reddy-tumma/" target="_blank" rel="noopener noreferrer">
            <span className="contact-link-label">LinkedIn</span>
            <svg className="contact-link-arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"/></svg>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="contact-link" href="https://github.com/Paardhu22" target="_blank" rel="noopener noreferrer">
            <span className="contact-link-label">GitHub</span>
            <svg className="contact-link-arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"/></svg>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
  </>);
}

export function ProjectDialog() {
  return (<>
<dialog id="project-viewer" className="project-viewer" aria-labelledby="project-viewer-title" aria-describedby="project-viewer-description">
      <div className="project-viewer-backdrop" aria-hidden="true"></div>
      <div className="project-viewer-panel">
        <div className="project-viewer-actions">
          <button className="project-viewer-zoom" type="button" aria-pressed="false" aria-controls="project-viewer-media" hidden>Zoom in</button>
          <button className="project-viewer-close" type="button" aria-label="Close project preview" autoFocus>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div id="project-viewer-media" className="project-viewer-media" role="region" aria-label="Project screenshot" tabIndex="0"></div>
        <section className="project-viewer-real" hidden aria-labelledby="project-real-title">
          <div className="seleno-real-heading"><div><h3 id="project-real-title">Preview of real</h3><p>Real project screenshots.</p></div>
            <button className="project-viewer-real-zoom project-viewer-zoom-style" type="button" aria-pressed="false" aria-controls="project-real-media">Zoom in</button>
          </div>
          <div id="project-real-media" className="project-viewer-real-media" role="region" aria-label="Project screenshot" tabIndex="0"></div>
        </section>
        <div className="project-viewer-gallery" hidden>
          <div className="project-gallery-toolbar">
            <p className="project-gallery-caption" role="status" aria-live="polite" aria-atomic="true"></p>
            <div className="project-gallery-navigation" aria-label="Screenshot navigation">
              <button className="project-gallery-previous" type="button" aria-label="Previous screenshot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button>
              <button className="project-gallery-next" type="button" aria-label="Next screenshot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>
            </div>
          </div>
          <div className="project-gallery-thumbnails" role="group" aria-label="Choose a screenshot"></div>
        </div>
        <div className="project-viewer-details">
          <div className="project-viewer-title-row"><h2 id="project-viewer-title"></h2><span className="project-viewer-year" hidden></span></div>
          <p id="project-viewer-description" className="project-viewer-description"></p>
          <div className="project-viewer-case-study" hidden></div>
          <div className="project-viewer-explanation" hidden></div>
          <a className="project-viewer-visit hello-link" target="_blank" rel="noopener noreferrer" hidden>Visit project<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </dialog>
  </>);
}

export function MusicMarkup() {
  return (<>
<div className="music-player">
      <button className="music-toggle" type="button" aria-label="Music coming soon" aria-pressed="false" aria-describedby="music-hint" disabled>
        <span className="music-waveform" aria-hidden="true">
          <span className="music-bar"></span><span className="music-bar"></span><span className="music-bar"></span><span className="music-bar"></span><span className="music-bar"></span>
        </span>
      </button>
      <span id="music-hint" className="music-hint">Song coming soon</span>
      <span className="music-status sr-only" role="status" aria-live="polite"></span>
      <audio preload="none" loop aria-hidden="true"></audio>
    </div>
  </>);
}
