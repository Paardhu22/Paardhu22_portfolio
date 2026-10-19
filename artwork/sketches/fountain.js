// Hyperreal Overhead View of a Tiled Girih Fountain Basin with Submerged Coins & Caustics

const SEED = 42891;

// Ripple centers (producing optical kinks in the Girih strapwork & concentric caustic rings)
const RIPPLES = [
  { x: 640, y: 505, amp: 13.5, waveLen: 46, rings: 5.5, rMin: 28, rMax: 340, phase: 0.4 },
  { x: 385, y: 725, amp: 10.5, waveLen: 42, rings: 4.5, rMin: 24, rMax: 270, phase: 1.7 },
  { x: 830, y: 805, amp: 9.0,  waveLen: 50, rings: 4.0, rMin: 30, rMax: 250, phase: 3.1 },
  { x: 340, y: 310, amp: 7.5,  waveLen: 54, rings: 3.5, rMin: 35, rMax: 220, phase: 5.0 }
];

// Submerged copper and nickel coins
const COINS = [
  { x: 640, y: 505, r: 58, type: "copper", rot: 28,  patina: 0.56, motif: "laureate_profile" },
  { x: 718, y: 558, r: 45, type: "nickel", rot: -42, patina: 0.24, motif: "heraldic_shield" },
  { x: 385, y: 725, r: 54, type: "copper", rot: 118, patina: 0.74, motif: "ancient_star" },
  { x: 855, y: 335, r: 50, type: "nickel", rot: 19,  patina: 0.18, motif: "crowned_bust" },
  { x: 312, y: 358, r: 43, type: "copper", rot: -64, patina: 0.44, motif: "oak_wreath" },
  { x: 830, y: 805, r: 59, type: "copper", rot: 72,  patina: 0.48, motif: "laureate_profile" },
  { x: 525, y: 860, r: 39, type: "nickel", rot: 142, patina: 0.30, motif: "numeral_value" },
  { x: 488, y: 268, r: 44, type: "nickel", rot: -16, patina: 0.22, motif: "heraldic_shield" },
  { x: 235, y: 610, r: 37, type: "copper", rot: 204, patina: 0.65, motif: "oak_wreath" }
];

// Muted earth-toned palette with glassy lapis, turquoise, and saffron glazes
const PALETTE = {
  stoneBg: "#dfd2ba",
  stoneWarm: "#cfbda0",
  stoneShadow: "#b5a082",
  sepiaDark: "#332015",
  sepiaMid: "#523626",
  sepiaLight: "#785742",
  strapCream: "#e8dcc6",
  strapHighlight: "#f5ebd8",

  // Glassy watercolor tile glazes (muted mineral & earth-toned)
  lapisBase: "#28435c",
  lapisDeep: "#1b3045",
  lapisRim: "#395a78",

  turquoiseBase: "#356e6b",
  turquoiseDeep: "#23504e",
  turquoiseRim: "#4d8783",

  saffronBase: "#c78832",
  saffronDeep: "#9e6319",
  saffronRim: "#dba04b",

  ochreBase: "#b07846",
  ochreDeep: "#8a562b",

  terracottaBase: "#96523b",
  terracottaDeep: "#733926",

  // Caustics & water light
  causticGlow: "#ebd9ad",
  causticWarm: "#f6ebd0",
  causticBright: "#fffdf6",
  waterShadow: "#243b3d"
};

async function setup() {
  createCanvas(1200, 1200, WEBGL);
  brush.scaleBrushes(3);
  angleMode(DEGREES);
  randomSeed(SEED);
  noiseSeed(SEED);
}

function draw() {
  translate(-width / 2, -height / 2);

  // 1. Base stone & mortar travertine ground
  drawBasinGround();

  // 2. Construct exact 10-fold Girih lattice (10-pointed stars, bow-tie pentagons, strapwork)
  const girih = buildGirihLattice();

  // 3. Render watercolor tile glazes in color batches (with water refraction kinks)
  drawGirihGlazes(girih);

  // 4. Render crisp sepia pen interlocking strapwork (kinked across ripples)
  drawGirihStrapwork(girih);

  // 5. Subtle underwater silt & depth shading before coins
  drawUnderwaterDepthPass();

  // 6. Render hyperreal submerged copper and nickel coins (shadows, milled edges, relief, patina)
  for (let i = 0; i < COINS.length; i++) {
    drawSubmergedCoin(COINS[i], i);
  }

  // 7. Render photographic caustic light web & ripple crest threads over tiles and coins
  drawCausticNetwork();
  drawRippleCrestLight();

  noLoop();
}

// ============================================================================
// WATER REFRACTION & RIPPLE KINK FIELD
// ============================================================================

function refractPoint(x, y, mult = 1.0) {
  let dx = 0;
  let dy = 0;

  // Ambient gentle water swell across the basin
  const swell1 = Math.sin(x * 0.011 + y * 0.008 + 0.7);
  const swell2 = Math.cos(x * 0.007 - y * 0.012 + 1.9);
  dx += (swell1 * 3.2 + swell2 * 2.4) * mult;
  dy += (swell2 * 3.0 - swell1 * 2.2) * mult;

  // Sharp concentric ripple wavefronts that kink the geometry
  for (let i = 0; i < RIPPLES.length; i++) {
    const rp = RIPPLES[i];
    const rx = x - rp.x;
    const ry = y - rp.y;
    const dist = Math.hypot(rx, ry) + 0.0001;

    if (dist > rp.rMin && dist < rp.rMax) {
      const tNorm = (dist - rp.rMin) / (rp.rMax - rp.rMin);
      const env = Math.sin(tNorm * Math.PI);
      const envSharp = env * env * (1.15 - 0.35 * tNorm);

      // Asymmetric capillary wave profile for sharp optical kinking at each crest
      const theta = ((dist - rp.rMin) / rp.waveLen) * Math.PI * 2 + rp.phase;
      const wave = Math.sin(theta) + 0.48 * Math.sin(2 * theta + 0.5) + 0.22 * Math.sin(3 * theta + 1.0);

      // Tangential twist + radial shear at the wavefront
      const radialDisp = rp.amp * envSharp * wave * mult;
      const tangDisp = rp.amp * 0.32 * envSharp * Math.cos(theta) * mult;

      const ux = rx / dist;
      const uy = ry / dist;
      dx += ux * radialDisp - uy * tangDisp;
      dy += uy * radialDisp + ux * tangDisp;
    }
  }

  return [x + dx, y + dy];
}

