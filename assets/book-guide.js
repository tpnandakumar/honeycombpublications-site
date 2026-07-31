(() => {
  'use strict';

  const body = document.body;
  const pitch = body.dataset.bookPitch;
  if (!pitch) return;

  const title = body.dataset.bookTitle || document.querySelector('h1')?.textContent?.trim() || 'This book';
  const isTorsades = /torsades|pulse breaker/i.test(title);

  if (!document.querySelector('link[href$="/assets/book-guide.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://honeycombpublications.com/assets/book-guide.css';
    document.head.appendChild(link);
  }

  const guide = document.createElement('section');
  guide.className = 'book-guide';
  guide.setAttribute('role', 'dialog');
  guide.setAttribute('aria-modal', 'true');
  guide.setAttribute('aria-label', `Cartoon presenter introduction to ${title}`);
  guide.innerHTML = `
    <div class="book-guide-stage">
      <p class="book-guide-label">The Honeycomb Book Guide</p>
      <div class="cartoon-presenter" aria-hidden="true">
        <div class="cartoon-arm left"></div>
        <div class="cartoon-arm right"></div>
        <div class="cartoon-neck"></div>
        <div class="cartoon-body">
          <span class="cartoon-lapel left"></span>
          <span class="cartoon-lapel right"></span>
          <span class="cartoon-badge">⬡</span>
        </div>
        <div class="cartoon-head">
          <span class="cartoon-hair"></span>
          <span class="cartoon-ear left"></span>
          <span class="cartoon-ear right"></span>
          <span class="cartoon-brow left"></span>
          <span class="cartoon-brow right"></span>
          <span class="cartoon-eye left"></span>
          <span class="cartoon-eye right"></span>
          <span class="cartoon-nose"></span>
          <span class="cartoon-moustache"></span>
          <span class="cartoon-mouth"></span>
        </div>
      </div>
      <h2 class="book-guide-title">${title}</h2>
      <p class="book-guide-pitch">${pitch}</p>
      <div class="book-guide-actions">
        <button class="book-guide-button" type="button" data-guide-speak>Hear the pitch</button>
        <button class="book-guide-button secondary" type="button" data-guide-close>Enter the book page</button>
      </div>
      <p class="book-guide-status">The presenter appears whether you arrived by voice or by hand. Sound begins only when you choose it.</p>
    </div>`;

  body.appendChild(guide);
  body.classList.add('book-guide-open');

  const speakButton = guide.querySelector('[data-guide-speak]');
  const closeButton = guide.querySelector('[data-guide-close]');
  const status = guide.querySelector('.book-guide-status');

  function availableVoices() {
    return window.speechSynthesis?.getVoices?.() || [];
  }

  function masculineVoice() {
    const voices = availableVoices();
    const knownMale = /daniel|george|ryan|arthur|oliver|david|mark|james|guy|male|thomas|edward|brian|matthew|christopher/i;
    const knownFemale = /susan|hazel|sonia|samantha|victoria|karen|zira|female|moira|fiona|serena|kate/i;

    return voices.find(v => /en-GB/i.test(v.lang) && knownMale.test(v.name))
      || voices.find(v => /^en/i.test(v.lang) && knownMale.test(v.name))
      || voices.find(v => /en-GB/i.test(v.lang) && !knownFemale.test(v.name))
      || null;
  }

  function generalVoice() {
    const voices = availableVoices();
    return masculineVoice()
      || voices.find(v => /en-GB/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang))
      || null;
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    guide.classList.remove('is-speaking');
    speakButton.disabled = false;
    speakButton.textContent = 'Hear again';
  }

  function speakPitch() {
    if (!('speechSynthesis' in window)) {
      status.textContent = 'Spoken narration is unavailable in this browser. The complete pitch is shown on screen.';
      return;
    }

    const voice = isTorsades ? masculineVoice() : generalVoice();
    if (isTorsades && !voice) {
      status.textContent = 'A suitable male narrator is not installed in this browser. The pitch remains available on screen rather than using the wrong voice.';
      speakButton.textContent = 'Male voice unavailable';
      speakButton.disabled = true;
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pitch);
    utterance.lang = 'en-GB';
    utterance.rate = isTorsades ? 0.92 : 1.03;
    utterance.pitch = isTorsades ? 0.42 : 0.64;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;

    guide.classList.add('is-speaking');
    speakButton.disabled = true;
    speakButton.textContent = 'Speaking…';
    status.textContent = isTorsades
      ? 'A calm, deep male introduction to Torsades de Pointes.'
      : `A short cinematic introduction to ${title}.`;

    const finish = () => {
      guide.classList.remove('is-speaking');
      speakButton.disabled = false;
      speakButton.textContent = 'Hear again';
      status.textContent = 'The story is waiting below.';
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  }

  function closeGuide() {
    stopSpeaking();
    guide.classList.add('is-dismissed');
    body.classList.remove('book-guide-open');
    window.setTimeout(() => guide.remove(), 300);
  }

  window.speechSynthesis?.addEventListener?.('voiceschanged', () => {
    if (isTorsades && masculineVoice()) {
      speakButton.disabled = false;
      speakButton.textContent = 'Hear the pitch';
      status.textContent = 'Deep male narrator ready. Sound begins only when you choose it.';
    }
  });

  speakButton.addEventListener('click', speakPitch);
  closeButton.addEventListener('click', closeGuide);
  guide.addEventListener('click', event => {
    if (event.target === guide) closeGuide();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeGuide();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSpeaking();
  });
})();
