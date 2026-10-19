// =============================================================================
// HYPERREAL PICTORIAL HARBOUR MAP — OBLIQUE BIRD'S-EYE ISLAND FERRY PORT
// Crisp sepia pen & clear watercolour fills (Prussian blue, terracotta, sage)
// =============================================================================

const PAL = {
  paper: "#f6eedc",
  paperWarm: "#efe1c6",
  skyGlow: "#f3dfc1",

  // Sepia Inks
  inkDark: "#382012",
  inkMid: "#593520",
  inkLight: "#7c5238",
  inkFaint: "#9c7356",
  inkSea: "#1d3f54",
  foamWhite: "#fcf8f0",

  // Prussian Blue Sea Watercolours
  seaDeep: "#103a57",
  seaMid: "#194f73",
  seaBright: "#256788",
  seaShallow: "#3b8494",
  seaCove: "#589ea1",
  wakeWash: "#d6ece8",

  // Land, Limestone Quays & Sunlit Walls
  quayLit: "#ead9bc",
  quayTop: "#f1e4cc",
  quayWall: "#c4aa87",
  quayDark: "#a68b68",
  earthWarm: "#e0c496",
  rockLit: "#d4ba94",
  rockShade: "#a88d6b",

  // Building Walls
  wallCream: "#f6ecda",
  wallOchre: "#eed09f",
  wallApricot: "#e7be94",
  wallRose: "#e2b89e",
  wallShade1: "#cbb18f",
  wallShade2: "#b69979",

  // Terracotta Roofs
  roofBright: "#c95830",
  roofClassic: "#b34623",
  roofWarm: "#d6713c",
  roofDeep: "#8c3318",

  // Sage Scrub & Mediterranean Flora
  sageLight: "#8a9e68",
  sageMid: "#6b8250",
  sageDeep: "#4d643a",
  sageGold: "#a8a86a",
  cypress: "#394d2c",

  // Boats, Umbrellas & Cartouches
  umbRed: "#cf5330",
  umbGold: "#e3a036",
  umbBlue: "#215875",
  umbCream: "#f7efe0",
  woodWarm: "#945d36",
  cartouche: "#fcf6e8",
  cartoucheBack: "#dbc29b"
};

// Stroke weight helper scaled for brush.scaleBrushes(3) on 1200x1200
function sw(w) {
  return w * 0.65;
}

// Helper: draw closed polygon using brush.beginShape
function polyShape(pts, curvature = 0) {
  if (!pts || pts.length < 3) return;
  brush.beginShape(curvature);
  for (let i = 0; i < pts.length; i++) {
    brush.vertex(pts[i][0], pts[i][1]);
  }
  brush.endShape(true);
}

