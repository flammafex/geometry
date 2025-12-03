// ---- Figure: i4-sas (Side-Angle-Side Triangle Congruence) -----------------
WSOG.register('i4-sas', function(fig){
  const q = sel => fig.querySelector(sel);

  const ab  = q('#ab4');
  const ac  = q('#ac4');
  const bc  = q('#bc4');
  const arcA= q('#arcA');
  const tickAB = q('#tickAB');
  const ticksAC= q('#ticksAC');
  const move = q('#i4-move');
  const moveBack = q('#i4-return');
  const btnStep = q('#i4-step');
  const btnReset= q('#i4-reset');

  let step = 0;
  let hasMoved = false;
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function reset(){
    step = 0;
    [ab, ac, bc, arcA].forEach(el => el.classList.remove('reveal'));
    [tickAB, ticksAC].forEach(el => el.classList.add('fade'));
    if (hasMoved) { try { moveBack.beginElement(); } catch(e){} }
    hasMoved = false;
  }

  function doStep(){
    switch(step){
      case 0: [ab, ac, bc, arcA].forEach(el => el.classList.add('reveal')); break;
      case 1: tickAB.classList.remove('fade'); ticksAC.classList.remove('fade'); break;
      case 2:
        if (prefersReduce) {
          // snap without animation
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