function subdivideAndRefract(pts, stepLen = 7, closed = true, mult = 1.0) {
  const raw = [];
  const n = pts.length;
  const count = closed ? n : n - 1;

  for (let i = 0; i < count; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const steps = Math.max(1, Math.ceil(d / stepLen));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const sx = p1[0] + (p2[0] - p1[0]) * t;
      const sy = p1[1] + (p2[1] - p1[1]) * t;
      raw.push(refractPoint(sx, sy, mult));
    }
  }
  if (!closed && n > 0) {
    raw.push(refractPoint(pts[n - 1][0], pts[n - 1][1], mult));
  }

  // Deduplicate very close consecutive points for clean brush.Polygon / spline stability
  const cleaned = [];
  for (let i = 0; i < raw.length; i++) {
    if (
      cleaned.length === 0 ||
      Math.hypot(raw[i][0] - cleaned[cleaned.length - 1][0], raw[i][1] - cleaned[cleaned.length - 1][1]) > 1.5
    ) {
      cleaned.push(raw[i]);
    }
  }
  if (
    closed &&
    cleaned.length > 2 &&
    Math.hypot(cleaned[0][0] - cleaned[cleaned.length - 1][0], cleaned[0][1] - cleaned[cleaned.length - 1][1]) < 1.5
  ) {
    cleaned.pop();
  }
  return cleaned;
}

// ============================================================================
// POLYGON INSET & GEOMETRY HELPERS
// ============================================================================

function polygonSignedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    a += p1[0] * p2[1] - p2[0] * p1[1];
  }
  return a * 0.5;
}

function insetPolygon(pts, insetDist) {
  const n = pts.length;
  const area = polygonSignedArea(pts);
  const sign = area >= 0 ? 1 : -1;
  const out = [];

  for (let i = 0; i < n; i++) {
    const pPrev = pts[(i - 1 + n) % n];
    const pCurr = pts[i];
    const pNext = pts[(i + 1) % n];

    const dx1 = pCurr[0] - pPrev[0];
    const dy1 = pCurr[1] - pPrev[1];
    const l1 = Math.hypot(dx1, dy1) || 1;
    const nx1 = (-dy1 / l1) * sign;
    const ny1 = (dx1 / l1) * sign;

    const dx2 = pNext[0] - pCurr[0];
    const dy2 = pNext[1] - pCurr[1];
    const l2 = Math.hypot(dx2, dy2) || 1;
    const nx2 = (-dy2 / l2) * sign;
    const ny2 = (dx2 / l2) * sign;

    let bx = nx1 + nx2;
    let by = ny1 + ny2;
    const bl = Math.hypot(bx, by);
    if (bl < 0.001) {
      bx = nx1;
      by = ny1;
    } else {
      bx /= bl;
      by /= bl;
    }

    const dot = Math.max(0.38, bx * nx1 + by * ny1);
    const d = Math.min(insetDist * 2.4, insetDist / dot);
    out.push([pCurr[0] + bx * d, pCurr[1] + by * d]);
  }
  return out;
}

function polyInBounds(pts, margin = 140) {
  for (let i = 0; i < pts.length; i++) {
    const x = pts[i][0];
    const y = pts[i][1];
    if (x >= -margin && x <= width + margin && y >= -margin && y <= height + margin) {
      return true;
    }
  }
  return false;
}

function polyCentroid(pts) {
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    cx += pts[i][0];
    cy += pts[i][1];
  }
  return [cx / pts.length, cy / pts.length];
}

function scalePolyFromCenter(pts, cx, cy, sc) {
  return pts.map(p => [cx + (p[0] - cx) * sc, cy + (p[1] - cy) * sc]);
}

// ============================================================================
// GIRIH 10-FOLD LATTICE CONSTRUCTION (10-POINTED STARS & BOW-TIE PENTAGONS)
// ============================================================================