// Helper: draw open polyline using brush.spline or segments
function polyLine(pts, curvature = 0.2) {
  if (!pts || pts.length < 2) return;
  if (pts.length === 2) {
    brush.line(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
    return;
  }
  brush.spline(pts, curvature);
}

// Perspective scale helper: flattens gently toward the upper horizon (y = 65)
function pScale(y) {
  return constrain(map(y, 65, 1180, 0.42, 1.08), 0.38, 1.12);
}

// Data containers for structured multi-pass rendering
let buildings = [];
let umbrellas = [];
let bollards = [];
let dinghies = [];
let sailboats = [];
let sagePatches = [];
let cypresses = [];
let cartouches = [];

async function setup() {
  createCanvas(1200, 1200, WEBGL);
  brush.scaleBrushes(3);
  angleMode(DEGREES);
  randomSeed(42719);
  noiseSeed(88412);
  background(PAL.paper);
  buildSceneGeometry();
}

function draw() {
  translate(-width / 2, -height / 2);
  brush.noField();

  // =========================================================================
  // PASS 1: WATERCOLOUR GROUND, PRUSSIAN BLUE SEA, LANDMASS & SAGE SCRUB
  // =========================================================================
  drawPaperAndSkyWashes();
  drawSeaWatercolours();
  drawLandAndQuayWatercolours();
  drawSageScrubWatercolours();

  // =========================================================================
  // PASS 2: BATCHED ARCHITECTURAL, NAUTICAL & TERRACOTTA WATERCOLOUR FILLS
  // =========================================================================
  drawBuildingWatercolours();
  drawFerryAndBoatWatercolours();
  drawUmbrellaWatercolours();

  // =========================================================================
  // PASS 3: CRISP SEPIA PEN HYPERREAL LINEWORK & DETAILS
  // =========================================================================
  drawHorizonAndDistantCoastPen();
  drawSeaRipplesAndContoursPen();
  drawFerryWakePen();
  drawRocksBeachesAndHillsPen();
  drawSageScrubAndTreesPen();
  drawQuaysPiersAndBreakwaterPen();
  drawMooredDinghiesAndSailboatsPen();
  drawIslandFerryPen();
  drawAllBuildingsAndRoofTilesPen();
  drawCafeUmbrellasAndPromenadeLifePen();
  drawBollardsAndMooringLinesPen();
  drawCompassRoseAndMapFramePen();
  drawFloatingCartouches();

  noLoop();
}

// =============================================================================
// SCENE GEOMETRY GENERATION
// =============================================================================
function buildSceneGeometry() {
  // 1. SAGE SCRUB PATCHES across headlands & terraced hillsides
  const scrubCenters = [
    // North Headland (upper left)
    [130, 135, 85, 32, PAL.sageMid],
    [210, 125, 95, 36, PAL.sageLight],
    [295, 140, 110, 42, PAL.sageDeep],
    [380, 130, 95, 35, PAL.sageGold],
    [455, 155, 100, 38, PAL.sageMid],
    [250, 175, 85, 30, PAL.sageDeep],
    [350, 185, 90, 34, PAL.sageLight],
    // Upper Ridge & Sanctuary Hill
    [545, 115, 120, 42, PAL.sageLight],
    [650, 105, 135, 45, PAL.sageMid],
    [775, 110, 140, 48, PAL.sageDeep],
    [900, 115, 135, 46, PAL.sageGold],
    [1035, 120, 150, 52, PAL.sageMid],
    [1135, 145, 125, 50, PAL.sageDeep],
    // Mid-hillside green belts between town terraces
    [520, 215, 105, 40, PAL.sageMid],
    [635, 185, 115, 42, PAL.sageDeep],
    [745, 175, 110, 40, PAL.sageLight],
    [965, 195, 130, 48, PAL.sageMid],
    [1110, 235, 140, 55, PAL.sageLight],
    [825, 265, 95, 38, PAL.sageDeep],
    [1045, 315, 125, 50, PAL.sageGold],
    [1140, 390, 120, 56, PAL.sageMid],
    [980, 445, 95, 42, PAL.sageDeep],
    [1135, 535, 130, 62, PAL.sageLight],
    // South-East Headland above breakwater
    [1060, 745, 130, 58, PAL.sageMid],
    [1145, 800, 125, 60, PAL.sageDeep],
    [1015, 820, 95, 44, PAL.sageGold],
    [1120, 865, 115, 48, PAL.sageLight]
  ];

  for (let s of scrubCenters) {
    let pts = [];
    let n = 14;
    for (let i = 0; i < n; i++) {
      let a = (i / n) * 360;
      let r = 0.78 + 0.32 * noise(s[0] * 0.02 + cos(a), s[1] * 0.02 + sin(a));
      pts.push([
        s[0] + cos(a) * s[2] * 0.5 * r,
        s[1] + sin(a) * s[3] * 0.5 * r
      ]);
    }
    sagePatches.push({ cx: s[0], cy: s[1], rx: s[2] * 0.5, ry: s[3] * 0.5, col: s[4], pts });
  }

  // 2. CYPRESS TREES & COASTAL PINES
  const cypCoords = [
    [195, 132], [225, 142], [312, 128], [415, 142], [490, 135],
    [590, 118], [610, 122], [685, 108], [715, 115], [810, 148],
    [830, 152], [915, 142], [940, 148], [1020, 165], [1042, 172],
    [1125, 185], [565, 225], [690, 215], [710, 222], [930, 260],
    [952, 268], [1095, 295], [1120, 305], [895, 355], [1065, 420],
    [1088, 430], [1150, 485], [1030, 585], [1145, 640], [1085, 760],
    [1110, 770], [1160, 795]
  ];
  for (let c of cypCoords) {
    let sc = pScale(c[1]);
    cypresses.push({
      x: c[0],
      y: c[1],
      h: random(28, 44) * sc,
      w: random(7, 11) * sc
    });
  }

  // 3. BUILDINGS (Sorted back-to-front by y after creation)
  const wallCols = [PAL.wallCream, PAL.wallOchre, PAL.wallApricot, PAL.wallRose];
  const roofCols = [PAL.roofBright, PAL.roofClassic, PAL.roofWarm];

  function addBldg(x, y, w, d, h, ang, opts = {}) {
    let sc = pScale(y);
    buildings.push({
      x,
      y,
      w: w * sc,
      d: d * sc,
      h: h * sc,
      ang: ang !== undefined ? ang : 22,
      sc,
      wallLit: opts.wallLit || random(wallCols),
      wallShade: opts.wallShade || (random() > 0.4 ? PAL.wallShade1 : PAL.wallShade2),
      roofCol: opts.roofCol || random(roofCols),
      roofType: opts.roofType || "hipped",
      stories: opts.stories || floor(random(2, 4)),
      arcade: opts.arcade || false,
      balcony: opts.balcony !== undefined ? opts.balcony : random() > 0.45,
      chimneys: opts.chimneys !== undefined ? opts.chimneys : (random() > 0.35 ? 1 : 2),
      special: opts.special || null
    });
  }

  // Special Landmark 1: North Headland Lighthouse (x: 162, y: 148)
  addBldg(162, 148, 28, 24, 34, 18, {
    wallLit: PAL.wallCream,
    roofCol: PAL.roofBright,
    stories: 2,
    special: "lighthouse"
  });

  // Special Landmark 2: Hilltop Baroque Sanctuary / Dome Church (x: 860, y: 245)
  addBldg(860, 248, 66, 48, 48, 20, {
    wallLit: PAL.wallCream,
    wallShade: PAL.wallShade1,
    roofCol: PAL.roofClassic,
    stories: 3,
    arcade: true,
    special: "church"
  });

  // Special Landmark 3: Old Stone Windmill / Watchtower on East Ridge (x: 1072, y: 280)
  addBldg(1072, 280, 32, 32, 46, 24, {
    wallLit: PAL.wallOchre,
    roofCol: PAL.roofBright,
    stories: 3,
    special: "windmill"
  });

  // Tier 5: High Hillside Village Houses (y: 190..280)
  const tier5 = [
    [515, 245, 36, 26, 28, 16],
    [555, 232, 32, 24, 32, 18],
    [595, 222, 40, 28, 30, 18],
    [640, 215, 34, 26, 35, 20],
    [680, 228, 38, 26, 28, 20],
    [725, 218, 42, 30, 34, 22],
    [770, 225, 36, 28, 30, 22],
    [810, 235, 34, 26, 28, 20],
    [920, 235, 38, 28, 32, 24],
    [965, 248, 42, 30, 30, 25],
    [1010, 262, 36, 26, 34, 26],
    [1125, 295, 38, 28, 28, 28]
  ];
  for (let b of tier5) addBldg(b[0], b[1], b[2], b[3], b[4], b[5], { roofType: random(["hipped", "gabled"]) });

  // Tier 4: Upper-Mid Amphitheatre Terrace (y: 265..380)
  const tier4 = [
    [475, 282, 38, 28, 32, 16],
    [520, 278, 42, 30, 36, 18],
    [568, 272, 36, 28, 30, 19],
    [612, 268, 44, 32, 38, 20],
    [662, 275, 40, 28, 32, 21],
    [710, 282, 46, 32, 36, 22],
    [758, 292, 38, 28, 34, 24],
    [805, 305, 42, 30, 38, 24],
    [855, 318, 48, 34, 34, 25],
    [908, 330, 40, 30, 36, 26],
    [958, 342, 44, 32, 32, 28],
    [1010, 355, 38, 28, 35, 28],
    [1062, 372, 42, 30, 30, 30],
    [1115, 388, 38, 28, 32, 30]
  ];
  for (let b of tier4) addBldg(b[0], b[1], b[2], b[3], b[4], b[5], { roofType: random(["hipped", "gabled"]) });

  // Tier 3: Mid-Town Stepped Streets (y: 330..510)
  const tier3 = [
    [495, 332, 42, 32, 36, 18],
    [545, 328, 46, 34, 40, 20],
    [598, 325, 40, 30, 34, 20],
    [648, 332, 48, 34, 42, 22],
    [702, 345, 44, 32, 38, 23],
    [752, 362, 40, 30, 34, 25],
    [802, 380, 48, 34, 40, 26],
    [855, 398, 44, 32, 36, 28],
    [905, 418, 42, 32, 38, 28],
    [955, 438, 46, 34, 34, 30],
    [1008, 462, 40, 30, 36, 30],
    [1060, 485, 44, 32, 32, 32],
    [1112, 510, 40, 30, 34, 32]
  ];
  for (let b of tier3) addBldg(b[0], b[1], b[2], b[3], b[4], b[5], { roofType: random(["hipped", "gabled"]) });

  // Tier 2: Lower Hillside Overlooking Harbour (y: 410..650)
  const tier2 = [
    [682, 408, 46, 34, 40, 22],
    [735, 428, 50, 36, 44, 24],
    [790, 452, 44, 34, 38, 26],
    [842, 478, 48, 36, 42, 28],
    [892, 508, 46, 34, 38, 30],
    [942, 538, 50, 36, 42, 32],
    [992, 568, 44, 32, 36, 32],
    [1045, 598, 48, 34, 38, 34],
    [1098, 628, 42, 32, 34, 34],
    [1148, 655, 40, 30, 32, 35]
  ];
  for (let b of tier2) addBldg(b[0], b[1], b[2], b[3], b[4], b[5], { stories: 3, roofType: "hipped" });

  // Tier 1: Grand Waterfront Riva Buildings & Loggias (Front Row along Quay)
  // North Bastion Tavern
  addBldg(435, 315, 46, 34, 36, 15, { arcade: true, wallLit: PAL.wallApricot, roofCol: PAL.roofBright, stories: 3 });
  // Custom House / Harbour Master (Capitaneria) with Clocktower
  addBldg(615, 398, 64, 42, 46, 22, {
    arcade: true,
    wallLit: PAL.wallOchre,
    roofCol: PAL.roofClassic,
    stories: 3,
    special: "capitaneria"
  });
  // Ferry Pier Ticket Pavilion on the root of the main pier
  addBldg(468, 492, 36, 26, 24, 28, {
    arcade: true,
    wallLit: PAL.wallCream,
    roofCol: PAL.roofBright,
    stories: 1,
    special: "pier_pavilion"
  });
  // Waterfront Palazzi curving around the Riva
  addBldg(705, 468, 52, 36, 42, 25, { arcade: true, wallLit: PAL.wallRose, roofCol: PAL.roofBright, stories: 3 });
  addBldg(768, 512, 54, 38, 44, 28, { arcade: true, wallLit: PAL.wallCream, roofCol: PAL.roofClassic, stories: 3 });
  addBldg(828, 562, 50, 36, 40, 30, { arcade: true, wallLit: PAL.wallOchre, roofCol: PAL.roofWarm, stories: 3 });
  addBldg(882, 615, 52, 36, 42, 32, { arcade: true, wallLit: PAL.wallApricot, roofCol: PAL.roofBright, stories: 3 });
  addBldg(935, 668, 48, 34, 38, 35, { arcade: true, wallLit: PAL.wallCream, roofCol: PAL.roofClassic, stories: 3 });
  addBldg(985, 718, 46, 34, 36, 36, { arcade: false, wallLit: PAL.wallRose, roofCol: PAL.roofBright, stories: 2 });
  addBldg(1038, 690, 44, 32, 36, 34, { arcade: false, wallLit: PAL.wallOchre, roofCol: PAL.roofWarm, stories: 3 });
  addBldg(1092, 720, 42, 30, 32, 35, { arcade: false, wallLit: PAL.wallCream, roofCol: PAL.roofClassic, stories: 2 });

  // Sort buildings strictly back-to-front by base Y
  buildings.sort((a, b) => a.y - b.y);

  // 4. CAFÉ UMBRELLAS along the sunny waterfront piazzas
  const umbrellaClusters = [
    // North Quay Café
    { x: 472, y: 342, col: PAL.umbRed },
    { x: 494, y: 350, col: PAL.umbCream },
    { x: 515, y: 356, col: PAL.umbGold },
    // Capitaneria Piazza
    { x: 565, y: 416, col: PAL.umbRed },
    { x: 588, y: 428, col: PAL.umbGold },
    { x: 612, y: 438, col: PAL.umbCream },
    { x: 636, y: 448, col: PAL.umbRed },
    { x: 595, y: 452, col: PAL.umbBlue },
    // Grand Riva Promenade Cafés
    { x: 678, y: 488, col: PAL.umbGold },
    { x: 702, y: 502, col: PAL.umbRed },
    { x: 726, y: 518, col: PAL.umbCream },
    { x: 750, y: 534, col: PAL.umbRed },
    { x: 774, y: 552, col: PAL.umbGold },
    { x: 732, y: 542, col: PAL.umbBlue },
    { x: 758, y: 560, col: PAL.umbCream },
    // Mid-Riva Trattoria
    { x: 808, y: 586, col: PAL.umbRed },
    { x: 830, y: 606, col: PAL.umbCream },
    { x: 850, y: 626, col: PAL.umbGold },
    { x: 870, y: 648, col: PAL.umbRed },
    { x: 832, y: 632, col: PAL.umbBlue },
    // South Wharf Taverna
    { x: 902, y: 685, col: PAL.umbGold },
    { x: 920, y: 710, col: PAL.umbRed },
    { x: 938, y: 735, col: PAL.umbCream },
    { x: 952, y: 760, col: PAL.umbRed },
    // Pier Head Café Kiosk
    { x: 435, y: 512, col: PAL.umbBlue },
    { x: 452, y: 524, col: PAL.umbGold }
  ];
  for (let u of umbrellaClusters) {
    let sc = pScale(u.y);
    umbrellas.push({
      x: u.x,
      y: u.y,
      r: random(11.5, 14) * sc,
      sc,
      col: u.col
    });
  }

  // 5. BOLLARDS along Main Ferry Pier, Riva Quay, and South Breakwater Mole
  const bollardPaths = [
    // North Quay
    [[395, 298], [528, 378], 5],
    // Main Ferry Pier outer edge
    [[528, 392], [380, 512], 6],
    // Main Ferry Pier head & inner edge
    [[380, 512], [418, 555], 3],
    [[418, 555], [575, 442], 6],
    // Curved Riva Quay edge
    [[585, 448], [715, 522], 6],
    [[715, 522], [835, 628], 6],
    [[835, 628], [918, 765], 6],
    [[918, 765], [895, 865], 4],
    // South Breakwater Mole inner quay
    [[885, 882], [650, 915], 7],
    [[650, 915], [435, 932], 7]
  ];
  for (let bp of bollardPaths) {
    let [p0, p1, count] = bp;
    for (let i = 0; i < count; i++) {
      let t = (i + 0.35) / count;
      let bx = lerp(p0[0], p1[0], t);
      let by = lerp(p0[1], p1[1], t);
      bollards.push({ x: bx, y: by, sc: pScale(by), hasCoil: random() > 0.4 });
    }
  }

  // 6. MOORED DINGHIES & FISHING GOZZI
  const boatCols = [PAL.seaBright, PAL.roofBright, PAL.umbGold, PAL.sageMid, PAL.wallCream, PAL.seaDeep];

  // Row A: Moored along the Inner Riva (between x: 600 and 880)
  for (let i = 0; i < 9; i++) {
    let t = i / 8;
    let qx = lerp(612, 865, t) + sin(t * 180) * 18;
    let qy = lerp(478, 720, t) - sin(t * 180) * 12;
    let bx = qx - random(28, 42);
    let by = qy + random(14, 24);
    dinghies.push({
      x: bx,
      y: by,
      len: random(28, 38) * pScale(by),
      beam: random(11, 15) * pScale(by),
      ang: random(22, 42),
      col: boatCols[i % boatCols.length],
      moorX: qx,
      moorY: qy - 6,
      hasOars: i % 2 === 0,
      hasCabin: i % 4 === 1
    });
  }

  // Row B: Moored along the Floating Wooden Jetty #1 in the South Basin (y ~ 785)
  for (let i = 0; i < 8; i++) {
    let jx = lerp(640, 845, i / 7);
    let jy = lerp(805, 780, i / 7);
    // Boats on north side of jetty
    dinghies.push({
      x: jx - 8,
      y: jy - 22,
      len: random(30, 40) * pScale(jy),
      beam: random(12, 15) * pScale(jy),
      ang: random(75, 95),
      col: boatCols[(i + 2) % boatCols.length],
      moorX: jx,
      moorY: jy,
      hasOars: i % 2 === 1,
      hasCabin: i % 3 === 0
    });
  }

  // Row C: Moored along the South Breakwater Mole inner wall (y ~ 885..915)
  for (let i = 0; i < 10; i++) {
    let mx = lerp(485, 845, i / 9);
    let my = lerp(922, 882, i / 9);
    dinghies.push({
      x: mx - 6,
      y: my - 28,
      len: random(32, 44) * pScale(my),
      beam: random(13, 16) * pScale(my),
      ang: random(68, 88),
      col: boatCols[(i + 1) % boatCols.length],
      moorX: mx,
      moorY: my,
      hasOars: i % 3 !== 0,
      hasCabin: i % 3 === 0
    });
  }

  // Row D: Anchored Dinghies in the Upper Cove & Outer Harbour
  const coveBoats = [
    [355, 255, 15], [395, 268, 25], [320, 282, 10], [435, 262, -15],
    [285, 365, 20], [335, 395, 32], [520, 620, 28], [565, 675, 38]
  ];
  for (let i = 0; i < coveBoats.length; i++) {
    let cb = coveBoats[i];
    let sc = pScale(cb[1]);
    dinghies.push({
      x: cb[0],
      y: cb[1],
      len: random(28, 36) * sc,
      beam: random(11, 14) * sc,
      ang: cb[2],
      col: boatCols[i % boatCols.length],
      moorX: cb[0] + cos(cb[2]) * 20 * sc,
      moorY: cb[1] + sin(cb[2]) * 20 * sc,
      hasOars: true,
      hasCabin: false,
      buoy: true
    });
  }

  // 7. SAILBOATS in the outer bay and upper horizon
  sailboats = [
    { x: 95, y: 245, sc: pScale(245) * 1.15, ang: 18 },
    { x: 205, y: 310, sc: pScale(310) * 1.15, ang: -12 },
    { x: 115, y: 435, sc: pScale(435) * 1.1, ang: 24 },
    { x: 75, y: 110, sc: pScale(110) * 1.2, ang: 8 },
    { x: 315, y: 96, sc: pScale(96) * 1.2, ang: -10 },
    { x: 640, y: 82, sc: pScale(82) * 1.1, ang: 12 }
  ];

  // 8. TINY CARTOUCHE-LIKE BLANK BANNERS floating over key buildings
  cartouches = [
    { x: 162, y: 92, w: 92, h: 22, targetX: 162, targetY: 118 },     // North Headland Lighthouse
    { x: 860, y: 162, w: 112, h: 25, targetX: 860, targetY: 198 },   // Hilltop Sanctuary Church
    { x: 1072, y: 212, w: 100, h: 23, targetX: 1072, targetY: 242 }, // Old East Ridge Windmill
    { x: 618, y: 312, w: 118, h: 26, targetX: 618, targetY: 348 },   // Capitaneria Clocktower
    { x: 456, y: 438, w: 102, h: 24, targetX: 468, targetY: 468 },   // Main Ferry Pier Pavilion
    { x: 792, y: 455, w: 108, h: 25, targetX: 768, targetY: 482 },   // Grand Riva Café Loggia
    { x: 412, y: 842, w: 106, h: 25, targetX: 412, targetY: 882 }    // Harbour Mole Lantern Tower
  ];
}

// =============================================================================
// PASS 1: PAPER, SEA, LAND & SAGE SCRUB WATERCOLOURS
// =============================================================================
function drawPaperAndSkyWashes() {
  brush.noStroke();
  // Full-bleed warm parchment wash
  brush.wash(PAL.paper, 255);
  brush.rect(0, 0, 1200, 1200, "corner");

  // Warm golden-apricot horizon sky band at the very top (y: 0..75)
  brush.fill(PAL.skyGlow, 140);
  brush.fillBleed(0.3, "out");
  brush.fillTexture(0.45, 0.2);
  polyShape([[0, 0], [1200, 0], [1200, 78], [0, 78]]);
  brush.noFill();
}

function drawSeaWatercolours() {
  brush.noStroke();

  // Base Prussian Blue sea across the entire marine basin
  brush.fill(PAL.seaMid, 195);
  brush.fillBleed(0.22, "out");
  brush.fillTexture(0.55, 0.3);
  polyShape([
    [0, 65], [1200, 65], [1200, 120],
    [550, 110], [450, 210], [560, 390],
    [940, 770], [1200, 860], [1200, 1200], [0, 1200]
  ]);

  // Deep Prussian Blue outer sea (left, upper horizon, and bottom deep water)
  brush.fill(PAL.seaDeep, 165);
  brush.fillBleed(0.28, "out");
  brush.fillTexture(0.6, 0.35);
  polyShape([
    [0, 65], [780, 65], [560, 105], [120, 145],
    [290, 360], [355, 535], [375, 940],
    [1200, 995], [1200, 1200], [0, 1200]
  ]);

  // Second deep Prussian glaze in the outer approach channel
  polyShape([
    [0, 180], [210, 250], [285, 490],
    [180, 780], [450, 1040], [1200, 1060],
    [1200, 1200], [0, 1200]
  ]);

  // Mid-bright cerulean-Prussian transition inside the harbour bay
  brush.fill(PAL.seaBright, 150);
  brush.fillBleed(0.25, "out");
  polyShape([
    [240, 210], [490, 240], [575, 420],
    [885, 690], [915, 880], [410, 925],
    [320, 620], [240, 390]
  ]);

  // Turquoise coves & shallow water along rocky headlands, pebble beach & inner quay
  brush.fill(PAL.seaShallow, 155);
  brush.fillBleed(0.25, "out");
  // Upper cove & beach shallows
  polyShape([
    [125, 165], [360, 205], [495, 235],
    [520, 325], [385, 310], [285, 245]
  ]);
  // Inner harbour basin shallows along Riva and Jetties
  polyShape([
    [545, 435], [720, 515], [895, 695],
    [925, 875], [520, 910], [585, 760], [545, 560]
  ]);

  // Luminous pale turquoise beach & ferry wake wash
  brush.fill(PAL.seaCove, 140);
  brush.fillBleed(0.2, "out");
  polyShape([
    [365, 215], [485, 235], [495, 295], [380, 275]
  ]);
  // Ferry wake watercolour under-wash (expanding V from ferry to bottom-left)
  polyShape([
    [275, 645], [185, 720], [0, 910],
    [0, 1200], [310, 1200], [260, 765]
  ]);

  // Creamy foam wash directly behind ferry stern
  brush.fill(PAL.wakeWash, 175);
  brush.fillBleed(0.18, "out");
  polyShape([
    [215, 685], [135, 755], [0, 975],
    [0, 1150], [185, 1200], [215, 815]
  ]);

  brush.noFill();
}

function drawLandAndQuayWatercolours() {
  brush.noStroke();

  // 1. Main Island Landmass & Hillside Warm Ochre-Earth Wash
  brush.fill(PAL.earthWarm, 220);
  brush.fillBleed(0.18, "in");
  brush.fillTexture(0.5, 0.25);
  polyShape([
    [545, 92], [1200, 82], [1200, 900],
    [930, 860], [915, 760], [860, 660],
    [755, 555], [585, 440], [515, 360],
    [415, 295], [465, 235], [355, 208],
    [105, 152], [160, 118], [385, 112]
  ]);

  // 2. Warm Sunlit Limestone Promenade, Quays, Main Ferry Pier & South Breakwater Mole
  brush.fill(PAL.quayLit, 235);
  brush.fillBleed(0.08, "in");
  brush.fillTexture(0.4, 0.25);
  // Continuous Riva Quay + Main Ferry Pier + South Breakwater
  polyShape([
    [390, 290], [525, 365], [532, 392],
    [376, 510], [416, 556], [582, 442],
    [712, 518], [832, 622], [916, 758],
    [892, 868], [408, 926], [404, 962],
    [720, 975], [1200, 915], [1200, 845],
    [985, 785], [945, 680], [855, 560],
    [725, 455], [585, 375], [455, 280]
  ]);

  // 3. Darker Shaded Vertical Seawall & Breakwater Armour Base (fast wash)
  brush.wash(PAL.quayWall, 210);
  // Main Ferry Pier side wall
  polyShape([[376, 510], [416, 556], [416, 576], [376, 530]]);
  polyShape([[416, 556], [582, 442], [582, 462], [416, 576]]);
  // Riva Seawall
  polyShape([
    [582, 442], [712, 518], [832, 622], [916, 758],
    [916, 778], [832, 642], [712, 538], [582, 462]
  ]);
  // Outer South Breakwater Seaward Wall
  polyShape([
    [404, 962], [720, 975], [1200, 915],
    [1200, 945], [720, 1002], [404, 986]
  ]);

  // 4. Floating Wooden Jetties in the South Basin
  brush.wash(PAL.woodWarm, 210);
  polyShape([[625, 804], [885, 774], [890, 786], [628, 816]]);
  polyShape([[665, 848], [898, 822], [902, 834], [668, 860]]);

  brush.noWash();
  brush.noFill();
}

function drawSageScrubWatercolours() {
  brush.noStroke();
  // Group sage scrub patches by colour for fast cached watercolour fills
  const sageColors = [PAL.sageLight, PAL.sageMid, PAL.sageDeep, PAL.sageGold];
  for (let col of sageColors) {
    brush.fill(col, 170);
    brush.fillBleed(0.26, "out");
    brush.fillTexture(0.55, 0.3);
    for (let sp of sagePatches) {
      if (sp.col === col) {
        polyShape(sp.pts, 0.3);
      }
    }
  }
  brush.noFill();
}

// =============================================================================
// PASS 2: BATCHED BUILDING, BOAT & UMBRELLA WATERCOLOURS
// =============================================================================
function getBuildingGeometry(b) {
  let a1 = b.ang;
  let a2 = b.ang - 68;
  let ux = cos(a1), uy = sin(a1);
  let vx = cos(a2), vy = sin(a2);

  // Base footprint corners: F (front-left), R (front-right), B (back-right), L (back-left)
  let Fx = b.x - ux * b.w * 0.5;
  let Fy = b.y - uy * b.w * 0.5;
  let Rx = Fx + ux * b.w;
  let Ry = Fy + uy * b.w;
  let Bx = Rx + vx * b.d;
  let By = Ry + vy * b.d;
  let Lx = Fx + vx * b.d;
  let Ly = Fy + vy * b.d;

  // Top of walls (eaves): FT, RT, BT, LT
  let FT = [Fx, Fy - b.h];
  let RT = [Rx, Ry - b.h];
  let BT = [Bx, By - b.h];
  let LT = [Lx, Ly - b.h];

  // Roof ridge points
  let roofH = b.d * 0.46 + 5 * b.sc;
  let inset = b.roofType === "gabled" ? 0.02 : 0.22;
  let r0x = (FT[0] + LT[0]) * 0.5 + ux * b.w * inset;
  let r0y = (FT[1] + LT[1]) * 0.5 + uy * b.w * inset - roofH;
  let r1x = (RT[0] + BT[0]) * 0.5 - ux * b.w * inset;
  let r1y = (RT[1] + BT[1]) * 0.5 - uy * b.w * inset - roofH;

  return {
    F: [Fx, Fy], R: [Rx, Ry], B: [Bx, By], L: [Lx, Ly],
    FT, RT, BT, LT,
    R0: [r0x, r0y], R1: [r1x, r1y],
    ux, uy, vx, vy
  };
}

function drawBuildingWatercolours() {
  brush.noStroke();

  // 1. Building wall washes (lit front facades & shaded side facades)
  for (let b of buildings) {
    let g = getBuildingGeometry(b);
    b.geom = g;

    // Ground shadow cast to the right
    brush.wash(PAL.quayDark, 85);
    polyShape([
      g.R, g.B,
      [g.B[0] + 12 * b.sc, g.B[1] + 5 * b.sc],
      [g.R[0] + 12 * b.sc, g.R[1] + 5 * b.sc]
    ]);

    // Lit front wall
    brush.wash(b.wallLit, 235);
    polyShape([g.F, g.R, g.RT, g.FT]);

    // Shaded right-side wall (or gabled end wall)
    brush.wash(b.wallShade, 235);
    if (b.roofType === "gabled") {
      polyShape([g.R, g.B, g.BT, g.R1, g.RT]);
    } else {
      polyShape([g.R, g.B, g.BT, g.RT]);
    }
  }
  brush.noWash();

  // 2. Terracotta Roofs — batched by roof colour with genuine watercolour fill!
  const roofPalette = [PAL.roofBright, PAL.roofClassic, PAL.roofWarm];
  for (let rCol of roofPalette) {
    brush.fill(rCol, 205);
    brush.fillBleed(0.12, "out");
    brush.fillTexture(0.5, 0.35);
    for (let b of buildings) {
      if (b.roofCol === rCol) {
        let g = b.geom;
        if (b.roofType === "gabled") {
          polyShape([g.FT, g.RT, g.R1, g.R0]);
        } else {
          // Combined hipped roof silhouette for smooth watercolour bleed
          polyShape([g.FT, g.RT, g.BT, g.R1, g.R0, g.LT]);
        }
      }
    }
  }
  brush.noFill();

  // 3. Darker terracotta shade wash on right-facing hip slopes
  brush.wash(PAL.roofDeep, 115);
  for (let b of buildings) {
    if (b.roofType !== "gabled") {
      let g = b.geom;
      polyShape([g.RT, g.BT, g.R1]);
    }
  }
  brush.noWash();
}

function drawFerryAndBoatWatercolours() {
  brush.noStroke();

  // 1. Island Ferry Watercolour Fills (at x: 235, y: 675, angle: -34 deg)
  let fx = 235, fy = 675, fang = -34;
  let ux = cos(fang), uy = sin(fang);
  let vx = -sin(fang), vy = cos(fang);
  function fp(l, w, h = 0) {
    return [fx + ux * l + vx * w, fy + uy * l + vy * w - h];
  }

  // Ferry water shadow
  brush.wash(PAL.seaDeep, 140);
  polyShape([fp(-122, 34), fp(95, 34), fp(132, 8), fp(128, 44), fp(-118, 48)]);

  // Ferry lower hull (Prussian blue with red waterline)
  brush.fill(PAL.seaDeep, 225);
  brush.fillBleed(0.08, "in");
  polyShape([
    fp(-120, -26, 0), fp(85, -30, 0), fp(132, 0, 0),
    fp(85, 30, 0), fp(-120, 28, 0),
    fp(-122, 26, 16), fp(82, 28, 16), fp(136, 0, 20), fp(-122, -24, 16)
  ]);
  brush.noFill();

  // Ferry bright white superstructure & decks
  brush.fill(PAL.wallCream, 240);
  brush.fillBleed(0.06, "in");
  polyShape([
    fp(-112, -24, 16), fp(75, -24, 16), fp(98, 0, 16), fp(75, 24, 16), fp(-112, 24, 16),
    fp(-105, 22, 46), fp(58, 22, 46), fp(68, -22, 46), fp(-105, -22, 46)
  ]);
  brush.noFill();

  // Ferry aft sun-deck awning (Prussian blue & cream) and terracotta funnel
  brush.wash(PAL.umbBlue, 185);
  polyShape([fp(-102, -20, 46), fp(-25, -20, 46), fp(-25, 20, 46), fp(-102, 20, 46)]);

  brush.wash(PAL.roofBright, 235);
  // Funnel
  polyShape([fp(-22, -6, 46), fp(4, -6, 46), fp(-2, -4, 72), fp(-20, -4, 72)]);
  // Lifeboats (2 per side)
  polyShape([fp(-48, 21, 34), fp(-26, 21, 34), fp(-26, 26, 30), fp(-48, 26, 30)]);
  polyShape([fp(-16, 21, 34), fp(6, 21, 34), fp(6, 26, 30), fp(-16, 26, 30)]);

  // 2. Moored Dinghies Watercolour Washes
  for (let d of dinghies) {
    let dux = cos(d.ang), duy = sin(d.ang);
    let dvx = -sin(d.ang), dvy = cos(d.ang);
    let L = d.len * 0.5, W = d.beam * 0.5;
    let bow = [d.x + dux * L, d.y + duy * L];
    let sb1 = [d.x + dux * L * 0.35 + dvx * W, d.y + duy * L * 0.35 + dvy * W];
    let sb2 = [d.x - dux * L * 0.75 + dvx * W * 0.85, d.y - duy * L * 0.75 + dvy * W * 0.85];
    let stn = [d.x - dux * L, d.y - duy * L];
    let pb2 = [d.x - dux * L * 0.75 - dvx * W * 0.85, d.y - duy * L * 0.75 - dvy * W * 0.85];
    let pb1 = [d.x + dux * L * 0.35 - dvx * W, d.y + duy * L * 0.35 - dvy * W];
    d.pts = [bow, sb1, sb2, stn, pb2, pb1];

    // Dark water reflection under hull
    brush.wash(PAL.seaDeep, 125);
    polyShape(d.pts.map(p => [p[0] + 2, p[1] + 4]));

    // Hull interior/gunwale fill
    brush.wash(d.col, 215);
    polyShape(d.pts);
  }
  brush.noWash();
}

function drawUmbrellaWatercolours() {
  brush.noStroke();
  // Cast shadows on the limestone quay first
  brush.wash(PAL.quayDark, 115);
  for (let u of umbrellas) {
    let pts = [];
    for (let i = 0; i < 8; i++) {
      let a = i * 45 + 22.5;
      pts.push([u.x + 5 * u.sc + cos(a) * u.r, u.y + 6 * u.sc + sin(a) * u.r * 0.72]);
    }
    polyShape(pts);
  }
  brush.noWash();

  // Umbrella canopies batched by colour
  const umbCols = [PAL.umbRed, PAL.umbGold, PAL.umbBlue, PAL.umbCream];
  for (let col of umbCols) {
    brush.fill(col, 220);
    brush.fillBleed(0.08, "out");
    brush.fillTexture(0.4, 0.25);
    for (let u of umbrellas) {
      if (u.col === col) {
        let pts = [];
        for (let i = 0; i < 8; i++) {
          let a = i * 45 + 22.5;
          pts.push([u.x + cos(a) * u.r, u.y + sin(a) * u.r * 0.72]);
        }
        u.pts = pts;
        polyShape(pts);
      }
    }
  }
  brush.noFill();
}

// =============================================================================
// PASS 3: CRISP SEPIA PEN LINEWORK — SEA, WAKE, TERRAIN, TOWN & BOATS
// =============================================================================
function drawHorizonAndDistantCoastPen() {
  // Flattened horizon line at y = 65 & delicate distant cloud/headland lines
  brush.set("rotring", PAL.inkLight, sw(0.45));
  brush.line(0, 65, 1200, 65);
  brush.set("rotring", PAL.inkFaint, sw(0.3));
  brush.line(0, 68, 920, 68);
  brush.line(0, 72, 680, 72);

  // Distant islands on the flattened horizon (left & center-left)
  brush.set("rotring", PAL.inkMid, sw(0.45));
  polyLine([
    [15, 65], [45, 54], [82, 57], [125, 48], [175, 55], [225, 65]
  ], 0.3);
  polyLine([
    [290, 65], [335, 56], [385, 52], [435, 59], [485, 65]
  ], 0.3);

  // Subtle sky engraving lines in upper corners
  brush.set("rotring", PAL.inkFaint, sw(0.28));
  for (let y = 14; y < 48; y += 7) {
    let span = map(y, 14, 48, 340, 140);
    brush.line(0, y, span + random(-20, 20), y);
    brush.line(1200 - span + random(-20, 20), y, 1200, y);
  }
}

function drawSeaRipplesAndContoursPen() {
  // 1. Concentric coastal water-line contours hugging headlands, rocks & breakwaters
  const coastContours = [
    // Around North Headland
    [[540, 96], [375, 108], [155, 114], [95, 152], [135, 172], [350, 212], [458, 236]],
    // Around Outer South Breakwater
    [[392, 925], [388, 974], [718, 992], [1200, 932]]
  ];
  for (let c of coastContours) {
    for (let offset = 1; offset <= 3; offset++) {
      brush.set("rotring", offset === 1 ? PAL.inkMid : PAL.inkLight, sw(0.45 - offset * 0.08));
      let shifted = c.map(p => [p[0] - offset * 5, p[1] + offset * 4]);
      polyLine(shifted, 0.25);
    }
  }

  // 2. Rhythmic pictorial map wavelets across the Prussian blue sea (perspective-scaled!)
  for (let y = 78; y < 1185; y += map(y, 75, 1185, 9, 22)) {
    let sc = pScale(y);
    let waveW = 24 * sc;
    let waveH = 2.6 * sc;

    for (let x = 18; x < 1180; x += waveW * random(1.3, 2.1)) {
      // Check if (x, y) is in the sea
      let inSea = false;
      if (y < 112 && x < 540) inSea = true;
      else if (y >= 112 && y < 210 && x < 98) inSea = true;
      else if (y >= 210 && y < 300 && x < 445) inSea = true;
      else if (y >= 300 && y < 440 && x < 510) inSea = true;
      else if (y >= 440 && y < 555 && x < 375) inSea = true;
      else if (y >= 455 && y < 760 && x > 430 && x < lerp(570, 905, (y - 455) / 305)) inSea = true;
      else if (y >= 555 && y < 925 && x < 430) inSea = true;
      else if (y >= 760 && y < 900 && x < 885) inSea = true;
      else if (y >= 985) inSea = true;

      if (!inSea) continue;

      let wx = x + random(-6, 6);
      let wy = y + random(-2, 2);
      brush.set("rotring", (x + y) % 3 < 1 ? PAL.inkSea : PAL.inkLight, sw(0.32 + 0.18 * sc));
      polyLine([
        [wx - waveW * 0.5, wy],
        [wx - waveW * 0.18, wy - waveH],
        [wx + waveW * 0.18, wy + waveH * 0.5],
        [wx + waveW * 0.5, wy - waveH * 0.4]
      ], 0.45);
    }
  }
}

function drawFerryWakePen() {
  // Hyper-detailed curling wake trailing behind the ferry from (235, 675) to bottom-left
  let fx = 235, fy = 675, fang = -34;
  let ux = cos(fang), uy = sin(fang); // forward vector toward pier
  let vx = -sin(fang), vy = cos(fang); // starboard vector

  function wPt(backDist, sideOffset) {
    return [
      fx - ux * backDist + vx * sideOffset,
      fy - uy * backDist + vy * sideOffset
    ];
  }

  // 1. Kelvin Bow Wave Arms (port and starboard V-echelon wavelets)
  for (let side of [-1, 1]) {
    brush.set("rotring", PAL.inkMid, sw(0.5));
    let armPts = [];
    for (let d = -115; d < 420; d += 18) {
      let t = (d + 115) / 535;
      let spread = side * (16 + pow(t, 0.86) * 215);
      let curl = sin(d * 3.5) * 4 * t;
      armPts.push(wPt(d, spread + curl));
    }
    polyLine(armPts, 0.35);

    // Feathered echelon curling wavelets along each Kelvin arm
    for (let d = -95; d < 410; d += 11) {
      let t = (d + 95) / 505;
      let spread = side * (16 + pow(t, 0.86) * 215);
      let p0 = wPt(d, spread * 0.82);
      let p1 = wPt(d + 14, spread * 0.98);
      let p2 = wPt(d + 26, spread * 1.12);
      let p3 = [p2[0] - side * 8, p2[1] + 7]; // curling crest hook!
      brush.set("rotring", PAL.inkLight, sw(0.36));
      polyLine([p0, p1, p2, p3], 0.45);
    }
  }

  // 2. Central Churning Stern Wake — Fine Curling Lines, Volutes & Spiral Eddies
  for (let stream = 0; stream < 11; stream++) {
    let sNorm = map(stream, 0, 10, -1, 1);
    let pts = [];
    for (let d = 95; d < 460; d += 12) {
      let t = (d - 95) / 365;
      let widthEnv = 22 + t * 145;
      let wave = sin(d * 4.2 + stream * 42) * (6 + t * 18);
      pts.push(wPt(d, sNorm * widthEnv + wave));
    }
    brush.set("rotring", stream % 2 === 0 ? PAL.inkMid : PAL.inkLight, sw(0.38));
    polyLine(pts, 0.45);
  }

  // 3. Individual Curling Foam Volutes & Spiral Eddies inside the wake trough
  for (let d = 102; d < 450; d += 13) {
    let t = (d - 102) / 348;
    let maxW = 20 + t * 135;
    let count = floor(map(t, 0, 1, 2, 5));
    for (let k = 0; k < count; k++) {
      let side = map(k + 0.5, 0, count, -maxW, maxW) + random(-8, 8);
      let c = wPt(d + random(-5, 5), side);
      let r = (3.5 + t * 7.5) * random(0.8, 1.25);
      let dir = side >= 0 ? 1 : -1;

      // Draw a multi-turn curling spiral volute in fine sepia pen
      let spiral = [];
      for (let a = 0; a <= 420; a += 45) {
        let sr = r * (1 - a / 520);
        spiral.push([
          c[0] + cos(a * dir) * sr,
          c[1] + sin(a * dir) * sr * 0.72
        ]);
      }
      brush.set("rotring", PAL.inkMid, sw(0.34));
      polyLine(spiral, 0.5);

      // Crisp white foam highlight arc on the outer curl
      brush.set("rotring", PAL.foamWhite, sw(0.55));
      polyLine(spiral.slice(0, 4), 0.4);
    }
  }

  // 4. Bright cream/white bow spray & stern prop-wash highlights
  for (let i = 0; i < 16; i++) {
    let d = 96 + i * 18;
    let w = 14 + i * 6;
    brush.set("rotring", PAL.foamWhite, sw(0.65));
    polyLine([
      wPt(d, -w * 0.6),
      wPt(d + 8, 0),
      wPt(d, w * 0.6)
    ], 0.4);
  }
}

function drawRocksBeachesAndHillsPen() {
  // 1. North Headland & Upper Cove Rocky Shore (x: 95..480, y: 120..295)
  const rockClusters = [
    [110, 152, 26], [140, 162, 22], [175, 168, 25], [215, 178, 24],
    [255, 188, 26], [295, 198, 24], [338, 206, 22],
    // Pebble beach border boulders
    [372, 215, 18], [478, 242, 20], [452, 268, 18], [418, 286, 20],
    // South Breakwater seaward riprap boulders (y ~ 965..1005)
    [402, 965, 24], [438, 972, 22], [475, 976, 25], [515, 978, 24],
    [555, 980, 26], [598, 982, 24], [642, 982, 25], [685, 982, 26],
    [728, 980, 24], [772, 974, 25], [818, 968, 26], [865, 962, 25],
    [912, 955, 26], [960, 948, 25], [1010, 942, 26], [1062, 935, 26],
    [1115, 928, 26], [1165, 922, 26]
  ];

  for (let rc of rockClusters) {
    let [rx, ry, sz] = rc;
    let sc = pScale(ry);
    let r = sz * sc * 0.55;
    // Angular faceted coastal rock in crisp sepia pen + facet hatching
    let p0 = [rx - r * 1.1, ry + r * 0.3];
    let p1 = [rx - r * 0.5, ry - r * 0.65];
    let p2 = [rx + r * 0.4, ry - r * 0.7];
    let p3 = [rx + r * 1.1, ry + r * 0.25];
    let p4 = [rx + r * 0.2, ry + r * 0.45];

    brush.set("rotring", PAL.inkDark, sw(0.48));
    polyLine([p0, p1, p2, p3, p4, p0], 0.05);
    // Ridge seam & shaded right facet hatching
    brush.set("rotring", PAL.inkMid, sw(0.32));
    brush.line(p2[0], p2[1], p4[0], p4[1]);
    for (let k = 1; k <= 3; k++) {
      let t = k / 4;
      brush.line(
        lerp(p2[0], p3[0], t), lerp(p2[1], p3[1], t),
        lerp(p4[0], p3[0], t), lerp(p4[1], p3[1], t)
      );
    }
  }

  // 2. Dry-Stone Terrace Walls (Muretti a Secco) winding across the hillsides
  const terraceWalls = [
    [[185, 138], [265, 148], [355, 160], [445, 175]],
    [[510, 142], [620, 132], [740, 135], [860, 142], [990, 155], [1140, 175]],
    [[500, 185], [615, 172], [735, 175], [850, 185], [985, 202], [1150, 228]],
    [[895, 282], [995, 305], [1095, 335], [1185, 365]],
    [[985, 485], [1075, 520], [1175, 560]],
    [[1025, 735], [1105, 765], [1190, 795]]
  ];

  for (let tw of terraceWalls) {
    brush.set("rotring", PAL.inkDark, sw(0.5));
    polyLine(tw, 0.25);
    let wallH = 6;
    let bot = tw.map(p => [p[0], p[1] + wallH * pScale(p[1])]);
    brush.set("rotring", PAL.inkMid, sw(0.4));
    polyLine(bot, 0.25);

    // Individual dry-stone masonry joints along the wall
    for (let i = 0; i < tw.length - 1; i++) {
      let pA = tw[i], pB = tw[i + 1];
      let d = dist(pA[0], pA[1], pB[0], pB[1]);
      let steps = floor(d / 7);
      for (let s = 0; s <= steps; s++) {
        let t = s / steps;
        let x = lerp(pA[0], pB[0], t);
        let y = lerp(pA[1], pB[1], t);
        let h = wallH * pScale(y);
        brush.set("rotring", PAL.inkMid, sw(0.3));
        brush.line(x, y, x, y + h);
      }
    }
  }

  // 3. Upper Cove Pebble Beach stipple & hauled-up beach skiffs
  brush.set("rotring", PAL.inkLight, sw(0.35));
  for (let i = 0; i < 65; i++) {
    let px = random(385, 478);
    let py = random(222, 275);
    brush.circle(px, py, random(1, 2.2), 0.2);
  }
}

function drawSageScrubAndTreesPen() {
  // 1. Scalloped botanical hummocks of Mediterranean sage scrub
  for (let sp of sagePatches) {
    let sc = pScale(sp.cy);
    let count = floor(map(sp.rx, 35, 75, 7, 15));
    for (let i = 0; i < count; i++) {
      let a = random(360);
      let r = sqrt(random()) * 0.78;
      let bx = sp.cx + cos(a) * sp.rx * r;
      let by = sp.cy + sin(a) * sp.ry * r;
      let bw = random(9, 16) * sc;
      let bh = bw * 0.55;

      // Draw a 3-lobed sage bush crown in crisp sepia pen
      brush.set("rotring", PAL.inkMid, sw(0.38));
      polyLine([
        [bx - bw * 0.6, by + bh * 0.2],
        [bx - bw * 0.35, by - bh * 0.45],
        [bx, by - bh * 0.7],
        [bx + bw * 0.35, by - bh * 0.45],
        [bx + bw * 0.6, by + bh * 0.2]
      ], 0.45);
      // Shaded right-side foliage ticks
      brush.set("rotring", PAL.inkDark, sw(0.3));
      brush.line(bx + bw * 0.15, by - bh * 0.2, bx + bw * 0.35, by + bh * 0.15);
      brush.line(bx + bw * 0.32, by - bh * 0.1, bx + bw * 0.48, by + bh * 0.2);
    }
  }

  // 2. Columnar Mediterranean Cypresses
  for (let c of cypresses) {
    // Dark olive-green wash for cypress spire
    brush.noStroke();
    brush.wash(PAL.cypress, 215);
    polyShape([
      [c.x, c.y - c.h],
      [c.x + c.w * 0.55, c.y - c.h * 0.28],
      [c.x + c.w * 0.38, c.y],
      [c.x - c.w * 0.38, c.y],
      [c.x - c.w * 0.55, c.y - c.h * 0.28]
    ]);
    brush.noWash();

    // Trunk & tufted sepia foliage outline
    brush.set("rotring", PAL.inkDark, sw(0.45));
    brush.line(c.x, c.y, c.x, c.y + 4);
    for (let h = 0.1; h < 0.95; h += 0.16) {
      let yy = c.y - c.h * h;
      let ww = c.w * 0.55 * sin(h * 165);
      brush.line(c.x - ww, yy + 2, c.x, yy - 3);
      brush.line(c.x, yy - 3, c.x + ww, yy + 2);
    }
  }
}

function drawQuaysPiersAndBreakwaterPen() {
  // 1. Main Ferry Pier, Riva Quay & South Breakwater Coping Edges & Seawalls
  const quayEdges = [
    // North Quay to Pier Root
    [[390, 290], [525, 365], 16],
    // Main Ferry Pier Outer Edge
    [[532, 392], [376, 510], 18],
    // Main Ferry Pier Head
    [[376, 510], [416, 556], 20],
    // Main Ferry Pier Inner Edge
    [[416, 556], [582, 442], 18],
    // Curved Riva Promenade Seawall
    [[582, 442], [712, 518], 20],
    [[712, 518], [832, 622], 22],
    [[832, 622], [916, 758], 22],
    [[916, 758], [892, 868], 22],
    // South Breakwater Inner Edge
    [[892, 868], [650, 902], 20],
    [[650, 902], [408, 926], 22],
    // South Breakwater Outer Seaward Wall
    [[404, 962], [720, 975], 24],
    [[720, 975], [1200, 915], 24]
  ];

  for (let qe of quayEdges) {
    let [p0, p1, wallH] = qe;
    // Top coping stone edge (double line)
    brush.set("rotring", PAL.inkDark, sw(0.65));
    brush.line(p0[0], p0[1], p1[0], p1[1]);
    brush.set("rotring", PAL.inkMid, sw(0.38));
    brush.line(p0[0], p0[1] - 3, p1[0], p1[1] - 3);

    // Bottom waterline edge
    brush.set("rotring", PAL.inkDark, sw(0.55));
    brush.line(p0[0], p0[1] + wallH, p1[0], p1[1] + wallH);

    // Horizontal masonry courses
    brush.set("rotring", PAL.inkMid, sw(0.3));
    brush.line(p0[0], p0[1] + wallH * 0.35, p1[0], p1[1] + wallH * 0.35);
    brush.line(p0[0], p0[1] + wallH * 0.7, p1[0], p1[1] + wallH * 0.7);

    // Vertical stone joints & coping slab ticks
    let len = dist(p0[0], p0[1], p1[0], p1[1]);
    let steps = floor(len / 14);
    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      let x = lerp(p0[0], p1[0], t);
      let y = lerp(p0[1], p1[1], t);
      // Coping tick
      brush.line(x, y - 3, x, y + wallH * 0.35);
      // Staggered lower masonry joint
      let x2 = lerp(p0[0], p1[0], min(1, t + 0.5 / steps));
      let y2 = lerp(p0[1], p1[1], min(1, t + 0.5 / steps));
      brush.line(x2, y2 + wallH * 0.35, x2, y2 + wallH * 0.7);
      brush.line(x, y + wallH * 0.7, x, y + wallH);
    }

    // Timber fenders along the Main Ferry Pier (for the ferry to berth against!)
    if (p0[0] === 532 || p0[0] === 376) {
      for (let i = 1; i < steps; i += 2) {
        let t = i / steps;
        let x = lerp(p0[0], p1[0], t);
        let y = lerp(p0[1], p1[1], t);
        brush.set("rotring", PAL.inkDark, sw(0.9));
        brush.line(x, y + 1, x, y + wallH - 1);
      }
    }
  }

  // 2. Round Stone Harbour Beacon / Mole Lantern Tower at Breakwater Head (x: 412, y: 924)
  drawMoleLanternTower(412, 928);

  // 3. Floating Wooden Jetties plank detailing in South Basin
  const jetties = [
    [[625, 804], [885, 774]],
    [[665, 848], [898, 822]]
  ];
  for (let j of jetties) {
    let [j0, j1] = j;
    brush.set("rotring", PAL.inkDark, sw(0.5));
    brush.line(j0[0], j0[1], j1[0], j1[1]);
    brush.line(j0[0] + 3, j0[1] + 12, j1[0] + 3, j1[1] + 12);
    for (let i = 0; i <= 28; i++) {
      let t = i / 28;
      let x = lerp(j0[0], j1[0], t);
      let y = lerp(j0[1], j1[1], t);
      brush.set("rotring", PAL.inkMid, sw(0.32));
      brush.line(x, y, x + 3, y + 12);
    }
  }
}

