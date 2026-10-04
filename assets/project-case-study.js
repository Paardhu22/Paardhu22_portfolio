// Shared case-study reader. Rolling contents adapt the supplied Skiper UI TextRoll reference.
// The qp-case CSS class names are retained so existing styles and previews stay consistent.
function rollingLabel(label) {
  const group = document.createElement('span');
  group.className = 'qp-case-roll-label';
  group.setAttribute('aria-hidden', 'true');
  let offset = 0;
  label.split(' ').forEach((word, wordIndex) => {
    if (wordIndex) group.append(document.createTextNode(' '));
    const mask = document.createElement('span');
    mask.className = 'qp-case-roll';
    for (let copy = 0; copy < 2; copy++) {
      const row = document.createElement('span');
      row.className = `qp-case-roll-row${copy ? ' qp-case-roll-copy' : ''}`;
      [...word].forEach((character, index) => {
        const letter = document.createElement('span');
        letter.className = 'qp-case-letter';
        letter.textContent = character;
        letter.style.setProperty('--roll-delay', `${.035 * Math.abs(offset + index - (label.length - 1) / 2)}s`);
        row.append(letter);
      });
      mask.append(row);
    }
    group.append(mask);
    offset += word.length + 1;
  });
  return group;
}

export function mountProjectCaseStudy(container, { panel, reducedMotion }, { id, title: articleTitle, sections, note: sourceNote, theme }) {
  const lifetime = new AbortController();
  let pendingJump = null;
  const article = document.createElement('article');
  article.className = 'qp-case-study';
  article.dataset.study = theme;
  const contentsId = `${id}-contents`;
  article.setAttribute('aria-label', articleTitle);
  const nav = document.createElement('nav');
  nav.className = 'qp-case-toc';
  nav.setAttribute('aria-labelledby', contentsId);
  const title = document.createElement('h3');
  title.id = contentsId;
  title.tabIndex = -1;
  title.textContent = 'Contents';
  const list = document.createElement('ol');
  nav.append(title, list);
  article.append(nav);
  sections.forEach((item, index) => {
    const number = String(index + 1).padStart(2, '0');
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${id}-${item.id}`;
    link.setAttribute('aria-label', `${number}. ${item.label}`);
    const prefix = document.createElement('span');
    prefix.className = 'qp-case-index';
    prefix.setAttribute('aria-hidden', 'true');
    prefix.textContent = `[${number}]`;
    link.append(prefix, rollingLabel(item.label));
    row.append(link);
    list.append(row);

    const section = document.createElement('section');
    section.className = 'qp-case-section';
    section.setAttribute('aria-labelledby', `${id}-${item.id}`);
    const heading = document.createElement('h3');
    heading.id = `${id}-${item.id}`;
    heading.tabIndex = -1;
    const kicker = document.createElement('span');
    kicker.className = 'qp-case-section-label';
    kicker.textContent = `${number} / ${item.label}`;
    heading.textContent = item.title;
    const body = document.createElement('div');
    body.className = 'qp-case-body';
    body.innerHTML = item.body; // Authored static markup above, never user/runtime input.
    section.append(kicker, heading, body);
    article.append(section);
  });
  const footer = document.createElement('footer');
  footer.className = 'qp-case-footer';
  const note = document.createElement('p');
  note.textContent = sourceNote;
  const back = document.createElement('a');
  back.href = `#${contentsId}`;
  back.textContent = 'Back to contents ↑';
  footer.append(note, back);
  article.append(footer);
  container.replaceChildren(article);
  container.hidden = false;

  article.addEventListener('click', event => {
    const link = event.target.closest(`a[href^="#${id}-"]`);
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = article.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    // Scroll only the dialog. Keep the route and the persistent music session intact.
    const top = panel.scrollTop + target.getBoundingClientRect().top - panel.getBoundingClientRect().top - 76;
    pendingJump = reducedMotion.matches ? null : Math.max(0, Math.min(top, panel.scrollHeight - panel.clientHeight));
    panel.scrollTo({ top, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    target.focus({ preventScroll: true });
  }, { signal: lifetime.signal });

  panel.addEventListener('scroll', () => {
    if (pendingJump !== null && Math.abs(panel.scrollTop - pendingJump) < 1) pendingJump = null;
  }, { passive: true, signal: lifetime.signal });
  for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    panel.addEventListener(type, () => { pendingJump = null; }, { passive: true, signal: lifetime.signal });
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches && pendingJump !== null) {
      panel.scrollTo({ top: pendingJump, behavior: 'instant' });
      pendingJump = null;
    }
  }, { signal: lifetime.signal });

  return { dispose() { lifetime.abort(); container.replaceChildren(); container.hidden = true; } };
}
