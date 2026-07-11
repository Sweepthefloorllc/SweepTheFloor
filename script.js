/*
  Main site JavaScript
  - FAQ accordion behavior
  - Section reveal on scroll (intersection observer)
  - Reviews marquee initialization with responsive animation
  Comments are intentionally detailed for maintainability.
*/

// ---------- FAQ accordion logic ----------
document.querySelectorAll('.faq-item').forEach(item => {
  const ans = item.querySelector('.faq-a');
  if (ans) ans.style.maxHeight = '0px';
});

document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const ans = item.querySelector('.faq-a');
    const willOpen = !item.classList.contains('open');

    // Close any other open items (single-open behavior)
    document.querySelectorAll('.faq-item.open').forEach(open => {
      if (open !== item) {
        const a = open.querySelector('.faq-a');
        if (a) a.style.maxHeight = '0px';
        open.classList.remove('open');
      }
    });

    if (willOpen) {
      item.classList.add('open');
      if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
    } else {
      if (ans) ans.style.maxHeight = '0px';
      item.classList.remove('open');
    }
  });
});

// Recalculate open FAQ heights on resize
window.addEventListener('resize', () => {
  document.querySelectorAll('.faq-item.open .faq-a').forEach(a => a.style.maxHeight = a.scrollHeight + 'px');
});


// ---------- Reveal-on-scroll (simple intersection observer) ----------
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
      reveal.unobserve(e.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.feature, .step, .card-img, .service-info, .portrait, .form-card, .side-card, .trust-grid div, .audience-grid div, .gallery-grid article, .why-photo, .service-area-card').forEach(el => {
  el.style.opacity = .001;
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease, box-shadow .24s ease';
  reveal.observe(el);
});


// ---------- Reviews marquee: robust, responsive animation ----------
function initReviewMarquee() {
  const marquees = document.querySelectorAll('.review-marquee');
  marquees.forEach(marquee => {
    const track = marquee.querySelector('.review-track');
    if (!track) return;

    // Ensure there are at least two sets of items to enable seamless looping
    const originals = Array.from(track.children).filter(n => n.classList.contains('review'));
    if (originals.length === 0) return;

    // Duplicate content until track width is at least 2x container width
    function ensureLoop() {
      // reset clones
      const containerWidth = marquee.offsetWidth || marquee.clientWidth;
      let trackWidth = track.scrollWidth;

      // if not wide enough, clone original set until it is
      let cloneCount = 0;
      while (trackWidth < containerWidth * 2) {
        originals.forEach(node => track.appendChild(node.cloneNode(true)));
        trackWidth = track.scrollWidth;
        cloneCount += 1;
        if (cloneCount > 6) break; // safety
      }

      // distance to scroll is half the full track width (one full set) negative in px
      const distance = -(track.scrollWidth / 2);

      // compute duration based on width to keep speed roughly consistent
      const baseSpeed = 30; // pixels per second for a calmer marquee pace
      const duration = Math.max(55, Math.round((Math.abs(distance) / baseSpeed))); // seconds

      // apply CSS variables and style for animation
      track.style.setProperty('--review-distance', `${distance}px`);
      track.style.setProperty('--review-duration', `${duration}s`);
      track.style.animationDuration = `${duration}s`;
      track.style.animationName = 'reviewScroll';
      track.style.animationTimingFunction = 'linear';
      track.style.animationIterationCount = 'infinite';
    }

    ensureLoop();

    // Recalculate on window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // remove clones and re-build from original set
        // remove all children, re-add originals, then ensure loop
        const content = originals.map(n => n.cloneNode(true));
        track.innerHTML = '';
        content.forEach(n => track.appendChild(n));
        ensureLoop();
      }, 200);
    });
  });
}

// init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviewMarquee);
} else {
  initReviewMarquee();
}

/* Dynamically load the overrides stylesheet only if it is not already present.
   This avoids duplicate stylesheet insertion when HTML pages already include it. */
(function loadOverrides(){
  try{
    var href = 'styles.overrides.css';
    var alreadyLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(link => link.href && link.href.endsWith(href));
    if (alreadyLoaded) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'all';
    document.head.appendChild(link);
  }catch(e){
    console.warn('Could not load overrides stylesheet', e);
  }
})();

/* ---------- Page-specific DOM tweaks ----------
   Add dark hero variant to pages that match the provided screenshots
   (services, about, contact). This keeps HTML edits minimal while
   matching the visual design immediately.
*/
(function heroVariantHelper(){
  try{
    var path = window.location.pathname.toLowerCase();
    var darkPages = ['/services.html','/about.html','/contact.html','/services','/about','/contact'];
    var pageHero = document.querySelector('.page-hero');
    if(!pageHero) return;
    if(darkPages.some(p=>path.endsWith(p))){
      pageHero.classList.add('page-hero--dark');
    }
  }catch(e){console.warn('heroVariantHelper failed',e)}
})();