function drawMoleLanternTower(x, y) {
  let r = 18, h = 42;
  // Circular stone bastion base & cylindrical lantern tower
  brush.noStroke();
  brush.wash(PAL.wallOchre, 240);
  polyShape([
    [x - r, y], [x + r, y],
    [x + r * 0.85, y - h], [x - r * 0.85, y - h]
  ]);
  brush.wash(PAL.wallShade1, 220);
  polyShape([
    [x, y], [x + r, y],
    [x + r * 0.85, y - h], [x, y - h]
  ]);
  brush.wash(PAL.roofBright, 235);
  polyShape([
    [x - r * 0.65, y - h - 10],
    [x + r * 0.65, y - h - 10],
    [x, y - h - 22]
  ]);
  brush.noWash();

  // Crisp sepia pen masonry & iron lantern gallery
  brush.set("rotring", PAL.inkDark, sw(0.55));
  polyLine([[x - r, y], [x - r * 0.3, y + 6], [x + r * 0.3, y + 6], [x + r, y]], 0.3);
  brush.line(x - r, y, x - r * 0.85, y - h);
  brush.line(x + r, y, x + r * 0.85, y - h);
  polyLine([[x - r * 0.95, y - h], [x, y - h + 4], [x + r * 0.95, y - h]], 0.3);

  // Stone courses on tower
  brush.set("rotring", PAL.inkMid, sw(0.32));
  for (let k = 1; k <= 5; k++) {
    let yy = y - (h * k) / 6;
    let rr = lerp(r, r * 0.85, k / 6);
    polyLine([[x - rr, yy], [x, yy + 3], [x + rr, yy]], 0.3);
  }
  // Lantern glass cage & conical terracotta cap
  brush.set("rotring", PAL.inkDark, sw(0.45));
  brush.rect(x - r * 0.55, y - h - 10, r * 1.1, 10, "corner");
  polyLine([[x - r * 0.65, y - h - 10], [x, y - h - 22], [x + r * 0.65, y - h - 10]], 0.05);
  brush.line(x, y - h - 22, x, y - h - 29);
}

