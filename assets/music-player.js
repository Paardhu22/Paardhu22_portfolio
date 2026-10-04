// Persistent five-bar player adapted from Skiper UI. Playback is button-only.
export function initializeMusicPlayer(music) {
  const player = document.querySelector('.music-player');
  if (!player) return;
  const button = player.querySelector('.music-toggle');
  const audio = player.querySelector('audio');
  const hint = player.querySelector('.music-hint');
  const status = player.querySelector('.music-status');
  const bars = [...player.querySelectorAll('.music-bar')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const lifetime = new AbortController();
  const listen = (target, name, handler) => target.addEventListener(name, handler, { signal: lifetime.signal });
  const title = music.title || 'music';
  let waveformTimer;
  let noticeTimer;
  let isPlaying = false;
  let isLoading = false;
  let disposed = false;
  let playRequest = 0;

  button.disabled = false;
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = Math.min(1, Math.max(0, Number.isFinite(music.volume) ? music.volume : 0.45));

  function updateWaveform() {
    clearInterval(waveformTimer);
    const paint = () => {
      const still = [0.4, 0.75, 1, 0.65, 0.3];
      bars.forEach((bar, index) => {
        const height = isPlaying ? (reducedMotion.matches ? still[index] : Math.random() * 0.8 + 0.2) : 0.22;
        bar.style.transform = `scaleY(${height})`;
      });
    };
    paint();
    if (isPlaying && !document.hidden && !reducedMotion.matches) waveformTimer = setInterval(paint, 100);
  }

  function updateButton() {
    button.setAttribute('aria-pressed', String(isPlaying));
    button.setAttribute('aria-busy', String(isLoading));
    button.setAttribute('aria-label', music.src ? `${isPlaying ? 'Pause' : 'Play'} ${title}` : 'Music coming soon');
    hint.textContent = !music.src ? 'Song coming soon' : isLoading ? 'Loading music…' : isPlaying ? 'Click to pause' : 'Click to play music';
    player.classList.toggle('is-playing', isPlaying);
    updateWaveform();
  }

  function showNotice(message) {
    clearTimeout(noticeTimer);
    hint.textContent = message;
    status.textContent = message;
    player.classList.add('has-notice');
    noticeTimer = setTimeout(() => {
      player.classList.remove('has-notice');
      status.textContent = '';
      updateButton();
    }, 4000);
  }

  function playbackFailed() {
    isLoading = false;
    isPlaying = false;
    updateButton();
    showNotice('Music couldn’t load. Try again in a moment.');
  }

  async function requestPlay() {
    if (disposed || !music.src || isLoading) return;
    const request = ++playRequest;
    clearTimeout(noticeTimer);
    player.classList.remove('has-notice');
    isLoading = true;
    updateButton();
    if (!audio.getAttribute('src') || audio.error) audio.src = music.src;
    try {
      await audio.play();
      if (disposed || request !== playRequest) return;
      isLoading = false;
      isPlaying = !audio.paused;
      updateButton();
    } catch (error) {
      if (disposed || request !== playRequest) return;
      if (error.name === 'NotAllowedError') {
        isLoading = false;
        isPlaying = false;
        updateButton();
        showNotice('Your browser blocked sound. Check its site sound settings.');
      } else if (error.name !== 'AbortError') playbackFailed();
      else {
        isLoading = false;
        updateButton();
      }
    }
  }

  function pause() {
    ++playRequest;
    isLoading = false;
    audio.pause();
    isPlaying = false;
    updateButton();
    status.textContent = 'Music paused';
  }

  listen(audio, 'playing', () => {
    isPlaying = true;
    isLoading = false;
    player.classList.remove('has-notice');
    updateButton();
    status.textContent = `Playing ${title}`;
  });
  listen(audio, 'pause', () => {
    if (audio.error) { playbackFailed(); return; }
    isPlaying = false;
    isLoading = false;
    updateButton();
  });
  listen(audio, 'error', playbackFailed);
  listen(button, 'click', () => {
    if (!music.src) { showNotice('Song coming soon'); return; }
    if (!audio.paused || isLoading) { pause(); return; }
    requestPlay();
  });

  listen(document, 'visibilitychange', updateWaveform);
  listen(reducedMotion, 'change', updateWaveform);
  listen(window, 'pagehide', () => {
    ++playRequest;
    clearInterval(waveformTimer);
    clearTimeout(noticeTimer);
    audio.pause();
    isPlaying = false;
    isLoading = false;
    updateButton();
  });
  listen(window, 'pageshow', updateButton);
  updateButton();
  return {
    dispose() {
      disposed = true;
      ++playRequest;
      lifetime.abort();
      clearInterval(waveformTimer);
      clearTimeout(noticeTimer);
      audio.pause();
    },
  };
}
