/* ==========================================================================
   Home page behaviour: the scroll-driven sourcing tabs and the
   testimonial batches. Load after scripts/site.js.
   ========================================================================== */
  // sourcing tabs, driven by scroll: while the frame is pinned, the scroll
  // position through the runway picks the tab and glides the highlight;
  // clicking a tab (or arrow keys) scrolls to that tab's point
  (function(){
    const track  = document.querySelector('.src-track');
    const frame  = track && track.querySelector('.src-frame');
    const tabs   = frame && frame.querySelector('.tabs');
    const btns   = frame ? [...frame.querySelectorAll('.tab-btn')] : [];
    const panels = frame ? [...frame.querySelectorAll('.tab-panel')] : [];
    const stage  = frame && frame.querySelector('.tab-stage');
    const slides = stage ? [...stage.querySelectorAll('.stage-slide')] : [];
    if (!track || !btns.length) return;
    const N = btns.length;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // wrap every word of the heading, copy and points in .w for the reveal
    panels.forEach(panel=>{
      panel.querySelectorAll('.tab-copy h3, .tab-copy > p, .point-list li').forEach((block, b)=>{
        [...block.childNodes].forEach(node=>{
          if (node.nodeType !== 3 || !node.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(part=>{
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.textContent = part;
            frag.appendChild(w);
          });
          // points are flex rows with a gap, so keep their words in one box
          if (block.matches('li')) { const t = document.createElement('span'); t.appendChild(frag); node.replaceWith(t); }
          else node.replaceWith(frag);
        });
      });
    });

    // number the rendered lines of a visible panel, top to bottom
    function numberLines(panel){
      let line = -1;
      panel.querySelectorAll('.tab-copy h3, .tab-copy > p, .point-list li').forEach(block=>{
        let lastTop = null;
        block.querySelectorAll('.w').forEach(w=>{
          const top = Math.round(w.getBoundingClientRect().top);
          if (lastTop === null || Math.abs(top - lastTop) > 2) { line++; lastTop = top; }
          w.style.setProperty('--i', line);
        });
      });
    }
    function replay(panel){
      panel.classList.remove('reveal');
      numberLines(panel);                     // measured while nothing is animating
      panel.offsetWidth;
      panel.classList.add('reveal');
    }

    let current = -1, lockTo = -1, lockTimer = 0;
    function show(i){
      if (i === current) return;
      current = i;
      btns.forEach((b, k)=>{
        const on = k === i;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on);
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p, k)=>{
        p.classList.toggle('active', k === i);
        p.classList.remove('reveal');
      });
      tabs.style.setProperty('--tab-pos', i);
      if (stage) {
        slides.forEach((sl, k)=>{
          sl.classList.toggle('is-active', k === i);
          sl.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        });
      }
      if (!still && revealed) replay(panels[i]);
    }
    function geometry(){
      const top = parseFloat(getComputedStyle(frame).top) || 0;
      const travel = Math.max(1, track.offsetHeight - frame.offsetHeight);
      return {top, travel};
    }
    function progress(){
      const {top, travel} = geometry();
      return Math.min(1, Math.max(0, (top - track.getBoundingClientRect().top) / travel));
    }
    let ticking = false;
    function update(){
      ticking = false;
      const pos = progress() * (N - 1);
      const i = Math.round(pos);
      if (lockTo >= 0) { if (i === lockTo) lockTo = -1; else return; }
      show(i);
    }
    addEventListener('scroll', ()=>{ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
    addEventListener('resize', update);

    function goTo(i){
      const {top, travel} = geometry();
      const trackTop = track.getBoundingClientRect().top + scrollY;
      lockTo = i; clearTimeout(lockTimer); lockTimer = setTimeout(()=>{ lockTo = -1; update(); }, 1500);
      show(i);
      scrollTo({top: trackTop - top + travel * i / (N - 1), behavior: still ? 'auto' : 'smooth'});
    }
    btns.forEach((btn, i)=>{
      btn.addEventListener('click', ()=>goTo(i));
      btn.addEventListener('keydown', e=>{
        const to = {ArrowRight:(i + 1) % N, ArrowLeft:(i - 1 + N) % N, Home:0, End:N - 1}[e.key];
        if (to === undefined) return;
        e.preventDefault();
        btns[to].focus();
        goTo(to);
      });
    });

    // play the first reveal when the frame first comes into view
    let revealed = still;
    const io = 'IntersectionObserver' in window && new IntersectionObserver(([e])=>{
      if (!e.isIntersecting) return;
      revealed = true; io.disconnect();
      if (!still) replay(panels[current]);
    }, {threshold:0.35});
    if (io) io.observe(frame); else revealed = true;
    current = -1; update();
  })();

  // testimonials: three at a time; the arrows slide a whole batch in and
  // wrap around, so "next" alone cycles through every card
  (function(){
    const frame = document.querySelector('.wom-frame');
    const status = document.getElementById('wom-status');
    const arrows = document.querySelectorAll('.wom-arrow');
    if (!frame || !arrows.length) return;
    const cards = [...frame.querySelectorAll('.wom-card')];
    const PER = 3;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // group the cards into pages of three inside a clipped, sliding track
    const viewport = document.createElement('div');
    const track = document.createElement('div');
    viewport.className = 'wom-viewport';
    track.className = 'wom-track';
    const pages = [];
    for (let i = 0; i < cards.length; i += PER) {
      const pg = document.createElement('div');
      pg.className = 'wom-page';
      cards.slice(i, i + PER).forEach(c=>pg.appendChild(c));
      pages.push(pg);
      track.appendChild(pg);
    }
    viewport.appendChild(track);
    frame.prepend(viewport);

    let page = 0, busy = false;
    function settle(n){
      page = n;
      pages.forEach((pg, i)=>{ pg.hidden = i !== page; pg.style.order = ''; });
      track.style.transition = 'none';
      track.style.transform = '';
      const first = page * PER + 1, last = Math.min(cards.length, first + PER - 1);
      status.textContent = 'Showing testimonials ' + first + ' to ' + last + ' of ' + cards.length;
    }
    function go(dir){
      if (busy || pages.length < 2) return;
      const from = pages[page], next = (page + dir + pages.length) % pages.length, to = pages[next];
      if (still) { settle(next); return; }
      busy = true;
      // lay the two batches side by side in travel order, then slide one page
      to.hidden = false;
      from.style.order = dir > 0 ? 0 : 1;
      to.style.order   = dir > 0 ? 1 : 0;
      track.style.transition = 'none';
      track.style.transform = dir > 0 ? 'translateX(0)' : 'translateX(-100%)';
      track.offsetWidth;                       // commit the start position
      track.style.transition = 'transform .6s cubic-bezier(.65, 0, .35, 1)';
      track.style.transform = dir > 0 ? 'translateX(-100%)' : 'translateX(0)';
      track.addEventListener('transitionend', function done(e){
        if (e.target !== track) return;
        track.removeEventListener('transitionend', done);
        settle(next);
        busy = false;
      });
    }
    arrows.forEach(btn=>btn.addEventListener('click', ()=>go(Number(btn.dataset.dir))));
    settle(0);
  })();
