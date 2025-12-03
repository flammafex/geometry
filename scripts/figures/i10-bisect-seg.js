// ---- Figure: i10-bisect-seg (Bisect a segment) ----------------------------
WSOG.register('i10-bisect-seg', function(fig){
  const q = sel => fig.querySelector(sel);

  const ab = q('#i10-ab');
  const cA = q('#i10-cA');
  const cB = q('#i10-cB');
  const X  = q('#i10-X');
  const Y  = q('#i10-Y');
  const Xt = q('#i10-Xt');
  const Yt = q('#i10-Yt');
  const M  = q('#i10-M');
  const Mt = q('#i10-Mt');
  const XY = q('#i10-xy');
  const midtick = q('#i10-midtick1');

  // Compass refs
  const compA = q('#i10-compassA');
  const compB = q('#i10-compassB');
  const spinA = q('#i10-spinA');
  const spinB = q('#i10-spinB');

  const stepBtn = q('#i10-step');
  const resetBtn= q('#i10-reset');

  let step = 0;

  function reset(){
    step = 0;
    [ab, cA, cB, XY].forEach(el => el.classList.remove('reveal'));
    [X, Y, Xt, Yt, M, Mt, midtick].forEach(el => el.classList.remove('show'));
    [X, Y, Xt, Yt, M, Mt, midtick].forEach(el => el.classList.add('fade'));
    // Ensure compasses hidden
    [compA, compB].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    try { spinA.endElement(); spinB.endElement(); } catch(e){}
  }

  function doStep(){
    switch(step){
      case 0: ab.classList.add('reveal'); break;                     // AB
      case 1: WSOG.helpers.showAndSweep(compA, spinA, cA); break;    // circle at A (+ sweep)
      case 2: WSOG.helpers.showAndSweep(compB, spinB, cB); break;    // circle at B (+ sweep)
      case 3: [X,Y,Xt,Yt].forEach(el=>{el.classList.remove('fade'); el.classList.add('show');}); break; // X,Y
      case 4: XY.classList.add('reveal'); [M,Mt,midtick].forEach(el=>{el.classList.remove('fade'); el.classList.add('show');}); break; // XY + M
      default: return;
    }
    step++;
  }

  stepBtn.addEventListener('click', doStep);
  resetBtn.addEventListener('click', reset);
  reset();
});