function buildGirihLattice() {
  const r1 = 116; // Outer tip radius of 10-pointed star
  const deg = Math.PI / 180;
  const rP = r1 * Math.tan(36 * deg); // Inner valley radius of 10-pointed star
  const S = 2 * r1; // Rhombic lattice period

  const a1x = S * Math.cos(36 * deg);
  const a1y = S * Math.sin(36 * deg);
  const a2x = S * Math.cos(36 * deg);
  const a2y = -S * Math.sin(36 * deg);

  const originX = -190;
  const originY = 600;

  const strapHalfWidth = 4.3;

  function siteCenter(m, n) {
    return [originX + m * a1x + n * a2x, originY + m * a1y + n * a2y];
  }

  function getM(O, k) {
    const ang = ((k % 10 + 10) % 10) * 36 * deg;
    return [O[0] + r1 * Math.cos(ang), O[1] + r1 * Math.sin(ang)];
  }

  function getP(O, k) {
    const ang = (((k % 10 + 10) % 10) + 0.5) * 36 * deg;
    return [O[0] + rP * Math.cos(ang), O[1] + rP * Math.sin(ang)];
  }

  const starsLapis = [];
  const starsTurquoise = [];
  const starCoresSaffron = [];
  const starCoresTerracotta = [];
  const pentagonsTurquoise = [];
  const pentagonsSaffron = [];
  const bowtiesSaffron = [];
  const bowtiesLapis = [];
  const bowtiesOchre = [];

  const allInsetTileOutlines = [];
  const allRawGirihSegments = [];
  const weaveBridges = [];

  for (let m = -5; m <= 9; m++) {
    for (let n = -5; n <= 9; n++) {
      const A = siteCenter(m, n);
      const B = siteCenter(m + 1, n);
      const C = siteCenter(m + 1, n + 1);
      const D = siteCenter(m, n + 1);

      // 1. 10-Pointed Star at site A
      if (A[0] > -180 && A[0] < width + 180 && A[1] > -180 && A[1] < height + 180) {
        const starRaw = [];
        const innerStarRaw = [];
        for (let k = 0; k < 10; k++) {
          const mk = getM(A, k);
          const pk = getP(A, k);
          starRaw.push(mk, pk);

          // Inner concentric 10-pointed rosette ornament
          const angM = k * 36 * deg;
          const angP = (k + 0.5) * 36 * deg;
          innerStarRaw.push(
            [A[0] + r1 * 0.46 * Math.cos(angM), A[1] + r1 * 0.46 * Math.sin(angM)],
            [A[0] + rP * 0.46 * Math.cos(angP), A[1] + rP * 0.46 * Math.sin(angP)]
          );
        }

        const starInset = insetPolygon(starRaw, strapHalfWidth);
        const innerInset = insetPolygon(innerStarRaw, strapHalfWidth * 0.72);

        if ((m + n) % 2 === 0) {
          starsLapis.push({ poly: starInset, center: A, kind: "star" });
          starCoresSaffron.push({ poly: innerInset, center: A, border: innerStarRaw });
        } else {
          starsTurquoise.push({ poly: starInset, center: A, kind: "star" });
          starCoresTerracotta.push({ poly: innerInset, center: A, border: innerStarRaw });
        }

        allInsetTileOutlines.push(starInset);
        allInsetTileOutlines.push(innerInset);

        // Record raw star segments for crisp centerline strap geometry
        for (let i = 0; i < starRaw.length; i++) {
          allRawGirihSegments.push([starRaw[i], starRaw[(i + 1) % starRaw.length]]);
        }

        // Over-under weave bridges at the 10 outer tips M_k and 10 valleys P_k
        for (let k = 0; k < 10; k++) {
          const mk = getM(A, k);
          const dirAngle = (k * 36 + (k % 2 === 0 ? 144 : -144)) * deg;
          weaveBridges.push({
            pt: mk,
            dx: Math.cos(dirAngle),
            dy: Math.sin(dirAngle),
            hw: strapHalfWidth * 0.95,
            len: strapHalfWidth * 2.1
          });
        }
      }

      // 2. Four Radial Pentagons & Central Bow-Tie Pentagons in Rhombus Cell (A, B, C, D)
      const pent1 = [getM(A, 0), getP(A, 0), getM(A, 1), getP(B, 6), getM(B, 7)];
      const pent2 = [getM(A, 0), getM(D, 3), getP(D, 3), getM(A, 9), getP(A, 9)];
      const pent3 = [getM(C, 5), getM(B, 8), getP(B, 8), getM(B, 9), getP(C, 4)];
      const pent4 = [getM(C, 5), getP(C, 5), getM(C, 6), getP(D, 1), getM(D, 2)];

      const radialPents = [pent1, pent2, pent3, pent4];
      for (let pIdx = 0; pIdx < radialPents.length; pIdx++) {
        const rp = radialPents[pIdx];
        if (polyInBounds(rp, 140)) {
          const rpInset = insetPolygon(rp, strapHalfWidth);
          const cent = polyCentroid(rpInset);
          if ((pIdx + m + n) % 2 === 0) {
            pentagonsTurquoise.push({ poly: rpInset, center: cent });
          } else {
            pentagonsSaffron.push({ poly: rpInset, center: cent });
          }
          allInsetTileOutlines.push(rpInset);
          for (let i = 0; i < rp.length; i++) {
            allRawGirihSegments.push([rp[i], rp[(i + 1) % rp.length]]);
          }
        }
      }

      // 3. Central Bow-Tie Pair (two symmetric bow-tie pentagons meeting at the waist P7(B) - P2(D))
      const btLeft = [getM(A, 0), getM(B, 7), getP(B, 7), getP(D, 2), getM(D, 3)];
      const btRight = [getM(C, 5), getM(D, 2), getP(D, 2), getP(B, 7), getM(B, 8)];

      const btPair = [btLeft, btRight];
      for (let bIdx = 0; bIdx < btPair.length; bIdx++) {
        const bp = btPair[bIdx];
        if (polyInBounds(bp, 140)) {
          const bpInset = insetPolygon(bp, strapHalfWidth);
          const cent = polyCentroid(bpInset);
          const selector = Math.abs(m * 3 + n * 5 + bIdx) % 3;
          if (selector === 0) {
            bowtiesSaffron.push({ poly: bpInset, center: cent });
          } else if (selector === 1) {
            bowtiesLapis.push({ poly: bpInset, center: cent });
          } else {
            bowtiesOchre.push({ poly: bpInset, center: cent });
          }
          allInsetTileOutlines.push(bpInset);
          for (let i = 0; i < bp.length; i++) {
            allRawGirihSegments.push([bp[i], bp[(i + 1) % bp.length]]);
          }
        }
      }
    }
  }

  return {
    starsLapis,
    starsTurquoise,
    starCoresSaffron,
    starCoresTerracotta,
    pentagonsTurquoise,
    pentagonsSaffron,
    bowtiesSaffron,
    bowtiesLapis,
    bowtiesOchre,
    allInsetTileOutlines,
    allRawGirihSegments,
    weaveBridges
  };
}

// ============================================================================
// BASIN GROUND & WATERCOLOR TILE GLAZES
// ============================================================================

function drawBasinGround() {
  background(PALETTE.stoneBg);

  // Warm travertine & earthy limestone washes across the basin
  brush.noStroke();
  brush.fillBleed(0.35, "out");
  brush.fillTexture(0.65, 0.35);

  brush.fill(PALETTE.stoneWarm, 85);
  for (let i = 0; i < 7; i++) {
    const rx = random(80, width - 80);
    const ry = random(80, height - 80);
    brush.circle(rx, ry, random(240, 440), 0.35);
  }

  brush.fill(PALETTE.stoneShadow, 55);
  for (let i = 0; i < 5; i++) {
    const rx = random(100, width - 100);
    const ry = random(100, height - 100);
    brush.circle(rx, ry, random(180, 340), 0.4);
  }
  brush.noFill();

  // Fine stone grain stipple
  brush.set("spray", PALETTE.sepiaLight, 0.32);
  for (let i = 0; i < 90; i++) {
    const x1 = random(0, width);
    const y1 = random(0, height);
    const ang = random(360);
    brush.line(x1, y1, x1 + cos(ang) * random(30, 90), y1 + sin(ang) * random(30, 90));
  }
}

function drawBatchedGlazeBucket(items, baseColor, deepColor, baseOpacity, deepOpacity, stepLen = 11) {
  const refractedOuter = [];
  const refractedInner = [];

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const rPoly = subdivideAndRefract(it.poly, stepLen, true, 1.0);
    if (rPoly.length >= 3) {
      refractedOuter.push(rPoly);
      const innerRaw = scalePolyFromCenter(it.poly, it.center[0], it.center[1], 0.72);
      const rInner = subdivideAndRefract(innerRaw, stepLen + 3, true, 1.0);
      if (rInner.length >= 3) {
        refractedInner.push(rInner);
      }
    }
  }

  // Pass 1: Glassy primary watercolor glaze (batched by color for performance & richness)
  brush.noStroke();
  brush.fillBleed(0.11, "in");
  brush.fillTexture(0.72, 0.58);
  brush.fill(baseColor, baseOpacity);
  for (let i = 0; i < refractedOuter.length; i++) {
    const p = new brush.Polygon(refractedOuter[i]);
    p.fill(baseColor, baseOpacity, 0.11, 0.72);
  }

  // Pass 2: Pooled inner ceramic glaze depth
  brush.fillBleed(0.16, "in");
  brush.fillTexture(0.65, 0.45);
  brush.fill(deepColor, deepOpacity);
  for (let i = 0; i < refractedInner.length; i++) {
    const p = new brush.Polygon(refractedInner[i]);
    p.fill(deepColor, deepOpacity, 0.16, 0.65);
  }
  brush.noFill();
}

