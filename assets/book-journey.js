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

  if (!scenes.length || !beginButton) return;

  const narration = [
    { text: "I've been waiting for you. Find it.", rate: 1.03, pitch: 0.74 },
    { text: "I've been waiting for my rider. Own it.", rate: 1.0, pitch: 0.66 },
    { text: 'I have waited for my master. Love it.', rate: 0.92, pitch: 0.42 },
    { text: 'Your book waits for you. Find it. Own it. Love it. Live it. Master it.', rate: 1.0, pitch: 0.62 },
    { text: 'Life is a stone. Choices are your tools. Actions are your craft. Sculpt yourself. Be a masterpiece.', rate: 0.98, pitch: 0.58 }
  ];

  const books = {
    'personal development': {
      title: 'Father’s Mistakes, Son’s Wisdom',
      url: 'https://honeycombpublications.com/books/fathers-mistakes-sons-wisdom/'
    },
    fantasy: {
      title: 'The Zolbrent Knot: Knight to F3',
      url: 'https://honeycombpublications.com/books/the-zolbrent-knot-knight-to-f3/'
    },
    romance: {
      title: 'Flight of the Queen Bee',
      url: 'https://honeycombpublications.com/books/flight-of-the-queen-bee/'
    },
    'medical thriller': {
      title: 'Torsades de Pointes: The Pulse Breaker',
      url: 'https://honeycombpublications.com/books/torsades-de-pointes-the-pulse-breaker/'
    },
    'all books': {
      title: 'the complete Honeycomb catalogue',
      url: 'https://honeycombpublications.com/books/'
    }
  };

  let current = 0;
  let running = false;
  let recognition = null;
  let interactionMode = null;
  let fallbackTimer = null;

  function preferredVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const masculine = /daniel|george|ryan|arthur|oliver|david|mark|james|male|guy/i;
    return voices.find(v => /en-GB/i.test(v.lang) && masculine.test(v.name))
      || voices.find(v => /^en/i.test(v.lang) && masculine.test(v.name))
      || voices.find(v => /en-GB/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang));
  }

  function showScene(index) {
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    progress.forEach((item, i) => item.classList.toggle('is-active', i === index));
    current = index;
  }

  function speakLine(line, onEnd) {
    if (!('speechSynthesis' in window)) {
      window.setTimeout(onEnd, 2500);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = 'en-GB';
    utterance.rate = line.rate;
    utterance.pitch = line.pitch;
    utterance.volume = 1;

    const voice = preferredVoice();
    if (voice) utterance.voice = voice;

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      window.setTimeout(onEnd, 750);
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    fallbackTimer = window.setTimeout(finish, Math.max(3500, line.text.length * 95));
    window.speechSynthesis.speak(utterance);
  }

  function finishJourney() {
    running = false;
    beginButton.hidden = true;
    beginButton.disabled = false;
    replayButton.hidden = false;
  }

  function playCurrentScene() {
    if (!running) return;
    showScene(current);
    speakLine(narration[current], () => {
      if (!running) return;
      if (current < scenes.length - 1) {
        current += 1;
        playCurrentScene();
      } else {
        finishJourney();
      }
    });
  }

  function startJourney() {
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    window.speechSynthesis?.cancel();
    current = 0;
    running = true;
    beginButton.textContent = 'Journey playing';
    beginButton.disabled = true;
    replayButton.hidden = true;
    playCurrentScene();
  }

  function replayJourney() {
    beginButton.hidden = false;
    beginButton.textContent = 'Begin the journey';
    startJourney();
  }

  function parseInterest(transcript) {
    const words = transcript.toLowerCase();
    if (words.includes('father') || words.includes('wisdom') || words.includes('personal') || words.includes('development')) return 'personal development';
    if (words.includes('zolbrent') || words.includes('fantasy') || words.includes('dragon') || words.includes('chess')) return 'fantasy';
    if (words.includes('queen bee') || words.includes('romance') || words.includes('romantic')) return 'romance';
    if (words.includes('torsades') || words.includes('pulse') || words.includes('medical') || words.includes('thriller')) return 'medical thriller';
    if (words.includes('all') || words.includes('everything') || words.includes('catalogue') || words.includes('books')) return 'all books';
    return null;
  }

  function speakPrompt(text, onEnd) {
    speakLine({ text, rate: 1.02, pitch: 0.62 }, onEnd || (() => {}));
  }

  function openBook(interest) {
    const book = books[interest] || books['all books'];
    const message = `${book.title} is waiting for you. Opening it now.`;
    interactionStatus.textContent = message;
    manualChoices.hidden = false;

    if (interactionMode === 'voice') {
      speakPrompt(message, () => window.location.assign(book.url));
    } else {
      window.location.assign(book.url);
    }
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
      interactionStatus.textContent = 'I am listening. Say the title or genre you want.';
      stopListening.hidden = false;
    };

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      const interest = parseInterest(transcript);
      if (interest) {
        recognition.stop();
        openBook(interest);
      } else {
        const retry = 'I did not recognise that choice. Say Father’s Mistakes, Zolbrent, Queen Bee, Torsades, or all books.';
        interactionStatus.textContent = retry;
        speakPrompt(retry, () => recognition?.start());
      }
    };

    recognition.onerror = () => {
      interactionStatus.textContent = 'I could not hear clearly. Try again or use the hand controls.';
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
    const question = 'Voice selected. Which book calls to you? Say Father’s Mistakes, Zolbrent, Queen Bee, Torsades, or all books.';
    interactionStatus.textContent = question;
    speakPrompt(question, beginListening);
  }

  function chooseHandMode() {
    interactionMode = 'hand';
    recognition?.stop();
    window.speechSynthesis?.cancel();
    chooseVoice.setAttribute('aria-pressed', 'false');
    chooseHand.setAttribute('aria-pressed', 'true');
    manualChoices.hidden = false;
    stopListening.hidden = true;
    interactionStatus.textContent = 'Hand interaction selected. Choose the book that calls to you.';
  }

  beginButton.addEventListener('click', startJourney);
  replayButton.addEventListener('click', replayJourney);
  chooseVoice?.addEventListener('click', chooseVoiceMode);
  chooseHand?.addEventListener('click', chooseHandMode);
  stopListening?.addEventListener('click', () => {
    recognition?.stop();
    interactionStatus.textContent = 'Listening stopped. Choose voice again or continue by hand.';
    manualChoices.hidden = false;
  });

  document.querySelectorAll('[data-interest]').forEach(button => {
    button.addEventListener('click', () => openBook(button.dataset.interest));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      window.speechSynthesis?.cancel();
      recognition?.stop();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    }
  });

  showScene(0);
})();