// =============================================================================
// MOORED DINGHIES, SAILBOATS & THE ISLAND FERRY (CRISP SEPIA PEN)
// =============================================================================
function drawMooredDinghiesAndSailboatsPen() {
  // 1. Moored Dinghies & Fishing Gozzi
  for (let d of dinghies) {
    if (!d.pts) continue;
    let dux = cos(d.ang), duy = sin(d.ang);
    let dvx = -sin(d.ang), dvy = cos(d.ang);
    let L = d.len * 0.5, W = d.beam * 0.5;

    // Inner wooden hull cockpit wash
    brush.noStroke();
    brush.wash(PAL.paperWarm, 220);
    let innerPts = d.pts.map(p => [lerp(d.x, p[0], 0.74), lerp(d.y, p[1], 0.74)]);
    polyShape(innerPts);
    brush.noWash();

    // Outer hull contour & double gunwale rub-rail in crisp sepia pen
    brush.set("rotring", PAL.inkDark, sw(0.52));
    polyLine([...d.pts, d.pts[0]], 0.25);
    brush.set("rotring", PAL.inkMid, sw(0.34));
    polyLine([...innerPts, innerPts[0]], 0.25);

    // Wooden thwarts (benches) & bottom floorboards
    for (let t of [-0.35, 0.0, 0.32]) {
      let tx = d.x + dux * L * t;
      let ty = d.y + duy * L * t;
      let tw = W * (0.72 - abs(t) * 0.35);
      brush.set("rotring", PAL.inkDark, sw(0.4));
      brush.line(tx - dvx * tw, ty - dvy * tw, tx + dvx * tw, ty + dvy * tw);
    }
    // Keel & floorboard line
    brush.set("rotring", PAL.inkLight, sw(0.28));
    brush.line(d.x - dux * L * 0.65, d.y - duy * L * 0.65, d.x + dux * L * 0.65, d.y + duy * L * 0.65);

    // Optional small cuddy cabin on fishing gozzo
    if (d.hasCabin) {
      brush.noStroke();
      brush.wash(PAL.wallCream, 235);
      let c0 = [d.x + dux * L * 0.05 - dvx * W * 0.55, d.y + duy * L * 0.05 - dvy * W * 0.55 - 3];
      let c1 = [d.x + dux * L * 0.45 - dvx * W * 0.45, d.y + duy * L * 0.45 - dvy * W * 0.45 - 3];
      let c2 = [d.x + dux * L * 0.45 + dvx * W * 0.45, d.y + duy * L * 0.45 + dvy * W * 0.45 - 3];
      let c3 = [d.x + dux * L * 0.05 + dvx * W * 0.55, d.y + duy * L * 0.05 + dvy * W * 0.55 - 3];
      polyShape([c0, c1, c2, c3]);
      brush.noWash();
      brush.set("rotring", PAL.inkDark, sw(0.4));
      polyLine([c0, c1, c2, c3, c0], 0.05);
    }

    // Tiny wooden oars resting across the gunwales
    if (d.hasOars) {
      brush.set("rotring", PAL.inkMid, sw(0.35));
      for (let s of [-0.55, 0.55]) {
        let ox0 = d.x - dux * L * 0.45 + dvx * W * s;
        let oy0 = d.y - duy * L * 0.45 + dvy * W * s;
        let ox1 = d.x + dux * L * 0.35 + dvx * W * s * 1.3;
        let oy1 = d.y + duy * L * 0.35 + dvy * W * s * 1.3;
        brush.line(ox0, oy0, ox1, oy1);
      }
    }

    // Mooring rope from bow to bollard or buoy
    let bow = d.pts[0];
    brush.set("rotring", PAL.inkMid, sw(0.32));
    polyLine([
      bow,
      [(bow[0] + d.moorX) * 0.5, (bow[1] + d.moorY) * 0.5 + 5],
      [d.moorX, d.moorY]
    ], 0.4);

    if (d.buoy) {
      brush.noStroke();
      brush.wash(PAL.roofBright, 230);
      brush.circle(d.moorX, d.moorY, 2.5, 0.1);
      brush.noWash();
      brush.set("rotring", PAL.inkDark, sw(0.35));
      brush.circle(d.moorX, d.moorY, 2.5, 0.1);
    }

    // Waterline ripple hugging the dinghy
    brush.set("rotring", PAL.inkLight, sw(0.28));
    polyLine([
      [d.pts[0][0] + dux * 3, d.pts[0][1] + duy * 3 + 2],
      [d.pts[1][0] + dvx * 3, d.pts[1][1] + dvy * 3 + 3],
      [d.pts[2][0] + dvx * 3, d.pts[2][1] + dvy * 3 + 3],
      [d.pts[3][0] - dux * 3, d.pts[3][1] - duy * 3 + 2]
    ], 0.35);
  }

  // 2. Sailboats in the outer bay & horizon
  for (let sb of sailboats) {
    let { x, y, sc, ang } = sb;
    let L = 24 * sc, H = 38 * sc;
    let ux = cos(ang), uy = sin(ang);

    // Sail shadow & cream canvas fill
    brush.noStroke();
    brush.wash(PAL.wallCream, 235);
    // Mainsail
    polyShape([
      [x, y - 4 * sc],
      [x, y - H],
      [x - ux * L * 0.85, y - 7 * sc]
    ]);
    // Jib sail
    polyShape([
      [x + ux * 2 * sc, y - 5 * sc],
      [x, y - H * 0.88],
      [x + ux * L * 0.78, y - 4 * sc]
    ]);
    // Hull wash
    brush.wash(PAL.roofBright, 225);
    polyShape([
      [x - ux * L * 0.8, y],
      [x + ux * L * 0.85, y],
      [x + ux * L * 0.6, y + 5 * sc],
      [x - ux * L * 0.65, y + 5 * sc]
    ]);
    brush.noWash();

    // Sepia pen rigging, mast, sails & hull
    brush.set("rotring", PAL.inkDark, sw(0.45));
    brush.line(x, y, x, y - H - 3 * sc);
    polyLine([[x, y - H], [x - ux * L * 0.85, y - 7 * sc], [x, y - 4 * sc]], 0.15);
    polyLine([[x, y - H * 0.88], [x + ux * L * 0.78, y - 4 * sc], [x + ux * 2 * sc, y - 5 * sc]], 0.2);
    polyLine([
      [x - ux * L * 0.8, y],
      [x + ux * L * 0.85, y],
      [x + ux * L * 0.6, y + 5 * sc],
      [x - ux * L * 0.65, y + 5 * sc],
      [x - ux * L * 0.8, y]
    ], 0.15);
  }
}

