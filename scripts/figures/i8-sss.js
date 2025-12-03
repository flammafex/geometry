// ---- Figure: i8-sss (Side-Side-Side Triangle Congruence) ------------------
WSOG.register('i8-sss', function(fig){
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

  // Triple ticks on BC
  WSOG.helpers.createSideTicks(tickGroup, B.x, B.y, C.x, C.y, 3, {
    className: 'line path-default tick'
  });

  // Background triangle DEF also needs ticks
  const triDEF = q('#triDEF');

  // Single tick on DE
  WSOG.helpers.createSideTicks(triDEF, D.x, D.y, E.x, E.y, 1, {
    className: 'line path-default tick'
  });

  // Double ticks on DF
  WSOG.helpers.createSideTicks(triDEF, D.x, D.y, F.x, F.y, 2, {
    className: 'line path-default tick'
  });

  // Triple ticks on EF
  WSOG.helpers.createSideTicks(triDEF, E.x, E.y, F.x, F.y, 3, {
    className: 'line path-default tick'
  });

  // Get references to elements
  const ab  = q('#ab8');
  const ac  = q('#ac8');
  const bc  = q('#bc8');
  const move = q('#i8-move');
  const back = q('#i8-return');
  const tri  = q('#triABC');
  const btnStep = q('#i8-step');
  const btnReset= q('#i8-reset');

  let step = 0, hasMoved = false;
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function reset(){
    step = 0;
    [ab, ac, bc].forEach(el => el.classList.remove('reveal'));
    tickGroup.classList.add('fade');
    if (hasMoved) { try { back.beginElement(); } catch(e){} }
    if (prefersReduce) { tri.setAttribute('transform', 'translate(0 0)'); }
    hasMoved = false;
  }

  function doStep(){
    switch(step){
      case 0: [ab, ac, bc].forEach(el => el.classList.add('reveal')); break;          // draw △ABC
      case 1: tickGroup.classList.remove('fade'); break;                              // show equal side ticks
      case 2: if (prefersReduce) { tri.setAttribute('transform', 'translate(320 0)'); // overlay A→D
                                 hasMoved = true; }
              else { try { move.beginElement(); hasMoved = true; } catch(e){} }
              break;
      case 3: /* visual coincidence is the conclusion */ break;
      default: return;
    }
    step++;
  }

  btnStep.addEventListener('click', doStep);
  btnReset.addEventListener('click', reset);
  reset();
});