function drawGirihGlazes(girih) {
  // 1. Lapis 10-pointed stars & bow-tie pentagons
  drawBatchedGlazeBucket(girih.starsLapis, PALETTE.lapisBase, PALETTE.lapisDeep, 165, 95, 11);
  drawBatchedGlazeBucket(girih.bowtiesLapis, PALETTE.lapisBase, PALETTE.lapisDeep, 155, 85, 11);

  // 2. Turquoise 10-pointed stars & radial pentagons
  drawBatchedGlazeBucket(girih.starsTurquoise, PALETTE.turquoiseBase, PALETTE.turquoiseDeep, 160, 95, 11);
  drawBatchedGlazeBucket(girih.pentagonsTurquoise, PALETTE.turquoiseBase, PALETTE.turquoiseDeep, 150, 85, 11);

  // 3. Saffron gold pentagons & bow-tie pentagons
  drawBatchedGlazeBucket(girih.pentagonsSaffron, PALETTE.saffronBase, PALETTE.saffronDeep, 160, 90, 11);
  drawBatchedGlazeBucket(girih.bowtiesSaffron, PALETTE.saffronBase, PALETTE.saffronDeep, 165, 92, 11);

  // 4. Warm earth ochre bow-tie pentagons
  drawBatchedGlazeBucket(girih.bowtiesOchre, PALETTE.ochreBase, PALETTE.ochreDeep, 150, 85, 11);

  // 5. Inner concentric 10-pointed star cores (First knock out mortar strap channel, then glaze core)
  const allCores = girih.starCoresSaffron.concat(girih.starCoresTerracotta);
  for (let i = 0; i < allCores.length; i++) {
    const rBorder = subdivideAndRefract(allCores[i].border, 10, true, 1.0);
    if (rBorder.length >= 3) {
      const p = new brush.Polygon(rBorder);
      p.wash(PALETTE.strapCream, 235);
    }
  }
  brush.noWash();

  drawBatchedGlazeBucket(girih.starCoresSaffron, PALETTE.saffronBase, PALETTE.saffronDeep, 175, 95, 10);
  drawBatchedGlazeBucket(girih.starCoresTerracotta, PALETTE.terracottaBase, PALETTE.terracottaDeep, 165, 90, 10);
}

// ============================================================================
// CRISP SEPIA PEN GIRIH STRAPWORK (KINKED BY WATER RIPPLES)
// ============================================================================

function drawGirihStrapwork(girih) {
  // 1. Subtle highlight & bevel along the stone strapwork channels
  brush.set("2H", PALETTE.strapHighlight, 0.38);
  for (let i = 0; i < girih.allRawGirihSegments.length; i += 2) {
    const seg = girih.allRawGirihSegments[i];
    if (polyInBounds(seg, 80)) {
      const pts = subdivideAndRefract(seg, 8, false, 1.0);
      if (pts.length >= 2) {
        brush.spline(pts, 0.15);
      }
    }
  }

  // 2. Crisp sepia pen double-line borders framing every glazed tile & strap edge
  for (let i = 0; i < girih.allInsetTileOutlines.length; i++) {
    const poly = girih.allInsetTileOutlines[i];
    if (!polyInBounds(poly, 90)) continue;

    const rPts = subdivideAndRefract(poly, 6, true, 1.0);
    if (rPts.length < 3) continue;

    // Close loop for spline
    const loopPts = rPts.concat([rPts[0]]);

    // Warm sepia under-stroke for ink bleed into stone
    brush.set("pen", PALETTE.sepiaMid, 0.34);
    brush.spline(loopPts, 0.12);

    // Razor-crisp dark sepia technical pen contour
    brush.set("rotring", PALETTE.sepiaDark, 0.44);
    brush.spline(loopPts, 0.08);
  }

  // 3. Interlaced over-under weave ticks at star tips & intersections
  for (let i = 0; i < girih.weaveBridges.length; i++) {
    const wb = girih.weaveBridges[i];
    if (wb.pt[0] < -60 || wb.pt[0] > width + 60 || wb.pt[1] < -60 || wb.pt[1] > height + 60) continue;

    const nx = -wb.dy;
    const ny = wb.dx;

    // Small opaque stone strap bridge so one strap cleanly passes OVER the crossing strap
    const bPoly = [
      refractPoint(wb.pt[0] - wb.dx * wb.len + nx * wb.hw, wb.pt[1] - wb.dy * wb.len + ny * wb.hw, 1.0),
      refractPoint(wb.pt[0] + wb.dx * wb.len + nx * wb.hw, wb.pt[1] + wb.dy * wb.len + ny * wb.hw, 1.0),
      refractPoint(wb.pt[0] + wb.dx * wb.len - nx * wb.hw, wb.pt[1] + wb.dy * wb.len - ny * wb.hw, 1.0),
      refractPoint(wb.pt[0] - wb.dx * wb.len - nx * wb.hw, wb.pt[1] - wb.dy * wb.len - ny * wb.hw, 1.0)
    ];

    const pBridge = new brush.Polygon(bPoly);
    pBridge.wash(PALETTE.strapCream, 230);
    brush.noWash();

    // Draw the two parallel sepia over-strap edges
    brush.set("rotring", PALETTE.sepiaDark, 0.46);
    brush.line(bPoly[0][0], bPoly[0][1], bPoly[1][0], bPoly[1][1]);
    brush.line(bPoly[3][0], bPoly[3][1], bPoly[2][0], bPoly[2][1]);
  }

  // 4. Delicate ceramic craquelure & aged tile hairlines inside selected tiles
  brush.set("2H", PALETTE.sepiaMid, 0.22);
  for (let i = 0; i < girih.starsLapis.length; i++) {
    const c = girih.starsLapis[i].center;
    if (c[0] > 0 && c[0] < width && c[1] > 0 && c[1] < height) {
      for (let k = 0; k < 5; k++) {
        const a1 = k * 72 + 18;
        const p1 = refractPoint(c[0] + cos(a1) * 28, c[1] + sin(a1) * 28, 1.0);
        const p2 = refractPoint(c[0] + cos(a1 + 36) * 52, c[1] + sin(a1 + 36) * 52, 1.0);
        brush.line(p1[0], p1[1], p2[0], p2[1]);
      }
    }
  }
}

