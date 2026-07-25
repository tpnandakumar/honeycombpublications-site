(() => {
  'use strict';

  const scenes = [...document.querySelectorAll('.guardian')];
  const progress = [...document.querySelectorAll('.journey-progress span')];
  const beginButton = document.getElementById('beginJourney');
  const replayButton = document.getElementById('replayJourney');

  if (!scenes.length || !beginButton) return;

  const narration = [
    { text: 'I wait for my owner. Find it.', rate: 0.82, pitch: 1.08 },
    { text: 'I wait for my rider. Own it.', rate: 0.78, pitch: 0.92 },
    { text: 'I wait for my master. Love it.', rate: 0.68, pitch: 0.58 },
    { text: 'Your book waits for you. Find it. Own it. Love it. Live it. Master it.', rate: 0.78, pitch: 0.96 },
    { text: 'Life is a stone. Choices are your tools. Actions are your craft. Sculpt yourself. Be a masterpiece.', rate: 0.76, pitch: 0.9 }
  ];

  let current = 0;
  let timer = null;
  let running = false;

  function showScene(index) {
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    progress.forEach((item, i) => item.classList.toggle('is-active', i === index));
    current = index;
  }

  function speak(sceneIndex) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const line = narration[sceneIndex];
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = 'en-GB';
    utterance.rate = line.rate;
    utterance.pitch = line.pitch;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  function finishJourney() {
    running = false;
    beginButton.hidden = true;
    replayButton.hidden = false;
  }

  function advance() {
    if (!running) return;
    showScene(current);
    speak(current);

    const displayTime = current === scenes.length - 1 ? 8000 : 5200;
    timer = window.setTimeout(() => {
      if (current < scenes.length - 1) {
        current += 1;
        advance();
      } else {
        finishJourney();
      }
    }, displayTime);
  }

  function startJourney() {
    if (timer) window.clearTimeout(timer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    current = 0;
    running = true;
    beginButton.textContent = 'Journey playing';
    beginButton.disabled = true;
    replayButton.hidden = true;
    advance();
  }

  function replayJourney() {
    beginButton.hidden = false;
    beginButton.disabled = false;
    beginButton.textContent = 'Begin the journey';
    startJourney();
  }

  beginButton.addEventListener('click', startJourney);
  replayButton.addEventListener('click', replayJourney);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  });

  showScene(0);
})();