function drawIslandFerryPen() {
  let fx = 235, fy = 675, fang = -34;
  let ux = cos(fang), uy = sin(fang);
  let vx = -sin(fang), vy = cos(fang);
  function fp(l, w, h = 0) {
    return [fx + ux * l + vx * w, fy + uy * l + vy * w - h];
  }

  // 1. Waterline & Hull Strakes
  brush.set("rotring", PAL.inkDark, sw(0.7));
  polyLine([
    fp(-120, -26, 0), fp(-120, 28, 0),
    fp(85, 30, 0), fp(132, 0, 0), fp(85, -30, 0)
  ], 0.18);

  // Bulwark / Main Car-Deck Gunwale (h = 16, flared bow h = 20)
  let deckContour = [
    fp(-122, -26, 16), fp(82, -28, 16), fp(136, 0, 20),
    fp(82, 28, 16), fp(-122, 26, 16), fp(-122, -26, 16)
  ];
  brush.set("rotring", PAL.inkDark, sw(0.65));
  polyLine(deckContour, 0.12);

  // Hull rubbing strakes & bow anchor hawsepipe
  brush.set("rotring", PAL.inkMid, sw(0.4));
  polyLine([fp(-121, 27, 8), fp(83, 29, 8), fp(134, 0, 10)], 0.15);
  polyLine([fp(-121, 27, 12), fp(83, 29, 12), fp(135, 0, 15)], 0.15);
  brush.set("rotring", PAL.inkDark, sw(0.55));
  brush.circle(fp(108, 14, 11)[0], fp(108, 14, 11)[1], 3, 0.1);

  // Foredeck car ramp & tiny cars waiting to disembark
  brush.set("rotring", PAL.inkMid, sw(0.42));
  polyLine([fp(68, -16, 16), fp(122, -8, 18), fp(122, 8, 18), fp(68, 16, 16)], 0.05);
  // Two tiny vehicles on foredeck
  for (let cw of [-7, 7]) {
    brush.noStroke();
    brush.wash(cw < 0 ? PAL.roofBright : PAL.umbGold, 220);
    polyShape([fp(76, cw - 4, 17), fp(92, cw - 4, 17), fp(92, cw + 4, 19), fp(76, cw + 4, 19)]);
    brush.noWash();
    brush.set("rotring", PAL.inkDark, sw(0.38));
    polyLine([fp(76, cw - 4, 17), fp(92, cw - 4, 17), fp(92, cw + 4, 19), fp(76, cw + 4, 19), fp(76, cw - 4, 17)], 0.05);
  }

  // 2. Lower Saloon Deck & Promenade Deck Superstructure
  for (let dh of [16, 31, 46]) {
    let L0 = dh === 46 ? -105 : -112;
    let L1 = dh === 46 ? 60 : 72;
    let W = dh === 46 ? 21 : 24;
    brush.set("rotring", PAL.inkDark, sw(0.55));
    polyLine([
      fp(L0, -W, dh), fp(L1, -W, dh), fp(L1 + 14, 0, dh),
      fp(L1, W, dh), fp(L0, W, dh), fp(L0, -W, dh)
    ], 0.06);
  }

  // Vertical corner stanchions of superstructure
  brush.set("rotring", PAL.inkDark, sw(0.48));
  for (let l of [-105, -60, -15, 30, 58]) {
    let pA = fp(l, 23, 16), pB = fp(l, 21, 46);
    brush.line(pA[0], pA[1], pB[0], pB[1]);
  }

  // Rows of saloon windows along starboard side (h = 21 and h = 36)
  for (let rowH of [20, 35]) {
    for (let l = -98; l <= 50; l += 11) {
      let w0 = fp(l, 23, rowH);
      let w1 = fp(l + 7, 23, rowH);
      let w2 = fp(l + 7, 23, rowH + 6);
      let w3 = fp(l, 23, rowH + 6);
      brush.noStroke();
      brush.wash(PAL.inkDark, 195);
      polyShape([w0, w1, w2, w3]);
      brush.noWash();
      brush.set("rotring", PAL.inkDark, sw(0.35));
      polyLine([w0, w1, w2, w3, w0], 0.02);
    }
  }

  // 3. Navigation Bridge & Wing Cabs (l: 35..66, h: 46..58)
  brush.noStroke();
  brush.wash(PAL.wallCream, 240);
  polyShape([
    fp(32, -23, 46), fp(62, -23, 46), fp(70, 0, 46), fp(62, 25, 46), fp(32, 25, 46),
    fp(32, 23, 58), fp(60, 23, 58), fp(68, 0, 58), fp(32, -21, 58)
  ]);
  brush.noWash();

  brush.set("rotring", PAL.inkDark, sw(0.55));
  polyLine([
    fp(32, -21, 58), fp(60, -21, 58), fp(68, 0, 58),
    fp(60, 23, 58), fp(32, 23, 58), fp(32, -21, 58)
  ], 0.06);

  // Bridge wrap-around windows
  for (let w = -16; w <= 16; w += 8) {
    let b0 = fp(63, w, 50), b1 = fp(63, w + 6, 50), b2 = fp(62, w + 6, 55), b3 = fp(62, w, 55);
    brush.set("rotring", PAL.inkDark, sw(0.45));
    polyLine([b0, b1, b2, b3, b0], 0.02);
  }

  // 4. Streamlined Funnel, Radar Mast & Signal Flags
  brush.set("rotring", PAL.inkDark, sw(0.55));
  polyLine([
    fp(-22, -6, 46), fp(4, -6, 46), fp(4, 6, 46), fp(-22, 6, 46),
    fp(-20, 5, 72), fp(-2, 5, 72), fp(-2, -5, 72), fp(-20, -5, 72)
  ], 0.08);
  // Prussian band on funnel
  brush.set("rotring", PAL.inkDark, sw(0.9));
  let fBand0 = fp(-19, 5, 65), fBand1 = fp(-2, 5, 65);
  brush.line(fBand0[0], fBand0[1], fBand1[0], fBand1[1]);

  // Radar Mast on Bridge Roof
  let mBase = fp(48, 0, 58), mTop = fp(48, 0, 86);
  brush.set("rotring", PAL.inkDark, sw(0.55));
  brush.line(mBase[0], mBase[1], mTop[0], mTop[1]);
  // Yardarm & radar scanner bar
  let y0 = fp(48, -12, 76), y1 = fp(48, 12, 76);
  brush.line(y0[0], y0[1], y1[0], y1[1]);
  // Signal rigging lines & stern ensign flag
  let sternPost = fp(-120, 0, 28);
  brush.set("rotring", PAL.inkMid, sw(0.32));
  brush.line(mTop[0], mTop[1], fp(-18, 0, 72)[0], fp(-18, 0, 72)[1]);
  brush.line(mTop[0], mTop[1], fp(128, 0, 20)[0], fp(128, 0, 20)[1]);
  // Fluttering maritime flag at stern
  brush.noStroke();
  brush.wash(PAL.roofBright, 230);
  polyShape([sternPost, [sternPost[0] - 12, sternPost[1] - 6], [sternPost[0] - 10, sternPost[1] + 2]]);
  brush.noWash();
  brush.set("rotring", PAL.inkDark, sw(0.4));
  brush.line(fp(-120, 0, 16)[0], fp(-120, 0, 16)[1], sternPost[0], sternPost[1]);

  // 5. Aft Sun-Deck Awning Ribs & Tiny Passengers along the Rails
  brush.set("rotring", PAL. foamWhite, sw(0.45));
  for (let l = -98; l <= -30; l += 11) {
    let a0 = fp(l, -20, 46), a1 = fp(l, 20, 46);
    brush.line(a0[0], a0[1], a1[0], a1[1]);
  }
  // Lifeboats in davits (starboard side)
  brush.set("rotring", PAL.inkDark, sw(0.42));
  for (let lb of [-37, -5]) {
    polyLine([fp(lb - 11, 21, 34), fp(lb + 11, 21, 34), fp(lb + 9, 26, 30), fp(lb - 9, 26, 30), fp(lb - 11, 21, 34)], 0.15);
  }
}

