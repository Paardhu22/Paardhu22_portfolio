// An illustrated explanation, not a registration job. Measurements are saved project results.
const TERRAIN = 'assets/projects/seleno/previews/lunar-terrain.webp';
const steps = [
  { name: 'Place', title: 'One Moon. Two coordinate systems.', body: 'A Chandrayaan-2 image and a reference map can show the same terrain at different scales, angles, and lighting. Spacecraft geometry gives the first rough placement.', note: 'Start with the footprint, not a blind search.' },
  { name: 'Match', title: 'Find the same ground.', body: 'Coarse matchers find a useful overlap. An evenly spaced grid then searches for matching patches at the source image’s native resolution.', note: 'Gold: source points. Mint: reference points.' },
  { name: 'Align', title: 'Fit. Refine. Check again.', body: 'A verified transform brings the images into a shared frame. Terrain and smooth local corrections are added only when they improve validation.', note: 'The moving footprint illustrates the correction.' },
  { name: 'Inspect', title: 'A good-looking overlay isn’t enough.', body: 'Seleno measures error on sealed check points that fitting never used. It exports the registered image, match points, and an honest accuracy report.', note: 'Blue squares represent held-out check points.' },
];

// README and reports/validation_20260925/deck_summary.md in seleno-prototype.
const results = {
  ohrc: { pair: 'OHRC → LRO NAC', source: '3.840', reference: '1.057', inliers: '1,259', model: 'Affine + terrain' },
  tmc2: { pair: 'TMC-2 → SELENE TC', source: '2.336', reference: '1.746', inliers: '1,249', model: 'Affine + local field' },
  iirs: { pair: 'IIRS → LRO WAC · 2025', source: '1.870', reference: '1.616', inliers: '474', model: 'Affine + local field' },
};

const points = [[266,79],[348,69],[454,90],[287,135],[381,127],[473,152],[264,205],[344,190],[454,211],[295,253],[397,261],[478,260]];

function sceneMarkup() {
  const grid = [100,200,300,400,500,600].map(x => `<path d="M${x} 0v320"/>`).join('')
    + [80,160,240].map(y => `<path d="M0 ${y}h720"/>`).join('');
  const targets = points.map(([x,y],i) => `<circle cx="${x}" cy="${y}" r="4" style="--point:${i}"/>`).join('');
  const sources = points.map(([x,y],i) => `<circle cx="${x}" cy="${y}" r="3" style="--point:${i}"/>`).join('');
  const lines = points.map(([x,y],i) => `<path d="M${x} ${y}l54 -22" style="--point:${i}"/>`).join('');
  return `<svg class="seleno-map" viewBox="0 0 720 320" role="img" aria-label="An offset lunar image footprint on its reference map">
    <defs>
      <clipPath id="seleno-footprint"><rect x="232" y="40" width="270" height="240" rx="2"/></clipPath>
      <clipPath id="seleno-wipe"><rect class="seleno-wipe-rect" x="232" y="40" width="270" height="240"/></clipPath>
    </defs>
    <image class="seleno-reference-texture" href="${TERRAIN}" x="0" y="0" width="720" height="320" preserveAspectRatio="xMidYMid slice"/>
    <rect width="720" height="320" fill="#0c141b" opacity=".38"/>
    <g class="seleno-map-grid">${grid}</g>
    <rect class="seleno-target-outline" x="232" y="40" width="270" height="240" rx="2"/>
    <g class="seleno-source">
      <g clip-path="url(#seleno-wipe)"><g clip-path="url(#seleno-footprint)">
        <image href="${TERRAIN}" x="0" y="0" width="720" height="320" preserveAspectRatio="xMidYMid slice"/>
        <rect x="232" y="40" width="270" height="240" fill="#deb573" opacity=".09"/>
      </g></g>
      <rect class="seleno-source-outline" x="232" y="40" width="270" height="240" rx="2"/>
      <g class="seleno-source-points">${sources}</g>
    </g>
    <g class="seleno-match-lines">${lines}</g>
    <g class="seleno-reference-points">${targets}</g>
    <g class="seleno-check-points"><rect x="309" y="100" width="8" height="8"/><rect x="420" y="170" width="8" height="8"/><rect x="369" y="233" width="8" height="8"/></g>
    <path class="seleno-scan" d="M230 40h272"/>
    <g class="seleno-crosshair"><path d="M360 148v24m-12-12h24"/><circle cx="360" cy="160" r="18"/></g>
  </svg>`;
}

