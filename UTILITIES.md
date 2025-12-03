# SVG Utilities Guide

This document explains how to use the programmatic utilities for creating tick marks and angle arcs in your geometry figures.

## Overview

The utilities are available in `WSOG.helpers` and include:
1. **`createSideTicks()`** - Add tick marks to indicate equal sides
2. **`createAngleArc()`** - Add arcs to indicate angles

## 1. Creating Side Tick Marks

### Syntax

```javascript
WSOG.helpers.createSideTicks(parent, x1, y1, x2, y2, count, options)
```

### Parameters

- `parent` (SVGElement) - Parent SVG group to append ticks to
- `x1, y1, x2, y2` (numbers) - Endpoints of the line segment
- `count` (number) - Number of tick marks (1, 2, or 3)
- `options` (object) - Optional styling:
  - `length`: length of each tick (default: 12)
  - `spacing`: spacing between ticks for multiple marks (default: 6)
  - `strokeWidth`: width of tick lines (default: 2)
  - `className`: CSS class to apply (default: 'line path-default tick')

### Example: Triangle with Equal Sides

```javascript
WSOG.register('my-triangle', function(fig){
  const svg = fig.querySelector('svg');
  const ticksGroup = svg.querySelector('#ticks-group');

  // Triangle vertices
  const A = { x: 0, y: 0 };
  const B = { x: 180, y: 0 };
  const C = { x: 90, y: 155.88 };

  // Add single tick to AB (first equal side)
  WSOG.helpers.createSideTicks(ticksGroup, A.x, A.y, B.x, B.y, 1);

  // Add double ticks to AC (second equal side)
  WSOG.helpers.createSideTicks(ticksGroup, A.x, A.y, C.x, C.y, 2);

  // Add triple ticks to BC (third equal side)
  WSOG.helpers.createSideTicks(ticksGroup, B.x, B.y, C.x, C.y, 3);
});
```

### Usage in Animations

You can add the `fade` class and control visibility:

```javascript
const ticks = WSOG.helpers.createSideTicks(ticksGroup, x1, y1, x2, y2, 2, {
  className: 'line path-default tick fade'
});

// Later, reveal them
setTimeout(() => ticks.classList.remove('fade'), 1000);
```

## 2. Creating Angle Arcs

### Syntax

```javascript
WSOG.helpers.createAngleArc(parent, vx, vy, p1x, p1y, p2x, p2y, radius, options)
```

### Parameters

- `parent` (SVGElement) - Parent SVG group to append arc to
- `vx, vy` (numbers) - Vertex coordinates
- `p1x, p1y` (numbers) - Point on first ray
- `p2x, p2y` (numbers) - Point on second ray
- `radius` (number) - Radius of the arc
- `options` (object) - Optional styling:
  - `strokeWidth`: width of arc (default: 1)
  - `className`: CSS class to apply (default: 'line path-default')
  - `sweep`: whether to draw the arc in the positive angle direction (default: true)

### Example: Angle in a Triangle

```javascript
WSOG.register('my-triangle', function(fig){
  const svg = fig.querySelector('svg');
  const arcsGroup = svg.querySelector('#arcs-group');

  // Triangle vertices
  const A = { x: 0, y: 0 };
  const B = { x: 180, y: 0 };
  const C = { x: 102.85, y: 122.56 };

  // Add arc at angle A (between rays AB and AC)
  WSOG.helpers.createAngleArc(
    arcsGroup,
    A.x, A.y,     // vertex at A
    B.x, B.y,     // point on ray AB
    C.x, C.y,     // point on ray AC
    20,           // radius
    { strokeWidth: 1, className: 'line path-default' }
  );

  // Add arc at angle B (between rays BA and BC)
  WSOG.helpers.createAngleArc(
    arcsGroup,
    B.x, B.y,     // vertex at B
    A.x, A.y,     // point on ray BA (towards A)
    C.x, C.y,     // point on ray BC (towards C)
    20,           // radius
    { strokeWidth: 1, className: 'line path-default' }
  );
});
```

