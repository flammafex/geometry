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
  },

  /**
   * Create tick marks on a line segment to indicate equal sides
   * @param {SVGElement} parent - Parent SVG group to append ticks to
   * @param {number} x1, y1, x2, y2 - Endpoints of the line segment
   * @param {number} count - Number of tick marks (1, 2, or 3)
   * @param {Object} options - Optional styling
   *   - length: length of each tick (default: 12)
   *   - spacing: spacing between ticks for multiple marks (default: 6)
   *   - strokeWidth: width of tick lines (default: 2)
   *   - className: CSS class to apply (default: 'line path-default tick')
   */
  createSideTicks(parent, x1, y1, x2, y2, count = 1, options = {}) {
    const {
      length = 12,
      spacing = 6,
      strokeWidth = 2,
      className = 'line path-default tick'
    } = options;

    // Calculate midpoint
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Calculate perpendicular direction
    const dx = x2 - x1;
    const dy = y2 - y1;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    // Unit perpendicular vector (rotated 90 degrees)
    const perpX = -dy / segmentLength;
    const perpY = dx / segmentLength;

    // Calculate parallel direction for spacing multiple ticks
    const parallelX = dx / segmentLength;
    const parallelY = dy / segmentLength;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'side-ticks');

    for (let i = 0; i < count; i++) {
      // Offset from center for multiple ticks
      const offset = (i - (count - 1) / 2) * spacing;
      const centerX = mx + parallelX * offset;
      const centerY = my + parallelY * offset;

      // Create tick line perpendicular to segment
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', centerX - perpX * length / 2);
      tick.setAttribute('y1', centerY - perpY * length / 2);
      tick.setAttribute('x2', centerX + perpX * length / 2);
      tick.setAttribute('y2', centerY + perpY * length / 2);
      tick.setAttribute('stroke-width', strokeWidth);
      tick.setAttribute('class', className);

      group.appendChild(tick);
    }

    parent.appendChild(group);
    return group;
  },

  /**
   * Create an angle arc between two rays emanating from a vertex
   * @param {SVGElement} parent - Parent SVG group to append arc to
   * @param {number} vx, vy - Vertex coordinates
   * @param {number} p1x, p1y - Point on first ray
   * @param {number} p2x, p2y - Point on second ray
   * @param {number} radius - Radius of the arc
   * @param {Object} options - Optional styling
   *   - strokeWidth: width of arc (default: 1)
   *   - className: CSS class to apply (default: 'line path-default')
   *   - sweep: whether to draw the arc in the positive angle direction (default: true)
   */
  createAngleArc(parent, vx, vy, p1x, p1y, p2x, p2y, radius, options = {}) {
    const {
      strokeWidth = 1,
      className = 'line path-default',
      sweep = true
    } = options;

    // Calculate angles for both rays
    const angle1 = Math.atan2(p1y - vy, p1x - vx);
    const angle2 = Math.atan2(p2y - vy, p2x - vx);

    // Calculate start and end points on the arc
    const startX = vx + radius * Math.cos(angle1);
    const startY = vy + radius * Math.sin(angle1);
    const endX = vx + radius * Math.cos(angle2);
    const endY = vy + radius * Math.sin(angle2);

    // Determine if we need the large arc flag
    let angleDiff = angle2 - angle1;

    // Normalize angle difference to [-π, π]
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    const largeArc = Math.abs(angleDiff) > Math.PI ? 1 : 0;
    const sweepFlag = sweep ? (angleDiff > 0 ? 1 : 0) : (angleDiff > 0 ? 0 : 1);

    // Create SVG path for the arc
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${endX} ${endY}`;

    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('class', className);

    parent.appendChild(path);
    return path;
  },

  /**
   * Calculate the length of a path (useful for stroke-dasharray animations)
   * @param {string} d - SVG path d attribute
   * @returns {number} - Length of the path
   */
  getPathLength(d) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    document.body.appendChild(path);
    const length = path.getTotalLength();
    document.body.removeChild(path);
    return length;
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