// =============================================================================
// HYPERREAL BUILDINGS & INDIVIDUAL ROOFTOP TILES IN CRISP SEPIA PEN
// =============================================================================
function drawAllBuildingsAndRoofTilesPen() {
  for (let b of buildings) {
    let g = b.geom;
    if (!g) continue;

    // 1. Wall Outlines & Corner Quoins
    brush.set("rotring", PAL.inkDark, sw(0.52));
    // Front wall
    polyLine([g.F, g.R, g.RT, g.FT, g.F], 0.03);
    // Right side wall
    if (b.roofType === "gabled") {
      polyLine([g.R, g.B, g.BT, g.R1, g.RT], 0.03);
    } else {
      polyLine([g.R, g.B, g.BT, g.RT], 0.03);
    }

    // Stringcourses (horizontal floor moldings)
    brush.set("rotring", PAL.inkMid, sw(0.32));
    for (let s = 1; s < b.stories; s++) {
      let fh = (b.h * s) / b.stories;
      brush.line(g.F[0], g.F[1] - fh, g.R[0], g.R[1] - fh);
      brush.line(g.R[0], g.R[1] - fh, g.B[0], g.B[1] - fh);
    }

    // Shaded right wall diagonal cross-hatching for rich volume
    brush.set("rotring", PAL.inkLight, sw(0.26));
    let hatchSteps = floor(b.h / (4.5 * b.sc));
    for (let k = 1; k < hatchSteps; k++) {
      let hy = (b.h * k) / hatchSteps;
      brush.line(g.R[0], g.R[1] - hy, g.B[0], g.B[1] - hy);
    }

    // 2. Windows, Shutters, Ground Arcades & Balconies
    let cols = max(2, floor(b.w / (11 * b.sc)));
    for (let s = 0; s < b.stories; s++) {
      let yBot = (b.h * s) / b.stories;
      let yTop = (b.h * (s + 1)) / b.stories;

      for (let c = 0; c < cols; c++) {
        let u0 = (c + 0.28) / cols;
        let u1 = (c + 0.72) / cols;
        let uMid = (u0 + u1) * 0.5;

        if (s === 0 && b.arcade) {
          // Ground floor arched loggia opening
          let ax0 = lerp(g.F[0], g.R[0], u0), ay0 = lerp(g.F[1], g.R[1], u0);
          let ax1 = lerp(g.F[0], g.R[0], u1), ay1 = lerp(g.F[1], g.R[1], u1);
          let ah = (yTop - yBot) * 0.78;
          brush.noStroke();
          brush.wash(PAL.inkDark, 185);
          polyShape([
            [ax0, ay0], [ax1, ay1],
            [ax1, ay1 - ah * 0.7],
            [(ax0 + ax1) * 0.5, (ay0 + ay1) * 0.5 - ah],
            [ax0, ay0 - ah * 0.7]
          ]);
          brush.noWash();
          brush.set("rotring", PAL.inkDark, sw(0.42));
          polyLine([
            [ax0, ay0], [ax0, ay0 - ah * 0.7],
            [(ax0 + ax1) * 0.5, (ay0 + ay1) * 0.5 - ah],
            [ax1, ay1 - ah * 0.7], [ax1, ay1]
          ], 0.25);
        } else {
          // Upper story window with louvered shutters
          let wx0 = lerp(g.F[0], g.R[0], u0), wy0 = lerp(g.F[1], g.R[1], u0) - yBot - (yTop - yBot) * 0.2;
          let wx1 = lerp(g.F[0], g.R[0], u1), wy1 = lerp(g.F[1], g.R[1], u1) - yBot - (yTop - yBot) * 0.2;
          let wh = (yTop - yBot) * 0.55;

          brush.noStroke();
          brush.wash(PAL.inkDark, 180);
          polyShape([[wx0, wy0], [wx1, wy1], [wx1, wy1 - wh], [wx0, wy0 - wh]]);
          brush.noWash();

          brush.set("rotring", PAL.inkDark, sw(0.36));
          polyLine([[wx0, wy0], [wx1, wy1], [wx1, wy1 - wh], [wx0, wy0 - wh], [wx0, wy0]], 0.02);

          // Tiny open shutters on either side
          let shW = 2.2 * b.sc;
          brush.set("rotring", PAL.inkMid, sw(0.3));
          brush.line(wx0 - g.ux * shW, wy0, wx0 - g.ux * shW, wy0 - wh);
          brush.line(wx1 + g.ux * shW, wy1, wx1 + g.ux * shW, wy1 - wh);

          // Optional wrought-iron balcony on 2nd story
          if (s === 1 && b.balcony && c % 2 === 1) {
            let bx = lerp(g.F[0], g.R[0], uMid);
            let by = lerp(g.F[1], g.R[1], uMid) - yBot - (yTop - yBot) * 0.15;
            brush.set("rotring", PAL.inkDark, sw(0.42));
            brush.line(wx0 - 1, wy0 + 1, wx1 + 1, wy1 + 1);
            brush.line(bx - 4 * b.sc, by - 3 * b.sc, bx + 4 * b.sc, by - 2 * b.sc);
          }
        }
      }
    }

    // Side-wall windows
    let sideCols = max(1, floor(b.d / (13 * b.sc)));
    for (let s = 1; s < b.stories; s++) {
      let yMid = (b.h * (s + 0.35)) / b.stories;
      let wh = (b.h / b.stories) * 0.45;
      for (let c = 0; c < sideCols; c++) {
        let v0 = (c + 0.35) / sideCols;
        let v1 = (c + 0.65) / sideCols;
        let sx0 = lerp(g.R[0], g.B[0], v0), sy0 = lerp(g.R[1], g.B[1], v0) - yMid;
        let sx1 = lerp(g.R[0], g.B[0], v1), sy1 = lerp(g.R[1], g.B[1], v1) - yMid;
        brush.set("rotring", PAL.inkDark, sw(0.38));
        polyLine([[sx0, sy0], [sx1, sy1], [sx1, sy1 - wh], [sx0, sy0 - wh], [sx0, sy0]], 0.02);
      }
    }

    // 3. EVERY ROOFTOP TILE DRAWN IN CRISP SEPIA PEN!
    drawRoofTilesPen(b, g);

    // 4. Special Architectural Landmarks (Clocktower, Church Dome, Lighthouse, Windmill)
    if (b.special) {
      drawSpecialLandmarkDetails(b, g);
    }
  }
}

