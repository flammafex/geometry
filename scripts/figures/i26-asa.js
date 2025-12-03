// ---- Figure: i26-asa (Angle-Side-Angle / AAS Triangle Congruence) ---------
WSOG.register('i26-asa', function(fig){
  const q = sel => fig.querySelector(sel);

  // Triangle ABC coordinates
  const A = { x: 0, y: 0 };
  const B = { x: 160, y: 0 };
  const C = { x: 91.92, y: 77.14 };

  // Triangle DEF coordinates (rotated + translated)
  const D = { x: 320, y: 0 };
  const E = { x: 470.24, y: 54.68 };
  const F = { x: 380.05, y: 103.73 };

  const ab  = q('#ab26');
  const ac  = q('#ac26');
  const bc  = q('#bc26');
  const arcA= q('#arcA26');
  const tick= q('#tickAB26');
  const triDEF = q('#triDEF');

  const rot     = q('#i26-rot');
  const rotBack = q('#i26-rot-return');
  const move    = q('#i26-move');
  const back    = q('#i26-return');

  const triOuter = q('#triABC');     // translate container
  const triRot   = q('#triABC-rot'); // rotate container
  const edges    = q('#edges');

  // Create programmatic angle arc at B (foreground triangle)
  const arcB = WSOG.helpers.createAngleArc(
    edges,
    B.x, B.y,  // vertex at B
    A.x, A.y,  // point on ray BA
    C.x, C.y,  // point on ray BC
    20,        // radius
    { strokeWidth: 1, className: 'line path-default no-fill draw' }
  );
  arcB.setAttribute('id', 'arcB26-generated');

  // Set up animation for arc B
  const arcBLength = WSOG.helpers.getPathLength(arcB.getAttribute('d'));
  arcB.style.setProperty('--len', arcBLength);
  arcB.style.setProperty('--dur', '0.6s');

  // Background triangle DEF markers
  // Angle arc at D
  WSOG.helpers.createAngleArc(
    triDEF,
    D.x, D.y,  // vertex at D
    E.x, E.y,  // point on ray DE
    F.x, F.y,  // point on ray DF
    20,        // radius
    { strokeWidth: 1, className: 'line path-default' }
  );

  // Angle arc at E
  WSOG.helpers.createAngleArc(
    triDEF,
    E.x, E.y,  // vertex at E
    D.x, D.y,  // point on ray ED
    F.x, F.y,  // point on ray EF
    18,        // radius
    { strokeWidth: 1, className: 'line path-default' }
  );

  // Tick mark on DE (equal to AB)
  WSOG.helpers.createSideTicks(triDEF, D.x, D.y, E.x, E.y, 1, {
    className: 'line path-default tick',
    strokeWidth: 2
  });

  const btnStep = q('#i26-step');
  const btnReset= q('#i26-reset');

  let step = 0, hasRot = false, hasMoved = false;
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function reset(){
    step = 0;
    [ab, ac, bc, arcA, arcB].forEach(el => el.classList.remove('reveal'));
    tick.classList.add('fade');

    if (hasMoved) { try { back.beginElement(); } catch(e){} }
    if (hasRot)   { try { rotBack.beginElement(); } catch(e){} }
    if (prefersReduce) {
      triOuter.setAttribute('transform','translate(0 0)');
      triRot.setAttribute('transform','rotate(0 0 0)');
    }
    hasRot = hasMoved = false;
  }

  function doStep(){
    switch(step){
      case 0: // draw △ABC
        [ab, ac, bc, arcA, arcB].forEach(el => el.classList.add('reveal'));
        break;
      case 1: // show two equal angles + one equal side
        tick.classList.remove('fade');
        break;
      case 2: // rotate about A to match ∠A with ∠D
        if (prefersReduce) {
          triRot.setAttribute('transform','rotate(20 0 0)');
        } else {
          try { rot.beginElement(); } catch(e){}
        }
        hasRot = true;
        break;
      case 3: // translate A→D to superpose
        if (prefersReduce) {
          triOuter.setAttribute('transform','translate(320 0)');
        } else {
          try { move.beginElement(); } catch(e){}
        }
        hasMoved = true;
        break;
      default: return;
    }
    step++;
  }

  btnStep.addEventListener('click', doStep);
  btnReset.addEventListener('click', reset);
  reset();
});
