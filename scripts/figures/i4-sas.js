// ---- Figure: i4-sas (Side-Angle-Side Triangle Congruence) -----------------
WSOG.register('i4-sas', function(fig){
  const q = sel => fig.querySelector(sel);
  const svg = q('svg');

  // Triangle ABC coordinates
  const A = { x: 0, y: 0 };
  const B = { x: 180, y: 0 };
  const C = { x: 102.85, y: 122.56 };

  // Triangle DEF coordinates (background)
  const D = { x: 320, y: 0 };
  const E = { x: 500, y: 0 };
  const F = { x: 422.85, y: 122.56 };

  // Create groups for programmatic elements
  const triABCEdges = q('#triABC-edges');

  // Create group for angle arc at A (inside triABC-edges so it moves with triangle)
  const arcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  arcGroup.setAttribute('id', 'arcA-generated');
  arcGroup.setAttribute('class', 'draw fade');
  triABCEdges.appendChild(arcGroup);

  // Create angle arc at A
  const arcPath = WSOG.helpers.createAngleArc(
    arcGroup,
    A.x, A.y,  // vertex at A
    B.x, B.y,  // point on ray AB
    C.x, C.y,  // point on ray AC
    20,        // radius
    { strokeWidth: 1, className: 'line path-default no-fill' }
  );

  // Set up animation for arc
  const arcLength = WSOG.helpers.getPathLength(arcPath.getAttribute('d'));
  arcPath.style.setProperty('--len', arcLength);
  arcPath.style.setProperty('--dur', '0.6s');
  arcPath.classList.add('draw');

  // Create group for tick marks (inside triABC-edges)
  const tickGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  tickGroup.setAttribute('id', 'ticks-generated');
  tickGroup.setAttribute('class', 'fade');
  triABCEdges.appendChild(tickGroup);

  // Single tick on AB
  WSOG.helpers.createSideTicks(tickGroup, A.x, A.y, B.x, B.y, 1, {
    className: 'line path-default tick'
  });

  // Double ticks on AC
  WSOG.helpers.createSideTicks(tickGroup, A.x, A.y, C.x, C.y, 2, {
    className: 'line path-default tick'
  });

  // Background triangle DEF also needs ticks and arc
  const triDEF = q('#triDEF');

  // Angle arc at D
  WSOG.helpers.createAngleArc(
    triDEF,
    D.x, D.y,  // vertex at D
    E.x, E.y,  // point on ray DE
    F.x, F.y,  // point on ray DF
    20,
    { strokeWidth: 1, className: 'line path-default' }
  );

  // Single tick on DE
  WSOG.helpers.createSideTicks(triDEF, D.x, D.y, E.x, E.y, 1, {
    className: 'line path-default tick'
  });

  // Double ticks on DF
  WSOG.helpers.createSideTicks(triDEF, D.x, D.y, F.x, F.y, 2, {
    className: 'line path-default tick'
  });

  // Get references to elements
  const ab  = q('#ab4');
  const ac  = q('#ac4');
  const bc  = q('#bc4');
  const move = q('#i4-move');
  const moveBack = q('#i4-return');
  const btnStep = q('#i4-step');
  const btnReset= q('#i4-reset');

  let step = 0;
  let hasMoved = false;
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function reset(){
    step = 0;
    [ab, ac, bc].forEach(el => el.classList.remove('reveal'));
    arcGroup.classList.add('fade');
    arcGroup.classList.remove('reveal');
    tickGroup.classList.add('fade');
    if (hasMoved) { try { moveBack.beginElement(); } catch(e){} }
    hasMoved = false;
  }

  function doStep(){
    switch(step){
      case 0:
        [ab, ac, bc].forEach(el => el.classList.add('reveal'));
        arcGroup.classList.remove('fade');
        arcGroup.classList.add('reveal');
        break;
      case 1:
        tickGroup.classList.remove('fade');
        break;
      case 2:
        if (prefersReduce) {
          q('#triABC').setAttribute('transform', 'translate(320 0)');
          hasMoved = true;
        } else {
          try { move.beginElement(); hasMoved = true; } catch(e){}
        }
        break;
      case 3: /* no-op */ break;
      default: return;
    }
    step++;
  }

  btnStep.addEventListener('click', doStep);
  btnReset.addEventListener('click', reset);
  reset();
});
