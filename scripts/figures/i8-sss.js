// ---- Figure: i8-sss (Side-Side-Side Triangle Congruence) ------------------
WSOG.register('i8-sss', function(fig){
  const q = sel => fig.querySelector(sel);

  const ab  = q('#ab8');
  const ac  = q('#ac8');
  const bc  = q('#bc8');
  const tAB = q('#tickAB8');
  const tAC = q('#ticksAC8');
  const tBC = q('#ticksBC8');

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
    [tAB, tAC, tBC].forEach(el => el.classList.add('fade'));
    if (hasMoved) { try { back.beginElement(); } catch(e){} }
    if (prefersReduce) { tri.setAttribute('transform', 'translate(0 0)'); }
    hasMoved = false;
  }

  function doStep(){
    switch(step){
      case 0: [ab, ac, bc].forEach(el => el.classList.add('reveal')); break;          // draw △ABC
      case 1: tAB.classList.remove('fade'); tAC.classList.remove('fade');             // show equal side ticks
              tBC.classList.remove('fade'); break;
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
