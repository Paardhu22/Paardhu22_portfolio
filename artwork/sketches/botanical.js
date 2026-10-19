// Hyperreal Botanical Plate & Phyllotactic Study: Ananas comosus (Apex View)
// Sepia & burnt-umber ink hatching/cross-hatching with graphite construction overlay

const CX = 600;
const CY = 600;
const GOLDEN_ANGLE_RAD = Math.PI * (3 - Math.sqrt(5)); // ~2.39996323 rad (137.507764 deg)
const GOLDEN_ANGLE_DEG = 137.50776405;

// Light vector: strong raking studio light from upper-left
const LIGHT_DIR = (() => {
  let lx = -0.64, ly = -0.64, lz = 0.425;
  let len = Math.hypot(lx, ly, lz);
  return { x: lx / len, y: ly / len, z: lz / len };
})();

// High-contrast palette: antique buff paper, sepia, burnt umber, bistre, graphite
const PAL = {
  paperBase: "#eadbc2",
  paperWarm: "#e1cea8",
  paperLight: "#f4ead6",
  paperEdge: "#d2bc96",
  highlight: "#fbf5e6",
  ochreLight: "#d9b482",
  ochreMid: "#b88449",
  rawUmber: "#8a532b",
  burntUmber: "#592b12",
  sepiaDark: "#381909",
  bistreBlack: "#1b0b04",
  chaffPale: "#e5d0ad",
  pencilDark: "#3d3a35",
  pencilMid: "#59544d",
  pencilLight: "#787268",
  pencilSheen: "#9e9689" // silvery graphite reflection over dark ink
};

// Hershey-style single-stroke vector font for scientific plate annotations
const GLYPHS = {
  "0": [[[0.2,0],[0.8,0],[1,0.2],[1,0.8],[0.8,1],[0.2,1],[0,0.8],[0,0.2],[0.2,0]], [[0.15,0.8],[0.85,0.2]]],
  "1": [[[0.2,0.2],[0.5,0],[0.5,1]], [[0.2,1],[0.8,1]]],
  "2": [[[0.05,0.25],[0.25,0],[0.75,0],[0.95,0.2],[0.95,0.4],[0.05,1],[1,1]]],
  "3": [[[0.1,0.15],[0.3,0],[0.75,0],[0.95,0.2],[0.95,0.35],[0.7,0.48],[0.4,0.48]], [[0.7,0.48],[0.98,0.65],[0.98,0.82],[0.75,1],[0.25,1],[0.05,0.85]]],
  "4": [[[0.75,1],[0.75,0],[0,0.68],[1,0.68]]],
  "5": [[[0.9,0],[0.15,0],[0.1,0.45],[0.65,0.42],[0.95,0.58],[0.95,0.82],[0.7,1],[0.2,1],[0.05,0.85]]],
  "6": [[[0.85,0.12],[0.65,0],[0.25,0],[0.05,0.25],[0.05,0.8],[0.25,1],[0.75,1],[0.95,0.8],[0.95,0.58],[0.75,0.44],[0.25,0.44],[0.05,0.58]]],
  "7": [[[0,0],[1,0],[0.35,1]]],
  "8": [[[0.3,0.46],[0.1,0.34],[0.1,0.15],[0.3,0],[0.7,0],[0.9,0.15],[0.9,0.34],[0.7,0.46],[0.3,0.46],[0.05,0.62],[0.05,0.84],[0.28,1],[0.72,1],[0.95,0.84],[0.95,0.62],[0.7,0.46]]],
  "9": [[[0.95,0.42],[0.75,0.56],[0.25,0.56],[0.05,0.42],[0.05,0.18],[0.25,0],[0.75,0],[0.95,0.2],[0.95,0.78],[0.7,1],[0.3,1],[0.12,0.88]]],
  "A": [[[0,1],[0.5,0],[1,1]], [[0.18,0.66],[0.82,0.66]]],
  "B": [[[0.1,0],[0.1,1]], [[0.1,0],[0.7,0],[0.9,0.14],[0.9,0.34],[0.7,0.48],[0.1,0.48]], [[0.7,0.48],[0.95,0.62],[0.95,0.85],[0.72,1],[0.1,1]]],
  "C": [[[0.95,0.2],[0.75,0],[0.28,0],[0.05,0.22],[0.05,0.78],[0.28,1],[0.75,1],[0.95,0.8]]],
  "D": [[[0.1,0],[0.1,1]], [[0.1,0],[0.65,0],[0.95,0.25],[0.95,0.75],[0.65,1],[0.1,1]]],
  "E": [[[0.9,0],[0.1,0],[0.1,1],[0.9,1]], [[0.1,0.48],[0.72,0.48]]],
  "F": [[[0.9,0],[0.1,0],[0.1,1]], [[0.1,0.48],[0.72,0.48]]],
  "G": [[[0.95,0.2],[0.75,0],[0.28,0],[0.05,0.22],[0.05,0.78],[0.28,1],[0.78,1],[0.95,0.82],[0.95,0.52],[0.55,0.52]]],
  "H": [[[0.1,0],[0.1,1]], [[0.9,0],[0.9,1]], [[0.1,0.48],[0.9,0.48]]],
  "I": [[[0.2,0],[0.8,0]], [[0.5,0],[0.5,1]], [[0.2,1],[0.8,1]]],
  "J": [[[0.2,0],[0.85,0]], [[0.65,0],[0.65,0.8],[0.45,1],[0.18,1],[0.05,0.82]]],
  "K": [[[0.1,0],[0.1,1]], [[0.9,0],[0.1,0.52]], [[0.35,0.38],[0.95,1]]],
  "L": [[[0.1,0],[0.1,1],[0.9,1]]],
  "M": [[[0.05,1],[0.05,0],[0.5,0.62],[0.95,0],[0.95,1]]],
  "N": [[[0.08,1],[0.08,0],[0.92,1],[0.92,0]]],
  "O": [[[0.28,0],[0.72,0],[0.95,0.22],[0.95,0.78],[0.72,1],[0.28,1],[0.05,0.78],[0.05,0.22],[0.28,0]]],
  "P": [[[0.1,1],[0.1,0],[0.72,0],[0.95,0.16],[0.95,0.38],[0.72,0.54],[0.1,0.54]]],
  "Q": [[[0.28,0],[0.72,0],[0.95,0.22],[0.95,0.78],[0.72,1],[0.28,1],[0.05,0.78],[0.05,0.22],[0.28,0]], [[0.55,0.68],[1,1.05]]],
  "R": [[[0.1,1],[0.1,0],[0.72,0],[0.95,0.16],[0.95,0.36],[0.72,0.5],[0.1,0.5]], [[0.55,0.5],[0.95,1]]],
  "S": [[[0.92,0.18],[0.72,0],[0.25,0],[0.05,0.16],[0.05,0.34],[0.25,0.46],[0.75,0.54],[0.95,0.68],[0.95,0.85],[0.72,1],[0.25,1],[0.05,0.82]]],
  "T": [[[0,0],[1,0]], [[0.5,0],[0.5,1]]],
  "U": [[[0.08,0],[0.08,0.78],[0.28,1],[0.72,1],[0.92,0.78],[0.92,0]]],
  "V": [[[0.05,0],[0.5,1],[0.95,0]]],
  "W": [[[0.02,0],[0.26,1],[0.5,0.35],[0.74,1],[0.98,0]]],
  "X": [[[0.05,0],[0.95,1]], [[0.95,0],[0.05,1]]],
  "Y": [[[0.05,0],[0.5,0.5],[0.95,0]], [[0.5,0.5],[0.5,1]]],
  "Z": [[[0.05,0],[0.95,0],[0.05,1],[0.95,1]]],
  ".": [[[0.4,0.88],[0.6,0.88],[0.6,1],[0.4,1],[0.4,0.88]]],
  ",": [[[0.55,0.85],[0.4,1.15]]],
  ":": [[[0.4,0.25],[0.6,0.25],[0.6,0.38],[0.4,0.38],[0.4,0.25]], [[0.4,0.78],[0.6,0.78],[0.6,0.9],[0.4,0.9],[0.4,0.78]]],
  "-": [[[0.15,0.5],[0.85,0.5]]],
  "+": [[[0.5,0.18],[0.5,0.82]], [[0.15,0.5],[0.85,0.5]]],
  "=": [[[0.15,0.36],[0.85,0.36]], [[0.15,0.64],[0.85,0.64]]],
  "/": [[[0.85,0],[0.15,1]]],
  "(": [[[0.68,0],[0.35,0.28],[0.35,0.72],[0.68,1]]],
  ")": [[[0.32,0],[0.65,0.28],[0.65,0.72],[0.32,1]]],
  "°": [[[0.3,0],[0.7,0],[0.88,0.18],[0.7,0.36],[0.3,0.36],[0.12,0.18],[0.3,0]]],
  "'": [[[0.5,0],[0.4,0.32]]],
  "\"": [[[0.3,0],[0.22,0.32]], [[0.7,0],[0.62,0.32]]],
  "Ψ": [[[0.5,0],[0.5,1]], [[0.08,0.15],[0.08,0.45],[0.28,0.62],[0.72,0.62],[0.92,0.45],[0.92,0.15]], [[0.28,1],[0.72,1]]],
  "φ": [[[0.55,0.05],[0.42,1.05]], [[0.3,0.28],[0.72,0.28],[0.92,0.45],[0.92,0.68],[0.72,0.82],[0.28,0.82],[0.08,0.68],[0.08,0.45],[0.3,0.28]]],
  "×": [[[0.15,0.2],[0.85,0.8]], [[0.85,0.2],[0.15,0.8]]]
};

