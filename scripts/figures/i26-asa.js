// ---- Figure: i26-asa (Angle-Side-Angle / AAS Triangle Congruence) ---------
WSOG.register('i26-asa', function(fig){
  const q = sel => fig.querySelector(sel);

  const ab  = q('#ab26');
  const ac  = q('#ac26');
  const bc  = q('#bc26');
  const arcA= q('#arcA26');
  const arcB= q('#arcB26');
  const tick= q('#tickAB26');

  const rot     = q('#i26-rot');
  const rotBack = q('#i26-rot-return');
  const move    = q('#i26-move');
  const back    = q('#i26-return');

  const triOuter = q('#triABC');     // translate container
  const triRot   = q('#triABC-rot'); // rotate container

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
