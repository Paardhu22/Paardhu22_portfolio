// A user-controlled screenshot gallery. No slideshow or automatic navigation.
export function initializeProjectGallery(dialog, { reducedMotion, imageFor, safeImage }) {
  const lifetime = new AbortController();
  const listen = (target, type, callback, options = {}) => target.addEventListener(type, callback, { ...options, signal: lifetime.signal });
  const defaultMedia = dialog.querySelector('.project-viewer-media');
  let media = defaultMedia;
  const gallery = dialog.querySelector('.project-viewer-gallery');
  const caption = dialog.querySelector('.project-gallery-caption');
  const thumbnails = dialog.querySelector('.project-gallery-thumbnails');
  const previous = dialog.querySelector('.project-gallery-previous');
  const next = dialog.querySelector('.project-gallery-next');
  const defaultZoom = dialog.querySelector('.project-viewer-zoom');
  let zoom = defaultZoom;
  let slides = [];
  let selected = 0;
  let project;
  let projectIndex;
  let swipeStart;
  let selectionVersion = 0;

  function centreZoom() {
    media.scrollLeft = (media.scrollWidth - media.clientWidth) / 2;
    media.scrollTop = (media.scrollHeight - media.clientHeight) / 2;
  }

  function resetZoom() {
    media.classList.remove('is-zoomed');
    media.scrollTop = 0;
    media.scrollLeft = 0;
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Zoom in';
    media.setAttribute('aria-label', 'Project screenshot');
  }

  function selectSlide(index, transition = true) {
    if (!slides.length) return;
    const direction = index >= selected ? 1 : -1;
    selected = (index + slides.length) % slides.length;
    const version = ++selectionVersion;
    resetZoom();
    const slide = slides[selected];
    const image = imageFor({ ...project, image: slide.src, previewImage: slide.src, imageAlt: slide.alt }, projectIndex, true);
    media.replaceChildren(image);
    media.setAttribute('aria-busy', String(image.tagName === 'IMG' && !image.complete));
    const markReady = () => {
      if (version !== selectionVersion) return;
      media.setAttribute('aria-busy', 'false');
      if (media.classList.contains('is-zoomed')) centreZoom();
    };
    listen(image, 'load', markReady, { once: true });
    listen(image, 'error', markReady, { once: true });
    zoom.hidden = image.tagName !== 'IMG';
    listen(image, 'error', () => { if (version === selectionVersion) zoom.hidden = true; }, { once: true });
    caption.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')} · ${slide.label}`;
    [...thumbnails.children].forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === selected));
    });
    const active = thumbnails.children[selected];
    // Only move the thumbnail strip, never the page or the dialog panel.
    if (active) thumbnails.scrollTo({ left: active.offsetLeft - thumbnails.clientWidth / 2 + active.clientWidth / 2, behavior: 'instant' });
    if (transition && !reducedMotion.matches) {
      image.animate([{ opacity: 0, transform: `translateX(${direction * 12}px)` }, { opacity: 1, transform: 'none' }], {
        duration: 240, easing: 'cubic-bezier(.16, 1, .3, 1)',
      });
    }
  }

  function configure(value, index, target = {}) {
    resetZoom();
    media = target.media || defaultMedia;
    zoom = target.zoom || defaultZoom;
    project = value;
    projectIndex = index;
    selected = 0;
    resetZoom();
    slides = Array.isArray(project.images) ? project.images.filter(slide => slide && safeImage(slide.src)).map((slide, index) => ({
      src: slide.src,
      thumbnail: slide.thumbnail,
      label: slide.label || `Screenshot ${index + 1}`,
      alt: slide.alt || `${project.title}, ${slide.label || `screenshot ${index + 1}`}`,
    })) : [];
    if (!slides.length) slides = [{ src: project.previewImage || project.image, alt: project.imageAlt || `${project.title} preview`, label: 'Overview' }];
    gallery.hidden = slides.length < 2;
    thumbnails.replaceChildren();
    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-gallery-thumbnail';
      button.setAttribute('aria-label', `View screenshot ${index + 1}: ${slide.label}`);
      button.setAttribute('aria-pressed', 'false');
      const image = document.createElement('img');
      const source = safeImage(slide.thumbnail) || safeImage(slide.src);
      if (source) image.src = source;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      listen(image, 'error', () => { image.remove(); }, { once: true });
      const number = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0');
      number.setAttribute('aria-hidden', 'true');
      button.append(number, image);
      listen(button, 'click', () => {
        if (index !== selected) selectSlide(index);
      });
      thumbnails.append(button);
    });
    selectSlide(0, false);
  }

  listen(previous, 'click', () => selectSlide(selected - 1));
  listen(next, 'click', () => selectSlide(selected + 1));
  listen(dialog, 'click', event => {
    if (event.target !== zoom) return;
    if (media.classList.contains('is-zoomed')) {
      resetZoom();
      return;
    }
    media.querySelector('img')?.getAnimations().forEach(animation => animation.cancel());
    media.classList.add('is-zoomed');
    centreZoom();
    zoom.setAttribute('aria-pressed', 'true');
    zoom.textContent = 'Fit view';
    media.setAttribute('aria-label', 'Zoomed screenshot. Scroll to explore the image.');
  });
  listen(dialog, 'keydown', event => {
    if (gallery.hidden || !dialog.open || media.classList.contains('is-zoomed') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('.seleno-showcase, .qp-studio, .qp-case-study') || event.target.matches('input, select, textarea')) return;
    const keys = { ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    selectSlide(keys[event.key]);
  });
  listen(dialog, 'touchstart', event => {
    if (!media.contains(event.target)) { swipeStart = null; return; }
    swipeStart = event.touches.length === 1 && !media.classList.contains('is-zoomed') ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  listen(dialog, 'touchend', event => {
    if (!swipeStart || gallery.hidden || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - swipeStart.x;
    const dy = event.changedTouches[0].clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) selectSlide(selected + (dx < 0 ? 1 : -1));
  }, { passive: true });
  listen(dialog, 'touchcancel', () => { swipeStart = null; }, { passive: true });
  listen(reducedMotion, 'change', event => {
    if (event.matches) media.querySelector('img')?.getAnimations().forEach(animation => animation.cancel());
  });
  return { configure, resetZoom, dispose() {
    lifetime.abort();
    media.querySelector('img')?.getAnimations().forEach(animation => animation.cancel());
  } };
}