async function setup() {
  createCanvas(1200, 1200, WEBGL);
  angleMode(DEGREES);
  brush.scaleBrushes(3);
  randomSeed(81321);
  noiseSeed(81321);

  // Register custom fine copperplate/botanical engraving & stipple brushes
  brush.add("engraver", {
    type: "default",
    weight: 0.72,
    scatter: 0.02,
    sharpness: 0.88,
    grain: 14,
    opacity: 225,
    spacing: 0.22,
    pressure: [0.35, 1.15, 0.3],
    noise: 0.32
  });

  brush.add("fine_nib", {
    type: "default",
    weight: 0.52,
    scatter: 0.015,
    sharpness: 0.92,
    grain: 10,
    opacity: 210,
    spacing: 0.2,
    pressure: [0.3, 1.0, 0.25],
    noise: 0.25
  });

  brush.add("draft_lead", {
    type: "default",
    weight: 0.58,
    scatter: 0.04,
    sharpness: 0.78,
    grain: 18,
    opacity: 175,
    spacing: 0.24,
    pressure: [0.65, 1.0, 0.65],
    noise: 0.45
  });
}

function draw() {
  translate(-width / 2, -height / 2);

  // 1. Prepare warm buff paper ground & antique plate frame
  drawPaperGround();

  // 2. Build phyllotaxis sites & Voronoi scale geometry
  const geo = buildPineappleGeometry();

  // 3. Render trompe-l'oeil drop shadow on the paper
  drawCastShadow(geo);

  // 4. Batch render watercolor/ink undertone washes across all scales
  drawScaleBaseWashes(geo);

  // 5. Render hyperreal warty relief, sutures, bracts & cross-hatching per eye
  drawAllScalesInk(geo);

  // 6. Render central cut-away spiky crown scar & fibrous peduncle core
  drawCutCrownCore(geo);

  // 7. Render graphite construction overlay: spirals, golden-angle protractor, annotations
  drawDiagramOverlay(geo);

  noLoop();
}

// ============================================================================
// 1. WARM BUFF PAPER GROUND & PLATE BORDER
// ============================================================================
function drawPaperGround() {
  background(PAL.paperBase);
  brush.noStroke();

  // Subtle organic washes to give warm rag-paper depth
  brush.fill(PAL.paperWarm, 42);
  brush.fillBleed(0.35, "out");
  brush.fillTexture(0.55, 0.2);
  brush.rect(40, 40, 1120, 1120, "corner");

  brush.fill(PAL.paperLight, 50);
  brush.fillBleed(0.4, "out");
  brush.circle(480, 460, 460, 0.15);
  brush.noFill();

  // Corner vignette washes
  let corners = [[120, 120], [1080, 120], [120, 1080], [1080, 1080]];
  for (let c of corners) {
    let p = makeCirclePoly(c[0], c[1], 240, 16);
    new brush.Polygon(p).wash(PAL.paperEdge, 18);
  }

  // Fine paper fibers & foxing speckles
  brush.set("2H", "#bfa57e", 0.22);
  for (let i = 0; i < 420; i++) {
    let x = random(25, 1175);
    let y = random(25, 1175);
    let a = random(0, 360) * Math.PI / 180;
    let l = random(2, 7);
    brush.line(x, y, x + Math.cos(a) * l, y + Math.sin(a) * l);
  }

  // Debossed copperplate outer frame & inner scientific border
  brush.set("draft_lead", "#b59d78", 0.35);
  drawRectLines(42, 42, 1116, 1116);
  brush.set("draft_lead", "#fbf3e4", 0.32);
  drawRectLines(44, 44, 1116, 1116);

  brush.set("draft_lead", PAL.pencilLight, 0.26);
  drawRectLines(58, 58, 1084, 1084);
}

function drawRectLines(x, y, w, h) {
  brush.line(x, y, x + w, y);
  brush.line(x + w, y, x + w, y + h);
  brush.line(x + w, y + h, x, y + h);
  brush.line(x, y + h, x, y);
}

