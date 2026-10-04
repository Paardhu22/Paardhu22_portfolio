import { mountProjectCaseStudy } from './project-case-study.js';

// An edited reader's guide to the architecture thesis supplied by the project owner.
// Technical scope: main@d6e7a9d, 15 September 2026. This is not a live API client.
const sections = [
  {
    id: 'purpose', label: 'Why it exists', title: 'A paper starts with a teaching decision.',
    body: `<p>AOS is the system behind qp-gen. It turns uploaded chapters or shared library textbooks into question papers aligned with the configured CBSE rules. The teacher chooses the structure, reviews the questions, and exports the finished document.</p>
      <p>The challenge is more than writing plausible questions. Sections, total marks, question types, chapter coverage, difficulty, and internal OR choices must agree. The system makes those requirements explicit before any questions are produced.</p>`,
  },
  {
    id: 'architecture', label: 'Two layers', title: 'Decide the structure. Then produce the questions.',
    body: `<blockquote>What a paper must contain and how its questions are produced are two separate problems.</blockquote>
      <p>The blueprint layer compiles a template into fixed question slots. Python determines the counts, sections, marks, types, and generator for each slot. A prose brief can use a model to propose a design, but Python validates it before generation.</p>
      <p>The production layer writes a reusable question pool, saves it to the bank, and selects questions to fill those slots. A solver handles structural constraints; one model review checks semantic quality. The review can change the selection only within the offered candidates.</p>
      <figure class="qp-case-flow"><ol><li><span>01 / Blueprint</span><strong>Define the slots</strong><small>Sections, types, marks</small></li><li><span>02 / Production</span><strong>Build the pool</strong><small>Chapter-grounded questions</small></li><li><span>03 / Assembly</span><strong>Select and review</strong><small>Validated paper → editor</small></li></ol><figcaption>The blueprint is the contract. Production fills it.</figcaption></figure>`,
  },
  {
    id: 'workflow', label: 'The workflow', title: 'From source material to a finished paper.',
    body: `<ol class="qp-case-steps"><li><strong>Choose a starting point.</strong> Use a CBSE sample-paper template, a class starter, a saved template, or describe a paper in your own words.</li><li><strong>Prepare the sources.</strong> Upload documents or select library chapters. Text extraction, scanned-page OCR, and chapter detection prepare the material. Generation checks that the sources are ready.</li><li><strong>Review the blueprint.</strong> Edit the slots and decide which questions should be generated or reused from the bank.</li><li><strong>Produce and bank the pool.</strong> Generate by chapter and question shape, validate the results, and save the whole pool before assembling the paper.</li><li><strong>Assemble, refine, export.</strong> Questions arrive in order. The teacher reviews the paper in the editor, makes changes, and exports PDF or Word.</li></ol>`,
  },
  {
    id: 'blueprints', label: 'Templates & blueprints', title: 'Every starting point is editable.',
    body: `<p>The Blueprint Builder has three steps: Template, Sources, and Questions. Once a template is chosen, the teacher can move between them and edit individual slots. A visible count and marks total keeps the structure understandable.</p>
      <p>Saved templates can remain instruction-driven, adapting to the next chapter, or become pinned when a slot is edited. A pinned blueprint is authoritative, so a later interpretation of the brief cannot discard the teacher’s changes.</p>
      <p>The type catalogue separates a question’s exact identity from its runtime shape. Roughly 160 named types map to 22 shapes. The exact type travels from blueprint to pool, bank, and editor; HOTS and competency are attributes of a slot.</p>
      <p>Built-in CBSE routing is configured for Science and Social Science in Classes 1–10, and Mathematics, English, Hindi, and Telugu in Class 10. Unsupported subject and class combinations are rejected rather than silently assigned an invented structure.</p>`,
  },
  {
    id: 'pool', label: 'The question pool', title: 'Generate once. Reuse what was learned.',
    body: `<p>The earlier design made a retrieval and model call for every question slot. The pool design supplies full chapter context to parallel batches shaped by the blueprint. Its target is one question per generated slot, plus OR alternatives, requested set spares, and a 15% margin for rejected or duplicate results. Unused valid questions are banked.</p>
      <p>Structured questions carry a stimulus and marked parts. Those parts must add up before the question is accepted. English Reading, Grammar, and Writing use separate generators that never receive the textbook; Literature stays chapter-grounded.</p>
      <p>Assembly fills the most constrained slots first, then reserves separate alternatives for review. An invalid review is rejected as a whole and the deterministic selection is retained. Building from the bank skips pool generation; replacing one question tries the bank before generating a new item.</p>
      <p>Optional Sets B and C reuse the same pool. MCQs remain unchanged, while eligible questions can be replaced and shuffled within their sections. Every set keeps the total marks and section structure; variants are best-effort, and failure leaves Set A intact.</p>`,
  },
  {
    id: 'streaming', label: 'Live streaming', title: 'A dropped connection should not lose the run.',
    body: `<p>The backend records generation events separately from delivering them. A Server-Sent Events stream follows the recorded run, sending its plan, progress, saved-pool status, questions, sets, and final result to the editor.</p>
      <p>If the connection drops, the client reconnects with the run ID and its last cursor. Missed events are replayed before the client resumes following live output. Keepalive comments prevent quiet model stages from looking like a dead connection.</p>
      <aside class="qp-case-note"><strong>The boundary is explicit.</strong> A run survives a client disconnect, but not a worker restart. A stale producer is marked abandoned. Surviving server restarts would require a durable task queue.</aside>`,
  },
  {
    id: 'editor', label: 'Teacher controls', title: 'The teacher makes the final call.',
    body: `<p>The TipTap editor handles A4 pagination, maths, school headers, images, and OR groups. Questions can enter a review tray before insertion or arrive directly in the paper. Set tabs keep the generated versions separate.</p>
      <p>The teacher can replace a question, change its type or marks, reuse the bank, and add a figure when it is needed. Charts use teacher-checked data and deterministic SVG rendering. Pictures are requested individually, rather than produced speculatively during generation.</p>
      <p>Drafts are saved locally in IndexedDB and synced to the server. PDF and DOCX export run in the browser through one shared export path. The dashboard assistant gathers a paper specification and hands it to the generation pipeline; it does not write the paper’s questions itself.</p>`,
  },
  {
    id: 'platform', label: 'Schools & data', title: 'Built for more than one teacher or school.',
    body: `<p>Cognito handles sign-in, and the backend validates the token and approval status. A teacher can belong to multiple schools and switch the active organization. School invitations, roles, logos, and brand kits give each paper the right institutional context.</p>
      <p>Monthly organization token limits gate spending operations. Usage is recorded against the billing organization, with school and platform administration views. Email-domain matching suggests a school; it does not grant access.</p>
      <p>PostgreSQL stores papers, question pools, drafts, templates, and recorded runs. Object storage holds uploads and media. Only permanent media paths are stored; fresh signed URLs are created when needed. Deleted papers enter a 30-day recycle bin, while draft and run retention are handled by a daily cleanup.</p>`,
  },
  {
    id: 'tradeoffs', label: 'Trade-offs', title: 'Spend complexity where correctness needs it.',
    body: `<div class="qp-case-table-wrap"><table class="qp-case-table"><caption>Five decisions that shape the system</caption><thead><tr><th scope="col">Decision</th><th scope="col">Why it was chosen</th></tr></thead><tbody>
      <tr><th scope="row">Solver, then model review</th><td>Code guarantees counts and marks. The model reviews whether questions test the same idea in different words.</td></tr>
      <tr><th scope="row">A sized pool, with spares</th><td>The blueprint defines demand. A small margin covers rejected results, and valid leftovers remain reusable.</td></tr>
      <tr><th scope="row">Figures on demand</th><td>Images are created only when the teacher requests them. Charts render from checked data instead of guessed values.</td></tr>
      <tr><th scope="row">Recorded runs, DB polling</th><td>Reconnection works without a broker. Worker-restart recovery is kept as an explicit limitation.</td></tr>
      <tr><th scope="row">Local documents, server drafts</th><td>IndexedDB keeps edits close to the editor, while the server copy supports continuing work on another device.</td></tr>
      </tbody></table></div>`,
  },
  {
    id: 'stack', label: 'Stack & testing', title: 'A practical stack, with tested contracts.',
    body: `<dl class="qp-case-stack"><div><dt>Interface</dt><dd>Next.js 16, React 19, Tailwind CSS, TipTap, and KaTeX.</dd></div><div><dt>Application</dt><dd>Django 5 and Django REST Framework. The backend owns model access and credentials.</dd></div><div><dt>Data & identity</dt><dd>PostgreSQL with pgvector, AWS S3, and Cognito. SQLite supports development and tests.</dd></div><div><dt>State & delivery</dt><dd>Zustand, TanStack Query, IndexedDB, and recorded Server-Sent Events.</dd></div><div><dt>AI stages</dt><dd>Separate model settings for pool generation, review, chat, OCR, figures, and answer scripts.</dd></div></dl>
      <p>Backend tests cover blueprint invariants, pool normalization, exact marks, OR choices, duplicate prevention, set variants, document handling, durable runs, and access rules. The question catalogue is checked against its generated frontend module.</p>
      <p>Frontend checks include TypeScript, linting, and self-check scripts for question nodes, drafts, set content, and pagination. A browser harness exercises A4 reflow, while the remaining visual and interaction checks have a manual checklist.</p>`,
  },
];

export function mountQpgenCaseStudy(container, options) {
  return mountProjectCaseStudy(container, options, {
    id: 'qp-case', theme: 'qpgen', title: 'qp-gen architecture and engineering', sections,
    note: 'Architecture notes edited from the supplied thesis, main@d6e7a9d, 15 September 2026. The studio above uses local sample questions; the architecture described here belongs to the full application.',
  });
}
