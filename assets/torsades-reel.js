(() => {
  'use strict';
  const stage=document.querySelector('[data-torsades-reel]');
  if(!stage)return;
  const scenes=[...stage.querySelectorAll('.tr-scene')];
  const captions=[...stage.querySelectorAll('.tr-caption')];
  const play=stage.querySelector('[data-tr-play]');
  const sound=stage.querySelector('[data-tr-sound]');
  const status=document.querySelector('[data-tr-status]');
  const lines=[
    'She ran into the cardiology ward, with Georgina close behind.',
    'There was nowhere left to run.',
    'On the monitor, sinus tachycardia. Then a premature beat fell on the T wave.',
    'R on T. The rhythm twisted. Torsades de pointes ventricular tachycardia.',
    'In a ward built to save lives, death can be engineered.',
    'Torsades de Pointes. The Pulse Breaker.'
  ];
  let timers=[];let narration=false;
  const clear=()=>{timers.forEach(clearTimeout);timers=[];};
  function show(i){scenes.forEach((e,n)=>e.classList.toggle('active',n===i));captions.forEach((e,n)=>e.classList.toggle('active',n===i));}
  function speak(){if(!narration||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lines.join(' '));u.lang='en-GB';u.rate=.88;u.pitch=.55;const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>/Daniel|George|Ryan|Arthur|Oliver|David|male/i.test(v.name)&&/en/i.test(v.lang))||vs.find(v=>/en-GB/i.test(v.lang))||null;speechSynthesis.speak(u);}
  function start(){clear();speechSynthesis?.cancel();stage.classList.remove('playing');void stage.offsetWidth;stage.classList.add('playing');show(0);lines.forEach((_,i)=>timers.push(setTimeout(()=>show(i),i*5000)));timers.push(setTimeout(()=>{stage.classList.remove('playing');status.textContent='Story pitch complete.';},30000));status.textContent=narration?'Playing with narration and captions.':'Playing with captions. Switch sound on for narration.';speak();}
  play.addEventListener('click',start);
  sound.addEventListener('click',()=>{narration=!narration;sound.textContent=narration?'Sound on':'Sound off';sound.setAttribute('aria-pressed',String(narration));status.textContent=narration?'Narration enabled. Press play or replay.':'Narration off. Captions remain visible.';if(!narration)speechSynthesis?.cancel();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();speechSynthesis?.cancel();}});
  show(0);
})();