// ============================================================================
// 2. PHYLLOTAXIS & VORONOI SCALE GEOMETRY
// ============================================================================
function buildPineappleGeometry() {
  const N_START = 6;   // First full scale outside cut crown
  const N_END = 158;   // Outermost equator scale
  const N_GHOST = 184; // Ghost ring for clean outer Voronoi closure
  const R_MAX = 414;

  let sites = [];
  for (let n = 0; n <= N_GHOST; n++) {
    let u = Math.pow(n / N_END, 0.585);
    // Orthographic dome projection: steady growth near crown, foreshortened near rim
    let domeR = (n === 0) ? 0 : R_MAX * (0.76 * u + 0.24 * Math.sin(Math.min(u, 1.18) * 1.34));
    let ang = n * GOLDEN_ANGLE_RAD;
    let x = CX + Math.cos(ang) * domeR;
    let y = CY + Math.sin(ang) * domeR;
    sites.push({ n, u, r: domeR, ang, x, y });
  }

  let scales = [];
  for (let n = N_START; n <= N_END; n++) {
    let s = sites[n];
    // Start with local bounding octagon around site
    let boxR = 95;
    let poly = [];
    for (let k = 0; k < 8; k++) {
      let a = k * Math.PI / 4;
      poly.push({ x: s.x + Math.cos(a) * boxR, y: s.y + Math.sin(a) * boxR });
    }

    // Clip against perpendicular bisectors of nearby sites
    for (let m = 1; m <= N_GHOST; m++) {
      if (m === n) continue;
      let o = sites[m];
      let dx = o.x - s.x;
      let dy = o.y - s.y;
      if (dx * dx + dy * dy > 165 * 165) continue;
      poly = clipPolygonBisector(poly, s.x, s.y, o.x, o.y);
      if (poly.length < 3) break;
    }

    // Compute centroid & average radius of scale cell
    let cx = 0, cy = 0;
    for (let p of poly) { cx += p.x; cy += p.y; }
    cx /= poly.length;
    cy /= poly.length;

    let radialAng = Math.atan2(cy - CY, cx - CX);
    let distFromCenter = Math.hypot(cx - CX, cy - CY);
    let isRim = n > 137;

    // For outer rim scales, bulge the outward-facing vertices to create an organic scalloped silhouette
    if (isRim) {
      for (let p of poly) {
        let pDist = Math.hypot(p.x - CX, p.y - CY);
        if (pDist > distFromCenter + 2) {
          let pAng = Math.atan2(p.y - CY, p.x - CX);
          let bulge = map(n, 138, N_END, 3, 9.5);
          p.x += Math.cos(pAng) * bulge;
          p.y += Math.sin(pAng) * bulge;
        }
      }
    }

    // Build organic subdivided cushion boundary (inset slightly for suture groove + warty lobes)
    let cushionPts = [];
    let numVerts = poly.length;
    let lobeFreq = numVerts; // 5 or 6 radial cushion lobes matching polygon corners
    for (let i = 0; i < numVerts; i++) {
      let v0 = poly[i];
      let v1 = poly[(i + 1) % numVerts];
      let steps = 5;
      for (let st = 0; st < steps; st++) {
        let t = st / steps;
        let px = lerp(v0.x, v1.x, t);
        let py = lerp(v0.y, v1.y, t);
        // Pull slightly toward center for deep inter-scale furrow, more at mid-edges, less at corners
        let edgePinch = Math.sin(t * Math.PI) * 0.065;
        let inset = 0.915 - edgePinch + (noise(px * 0.04, py * 0.04) - 0.5) * 0.04;
        cushionPts.push({
          x: cx + (px - cx) * inset,
          y: cy + (py - cy) * inset
        });
      }
    }

    // Compute 3D global normal on the pineapple spheroid
    let nxG = (cx - CX) / (R_MAX * 1.03);
    let nyG = (cy - CY) / (R_MAX * 1.03);
    let nzSq = 1 - nxG * nxG - nyG * nyG;
    let nzG = Math.sqrt(Math.max(0.06, nzSq));
    let globalIllum = Math.max(0, nxG * LIGHT_DIR.x + nyG * LIGHT_DIR.y + nzG * LIGHT_DIR.z);
    // Add subtle rim bounce light in deep shadow
    let rimLight = (1 - nzG) * Math.max(0, (nxG * 0.7 + nyG * 0.7)) * 0.12;
    globalIllum = constrain(globalIllum + rimLight, 0.03, 1.0);

    // Average scale radius
    let scaleRad = 0;
    for (let p of poly) scaleRad += Math.hypot(p.x - cx, p.y - cy);
    scaleRad /= poly.length;

    // Bract center (shifted slightly along radial dome tilt)
    let bractX = cx + Math.cos(radialAng) * (scaleRad * 0.06);
    let bractY = cy + Math.sin(radialAng) * (scaleRad * 0.06);

    scales.push({
      n,
      site: s,
      poly,
      cushionPts,
      cx,
      cy,
      bractX,
      bractY,
      scaleRad,
      radialAng,
      distFromCenter,
      nxG,
      nyG,
      nzG,
      globalIllum,
      lobeFreq,
      isRim
    });
  }

  return { sites, scales, N_START, N_END, R_MAX };
}

