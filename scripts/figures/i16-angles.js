// ---- Figure: i16-angles - Exterior Angle Theorem with correct arcs
WSOG.register('i16-angles', function(fig){
  const svg = fig.querySelector('svg');
  const arcsGroup = svg.querySelector('#arcs');

  // Clear existing hardcoded arcs
  arcsGroup.innerHTML = '';

  // Define coordinates from the SVG
  const A = { x: 0, y: 0 };
  const B = { x: 180, y: 0 };
  const C = { x: 110, y: 140 };
  const D = { x: 89, y: 182 };
  const E = { x: 55, y: 70 };
  const F = { x: -70, y: 140 };

  // ∠A: angle at A between rays AB and AC
  WSOG.helpers.createAngleArc(
    arcsGroup,
    A.x, A.y,     // vertex
    B.x, B.y,     // point on first ray (AB)
    C.x, C.y,     // point on second ray (AC)
    18,           // radius
    { strokeWidth: 1, className: 'line path-default' }
  );

  // ∠B: angle at B between rays BA and BC (FIXED!)
  WSOG.helpers.createAngleArc(
    arcsGroup,
    B.x, B.y,     // vertex
    A.x, A.y,     // point on first ray (BA)
    C.x, C.y,     // point on second ray (BC)
    18,           // radius
    { strokeWidth: 1, className: 'line path-default' }
  );

  // ∠ECF: subangle at C (equals ∠A)
  WSOG.helpers.createAngleArc(
    arcsGroup,
    C.x, C.y,     // vertex
    E.x, E.y,     // point on first ray (CE towards E/A)
    F.x, F.y,     // point on second ray (CF)
    20,           // radius
    { strokeWidth: 1, className: 'line path-default' }
  );

  // ∠ACD: exterior angle at C
  WSOG.helpers.createAngleArc(
    arcsGroup,
    C.x, C.y,     // vertex
    A.x, A.y,     // point on first ray (CA)
    D.x, D.y,     // point on second ray (CD)
    26,           // radius (slightly larger to distinguish)
    { strokeWidth: 1.2, className: 'line path-default' }
  );
});
