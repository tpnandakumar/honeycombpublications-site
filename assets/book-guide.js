(() => {
  'use strict';

  const body = document.body;
  const pitch = body.dataset.bookPitch;
  if (!pitch) return;

  const title = body.dataset.bookTitle || document.querySelector('h1')?.textContent?.trim() || 'this book';
  const accent = body.dataset.bookAccent || 'gold';
  const main = document.querySelector('main');
  if (!main) return;

  const guide = document.createElement('section');
  guide.className = `book-guide book-guide-${accent}`;
  guide.setAttribute('aria-label', `Honeycomb guide introduction to ${title}`);
  guide.innerHTML = `
    <div class="book-guide-inner">
      <div class="book-guide-avatar" aria-hidden="true">⬡</div>
      <div class="book-guide-copy">
        <p class="book-guide-label">The Honeycomb Book Guide</p>
        <p class="book-guide-pitch">${pitch}</p>
      </div>
      <div class="book-guide-actions">
        <button class="book-guide-button" type="button" data-guide-speak>Hear the pitch</button>
        <button class="book-guide-button secondary" type="button" data-guide-close>Continue silently</button>
      </div>
    </div>
    <p class="book-guide-status">The guide appears whether you arrived by voice or by hand. Sound begins only when you choose it.</p>`;

  main.insertAdjacentElement('afterbegin', guide);

  const speakButton = guide.querySelector('[data-guide-speak]');
  const closeButton = guide.querySelector('[data-guide-close]');
  const status = guide.querySelector('.book-guide-status');

  function preferredVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const masculine = /daniel|george|ryan|arthur|oliver|david|mark|james|male|guy/i;
    return voices.find(v => /en-GB/i.test(v.lang) && masculine.test(v.name))
      || voices.find(v => /^en/i.test(v.lang) && masculine.test(v.name))
      || voices.find(v => /en-GB/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang));
  }

  function speakPitch() {
    if (!('speechSynthesis' in window)) {
      status.textContent = 'Spoken narration is unavailable in this browser. The complete pitch is shown above.';
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pitch);
    utterance.lang = 'en-GB';
    utterance.rate = 1.02;
    utterance.pitch = 0.62;
    utterance.volume = 1;
    const voice = preferredVoice();
    if (voice) utterance.voice = voice;

    speakButton.disabled = true;
    speakButton.textContent = 'Speaking…';
    status.textContent = `A short introduction to ${title}.`;

    const finish = () => {
      speakButton.disabled = false;
      speakButton.textContent = 'Hear again';
      status.textContent = 'Explore the story below, or hear the pitch again.';
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  }

  speakButton.addEventListener('click', speakPitch);
  closeButton.addEventListener('click', () => {
    window.speechSynthesis?.cancel();
    guide.classList.add('is-dismissed');
    window.setTimeout(() => guide.remove(), 240);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.speechSynthesis?.cancel();
  });
})();
