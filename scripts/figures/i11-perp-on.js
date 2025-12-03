// ---- Figure: i11-perp-on (Perpendicular at a point on a line) -------------
WSOG.register('i11-perp-on', function(fig){
  const q = sel => fig.querySelector(sel);

  const L  = q('#i11-l');
  const cB = q('#i11-cB');
  const cC = q('#i11-cC');
  const X  = q('#i11-X'), Xt = q('#i11-Xt');
  const Y  = q('#i11-Y'), Yt = q('#i11-Yt');
  const XY = q('#i11-xy');
  const right = q('#i11-right');

  // Compass bits
  const compB = q('#i11-compassB');
  const compC = q('#i11-compassC');
  const spinB = q('#i11-spinB');
  const spinC = q('#i11-spinC');

  const stepBtn = q('#i11-step');
  const resetBtn= q('#i11-reset');
  let step = 0;

  function reset(){
    step = 0;
    [L, cB, cC, XY].forEach(el => el.classList.remove('reveal'));
    [X, Xt, Y, Yt, right].forEach(el => { el.classList.add('fade'); el.classList.remove('show'); });
    [compB, compC].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    try { spinB.endElement(); spinC.endElement(); } catch(e){}
  }

  function doStep(){
    switch(step){
      case 0: L.classList.add('reveal'); break;
      case 1: WSOG.helpers.showAndSweep(compB, spinB, cB); break;
      case 2: WSOG.helpers.showAndSweep(compC, spinC, cC); break;
      case 3: [X,Y,Xt,Yt].forEach(el => { el.classList.remove('fade'); el.classList.add('show'); }); break;
      case 4: XY.classList.add('reveal'); right.classList.remove('fade'); right.classList.add('show'); break;
      default: return;
    }
    step++;
  }

  stepBtn.addEventListener('click', doStep);
  resetBtn.addEventListener('click', reset);
  reset();
});
