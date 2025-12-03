// ---- Figure: i11-perp-on (Perpendicular at a point on a line) -------------
WSOG.register('i11-perp-on', function(fig){
  const q = sel => fig.querySelector(sel);

  // Coordinates: A(0,0), B(-120,0), X(0,-90), Y(0,90)
  const A = { x: 0, y: 0 };
  const B = { x: -120, y: 0 };
  const X = { x: 0, y: -90 };

  const L  = q('#i11-l');
  const cB = q('#i11-cB');
  const cC = q('#i11-cC');
  const Xpt  = q('#i11-X'), Xt = q('#i11-Xt');
  const Ypt  = q('#i11-Y'), Yt = q('#i11-Yt');
  const XY = q('#i11-xy');
  const result = q('#result');

  // Create programmatic right angle box at A
  const right = WSOG.helpers.createRightAngleBox(
    result,
    A.x, A.y,  // vertex at A
    B.x, B.y,  // point on horizontal ray (toward B)
    X.x, X.y,  // point on perpendicular ray (toward X)
    14,        // size
    { offset: 1.8, strokeWidth: 2, className: 'line path-default rightbox fade' }
  );
  right.setAttribute('id', 'i11-right');

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
    [Xpt, Xt, Ypt, Yt, right].forEach(el => { el.classList.add('fade'); el.classList.remove('show'); });
    [compB, compC].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    try { spinB.endElement(); spinC.endElement(); } catch(e){}
  }

  function doStep(){
    switch(step){
      case 0: L.classList.add('reveal'); break;
      case 1: WSOG.helpers.showAndSweep(compB, spinB, cB); break;
      case 2: WSOG.helpers.showAndSweep(compC, spinC, cC); break;
      case 3: [Xpt,Ypt,Xt,Yt].forEach(el => { el.classList.remove('fade'); el.classList.add('show'); }); break;
      case 4: XY.classList.add('reveal'); right.classList.remove('fade'); right.classList.add('show'); break;
      default: return;
    }
    step++;
  }

  stepBtn.addEventListener('click', doStep);
  resetBtn.addEventListener('click', reset);
  reset();
});
