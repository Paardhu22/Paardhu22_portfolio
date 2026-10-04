// The first-paint markup lives in index.html, before the React bundle arrives.
let completionStarted = false;

export function completePortfolioPreloader() {
  const loader = document.getElementById('portfolio-preloader');
  if (!loader || completionStarted) return;
  completionStarted = true;
  const root = document.getElementById('root');
  root.inert = true;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const minimum = reducedMotion.matches ? 0 : Math.max(0, 720 - performance.now());

  // Wait for the typeface briefly; slow fonts must never hold the page hostage.
  Promise.all([
    delay(minimum),
    Promise.race([document.fonts.ready.catch(() => {}), delay(650)]),
  ]).then(() => {
    if (!loader.isConnected) return;
    if (reducedMotion.matches) { window.dismissPortfolioPreloader(); return; }
    document.documentElement.classList.add('is-loader-leaving');
    const fallback = setTimeout(finish, 400);
    function finish() {
      clearTimeout(fallback);
      window.dismissPortfolioPreloader();
    }
    loader.addEventListener('transitionend', event => {
      if (event.target === loader && event.propertyName === 'opacity') finish();
    }, { once: true });
  });
}
