// Menu button
document.addEventListener("DOMContentLoaded", function () {
    const tocButton = document.getElementById("menu-toggle");
    const floatingMenu = document.getElementById("floating-menu");
    const chapter1 = document.getElementById("chapter-1");
    let userHasScrolled = false;
    let lastScrollPosition = 0;
    let scrollTimeoutId = null;

    // Ensure TOC button is hidden on load
    tocButton.style.opacity = "0";
    tocButton.style.pointerEvents = "none";
    floatingMenu.style.opacity = "0";
    floatingMenu.style.pointerEvents = "none";
    
    tocButton.addEventListener('click', () => {
        floatingMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('#floating-menu a, #floating-menu button').forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                floatingMenu.classList.add('hidden');
            }, 150);
        });
    });

    document.getElementById('toggle-reading-mode').addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
    });

    function handleScroll() {
        userHasScrolled = true; // User has scrolled at least once

        // Determine scroll direction
        if (window.scrollY > lastScrollPosition) {
            // Scrolling down
            tocButton.style.opacity = "0";
            tocButton.style.pointerEvents = "none";
            floatingMenu.style.opacity = "0";
            floatingMenu.style.pointerEvents = "none";
        } else {
            tocButton.style.opacity = "1.0";
            tocButton.style.pointerEvents = "auto";
            floatingMenu.style.opacity = "1.0"; // Adjust this if you want the floating menu to be fully visible
            floatingMenu.style.pointerEvents = "auto"; // Adjust this if you want the floating menu to be interactive
        }

        lastScrollPosition = window.scrollY;
    }
    
        // Initial check on page load
        if (window.scrollY < chapter1.offsetTop - 50) {
            tocButton.style.opacity = "1.0"; // Show the button if the initial position allows it
            tocButton.style.pointerEvents = "auto"; // Make the button interactive
            floatingMenu.style.opacity = "1.0"; // Adjust this if you want the floating menu to be fully visible
            floatingMenu.style.pointerEvents = "auto"; // Adjust this if you want the floating menu to be interactive
            // Set initial opacity for the floating menu as well
        }

    // Listen for first scroll to enable TOC button
    window.addEventListener("scroll", handleScroll, { passive: true });
});

// Progressive Web app
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service worker registered.', reg))
    .catch(err => console.error('Service worker registration failed:', err));
 }

// Use Built-in OS TTS
// Multilingual
function extractMultilingualChunks(el) {
  const chunks = [];

  function walk(node, currentLang = 'en-US') {
    if (node.nodeType === Node.TEXT_NODE) {
      const trimmed = node.textContent.trim();
      if (trimmed.length > 0) {
        chunks.push({ text: trimmed, lang: currentLang });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.getAttribute('aria-hidden') === 'true') return;

      const newLang = node.getAttribute('lang') || currentLang;

      // If this node has an aria-label, prefer it over any content inside
      if (node.hasAttribute('aria-label')) {
        const labelText = node.getAttribute('aria-label').trim();
        if (labelText.length > 0) {
          chunks.push({ text: labelText, lang: newLang });
          return; // Skip children — aria-label takes priority
        }
      }

      for (const child of node.childNodes) {
        walk(child, newLang);
      }
    }
  }

  walk(el);
  return chunks;
}

let currentlySpeakingElement = null;
let ttsCancelled = false;

// Read aloud a given element
function readAloud(element) {
  // Stop current playback if already speaking this element
  if (speechSynthesis.speaking && currentlySpeakingElement === element) {
    ttsCancelled = true;
    speechSynthesis.cancel();
    currentlySpeakingElement = null;
    return;
  }

  const chunks = extractMultilingualChunks(element);
  if (chunks.length === 0) return;

  ttsCancelled = false;
  speechSynthesis.cancel();
  currentlySpeakingElement = element;

  function speakNext(index) {
    if (ttsCancelled || index >= chunks.length) {
      currentlySpeakingElement = null;
      return;
    }

    const chunk = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = chunk.lang;
    utterance.rate = 1;

    utterance.onend = () => setTimeout(() => speakNext(index + 1), 50);
    utterance.onerror = () => setTimeout(() => speakNext(index + 1), 50);

    speechSynthesis.speak(utterance);
    setTimeout(() => speechSynthesis.resume(), 0);
  }

  setTimeout(() => speakNext(0), 100);
}

