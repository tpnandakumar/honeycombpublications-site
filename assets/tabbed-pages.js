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

  const marketplaces = {
    GB: { domain: 'amazon.co.uk', currency: 'GBP', store: 'UK' },
    US: { domain: 'amazon.com', currency: 'USD', store: 'US' },
    CA: { domain: 'amazon.ca', currency: 'CAD', store: 'Canada' },
    AU: { domain: 'amazon.com.au', currency: 'AUD', store: 'Australia' },
    IN: { domain: 'amazon.in', currency: 'INR', store: 'India' },
    DE: { domain: 'amazon.de', currency: 'EUR', store: 'Germany' },
    FR: { domain: 'amazon.fr', currency: 'EUR', store: 'France' },
    IT: { domain: 'amazon.it', currency: 'EUR', store: 'Italy' },
    ES: { domain: 'amazon.es', currency: 'EUR', store: 'Spain' },
    NL: { domain: 'amazon.nl', currency: 'EUR', store: 'Netherlands' },
    BE: { domain: 'amazon.com.be', currency: 'EUR', store: 'Belgium' },
    SE: { domain: 'amazon.se', currency: 'SEK', store: 'Sweden' },
    PL: { domain: 'amazon.pl', currency: 'PLN', store: 'Poland' },
    JP: { domain: 'amazon.co.jp', currency: 'JPY', store: 'Japan' },
    BR: { domain: 'amazon.com.br', currency: 'BRL', store: 'Brazil' },
    MX: { domain: 'amazon.com.mx', currency: 'MXN', store: 'Mexico' },
    SG: { domain: 'amazon.sg', currency: 'SGD', store: 'Singapore' },
    AE: { domain: 'amazon.ae', currency: 'AED', store: 'UAE' },
    SA: { domain: 'amazon.sa', currency: 'SAR', store: 'Saudi Arabia' },
    TR: { domain: 'amazon.com.tr', currency: 'TRY', store: 'Türkiye' }
  };

  const languageDefaults = {
    en: 'GB', de: 'DE', fr: 'FR', it: 'IT', es: 'ES', nl: 'NL', sv: 'SE',
    pl: 'PL', ja: 'JP', pt: 'BR', hi: 'IN', tr: 'TR', ar: 'AE'
  };

  function browserCountry() {
    const saved = localStorage.getItem('honeycomb-amazon-country');
    if (saved && marketplaces[saved]) return saved;

    const locales = navigator.languages?.length ? navigator.languages : [navigator.language || 'en-GB'];
    for (const locale of locales) {
      try {
        const parsed = new Intl.Locale(locale).maximize();
        if (parsed.region && marketplaces[parsed.region]) return parsed.region;
      } catch (_) {
        const match = String(locale).match(/[-_]([A-Za-z]{2})\b/);
        if (match && marketplaces[match[1].toUpperCase()]) return match[1].toUpperCase();
      }
    }

    const language = String(locales[0] || 'en').split(/[-_]/)[0].toLowerCase();
    return languageDefaults[language] || 'GB';
  }

  function cleanTitle() {
    return document.title.split('|')[0].replace(/ by Dr N T Pisharam/i, '').trim();
  }

  function searchUrl(market, query) {
    return `https://www.${market.domain}/s?k=${encodeURIComponent(query)}`;
  }

  function formatFromLink(link) {
    const text = link.textContent.toLowerCase();
    if (text.includes('kindle') || text.includes('ebook') || text.includes('read it')) return 'Kindle';
    if (text.includes('paperback')) return 'Paperback';
    return 'Book';
  }

  function identifierFromLink(link) {
    const match = link.href.match(/\/dp\/([A-Z0-9]+)/i);
    return match ? match[1] : '';
  }

  function ensureTorsadesLinks() {
    if (!document.body.classList.contains('pulse-page')) return;
    const panel = document.getElementById('pulse-release');
    if (!panel || panel.querySelector('a[href*="amazon."]')) return;

    const actions = document.createElement('p');
    actions.className = 'local-amazon-actions';
    actions.innerHTML = '<a href="#" data-amazon-format="Kindle" data-amazon-query="Torsades de Pointes The Pulse Breaker Kindle">Kindle: view local price</a><a href="#" data-amazon-format="Paperback" data-amazon-query="9781739770945">Paperback: view local price</a>';
    panel.append(actions);

    [...panel.querySelectorAll('p')].forEach(paragraph => {
      if (paragraph !== actions && /Kindle\s*£|Paperback\s*£/i.test(paragraph.textContent)) paragraph.remove();
    });
  }

  function localiseAmazon(country) {
    const market = marketplaces[country] || marketplaces.GB;
    const pageTitle = cleanTitle();
    const links = [...document.querySelectorAll('a[href*="amazon."], a[data-amazon-query]')];

    links.forEach(link => {
      const format = link.dataset.amazonFormat || formatFromLink(link);
      const identifier = link.dataset.amazonQuery || identifierFromLink(link);
      const query = identifier || `${pageTitle} ${format}`;
      link.href = searchUrl(market, query);
      link.target = '_blank';
      link.rel = 'nofollow sponsored noopener noreferrer';
      link.textContent = `${format}: view current ${market.currency} price on Amazon ${market.store}`;
      link.removeAttribute('data-amazon-query');
    });

    let tools = document.querySelector('.local-amazon-tools');
    if (!tools && links.length) {
      tools = document.createElement('div');
      tools.className = 'local-amazon-tools';
      tools.innerHTML = '<label>Amazon country <select aria-label="Choose Amazon country"></select></label><small>Amazon shows the current local price, tax, delivery and availability.</small>';
      const host = links[0].closest('[role="tabpanel"]') || links[0].parentElement;
      host.append(tools);
    }

    const select = tools?.querySelector('select');
    if (select && !select.options.length) {
      Object.entries(marketplaces).forEach(([code, item]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${item.store} · ${item.currency}`;
        select.append(option);
      });
      select.addEventListener('change', () => {
        localStorage.setItem('honeycomb-amazon-country', select.value);
        localiseAmazon(select.value);
      });
    }
    if (select) select.value = country;
  }

  const style = document.createElement('style');
  style.textContent = '.local-amazon-tools{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .75rem;margin-top:.7rem;font-size:.82rem}.local-amazon-tools label{display:flex;align-items:center;gap:.4rem;font-weight:600}.local-amazon-tools select{max-width:190px;padding:.35rem .5rem;border:1px solid currentColor;border-radius:6px;background:transparent;color:inherit;font:inherit}.local-amazon-tools small{opacity:.72}.local-amazon-actions{display:flex;flex-wrap:wrap;gap:.6rem}.local-amazon-actions a{display:inline-block;padding:.55rem .8rem;border:1px solid currentColor;border-radius:999px;text-decoration:none}';
  document.head.append(style);

  ensureTorsadesLinks();
  localiseAmazon(browserCountry());
})();
