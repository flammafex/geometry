// ---- Figure: i9-bisect-ang (Bisect an angle) ------------------------------
WSOG.register('i9-bisect-ang', function(fig){
  const q = sel => fig.querySelector(sel);

  const ab = q('#i9-ab');
  const ac = q('#i9-ac');
  const cA = q('#i9-cA');
  const cE = q('#i9-cE');
  const cF = q('#i9-cF');

  const E = q('#i9-E'), Et = q('#i9-Et');
  const F = q('#i9-F'), Ft = q('#i9-Ft');
  const D = q('#i9-D'), Dt = q('#i9-Dt');

  const ad = q('#i9-ad');
  const arc1 = q('#i9-arc1');
  const arc2 = q('#i9-arc2');

  // Compass refs
  const compA = q('#i9-compassA');
  const compE = q('#i9-compassE');
  const compF = q('#i9-compassF');
  const spinA = q('#i9-spinA');
  const spinE = q('#i9-spinE');
  const spinF = q('#i9-spinF');

  const stepBtn = q('#i9-step');
  const resetBtn= q('#i9-reset');

  let step = 0;

  function reset(){
    step = 0;
    [ab, ac, cA, cE, cF, ad, arc1, arc2].forEach(el => el.classList.remove('reveal'));
    [E,Et,F,Ft,D,Dt,arc1,arc2].forEach(el => { el.classList.add('fade'); el.classList.remove('show'); });
    // Hide compasses
    [compA, compE, compF].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    try { spinA.endElement(); spinE.endElement(); spinF.endElement(); } catch(e){}
  }

  function doStep(){
    switch(step){
      case 0: [ab, ac].forEach(el => el.classList.add('reveal')); break;                 // rays
      case 1: // circle at A (mark E,F appear)
        WSOG.helpers.showAndSweep(compA, spinA, cA);
        [E,Et,F,Ft].forEach(el=>{el.classList.remove('fade'); el.classList.add('show');});
        break;
      case 2: WSOG.helpers.showAndSweep(compE, spinE, cE); break;                        // circle E (+ sweep)
      case 3: WSOG.helpers.showAndSweep(compF, spinF, cF); [D,Dt].forEach(el=>{el.classList.remove('fade'); el.classList.add('show');}); break; // circle F (+ sweep) + D
      case 4: ad.classList.add('reveal'); [arc1,arc2].forEach(el=>el.classList.add('reveal')); break;
      default: return;
    }
    step++;
  }

  stepBtn.addEventListener('click', doStep);
  resetBtn.addEventListener('click', reset);
  reset();
});
