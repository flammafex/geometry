// ---- Figure: i12-perp-off (Perpendicular from a point to a line) ----------
WSOG.register('i12-perp-off', function(fig){
  const q = sel => fig.querySelector(sel);

  // Coordinates: M(80,0), P(80,120), Y(170,0), U(80,-120)
  const Mpt = { x: 80, y: 0 };
  const P = { x: 80, y: 120 };
  const Y = { x: 170, y: 0 };
  const U = { x: 80, y: -120 };  // Upper point on perpendicular

  const L  = q('#i12-l');
  const cP = q('#i12-cP');
  const cX = q('#i12-cX');
  const cY = q('#i12-cY');

  const Xpt = q('#i12-X'), Xt = q('#i12-Xt');
  const Ypt = q('#i12-Y'), Yt = q('#i12-Yt');
  const M = q('#i12-M'), Mt = q('#i12-Mt');

  const UV = q('#i12-uv');
  const PM = q('#i12-pm');
  const result = q('#result');

  // Create programmatic right angle box at M
  const right = WSOG.helpers.createRightAngleBox(
    result,
    Mpt.x, Mpt.y,  // vertex at M
    Y.x, Y.y,      // point on horizontal ray (toward Y, right)
    U.x, U.y,      // point on perpendicular ray (toward U, up)
    14,            // size
    { offset: 0, strokeWidth: 2, className: 'line path-default rightbox fade' }
  );
  right.setAttribute('id', 'i12-right');

  // Compass
  const compP = q('#i12-compassP');
  const compX = q('#i12-compassX');
  const compY = q('#i12-compassY');
  const spinP = q('#i12-spinP');
  const spinX = q('#i12-spinX');
  const spinY = q('#i12-spinY');

  const stepBtn = q('#i12-step');
  const resetBtn= q('#i12-reset');
  let step = 0;

  function reset(){
    step = 0;
    [L, cP, cX, cY, UV, PM].forEach(el => el.classList.remove('reveal'));
    [Xpt,Xt,Ypt,Yt,M,Mt,right].forEach(el => { el.classList.add('fade'); el.classList.remove('show'); });
    [compP, compX, compY].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    try { spinP.endElement(); spinX.endElement(); spinY.endElement(); } catch(e){}
  }

  function doStep(){
    switch(step){
      case 0: L.classList.add('reveal'); break;                               // base line
      case 1: WSOG.helpers.showAndSweep(compP, spinP, cP);                    // circle at P
              [Xpt,Xt,Ypt,Yt].forEach(el => { el.classList.remove('fade'); el.classList.add('show'); });
              break;
      case 2: WSOG.helpers.showAndSweep(compX, spinX, cX); break;             // circle at X
      case 3: WSOG.helpers.showAndSweep(compY, spinY, cY); break;             // circle at Y
      case 4: UV.classList.add('reveal');                                     // perpendicular bisector of XY
              [M,Mt].forEach(el => { el.classList.remove('fade'); el.classList.add('show'); });
              break;
      case 5: PM.classList.add('reveal'); right.classList.remove('fade'); right.classList.add('show'); break; // draw PM + right box
      default: return;
    }
    step++;
  }

  stepBtn.addEventListener('click', doStep);
  resetBtn.addEventListener('click', reset);
  reset();
});