function drawUnderwaterDepthPass() {
  // Subtle mineral water tint & corner depth
  brush.noStroke();
  brush.fillBleed(0.4, "out");
  brush.fillTexture(0.5, 0.25);

  const corners = [
    [90, 90],
    [width - 90, 90],
    [90, height - 90],
    [width - 90, height - 90]
  ];
  brush.fill(PALETTE.waterShadow, 26);
  for (let i = 0; i < corners.length; i++) {
    brush.circle(corners[i][0], corners[i][1], 320, 0.35);
  }
  brush.noFill();
}

// ============================================================================
// HYPERREAL SUBMERGED COPPER & NICKEL COINS
// ============================================================================

function makeCoinDiscPoints(cx, cy, r, steps = 64, shiftX = 0, shiftY = 0, refractMult = 0.28) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const ang = (i / steps) * 360;
    const px = cx + shiftX + cos(ang) * r;
    const py = cy + shiftY + sin(ang) * r;
    pts.push(refractPoint(px, py, refractMult));
  }
  return pts;
}

function drawSubmergedCoin(coin, coinIdx) {
  const { x: cx, y: cy, r, type, rot, patina, motif } = coin;
  const isCopper = type === "copper";

  // Metal palette for Copper vs Nickel
  const colEdgeCylinder = isCopper ? "#2b140a" : "#25292b";
  const colBaseWash     = isCopper ? "#783c20" : "#70756f";
  const colMidTone      = isCopper ? "#9e5430" : "#8c9189";
  const colDarkShadow   = isCopper ? "#3d1b0c" : "#363b3d";
  const colDeepRecess   = isCopper ? "#240e05" : "#1f2324";
  const colHighlight    = isCopper ? "#e8a576" : "#dbd8ca";
  const colSpecular     = isCopper ? "#ffdfc2" : "#f7f6f0";
  const colTarnish      = isCopper ? "#592814" : "#6b614f";

  // Patina palette (verdigris / malachite green)
  const patDark  = "#255441";
  const patMid   = "#488f72";
  const patLight = "#78c2a3";
  const patChalk = "#a9dec6";

  // --------------------------------------------------------------------------
  // 1. Submerged Cast Shadow on the Tile Floor
  // --------------------------------------------------------------------------
  const shadPts = makeCoinDiscPoints(cx, cy, r * 1.02, 48, 8.5, 10.5, 0.35);
  const pShad = new brush.Polygon(shadPts);
  pShad.fill("#171310", 135, 0.16, 0.55);
  brush.noFill();

  // Tight contact occlusion hatch on the shadow crescent
  brush.set("2B", "#140e0a", 0.42);
  for (let a = -25; a <= 115; a += 4) {
    const p1 = refractPoint(cx + 3 + cos(a) * (r * 0.92), cy + 4 + sin(a) * (r * 0.92), 0.3);
    const p2 = refractPoint(cx + 9 + cos(a) * (r * 1.06), cy + 11 + sin(a) * (r * 1.06), 0.3);
    brush.line(p1[0], p1[1], p2[0], p2[1]);
  }

  // --------------------------------------------------------------------------
  // 2. 3D Coin Rim Cylinder & Opaque Metallic Base Disc
  // --------------------------------------------------------------------------
  const cylPts = makeCoinDiscPoints(cx, cy, r, 60, 2.8, 3.5, 0.28);
  const pCyl = new brush.Polygon(cylPts);
  pCyl.wash(colEdgeCylinder, 250);

  const discPts = makeCoinDiscPoints(cx, cy, r, 64, 0, 0, 0.28);
  const pDisc = new brush.Polygon(discPts);
  pDisc.wash(colBaseWash, 255);
  brush.noWash();

  // Metallic surface texture wash
  pDisc.fill(colMidTone, 145, 0.04, 0.78);
  brush.noFill();

  // --------------------------------------------------------------------------
  // 3. Directional Metallic Luster, Shading & Tarnish Gradient
  // --------------------------------------------------------------------------
  // Fine radial & directional hatching across the coin field
  const hatchSteps = Math.floor(r * 1.35);
  for (let i = -hatchSteps; i <= hatchSteps; i++) {
    const t = i / hatchSteps; // -1 (upper-left highlight) to +1 (lower-right shadow)
    const yOff = t * (r * 0.91);
    const halfChord = Math.sqrt(Math.max(0, (r * 0.91) * (r * 0.91) - yOff * yOff));
    if (halfChord < 4) continue;

    const radAngle = 42 * (Math.PI / 180);
    const cosA = Math.cos(radAngle);
    const sinA = Math.sin(radAngle);

    const x1 = cx - halfChord * cosA - yOff * sinA;
    const y1 = cy - halfChord * sinA + yOff * cosA;
    const x2 = cx + halfChord * cosA - yOff * sinA;
    const y2 = cy + halfChord * sinA + yOff * cosA;

    const rp1 = refractPoint(x1, y1, 0.28);
    const rp2 = refractPoint(x2, y2, 0.28);

    if (t < -0.25) {
      brush.set("2H", colHighlight, 0.34);
      brush.line(rp1[0], rp1[1], rp2[0], rp2[1]);
    } else if (t > 0.22) {
      brush.set("HB", colDarkShadow, 0.36);
      brush.line(rp1[0], rp1[1], rp2[0], rp2[1]);
    } else if (i % 2 === 0) {
      brush.set("2H", colTarnish, 0.28);
      brush.line(rp1[0], rp1[1], rp2[0], rp2[1]);
    }
  }

  // Specular metallic cartwheel sheen rays in upper-left & lower-right
  brush.set("2H", colSpecular, 0.32);
  for (let a = 195; a <= 255; a += 3.5) {
    const p1 = refractPoint(cx + cos(a) * (r * 0.18), cy + sin(a) * (r * 0.18), 0.28);
    const p2 = refractPoint(cx + cos(a) * (r * 0.86), cy + sin(a) * (r * 0.86), 0.28);
    brush.line(p1[0], p1[1], p2[0], p2[1]);
  }

  // --------------------------------------------------------------------------
  // 4. Raised Inner Rim Bevel & Worn Milled Edge (Reeding)
  // --------------------------------------------------------------------------
  const innerRimR = r * 0.875;

  // Inner rim recessed shadow ring (upper-left inside rim) and highlight ring (lower-right inside rim)
  for (let a = 0; a < 360; a += 6) {
    const aNext = a + 6;
    const p1 = refractPoint(cx + cos(a) * innerRimR, cy + sin(a) * innerRimR, 0.28);
    const p2 = refractPoint(cx + cos(aNext) * innerRimR, cy + sin(aNext) * innerRimR, 0.28);

    const lightDot = cos(a - 225);
    if (lightDot > 0.1) {
      brush.set("rotring", colDeepRecess, 0.45);
      brush.line(p1[0], p1[1], p2[0], p2[1]);
    } else {
      brush.set("pen", colHighlight, 0.42);
      brush.line(p1[0], p1[1], p2[0], p2[1]);
    }
  }

  // Worn Milled Edge (Reeding teeth all around the perimeter + 3D cylinder side)
  const numReeds = Math.floor(r * 2.15);
  for (let k = 0; k < numReeds; k++) {
    const ang = (k / numReeds) * 360;
    // Perlin noise wear factor: some sections of reeding are worn down & nicked
    const wear = noise(coinIdx * 17.3 + cos(ang) * 1.8 + 5, sin(ang) * 1.8 + 5);
    const reedInner = r * (0.885 + (wear > 0.62 ? 0.045 : 0.0));
    const reedOuter = r * (1.0 - (wear > 0.68 ? 0.02 : 0.0));

    const rInPt = refractPoint(cx + cos(ang) * reedInner, cy + sin(ang) * reedInner, 0.28);
    const rOutPt = refractPoint(cx + cos(ang) * reedOuter, cy + sin(ang) * reedOuter, 0.28);

    // Dark notch of the reed
    brush.set("rotring", colDeepRecess, wear > 0.62 ? 0.30 : 0.48);
    brush.line(rInPt[0], rInPt[1], rOutPt[0], rOutPt[1]);

    // If on the lower-right 3D bevel cylinder, extend the reed tick down the side of the coin!
    if (sin(ang - 40) > 0.0) {
      const sidePt = refractPoint(cx + 2.6 + cos(ang) * r, cy + 3.2 + sin(ang) * r, 0.28);
      brush.set("rotring", colDeepRecess, 0.44);
      brush.line(rOutPt[0], rOutPt[1], sidePt[0], sidePt[1]);
    }

    // Specular ridge next to each reed notch
    if (wear < 0.68) {
      const angH = ang + (180 / numReeds);
      const hInPt = refractPoint(cx + cos(angH) * (reedInner + 0.6), cy + sin(angH) * (reedInner + 0.6), 0.28);
      const hOutPt = refractPoint(cx + cos(angH) * reedOuter, cy + sin(angH) * reedOuter, 0.28);
      const isLit = cos(angH - 225) > -0.2;
      brush.set("pen", isLit ? colSpecular : colMidTone, isLit ? 0.38 : 0.28);
      brush.line(hInPt[0], hInPt[1], hOutPt[0], hOutPt[1]);
    }
  }

  // Crisp outer contour rim of coin
  const outerLoop = discPts.concat([discPts[0]]);
  brush.set("rotring", colDeepRecess, 0.48);
  brush.spline(outerLoop, 0.15);

  // --------------------------------------------------------------------------
  // 5. Bas-Relief Numismatic Motif & Micro-Legend Lettering
  // --------------------------------------------------------------------------
  drawCoinReliefMotif(cx, cy, r, rot, motif, colDeepRecess, colMidTone, colHighlight, colSpecular);

  // Stamped micro-legend lettering & date ticks inside the rim
  const legR1 = r * 0.74;
  const legR2 = r * 0.82;
  for (let a = 0; a < 360; a += 8.5) {
    // Leave small natural gaps between legend words
    const relA = (a - rot + 360) % 360;
    if ((relA > 72 && relA < 105) || (relA > 245 && relA < 280)) continue;

    const pIn = refractPoint(cx + cos(a) * legR1, cy + sin(a) * legR1, 0.28);
    const pOut = refractPoint(cx + cos(a) * legR2, cy + sin(a) * legR2, 0.28);
    const pCross = refractPoint(cx + cos(a + 3.2) * ((legR1 + legR2) * 0.5), cy + sin(a + 3.2) * ((legR1 + legR2) * 0.5), 0.28);

    // Shadow of stamped letter
    brush.set("rotring", colDeepRecess, 0.36);
    brush.line(pIn[0] + 1.0, pIn[1] + 1.2, pOut[0] + 1.0, pOut[1] + 1.2);

    // Highlight of stamped letter
    brush.set("pen", colHighlight, 0.32);
    brush.line(pIn[0], pIn[1], pOut[0], pOut[1]);
    if (Math.floor(a) % 2 === 0) {
      brush.line(pIn[0], pIn[1], pCross[0], pCross[1]);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Green Verdigris / Malachite Patina Crust
  // --------------------------------------------------------------------------
  // Patina settles along the recessed inner rim channel, legend crevices, and relief hollows
  brush.noStroke();
  brush.fillBleed(0.14, "out");
  brush.fillTexture(0.75, 0.55);

  const numPatinaBlobs = Math.floor(14 + patina * 26);
  for (let p = 0; p < numPatinaBlobs; p++) {
    const pAng = random(360);
    // Bias patina toward inner rim groove (0.76 - 0.88 r) and central relief crevices (0.15 - 0.52 r)
    const rimBias = random() < 0.62 ? random(0.70, 0.87) : random(0.12, 0.58);
    const px = cx + cos(pAng) * (r * rimBias);
    const py = cy + sin(pAng) * (r * rimBias);
    const nVal = noise(coinIdx * 31 + px * 0.04, py * 0.04);

    if (nVal < patina + 0.18) {
      const rp = refractPoint(px, py, 0.28);
      const blobRad = r * random(0.06, 0.16);
      brush.fill(p % 2 === 0 ? patMid : patDark, random(110, 175));
      brush.circle(rp[0], rp[1], blobRad, 0.45);
    }
  }
  brush.noFill();

  // Powdery malachite & chalky verdigris mineral encrustation marks
  const crustMarks = Math.floor(35 + patina * 75);
  for (let m = 0; m < crustMarks; m++) {
    const pAng = random(360);
    const distR = r * (random() < 0.65 ? random(0.72, 0.89) : random(0.08, 0.62));
    const px = cx + cos(pAng) * distR;
    const py = cy + sin(pAng) * distR;

    if (noise(coinIdx * 19 + px * 0.035, py * 0.035) < patina + 0.22) {
      const rp1 = refractPoint(px, py, 0.28);
      const rp2 = refractPoint(px + random(-4.5, 4.5), py + random(-4.5, 4.5), 0.28);
      const colChoice = m % 3 === 0 ? patChalk : m % 3 === 1 ? patLight : patDark;
      brush.set("cpencil", colChoice, random(0.32, 0.52));
      brush.line(rp1[0], rp1[1], rp2[0], rp2[1]);
    }
  }
}

function drawCoinReliefMotif(cx, cy, r, rot, motif, colShadow, colMid, colHighlight, colSpecular) {
  function rPt(lx, ly, shX = 0, shY = 0) {
    const rad = rot * (Math.PI / 180);
    const rx = lx * Math.cos(rad) - ly * Math.sin(rad);
    const ry = lx * Math.sin(rad) + ly * Math.cos(rad);
    return refractPoint(cx + rx * r + shX, cy + ry * r + shY, 0.28);
  }

  function drawReliefPath(localPts, closed = true) {
    // 1. Recessed shadow pass (shifted toward lower-right)
    const shadPts = localPts.map(p => rPt(p[0], p[1], 1.8, 2.2));
    if (closed) shadPts.push(shadPts[0]);
    brush.set("rotring", colShadow, 0.52);
    brush.spline(shadPts, 0.25);

    // 2. Filled relief body mass
    if (closed && localPts.length >= 3) {
      const bodyPts = localPts.map(p => rPt(p[0], p[1], 0, 0));
      const pBody = new brush.Polygon(bodyPts);
      pBody.fill(colMid, 160, 0.03, 0.6);
      brush.noFill();
    }

    // 3. Burnished specular high-point ridge (shifted toward upper-left)
    const hiPts = localPts.map(p => rPt(p[0], p[1], -1.0, -1.2));
    if (closed) hiPts.push(hiPts[0]);
    brush.set("pen", colHighlight, 0.45);
    brush.spline(hiPts, 0.25);

    // Extra bright glint on the first half of the contour
    const glintPts = hiPts.slice(0, Math.max(2, Math.floor(hiPts.length * 0.55)));
    brush.set("pen", colSpecular, 0.38);
    brush.spline(glintPts, 0.25);
  }

  if (motif === "laureate_profile" || motif === "crowned_bust") {
    // Classical profile bust facing left/right with brow, nose, lips, chin, neck truncation, and hair/wreath
    const bustContour = [
      [-0.08, -0.52],
      [ 0.14, -0.48],
      [ 0.28, -0.34],
      [ 0.30, -0.14],
      [ 0.42, -0.02], // Nose tip
      [ 0.31,  0.05],
      [ 0.34,  0.12], // Lips
      [ 0.29,  0.22], // Chin
      [ 0.14,  0.26],
      [ 0.18,  0.46], // Front neck truncation
      [-0.24,  0.48], // Back neck truncation
      [-0.20,  0.22],
      [-0.32,  0.04],
      [-0.30, -0.26],
      [-0.22, -0.44]
    ];
    drawReliefPath(bustContour, true);

    // Internal relief ridges (laurel wreath / crown / ear / hair locks / drapery folds)
    const wreathArc = [
      [-0.22, -0.32],
      [-0.04, -0.22],
      [ 0.14, -0.34]
    ];
    drawReliefPath(wreathArc, false);

    const hairLocks = [
      [[-0.26, -0.14], [-0.12, -0.06], [-0.22, 0.08]],
      [[-0.18,  0.34], [ 0.02,  0.30], [ 0.14, 0.40]]
    ];
    for (let i = 0; i < hairLocks.length; i++) {
      drawReliefPath(hairLocks[i], false);
    }
  } else if (motif === "heraldic_shield") {
    const shield = [
      [-0.34, -0.38],
      [ 0.34, -0.38],
      [ 0.34,  0.06],
      [ 0.22,  0.30],
      [ 0.00,  0.48],
      [-0.22,  0.30],
      [-0.34,  0.06]
    ];
    drawReliefPath(shield, true);

    // Heraldic cross / quarterings inside shield
    drawReliefPath([[-0.30, -0.06], [0.30, -0.06]], false);
    drawReliefPath([[0.0, -0.36], [0.0, 0.44]], false);
    drawReliefPath([[-0.20, -0.48], [0.0, -0.56], [0.20, -0.48]], false);
  } else if (motif === "ancient_star") {
    const starPts = [];
    for (let k = 0; k < 16; k++) {
      const ang = (k / 16) * Math.PI * 2;
      const rad = k % 2 === 0 ? 0.50 : 0.24;
      starPts.push([Math.cos(ang) * rad, Math.sin(ang) * rad]);
    }
    drawReliefPath(starPts, true);

    const innerBoss = [];
    for (let k = 0; k < 10; k++) {
      const ang = (k / 10) * Math.PI * 2;
      innerBoss.push([Math.cos(ang) * 0.16, Math.sin(ang) * 0.16]);
    }
    drawReliefPath(innerBoss, true);
  } else {
    // Oak wreath + central denomination numeral
    const leftBranch = [
      [-0.06,  0.46],
      [-0.34,  0.32],
      [-0.46,  0.04],
      [-0.36, -0.28],
      [-0.14, -0.44]
    ];
    const rightBranch = [
      [ 0.06,  0.46],
      [ 0.34,  0.32],
      [ 0.46,  0.04],
      [ 0.36, -0.28],
      [ 0.14, -0.44]
    ];
    drawReliefPath(leftBranch, false);
    drawReliefPath(rightBranch, false);

    // Central bold Roman / Arabic numeral bars
    drawReliefPath([[-0.16, -0.22], [0.16, -0.22]], false);
    drawReliefPath([[-0.16,  0.22], [0.16,  0.22]], false);
    drawReliefPath([[-0.07, -0.22], [-0.07, 0.22]], false);
    drawReliefPath([[ 0.07, -0.22], [ 0.07, 0.22]], false);
  }
}

// ============================================================================
// PHOTOGRAPHIC CAUSTICS & PALE LIGHT THREADS (VORONOI CATENARY NETWORK)
// ============================================================================

function clipPolygonHalfPlane(poly, px, py, nx, ny) {
  const out = [];
  const n = poly.length;
  if (n === 0) return out;

  for (let i = 0; i < n; i++) {
    const A = poly[i];
    const B = poly[(i + 1) % n];
    const dA = (A[0] - px) * nx + (A[1] - py) * ny;
    const dB = (B[0] - px) * nx + (B[1] - py) * ny;

    if (dA <= 0) {
      out.push(A);
      if (dB > 0) {
        const t = dA / (dA - dB);
        out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]);
      }
    } else if (dB <= 0) {
      const t = dA / (dA - dB);
      out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]);
    }
  }
  return out;
}

