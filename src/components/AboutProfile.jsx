import { useEffect, useRef, useState } from 'react';
import TextAccent from './TextAccent.jsx';
import './about-profile.css';

const storyUrl = 'https://www.linkedin.com/posts/paardhiv-reddy-tumma_hackathon-videoediting-buildinpublic-activity-7497946198146883584-JLtC';
const photos = [
  { file: 'everyday', alt: 'Paardhiv smiling in a black shirt while seated at a food court', width: 960, height: 1280 },
  { file: 'motion-house-team', alt: 'Three teammates seated together with their Motion House hackathon trophy', width: 720, height: 1280 },
  { file: 'city-lights', alt: 'Paardhiv beside a marina with illuminated buildings in the background', width: 1040, height: 780 },
  { file: 'with-friends', alt: 'Paardhiv and a friend taking a photo together in traditional clothes', width: 1280, height: 720 },
  { file: 'birthday', alt: 'Paardhiv wearing a birthday hat at a celebration', width: 960, height: 1280 },
  { file: 'at-the-track', alt: 'Paardhiv wearing a karting suit and holding a helmet beside the track', width: 960, height: 1280 },
];

function Arrow({ direction = 'right' }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={direction === 'left' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'} /></svg>;
}

function Photo({ index, className = '', onOpen, eager = false }) {
  const photo = photos[index];
  return <button type="button" className={`about-photo ${className}`} onClick={() => onOpen(index)} aria-label={`Enlarge photo: ${photo.alt}`} aria-haspopup="dialog">
    <img src={`/assets/about/${photo.file}.jpg`} alt={photo.alt} width={photo.width} height={photo.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  </button>;
}

export default function AboutProfile() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const isOpen = selected !== null;
  const selectedPhoto = photos[selected ?? 0];
  const move = (amount) => setSelected((current) => (current + amount + photos.length) % photos.length);

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return <>
    <section id="about" className="section about-section standalone-section" aria-labelledby="about-title">
      <div className="section-heading"><h2 id="about-title">About me</h2></div>
      <div className="about-introduction">
        <div className="about-bio">
          <p>I’m Paardhiv, a developer working on <TextAccent tone="violet" icon="pixels">design</TextAccent> and <TextAccent tone="blue" icon="code">code</TextAccent> for web and mobile applications.</p>
          <p>I also build tools for education, application security, and lunar image registration. The Work page covers the implementation <TextAccent tone="amber" icon="search">details</TextAccent>.</p>
        </div>
        <figure className="about-portrait">
          <Photo index={0} onOpen={setSelected} eager />
        </figure>
      </div>
    </section>

    <section className="about-achievement" aria-labelledby="motion-house-title">
      <div className="about-achievement-heading">
        <span className="about-win-label"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v5a4 4 0 0 1-8 0V3ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v6m-4 3h8m-6-3h4v3" /></svg>Recent achievement</span>
      </div>
      <div className="about-achievement-body">
        <Photo index={1} className="about-team-photo" onOpen={setSelected} />
        <div className="about-achievement-copy">
          <h2 id="motion-house-title">Motion House<span className="name-dot" aria-hidden="true">.</span></h2>
          <p>We won a hackathon with Motion House, a video-editing prototype that turns individual moments in a frame into something editable and interactive.</p>
          <p>Replace, redesign, or add content to a moment, while keeping the flexibility of a familiar video editor.</p>
          <p className="about-teammates">Built with <strong>Avinash Gupta</strong> and <strong>Vega Darsi</strong>.</p>
          <a className="about-story-link" href={storyUrl} target="_blank" rel="noopener noreferrer">The story behind the win <span aria-hidden="true">↗</span><span className="sr-only"> on LinkedIn (opens in a new tab)</span></a>
        </div>
      </div>
    </section>

    <section className="about-moments" aria-labelledby="about-moments-title">
      <div className="section-heading"><h2 id="about-moments-title">Away from the screen</h2></div>
      <div className="about-photo-grid">
        {photos.slice(2).map((photo, offset) => <figure key={photo.file} className="about-moment-wide">
          <Photo index={offset + 2} onOpen={setSelected} />
        </figure>)}
      </div>
    </section>

    <dialog ref={dialog} className="about-photo-dialog" aria-label="Photo viewer" onClose={(event) => { if (!event.currentTarget.open) setSelected(null); }} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={(event) => {
      if (event.key === 'Tab') {
        const controls = event.currentTarget.querySelectorAll('button');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      <div className="about-photo-dialog-panel">
        <button className="about-photo-close" type="button" onClick={() => setSelected(null)} aria-label="Close photo" autoFocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        {isOpen && <img className="about-full-photo" src={`/assets/about/${selectedPhoto.file}.jpg`} alt={selectedPhoto.alt} width={selectedPhoto.width} height={selectedPhoto.height} />}
        <div className="about-photo-dialog-footer">
          <p id="about-photo-position" aria-live="polite" aria-atomic="true"><span className="sr-only">{selectedPhoto.alt}. Photo </span>{(selected ?? 0) + 1} / {photos.length}</p>
          <div className="about-photo-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous photo"><Arrow direction="left" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next photo"><Arrow /></button>
          </div>
        </div>
      </div>
    </dialog>
  </>;
}