export function createSelenoCover() {
  const cover = document.createElement('span');
  cover.className = 'seleno-cover';
  cover.innerHTML = `<img src="${TERRAIN}" alt="Lunar terrain with a source-image footprint" loading="lazy" decoding="async"/>
    <span class="seleno-cover-shade"></span><span class="seleno-cover-orbit" aria-hidden="true"></span>
    <span class="seleno-cover-label">SELENO <span>Lunar image registration</span></span>
    <span class="seleno-cover-copy">Finding common ground<span>Different images. One shared frame.</span></span>
    <span class="seleno-cover-foot">Explore the alignment <span aria-hidden="true">↗</span></span>`;
  return cover;
}

export function mountSelenoShowcase(container, reducedMotion) {
  const lifetime = new AbortController();
  const listen = (target, type, handler) => target.addEventListener(type, handler, { signal: lifetime.signal });
  const element = document.createElement('section');
  element.className = 'seleno-showcase';
  element.dataset.step = '0';
  element.setAttribute('aria-label', 'Interactive Seleno workflow');
  element.innerHTML = `
    <div class="seleno-story-header"><div><span class="seleno-eyebrow">SELENO / Chandrayaan-2</span><h3>A common ground.</h3></div><span class="seleno-story-tag">Interactive story</span></div>
    <div class="seleno-stage">
      ${sceneMarkup()}
      <div class="seleno-map-labels" aria-hidden="true"><span><i></i>Reference map</span><span><i></i>Source footprint</span></div>
      <div class="seleno-map-coordinate" aria-hidden="true">LUNAR / SHARED FRAME</div>
    </div>
    <div class="seleno-control-bar"><div class="seleno-steps" role="group" aria-label="Explore the alignment steps">
      ${steps.map((step,i) => `<button type="button" data-step="${i}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span>${step.name}</button>`).join('')}
    </div><button type="button" class="seleno-play"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6z"/></svg><span>Play story</span></button></div>
    <div class="seleno-inspect-controls" hidden>
      <label class="seleno-compare">Compare the illustrated overlay<input type="range" min="0" max="100" value="50" aria-label="Compare reference and aligned source"/><span><span>Reference</span><span>Aligned source</span></span></label>
      <button class="seleno-points-toggle" type="button" aria-pressed="true">Hide points</button>
    </div>
    <div class="seleno-story-copy" aria-live="polite" aria-atomic="true"><h4></h4><p></p><span class="seleno-step-note"></span></div>
    <div class="seleno-results" hidden>
      <div class="seleno-results-heading"><div><span class="seleno-eyebrow">Saved validation / 25 Sep 2026</span><h4>Measured in the real project</h4></div><label>Validation pair<select aria-label="Validation pair"><option value="ohrc">OHRC → LRO NAC</option><option value="tmc2">TMC-2 → SELENE TC</option><option value="iirs">IIRS → LRO WAC · 2025</option></select></label></div>
      <dl class="seleno-result-metrics"><div><dt>Source RMSE</dt><dd data-metric="source"></dd></div><div><dt>Reference RMSE</dt><dd data-metric="reference"></dd></div><div><dt>Inliers</dt><dd data-metric="inliers"></dd></div></dl>
      <p class="seleno-result-model"></p><p class="seleno-quality-note"><span>Warning</span>Real pairs are above the 1 source-pixel target. Error is measured on held-out matches, without independent surveyed controls.</p>
      <div class="seleno-output-files"><span>registered.tif</span><span>matches.csv</span><span>metrics.json</span></div>
    </div>
    <p class="seleno-illustration-note">Illustrated workflow, not a live registration. Terrain: NASA/ASU LROC.</p>`;
  container.replaceChildren(element);
  let selected = 0;
  let timer;
  let playing = false;
  let disposed = false;
  const play = element.querySelector('.seleno-play');
  const buttons = [...element.querySelectorAll('.seleno-steps button')];
  const compare = element.querySelector('input[type="range"]');
  const wipe = element.querySelector('.seleno-wipe-rect');
  const source = element.querySelector('.seleno-source');
  const scene = element.querySelector('.seleno-map');

  function updatePlay() {
    play.querySelector('span').textContent = playing ? 'Pause story' : selected===3 ? 'Replay story' : selected===0 ? 'Play story' : 'Continue story';
    play.querySelector('path').setAttribute('d', playing ? 'M7 4v12m6-12v12' : 'm7 4 9 6-9 6z');
    play.classList.toggle('is-playing', playing);
  }
  function stop() {
    clearTimeout(timer);
    playing = false;
    element.classList.remove('is-running');
    updatePlay();
  }
  function applyCompare() {
    wipe.setAttribute('width', selected===3 ? 270*Number(compare.value)/100 : 270);
  }
  function select(index) {
    selected = index;
    element.dataset.step = String(index);
    const step = steps[index];
    element.querySelector('.seleno-story-copy h4').textContent = step.title;
    element.querySelector('.seleno-story-copy p').textContent = step.body;
    element.querySelector('.seleno-step-note').textContent = step.note;
    buttons.forEach((button,i) => button.setAttribute('aria-pressed', String(i===index)));
    element.querySelector('.seleno-inspect-controls').hidden = index!==3;
    element.querySelector('.seleno-results').hidden = index!==3;
    source.style.transform = ['translate(54px, -22px) rotate(-7deg)','translate(22px, -8px) rotate(-2deg)','none','none'][index];
    scene.setAttribute('aria-label', `${step.name}: ${step.title} ${step.note}`);
    applyCompare();
    updatePlay();
  }
  function advance() {
    if (disposed || !playing) return;
    if (selected===3) { stop(); return; }
    select(selected+1);
    timer = setTimeout(advance, selected===1 ? 2000 : selected===2 ? 1700 : 500);
  }
  function run() {
    if (playing) { stop(); return; }
    if (reducedMotion.matches) { select(3); return; }
    if (selected===3) select(0);
    playing = true;
    element.classList.add('is-running');
    updatePlay();
    timer = setTimeout(advance, 1100);
  }
  function renderResults() {
    const record = results[element.querySelector('select').value];
    for (const key of ['source','reference','inliers']) element.querySelector(`[data-metric="${key}"]`).textContent = record[key] + (key==='inliers' ? '' : ' px');
    element.querySelector('.seleno-result-model').textContent = `${record.pair} · ${record.model}`;
  }
  buttons.forEach((button,i) => listen(button,'click',()=>{stop();select(i);}));
  listen(element.querySelector('.seleno-steps'),'keydown',event=>{
    const direction = event.key==='ArrowRight' ? 1 : event.key==='ArrowLeft' ? -1 : 0;
    if (!direction) return;
    event.preventDefault();stop();select((selected+direction+4)%4);buttons[selected].focus();
  });
  listen(play,'click',run);
  listen(compare,'input',applyCompare);
  listen(element.querySelector('select'),'change',renderResults);
  listen(element.querySelector('.seleno-points-toggle'),'click',event=>{
    const hidden = element.classList.toggle('hide-points');
    event.currentTarget.setAttribute('aria-pressed',String(!hidden));
    event.currentTarget.textContent = hidden ? 'Show points' : 'Hide points';
  });
  listen(document,'visibilitychange',()=>{if(document.hidden) stop();});
  listen(reducedMotion,'change',event=>{
    if(!event.matches) return;
    const wasPlaying=playing;stop();
    element.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    if(wasPlaying) select(3);
  });
  renderResults();select(0);
  return { dispose() {
    disposed=true;stop();lifetime.abort();
    element.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
  } };
}
