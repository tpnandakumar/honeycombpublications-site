(() => {
  'use strict';
  const shell = document.querySelector('[data-queen-bee-reel]');
  if (!shell) return;

  const scenes = [...shell.querySelectorAll('.reel-scene')];
  const captions = [...shell.querySelectorAll('.reel-caption')];
  const play = shell.querySelector('[data-reel-play]');
  const sound = shell.querySelector('[data-reel-sound]');
  const status = document.querySelector('[data-reel-status]');
  const lines = [
    'In a quiet Somerset village, Dr Newman Stone understands bees better than people.',
    'Then Cleo Marsh arrives, carrying charm, secrets and a past she cannot outrun.',
    'A child begins matchmaking. The village begins gossiping. Newman begins falling.',
    'But a patient man in a good coat is getting closer.',
    'When danger reaches the hives, sixty thousand wings rise into the air.',
    'Sometimes the fiercest protector is the one no one sees coming. Flight of the Queen Bee.'
  ];
  let timers = [];
  let speaking = false;

  function clearTimers(){timers.forEach(clearTimeout);timers=[];}
  function show(index){
    scenes.forEach((el,i)=>el.classList.toggle('is-active',i===index));
    captions.forEach((el,i)=>el.classList.toggle('is-active',i===index));
  }
  function narrate(){
    if (!speaking || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lines.join(' '));
    utterance.lang='en-GB'; utterance.rate=.92; utterance.pitch=.9; utterance.volume=1;
    const voices=window.speechSynthesis.getVoices();
    utterance.voice=voices.find(v=>/en-GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;
    window.speechSynthesis.speak(utterance);
  }
  function start(){
    clearTimers();
    window.speechSynthesis?.cancel();
    shell.classList.remove('is-playing');
    void shell.offsetWidth;
    shell.classList.add('is-playing');
    show(0);
    lines.forEach((_,i)=>timers.push(setTimeout(()=>show(i),i*5000)));
    timers.push(setTimeout(()=>{shell.classList.remove('is-playing');play.textContent='Replay reel';status.textContent='Story pitch complete. Replay it whenever you like.';},30000));
    play.textContent='Replay reel';
    status.textContent=speaking?'Playing with narration and captions.':'Playing with captions. Tap Sound on for narration.';
    narrate();
  }
  play.addEventListener('click',start);
  sound.addEventListener('click',()=>{
    speaking=!speaking;
    sound.textContent=speaking?'Sound on':'Sound off';
    sound.setAttribute('aria-pressed',String(speaking));
    status.textContent=speaking?'Narration enabled. Press replay to hear the full pitch.':'Narration off. Captions remain visible.';
    if(!speaking) window.speechSynthesis?.cancel();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimers();window.speechSynthesis?.cancel();}});
  show(0);
})();