//Add TTS Buttons
function addVerseTTSButtons() {
  const chapters = document.querySelectorAll('.chapter');
  
  chapters.forEach(chapter => {
    const btn = document.createElement('button');
    btn.textContent = '🎧';
    btn.className = 'verse-tts-button';
    btn.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => readAloud(chapter.parentNode));

    chapter.insertBefore(btn, chapter.firstChild);
  });
  
  const subchapters = document.querySelectorAll('.subchapter');
  
  subchapters.forEach(subchapter => {
    const btn = document.createElement('button');
    btn.textContent = '🎧';
    btn.className = 'verse-tts-button';
    btn.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => readAloud(subchapter.parentNode));

    subchapter.insertBefore(btn, subchapter.firstChild);
  });
  
  const verses = document.querySelectorAll('.verse');

  verses.forEach(verse => {
    const btn = document.createElement('button');
    btn.textContent = '🎧';
    btn.className = 'verse-tts-button';
    btn.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => readAloud(verse));

    verse.insertBefore(btn, verse.firstChild);
  });
}

document.addEventListener('DOMContentLoaded', addVerseTTSButtons);

 document.addEventListener("DOMContentLoaded", () => {    document.querySelectorAll(".hidden-reveal").forEach(span => {    span.addEventListener("click", () => {    span.classList.toggle("clicked");    });    });    })

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

// ---- Helper effects shared by many figures --------------------------------
const Delay = (ms) => new Promise(res => setTimeout(res, ms));
const SWEEP_MS = 1100; // matches dur="1.1s" in the SVG animateTransform

function hideCompass(comp){
  comp.classList.add('fade');
  setTimeout(() => { comp.classList.remove('fade'); comp.classList.add('gone'); }, 160);
}

function showAndSweep(comp, spin, circle){
  comp.classList.remove('gone');
  // force reflow so fade/appear is crisp if CSS transitions are present
  void comp.offsetWidth;
  circle.classList.add('reveal');
  try { spin.beginElement(); } catch(e){}
  setTimeout(() => hideCompass(comp), SWEEP_MS);
}

// ---- Figure: i1-equilateral -----------------------------------------------
WSOG.register('i1-equilateral', function initI1(fig){
  // Scope all queries to this figure so IDs can repeat across the page
  const q = sel => fig.querySelector(sel);

  const ab      = q('#ab');
  const circleA = q('#circleA');
  const circleB = q('#circleB');
  const compA   = q('#compassA');
  const compB   = q('#compassB');
  const spinA   = q('#spinA');
  const spinB   = q('#spinB');
  const C       = q('#C');
  const CLabel  = q('#CLabel');
  const ac      = q('#ac');
  const bc      = q('#bc');

  // Buttons (no global IDs; use data-role)
  const btnStep = fig.querySelector('[data-role="step"]');
  const btnReset= fig.querySelector('[data-role="reset"]');

  let step = 0;

  function reset() {
    step = 0;
    [ab, circleA, circleB, ac, bc].forEach(el => el.classList.remove('reveal'));
    [compA, compB].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    [C, CLabel].forEach(el => el.classList.remove('show'));
    try { spinA.endElement(); spinB.endElement(); } catch(e){}
  }

  function doStep() {
    switch (step) {
      case 0: ab.classList.add('reveal'); break;                         // AB
      case 1: showAndSweep(compA, spinA, circleA); break;                // circle at A + arm visible only during sweep
      case 2: showAndSweep(compB, spinB, circleB); break;                // circle at B + arm visible only during sweep
      case 3: C.classList.add('show'); CLabel.classList.add('show'); break; // C
      case 4: ac.classList.add('reveal'); bc.classList.add('reveal'); break; // AC, BC
      default: return;
    }
    step++;
  }

  btnStep?.addEventListener('click', doStep);
  btnReset?.addEventListener('click', reset);
  reset();
});