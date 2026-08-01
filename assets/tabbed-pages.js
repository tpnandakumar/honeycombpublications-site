(() => {
  'use strict';

  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"]')];

    function activate(button, focus = true) {
      const target = button.getAttribute('aria-controls');
      buttons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      panels.forEach(panel => panel.classList.toggle('active', panel.id === target));
      if (focus) button.focus({ preventScroll: true });
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button, false));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();

        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;

        activate(buttons[next]);
      });
    });

    const requested = location.hash.slice(1);
    const initial = buttons.find(button => button.getAttribute('aria-controls') === requested) || buttons[0];
    if (initial) activate(initial, false);

    if (location.hash) {
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    }

    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  });
})();
