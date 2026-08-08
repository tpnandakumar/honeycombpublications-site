(() => {
  'use strict';

  const marketplaces = [
    ['GB','United Kingdom','amazon.co.uk'],['US','United States','amazon.com'],['DE','Germany','amazon.de'],
    ['FR','France','amazon.fr'],['ES','Spain','amazon.es'],['IT','Italy','amazon.it'],['NL','Netherlands','amazon.nl'],
    ['SE','Sweden','amazon.se'],['PL','Poland','amazon.pl'],['CA','Canada','amazon.ca'],['AU','Australia','amazon.com.au'],
    ['JP','Japan','amazon.co.jp'],['BR','Brazil','amazon.com.br'],['MX','Mexico','amazon.com.mx'],['IN','India','amazon.in'],
    ['BE','Belgium','amazon.com.be'],['SG','Singapore','amazon.sg'],['AE','United Arab Emirates','amazon.ae'],
    ['SA','Saudi Arabia','amazon.sa'],['TR','Türkiye','amazon.com.tr']
  ];

  const cleanTitle = () => document.title.split('|')[0].replace(/ by Dr N T Pisharam/i,'').replace(/— Dr N T Pisharam/i,'').trim();
  const buyUrl = (domain, format) => `https://www.${domain}/s?k=${encodeURIComponent(`${cleanTitle()} Dr N T Pisharam ${format}`)}`;

  function storeGrid() {
    const wrap = document.createElement('div');
    wrap.className = 'hc-store-grid';
    marketplaces.forEach(([,name,domain]) => {
      const card = document.createElement('div');
      card.className = 'hc-store-card';
      const title = document.createElement('strong');
      title.textContent = name;
      const links = document.createElement('div');
      links.className = 'hc-store-formats';
      const kindle = document.createElement('a');
      kindle.href = buyUrl(domain,'Kindle'); kindle.target = '_blank'; kindle.rel = 'nofollow sponsored noopener noreferrer'; kindle.textContent = 'Kindle';
      const dot = document.createElement('span'); dot.textContent = '·';
      const paperback = document.createElement('a');
      paperback.href = buyUrl(domain,'Paperback'); paperback.target = '_blank'; paperback.rel = 'nofollow sponsored noopener noreferrer'; paperback.textContent = 'Paperback';
      links.append(kindle,dot,paperback); card.append(title,links); wrap.append(card);
    });
    return wrap;
  }

  function buyPanelContent() {
    const box = document.createElement('div');
    box.className = 'hc-buy-panel';
    const intro = document.createElement('p');
    intro.className = 'hc-buy-intro';
    intro.textContent = 'Choose your Amazon store. Kindle and paperback links open in the selected country marketplace, where Amazon shows the current local price, tax, delivery and availability.';
    box.append(intro,storeGrid());
    return box;
  }

  function addCustomBuyTab() {
    if (document.getElementById('where-to-buy')) return;
    const tabBar = document.querySelector('.tabs');
    const panelHost = document.querySelector('.panel');
    const firstTab = tabBar?.querySelector('.tab');
    const firstPane = panelHost?.querySelector('.pane');
    if (!tabBar || !panelHost || !firstTab || !firstPane) return;

    const tab = document.createElement('button');
    tab.className = firstTab.className.replace(/\bactive\b/g,'').trim() || 'tab';
    tab.textContent = 'Where to buy';

    const pane = document.createElement(firstPane.tagName.toLowerCase());
    pane.className = firstPane.className.replace(/\b(show|active)\b/g,'').trim() || 'pane';
    pane.id = 'where-to-buy';
    pane.append(buyPanelContent());

    if (firstTab.hasAttribute('data-pane')) tab.dataset.pane = 'where-to-buy';
    else if (firstTab.hasAttribute('data-p')) tab.dataset.p = 'where-to-buy';

    tab.addEventListener('click', () => {
      tabBar.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      panelHost.querySelectorAll('.pane').forEach(x => x.classList.remove('show','active'));
      tab.classList.add('active');
      pane.classList.add('show');
    });

    tabBar.append(tab); panelHost.append(pane);
  }

  function addAriaBuyTab() {
    if (document.getElementById('where-to-buy')) return;
    const group = document.querySelector('[data-tabs]');
    const tabBar = group?.querySelector('[role="tablist"]');
    const firstTab = tabBar?.querySelector('[role="tab"]');
    const firstPane = group?.querySelector('[role="tabpanel"]');
    if (!group || !tabBar || !firstTab || !firstPane) return;

    const tab = document.createElement('button');
    tab.className = firstTab.className;
    tab.setAttribute('role','tab'); tab.setAttribute('aria-selected','false'); tab.setAttribute('aria-controls','where-to-buy');
    tab.textContent = 'Where to buy';

    const pane = document.createElement(firstPane.tagName.toLowerCase());
    pane.className = firstPane.className.replace(/\bactive\b/g,'').trim();
    pane.id = 'where-to-buy'; pane.setAttribute('role','tabpanel'); pane.append(buyPanelContent());
    tabBar.append(tab); firstPane.parentElement.append(pane);
  }

  if (/\/books\/[^/]+\/?$/.test(location.pathname)) {
    addAriaBuyTab();
    addCustomBuyTab();
    document.querySelectorAll('a[href*="amazon."]').forEach(link => {
      if (!link.closest('#where-to-buy')) link.style.display = 'none';
    });
  }

  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"]')];
    function activate(button, focus = true) {
      const target = button.getAttribute('aria-controls');
      buttons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      panels.forEach(panel => panel.classList.toggle('active', panel.id === target));
      if (focus) button.focus({preventScroll:true});
    }
    buttons.forEach((button,index) => {
      button.addEventListener('click',()=>activate(button,false));
      button.addEventListener('keydown',event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        let next=index;
        if(event.key==='ArrowRight') next=(index+1)%buttons.length;
        if(event.key==='ArrowLeft') next=(index-1+buttons.length)%buttons.length;
        if(event.key==='Home') next=0;
        if(event.key==='End') next=buttons.length-1;
        activate(buttons[next]);
      });
    });
    const requested=location.hash.slice(1);
    const initial=buttons.find(button=>button.getAttribute('aria-controls')===requested)||buttons[0];
    if(initial) activate(initial,false);
  });

  const style=document.createElement('style');
  style.textContent=`
    .hc-buy-panel{height:100%;overflow:auto;padding:2px 2px 5px}
    .hc-buy-intro{margin:0 0 10px;font-size:.82rem;line-height:1.35;opacity:.8}
    .hc-store-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
    .hc-store-card{border:1px solid currentColor;border-color:color-mix(in srgb,currentColor 24%,transparent);border-radius:9px;padding:8px 10px;background:rgba(0,0,0,.08);min-width:0}
    .hc-store-card strong{display:block;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .hc-store-formats{display:flex;align-items:center;gap:6px;margin-top:2px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.5px;opacity:.8}
    .hc-store-formats a{color:inherit;text-decoration:none;border-bottom:1px solid transparent}
    .hc-store-formats a:hover,.hc-store-formats a:focus-visible{border-bottom-color:currentColor;outline:none}
    @media(max-width:1000px){.hc-store-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:700px){.hc-store-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hc-store-card{padding:7px 8px}.hc-store-card strong{font-size:10px}.hc-store-formats{font-size:9px}}
  `;
  document.head.append(style);
})();
