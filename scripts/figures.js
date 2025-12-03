// ---- Tiny registry ---------------------------------------------------------
window.WSOG = window.WSOG || {};
WSOG.registry = WSOG.registry || new Map();

/**
 * Register an initializer for a figureType (string).
 * initFn receives the <figure> element.
 */
WSOG.register = function(figureType, initFn){
  WSOG.registry.set(figureType, initFn);
};

/**
 * Initialize all figures currently in the DOM that have data-figure.
 * (Useful if content is swapped dynamically.)
 */
WSOG.initAll = function(root=document){
  root.querySelectorAll('figure[data-figure]').forEach(fig => WSOG.initOne(fig));
};

WSOG.initOne = function(fig){
  const kind = fig.dataset.figure;
  if (!kind || !WSOG.registry.has(kind)) return;
  // Guard against double-init
  if (fig.__wsogInited) return;
  fig.__wsogInited = true;
  WSOG.registry.get(kind)(fig);
};

// ---- Shared Helper Functions -----------------------------------------------
WSOG.helpers = {
  Delay: (ms) => new Promise(res => setTimeout(res, ms)),
  SWEEP_MS: 1100, // matches dur="1.1s" in the SVG animateTransform

  hideCompass(comp) {
    comp.classList.add('fade');
    setTimeout(() => {
      comp.classList.remove('fade');
      comp.classList.add('gone');
    }, 160);
  },

  showAndSweep(comp, spin, circle) {
    comp.classList.remove('gone');
    // force reflow so fade/appear is crisp if CSS transitions are present
    void comp.offsetWidth;
    circle.classList.add('reveal');
    try { spin.beginElement(); } catch(e){}
    setTimeout(() => WSOG.helpers.hideCompass(comp), WSOG.helpers.SWEEP_MS);
  }
};

// ---- Lazy initializer via IntersectionObserver ----------------------------
(function(){
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        WSOG.initOne(e.target);
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '200px' });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('figure[data-figure]').forEach(f => io.observe(f));
  });
})();
