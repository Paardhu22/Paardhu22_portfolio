import { mountProjectCaseStudy } from './project-case-study.js';

// A reader's guide to the supplied thesis, main@866bcfa.
// The interactive showcase illustrates registration; it does not process imagery.
const sections = [
  {
    id: 'purpose', label: 'Why it exists', title: 'Different views of the same lunar ground.',
    body: `<p>SELENO registers Chandrayaan-2 images onto lunar reference maps. Built for Smart India Hackathon problem SIH26166, it supports OHRC, TMC-2, and IIRS sources alongside LRO NAC, SELENE/Kaguya TC, WAC, and other georeferenced references.</p>
      <p>Lighting, resolution, and spacecraft viewpoint can make the same terrain look very different. The tool starts with the source’s geometry, finds evenly distributed match points, and fits a transform. It delivers the registered image, those points, and accuracy measurements from points the fit never saw.</p>
      <blockquote>Every correction must earn its place. Every result must show its uncertainty.</blockquote>
      <p>Sub-source-pixel registration is the goal. The published real-pair results have limitations, and the tool reports warnings or failures with reasons when its acceptance gates are missed.</p>`,
  },
  {
    id: 'architecture', label: 'One pipeline', title: 'Three ways in. One measured result.',
    body: `<p>The React web app, HTTP API, and Python CLI all reach the same registration entry point: <code>seleno.tool.register.register()</code>. The validation harness calls it too. Each run writes one artifact set, so the interface and command line read the same measurements.</p>
      <figure class="qp-case-flow"><ol><li><span>01 / Inputs</span><strong>Source and reference</strong><small>Images, geometry, sensor profile</small></li><li><span>02 / Registration</span><strong>Place, match, fit</strong><small>Validate each added correction</small></li><li><span>03 / Delivery</span><strong>Score and export</strong><small>Image, points, quality report</small></li></ol><figcaption>The saved transform is reloaded before final scoring. Export and previews use that same complete model.</figcaption></figure>
      <p>FastAPI serves the web interface, job status, artifacts, and deep-zoom tiles. Web registration runs in a separate child process, with progress passed back to the server. A queue allows one registration job at a time.</p>
      <p>The current registration tool is the main deliverable. The earlier OHRC illumination study remains available as a separate study view, preserving the experiments that informed matcher selection.</p>`,
  },
  {
    id: 'matching', label: 'Place & match', title: 'Geometry finds the region. Matching refines it.',
    body: `<ol class="qp-case-steps"><li><strong>Read and place.</strong> Lazy readers handle PDS labels, GeoTIFF, ISIS cubes, and ordinary images. A CRS or spacecraft longitude/latitude lattice places the source; otherwise, a localization stage searches for it inside the reference.</li><li><strong>Seal the folds.</strong> Spatial fit, validation, and test cells are fixed before matching, from source coordinates and a seed.</li><li><strong>Verify coarse matches.</strong> Up to seven candidates include dense correlation, DISK + LightGlue, SIFT variants, AKAZE, and ORB. Candidates must pass a chance-agreement significance test and geometric sanity checks.</li><li><strong>Measure fine matches.</strong> About 6,000 seeds span an even lattice over the overlap. Native-resolution correlation, ECC refinement, and forward–backward checks refine their positions. Cross-validation chooses a 41- or 61-pixel patch.</li></ol>
      <p>Matcher ordering comes from recorded experiments. Brightness inversion, for example, favors dense correlation on some pairs. Ordering determines what is tried first; every candidate still runs and must be verified.</p>
      <p>Missing geometry, Sun parameters, or terrain data is recorded as degraded capability. The tool continues with the information it has rather than silently assuming those inputs exist.</p>`,
  },
  {
    id: 'model', label: 'Fit & export', title: 'Use a richer model only when it predicts better.',
    body: `<p>A robust fit, neighbor-consistency screening, and balanced least squares prevent a few textured crater rims from dominating the transform. Affine and homography models cover global changes in viewpoint and scale.</p>
      <p>Two optional corrections address effects a global fit cannot explain. A LOLA DEM supplies terrain parallax, and a smooth B-spline field can model local strip distortion. Each term is adopted only when cross-validation improves. Long strips can also use smoothly blended segment transforms.</p>
      <p>The complete model is written to <code>transform.json</code>, reloaded, and scored on the sealed test fold once. Export composes that model with the original geometry and samples each original band once. The decimated matching image is never enlarged into the delivered product.</p>
      <aside class="qp-case-note"><strong>Preserve the original information.</strong> IIRS uses a selected spectral window for matching, but the registered GeoTIFF retains all 256 bands. A coarser source is not upsampled onto every fine reference pixel, and an export exceeding half the free disk is refused.</aside>`,
  },
  {
    id: 'evaluation', label: 'Honest evaluation', title: 'The test fold never chooses the model.',
    body: `<p>Method choice, correlation patches, and model terms use fit cells; ECC adoption and refits also use validation cells. Test membership cannot depend on matches or residuals. Final scoring measures the saved, delivered transform rather than an internal variant.</p>
      <p>Both raw held-out errors and screened check-point errors are reported. A model-independent neighbor screen identifies isolated mismatches, and the report keeps the unscreened numbers visible alongside the check-point figures.</p>
      <div class="qp-case-table-wrap"><table class="qp-case-table"><caption>All gates must hold for a pass</caption><thead><tr><th scope="col">Gate</th><th scope="col">Required result</th></tr></thead><tbody>
      <tr><th scope="row">Precision</th><td>RMSE and p90 below one source pixel; at least 95% of check points within one pixel; bias below 0.5 pixel.</td></tr>
      <tr><th scope="row">Evidence</th><td>At least 12 check points, retaining at least 80% of the held-out points.</td></tr>
      <tr><th scope="row">Support</th><td>At least 50% coverage, at most 25% extrapolation, and no invalid predictions.</td></tr>
      </tbody></table></div>
      <p>Quality diagnostics add p95, NMAD, along- and across-track profiles, spatial-block bootstrap intervals, and final-warp validity. They are read-only and can be recomputed from saved JSON without reopening the rasters.</p>
      <p>Source pixels, reference pixels, and surface metres are distinct units. Surface errors use the reference CRS’s local geometry to compute east/north distances, avoiding misleading nominal pixel distances at high latitudes.</p>
      <aside class="qp-case-note"><strong>Internal consistency is not independent accuracy.</strong> Real-pair test correspondences come from matching. Independent verification requires external control points supplied separately and passing their own evaluation.</aside>`,
  },
  {
    id: 'results', label: 'Measured results', title: 'The reference changes what can be measured.',
    body: `<p>The 25 September validation reports these check-point RMSE values. Every real Chandrayaan-2 pair returned a warning; none achieved sub-source-pixel RMSE against those references.</p>
      <div class="qp-case-table-wrap"><table class="qp-case-table"><caption>25 September 2026 / source and reference pixel errors</caption><thead><tr><th scope="col">Pair</th><th scope="col">Check-point RMSE</th></tr></thead><tbody>
      <tr><th scope="row">OHRC → LRO NAC</th><td>3.84 source px / 1.06 reference px. Affine + terrain; 1,259 inliers, 97.8% ratio.</td></tr>
      <tr><th scope="row">TMC-2 → Kaguya TC</th><td>2.34 source px / 1.75 reference px. Affine + field; 1,249 inliers, 96.4% ratio.</td></tr>
      <tr><th scope="row">IIRS 2025 → WAC</th><td>1.87 source px / 1.62 reference px. Affine + field; 474 inliers, 93.9% ratio.</td></tr>
      <tr><th scope="row">IIRS 2024 → WAC</th><td>1.31 source px / 1.19 reference px. Affine + field; 1,256 inliers, 99.3% ratio.</td></tr>
      </tbody></table></div>
      <p>A separate 26 September experiment registered the same full IIRS strip against WAC and a sharper Kaguya TC reference averaged to 29.6 metres, keeping the settings and memory cap fixed.</p>
      <div class="qp-case-table-wrap"><table class="qp-case-table"><caption>Reference experiment / all-held-out RMSE and 95% block-bootstrap interval</caption><thead><tr><th scope="col">Reference</th><th scope="col">Error in source pixels</th></tr></thead><tbody>
      <tr><th scope="row">WAC / 100 m</th><td>1.63 px [1.31–1.97]</td></tr>
      <tr><th scope="row">Averaged TC / 29.6 m</th><td>0.69 px [0.57–0.82]</td></tr>
      </tbody></table></div>
      <p>The TC run’s screened RMSE was 0.61 pixel, with 90.8% of check points below one pixel. It passed RMSE, p90, and bias gates, but missed the 95% threshold and the legacy cell-support gate. This measures matcher consistency against TC, not independent accuracy.</p>
      <p>Known-truth controls add context: seven of nine synthetic cases were accepted at 0.00–0.18 pixel error, and nine moderate Sun-change LROC pairs registered at 0.19–0.55 pixel error. Three near-180° Sun-change pairs and two different-ground negatives were correctly refused.</p>`,
  },
  {
    id: 'jobs', label: 'Jobs & memory', title: 'Memory should not change the experiment.',
    body: `<p>The working grid is planned from the memory limit, not momentary free RAM, and recorded in the metrics. Matching inputs, settings, and limits therefore produce the same planned grid. The documented app and CLI comparisons produced bit-identical transforms.</p>
      <p>Each web job has its own process and, when available on Linux, its own systemd memory scope. The server’s image-viewer cache cannot silently reduce the job’s grid. One active registration prevents competing jobs from consuming the same budget; later requests remain queued.</p>
      <p>Large rasters use lazy windowed reads. The deep-zoom viewer cuts 256-pixel tiles on demand and opens one GDAL handle per thread, avoiding the decoder corruption caused by a shared handle.</p>
      <aside class="qp-case-note"><strong>Comparability stays explicit.</strong> If available memory falls short of the planned grid and forces a reduction, the log marks the run as not directly comparable. Coverage-grid settings also change fold layout and must match when comparing experiments.</aside>`,
  },
  {
    id: 'artifacts', label: 'Sensors & outputs', title: 'Sensor behavior is data. Results are inspectable files.',
    body: `<p>YAML profiles define OHRC, TMC-2, IIRS, NAC, Kaguya TC, and WAC behavior, with a default for unknown inputs. They set resolution, normalization, texture thresholds, search radius, grid defaults, and spectral selection. Adding a sensor starts with a profile rather than a pipeline branch.</p>
      <dl class="qp-case-stack"><div><dt>Registered image</dt><dd><code>registered.tif</code> holds the georeferenced source bands on the export grid.</dd></div><div><dt>Match points</dt><dd><code>matches.csv</code> provides distributed points in original image coordinates. <code>matches_all.csv</code> keeps fit-stage matches, including rejected ones.</dd></div><div><dt>Transform</dt><dd><code>transform.json</code> records the matrix and optional correction field or terrain term.</dd></div><div><dt>Evaluation</dt><dd><code>evaluation.json</code> stores sealed test points and the model fingerprint so the score can be recomputed.</dd></div><div><dt>Quality report</dt><dd><code>metrics.json</code>, <code>quality.json</code>, and <code>report.md</code> explain status, errors, support, decisions, and degraded capability.</dd></div></dl>
      <p>Even a failed run writes metrics and a report with a reason. Finished runs expose their artifacts through the API and a ZIP download. The actual interface includes deep zoom, match lines, before/after comparison, and a quality panel.</p>`,
  },
  {
    id: 'tradeoffs', label: 'Trade-offs', title: 'Make every accuracy claim traceable.',
    body: `<div class="qp-case-table-wrap"><table class="qp-case-table"><caption>Five decisions behind the pipeline</caption><thead><tr><th scope="col">Decision</th><th scope="col">Why it was chosen</th></tr></thead><tbody>
      <tr><th scope="row">Seal test cells first</th><td>Selection cannot tune against the points later used to measure the result.</td></tr>
      <tr><th scope="row">Even lattice seeds</th><td>Descriptor confidence alone concentrates points on a few textured features and leaves the rest unsupported.</td></tr>
      <tr><th scope="row">Validate richer models</th><td>Terrain and local fields must improve prediction rather than only reduce fitting residuals.</td></tr>
      <tr><th scope="row">Reload before scoring</th><td>The measured transform is the file delivered to the user.</td></tr>
      <tr><th scope="row">Match reference resolution</th><td>A finer map can force harmful upsampling. Averaging TC helped the IIRS experiment; using native 7.4 m TC failed.</td></tr>
      </tbody></table></div>`,
  },
  {
    id: 'testing', label: 'Testing & limits', title: 'Keep the evidence and the unfinished work visible.',
    body: `<dl class="qp-case-stack"><div><dt>Registration</dt><dd>Python, geospatial raster tooling, and classical image matching, with CPU-based DISK + LightGlue available through PyTorch and Kornia. No GPU is required.</dd></div><div><dt>Interface</dt><dd>FastAPI, React 19, and Vite 8. The API and CLI share the same registration entry point.</dd></div><div><dt>Validation</dt><dd>Adversarial cases, unit suites, synthetic known transforms, illumination controls, and real Chandrayaan-2 comparisons.</dd></div></dl>
      <p>The supplied thesis records 35 passing adversarial cases and 87 unit tests across seven modules under a 4 GB cap on 4 October 2026. CI runs adversarial and audit regressions, archive checks, and a CLI smoke test on Python 3.12.</p>
      <p>Real-pair accuracy remains constrained by reference resolution and geometry. One NAC pixel spans 4.17 OHRC pixels. There are no surveyed control points for the published real pairs, and near-180° Sun changes are refused.</p>
      <p>The legacy coverage estimate can overstate extrapolation on thin strips; valid-pixel hull support is reported alongside it, but the legacy gate still drives acceptance. Only polar LOLA DEMs are wired in. Reference resolution matching remains manual, and web registration runs one job at a time.</p>
      <p>This is a non-commercial hackathon prototype. Chandrayaan-2 imagery comes from ISRO/ISSDC; lunar reference data comes from NASA/ASU LROC, NASA LOLA, and JAXA Kaguya TC. SELENO claims no ownership of that imagery. DISK and LightGlue weights use Apache-2.0 licensing.</p>`,
  },
];

export function mountSelenoCaseStudy(container, options) {
  return mountProjectCaseStudy(container, options, {
    id: 'seleno-case', theme: 'seleno', title: 'SELENO architecture and engineering', sections,
    note: 'Architecture notes edited from the supplied thesis, main@866bcfa, 27 September 2026, including its 4 October test report. Measurements describe the documented experiments; they are not independent accuracy certification. The showcase above illustrates the workflow locally and does not run registration.',
  });
}