function pointOnCoin(x, y) {
  for (let i = 0; i < COINS.length; i++) {
    const c = COINS[i];
    if (Math.hypot(x - c.x, y - c.y) < c.r * 0.96) return c;
  }
  return null;
}

function drawCausticNetwork() {
  // Generate jittered Voronoi sites for authentic cellular water caustics
  const sites = [];
  const cols = 10;
  const rows = 10;
  const cellW = (width + 160) / cols;
  const cellH = (height + 160) / rows;

  for (let gx = 0; gx < cols; gx++) {
    for (let gy = 0; gy < rows; gy++) {
      const sx = -80 + (gx + 0.18 + random(0.64)) * cellW;
      const sy = -80 + (gy + 0.18 + random(0.64)) * cellH;
      sites.push([sx, sy]);
    }
  }

  const cells = [];
  for (let i = 0; i < sites.length; i++) {
    const S = sites[i];
    let poly = [
      [-100, -100],
      [width + 100, -100],
      [width + 100, height + 100],
      [-100, height + 100]
    ];

    for (let j = 0; j < sites.length; j++) {
      if (i === j) continue;
      const T = sites[j];
      const dx = T[0] - S[0];
      const dy = T[1] - S[1];
      const dist = Math.hypot(dx, dy);
      if (dist > 340) continue;

      const mx = (S[0] + T[0]) * 0.5;
      const my = (S[1] + T[1]) * 0.5;
      poly = clipPolygonHalfPlane(poly, mx, my, dx / dist, dy / dist);
      if (poly.length === 0) break;
    }

    if (poly.length >= 3) {
      cells.push({ site: S, poly });
    }
  }

  // Collect bowed caustic threads and 3-way cusp nodes
  const causticSplines = [];
  const cuspNodes = [];

  for (let i = 0; i < cells.length; i++) {
    const { site, poly } = cells[i];
    const m = poly.length;

    for (let k = 0; k < m; k++) {
      const v1 = poly[k];
      const v2 = poly[(k + 1) % m];
      const segLen = Math.hypot(v2[0] - v1[0], v2[1] - v1[1]);
      if (segLen < 10) continue;

      // Record cusp vertex
      if (v1[0] > -20 && v1[0] < width + 20 && v1[1] > -20 && v1[1] < height + 20) {
        cuspNodes.push(v1);
      }

      // Bow the midpoint slightly inward toward the cell site for concave lens caustic curvature
      const midX = (v1[0] + v2[0]) * 0.5;
      const midY = (v1[1] + v2[1]) * 0.5;
      const pull = 0.085;
      const bowX = midX + (site[0] - midX) * pull;
      const bowY = midY + (site[1] - midY) * pull;

      const pStart = refractPoint(v1[0], v1[1], 0.65);
      const pMid   = refractPoint(bowX, bowY, 0.65);
      const pEnd   = refractPoint(v2[0], v2[1], 0.65);

      causticSplines.push({
        pts: [
          [pStart[0], pStart[1], 1.35],
          [pMid[0],   pMid[1],   0.52],
          [pEnd[0],   pEnd[1],   1.35]
        ],
        mid: pMid
      });
    }
  }

  // Pass 1: Soft golden-pale optical glow along the caustic web
  brush.set("2B", PALETTE.causticGlow, 0.52);
  for (let i = 0; i < causticSplines.length; i++) {
    brush.spline(causticSplines[i].pts, 0.45);
  }

  // Pass 2: Fine pale cream light threads
  brush.set("pen", PALETTE.causticWarm, 0.36);
  for (let i = 0; i < causticSplines.length; i++) {
    brush.spline(causticSplines[i].pts, 0.45);
  }

  // Pass 3: Razor-bright caustic core threads & specular flare over coins
  for (let i = 0; i < causticSplines.length; i += 2) {
    const cs = causticSplines[i];
    const onCoin = pointOnCoin(cs.mid[0], cs.mid[1]);
    brush.set("rotring", PALETTE.causticBright, onCoin ? 0.48 : 0.30);
    brush.spline(cs.pts, 0.45);
  }

  // Pass 4: Luminous 3-way caustic cusp nodes
  brush.noStroke();
  brush.fillBleed(0.18, "out");
  brush.fill(PALETTE.causticBright, 65);
  for (let i = 0; i < cuspNodes.length; i += 3) {
    const rp = refractPoint(cuspNodes[i][0], cuspNodes[i][1], 0.65);
    brush.circle(rp[0], rp[1], random(3.5, 6.5), 0.25);
  }
  brush.noFill();
}

