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

  const books = {
    'fathers-mistakes-sons-wisdom': {
      title: "Father's Mistakes, Son's Wisdom",
      logline: `<p class="big">A father's honest reckoning becomes a son's inheritance of wisdom.<br>Experience is examined, refined and handed forward as character.</p>`,
      premise: `<p class="first">There are only learnings. Learnings become experience. Experience becomes wisdom. Wisdom becomes character.</p><p class="big">A collection of principles forged through reflection, observation and continual growth, exploring purpose, discipline, resilience, character and the pursuit of a meaningful life.</p>`,
      themes: `<p class="big">Purpose, discipline, resilience, character and meaning. Its philosophy resonates with the <span class="gold">Bhagavad Gita</span> and the writings of Marcus Aurelius, Seneca and other Stoic thinkers.</p>`,
      screen: `<p class="big">An intergenerational factual-drama proposition built around a father looking back, a son looking forward, and the moments in which mistakes become transferable wisdom.</p>`,
      synopsis: `<p>A reflective journey through the choices, errors and principles that shape a life. Rather than presenting fixed answers, the book asks the reader to examine the foundations beneath the life being built and to turn learning into experience, experience into wisdom, and wisdom into character.</p>`,
      details: `<p><b>Author:</b> Dr N T Pisharam</p><p><b>Paperback ISBN:</b> 978-1-7397709-1-4</p><p><b>Length:</b> 598 pages</p><p><b>Format:</b> 6×9 paperback</p>`,
      contact: `<p class="big">Publishing, educational, film and television enquiries.</p><p><a href="mailto:honeycombscreenrights@outlook.com">honeycombscreenrights@outlook.com</a></p>`
    },
    'be-and-become': {
      title: 'Be and Become',
      logline: `<p class="big">Eighteen real studies. Four days in the field.<br>A notebook that turns a curious child into a working observer.</p>`,
      premise: `<p class="big">This is not a book of theory to read and forget. It is an illustrated research workbook for young minds, designed for readers to <span class="gold">do</span>.</p>`,
      themes: `<p>Observation, curiosity, evidence, method, independence and mentorship. Eighteen illustrated studies introduce the working rhythm of <span class="gold">Introduction · Method · Results · Discussion</span>.</p>`,
      screen: `<p class="big">A warm family factual-entertainment series in waiting: one child, one garden, one hive and one night sky.</p><p>Field observation, mentorship and discovery give every episode a practical visual journey.</p>`,
      synopsis: `<p>Eighteen illustrated studies for readers aged ten and above, each a complete piece of real research written straight onto the page. Garden Day, Beekeeper Day, Night Sky Day and Special Events take observation beyond the desk and into the world.</p>`,
      details: `<p><b>Author:</b> Dr N T Pisharam</p><p><b>ISBN:</b> 978-1-7397709-2-1</p><p><b>Published:</b> 29 July 2026</p><p><b>Length:</b> 191 illustrated pages, 7×10 paperback</p><p><b>Readers:</b> Ages ten and above, parents, teachers and mentors</p>`,
      contact: `<p class="big">Educational, institutional, publishing and screen enquiries.</p><p><a href="mailto:honeycombscreenrights@outlook.com">honeycombscreenrights@outlook.com</a></p>`
    },
    'flight-of-the-queen-bee': {
      title: 'Flight of the Queen Bee',
      logline: `<p class="queen-big">She lands in the one place a person can vanish.<br>It is also the one place where nothing stays hidden.</p>`,
      premise: `<p class="queen-big">He keeps thirty thousand bees, and in thirty-eight years his hands have never once shaken.</p><p>She comes down in his yard one September morning, with no good reason anyone can get out of her, to the one place a person can vanish, not knowing it is also the one place nothing stays hidden.</p>`,
      themes: `<p class="queen-big">Love, concealment, village observation, resilience and the ordered life of the hive.</p><p class="queen-muted">Warm, witty, and quietly lethal.</p>`,
      screen: `<p class="queen-big">A visually distinctive romantic comedy-thriller with a living hive, a close-knit village and a newcomer whose arrival changes the balance of both.</p>`,
      synopsis: `<p>She arrives without an explanation and finds herself in a beekeeper's world where everyone notices more than they admit. By the time the village works out what has come among them, it will be far too late to look away.</p>`,
      details: `<dl><dt>Author</dt><dd>Dr N T Pisharam</dd><dt>Paperback ISBN</dt><dd>978-1-7397709-3-8</dd><dt>eBook ISBN</dt><dd>978-1-7397709-7-6</dd><dt>Publication date</dt><dd>6 August 2026</dd><dt>Print length</dt><dd>296 pages</dd></dl>`,
      contact: `<p class="queen-big">Film, television and publishing enquiries.</p><p><a href="mailto:honeycombscreenrights@outlook.com">honeycombscreenrights@outlook.com</a></p>`
    },
    'the-zolbrent-knot-knight-to-f3': {
      title: 'The Zolbrent Knot: Knight to F3',
      logline: `<p class="zolbrent-first">There is something invisible, and yet to the chosen one, entirely visible.<br>On a road that appears on no map, someone is about to find out what they are for.</p>`,
      premise: `<p class="zolbrent-first">There is something invisible, and yet, to the chosen one, entirely visible.</p><p>Some have felt it. Some know the one it watches. It has waited a long time. It is patient. It misses nothing.</p>`,
      themes: `<p class="zolbrent-big">Choice, destiny, observation, hidden structure and the making of legend.</p><p class="zolbrent-tagline">Legends are not born. They are sculpted by nature, forged by choice.</p>`,
      screen: `<p class="zolbrent-big">A mythic visual world structured through chess, hidden messages and an unseen presence that watches the chosen. Each chapter's move gives the adaptation a recurring cinematic grammar.</p>`,
      synopsis: `<p>A full-length illustrated mythic adventure and the opening move of the Zolbrent Knot series. Thirty-six chapters carry a sentence hidden in plain sight while a chess game runs beneath the story from first page to last.</p>`,
      details: `<dl><dt>Author</dt><dd>Dr N T Pisharam</dd><dt>Paperback ISBN</dt><dd>978-1-7397709-0-7</dd><dt>eBook ISBN</dt><dd>978-1-7397709-5-2</dd><dt>Publication date</dt><dd>5 August 2026</dd><dt>Length</dt><dd>294 pages, illustrated</dd></dl>`,
      contact: `<p class="zolbrent-big">Film, television and publishing enquiries.</p><p><a href="mailto:honeycombscreenrights@outlook.com">honeycombscreenrights@outlook.com</a></p>`
    },
    'torsades-de-pointes-the-pulse-breaker': {
      title: 'Torsades de Pointes: The Pulse Breaker',
      logline: `<p class="pulse-first">A cardiac implant is meant to save lives.<br>Someone has taught it to decide which lives are worth saving.</p>`,
      premise: `<p class="pulse-first">Some people are valuable. Some waste resources. Where do you draw the line, and who holds the pen?</p><p>A voluntary NHS cardiac implant conceals a programme that scores each patient on cost against worth. When the ledger judges a person too expensive to keep, the device induces a fatal arrhythmia that reads as natural.</p>`,
      themes: `<p class="pulse-big">The price a society puts on a human life. Medicine turned against the patient. Trust, stewardship, and the machinery of the state.</p>`,
      screen: `<p class="pulse-big">A hospital that looks entirely ordinary, where the only sign of a killing is a line on a monitor sliding into torsades. Sterile calm against rising dread; a chess motif surfacing across scenes; a villain who never raises his voice.</p>`,
      synopsis: `<p>A registrar begins to see the pattern the numbers were built to hide. A system designed to appear clinical and rational has crossed from stewardship into judgement, and the device inside the patient has become both executioner and alibi.</p>`,
      details: `<dl><dt>Author</dt><dd>Dr N T Pisharam</dd><dt>Paperback ISBN</dt><dd>978-1-7397709-4-5</dd><dt>eBook ISBN</dt><dd>978-1-7397709-6-9</dd><dt>Publication date</dt><dd>13 August 2026</dd><dt>Print length</dt><dd>414 pages</dd></dl>`,
      contact: `<p class="pulse-big">Film, television and publishing enquiries.</p><p><a href="mailto:honeycombscreenrights@outlook.com">honeycombscreenrights@outlook.com</a></p>`
    },
    'zero-intent-the-zwischenzug': {
      title: 'Zero Intent: The Zwischenzug',
      logline: `<p class="first">Some harms have no author.<br>That is what makes them unstoppable.</p>`,
      premise: `<p class="first">Some harms have no author. That is what makes them unstoppable.</p><p class="big">A neurologist runs a deep-brain-stimulation trial from a quiet hospital on the edge of the Cumbrian fells. One by one, in the small hours, her patients rise and walk, calm and empty-eyed, toward doors they should never open. <span class="gold">There is nothing to find. No fault, no intruder, no crime on paper at all.</span></p>`,
      themes: `<p class="big">A harm with no fingerprints. The machine that leaves no author. Mercy and message hidden beneath the noise. Trust, belief, and what happens to the one who stops watching and starts believing.</p>`,
      screen: `<p class="big">A hospital that looks entirely ordinary, where the only sign of what is happening is a waveform on a monitor and a patient walking into the dark. Sterile calm against rising dread; a chess motif surfacing across scenes; a hand that leaves no fingerprints.</p><p class="comps">For readers &amp; viewers of <b>Bodies</b>, <b>Utopia</b>, <b>Black Mirror</b>, <b>Line of Duty</b>.</p>`,
      synopsis: `<div class="synopsis"><p>A neurologist runs a deep-brain-stimulation trial from a quiet hospital on the edge of the Cumbrian fells. The implants are meant to ease the tremors of the incurable. For a while, they do.</p><p>Then, in the small hours, her patients begin to rise from their beds. Calm, unhurried, empty-eyed, they walk toward doors and edges they should never reach. There is no fault in the devices, no intruder on the wards, no crime on paper at all, only a waveform on a monitor that slips, for a moment, out of true.</p><p>The deeper she looks, the more she sees a pattern designed to look like chance: a hand moving between the moments, deciding who is worth the cost of care and who is not. <span class="gold">A harm with no author, spreading from one ward toward a whole country</span>, and to stop it she must prove that a thing with no fingerprints exists at all.</p></div>`,
      details: `<p><b>Author:</b> Dr N T Pisharam</p><p><b>ISBN:</b> 978-1-7397709-8-3</p><p><b>Genre:</b> Medical &amp; Political Thriller</p>`,
      contact: `<p class="big">Film, television and publishing enquiries.</p><p><a href="mailto:honeycombscreenrights@outlook.com">honeycombscreenrights@outlook.com</a></p>`
    }
  };

  const slug = location.pathname.match(/\/books\/([^/]+)/)?.[1];
  const book = books[slug];
  const cleanTitle = () => book?.title || document.title.split('|')[0].replace(/ by Dr N T Pisharam/i,'').replace(/— Dr N T Pisharam/i,'').trim();
  const buyUrl = (domain, format) => `https://www.${domain}/s?k=${encodeURIComponent(`${cleanTitle()} Dr N T Pisharam ${format}`)}`;

  function storeGrid() {
    const wrap = document.createElement('div'); wrap.className = 'hc-store-grid';
    marketplaces.forEach(([,name,domain]) => {
      const card = document.createElement('div'); card.className = 'hc-store-card';
      const title = document.createElement('strong'); title.textContent = name;
      const links = document.createElement('div'); links.className = 'hc-store-formats';
      const kindle = document.createElement('a'); kindle.href = buyUrl(domain,'Kindle'); kindle.target = '_blank'; kindle.rel = 'nofollow sponsored noopener noreferrer'; kindle.textContent = 'Kindle';
      const dot = document.createElement('span'); dot.textContent = '·';
      const paperback = document.createElement('a'); paperback.href = buyUrl(domain,'Paperback'); paperback.target = '_blank'; paperback.rel = 'nofollow sponsored noopener noreferrer'; paperback.textContent = 'Paperback';
      links.append(kindle,dot,paperback); card.append(title,links); wrap.append(card);
    });
    return wrap;
  }

  function buyPanel() {
    const box = document.createElement('div'); box.className = 'hc-buy-panel';
    const intro = document.createElement('p'); intro.className = 'hc-buy-intro';
    intro.textContent = 'Choose your Amazon store. Kindle and paperback links open in the selected country marketplace, where Amazon shows the current local price, tax, delivery and availability.';
    box.append(intro, storeGrid()); return box;
  }

  const defs = [
    ['logline','Logline'],['premise','Premise'],['themes','Themes'],['screen','On Screen'],
    ['synopsis','Synopsis'],['details','Details'],['buy','Where to Buy'],['contact','Contact']
  ];

  function contentNode(key) {
    const box = document.createElement('div');
    if (key === 'buy') box.append(buyPanel());
    else box.innerHTML = book?.[key] || '<p>Information coming soon.</p>';
    return box;
  }

  function standardiseCustom() {
    const tabBar = document.querySelector('.tabs');
    const panelHost = document.querySelector('.panel');
    const firstTab = tabBar?.querySelector('.tab');
    const firstPane = panelHost?.querySelector('.pane');
    if (!book || !tabBar || !panelHost || !firstTab || !firstPane) return false;
    const tabClass = firstTab.className.replace(/\bactive\b/g,'').trim() || 'tab';
    const paneClass = firstPane.className.replace(/\b(show|active)\b/g,'').trim() || 'pane';
    tabBar.replaceChildren(); panelHost.replaceChildren();
    defs.forEach(([key,label], index) => {
      const tab = document.createElement('button'); tab.className = `${tabClass}${index===0?' active':''}`; tab.textContent = label; tab.type='button';
      const pane = document.createElement(firstPane.tagName.toLowerCase()); pane.className = `${paneClass}${index===0?' show':''}`; pane.id = `hc-${key}`; pane.append(contentNode(key));
      tab.addEventListener('click', () => {
        tabBar.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
        panelHost.querySelectorAll('.pane').forEach(x=>x.classList.remove('show','active'));
        tab.classList.add('active'); pane.classList.add('show');
      });
      tabBar.append(tab); panelHost.append(pane);
    });
    return true;
  }

  function standardiseAria() {
    const group = document.querySelector('[data-tabs]');
    const tabBar = group?.querySelector('[role="tablist"]');
    const firstTab = tabBar?.querySelector('[role="tab"]');
    const firstPane = group?.querySelector('[role="tabpanel"]');
    const panelHost = firstPane?.parentElement;
    if (!book || !group || !tabBar || !firstTab || !firstPane || !panelHost) return false;
    const tabClass = firstTab.className;
    const paneClass = firstPane.className.replace(/\bactive\b/g,'').trim();
    tabBar.replaceChildren(); panelHost.replaceChildren();
    defs.forEach(([key,label], index) => {
      const id = `hc-${key}`;
      const tab = document.createElement('button'); tab.className = tabClass; tab.type='button'; tab.setAttribute('role','tab'); tab.setAttribute('aria-selected',String(index===0)); tab.setAttribute('aria-controls',id); tab.textContent = label;
      const pane = document.createElement(firstPane.tagName.toLowerCase()); pane.className = `${paneClass}${index===0?' active':''}`; pane.id=id; pane.setAttribute('role','tabpanel'); pane.append(contentNode(key));
      tab.addEventListener('click',()=>activate(tab));
      tabBar.append(tab); panelHost.append(pane);
    });
    const buttons=[...tabBar.querySelectorAll('[role="tab"]')], panels=[...panelHost.querySelectorAll('[role="tabpanel"]')];
    function activate(button){const target=button.getAttribute('aria-controls');buttons.forEach(x=>x.setAttribute('aria-selected',String(x===button)));panels.forEach(x=>x.classList.toggle('active',x.id===target));}
    buttons.forEach((button,index)=>button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let next=index;if(event.key==='ArrowRight')next=(index+1)%buttons.length;if(event.key==='ArrowLeft')next=(index-1+buttons.length)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;activate(buttons[next]);buttons[next].focus({preventScroll:true});}));
    return true;
  }

  if (book) {
    if (!standardiseAria()) standardiseCustom();
    document.querySelectorAll('a[href*="amazon."]').forEach(link => { if (!link.closest('#hc-buy')) link.style.display='none'; });
    const topBuy = document.getElementById('topBuy');
    if (topBuy) topBuy.onclick = event => { event.preventDefault(); const btn=[...document.querySelectorAll('.tab,[role="tab"]')].find(x=>x.textContent.trim()==='Where to Buy'); btn?.click(); };
  }

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
    .tabs,.queen-tabs,.zolbrent-tabs,.pulse-tabs{gap:6px!important}
    .tabs .tab,.queen-tab,.zolbrent-tab,.pulse-tab{white-space:nowrap}
    @media(max-width:1000px){.hc-store-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:700px){.hc-store-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hc-store-card{padding:7px 8px}.hc-store-card strong{font-size:10px}.hc-store-formats{font-size:9px}}
  `;
  document.head.append(style);
})();
