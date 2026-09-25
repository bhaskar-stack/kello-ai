/* ==========================================================================
   Shared page behaviour: include on every page, after the markup.
   Each block only runs if its component is on the page.
     - FAQ accordion (.faq-item / .faq-q-btn)
     - question field (.ask-field)
     - CTA card art: pause when reduced motion is on
     - page glow anchoring ([data-glow-anchor])
     - footer curtain reveal (.page-stack / .page-blur / .site-footer)
   ========================================================================== */
(function(){   // keep every name private so pages can add their own scripts
  // FAQ accordion: one answer open at a time
  const faqBtns = document.querySelectorAll('.faq-q-btn');
  faqBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      faqBtns.forEach(b=>{
        b.closest('.faq-item').classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
      });
      if(!wasOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // question field (.ask-field): no backend. With data-mailto a question
  // opens a prefilled email; without it the field just shows data-note.
  document.querySelectorAll('.ask-field').forEach(form=>{
    const input = form.querySelector('input');
    let note = null;
    input.addEventListener('input', ()=>form.classList.toggle('has-text', input.value.trim() !== ''));
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const q = input.value.trim();
      if (!q) { input.focus(); return; }
      if (form.dataset.mailto) {
        const subject = form.dataset.subject || 'Question about Kello';
        location.href = 'mailto:' + form.dataset.mailto + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(q);
        return;
      }
      if (!note) {
        note = document.createElement('p');
        note.className = 'ask-note';
        note.setAttribute('role', 'status');
        form.after(note);
      }
      note.textContent = form.dataset.note || 'Thanks! Your question has been noted.';
      input.value = '';
      form.classList.remove('has-text');
    });
  });


  // the CTA card's SMIL streaks can't be paused from CSS
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const depth = document.querySelector('.cta-depth-svg');
    if (depth) depth.pauseAnimations();
  }

  // the second page glow sits at a page offset; pin its top to the element
  // marked [data-glow-anchor] (a calm, box-free section) and follow it
  // whenever the page's height changes
  (function(){
    const glow = document.querySelector('.page-glow-2'), anchor = document.querySelector('[data-glow-anchor]');
    if (!glow || !anchor) return;
    const place = ()=>{ glow.style.top = Math.round(anchor.getBoundingClientRect().top + scrollY) + 'px'; };
    place();
    addEventListener('resize', place);
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(document.body);
  })();

  /* footer curtain reveal: freeze the whole page once the CTA card sits
     200px above the viewport bottom, then blur it back as the footer
     scrolls up over the top -- starting only once half the footer is on
     screen, and reaching full blur when all of it is. */
  (function(){
    const stack  = document.querySelector('.page-stack');
    const card   = document.querySelector('.cta-band');
    const blur   = document.querySelector('.page-blur');
    const footer = document.querySelector('.site-footer');
    if(!stack || !card || !blur || !footer) return;

    // --footer-pin: how far above the fold the last card sits when the page freezes
    const GAP = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footer-pin')) || 200;
    const MAX_BLUR = 10, BLUR_FROM = 0.5;
    let ticking = false;

    function measure(){
      // The stack is far taller than the viewport, so it pins via a NEGATIVE
      // sticky top: it holds once its own top has scrolled that far up, which
      // is exactly when its bottom edge reaches the viewport bottom.
      // `tail` is the slack below the card (the wrapper's bottom padding), so
      // subtracting it lands the CARD -- not the wrapper -- GAP px up.
      const tail = stack.getBoundingClientRect().bottom - card.getBoundingClientRect().bottom;
      const top  = Math.min(0, window.innerHeight - stack.offsetHeight + tail - GAP);
      document.documentElement.style.setProperty('--stack-pin', Math.round(top) + 'px');
    }

    function paint(){
      ticking = false;
      const vh = window.innerHeight;
      const fr = footer.getBoundingClientRect();
      const shown = vh - fr.top;                 // px of footer on screen
      const start = fr.height * BLUR_FROM;
      const end = Math.min(fr.height, vh);       // all of it, or a full screen of it
      const p = Math.min(1, Math.max(0, (shown - start) / Math.max(1, end - start)));
      const css = p ? 'blur(' + (p * MAX_BLUR).toFixed(2) + 'px)' : '';
      blur.style.backdropFilter = css;
      blur.style.webkitBackdropFilter = css;
    }

    function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(paint); } }

    measure(); paint();
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize', ()=>{ measure(); paint(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(()=>{ measure(); paint(); });
    // the pin depends on the stack's height, which changes whenever an FAQ
    // opens/closes or a different-height tab panel is shown -- re-pin then too
    if ('ResizeObserver' in window) new ResizeObserver(()=>{ measure(); paint(); }).observe(stack);
  })();
})();
