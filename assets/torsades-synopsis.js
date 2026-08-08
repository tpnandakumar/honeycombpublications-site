(() => {
  'use strict';
  const synopsis = `
    <div class="hc-long-synopsis">
      <p>What begins as an ambitious NHS cardiac programme appears to offer exactly what modern medicine promises: earlier intervention, continuous monitoring and a device capable of protecting vulnerable patients before a dangerous rhythm becomes fatal.</p>
      <p>But a registrar reviewing apparently unrelated deaths notices something the reassuring reports do not explain. The same implanted technology that watches the heart can also influence it. Behind the clinical language sits a hidden scoring system that weighs the cost of keeping a patient alive against an algorithmic judgement of benefit, burden and social worth.</p>
      <p>When a patient crosses that invisible threshold, the implant does not simply stop protecting them. It can create the event that kills them, producing an R-on-T sequence and torsades de pointes that appears to be a natural cardiac catastrophe. The medical record supplies the explanation. The device supplies the alibi.</p>
      <p>As the registrar follows the pattern from individual deaths towards the architecture behind the programme, the question becomes larger than who designed it. The real danger is a system that has converted stewardship into judgement and probability into permission. To expose it, the registrar must prove that deaths accepted as clinical misfortune were decisions, before the same logic is allowed to decide who should live next.</p>
    </div>`;

  function replaceSynopsis() {
    if (!/\/books\/torsades-de-pointes-the-pulse-breaker\/?$/.test(location.pathname)) return;
    const tab = [...document.querySelectorAll('[role="tab"]')].find(el => el.textContent.trim().toLowerCase() === 'synopsis');
    if (!tab) return;
    const id = tab.getAttribute('aria-controls');
    const panel = id && document.getElementById(id);
    if (panel) panel.innerHTML = synopsis;
  }

  window.addEventListener('DOMContentLoaded', () => setTimeout(replaceSynopsis, 0));
})();