function drawRoofTilesPen(b, g) {
  // 1. Front-facing terracotta slope: quad [FT, RT, R1, R0]
  let tileCols = max(5, floor(b.w / (4.2 * b.sc)));
  let slopeLen = dist(g.FT[0], g.FT[1], g.R0[0], g.R0[1]);
  let tileRows = max(3, floor(slopeLen / (4.0 * b.sc)));

  // Down-slope pan tile seams
  brush.set("rotring", PAL.inkMid, sw(0.3));
  for (let i = 0; i <= tileCols; i++) {
    let u = i / tileCols;
    let topX = lerp(g.R0[0], g.R1[0], u);
    let topY = lerp(g.R0[1], g.R1[1], u);
    let botX = lerp(g.FT[0], g.RT[0], u);
    let botY = lerp(g.FT[1], g.RT[1], u);
    brush.line(topX, topY, botX, botY);
  }

  // Horizontal overlapping barrel tile courses (curved imbrications)
  brush.set("rotring", PAL.inkDark, sw(0.32));
  for (let r = 1; r <= tileRows; r++) {
    let v = r / tileRows;
    for (let i = 0; i < tileCols; i++) {
      let u0 = i / tileCols;
      let u1 = (i + 1) / tileCols;
      let x0 = lerp(lerp(g.R0[0], g.R1[0], u0), lerp(g.FT[0], g.RT[0], u0), v);
      let y0 = lerp(lerp(g.R0[1], g.R1[1], u0), lerp(g.FT[1], g.RT[1], u0), v);
      let x1 = lerp(lerp(g.R0[0], g.R1[0], u1), lerp(g.FT[0], g.RT[0], u1), v);
      let y1 = lerp(lerp(g.R0[1], g.R1[1], u1), lerp(g.FT[1], g.RT[1], u1), v);
      // Slight upward curve of each barrel tile mouth
      let xm = (x0 + x1) * 0.5;
      let ym = (y0 + y1) * 0.5 - 1.2 * b.sc;
      polyLine([[x0, y0], [xm, ym], [x1, y1]], 0.35);
    }
  }

  // 2. Right-side hip triangle: [RT, BT, R1]
  if (b.roofType !== "gabled") {
    let sideCols = max(3, floor(b.d / (4.4 * b.sc)));
    brush.set("rotring", PAL.inkMid, sw(0.3));
    for (let j = 1; j < sideCols; j++) {
      let v = j / sideCols;
      let bx = lerp(g.RT[0], g.BT[0], v);
      let by = lerp(g.RT[1], g.BT[1], v);
      brush.line(g.R1[0], g.R1[1], bx, by);
    }
    for (let r = 1; r <= tileRows; r++) {
      let t = r / tileRows;
      let pA = [lerp(g.R1[0], g.RT[0], t), lerp(g.R1[1], g.RT[1], t)];
      let pB = [lerp(g.R1[0], g.BT[0], t), lerp(g.R1[1], g.BT[1], t)];
      brush.line(pA[0], pA[1], pB[0], pB[1]);
    }
  }

  // 3. Left hip edge & back slope edge
  brush.set("rotring", PAL.inkDark, sw(0.52));
  polyLine([g.FT, g.R0, g.R1, g.RT, g.FT], 0.03);
  if (b.roofType !== "gabled") {
    polyLine([g.RT, g.BT, g.R1], 0.03);
    polyLine([g.FT, g.LT, g.R0], 0.03);
  } else {
    polyLine([g.BT, g.R1], 0.03);
  }

  // Thick segmented ridge tiles along [R0 -> R1]
  let ridgeSegs = max(4, floor(tileCols * 0.7));
  brush.set("rotring", PAL.inkDark, sw(0.62));
  for (let k = 0; k <= ridgeSegs; k++) {
    let t = k / ridgeSegs;
    let rx = lerp(g.R0[0], g.R1[0], t);
    let ry = lerp(g.R0[1], g.R1[1], t);
    brush.line(rx, ry - 1.5 * b.sc, rx, ry + 1.5 * b.sc);
  }

  // 4. Tiny Masonry Chimneys with Terracotta Pots
  for (let c = 0; c < b.chimneys; c++) {
    let t = b.chimneys === 1 ? 0.35 : (c === 0 ? 0.25 : 0.75);
    let cx = lerp(g.R0[0], g.R1[0], t);
    let cy = lerp(g.R0[1], g.R1[1], t) + 2 * b.sc;
    let cw = 3.6 * b.sc, ch = 8.5 * b.sc;
    brush.noStroke();
    brush.wash(PAL.wallCream, 240);
    brush.rect(cx - cw * 0.5, cy - ch, cw, ch, "corner");
    brush.noWash();
    brush.set("rotring", PAL.inkDark, sw(0.4));
    brush.rect(cx - cw * 0.5, cy - ch, cw, ch, "corner");
    brush.line(cx - cw * 0.7, cy - ch, cx + cw * 0.7, cy - ch);
  }
}

function drawSpecialLandmarkDetails(b, g) {
  let mx = (g.R0[0] + g.R1[0]) * 0.5;
  let my = (g.R0[1] + g.R1[1]) * 0.5;

  if (b.special === "capitaneria") {
    // Harbour Master's Clocktower rising above the roof ridge
    let tw = 16 * b.sc, th = 28 * b.sc;
    brush.noStroke();
    brush.wash(PAL.wallOchre, 245);
    brush.rect(mx - tw * 0.5, my - th, tw, th, "corner");
    brush.wash(PAL.roofClassic, 235);
    polyShape([[mx - tw * 0.6, my - th], [mx + tw * 0.6, my - th], [mx, my - th - 14 * b.sc]]);
    brush.noWash();

    brush.set("rotring", PAL.inkDark, sw(0.52));
    brush.rect(mx - tw * 0.5, my - th, tw, th, "corner");
    polyLine([[mx - tw * 0.6, my - th], [mx, my - th - 14 * b.sc], [mx + tw * 0.6, my - th], [mx - tw * 0.6, my - th]], 0.05);
    // Clock face & belfry arch
    brush.noStroke();
    brush.wash(PAL.foamWhite, 245);
    brush.circle(mx, my - th * 0.45, 4.5 * b.sc, 0.05);
    brush.noWash();
    brush.set("rotring", PAL.inkDark, sw(0.42));
    brush.circle(mx, my - th * 0.45, 4.5 * b.sc, 0.05);
    brush.line(mx, my - th * 0.45, mx, my - th * 0.45 - 3 * b.sc);
    brush.line(mx, my - th * 0.45, mx + 2.5 * b.sc, my - th * 0.45);
    // Weathervane
    brush.line(mx, my - th - 14 * b.sc, mx, my - th - 22 * b.sc);
  } else if (b.special === "church") {
    // Hilltop Baroque Church Terracotta Dome & Campanile
    let dr = 14 * b.sc, dh = 24 * b.sc;
    brush.noStroke();
    brush.wash(PAL.wallCream, 245);
    brush.rect(mx - dr, my - dh * 0.45, dr * 2, dh * 0.45, "corner");
    brush.wash(PAL.roofBright, 235);
    polyShape([
      [mx - dr, my - dh * 0.45],
      [mx - dr * 0.75, my - dh * 0.95],
      [mx, my - dh * 1.15],
      [mx + dr * 0.75, my - dh * 0.95],
      [mx + dr, my - dh * 0.45]
    ]);
    brush.noWash();

    brush.set("rotring", PAL.inkDark, sw(0.5));
    brush.rect(mx - dr, my - dh * 0.45, dr * 2, dh * 0.45, "corner");
    polyLine([
      [mx - dr, my - dh * 0.45],
      [mx - dr * 0.75, my - dh * 0.95],
      [mx, my - dh * 1.15],
      [mx + dr * 0.75, my - dh * 0.95],
      [mx + dr, my - dh * 0.45]
    ], 0.35);
    // Dome ribs & lantern cross
    brush.set("rotring", PAL.inkMid, sw(0.34));
    for (let f of [-0.45, 0, 0.45]) {
      polyLine([[mx + dr * f, my - dh * 0.45], [mx + dr * f * 0.6, my - dh * 0.9], [mx, my - dh * 1.15]], 0.3);
    }
    brush.set("rotring", PAL.inkDark, sw(0.45));
    brush.line(mx, my - dh * 1.15, mx, my - dh * 1.48);
    brush.line(mx - 3 * b.sc, my - dh * 1.35, mx + 3 * b.sc, my - dh * 1.35);
  } else if (b.special === "lighthouse") {
    // Tall Cylindrical Headland Lighthouse rising from keeper's house
    let lw = 11 * b.sc, lh = 38 * b.sc;
    brush.noStroke();
    brush.wash(PAL.wallCream, 248);
    polyShape([[mx - lw * 0.55, my], [mx + lw * 0.55, my], [mx + lw * 0.42, my - lh], [mx - lw * 0.42, my - lh]]);
    brush.wash(PAL.roofBright, 235);
    polyShape([[mx - lw * 0.5, my - lh * 0.55], [mx + lw * 0.5, my - lh * 0.55], [mx + lw * 0.46, my - lh * 0.75], [mx - lw * 0.46, my - lh * 0.75]]);
    polyShape([[mx - lw * 0.5, my - lh - 6 * b.sc], [mx + lw * 0.5, my - lh - 6 * b.sc], [mx, my - lh - 14 * b.sc]]);
    brush.noWash();

    brush.set("rotring", PAL.inkDark, sw(0.5));
    polyLine([[mx - lw * 0.55, my], [mx - lw * 0.42, my - lh], [mx + lw * 0.42, my - lh], [mx + lw * 0.55, my]], 0.02);
    brush.line(mx - lw * 0.65, my - lh, mx + lw * 0.65, my - lh);
    brush.rect(mx - lw * 0.38, my - lh - 6 * b.sc, lw * 0.76, 6 * b.sc, "corner");
    polyLine([[mx - lw * 0.5, my - lh - 6 * b.sc], [mx, my - lh - 14 * b.sc], [mx + lw * 0.5, my - lh - 6 * b.sc]], 0.05);
  } else if (b.special === "windmill") {
    // Old Island Windmill Sails (4 lattice blades in sepia pen)
    let cx = mx - 4 * b.sc, cy = my - 4 * b.sc;
    let bladeL = 22 * b.sc;
    brush.set("rotring", PAL.inkDark, sw(0.45));
    for (let a = 35; a < 360; a += 90) {
      let ex = cx + cos(a) * bladeL;
      let ey = cy + sin(a) * bladeL;
      brush.line(cx, cy, ex, ey);
      let px = -sin(a) * 4 * b.sc, py = cos(a) * 4 * b.sc;
      polyLine([
        [cx + cos(a) * 5 * b.sc, cy + sin(a) * 5 * b.sc],
        [cx + cos(a) * 5 * b.sc + px, cy + sin(a) * 5 * b.sc + py],
        [ex + px, ey + py],
        [ex, ey]
      ], 0.03);
    }
  }
}

