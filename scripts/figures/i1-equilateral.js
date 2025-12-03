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
      case 1: WSOG.helpers.showAndSweep(compA, spinA, circleA); break;   // circle at A + arm visible only during sweep
      case 2: WSOG.helpers.showAndSweep(compB, spinB, circleB); break;   // circle at B + arm visible only during sweep
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
