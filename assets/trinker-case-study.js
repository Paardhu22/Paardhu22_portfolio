import { mountProjectCaseStudy } from './project-case-study.js';

// An edited reader's guide to the owner-supplied thesis, main@c8e68bd (v0.1.1).
// The portfolio terminal remains a local simulation, never a scanner or shell.
const sections = [
  {
    id: 'purpose', label: 'Why it exists', title: 'Security knowledge should survive the session.',
    body: `<p>TRINKER turns application-specific security rules into a reviewed plan, then runs that plan against HTTP APIs. It focuses on object-level authorization, unauthorized state changes, and caller-controlled data scoping.</p>
      <p>Working out who should be allowed to read an order takes judgment. Checking whether a denied identity receives the owner’s response is a mechanical comparison. TRINKER separates those tasks so security assumptions can be committed, reviewed, and tested again on the next pull request.</p>
      <blockquote>Derive the security knowledge once. Replay the checks with evidence.</blockquote>`,
  },
  {
    id: 'architecture', label: 'Compile & replay', title: 'Two phases, with a firm boundary.',
    body: `<p>Compilation discovers the application surface and produces a secret-free plan. A developer authors its identities, fixtures, invariants, and checks. An optional model can propose additions, but a human reviews and applies them.</p>
      <p>Execution reads that reviewed plan and a local runtime configuration. The runner performs a safety preflight, dispatches checks in a fixed order, and records the evidence. No model participates in a scan, and scan-path packages cannot depend on the compiler.</p>
      <figure class="qp-case-flow"><ol><li><span>01 / Compile</span><strong>Discover and author</strong><small>Routes and security rules</small></li><li><span>02 / Review</span><strong>Commit the plan</strong><small>Diffable, secret-free checks</small></li><li><span>03 / Replay</span><strong>Run and verify</strong><small>Evidence, reports, CI results</small></li></ol><figcaption>The reviewed plan connects compilation to execution. Scans use zero runtime model tokens.</figcaption></figure>
      <ol class="qp-case-steps"><li><strong>Initialize.</strong> Create local runtime settings for the authorized target and test identities.</li><li><strong>Compile the surface.</strong> Read source code, OpenAPI, or recorded HAR traffic.</li><li><strong>Author the checks.</strong> Declare the security rules and what would count as a violation.</li><li><strong>Run, review, replay.</strong> Execute the plan, inspect its report, and verify a finding’s exact check.</li></ol>`,
  },
  {
    id: 'files', label: 'Plan & runtime', title: 'Review the rules. Keep credentials local.',
    body: `<dl class="qp-case-stack"><div><dt>Plan</dt><dd><code>plan.json</code> is the committed security artifact: routes, identities, invariants, checks, scope, and safety policy.</dd></div><div><dt>Runtime</dt><dd><code>runtime.json</code> stays local. It supplies target URLs, credentials, fixtures, HTTP settings, and explicit write authorization.</dd></div><div><dt>Baseline</dt><dd><code>baseline.json</code> records reviewed risk acceptance by check, with a required reason.</dd></div><div><dt>Local outputs</dt><dd>Proposals and reports remain outside version control. Reports can contain target response data.</dd></div></dl>
      <p>The plan refers to sensitive values by key. Strict schemas reject inline credential-like values, unknown keys, and broken references. A missing runtime binding is an actionable error, rather than an ambiguous security verdict.</p>
      <p>Recompiling preserves authored knowledge. If a route disappears and a check still refers to it, compilation refuses to write instead of silently deleting the check. The plan ID changes with its content, which also prevents applying a proposal against an outdated plan.</p>`,
  },
  {
    id: 'discovery', label: 'Surface discovery', title: 'A missing route is better than an invented one.',
    body: `<p>Source discovery uses the TypeScript compiler API to identify Express and Fastify routes. It resolves framework receivers and mount prefixes, including relative imports and cross-file mounts. A generic call such as a cache lookup is not automatically treated as an HTTP endpoint.</p>
      <p>OpenAPI and recorded HAR traffic provide additional surfaces. Entries merge by method and path, preserving their source references and strongest confidence. HAR ingestion keeps requests to the configured target origin, so third-party traffic cannot extend the plan’s scope.</p>
      <aside class="qp-case-note"><strong>Discovery is not authorization knowledge.</strong> Deterministic compilation writes no security checks. Someone must author the rules, or review a model’s proposal, before the plan tests anything.</aside>`,
  },
  {
    id: 'oracles', label: 'The three oracles', title: 'Each finding needs a specific observation.',
    body: `<p>An oracle is the code that decides whether a declared rule held. Each oracle calibrates the endpoint before judging it; unexplained behavior remains inconclusive.</p>
      <div class="qp-case-table-wrap"><table class="qp-case-table"><caption>The implemented checks and their evidence</caption><thead><tr><th scope="col">Oracle</th><th scope="col">What confirms a violation</th></tr></thead><tbody>
      <tr><th scope="row">Differential authorization</th><td>A denied identity receives a response matching an allowed witness on both status and full-body SHA-256 digest.</td></tr>
      <tr><th scope="row">State mutation</th><td>A protected value, proven stable by control reads, changes after an unauthorized write.</td></tr>
      <tr><th scope="row">Metamorphic response</th><td>Query variants violate the plan’s declared relation on an endpoint first proven deterministic.</td></tr>
      </tbody></table></div>
      <p>A successful status alone does not prove unauthorized access or a changed value. A timestamp or nonce can also prevent a reliable response comparison. Those cases are reported without pretending a violation was confirmed.</p>
      <aside class="qp-case-note"><strong>State changes are not restored automatically.</strong> A mutation check can leave a fixture changed. Replaying it against that same state may be inconclusive; the integration evaluation uses a fresh container.</aside>`,
  },
  {
    id: 'evidence', label: 'Evidence & replay', title: 'A finding comes with the check that produced it.',
    body: `<p>Findings include the route, invariant, oracle result, request and response witnesses, body digests, remediation, and a matching replay command. The runner assigns finding IDs and their commands together, so they cannot drift apart.</p>
      <p>Sensitive headers and runtime-bound values are redacted in recorded evidence. Body previews are capped, and response-body capture can be disabled while preserving digests. Fixture identifiers remain visible when they are necessary to understand the finding.</p>
      <p><code>trinker verify TRK-0001</code> runs only the check behind that finding. It reports reproduced when the violation is confirmed again, not-reproduced only when the check passes, and untestable when it cannot reach a verdict.</p>
      <p>Risk acceptance is keyed by check rather than per-scan finding ID. Accepted findings remain in the report with their required reason; acceptance changes whether they fail the build, not whether they are visible.</p>`,
  },
  {
    id: 'coverage', label: 'Coverage & CI', title: 'No findings is not a completeness claim.',
    body: `<p>Checks can pass, fail with evidence, remain inconclusive, error, or be unavailable because their oracle is not implemented. Reports lead with a completeness summary and identify checks that never reached a verdict.</p>
      <p>Planned coverage measures routes with an enabled check. Verified coverage requires every planned check on a route to reach a verdict in the last scan. A route with an unavailable or inconclusive check remains unverified.</p>
      <div class="qp-case-table-wrap"><table class="qp-case-table"><caption>Exit codes keep confirmed flaws separate from testing failures</caption><thead><tr><th scope="col">Code</th><th scope="col">Meaning</th></tr></thead><tbody>
      <tr><th scope="row">0 / No active findings</th><td>No unaccepted confirmed violation or check fault. Use strict mode to require inconclusive checks to fail too.</td></tr>
      <tr><th scope="row">1 / Confirmed violation</th><td>A mechanically confirmed finding is not accepted in the baseline.</td></tr>
      <tr><th scope="row">2 / Configuration error</th><td>Usage or configuration failed before a scan produced a result.</td></tr>
      <tr><th scope="row">3 / Testing incomplete</th><td>A check errored or had no oracle. In strict mode, inconclusive checks also produce this code.</td></tr>
      </tbody></table></div>
      <p>JSON, Markdown, and SARIF share the same report model. SARIF includes checks without a verdict. Test-suite assertions check completeness as well as findings, and finding replay always uses strict mode.</p>
      <p>An ordered event bus feeds the console, reports, and other consumers. Late subscribers receive the earlier events first. The console is a presentation layer with a tested reducer, rather than a second security engine.</p>`,
  },
  {
    id: 'safety', label: 'Safety & AI boundary', title: 'The plan bounds what execution can do.',
    body: `<p>Safety gates run before HTTP requests. Targets must be loopback or explicitly allowed in local settings, and checked methods must be permitted by the plan. Writes require both a mutation-permitting plan and local runtime authorization.</p>
      <p>Redirects stay within the original origin. Writes are never retried, and choosing another target cannot widen the plan’s allowed references. The runner executes declared checks rather than improvising probes.</p>
      <p>The optional model compiler sees route context, existing checks, available oracles, and the fixed safety policy. It does not receive runtime settings or credentials. Proposed additions are schema-validated, cannot overwrite reviewed knowledge or widen safety, and are recorded for review before application.</p>
      <p>Applying the recorded proposal makes no second model call and refuses an outdated plan ID. Optional provider SDKs are loaded only on the model-compilation path. An architecture test enforces that scans cannot import them.</p>`,
  },
  {
    id: 'tradeoffs', label: 'Trade-offs', title: 'Prefer a clear boundary to a confident guess.',
    body: `<div class="qp-case-table-wrap"><table class="qp-case-table"><caption>Five decisions that make the results reviewable</caption><thead><tr><th scope="col">Decision</th><th scope="col">Why it was chosen</th></tr></thead><tbody>
      <tr><th scope="row">Compile, then replay</th><td>Security knowledge becomes a durable artifact; each scan does not need to reason with a model again.</td></tr>
      <tr><th scope="row">No invented checks</th><td>Discovering an endpoint does not prove its intended authorization rules.</td></tr>
      <tr><th scope="row">Byte equality for authorization</th><td>An exact witness match is mechanical evidence. A similar-looking response is not enough to confirm the flaw.</td></tr>
      <tr><th scope="row">State, not write status</th><td>A successful HTTP response can still leave the protected value unchanged.</td></tr>
      <tr><th scope="row">Keep incomplete outcomes visible</th><td>A pipeline fault or unimplemented oracle must not appear as a clean security result.</td></tr>
      </tbody></table></div>`,
  },
  {
    id: 'testing', label: 'Testing & limits', title: 'Validate the evidence. State the limits.',
    body: `<dl class="qp-case-stack"><div><dt>Language</dt><dd>TypeScript and ESM in a pnpm workspace, running on Node.js 20 or newer.</dd></div><div><dt>Contracts</dt><dd>Strict Zod schemas and the TypeScript compiler API for route discovery.</dd></div><div><dt>Execution</dt><dd>Native fetch with manual redirect handling, bounded retries, and timeouts.</dd></div><div><dt>Quality checks</dt><dd>Vitest, type checking, ESLint, and tsup builds across the packages.</dd></div></dl>
      <p>The supplied v0.1.1 thesis records 474 passing tests across 29 files. They cover contracts, safety gates, bindings, HTTP behavior, event replay, coverage, oracle outcomes, compiler proposals, console rendering, and dependency boundaries.</p>
      <p>The Juice Shop evaluation exercises real HTTP against an intentionally vulnerable local application: three confirmed findings and two passing negative controls. CI checks finding IDs, replay commands, completeness, and credential redaction, then reproduces the two read-only findings.</p>
      <p>The current scope is authorization, state mutation, and client-controlled data scoping. Browser-execution and out-of-band oracles are not implemented; checks that name them are unavailable. There is no crawler, automatic state restoration, or full role-matrix enforcement.</p>
      <p>Route discovery deliberately leaves some forms unsupported, including interpolated template paths and NestJS decorators. Injection, SSRF, session attacks, race conditions, and general business-logic abuse are outside this version’s scope. The thesis records real-provider validation for OpenAI, while Anthropic was tested against a local API stub.</p>`,
  },
];

export function mountTrinkerCaseStudy(container, options) {
  return mountProjectCaseStudy(container, options, {
    id: 'trinker-case', theme: 'trinker', title: 'TRINKER architecture and engineering', sections,
    note: 'Architecture notes edited from the supplied thesis, main@c8e68bd, v0.1.1, 30 September 2026. The test count and integration results describe that documented snapshot. The terminal above simulates the example locally; it does not run scans or contact a target.',
  });
}
