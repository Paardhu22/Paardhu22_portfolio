import { checks, demoCommands } from './trinker-demo.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function createTerminalCover() {
  const cover = element('span', 'trinker-cover');
  cover.setAttribute('aria-hidden', 'true');
  const chrome = element('span', 'trinker-cover-chrome');
  chrome.append(element('span', 'trinker-window-mark', '•••'), element('span', '', 'trinker'));
  const code = element('span', 'trinker-cover-code');
  code.append(element('span', 'trinker-cover-command', '$ trinker run'),
    element('span', 'trinker-cover-muted', 'reviewed plan → 5 checks'),
    element('span', 'trinker-cover-finding', '! TRK-0001 · high'),
    element('span', 'trinker-cover-muted', 'evidence you can replay'));
  cover.append(chrome, code, element('span', 'trinker-cover-label', 'Interactive terminal'));
  return cover;
}

export function mountTrinkerTerminal(host, reducedMotion) {
  const root = element('section', 'trinker-terminal');
  root.setAttribute('aria-label', 'TRINKER interactive terminal demo');
  const chrome = element('div', 'trinker-chrome');
  chrome.append(element('span', 'trinker-window-mark', '•••'), element('span', 'trinker-window-title', 'trinker'), element('span', 'trinker-demo-label', 'browser demo'));
  const metrics = element('div', 'trinker-metrics');
  const phase = element('span', 'trinker-phase', 'ready');
  const progressText = element('span', '', '0 / 5 checks');
  metrics.append(phase, progressText, element('span', '', '0 AI tokens'));
  const progress = element('div', 'trinker-progress');
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Demo checks completed');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '5');
  const progressFill = element('span', 'trinker-progress-fill');
  progress.append(progressFill);
  const output = element('div', 'trinker-output');
  output.setAttribute('role', 'log');
  output.setAttribute('aria-label', 'Simulated terminal output');
  output.setAttribute('aria-live', 'off');
  output.tabIndex = 0;
  const form = element('form', 'trinker-prompt');
  const promptMark = element('span', 'trinker-prompt-mark', '❯');
  promptMark.setAttribute('aria-hidden', 'true');
  const input = element('input', 'trinker-input');
  input.type = 'text';
  input.setAttribute('aria-label', 'Terminal command');
  input.setAttribute('aria-describedby', 'trinker-input-hint');
  input.placeholder = 'Try trinker run';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('autocorrect', 'off');
  input.maxLength = 180;
  input.enterKeyHint = 'go';
  const submit = element('button', 'trinker-submit', '↵');
  submit.type = 'submit';
  submit.setAttribute('aria-label', 'Run command');
  form.append(promptMark, input, submit);
  const footer = element('div', 'trinker-terminal-footer');
  const hint = element('span', '', 'Simulated results. No network requests.');
  hint.id = 'trinker-input-hint';
  const cancel = element('button', 'trinker-cancel', 'Stop');
  cancel.type = 'button';
  cancel.hidden = true;
  cancel.setAttribute('aria-label', 'Stop demo command');
  footer.append(hint, cancel);
  const shortcuts = element('div', 'trinker-shortcuts');
  shortcuts.setAttribute('aria-label', 'Try a demo command');
  for (const [label, command] of [['Run checks', 'trinker run'], ['Inspect finding', 'trinker verify TRK-0001'], ['View report', 'trinker report --markdown'], ['Help', 'help'], ['Reset', 'reset']]) {
    const button = element('button', '', label);
    button.type = 'button';
    button.dataset.command = command;
    button.addEventListener('click', () => execute(command));
    shortcuts.append(button);
  }
  const announcement = element('span', 'sr-only');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  root.append(chrome, metrics, progress, output, form, footer, shortcuts, announcement);
  host.replaceChildren(root);
  let history = [];
  let historyIndex = 0;
  let draft = '';
  let runId = 0;
  let disposed = false;
  let busy = false;
  let hasRun = false;
  let mutated = false;
  let results = [];
  const waits = new Map();

  function setProgress(count) {
    progressFill.style.transform = `scaleX(${count / 5})`;
    progressText.textContent = `${count} / 5 checks`;
    progress.setAttribute('aria-valuenow', String(count));
  }

  function setBusy(value) {
    busy = value;
    input.readOnly = value;
    submit.disabled = value;
    cancel.hidden = !value;
    root.classList.toggle('is-running', value);
    root.setAttribute('aria-busy', String(value));
    shortcuts.querySelectorAll('button').forEach(button => { button.disabled = value; });
    if (!value) input.placeholder = 'Type a command or help';
  }

  function settleWaits(value) {
    for (const [timer, resolve] of waits) {
      clearTimeout(timer);
      resolve(value);
    }
    waits.clear();
  }

  function pause(ms, token) {
    if (disposed || token !== runId) return Promise.resolve(false);
    if (reducedMotion.matches || document.hidden) return Promise.resolve(true);
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        waits.delete(timer);
        resolve(!disposed && token === runId);
      }, ms);
      waits.set(timer, resolve);
    });
  }

  function line(text, kind = 'text') {
    if (disposed) return;
    const follow = output.scrollHeight - output.scrollTop - output.clientHeight < 50;
    const row = element('div', `trinker-line trinker-line-${kind}`, text);
    output.append(row);
    // Bound a long session without losing the current command's output.
    while (output.children.length > 180) output.firstElementChild.remove();
    if (!reducedMotion.matches && !document.hidden) row.animate([
      { opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' },
    ], { duration: 200, easing: 'ease-out' });
    if (follow) output.scrollTop = output.scrollHeight;
    return row;
  }

  function welcome() {
    line('TRINKER / evidence, not guesses.', 'title');
    line('Explore a reviewed OWASP Juice Shop example.', 'muted');
    line('5 checks · 3 oracles · a fresh demo fixture', 'muted');
    line('Type trinker run, or use Run checks below.', 'accent');
  }

  function stop() {
    if (!busy) return;
    runId++;
    settleWaits(false);
    setBusy(false);
    phase.textContent = 'stopped';
    line('^C · demo stopped. No new result was committed.', 'muted');
    announcement.textContent = 'Demo stopped.';
  }

  function report(format) {
    if (!hasRun) {
      line('No report yet. Start with trinker run.', 'muted');
      return;
    }
    const failed = results.filter(result => result.status === 'failed');
    const summary = { simulated: true, planned: 5, passed: 2, confirmed: failed.length, inconclusive: results.filter(result => result.status === 'inconclusive').length, runtimeLlmTokens: 0 };
    if (format === 'json') {
      line(JSON.stringify({ ...summary, findings: failed.map(({ id, title, oracle }) => ({ id, title, oracle, severity: 'high' })) }, null, 2), 'code');
    } else if (format === 'sarif') {
      line(JSON.stringify({ version: '2.1.0', runs: [{ tool: { driver: { name: 'trinker' } }, properties: summary, results: failed.map(check => ({ ruleId: check.id, level: 'error', message: { text: check.title } })) }] }, null, 2), 'code');
    } else {
      line('# TRINKER · simulated Markdown report', 'title');
      line(`${summary.inconclusive ? 'PARTIAL' : 'COMPLETE'} · ${failed.length} confirmed · 2 passed · ${summary.inconclusive} inconclusive`, 'accent');
      failed.forEach(check => line(`${check.id} [high] ${check.title}`, 'finding'));
      line('Evidence is redacted. Runtime AI tokens: 0.', 'muted');
      line('Export formats in the real CLI: JSON, Markdown, SARIF.', 'muted');
    }
  }

  async function runChecks(token) {
    phase.textContent = 'validating';
    setProgress(0);
    line('Demo target: local OWASP Juice Shop fixture', 'muted');
    line('✓ reviewed plan · loopback target · explicit write gates', 'passed');
    line('Replaying fixed example events. No model calls.', 'muted');
    if (!await pause(420, token)) return;
    const outcomes = [];
    for (const [index, check] of checks.entries()) {
      phase.textContent = 'checking';
      line(`${String(index + 1).padStart(2, '0')} / 05  ${check.name}`, 'accent');
      line(check.activity, 'muted');
      if (!await pause(460, token)) return;
      const status = check.id === 'TRK-0002' && mutated ? 'inconclusive' : check.status;
      outcomes.push({ ...check, status });
      if (status === 'failed') line(`! ${check.id} [high] ${check.title}`, 'finding');
      else if (status === 'inconclusive') line('◐ Inconclusive: quantity was already changed by the first demo run.', 'warning');
      else line(`✓ ${check.name} · passed (negative control)`, 'passed');
      setProgress(index + 1);
      if (!await pause(210, token)) return;
    }
    results = outcomes;
    hasRun = true;
    mutated = true;
    const failed = results.filter(check => check.status === 'failed').length;
    const inconclusive = results.some(check => check.status === 'inconclusive');
    phase.textContent = inconclusive ? 'partial' : 'complete';
    line(`${inconclusive ? 'PARTIAL' : 'COMPLETE'} · ${failed} confirmed · 2 passed · ${inconclusive ? 1 : 0} inconclusive`, 'title');
    line('Exit 1: violations confirmed. Runtime AI tokens: 0.', 'muted');
    if (inconclusive) line('Reset restores the fresh demo fixture for another full run.', 'muted');
    else line('Next: trinker verify TRK-0001 to inspect the evidence.', 'accent');
    announcement.textContent = `Demo completed. ${failed} simulated findings, 2 passed checks${inconclusive ? ', 1 inconclusive check' : ''}.`;
  }

  async function verify(id, token) {
    if (!hasRun) { line('Run the example first: trinker run.', 'muted'); return; }
    const check = results.find(check => check.id === id);
    if (!check) { line('Choose TRK-0001, TRK-0002, or TRK-0003.', 'warning'); return; }
    phase.textContent = 'replaying';
    line(`Replay ${id} · ${check.oracle}`, 'accent');
    line(check.route, 'code');
    if (!await pause(500, token)) return;
    if (id === 'TRK-0002') {
      line('◐ Could not be re-tested · exit 3', 'warning');
      line('The first run already changed the quantity. An unchanged value on replay proves neither a rejected write nor a fresh violation.', 'muted');
      line('Reset the demo fixture before testing that write again.', 'muted');
    } else {
      line(`! ${id} reproduced · simulated evidence · exit 1`, 'finding');
      line(check.evidence, 'text');
      line(`Fix: ${check.fix}`, 'passed');
      line('Recorded authorisation headers: [REDACTED]', 'muted');
    }
    phase.textContent = 'ready';
    announcement.textContent = id === 'TRK-0002' ? 'Replay is inconclusive because the first run changed the fixture.' : `${id} demo replay completed. Evidence and remediation are in the terminal output.`;
  }

  async function execute(raw) {
    if (busy || disposed) return;
    const command = raw.trim().replace(/\s+/g, ' ');
    if (!command) return;
    history.push(command);
    if (history.length > 50) history.shift();
    historyIndex = history.length;
    draft = '';
    input.value = '';
    line(`❯ ${command}`, 'command');
    output.scrollTop = output.scrollHeight;
    const token = ++runId;
    setBusy(true);
    try {
      const aliases = { run: 'trinker run', scan: 'trinker run', verify: 'trinker verify TRK-0001', report: 'trinker report --markdown' };
      const normalized = Object.hasOwn(aliases, command) ? aliases[command] : command;
      if (normalized === 'trinker run') await runChecks(token);
      else if (/^trinker verify\s+\S+$/i.test(normalized)) await verify(normalized.split(' ')[2].toUpperCase(), token);
      else if (/^trinker report(?: --(?:markdown|json|sarif))?$/.test(normalized)) report(normalized.includes('--json') ? 'json' : normalized.includes('--sarif') ? 'sarif' : 'markdown');
      else if (normalized === 'help' || normalized === 'trinker --help' || normalized === 'trinker') {
        line('Commands you can try', 'title');
        line('trinker run                 replay the example plan\ntrinker verify TRK-0001      inspect and replay a finding\ntrinker coverage            planned vs verified coverage\ntrinker report --markdown   show the example report\ntrinker compile             understand the compilation step\ntrinker init                understand runtime setup', 'code');
        line('Preview helpers: plan, about, clear, reset, whoami.', 'muted');
        line('↑ ↓ history · Tab completes · Ctrl+C stops · Ctrl+L clears', 'muted');
      } else if (normalized === 'trinker compile') {
        line('✓ reviewed example plan retained', 'passed');
        line('5 manually declared routes · 5 authored checks preserved', 'code');
        line('A new compile extracts routes with no checks. You author the security rules; recompilation preserves them.', 'muted');
        line('The real CLI also accepts OpenAPI and recorded HAR traffic.', 'muted');
      } else if (normalized === 'trinker init') {
        line('Runtime setup keeps targets, credentials, and fixtures separate from the committed plan.', 'text');
        line('Real CLI output: .trinker/runtime.json. This browser demo writes no files.', 'muted');
      } else if (normalized === 'trinker coverage') {
        line('Planned routes: 4 / 5', 'accent');
        line(`Verified routes: ${hasRun ? (results.some(check => check.status === 'inconclusive') ? '3' : '4') : '0'} / 5`, 'code');
        line('The owner-read helper route has no standalone check. A route counts as verified only when all its checks reach a verdict.', 'muted');
      } else if (normalized === 'plan') {
        line('Reviewed plan / Juice Shop example', 'title');
        checks.forEach(check => line(`${check.name}\n  ${check.oracle} · ${check.route}`, 'code'));
        line('Writes require authorisation in both the plan and runtime config.', 'muted');
      } else if (normalized === 'about') {
        line('Compile security knowledge once. Replay the checks on every scan.', 'title');
        line('Three deterministic oracles compare access, changed state, and response relations. Uncertain evidence stays inconclusive.', 'text');
        line('Only optional compile --llm uses AI. A scan uses zero runtime LLM tokens.', 'muted');
      } else if (normalized === 'clear') output.replaceChildren();
      else if (normalized === 'reset') {
        hasRun = false;
        mutated = false;
        results = [];
        setProgress(0);
        phase.textContent = 'ready';
        output.replaceChildren();
        welcome();
        announcement.textContent = 'Demo reset to a fresh fixture.';
      } else if (normalized === 'whoami') line('A curious human. That is a good place to start. Try trinker run.', 'accent');
      else if (/^sudo\b/.test(normalized)) line('No sudo needed here. Try help for the demo commands.', 'muted');
      else line(`Unknown demo command: ${command}\nTry help or trinker run. Only the listed commands are available in this preview.`, 'warning');
    } finally {
      if (!disposed && token === runId) setBusy(false);
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    execute(input.value);
  });
  cancel.addEventListener('click', stop);
  input.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && busy) {
      event.preventDefault();
      stop();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      output.replaceChildren();
      return;
    }
    if (busy) return;
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (!history.length) return;
      if (historyIndex === history.length) draft = input.value;
      historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
      input.value = historyIndex === history.length ? draft : history[historyIndex];
    } else if (event.key === 'Tab' && !event.shiftKey && input.value.trim()) {
      const matches = demoCommands.filter(command => command.startsWith(input.value.trim()));
      if (matches.length === 1) { event.preventDefault(); input.value = matches[0]; }
      else if (matches.length > 1) {
        let prefix = matches[0];
        while (!matches.every(command => command.startsWith(prefix))) prefix = prefix.slice(0, -1);
        if (prefix.length > input.value.trim().length) { event.preventDefault(); input.value = prefix; }
      }
    }
  });
  const onMotionChange = event => {
    if (!event.matches) return;
    root.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    settleWaits(true);
  };
  reducedMotion.addEventListener('change', onMotionChange);
  setProgress(0);
  welcome();
  return {
    dispose() {
      disposed = true;
      runId++;
      settleWaits(false);
      root.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      reducedMotion.removeEventListener('change', onMotionChange);
    },
  };
}