### Important Notes on Angle Arcs

1. **Order matters**: The arc is drawn from the first ray towards the second ray
2. **Use actual points on rays**: Don't just use direction vectors - use actual coordinates of points on each ray
3. **For obtuse or exterior angles**: The function automatically handles angles > 180°

### Example: Exterior Angle

```javascript
// Exterior angle at C between rays CA and CD
// where D is beyond C on line BC extended
const A = { x: 0, y: 0 };
const C = { x: 110, y: 140 };
const D = { x: 89, y: 182 };  // on extension of BC

WSOG.helpers.createAngleArc(
  arcsGroup,
  C.x, C.y,     // vertex
  A.x, A.y,     // point on ray CA
  D.x, D.y,     // point on ray CD (extended)
  26,           // slightly larger radius
  { strokeWidth: 1.2 }
);
```

## 3. Complete Example: Congruent Triangles

Here's a complete example showing both utilities together:

```javascript
WSOG.register('i4-sas-demo', function(fig){
  const q = sel => fig.querySelector(sel);
  const svg = q('svg');

  // Create groups for our generated elements
  const ticksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  ticksGroup.setAttribute('id', 'generated-ticks');
  ticksGroup.setAttribute('class', 'fade'); // Start hidden
  svg.appendChild(ticksGroup);

  const arcsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  arcsGroup.setAttribute('id', 'generated-arcs');
  svg.appendChild(arcsGroup);

  // Triangle ABC coordinates
  const A = { x: 0, y: 0 };
  const B = { x: 180, y: 0 };
  const C = { x: 102.85, y: 122.56 };

  // Add angle arc at A
  WSOG.helpers.createAngleArc(
    arcsGroup, A.x, A.y, B.x, B.y, C.x, C.y, 20
  );

  // Add single tick mark on AB
  WSOG.helpers.createSideTicks(ticksGroup, A.x, A.y, B.x, B.y, 1);

  // Add double tick marks on AC
  WSOG.helpers.createSideTicks(ticksGroup, A.x, A.y, C.x, C.y, 2);

  // Button to reveal ticks
  const btnStep = q('[data-role="step"]');
  btnStep?.addEventListener('click', () => {
    ticksGroup.classList.remove('fade');
  });
});
```

## 4. Replacing Hardcoded SVG

### Before (Hardcoded):

```html
<g id="arcs">
  <!-- Manually calculated arc - may be incorrect! -->
  <path d="M162,0 A18,18 0 0 1 171.95,16.10"
        class="line path-default"
        fill="none"
        stroke-width="1"/>
</g>
```

### After (Programmatic):

```javascript
const arcsGroup = svg.querySelector('#arcs');
arcsGroup.innerHTML = ''; // Clear hardcoded arcs

// Generate correct arc
WSOG.helpers.createAngleArc(
  arcsGroup,
  B.x, B.y,   // vertex B at (180, 0)
  A.x, A.y,   // point A on ray BA
  C.x, C.y,   // point C on ray BC
  18
);
```

## 5. Benefits

1. **Correctness**: Mathematical calculations ensure arcs and ticks are always positioned correctly
2. **Consistency**: All figures use the same tick spacing and arc rendering
3. **Maintainability**: Change one function instead of editing SVG paths manually
4. **Flexibility**: Easy to adjust size, count, or styling
5. **Animation-ready**: Generated elements can be styled with CSS classes like `fade`, `reveal`, etc.

## 6. Integration with Existing Figures

To update an existing figure:

1. Add `data-figure` attribute to the HTML
2. Create a new JS file in `scripts/figures/`
3. Use `WSOG.register()` to define initialization
4. Query existing SVG groups and replace hardcoded elements with programmatic ones
5. Reference the new script in `index.html` head

See `scripts/figures/i16-demo.js` for a complete working example.