function drawRippleCrestLight() {
  // Concentric broken light threads & shadow troughs along each ripple wavefront
  for (let i = 0; i < RIPPLES.length; i++) {
    const rp = RIPPLES[i];
    const numRings = Math.floor(rp.rings);

    for (let k = 0; k < numRings; k++) {
      const ringR = rp.rMin + (k + 0.5) * rp.waveLen;
      if (ringR > rp.rMax) continue;

      // Draw 5-7 broken luminous arcs along each concentric ripple ring
      const arcCount = 6;
      for (let a = 0; a < arcCount; a++) {
        const startAng = a * (360 / arcCount) + k * 23 + i * 41;
        const span = random(22, 44);
        const crestPts = [];
        const troughPts = [];

        for (let s = 0; s <= 6; s++) {
          const ang = startAng + (s / 6) * span;
          const cx = rp.x + cos(ang) * ringR;
          const cy = rp.y + sin(ang) * ringR;
          const tx = rp.x + cos(ang) * (ringR + 4.5);
          const ty = rp.y + sin(ang) * (ringR + 4.5);

          const pFactor = s === 0 || s === 6 ? 0.35 : s === 3 ? 1.35 : 0.9;
          crestPts.push([cx, cy, pFactor]);
          troughPts.push([tx, ty, pFactor * 0.8]);
        }

        // Subtle dark refraction trough just outside the ripple crest
        brush.set("2H", PALETTE.waterShadow, 0.28);
        brush.spline(troughPts, 0.4);

        // Luminous pale light thread along the ripple crest
        brush.set("pen", PALETTE.causticBright, 0.36);
        brush.spline(crestPts, 0.4);
      }
    }
  }
}
