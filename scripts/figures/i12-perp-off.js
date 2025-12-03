// ---- Figure: i12-perp-off (Perpendicular from a point to a line) ----------
WSOG.register('i12-perp-off', function(fig){
  const q = sel => fig.querySelector(sel);

  const L  = q('#i12-l');
  const cP = q('#i12-cP');
  const cX = q('#i12-cX');
  const cY = q('#i12-cY');

  const X = q('#i12-X'), Xt = q('#i12-Xt');
  const Y = q('#i12-Y'), Yt = q('#i12-Yt');
  const M = q('#i12-M'), Mt = q('#i12-Mt');

  const UV = q('#i12-uv');
  const PM = q('#i12-pm');
  const right = q('#i12-right');

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
    [X,Xt,Y,Yt,M,Mt,right].forEach(el => { el.classList.add('fade'); el.classList.remove('show'); });
    [compP, compX, compY].forEach(el => { el.classList.add('gone'); el.classList.remove('fade'); });
    try { spinP.endElement(); spinX.endElement(); spinY.endElement(); } catch(e){}
  }

  function doStep(){
    switch(step){
      case 0: L.classList.add('reveal'); break;                               // base line
      case 1: WSOG.helpers.showAndSweep(compP, spinP, cP);                    // circle at P
              [X,Xt,Y,Yt].forEach(el => { el.classList.remove('fade'); el.classList.add('show'); });
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