function clipPolygonBisector(poly, px, py, qx, qy) {
  let mx = (px + qx) * 0.5;
  let my = (py + qy) * 0.5;
  let nx = qx - px;
  let ny = qy - py;
  let out = [];
  let len = poly.length;
  for (let i = 0; i < len; i++) {
    let a = poly[i];
    let b = poly[(i + 1) % len];
    let da = (a.x - mx) * nx + (a.y - my) * ny;
    let db = (b.x - mx) * nx + (b.y - my) * ny;
    if (da <= 0) out.push(a);
    if ((da <= 0 && db > 0) || (da > 0 && db <= 0)) {
      let t = da / (da - db);
      out.push({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
    }
  }
  return out;
}

function makeCirclePoly(cx, cy, r, steps) {
  let pts = [];
  for (let i = 0; i < steps; i++) {
    let a = (i / steps) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

// ============================================================================
// 3. TROMPE-L'OEIL DROP SHADOW ON THE BUFF PAPER
// ============================================================================
function drawCastShadow(geo) {
  // Cast shadow shifted toward lower-right (+45 deg)
  let shX = CX + 44;
  let shY = CY + 46;
  let shR = geo.R_MAX + 16;

  // Soft layered washes for shadow penumbra and umbra
  for (let pass = 0; pass < 4; pass++) {
    let r = shR + (3 - pass) * 14;
    let ox = shX + pass * 4;
    let oy = shY + pass * 4;
    let pts = [];
    for (let i = 0; i < 48; i++) {
      let a = (i / 48) * Math.PI * 2;
      let stretch = 1 + Math.max(0, Math.cos(a - Math.PI * 0.25)) * 0.08;
      pts.push([ox + Math.cos(a) * r * stretch, oy + Math.sin(a) * r * stretch]);
    }
    let col = pass < 2 ? "#c7af88" : (pass === 2 ? "#ab8c64" : "#876642");
    let op = pass === 0 ? 28 : (pass === 1 ? 38 : (pass === 2 ? 48 : 55));
    new brush.Polygon(pts).wash(col, op);
  }

  // Engraved parallel & cross-hatched shadow lines outside the lower-right rim
  brush.set("engraver", PAL.rawUmber, 0.26);
  for (let i = -380; i <= 380; i += 4.2) {
    // Lines at -45 deg angle across the shadow crescent
    let x0 = shX + i * 0.707 - 480 * 0.707;
    let y0 = shY + i * 0.707 + 480 * 0.707;
    let x1 = shX + i * 0.707 + 480 * 0.707;
    let y1 = shY + i * 0.707 - 480 * 0.707;

    // Sample segments that fall inside the shadow crescent but outside the pineapple body
    let steps = 70;
    let inSeg = false;
    let sx = 0, sy = 0;
    for (let s = 0; s <= steps; s++) {
      let t = s / steps;
      let px = lerp(x0, x1, t);
      let py = lerp(y0, y1, t);
      let dFruit = Math.hypot(px - CX, py - CY);
      let dShad = Math.hypot((px - shX) * 0.94, (py - shY) * 0.94);
      let inside = (dFruit > geo.R_MAX - 8) && (dShad < shR + 18) && (px + py > CX + CY - 60);
      if (inside && !inSeg) {
        inSeg = true;
        sx = px;
        sy = py;
      } else if (!inside && inSeg) {
        inSeg = false;
        let prevX = lerp(x0, x1, (s - 1) / steps);
        let prevY = lerp(y0, y1, (s - 1) / steps);
        brush.line(sx, sy, prevX, prevY);
      }
    }
  }

  // Second steeper cross-hatch pass right against the dark fruit rim
  brush.set("engraver", PAL.burntUmber, 0.28);
  for (let aDeg = -25; aDeg <= 115; aDeg += 1.4) {
    let a = aDeg * Math.PI / 180;
    let rInner = geo.R_MAX - 2;
    let reach = Math.max(0, Math.cos(a - Math.PI * 0.25));
    let rOuter = rInner + 12 + reach * 48 + (noise(aDeg * 0.1) - 0.5) * 10;
    if (rOuter > rInner + 6) {
      let x1 = CX + Math.cos(a) * rInner;
      let y1 = CY + Math.sin(a) * rInner;
      let x2 = CX + Math.cos(a + 0.06) * rOuter;
      let y2 = CY + Math.sin(a + 0.06) * rOuter;
      brush.line(x1, y1, x2, y2);
    }
  }
}

// ============================================================================
// 4. BATCHED WATERCOLOR / INK UNDERTONE WASHES
// ============================================================================
function drawScaleBaseWashes(geo) {
  // First: overall spherical undertone washes on the pineapple body
  let bodyPoly = makeCirclePoly(CX, CY, geo.R_MAX - 3, 60);
  new brush.Polygon(bodyPoly).wash(PAL.ochreLight, 45);

  // Shadow hemisphere undertone
  let shadPoly = [];
  for (let i = 0; i < 60; i++) {
    let a = (i / 60) * Math.PI * 2;
    let r = (geo.R_MAX - 4) * (0.65 + 0.35 * Math.max(0, Math.cos(a - Math.PI * 0.25)));
    shadPoly.push([CX + 45 + Math.cos(a) * r * 0.85, CY + 45 + Math.sin(a) * r * 0.85]);
  }
  new brush.Polygon(shadPoly).wash(PAL.rawUmber, 42);

  // Per-scale base washes batched by tonal tier
  for (let sc of geo.scales) {
    let ptsFull = sc.poly.map(p => [p.x, p.y]);
    let ptsCush = sc.cushionPts.map(p => [p.x, p.y]);
    let g = sc.globalIllum;

    // 1. Deep suture crevice wash (entire Voronoi cell)
    let sutureCol = g > 0.65 ? PAL.rawUmber : (g > 0.35 ? PAL.burntUmber : PAL.sepiaDark);
    let sutureOp = g > 0.65 ? 65 : (g > 0.35 ? 95 : 130);
    new brush.Polygon(ptsFull).wash(sutureCol, sutureOp);

    // 2. Cushion body wash (lighter on sunlit side, rich umber in shadow)
    if (g > 0.68) {
      new brush.Polygon(ptsCush).wash(PAL.paperLight, 95);
    } else if (g > 0.42) {
      new brush.Polygon(ptsCush).wash(PAL.ochreLight, 75);
    } else if (g > 0.22) {
      new brush.Polygon(ptsCush).wash(PAL.ochreMid, 65);
    } else {
      new brush.Polygon(ptsCush).wash(PAL.burntUmber, 72);
    }

    // 3. Lower-right shadow crescent wash inside each scale cushion
    let shCres = [];
    let cLen = sc.cushionPts.length;
    for (let i = 0; i < cLen; i++) {
      let cp = sc.cushionPts[i];
      let ang = Math.atan2(cp.y - sc.cy, cp.x - sc.cx);
      let dotL = Math.cos(ang - Math.PI * 0.25); // +1 on lower-right
      if (dotL > -0.2) {
        shCres.push([cp.x, cp.y]);
      } else {
        shCres.push([
          lerp(sc.cx, cp.x, 0.35),
          lerp(sc.cy, cp.y, 0.35)
        ]);
      }
    }
    let cresCol = g > 0.55 ? PAL.ochreMid : (g > 0.3 ? PAL.burntUmber : PAL.sepiaDark);
    let cresOp = map(g, 0, 1, 95, 38);
    new brush.Polygon(shCres).wash(cresCol, cresOp);
  }
}

// ============================================================================
// 5. HYPERREAL WARTY RELIEF, SUTURES, BRACTS & CROSS-HATCHING PER SCALE
// ============================================================================
function drawAllScalesInk(geo) {
  // Sort scales from outer rim to inner crown so overlapping bracts layer naturally
  let ordered = [...geo.scales].sort((a, b) => b.n - a.n);

  for (let sc of ordered) {
    drawSingleScale(sc);
  }
}

function drawSingleScale(sc) {
  const g = sc.globalIllum;
  const cx = sc.cx;
  const cy = sc.cy;
  const R = sc.scaleRad;

  // --- A. DEEP INTER-SCALE SUTURE FURROWS & TRICHOME CHAFF ---
  let sutureCol = g > 0.55 ? PAL.burntUmber : (g > 0.25 ? PAL.sepiaDark : PAL.bistreBlack);
  brush.set("engraver", sutureCol, g > 0.55 ? 0.38 : 0.48);

  let cPts = sc.cushionPts;
  let cLen = cPts.length;
  for (let i = 0; i < cLen; i++) {
    let p0 = cPts[i];
    let p1 = cPts[(i + 1) % cLen];
    brush.line(p0.x, p0.y, p1.x, p1.y);

    // Short perpendicular stitch-hatches plunging into the suture crevice
    if (i % 2 === 0) {
      let mx = (p0.x + p1.x) * 0.5;
      let my = (p0.y + p1.y) * 0.5;
      let vx = mx - cx;
      let vy = my - cy;
      let vLen = Math.hypot(vx, vy) || 1;
      let tickL = R * 0.13;
      brush.line(mx, my, mx + (vx / vLen) * tickL, my + (vy / vLen) * tickL);
    }
  }

  // Pale chaff / trichome stipples at polygon vertex junctions
  brush.set("fine_nib", g > 0.4 ? PAL.chaffPale : PAL.ochreLight, 0.32);
  for (let v of sc.poly) {
    for (let k = 0; k < 3; k++) {
      let ox = (random() - 0.5) * 4.5;
      let oy = (random() - 0.5) * 4.5;
      brush.line(v.x + ox, v.y + oy, v.x + ox + 1.4, v.y + oy + 1.2);
    }
  }

  // --- B. MULTI-PASS 3D RELIEF HATCHING & CROSS-HATCHING ON THE CUSHION ---
  // Divide the cushion into concentric rings and angular sectors around the bract
  const numSectors = 26;
  const numRings = 5;

  for (let rIdx = 1; rIdx <= numRings; rIdx++) {
    let rFrac0 = (rIdx - 0.3) / (numRings + 0.5);
    let rFrac1 = (rIdx + 0.55) / (numRings + 0.5);

    for (let sIdx = 0; sIdx < numSectors; sIdx++) {
      let a0 = (sIdx / numSectors) * Math.PI * 2;
      let a1 = ((sIdx + 1) / numSectors) * Math.PI * 2;
      let aMid = (a0 + a1) * 0.5;

      // Interpolate boundary distance in direction aMid
      let boundaryR = getCushionRadiusAtAngle(sc, aMid);

      // Local 3D normal of the swollen, ribbed cushion at (rFrac, aMid)
      // Cushion slopes outward near the edge and ripples with 5-6 radial ribs
      let ribWave = Math.cos(aMid * sc.lobeFreq + sc.n * 0.7) * 0.24;
      let slopeMag = Math.sin(rFrac0 * Math.PI * 0.85) * 0.68;
      let nxL = Math.cos(aMid) * slopeMag - Math.sin(aMid) * ribWave;
      let nyL = Math.sin(aMid) * slopeMag + Math.cos(aMid) * ribWave;
      let nzL = Math.sqrt(Math.max(0.1, 1 - nxL * nxL - nyL * nyL));

      // Combine global sphere normal with local scale cushion normal
      let nx = sc.nxG * 0.58 + nxL * 0.42;
      let ny = sc.nyG * 0.58 + nyL * 0.42;
      let nz = sc.nzG * 0.58 + nzL * 0.42;
      let nLen = Math.hypot(nx, ny, nz) || 1;
      nx /= nLen; ny /= nLen; nz /= nLen;

      // Local illumination + crevice ambient occlusion near outer ring
      let edgeAO = rIdx === numRings ? 0.76 : 1.0;
      // Shadow cast by central bract onto lower-right inner rings
      let bractShadow = (rIdx <= 2 && Math.cos(aMid - Math.PI * 0.25) > 0.35) ? 0.58 : 1.0;
      let wartNoise = (noise(cx * 0.08 + Math.cos(aMid) * rIdx, cy * 0.08 + Math.sin(aMid) * rIdx) - 0.5) * 0.16;

      let localIllum = constrain(
        (nx * LIGHT_DIR.x + ny * LIGHT_DIR.y + nz * LIGHT_DIR.z) * edgeAO * bractShadow + wartNoise,
        0.0, 1.0
      );

      let radMid = boundaryR * ((rFrac0 + rFrac1) * 0.5);
      let px = sc.bractX + Math.cos(aMid) * radMid;
      let py = sc.bractY + Math.sin(aMid) * radMid;

      // PASS 1: Circumferential form-following contour hatching (warm sepia / raw umber)
      if (localIllum < 0.82) {
        let col1 = localIllum > 0.52 ? PAL.rawUmber : PAL.burntUmber;
        let w1 = map(localIllum, 0, 0.82, 0.42, 0.18);
        brush.set("fine_nib", col1, w1);
        let xA = sc.bractX + Math.cos(a0) * radMid;
        let yA = sc.bractY + Math.sin(a0) * radMid;
        let xB = sc.bractX + Math.cos(a1) * radMid;
        let yB = sc.bractY + Math.sin(a1) * radMid;
        brush.line(xA, yA, xB, yB);
      }

      // PASS 2: Radial rib-following hatching (burnt umber)
      if (localIllum < 0.62) {
        let col2 = localIllum > 0.35 ? PAL.burntUmber : PAL.sepiaDark;
        let w2 = map(localIllum, 0, 0.62, 0.44, 0.2);
        brush.set("engraver", col2, w2);
        let rIn = boundaryR * rFrac0;
        let rOut = boundaryR * rFrac1;
        brush.line(
          sc.bractX + Math.cos(aMid) * rIn,
          sc.bractY + Math.sin(aMid) * rIn,
          sc.bractX + Math.cos(aMid) * rOut,
          sc.bractY + Math.sin(aMid) * rOut
        );
      }

      // PASS 3: Oblique diagonal cross-hatching in shadow zones (deep sepia)
      if (localIllum < 0.42) {
        brush.set("engraver", PAL.sepiaDark, map(localIllum, 0, 0.42, 0.48, 0.24));
        let diagL = boundaryR * 0.14;
        let dAng = aMid + Math.PI * 0.28;
        brush.line(
          px - Math.cos(dAng) * diagL,
          py - Math.sin(dAng) * diagL,
          px + Math.cos(dAng) * diagL,
          py + Math.sin(dAng) * diagL
        );
      }

      // PASS 4: Deepest core-shadow counter-cross-hatching (bistre black-brown)
      if (localIllum < 0.24) {
        brush.set("engraver", PAL.bistreBlack, map(localIllum, 0, 0.24, 0.52, 0.28));
        let diagL = boundaryR * 0.14;
        let dAng2 = aMid - Math.PI * 0.28;
        brush.line(
          px - Math.cos(dAng2) * diagL,
          py - Math.sin(dAng2) * diagL,
          px + Math.cos(dAng2) * diagL,
          py + Math.sin(dAng2) * diagL
        );
      }

      // PASS 5: Specular buff highlights on sunlit upper-left cushion ridges
      if (localIllum > 0.76 && rIdx >= 2 && rIdx <= 4) {
        brush.set("fine_nib", PAL.highlight, map(localIllum, 0.76, 1.0, 0.22, 0.42));
        let hL = boundaryR * 0.09;
        brush.line(
          px - Math.cos(aMid + 1.57) * hL,
          py - Math.sin(aMid + 1.57) * hL,
          px + Math.cos(aMid + 1.57) * hL,
          py + Math.sin(aMid + 1.57) * hL
        );
      }
    }
  }

  // --- C. WARTY TUBERCLES & RUGOSE SKIN TEXTURE ---
  let numWarts = 9;
  for (let w = 0; w < numWarts; w++) {
    let wAng = (w / numWarts) * Math.PI * 2 + (sc.n * 0.37);
    let wDist = R * (0.42 + (w % 3) * 0.14);
    let wx = sc.bractX + Math.cos(wAng) * wDist;
    let wy = sc.bractY + Math.sin(wAng) * wDist;
    let wRad = R * (0.055 + (w % 2) * 0.025);

    // Shadow crescent on lower-right of wart
    brush.set("fine_nib", g > 0.45 ? PAL.burntUmber : PAL.bistreBlack, 0.32);
    let sx0 = wx + Math.cos(0.2) * wRad;
    let sy0 = wy + Math.sin(0.2) * wRad;
    let sx1 = wx + Math.cos(0.9) * wRad;
    let sy1 = wy + Math.sin(0.9) * wRad;
    let sx2 = wx + Math.cos(1.6) * wRad;
    let sy2 = wy + Math.sin(1.6) * wRad;
    brush.line(sx0, sy0, sx1, sy1);
    brush.line(sx1, sy1, sx2, sy2);

    // Crisp buff highlight dot on upper-left of wart (if in light/midtone)
    if (g > 0.32) {
      brush.set("fine_nib", PAL.highlight, 0.28);
      let hx = wx - wRad * 0.45;
      let hy = wy - wRad * 0.45;
      brush.line(hx, hy, hx + 1.2, hy - 1.0);
    }
  }

  // --- D. CENTRAL FLORAL CAVITY & POINTED SPINY BRACT HOOD ---
  let bAng = sc.radialAng; // Bract points radially outward/upward along dome
  let cavR = R * 0.26;
  let cavX = sc.bractX + Math.cos(bAng) * (R * 0.06);
  let cavY = sc.bractY + Math.sin(bAng) * (R * 0.06);

  // 1. Deep dark floral cavity pit under the bract tip
  let cavPoly = [];
  for (let k = 0; k < 10; k++) {
    let a = (k / 10) * Math.PI * 2;
    let rx = cavR * (0.85 + 0.2 * Math.cos(a - bAng));
    cavPoly.push([cavX + Math.cos(a) * rx, cavY + Math.sin(a) * rx]);
  }
  new brush.Polygon(cavPoly).wash(PAL.bistreBlack, 155);

  // Dense cross-hatching inside floral cavity
  brush.set("engraver", PAL.bistreBlack, 0.42);
  for (let t = -0.8; t <= 0.8; t += 0.32) {
    let perp = bAng + Math.PI * 0.5;
    let ox = cavX + Math.cos(perp) * (cavR * t);
    let oy = cavY + Math.sin(perp) * (cavR * t);
    let span = cavR * Math.sqrt(Math.max(0.1, 1 - t * t)) * 0.85;
    brush.line(
      ox - Math.cos(bAng) * span,
      oy - Math.sin(bAng) * span,
      ox + Math.cos(bAng) * span,
      oy + Math.sin(bAng) * span
    );
  }

  // 2. Overlapping pointed triangular/hooded bract
  let perpAng = bAng + Math.PI * 0.5;
  let baseX = sc.bractX - Math.cos(bAng) * (R * 0.22);
  let baseY = sc.bractY - Math.sin(bAng) * (R * 0.22);
  let tipX = sc.bractX + Math.cos(bAng) * (R * 0.26);
  let tipY = sc.bractY + Math.sin(bAng) * (R * 0.26);
  let wingW = R * 0.25;

  let leftX = baseX + Math.cos(perpAng) * wingW;
  let leftY = baseY + Math.sin(perpAng) * wingW;
  let rightX = baseX - Math.cos(perpAng) * wingW;
  let rightY = baseY - Math.sin(perpAng) * wingW;
  let midLeftX = lerp(leftX, tipX, 0.48) + Math.cos(perpAng) * (wingW * 0.16);
  let midLeftY = lerp(leftY, tipY, 0.48) + Math.sin(perpAng) * (wingW * 0.16);
  let midRightX = lerp(rightX, tipX, 0.48) - Math.cos(perpAng) * (wingW * 0.16);
  let midRightY = lerp(rightY, tipY, 0.48) - Math.sin(perpAng) * (wingW * 0.16);

  let bractPoly = [
    [leftX, leftY],
    [midLeftX, midLeftY],
    [tipX, tipY],
    [midRightX, midRightY],
    [rightX, rightY]
  ];
  let bractWashCol = g > 0.55 ? PAL.paperLight : (g > 0.3 ? PAL.ochreLight : PAL.rawUmber);
  new brush.Polygon(bractPoly).wash(bractWashCol, 135);

  // Longitudinal fibrous striations on the bract hood
  brush.set("fine_nib", g > 0.45 ? PAL.rawUmber : PAL.sepiaDark, 0.26);
  for (let f = -0.85; f <= 0.85; f += 0.28) {
    let bx = baseX + Math.cos(perpAng) * (wingW * f);
    let by = baseY + Math.sin(perpAng) * (wingW * f);
    let tx = lerp(tipX, bx, 0.12);
    let ty = lerp(tipY, by, 0.12);
    brush.line(bx, by, tx, ty);
  }

  // Crisp dark outline & serrated edges on the bract tip
  brush.set("engraver", PAL.bistreBlack, 0.38);
  brush.line(leftX, leftY, midLeftX, midLeftY);
  brush.line(midLeftX, midLeftY, tipX, tipY);
  brush.line(tipX, tipY, midRightX, midRightY);
  brush.line(midRightX, midRightY, rightX, rightY);

  // Highlight edge on the sunlit flank of the bract spine
  if (g > 0.28) {
    brush.set("fine_nib", PAL.highlight, 0.38);
    brush.line(leftX, leftY, tipX, tipY);
  }
}

function getCushionRadiusAtAngle(sc, targetAng) {
  let bestR = sc.scaleRad * 0.85;
  let minDiff = 999;
  for (let p of sc.cushionPts) {
    let a = Math.atan2(p.y - sc.bractY, p.x - sc.bractX);
    let diff = Math.abs( Math.atan2(Math.sin(a - targetAng), Math.cos(a - targetAng)) );
    if (diff < minDiff) {
      minDiff = diff;
      bestR = Math.hypot(p.x - sc.bractX, p.y - sc.bractY);
    }
  }
  return bestR;
}

// ============================================================================
// 6. CENTRAL CUT-AWAY CROWN SCAR & FIBROUS PEDUNCLE CORE
// ============================================================================
function drawCutCrownCore(geo) {
  const coreR = 66;

  // Dark recess around the severed crown collar
  let collarPoly = makeCirclePoly(CX, CY, coreR + 6, 36);
  new brush.Polygon(collarPoly).wash(PAL.sepiaDark, 125);

  // Ring of severed, overlapping spiky leaf bases (spiraling in from coreR to 32px)
  for (let n = 18; n >= 1; n--) {
    let ang = n * GOLDEN_ANGLE_RAD + 0.4;
    let r = map(n, 1, 18, 28, coreR);
    let lx = CX + Math.cos(ang) * r;
    let ly = CY + Math.sin(ang) * r;
    let tang = ang + Math.PI * 0.5;
    let w = map(n, 1, 18, 9, 22);
    let thick = map(n, 1, 18, 4.5, 9.5);

    // Crescent leaf-stub cross-section
    let stubPoly = [];
    for (let k = -4; k <= 4; k++) {
      let t = k / 4;
      let curve = (1 - t * t) * thick;
      let px = lx + Math.cos(tang) * (w * t) + Math.cos(ang) * curve;
      let py = ly + Math.sin(tang) * (w * t) + Math.sin(ang) * curve;
      stubPoly.push([px, py]);
    }
    for (let k = 4; k >= -4; k--) {
      let t = k / 4;
      let curve = (1 - t * t) * (thick * 0.25);
      let px = lx + Math.cos(tang) * (w * t) + Math.cos(ang) * curve;
      let py = ly + Math.sin(tang) * (w * t) + Math.sin(ang) * curve;
      stubPoly.push([px, py]);
    }

    // Pale cut interior wash + dark epidermis outline
    new brush.Polygon(stubPoly).wash(PAL.paperLight, 150);

    brush.set("engraver", PAL.sepiaDark, 0.36);
    for (let i = 0; i < stubPoly.length; i++) {
      let p0 = stubPoly[i];
      let p1 = stubPoly[(i + 1) % stubPoly.length];
      brush.line(p0[0], p0[1], p1[0], p1[1]);
    }

    // Tiny vascular bundle dots along the severed leaf crescent
    brush.set("fine_nib", PAL.burntUmber, 0.3);
    for (let k = -2; k <= 2; k++) {
      let t = k / 3;
      let vx = lx + Math.cos(tang) * (w * t * 0.8) + Math.cos(ang) * (thick * 0.55);
      let vy = ly + Math.sin(tang) * (w * t * 0.8) + Math.sin(ang) * (thick * 0.55);
      brush.line(vx, vy, vx + 1, vy + 1);
    }
  }

  // Central woody peduncle / pith cylinder (r < 27px)
  let pithPoly = makeCirclePoly(CX, CY, 27, 28);
  new brush.Polygon(pithPoly).wash(PAL.ochreLight, 140);
  let innerPith = makeCirclePoly(CX, CY, 18, 24);
  new brush.Polygon(innerPith).wash(PAL.paperLight, 120);

  // Concave shadow on the upper-left inner wall of the cut core
  brush.set("engraver", PAL.burntUmber, 0.32);
  for (let aDeg = 135; aDeg <= 315; aDeg += 6) {
    let a = aDeg * Math.PI / 180;
    let r1 = 19;
    let r2 = 27;
    brush.line(CX + Math.cos(a) * r1, CY + Math.sin(a) * r1, CX + Math.cos(a) * r2, CY + Math.sin(a) * r2);
  }

  // Radial medullary rays and vascular pith stippling
  brush.set("fine_nib", PAL.rawUmber, 0.25);
  for (let aDeg = 0; aDeg < 360; aDeg += 12) {
    let a = aDeg * Math.PI / 180;
    brush.line(CX + Math.cos(a) * 6, CY + Math.sin(a) * 6, CX + Math.cos(a) * 25, CY + Math.sin(a) * 25);
  }
  for (let i = 0; i < 45; i++) {
    let r = random(2, 17);
    let a = random(0, Math.PI * 2);
    let px = CX + Math.cos(a) * r;
    let py = CY + Math.sin(a) * r;
    brush.line(px, py, px + 0.9, py + 0.9);
  }
}

// ============================================================================
// 7. GRAPHITE DIAGRAM OVERLAY: SPIRALS, PROTRACTOR & ANNOTATIONS
// ============================================================================
function drawDiagramOverlay(geo) {
  // --- A. COUNTER-ROTATING PARASTICHY SPIRALS (8 CW & 13 CCW & 21 SECTOR) ---
  // 8-Family Parastichies (winding one way)
  for (let start = 0; start < 8; start++) {
    let chain = [];
    for (let n = geo.N_START + start; n <= geo.N_END; n += 8) {
      let s = geo.sites[n];
      chain.push({ x: s.x, y: s.y, n: n });
    }
    // Extend spiral slightly past rim to protractor inner ring
    if (chain.length >= 2) {
      let last = chain[chain.length - 1];
      let prev = chain[chain.length - 2];
      let dx = last.x - prev.x;
      let dy = last.y - prev.y;
      let len = Math.hypot(dx, dy) || 1;
      let extX = last.x + (dx / len) * 26;
      let extY = last.y + (dy / len) * 26;
      chain.push({ x: extX, y: extY, n: 999 });

      // Label the 8-spiral tip outside the fruit
      let lblX = last.x + (dx / len) * 35;
      let lblY = last.y + (dy / len) * 35;
      drawDraftText("VIII." + (start + 1), lblX - 10, lblY - 4, 6.5, 0, PAL.pencilDark, 0.28);
    }
    drawPencilCurveOverFruit(chain, false, 0.34);
  }

  // 13-Family Parastichies (counter-rotating)
  for (let start = 0; start < 13; start++) {
    let chain = [];
    for (let n = geo.N_START + start; n <= geo.N_END; n += 13) {
      let s = geo.sites[n];
      chain.push({ x: s.x, y: s.y, n: n });
    }
    if (chain.length >= 2) {
      let last = chain[chain.length - 1];
      let prev = chain[chain.length - 2];
      let dx = last.x - prev.x;
      let dy = last.y - prev.y;
      let len = Math.hypot(dx, dy) || 1;
      let extX = last.x + (dx / len) * 20;
      let extY = last.y + (dy / len) * 20;
      chain.push({ x: extX, y: extY, n: 999 });
    }
    drawPencilCurveOverFruit(chain, true, 0.28);
  }

  // --- B. TINY NUMBERED ANNOTATIONS & CENTER CROSSHAIRS ON EVERY EYE ---
  for (let sc of geo.scales) {
    let isShadow = sc.globalIllum < 0.38;
    let pCol = isShadow ? PAL.pencilSheen : PAL.pencilDark;
    let idx = sc.n - geo.N_START + 1; // 1-based botanical index
    let isFib = (idx === 1 || idx === 2 || idx === 3 || idx === 5 || idx === 8 ||
                 idx === 13 || idx === 21 || idx === 34 || idx === 55 || idx === 89 || idx === 144);

    // Tiny drafted crosshair at the geometric site center
    brush.set("draft_lead", pCol, isFib ? 0.34 : 0.22);
    let ch = isFib ? 4.5 : 2.8;
    brush.line(sc.site.x - ch, sc.site.y, sc.site.x + ch, sc.site.y);
    brush.line(sc.site.x, sc.site.y - ch, sc.site.x, sc.site.y + ch);

    if (isFib) {
      // Circle Fibonacci milestone scales
      drawPencilArc(sc.site.x, sc.site.y, 10.5, 0, 360, false, pCol, 0.3);
    }

    // Tiny hand-drafted scale number next to the site center
    if (isFib || idx % 2 === 0 || idx <= 21) {
      let numStr = String(idx);
      let fontSize = isFib ? 7.2 : 5.6;
      let ox = sc.site.x + 5.5;
      let oy = sc.site.y - 7.5;
      drawDraftText(numStr, ox, oy, fontSize, 0, pCol, isFib ? 0.32 : 0.23);
    }
  }

  // --- C. GOLDEN-ANGLE PROTRACTOR & COMPASS RINGS ---
  const R_PROT_1 = 442;
  const R_PROT_2 = 456;
  const R_PROT_3 = 476;
  const R_PROT_4 = 504;

  // Concentric protractor circles
  drawPencilArc(CX, CY, R_PROT_1, 0, 360, false, PAL.pencilMid, 0.32);
  drawPencilArc(CX, CY, R_PROT_2, 0, 360, false, PAL.pencilDark, 0.36);
  drawPencilArc(CX, CY, R_PROT_3, 0, 360, true, PAL.pencilLight, 0.24);
  drawPencilArc(CX, CY, R_PROT_4, 0, 360, false, PAL.pencilMid, 0.30);

  // Degree tick marks every 1°, 5°, and 15°
  for (let deg = 0; deg < 360; deg += 1) {
    let rad = deg * Math.PI / 180;
    let is15 = deg % 15 === 0;
    let is5 = deg % 5 === 0;
    let rIn = R_PROT_1;
    let rOut = is15 ? R_PROT_2 + 5 : (is5 ? R_PROT_2 : R_PROT_1 + 6);
    brush.set("draft_lead", is15 ? PAL.pencilDark : PAL.pencilLight, is15 ? 0.34 : 0.2);
    brush.line(
      CX + Math.cos(rad) * rIn,
      CY + Math.sin(rad) * rIn,
      CX + Math.cos(rad) * rOut,
      CY + Math.sin(rad) * rOut
    );

    // Degree numerals every 15° around the protractor ring
    if (is15) {
      let str = deg + "°";
      let tr = R_PROT_2 + 10;
      let tx = CX + Math.cos(rad) * tr;
      let ty = CY + Math.sin(rad) * tr;
      let tangDeg = deg + 90;
      if (deg > 90 && deg < 270) tangDeg += 180; // Keep text upright
      drawDraftText(str, tx, ty, 6.2, tangDeg, PAL.pencilDark, 0.28, true);
    }
  }

  // --- D. GOLDEN-ANGLE SECTOR CALLOUT (Ψ = 137.508° & 222.492°) ---
  // Datum rays from center through Site #6 (n=6, idx=1) and Site #7 (n=7, idx=2)
  let s1 = geo.sites[geo.N_START];
  let s2 = geo.sites[geo.N_START + 1];
  let ang1Deg = (s1.ang * 180 / Math.PI) % 360;
  let ang2Deg = (s2.ang * 180 / Math.PI) % 360;

  drawRadialConstructionRay(ang1Deg, 0, R_PROT_4 + 18, PAL.pencilDark, 0.38);
  drawRadialConstructionRay(ang2Deg, 0, R_PROT_4 + 18, PAL.pencilDark, 0.38);

  // Secondary divergence rays for idx = 3, 4, 5
  for (let k = 2; k <= 5; k++) {
    let sk = geo.sites[geo.N_START + k];
    let aDeg = (sk.ang * 180 / Math.PI) % 360;
    drawRadialConstructionRay(aDeg, sk.r, R_PROT_1, PAL.pencilLight, 0.22, true);
  }

  // Highlighted Golden Angle dimension arc at R = 490 (between ang1Deg and ang2Deg)
  let R_DIM = 490;
  drawPencilArc(CX, CY, R_DIM, ang1Deg, ang1Deg + GOLDEN_ANGLE_DEG, false, PAL.pencilDark, 0.42);
  drawArrowhead(CX, CY, R_DIM, ang1Deg, 1, PAL.pencilDark);
  drawArrowhead(CX, CY, R_DIM, ang1Deg + GOLDEN_ANGLE_DEG, -1, PAL.pencilDark);

  // Label along the Golden Angle arc
  let midGoldenDeg = ang1Deg + GOLDEN_ANGLE_DEG * 0.5;
  let midGoldenRad = midGoldenDeg * Math.PI / 180;
  let gx = CX + Math.cos(midGoldenRad) * (R_DIM - 8);
  let gy = CY + Math.sin(midGoldenRad) * (R_DIM - 8);
  drawDraftText("Ψ = 137° 30' 28\" (GOLDEN ANGLE)", gx, gy, 7.2, midGoldenDeg + 90, PAL.pencilDark, 0.34, true);

  // Reflex complement arc (222.49°)
  let R_REF = 493;
  drawPencilArc(CX, CY, R_REF, ang1Deg + GOLDEN_ANGLE_DEG, ang1Deg + 360, true, PAL.pencilMid, 0.26);
  let midRefDeg = ang1Deg + GOLDEN_ANGLE_DEG + (360 - GOLDEN_ANGLE_DEG) * 0.5;
  let midRefRad = midRefDeg * Math.PI / 180;
  let rx = CX + Math.cos(midRefRad) * (R_REF - 8);
  let ry = CY + Math.sin(midRefRad) * (R_REF - 8);
  drawDraftText("360° - Ψ = 222.49°", rx, ry, 6.5, midRefDeg - 90, PAL.pencilMid, 0.28, true);

  // Center apex target reticle & cardinal axes
  brush.set("draft_lead", PAL.pencilDark, 0.32);
  brush.line(CX - 22, CY, CX + 22, CY);
  brush.line(CX, CY - 22, CX, CY + 22);
  drawPencilArc(CX, CY, 12, 0, 360, false, PAL.pencilDark, 0.3);

  // Cardinal axis extensions at 0, 90, 180, 270
  for (let cDeg of [0, 90, 180, 270]) {
    drawRadialConstructionRay(cDeg, R_PROT_1 - 15, 535, PAL.pencilMid, 0.25, true);
  }

  // --- E. SCIENTIFIC PLATE MARGINALIA, CONVERGENCE TABLE & PROFILE DIAGRAM ---
  drawPlateMarginalia();
}

function drawPencilCurveOverFruit(chain, dashed, weight) {
  for (let i = 0; i < chain.length - 1; i++) {
    let p0 = chain[Math.max(0, i - 1)];
    let p1 = chain[i];
    let p2 = chain[i + 1];
    let p3 = chain[Math.min(chain.length - 1, i + 2)];

    let steps = 10;
    for (let s = 0; s < steps; s++) {
      if (dashed && s % 2 === 1) continue;
      let t0 = s / steps;
      let t1 = (s + 1) / steps;
      let a = catmullRom(p0, p1, p2, p3, t0);
      let b = catmullRom(p0, p1, p2, p3, t1);

      // Check if segment lies over the dark shadow hemisphere of the fruit
      let dCenter = Math.hypot(a.x - CX, a.y - CY);
      let overDark = (dCenter < 415) && ((a.x - CX) + (a.y - CY) > 75);

      let col = overDark ? PAL.pencilSheen : PAL.pencilDark;
      brush.set("draft_lead", col, weight);
      brush.line(a.x, a.y, b.x, b.y);
    }
  }
}

function catmullRom(p0, p1, p2, p3, t) {
  let t2 = t * t;
  let t3 = t2 * t;
  let x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
  let y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  return { x, y };
}

function drawPencilArc(cx, cy, r, startDeg, endDeg, dashed, col, weight) {
  brush.set("draft_lead", col, weight);
  let span = endDeg - startDeg;
  let steps = Math.max(12, Math.floor(Math.abs(span) * r / 180));
  for (let i = 0; i < steps; i++) {
    if (dashed && i % 2 === 1) continue;
    let a0 = (startDeg + (i / steps) * span) * Math.PI / 180;
    let a1 = (startDeg + ((i + 1) / steps) * span) * Math.PI / 180;
    brush.line(
      cx + Math.cos(a0) * r,
      cy + Math.sin(a0) * r,
      cx + Math.cos(a1) * r,
      cy + Math.sin(a1) * r
    );
  }
}

function drawRadialConstructionRay(deg, rStart, rEnd, col, weight, dashed = false) {
  let rad = deg * Math.PI / 180;
  let steps = Math.max(8, Math.floor((rEnd - rStart) / 9));
  for (let i = 0; i < steps; i++) {
    if (dashed && i % 2 === 1) continue;
    let r0 = lerp(rStart, rEnd, i / steps);
    let r1 = lerp(rStart, rEnd, (i + 1) / steps);
    let midR = (r0 + r1) * 0.5;
    let px = CX + Math.cos(rad) * midR;
    let py = CY + Math.sin(rad) * midR;
    let overDark = (midR < 415) && ((px - CX) + (py - CY) > 75);
    brush.set("draft_lead", overDark ? PAL.pencilSheen : col, weight);
    brush.line(
      CX + Math.cos(rad) * r0,
      CY + Math.sin(rad) * r0,
      CX + Math.cos(rad) * r1,
      CY + Math.sin(rad) * r1
    );
  }
}

function drawArrowhead(cx, cy, r, deg, dir, col) {
  let rad = deg * Math.PI / 180;
  let tipX = cx + Math.cos(rad) * r;
  let tipY = cy + Math.sin(rad) * r;
  let tang = rad + (dir > 0 ? Math.PI * 0.5 : -Math.PI * 0.5);
  brush.set("draft_lead", col, 0.36);
  brush.line(tipX, tipY, tipX + Math.cos(tang - 0.32) * 9, tipY + Math.sin(tang - 0.32) * 9);
  brush.line(tipX, tipY, tipX + Math.cos(tang + 0.32) * 9, tipY + Math.sin(tang + 0.32) * 9);
}

// ============================================================================
// 8. SCIENTIFIC PLATE MARGINALIA & VECTOR STROKE FONT RENDERER
// ============================================================================
function drawPlateMarginalia() {
  // Top-Left Header Block
  drawDraftText("TAB. XIV — ANANAS COMOSUS (APEX SECT.)", 78, 78, 8.5, 0, PAL.pencilDark, 0.34);
  drawDraftText("CROWN EXCISED TO EXPOSE INTERLOCKING SYNCARP SCALES", 78, 94, 6.2, 0, PAL.pencilMid, 0.26);
  drawDraftText("N = 153 OCULI  /  VOGEL LATTICE PROJECTION", 78, 108, 6.0, 0, PAL.pencilMid, 0.25);

  // Top-Right Phyllotaxis Equation Block
  drawDraftText("PARASTICHIES: 8 (CW) × 13 (CCW) × 21", 865, 78, 7.5, 0, PAL.pencilDark, 0.32);
  drawDraftText("Ψ = 360° / φ² = 137.50776°", 932, 94, 6.5, 0, PAL.pencilMid, 0.26);
  drawDraftText("φ = 1.6180339", 998, 108, 6.2, 0, PAL.pencilMid, 0.25);

  // Bottom-Left Fibonacci Convergence Table
  let bx = 78, by = 995;
  drawDraftText("FIBONACCI PARASTICHY RATIOS", bx, by, 6.8, 0, PAL.pencilDark, 0.30);
  brush.set("draft_lead", PAL.pencilLight, 0.24);
  brush.line(bx, by + 11, bx + 185, by + 11);
  let rows = [
    "F(6)/F(7)   =  8 / 13  = 0.61538",
    "F(7)/F(8)   = 13 / 21  = 0.61904",
    "F(8)/F(9)   = 21 / 34  = 0.61764",
    "F(9)/F(10)  = 34 / 55  = 0.61818",
    "F(10)/F(11) = 55 / 89  = 0.61797"
  ];
  for (let i = 0; i < rows.length; i++) {
    drawDraftText(rows[i], bx, by + 18 + i * 13, 5.8, 0, PAL.pencilMid, 0.24);
  }

  // Bottom-Right Lateral Eye Cross-Section Diagram & Scale Bar
  let sx = 925, sy = 1015;
  drawDraftText("FIG. 2 — OCULUS PROFILE (SECT. A-A')", sx, sy - 20, 6.4, 0, PAL.pencilDark, 0.28);

  // Draw small schematic profile of a single warty scale & bract hood
  brush.set("draft_lead", PAL.pencilDark, 0.32);
  brush.line(sx, sy + 28, sx + 175, sy + 28); // Baseline
  // Left cushion lobe, central floral cavity, overlapping pointed bract, right cushion lobe
  let prof = [
    [sx + 10, sy + 28], [sx + 25, sy + 10], [sx + 55, sy + 6],
    [sx + 75, sy + 20], [sx + 68, sy + 8], [sx + 98, sy - 6],
    [sx + 105, sy + 14], [sx + 135, sy + 8], [sx + 160, sy + 28]
  ];
  for (let i = 0; i < prof.length - 1; i++) {
    brush.line(prof[i][0], prof[i][1], prof[i + 1][0], prof[i + 1][1]);
  }
  // Section hatching under profile
  brush.set("draft_lead", PAL.pencilLight, 0.22);
  for (let hx = sx + 18; hx < sx + 155; hx += 6) {
    brush.line(hx, sy + 28, hx - 6, sy + 36);
  }
  drawDraftText("BRACT", sx + 82, sy - 16, 5.4, 0, PAL.pencilMid, 0.24);
  drawDraftText("SUTURE", sx + 142, sy + 16, 5.4, 0, PAL.pencilMid, 0.24);

  // Drafted Scale Bar at Bottom Center-Right
  let sbx = 925, sby = 1095;
  brush.set("draft_lead", PAL.pencilDark, 0.32);
  brush.line(sbx, sby, sbx + 175, sby);
  for (let m = 0; m <= 5; m++) {
    let tx = sbx + m * 35;
    brush.line(tx, sby - 4, tx, sby + 4);
    drawDraftText(String(m) + " CM", tx - 6, sby + 8, 5.5, 0, PAL.pencilMid, 0.24);
  }
}

function drawDraftText(str, x, y, size, angleDeg = 0, col = PAL.pencilDark, weight = 0.28, centered = false) {
  let charW = size * 0.68;
  let spacing = size * 0.92;
  let totalW = str.length * spacing;

  let rad = angleDeg * Math.PI / 180;
  let cosA = Math.cos(rad);
  let sinA = Math.sin(rad);

  let startX = centered ? -totalW * 0.5 : 0;
  let startY = centered ? -size * 0.5 : 0;

  brush.set("draft_lead", col, weight);

  for (let i = 0; i < str.length; i++) {
    let ch = str[i].toUpperCase();
    if (str[i] === "φ" || str[i] === "Ψ" || str[i] === "×" || str[i] === "°") ch = str[i];
    let paths = GLYPHS[ch];
    if (!paths) continue;

    let ox = startX + i * spacing;
    let oy = startY;

    for (let poly of paths) {
      for (let k = 0; k < poly.length - 1; k++) {
        let lx0 = ox + poly[k][0] * charW;
        let ly0 = oy + poly[k][1] * size;
        let lx1 = ox + poly[k + 1][0] * charW;
        let ly1 = oy + poly[k + 1][1] * size;

        let wx0 = x + lx0 * cosA - ly0 * sinA;
        let wy0 = y + lx0 * sinA + ly0 * cosA;
        let wx1 = x + lx1 * cosA - ly1 * sinA;
        let wy1 = y + lx1 * sinA + ly1 * cosA;

        brush.line(wx0, wy0, wx1, wy1);
      }
    }
  }
}
