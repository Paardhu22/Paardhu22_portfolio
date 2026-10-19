import { useEffect, useRef, useState } from 'react';
import './contact-artwork.css';

const studies = [
  { id: 'harbour', title: 'A harbour, in ink', medium: 'Sepia pen & watercolour',
    description: 'A little Mediterranean world: terracotta rooftops, sage-covered hills, and a ferry crossing a Prussian-blue sea.',
    alt: 'An intricate bird’s-eye harbour map with terracotta-roofed houses, limestone quays, small boats, and a ferry on deep blue water.' },
  { id: 'botanical', title: 'Ananas comosus', medium: 'Botanical plate · Phyllotaxis',
    description: 'A pineapple seen from above, traced in sepia and graphite. Interlocking scales reveal the quiet order of the golden angle.',
    alt: 'A circular botanical engraving of a pineapple apex, with detailed scales, Fibonacci spirals, and scientific annotations on antique paper.' },
  { id: 'fountain', title: 'Beneath the surface', medium: 'Girih geometry · Refracted light',
    description: 'Lapis, turquoise, and saffron tiles beneath rippling water. A handful of worn coins catches the light.',
    alt: 'An overhead fountain study showing intricate blue and gold star tiles, submerged copper and nickel coins, and bright water caustics.' },
];
const image = (study, size) => `/assets/artwork/${study.id}-${size}.webp`;

function ExpandIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" /></svg>;
}

export default function ContactArtwork({ active }) {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!active) { dialog.current?.close(); return; }
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const modal = dialog.current;
    modal.showModal();
    return () => { modal.close(); document.body.style.overflow = previousOverflow; };
  }, [selected, active]);

  function close() {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  }

  return <section className="contact-artwork" aria-labelledby="artwork-title">
    <div className="artwork-heading">
      <div><p className="artwork-eyebrow">A creative detour</p><h3 id="artwork-title">The sketchbook<span className="name-dot">.</span></h3></div>
      <span className="artwork-count">01 — 03</span>
    </div>
    <p className="artwork-intro">AI-assisted explorations in ink, watercolour, and geometry.</p>
    {active && <div className="artwork-grid">
      {studies.map((study, index) => <figure key={study.id} className={`artwork-study artwork-study-${study.id}`}>
        <button className="artwork-open" type="button" aria-label={`View ${study.title}`} aria-haspopup="dialog" onClick={event => {
          trigger.current = event.currentTarget; setSelected(study);
        }}>
          <img src={image(study, 800)} srcSet={`${image(study, 480)} 480w, ${image(study, 800)} 800w, ${image(study, 1200)} 1200w`}
            sizes={index === 0 ? '(max-width: 648px) calc(100vw - 48px), 600px' : '(max-width: 420px) calc(100vw - 48px), (max-width: 648px) calc((100vw - 68px) / 2), 290px'}
            width="1200" height="1200" alt={study.alt} loading="lazy" decoding="async" />
          <span className="artwork-expand"><ExpandIcon /><span className="sr-only">Expand artwork</span></span>
        </button>
        <figcaption>
          <span className="artwork-number">0{index + 1}</span>
          <div><h4>{study.title}</h4><p>{study.medium}</p></div>
        </figcaption>
      </figure>)}
    </div>}
    <p className="artwork-footnote">A few experiments between projects. Open a study for a closer look.</p>
    <dialog ref={dialog} className="artwork-lightbox" aria-labelledby="artwork-dialog-title" aria-describedby="artwork-dialog-description"
      onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {selected && <div className="artwork-lightbox-panel">
        <div className="artwork-lightbox-toolbar"><span>From the sketchbook</span><button type="button" onClick={close} aria-label="Close artwork">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button></div>
        <img src={image(selected, 1200)} width="1200" height="1200" alt={selected.alt} />
        <div className="artwork-lightbox-caption"><h3 id="artwork-dialog-title">{selected.title}</h3><p id="artwork-dialog-description">{selected.description}</p></div>
      </div>}
    </dialog>
  </section>;
}
