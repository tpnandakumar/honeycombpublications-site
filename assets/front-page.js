(() => {
  'use strict';
  const gate=document.querySelector('[data-front-gate]');
  const shell=document.querySelector('[data-site-shell]');
  const enter=document.querySelector('[data-enter-site]');
  const replay=document.querySelector('[data-replay-reel]');
  const reel=document.querySelector('[data-front-reel]');
  if(!gate||!shell||!enter||!reel)return;

  function openSite(){
    reel.pause();
    gate.classList.add('fade-out');
    window.setTimeout(()=>{
      gate.hidden=true;
      shell.hidden=false;
      window.scrollTo({top:0,behavior:'instant'});
    },350);
  }

  function replayReel(){
    reel.currentTime=0;
    reel.muted=true;
    reel.play().catch(()=>{});
    enter.classList.remove('is-ready');
  }

  reel.addEventListener('ended',()=>enter.classList.add('is-ready'));
  reel.addEventListener('play',()=>enter.classList.remove('is-ready'));
  enter.addEventListener('click',openSite);
  replay?.addEventListener('click',replayReel);
  document.addEventListener('keydown',event=>{
    if(!gate.hidden&&event.key==='Enter')openSite();
  });

  reel.play().catch(()=>{});
})();