// =============================================================================
// CAFÉ UMBRELLAS, PROMENADE LIFE, BOLLARDS & MOORING ROPES
// =============================================================================
function drawCafeUmbrellasAndPromenadeLifePen() {
  for (let u of umbrellas) {
    if (!u.pts) continue;
    // Tiny café chairs & table legs peeking out in the shade under the umbrella
    brush.set("rotring", PAL.inkDark, sw(0.36));
    brush.line(u.x + 2 * u.sc, u.y + 2 * u.sc, u.x + 2 * u.sc, u.y + 8 * u.sc);
    brush.circle(u.x - 4 * u.sc, u.y + 6 * u.sc, 2.2 * u.sc, 0.1);
    brush.circle(u.x + 7 * u.sc, u.y + 6 * u.sc, 2.2 * u.sc, 0.1);

    // Octagonal canopy perimeter
    brush.set("rotring", PAL.inkDark, sw(0.46));
    polyLine([...u.pts, u.pts[0]], 0.06);

    // 8 radial ribs from central finial apex
    let apexX = u.x - 0.5 * u.sc, apexY = u.y - 2.5 * u.sc;
    brush.set("rotring", PAL.inkMid, sw(0.32));
    for (let p of u.pts) {
      brush.line(apexX, apexY, p[0], p[1]);
    }

    // Front scalloped valance fringe along the lower edges (indices 0, 1, 2, 3)
    brush.set("rotring", PAL.inkDark, sw(0.38));
    for (let idx = 0; idx < 4; idx++) {
      let pA = u.pts[idx], pB = u.pts[(idx + 1) % 8];
      let xm = (pA[0] + pB[0]) * 0.5, ym = (pA[1] + pB[1]) * 0.5 + 2.4 * u.sc;
      polyLine([pA, [xm, ym], pB], 0.35);
    }

    // Bright finial dot at top center
    brush.set("rotring", PAL.foamWhite, sw(0.75));
    brush.circle(apexX, apexY, 1.0 * u.sc, 0.05);
  }

  // Tiny strolling figures, harbour crates, barrels & lamp posts along the Riva & Pier
  const figures = [
    [412, 522], [420, 526], [485, 442], [492, 445],
    [545, 405], [625, 452], [632, 455], [685, 505],
    [742, 548], [748, 552], [818, 608], [888, 695],
    [712, 938], [720, 940], [545, 932]
  ];
  for (let f of figures) {
    let [px, py] = f;
    let sc = pScale(py);
    // Cast shadow
    brush.set("rotring", PAL.inkLight, sw(0.45));
    brush.line(px, py, px + 6 * sc, py + 2 * sc);
    // Body & head in crisp sepia pen
    brush.set("rotring", PAL.inkDark, sw(0.65));
    brush.line(px, py, px, py - 6.5 * sc);
    brush.circle(px, py - 8 * sc, 1.4 * sc, 0.1);
  }

  // Quayside wrought-iron lamp posts along the promenade
  const lamps = [
    [435, 318], [520, 368], [588, 438], [670, 488],
    [755, 548], [835, 618], [898, 708], [912, 795]
  ];
  for (let lp of lamps) {
    let [lx, ly] = lp;
    let sc = pScale(ly);
    let h = 18 * sc;
    brush.set("rotring", PAL.inkDark, sw(0.48));
    brush.line(lx, ly, lx, ly - h);
    brush.circle(lx, ly - h - 2 * sc, 2 * sc, 0.1);
  }
}

function drawBollardsAndMooringLinesPen() {
  for (let b of bollards) {
    let { x, y, sc, hasCoil } = b;
    let bw = 3.2 * sc, bh = 5.5 * sc;

    // Diagonal cast shadow on the limestone coping
    brush.set("rotring", PAL.inkMid, sw(0.65));
    brush.line(x, y, x + 6 * sc, y + 2 * sc);

    // Flanged base plate
    brush.set("rotring", PAL.inkDark, sw(0.55));
    brush.line(x - bw * 0.9, y, x + bw * 0.9, y);

    // Sturdy cast-iron bollard post & T-horns
    brush.set("rotring", PAL.inkDark, sw(1.05 * sc));
    brush.line(x, y, x, y - bh);
    brush.set("rotring", PAL.inkDark, sw(0.65));
    brush.line(x - bw * 0.85, y - bh * 0.78, x + bw * 0.85, y - bh * 0.78);

    // Bright highlight dot on top of iron cap
    brush.set("rotring", PAL.foamWhite, sw(0.55));
    brush.line(x - 0.8 * sc, y - bh, x + 0.8 * sc, y - bh);

    // Coiled mooring rope beside the bollard
    if (hasCoil) {
      brush.set("rotring", PAL.inkMid, sw(0.32));
      let cx = x + 6.5 * sc, cy = y - 1 * sc;
      brush.circle(cx, cy, 3.2 * sc, 0.15);
      brush.circle(cx, cy, 1.6 * sc, 0.15);
      brush.line(x, y - bh * 0.5, cx - 2 * sc, cy);
    }
  }
}

// =============================================================================
// PICTORIAL COMPASS ROSE & FLOATING BLANK CARTOUCHE BANNERS
// =============================================================================
function drawCompassRoseAndMapFramePen() {
  // Ornate pictorial compass rose in the lower-left sea corner (x: 108, y: 1092)
  let cx = 108, cy = 1092, rOuter = 54, rInner = 16;

  // Translucent parchment wash inside compass ring
  brush.noStroke();
  brush.wash(PAL.cartouche, 175);
  brush.circle(cx, cy, rOuter * 0.78, 0.05);
  brush.noWash();

  // Concentric degree rings & rhumb lines radiating across the water
  brush.set("rotring", PAL.inkLight, sw(0.28));
  for (let a = 0; a < 360; a += 22.5) {
    brush.line(
      cx + cos(a) * rOuter, cy + sin(a) * rOuter,
      cx + cos(a) * (rOuter + 28), cy + sin(a) * (rOuter + 28)
    );
  }

  brush.set("rotring", PAL.inkDark, sw(0.5));
  brush.circle(cx, cy, rOuter, 0.04);
  brush.circle(cx, cy, rOuter * 0.88, 0.04);
  brush.circle(cx, cy, rInner, 0.04);

  // 8-point wind star (alternating dark sepia & warm gold-ochre halves)
  for (let i = 0; i < 8; i++) {
    let a = i * 45 - 90;
    let tipR = i % 2 === 0 ? rOuter * 0.96 : rOuter * 0.68;
    let sideA1 = a - 16, sideA2 = a + 16;
    let tip = [cx + cos(a) * tipR, cy + sin(a) * tipR];
    let pL = [cx + cos(sideA1) * rInner, cy + sin(sideA1) * rInner];
    let pR = [cx + cos(sideA2) * rInner, cy + sin(sideA2) * rInner];

    // Shaded half of star point
    brush.noStroke();
    brush.wash(i % 2 === 0 ? PAL.inkDark : PAL.roofBright, 210);
    polyShape([[cx, cy], tip, pR]);
    brush.wash(PAL.cartouche, 230);
    polyShape([[cx, cy], tip, pL]);
    brush.noWash();

    brush.set("rotring", PAL.inkDark, sw(0.42));
    polyLine([pL, tip, pR], 0.02);
    brush.line(cx, cy, tip[0], tip[1]);
  }

  // Ornamental fleur-de-lis pointer at North (top)
  let ny = cy - rOuter - 12;
  brush.set("rotring", PAL.inkDark, sw(0.5));
  polyLine([[cx, cy - rOuter], [cx - 5, ny + 5], [cx, ny - 4], [cx + 5, ny + 5], [cx, cy - rOuter]], 0.25);
}

function drawFloatingCartouches() {
  // Tiny cartouche-like blank banners floating over key buildings
  for (let c of cartouches) {
    let { x, y, w, h, targetX, targetY } = c;
    let hw = w * 0.5, hh = h * 0.5;

    // 1. Thin pointer pin connecting floating cartouche to landmark below
    brush.set("rotring", PAL.inkDark, sw(0.42));
    brush.line(x, y + hh + 3, targetX, targetY);
    brush.circle(targetX, targetY, 2.2, 0.05);

    // 2. Soft drop shadow wash so banner visibly floats over the rooftops
    brush.noStroke();
    brush.wash(PAL.inkDark, 85);
    polyShape([
      [x - hw - 8, y - hh + 6],
      [x + hw + 14, y - hh + 6],
      [x + hw + 14, y + hh + 9],
      [x - hw - 8, y + hh + 9]
    ]);

    // 3. Folded ribbon tails on left & right (darker warm parchment)
    let tailW = 14, tailDrop = 5;
    brush.wash(PAL.cartoucheBack, 245);
    // Left folded ribbon tail
    polyShape([
      [x - hw - tailW, y - hh + tailDrop],
      [x - hw + 3, y - hh + tailDrop],
      [x - hw + 3, y + hh + tailDrop],
      [x - hw - tailW, y + hh + tailDrop],
      [x - hw - tailW + 5, y + tailDrop]
    ]);
    // Right folded ribbon tail
    polyShape([
      [x + hw - 3, y - hh + tailDrop],
      [x + hw + tailW, y - hh + tailDrop],
      [x + hw + tailW - 5, y + tailDrop],
      [x + hw + tailW, y + hh + tailDrop],
      [x + hw - 3, y + hh + tailDrop]
    ]);

    // 4. Main arched blank banner body (bright warm cream parchment)
    let bodyPts = [
      [x - hw, y - hh],
      [x - hw * 0.4, y - hh - 2.5],
      [x + hw * 0.4, y - hh - 2.5],
      [x + hw, y - hh],
      [x + hw, y + hh],
      [x + hw * 0.4, y + hh - 2.5],
      [x - hw * 0.4, y + hh - 2.5],
      [x - hw, y + hh]
    ];
    brush.fill(PAL.cartouche, 250);
    brush.fillBleed(0.04, "in");
    polyShape(bodyPts);
    brush.noFill();
    brush.noWash();

    // 5. Crisp sepia pen outlines, scrolled volute curls & inner frame (completely blank inside!)
    brush.set("rotring", PAL.inkDark, sw(0.55));
    polyLine([...bodyPts, bodyPts[0]], 0.15);

    // Inner double-line frame border
    let padX = 4, padY = 3.2;
    brush.set("rotring", PAL.inkMid, sw(0.3));
    polyLine([
      [x - hw + padX, y - hh + padY],
      [x, y - hh - 2.5 + padY],
      [x + hw - padX, y - hh + padY],
      [x + hw - padX, y + hh - padY],
      [x, y + hh - 2.5 - padY],
      [x - hw + padX, y + hh - padY],
      [x - hw + padX, y - hh + padY]
    ], 0.15);

    // Left and right ribbon tails & rolled scroll volutes
    brush.set("rotring", PAL.inkDark, sw(0.48));
    polyLine([
      [x - hw, y - hh + tailDrop],
      [x - hw - tailW, y - hh + tailDrop],
      [x - hw - tailW + 5, y + tailDrop],
      [x - hw - tailW, y + hh + tailDrop],
      [x - hw + 3, y + hh + tailDrop],
      [x - hw, y + hh]
    ], 0.05);
    polyLine([
      [x + hw, y - hh + tailDrop],
      [x + hw + tailW, y - hh + tailDrop],
      [x + hw + tailW - 5, y + tailDrop],
      [x + hw + tailW, y + hh + tailDrop],
      [x + hw - 3, y + hh + tailDrop],
      [x + hw, y + hh]
    ], 0.05);

    // Rolled corner curls & small central Baroque crest flourish on top edge
    brush.circle(x - hw + 1.5, y + hh + 2.5, 2.2, 0.1);
    brush.circle(x + hw - 1.5, y + hh + 2.5, 2.2, 0.1);
    polyLine([
      [x - 8, y - hh - 2.5],
      [x, y - hh - 6.5],
      [x + 8, y - hh - 2.5]
    ], 0.4);
  }
}
