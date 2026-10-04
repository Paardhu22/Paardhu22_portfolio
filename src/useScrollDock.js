import { useLayoutEffect, useRef, useState } from 'react';

export function useScrollDock(routeKey) {
  const dock = useRef(null);
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    const lifetime = new AbortController();
    let frame;
    let lastY = window.scrollY;
    let travel = 0;
    let direction = 0;

    const reveal = () => {
      setHidden(false);
      lastY = window.scrollY;
      travel = 0;
      direction = 0;
    };

    function update() {
      frame = null;
      const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(limit, window.scrollY));
      const delta = y - lastY;
      lastY = y;
      // Modal scrolling and keyboard use should never take navigation away.
      if (document.querySelector('#project-viewer')?.open) return;
      if (y <= 64 || dock.current?.querySelector(':focus-visible')) {
        reveal();
        return;
      }
      if (!delta) return;
      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) {
        travel = 0;
        direction = nextDirection;
      }
      travel += delta;
      if (travel >= 28) setHidden(true);
      else if (travel <= -12) setHidden(false);
    }

    const onScroll = () => {
      if (frame == null) frame = requestAnimationFrame(update);
    };
    reveal();
    // Read the final position after the router's layout effects restore scrolling.
    frame = requestAnimationFrame(() => { frame = null; reveal(); });
    window.addEventListener('scroll', onScroll, { passive: true, signal: lifetime.signal });
    window.addEventListener('pageshow', reveal, { signal: lifetime.signal });
    dock.current?.addEventListener('focusin', reveal, { signal: lifetime.signal });
    return () => {
      lifetime.abort();
      cancelAnimationFrame(frame);
    };
  }, [routeKey]);

  return { dock, hidden };
}
