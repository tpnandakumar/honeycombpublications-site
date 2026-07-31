(() => {
  'use strict';

  const scenes = [...document.querySelectorAll('.guardian')];
  const progress = [...document.querySelectorAll('.journey-progress span')];
  const beginButton = document.getElementById('beginJourney');
  const replayButton = document.getElementById('replayJourney');
  const chooseVoice = document.getElementById('chooseVoice');
  const chooseHand = document.getElementById('chooseHand');
  const stopListening = document.getElementById('stopListening');
  const manualChoices = document.getElementById('manualChoices');
  const interactionStatus = document.getElementById('interactionStatus');
  const catalogue = document.getElementById('catalogue');

  if (!scenes.length || !beginButton) return;

  const narration = [
    { text: 'I wait for my owner. Find it.', rate: 1.08, pitch: 0.72 },
    { text: 'I wait for my rider. Own it.', rate: 1.04, pitch: 0.66 },
    { text: 'I wait for my master. Love it.', rate: 0.98, pitch: 0.48 },
    { text: 'Your book waits for you. Find it. Own it. Love it. Live it. Master it.', rate: 1.02, pitch: 0.62 },
    { text: 'Life is a stone. Choices are your tools. Actions are your craft. Sculpt yourself. Be a masterpiece.', rate: 1.0, pitch: 0.58 }
  ];

  const recommendations = {
    'personal development': 'Father’s Mistakes, Son’s Wisdom may be waiting for you. It explores discipline, character, purpose and legacy.',
    fantasy: 'The Zolbrent Knot may be waiting for you. It is a literary fantasy journey built around a complete chess game.',
    romance: 'Flight of the Queen Bee may be waiting for you. It brings together warmth, humour, romance, bees and hidden danger.',
    'medical thriller': 'Torsades de Pointes: The Pulse Breaker may be waiting for you. It is a medical thriller built around danger, judgement and an NHS cardiac implant.',
    'all books': 'Every Honeycomb book offers a different journey. Explore the full catalogue and find the one that waits for you.'
  };

  let current = 0;
  let timer = null;
  let running = false;
  let recognition = null;
  let interactionMode = null;

  function masculineVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const preferredNames = /daniel|george|ryan|arthur|oliver|male|guy|david|mark|james/i;
    return voices.find(v => /en-GB/i.test(v.lang) && preferredNames.test(v.name))
      || voices.find(v => /^en/i.test(v.lang) && preferredNames.test(v.name))
      || voices.find(v => /en-GB/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang));
  }

  function showScene(index) {
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    progress.forEach((item, i) => item.classList.toggle('is-active', i === index));
    current = index;
  }

  function speakText(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 1.04;
    utterance.pitch = 0.64;
    utterance.volume = 1;
    const voice = masculineVoice();
    if (voice) utterance.voice = voice;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
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
    const voice = masculineVoice();
    if (voice) utterance.voice = voice;
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
    const displayTime = current === scenes.length - 1 ? 6500 : 4100;
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
    window.speechSynthesis?.cancel();
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

  function showRecommendation(interest) {
    const message = recommendations[interest] || recommendations['all books'];
    interactionStatus.textContent = message;
    if (interactionMode === 'voice') speakText(message);
    manualChoices.hidden = false;
    catalogue?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function parseInterest(transcript) {
    const words = transcript.toLowerCase();
    if (words.includes('personal') || words.includes('development') || words.includes('wisdom')) return 'personal development';
    if (words.includes('fantasy') || words.includes('dragon') || words.includes('zolbrent')) return 'fantasy';
    if (words.includes('romance') || words.includes('romantic') || words.includes('queen bee')) return 'romance';
    if (words.includes('medical') || words.includes('thriller') || words.includes('torsades') || words.includes('pulse')) return 'medical thriller';
    if (words.includes('all') || words.includes('everything') || words.includes('books')) return 'all books';
    return null;
  }

  function beginListening() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      interactionStatus.textContent = 'Voice recognition is not supported by this browser. Hand controls are ready instead.';
      chooseHandMode();
      return;
    }
    recognition = new Recognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => {
      interactionStatus.textContent = 'I am listening. Say personal development, fantasy, romance, medical thriller, or all books.';
      stopListening.hidden = false;
    };
    recognition.onresult = event => {
      const interest = parseInterest(event.results[0][0].transcript);
      if (interest) showRecommendation(interest);
      else {
        const retry = 'I did not recognise that choice. Please say personal development, fantasy, romance, medical thriller, or all books.';
        interactionStatus.textContent = retry;
        speakText(retry, () => recognition?.start());
      }
    };
    recognition.onerror = () => {
      interactionStatus.textContent = 'I could not hear clearly. You can try voice again or use the hand controls.';
      manualChoices.hidden = false;
      stopListening.hidden = true;
    };
    recognition.onend = () => { stopListening.hidden = true; };
    recognition.start();
  }

  function chooseVoiceMode() {
    interactionMode = 'voice';
    manualChoices.hidden = true;
    chooseVoice.setAttribute('aria-pressed', 'true');
    chooseHand.setAttribute('aria-pressed', 'false');
    const question = 'Voice interaction selected. What kind of book calls to you: personal development, fantasy, romance, medical thriller, or would you like to see them all?';
    interactionStatus.textContent = question;
    speakText(question, beginListening);
  }

  function chooseHandMode() {
    interactionMode = 'hand';
    recognition?.stop();
    window.speechSynthesis?.cancel();
    chooseVoice.setAttribute('aria-pressed', 'false');
    chooseHand.setAttribute('aria-pressed', 'true');
    manualChoices.hidden = false;
    stopListening.hidden = true;
    interactionStatus.textContent = 'Hand interaction selected. Choose the kind of book that calls to you.';
  }

  beginButton.addEventListener('click', startJourney);
  replayButton.addEventListener('click', replayJourney);
  chooseVoice?.addEventListener('click', chooseVoiceMode);
  chooseHand?.addEventListener('click', chooseHandMode);
  stopListening?.addEventListener('click', () => {
    recognition?.stop();
    interactionStatus.textContent = 'Listening stopped. You can choose voice again or continue by hand.';
    manualChoices.hidden = false;
  });
  document.querySelectorAll('[data-interest]').forEach(button => {
    button.addEventListener('click', () => showRecommendation(button.dataset.interest));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.speechSynthesis?.cancel();
      recognition?.stop();
    }
  });

  showScene(0);
})();