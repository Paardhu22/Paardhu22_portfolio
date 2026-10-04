// Interactive previews: 'triya' for the client suite, 'terminal' for TRINKER,
// 'seleno' for alignment, 'qpgen' for paper studio.
// Each project: { title, description?, details?, url?, year?, image?, previewImage?, imageAlt?, images? }
// previewImage is an optional full-size version of image. details appears in the expanded view.
// Images can be local, e.g. "assets/my-project.webp".
export const projects = [
  {
    title: 'Triya',
    preview: 'triya',
    description: 'Client work: a website, a property management web app, and an Android counterpart.',
    details: 'One client engagement across three products. The client manages accommodation for around 5,000 tenants, with property management, rent collections, invoices, and bulk WhatsApp reminders. Choose a product above to explore an illustrative interface and its engineering notes.',
  },
  {
    title: 'qp-gen',
    preview: 'qpgen',
    description: 'An AI-assisted workspace for building question papers.',
    details: 'AOS, the system behind qp-gen, turns source chapters into CBSE-aligned question papers. Teachers choose a template, review the blueprint, and refine the paper in an editor before exporting it.',
    image: 'assets/projects/qp-gen/previews/cover.webp',
    imageAlt: 'qp-gen landing page with the headline Papers made easier',
    explanation: [
      { title: 'Plan the structure first', body: 'A blueprint sets sections, marks, question types, and coverage before generation begins.' },
      { title: 'Build from a question pool', body: 'The real project generates a reusable pool from source chapters, saves it to the bank, and assembles the paper from it.' },
      { title: 'Keep the teacher in control', body: 'Review questions in the editor, make changes, reuse saved work, and export the final paper to PDF or Word.' },
    ],
    images: [
      { src: 'assets/projects/qp-gen/previews/landing.webp', thumbnail: 'assets/projects/qp-gen/previews/landing-thumb.webp', label: 'Landing page', alt: 'qp-gen landing page with the headline Papers made easier' },
      { src: 'assets/projects/qp-gen/previews/welcome.webp', thumbnail: 'assets/projects/qp-gen/previews/welcome-thumb.webp', label: 'Welcome', alt: 'HSAT welcome screen with login and sign-up options' },
      { src: 'assets/projects/qp-gen/previews/dashboard.webp', thumbnail: 'assets/projects/qp-gen/previews/dashboard-thumb.webp', label: 'Dashboard', alt: 'AI assistant dashboard for describing and generating a question paper' },
      { src: 'assets/projects/qp-gen/previews/question-bank.webp', thumbnail: 'assets/projects/qp-gen/previews/question-bank-thumb.webp', label: 'Question bank', alt: 'Question bank with subject, class, type, difficulty and Bloom filters' },
      { src: 'assets/projects/qp-gen/previews/paper-editor.webp', thumbnail: 'assets/projects/qp-gen/previews/paper-editor-thumb.webp', label: 'Paper editor', alt: 'Question paper editor with document outline, paper studio and export controls' },
      { src: 'assets/projects/qp-gen/previews/saved-papers.webp', thumbnail: 'assets/projects/qp-gen/previews/saved-papers-thumb.webp', label: 'Saved papers', alt: 'Saved papers and recent drafts in the paper library' },
      { src: 'assets/projects/qp-gen/previews/templates.webp', thumbnail: 'assets/projects/qp-gen/previews/templates-thumb.webp', label: 'Templates', alt: 'Template editor with question slots and a live paper preview' },
    ],
  },
  {
    title: 'TRINKER',
    preview: 'terminal',
    description: 'Security checks you can review, run, and replay.',
    details: 'Deterministic security testing for HTTP APIs. TRINKER compiles security knowledge into a reviewed plan, then replays it without model calls during a scan. Findings carry evidence and a matching replay command. The terminal above simulates the documented Juice Shop example.',
    url: 'https://github.com/Paardhu22/trinker',
    linkLabel: 'View source',
    explanation: [
      { title: 'Review the plan', body: 'Routes, identities, and security rules live in a readable plan. Credentials stay in a separate runtime file.' },
      { title: 'Check the evidence', body: 'A finding needs evidence: matching response bodies, a changed value, or a broken response rule. A 200 status alone proves nothing.' },
      { title: 'Replay the result', body: 'Re-run the check behind a finding. Export JSON, Markdown, or SARIF for review and CI. Inconclusive checks stay visible.' },
    ],
  },
  {
    title: 'SELENO',
    preview: 'seleno',
    description: 'Aligning Chandrayaan-2 imagery with lunar reference maps.',
    details: 'A lunar image registration tool built for Smart India Hackathon problem SIH26166. SELENO aligns OHRC, TMC-2, and IIRS imagery with reference maps, delivering registered images, match points, and held-out error measurements. Sub-source-pixel accuracy is the goal; results keep missed acceptance gates visible.',
    explanation: [
      { title: 'Different views, shared ground', body: 'Spacecraft geometry places the image. Multiple matchers handle changes in lighting, scale, and viewpoint.' },
      { title: 'Every correction earns its place', body: 'Native-resolution matching refines the fit. Terrain and local correction fields stay only when validation improves.' },
      { title: 'Keep the uncertainty visible', body: 'Sealed check points measure the error. Real Chandrayaan-2 validation pairs still return warnings, with reasons in the report.' },
    ],
    images: [
      { src: 'assets/projects/seleno/previews/lunar-overview.webp', thumbnail: 'assets/projects/seleno/previews/lunar-overview-thumb.webp', label: 'Lunar reference overview', alt: 'Seleno registration interface showing a wide lunar reference map' },
      { src: 'assets/projects/seleno/previews/source-strip.webp', thumbnail: 'assets/projects/seleno/previews/source-strip-thumb.webp', label: 'Source image strip', alt: 'Seleno source image viewer showing a narrow Chandrayaan-2 strip' },
      { src: 'assets/projects/seleno/previews/quality-metrics.webp', thumbnail: 'assets/projects/seleno/previews/quality-metrics-thumb.webp', label: 'Quality and accuracy metrics', alt: 'Seleno quality panel with registration error, inlier and coverage measurements' },
      { src: 'assets/projects/seleno/previews/registration-report.webp', thumbnail: 'assets/projects/seleno/previews/registration-report-thumb.webp', label: 'Registration report', alt: 'Seleno report detailing the registration method, model and evaluation' },
      { src: 'assets/projects/seleno/previews/error-distribution.webp', thumbnail: 'assets/projects/seleno/previews/error-distribution-thumb.webp', label: 'Error distribution', alt: 'Seleno plot showing held-out registration error across the image' },
      { src: 'assets/projects/seleno/previews/registered-overlay.webp', thumbnail: 'assets/projects/seleno/previews/registered-overlay-thumb.webp', label: 'Registered overlay', alt: 'Seleno image viewer showing the registered source and lunar reference' },
      { src: 'assets/projects/seleno/previews/detail-comparison.webp', thumbnail: 'assets/projects/seleno/previews/detail-comparison-thumb.webp', label: 'Terrain detail comparison', alt: 'Seleno side-by-side terrain detail views for examining alignment' },
      { src: 'assets/projects/seleno/previews/match-points.webp', thumbnail: 'assets/projects/seleno/previews/match-points-thumb.webp', label: 'Matched terrain points', alt: 'Seleno source and reference views joined by green match-point lines' },
    ],
  },
];
