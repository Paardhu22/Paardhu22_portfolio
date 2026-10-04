// Project-photo adaptation of the supplied Skiper UI expanding-media interaction.
import { initializeProjectGallery } from './project-gallery.js';
import { createTerminalCover, mountTrinkerTerminal } from './trinker-terminal.js';
import { createSelenoCover, mountSelenoShowcase } from './seleno-showcase.js';
import { createQpgenCover, mountQpgenStudio } from './qpgen-studio.js';
import { mountQpgenCaseStudy } from './qpgen-case-study.js';
import { mountTrinkerCaseStudy } from './trinker-case-study.js';
import { mountSelenoCaseStudy } from './seleno-case-study.js';
export function initializeProjectViewer(projects) {
  const lifetime = new AbortController();
  const listen = (target, type, callback, options = {}) => target.addEventListener(type, callback, { ...options, signal: lifetime.signal });
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#project-viewer');
  if (!grid || !dialog) return;

  const media = dialog.querySelector('.project-viewer-media');
  const details = dialog.querySelector('.project-viewer-details');
  const backdrop = dialog.querySelector('.project-viewer-backdrop');
  const closeButton = dialog.querySelector('.project-viewer-close');
  const panel = dialog.querySelector('.project-viewer-panel');
  const title = dialog.querySelector('#project-viewer-title');
  const description = dialog.querySelector('#project-viewer-description');
  const year = dialog.querySelector('.project-viewer-year');
  const visit = dialog.querySelector('.project-viewer-visit');
  const explanation = dialog.querySelector('.project-viewer-explanation');
  const caseStudy = dialog.querySelector('.project-viewer-case-study');
  const real = dialog.querySelector('.project-viewer-real');
  const realMedia = dialog.querySelector('.project-viewer-real-media');
  const realZoom = dialog.querySelector('.project-viewer-real-zoom');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const galleryElement = dialog.querySelector('.project-viewer-gallery');
  const actions = dialog.querySelector('.project-viewer-actions');
  const gallery = initializeProjectGallery(dialog, { reducedMotion, imageFor: projectImage, safeImage });
  let activeTrigger;
  let closing = false;
  let animations = [];
  let terminalSession;
  let showcaseSession;
  let caseStudySession;

  function safeLink(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function safeImage(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function numberedCover(index) {
    const number = document.createElement('span');
    number.className = 'project-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    return number;
  }

  function projectImage(project, index, expanded = false) {
    const source = safeImage(expanded ? project.previewImage || project.image : project.image);
    if (!source) return numberedCover(index);
    const image = document.createElement('img');
    image.src = source;
    image.alt = project.imageAlt || `${project.title} preview`;
    image.decoding = 'async';
    image.loading = expanded ? 'eager' : 'lazy';
    listen(image, 'error', () => image.replaceWith(numberedCover(index)), { once: true });
    return image;
  }

  function cancelAnimations() {
    animations.forEach(animation => animation.cancel());
    animations = [];
  }

  function animate(element, frames, options) {
    const animation = element.animate(frames, { fill: 'both', ...options });
    // Cancellation is intentional when closing mid-entrance or switching motion preferences.
    animation.finished.catch(() => {});
    animations.push(animation);
    return animation;
  }

  function transformFrom(origin, destination) {
    return `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})`;
  }

  function unlockPage() {
    document.documentElement.classList.remove('project-viewer-open');
    document.body.classList.remove('project-viewer-open');
    document.body.style.removeProperty('--preview-scrollbar');
  }

  function finishClose() {
    if (!dialog.open) return;
    cancelAnimations();
    caseStudySession?.dispose();
    caseStudySession = null;
    panel.classList.remove('is-animating');
    dialog.close();
    unlockPage();
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
    closing = false;
  }

  function closePreview() {
    if (!dialog.open || closing) return;
    closing = true;
    terminalSession?.dispose();
    terminalSession = null;
    showcaseSession?.dispose();
    showcaseSession = null;
    if (reducedMotion.matches || !activeTrigger?.isConnected) {
      finishClose();
      return;
    }

    const currentTransform = getComputedStyle(media).transform;
    const currentDetailsOpacity = getComputedStyle(details).opacity;
    const currentBackdropOpacity = getComputedStyle(backdrop).opacity;
    cancelAnimations();
    gallery.resetZoom();
    panel.classList.add('is-animating');
    const destination = media.getBoundingClientRect();
    const origin = activeTrigger.querySelector('.project-preview').getBoundingClientRect();
    animate(details, [{ opacity: currentDetailsOpacity }, { opacity: 0 }], { duration: 160 });
    animate(actions, [{ opacity: 1 }, { opacity: 0 }], { duration: 120 });
    animate(galleryElement, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
    animate(backdrop, [{ opacity: currentBackdropOpacity }, { opacity: 0 }], { duration: 360 });
    const collapse = animate(media, [
      { transform: currentTransform, opacity: 1 },
      { transform: transformFrom(origin, destination), opacity: 0.85 },
    ], { duration: 420, easing: 'cubic-bezier(.4, 0, .2, 1)' });
    collapse.finished.then(finishClose).catch(() => {});
  }

  function openPreview(project, trigger, index, example = false) {
    if (dialog.open) return;
    cancelAnimations();
    activeTrigger = trigger;
    closing = false;
    const origin = trigger.querySelector('.project-preview').getBoundingClientRect();
    title.textContent = project.title;
    description.textContent = project.details || project.description || '';
    description.hidden = !description.textContent;
    year.textContent = project.year || '';
    year.hidden = !year.textContent;
    const url = safeLink(project.url);
    visit.hidden = !url;
    visit.textContent = project.linkLabel || 'Visit project';
    const linkHint = document.createElement('span');
    linkHint.className = 'sr-only';
    linkHint.textContent = ' (opens in a new tab)';
    visit.append(linkHint);
    if (url) visit.href = url;
    else visit.removeAttribute('href');
    const isTerminal = project.preview === 'terminal';
    const isSeleno = project.preview === 'seleno';
    const isQpgen = project.preview === 'qpgen';
    dialog.dataset.kind = isTerminal ? 'terminal' : isSeleno ? 'seleno' : isQpgen ? 'qpgen' : 'photo';
    dialog.classList.toggle('has-case-study', isQpgen || isTerminal || isSeleno);
    terminalSession?.dispose();
    terminalSession = null;
    showcaseSession?.dispose();
    showcaseSession = null;
    caseStudySession?.dispose();
    caseStudySession = isQpgen ? mountQpgenCaseStudy(caseStudy, { panel, reducedMotion })
      : isTerminal ? mountTrinkerCaseStudy(caseStudy, { panel, reducedMotion })
      : isSeleno ? mountSelenoCaseStudy(caseStudy, { panel, reducedMotion }) : null;
    real.hidden = !(isSeleno || isQpgen);
    if (isTerminal) {
      galleryElement.hidden = true;
      dialog.querySelector('.project-viewer-zoom').hidden = true;
      media.removeAttribute('tabindex');
      media.setAttribute('aria-label', 'Interactive TRINKER terminal');
      media.setAttribute('aria-busy', 'false');
      terminalSession = mountTrinkerTerminal(media, reducedMotion);
    } else if (isSeleno || isQpgen) {
      real.querySelector('p').textContent = `${isQpgen ? 'Seven' : 'Eight'} screenshots from the actual ${isQpgen ? 'qp-gen' : 'Seleno'} interface.`;
      gallery.configure(project, index, { media: realMedia, zoom: realZoom });
      dialog.querySelector('.project-viewer-zoom').hidden = true;
      media.removeAttribute('tabindex');
      media.setAttribute('aria-label', isQpgen ? 'Interactive qp-gen paper studio' : 'Interactive Seleno alignment story');
      media.setAttribute('aria-busy', 'false');
      showcaseSession = isQpgen ? mountQpgenStudio(media, reducedMotion) : mountSelenoShowcase(media, reducedMotion);
    } else {
      media.tabIndex = 0;
      gallery.configure(project, index);
    }
    explanation.replaceChildren();
    const explanations = !caseStudySession && Array.isArray(project.explanation) ? project.explanation : [];
    explanation.hidden = !explanations.length;
    for (const item of explanations) {
      const block = document.createElement('div');
      const heading = document.createElement('h3');
      heading.textContent = item.title;
      const text = document.createElement('p');
      text.textContent = item.body;
      block.append(heading, text);
      explanation.append(block);
    }
    dialog.dataset.example = String(example);

    const scrollbarWidth = innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--preview-scrollbar', `${scrollbarWidth}px`);
    document.documentElement.classList.add('project-viewer-open');
    document.body.classList.add('project-viewer-open');
    dialog.showModal();
    panel.scrollTop = 0;
    closeButton.focus({ preventScroll: true });

    if (reducedMotion.matches) return;
    panel.classList.add('is-animating');
    const destination = media.getBoundingClientRect();
    animate(backdrop, [{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
    const expansion = animate(media, [
      { transform: transformFrom(origin, destination), opacity: 0.85 },
      { transform: 'none', opacity: 1 },
    ], { duration: 620, easing: 'cubic-bezier(.16, 1, .3, 1)' });
    expansion.finished.then(() => {
      if (!closing) panel.classList.remove('is-animating');
    }).catch(() => {});
    animate(details, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], {
      delay: 180, duration: 350, easing: 'cubic-bezier(.16, 1, .3, 1)',
    });
    animate(actions, [{ opacity: 0 }, { opacity: 1 }], { delay: 180, duration: 200 });
    animate(galleryElement, [{ opacity: 0 }, { opacity: 1 }], { delay: 200, duration: 250 });
  }

  function wireThumbnail(trigger, project, index, example = false) {
    trigger.disabled = false;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'project-viewer');
    trigger.setAttribute('aria-label', `View ${project.title}`);
    listen(trigger, 'click', () => openPreview(project, trigger, index, example));
  }

  const validProjects = Array.isArray(projects) ? projects.filter(project =>
    project && typeof project.title === 'string' && project.title.trim(),
  ) : [];

  for (const [index, project] of validProjects.entries()) {
    const card = document.createElement('article');
    card.className = 'project';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'project-preview-trigger';
    const preview = document.createElement('span');
    preview.className = 'project-preview';
    if (project.preview === 'terminal') {
      card.classList.add('project-with-terminal');
      preview.append(createTerminalCover());
    } else if (project.preview === 'seleno') {
      card.classList.add('project-with-seleno');
      preview.append(createSelenoCover());
    } else if (project.preview === 'qpgen') {
      card.classList.add('project-with-qpgen');
      preview.append(createQpgenCover());
    } else preview.append(projectImage(project, index));
    const photoCount = Array.isArray(project.images) ? project.images.filter(slide => slide && safeImage(slide.src)).length : 0;
    if (photoCount > 1) {
      card.classList.add('project-with-gallery');
      if (project.preview !== 'qpgen') {
        const count = document.createElement('span');
        count.className = 'project-photo-count';
        count.textContent = `${photoCount} views`;
        preview.append(count);
      }
    }
    trigger.append(preview);
    const titleRow = document.createElement('div');
    titleRow.className = 'project-title-row';
    const heading = document.createElement('h3');
    heading.textContent = project.title;
    titleRow.append(heading);
    if (project.year) {
      const label = document.createElement('span');
      label.className = 'project-year';
      label.textContent = project.year;
      titleRow.append(label);
    }
    const summary = document.createElement('p');
    summary.className = 'project-description';
    summary.textContent = project.description || '';
    card.append(trigger, titleRow, summary);
    grid.append(card);
    wireThumbnail(trigger, project, index);
  }

  if (validProjects.length) {
    document.querySelector('#work-empty').hidden = true;
    document.querySelector('#work-status').hidden = true;
    grid.hidden = false;
  }

  const example = document.querySelector('#preview-example-button');
  if (example) wireThumbnail(example, {
    title: 'Preview example',
    description: 'Selected projects will be here soon.',
    image: 'assets/preview-example.png',
    imageAlt: 'Paardhiv’s portfolio introduction',
  }, 0, true);

  listen(closeButton, 'click', closePreview);
  listen(dialog, 'keydown', event => {
    if (event.key !== 'Tab' || event.defaultPrevented) return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')]
      .filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  listen(dialog, 'cancel', event => {
    event.preventDefault();
    closePreview();
  });
  listen(dialog, 'click', event => {
    if (event.target === backdrop || event.target === dialog) closePreview();
  });
  listen(dialog, 'close', () => {
    terminalSession?.dispose();
    terminalSession = null;
    showcaseSession?.dispose();
    showcaseSession = null;
    caseStudySession?.dispose();
    caseStudySession = null;
    unlockPage();
    cancelAnimations();
    panel.classList.remove('is-animating');
    closing = false;
  });
  listen(reducedMotion, 'change', event => {
    if (!event.matches || !dialog.open) return;
    if (closing) finishClose();
    else {
      cancelAnimations();
      panel.classList.remove('is-animating');
    }
  });
  return {
    closeImmediately() {
      terminalSession?.dispose();
      terminalSession = null;
      showcaseSession?.dispose();
      showcaseSession = null;
      finishClose();
    },
    dispose() {
      terminalSession?.dispose();
      terminalSession = null;
      showcaseSession?.dispose();
      showcaseSession = null;
      finishClose();
      cancelAnimations();
      gallery.dispose();
      lifetime.abort();
      grid.replaceChildren();
      document.querySelector('#work-empty').hidden = false;
      document.querySelector('#work-status').hidden = false;
      if (example) example.disabled = true;
    },
  };

}
