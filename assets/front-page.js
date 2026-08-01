(() => {
  'use strict';
  const gate=document.querySelector('[data-front-gate]');
  const shell=document.querySelector('[data-site-shell]');
  const enter=document.querySelector('[data-enter-site]');
  if(!gate||!shell||!enter)return;
  function openSite(){
    gate.classList.add('fade-out');
    window.setTimeout(()=>{gate.hidden=true;shell.hidden=false;window.scrollTo({top:0,behavior:'instant'});},350);
  }
  enter.addEventListener('click',openSite);
  document.addEventListener('keydown',event=>{if(!gate.hidden&&event.key==='Enter')openSite();});
})();