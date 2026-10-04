// A working, local paper-studio preview. These curated fixtures are not AI output.
const samples = {
  science: {
    subject: 'Science', chapter: 'Light',
    questions: [
      ['State the relation between the angle of incidence and the angle of reflection.', 'Define refractive index in terms of the speed of light in two media.'],
      ['Define the principal focus of a concave mirror. Draw a labelled ray diagram.', 'Explain why a pencil partly immersed in water appears bent. Draw a ray diagram.'],
      ['An object is placed 20 cm in front of a concave mirror of focal length 15 cm. Calculate the image position and magnification. State the nature of the image.', 'An object is placed 30 cm in front of a concave mirror of focal length 10 cm. Calculate the image position and magnification. State the nature of the image.'],
      ['An object is placed 15 cm from a convex lens of focal length 10 cm. Find the image distance and magnification. Describe the image, draw a ray diagram, and explain what changes when the object is moved to the focal point.', 'An object is placed 40 cm from a convex lens of focal length 20 cm. Find the image distance and magnification. Describe the image, draw a ray diagram, and explain what changes when the object is moved inside the focal length.'],
    ],
  },
  maths: {
    subject: 'Mathematics', chapter: 'Quadratic equations',
    questions: [
      ['Write the standard form of a quadratic equation and state the condition on its leading coefficient.', 'Define the discriminant of a quadratic equation.'],
      ['Solve x² − 5x + 6 = 0 by factorisation. Show your working.', 'Solve x² − 7x + 12 = 0 by factorisation. Show your working.'],
      ['Find the discriminant of 2x² − 4x + 3 = 0. Use it to describe the nature of the roots. Explain how the discriminant distinguishes all three root cases.', 'Find the discriminant of 3x² − 6x + 3 = 0. Use it to describe the nature of the roots. Explain how the discriminant distinguishes all three root cases.'],
      ['A rectangle has area 40 cm². Its length is 3 cm greater than its width. Form a quadratic equation, solve it, and find both dimensions. Explain why one algebraic root cannot represent a width.', 'A rectangle has area 48 cm². Its length is 2 cm greater than its width. Form a quadratic equation, solve it, and find both dimensions. Explain why one algebraic root cannot represent a width.'],
    ],
  },
};
const plans = { 12: [1,2,4,5], 20: [2,3,5,10] };

export function createQpgenCover() {
  const cover = document.createElement('span');
  cover.className = 'qp-cover';
  cover.setAttribute('aria-hidden', 'true');
  cover.innerHTML = `
    <span class="qp-cover-label">qp-gen</span>
    <span class="qp-cover-copy">Question paper<br/>generator<span>.</span></span>
    <span class="qp-cover-process">Plan <span>→</span> Build <span>→</span> Refine</span>
    <span class="qp-cover-pages">
      <span class="qp-cover-sheet"></span>
      <svg class="qp-cover-paper" viewBox="0 0 90 122" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="qp-cover-paper-ground" x=".5" y=".5" width="89" height="121" rx="4"/>
        <path class="qp-cover-paper-accent" d="M33 16h24"/>
        <path class="qp-cover-paper-rule" d="M23 22h44M11 31h68M11 109h68"/>
        <g class="qp-cover-question" style="--question:0"><circle cx="13" cy="43" r="1.5"/><path d="M21 43h45M21 49h33M73 43h5"/></g>
        <g class="qp-cover-question" style="--question:1"><circle cx="13" cy="60" r="1.5"/><path d="M21 60h38M21 66h43M73 60h5"/></g>
        <g class="qp-cover-question" style="--question:2"><circle cx="13" cy="77" r="1.5"/><path d="M21 77h45M21 83h28M73 77h5"/></g>
        <g class="qp-cover-question" style="--question:3"><circle cx="13" cy="94" r="1.5"/><path d="M21 94h34M21 100h43M73 94h5"/></g>
      </svg>
    </span>`;
  return cover;
}

export function mountQpgenStudio(container, reducedMotion) {
  const lifetime = new AbortController();
  const listen = (target,type,handler) => target.addEventListener(type,handler,{signal:lifetime.signal});
  const studio = document.createElement('section');
  studio.className = 'qp-studio';
  studio.setAttribute('aria-label','Interactive qp-gen paper studio');
  studio.innerHTML = `
    <div class="qp-studio-heading"><div><span class="qp-eyebrow">qp-gen / paper studio</span><h3>Question paper generator.</h3><p>Set the blueprint, generate questions, and edit the paper.</p></div><span class="qp-demo-tag">Interactive preview</span></div>
    <div class="qp-workspace">
      <div class="qp-controls">
        <div class="qp-control-heading"><span>01</span><h4>Start with a plan</h4></div>
        <label class="qp-field">Paper title<input class="qp-title-input" value="Unit test" maxlength="80" autocomplete="off"/></label>
        <div class="qp-field"><span>Subject</span><div class="qp-subjects" role="group" aria-label="Choose a subject"><button type="button" data-subject="science" aria-pressed="true">Science</button><button type="button" data-subject="maths" aria-pressed="false">Mathematics</button></div></div>
        <div class="qp-topic"><span>Class 10</span><span class="qp-chapter">Light</span></div>
        <label class="qp-field">Sample size<select class="qp-size"><option value="12">12 marks · 4 questions</option><option value="20">20 marks · 4 questions</option></select></label>
        <div class="qp-blueprint"><span class="qp-eyebrow">Question blueprint</span><div class="qp-plan-slots"></div><p>Sections and marks are planned before questions are assembled.</p></div>
        <button type="button" class="qp-build"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14"/></svg><span>Build sample paper</span></button>
        <div class="qp-process" role="group" aria-label="Paper progress"><span data-phase="plan">Plan</span><span data-phase="build">Build</span><span data-phase="refine">Refine</span></div>
        <p class="qp-build-status" role="status" aria-live="polite">Your blueprint is ready.</p>
        <button type="button" class="qp-reset" disabled>Reset demo</button>
      </div>
      <div class="qp-paper-desk">
        <div class="qp-paper-toolbar"><span><i></i>Live paper preview</span><div class="qp-paper-actions"><button type="button" class="qp-quick-build" hidden>Pause</button><button type="button" class="qp-download" disabled>Download .txt <span aria-hidden="true">↗</span></button></div></div>
        <article class="qp-paper" aria-label="Editable sample question paper">
          <div class="qp-paper-topline">CLASS X <span>Practice paper</span></div>
          <h4 class="qp-paper-title">Unit test</h4><p class="qp-paper-subject">Science · Light</p>
          <div class="qp-paper-meta"><span>Time: <span class="qp-duration">30 minutes</span></span><span>Maximum marks: <strong class="qp-total">12</strong></span></div>
          <p class="qp-instructions">Answer all questions. Show your working where needed.</p>
          <div class="qp-paper-questions"><div class="qp-paper-placeholder"><svg viewBox="0 0 32 40" aria-hidden="true"><path d="M5 2h15l7 7v29H5zM20 2v8h7M10 18h12M10 24h12M10 30h8"/></svg><h5>Your next paper starts here.</h5><p>Choose a subject and build a sample.<br/>Then try editing a question or its marks.</p><span></span><span></span><span></span></div></div>
          <p class="qp-paper-foot">qp-gen · Portfolio sample</p>
        </article>
        <p class="qp-edit-hint">The paper assembles here, one question at a time.</p>
      </div>
    </div>
    <p class="qp-demo-note">Curated sample questions. This preview runs locally; the real app uses AI and your source material.</p>`;
  container.replaceChildren(studio);
  const title = studio.querySelector('.qp-title-input');
  const size = studio.querySelector('.qp-size');
  const build = studio.querySelector('.qp-build');
  const download = studio.querySelector('.qp-download');
  const reset = studio.querySelector('.qp-reset');
  const quickBuild = studio.querySelector('.qp-quick-build');
  const paper = studio.querySelector('.qp-paper-questions');
  const placeholder = paper.firstElementChild.cloneNode(true);
  const status = studio.querySelector('.qp-build-status');
  const hint = studio.querySelector('.qp-edit-hint');
  const urls = new Set();
  const revokeTimers = new Set();
  let subject = 'science';
  let rows = [];
  let timer;
  let running = false;
  let ready = false;
  let disposed = false;

  function updateHeader() {
    const sample = samples[subject];
    studio.querySelector('.qp-paper-title').textContent = title.value.trim() || 'Untitled paper';
    studio.querySelector('.qp-paper-subject').textContent = `${sample.subject} · ${sample.chapter}`;
    studio.querySelector('.qp-chapter').textContent = sample.chapter;
    studio.querySelector('.qp-duration').textContent = size.value==='20' ? '45 minutes' : '30 minutes';
  }
  function validRows() {
    return ready && rows.length===4 && rows.every(row => row.text.value.trim() && row.marks.checkValidity() && Number.isInteger(Number(row.marks.value)));
  }
  function updateTotals(edited=false) {
    const values=rows.map(row=>Number(row.marks.value));
    const valid=rows.every(row=>row.marks.checkValidity() && Number.isInteger(Number(row.marks.value)));
    const total=values.reduce((sum,value)=>sum+value,0);
    studio.querySelector('.qp-total').textContent = rows.length && ready ? valid ? total : '?' : size.value;
    download.disabled = !validRows();
    if(ready) renderPlan();
    if (edited) {
      status.textContent = !validRows() ? 'Each question needs text and whole-number marks between 1 and 10.' : `${rows.length} questions · ${total} marks${total!==Number(size.value) ? ' · revised blueprint' : ' · ready to review'}`;
    }
  }
  function autoSize(text) {
    text.style.height='auto';
    text.style.height=`${Math.max(44,text.scrollHeight)}px`;
  }
  function updateControls() {
    build.querySelector('span').textContent = running ? 'Pause build' : ready ? 'Build another paper' : rows.length ? 'Continue build' : 'Build sample paper';
    build.querySelector('path').setAttribute('d',running ? 'M7 4v12m6-12v12' : 'M10 3v14M3 10h14');
    studio.classList.toggle('is-building',running);
    studio.dataset.phase = ready ? 'refine' : rows.length || running ? 'build' : 'plan';
    reset.disabled = !rows.length && !running;
    quickBuild.hidden = ready || (!rows.length && !running);
    quickBuild.textContent = running ? 'Pause' : 'Continue';
    quickBuild.setAttribute('aria-label',running ? 'Pause paper preview' : 'Continue paper preview');
    rows.forEach(row=>{row.text.readOnly=!ready;row.marks.disabled=!ready;row.swap.disabled=!ready;});
    updateTotals();
  }
  function pause() {
    clearTimeout(timer);running=false;
    if(!disposed) updateControls();
  }
  function renderPlan() {
    const slots=studio.querySelector('.qp-plan-slots');slots.replaceChildren();
    const values=ready ? rows.map(row=>row.marks.value && row.marks.checkValidity() && Number.isInteger(Number(row.marks.value)) ? Number(row.marks.value) : '?') : plans[size.value];
    values.forEach((marks,index)=>{
      const cell=document.createElement('span');cell.textContent=`Q${index+1}`;
      const count=document.createElement('b');count.textContent=`${marks} ${marks===1?'mark':'marks'}`;
      cell.append(count);slots.append(cell);
    });
  }
  function clearDraft() {
    pause();ready=false;rows=[];paper.replaceChildren(placeholder.cloneNode(true));
    status.textContent='Your blueprint is ready.';hint.textContent='The paper assembles here, one question at a time.';
    updateHeader();renderPlan();updateControls();
  }
  function appendQuestion(index) {
    if(index===0) paper.replaceChildren();
    const wrapper=document.createElement('section');wrapper.className='qp-question';
    const section=document.createElement('p');section.className='qp-section-label';section.textContent=index<2 ? 'Section A · Short answers' : 'Section B · Show your working';
    if(index===0 || index===2) paper.append(section);
    const number=document.createElement('span');number.className='qp-question-number';number.textContent=String(index+1).padStart(2,'0');
    const text=document.createElement('textarea');text.className='qp-question-text';text.rows=2;text.maxLength=1400;
    text.value=samples[subject].questions[index][0];text.setAttribute('aria-label',`Question ${index+1}`);text.readOnly=true;
    const tools=document.createElement('div');tools.className='qp-question-tools';
    const marksLabel=document.createElement('label');marksLabel.textContent='Marks';
    const marks=document.createElement('input');marks.type='number';marks.min='1';marks.max='10';marks.step='1';marks.required=true;marks.value=String(plans[size.value][index]);marks.disabled=true;marks.setAttribute('aria-label',`Marks for question ${index+1}`);
    marksLabel.append(marks);
    const swap=document.createElement('button');swap.type='button';swap.disabled=true;swap.className='qp-swap';swap.setAttribute('aria-label',`Swap question ${index+1}`);swap.textContent='↻';
    tools.append(marksLabel,swap);wrapper.append(number,text,tools);paper.append(wrapper);
    const row={text,marks,swap,variant:0};rows.push(row);autoSize(text);
    listen(text,'input',()=>{autoSize(text);updateTotals(true);});
    listen(marks,'input',()=>updateTotals(true));
    listen(swap,'click',()=>{
      row.variant=1-row.variant;text.value=samples[subject].questions[index][row.variant];autoSize(text);updateTotals();
      status.textContent=`Question ${index+1} swapped. Your marks stay the same.`;
      if(!reducedMotion.matches) wrapper.animate([{opacity:.35,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:250,easing:'cubic-bezier(.22,1,.36,1)'});
    });
    if(!reducedMotion.matches) wrapper.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  function advance() {
    if(disposed || !running) return;
    if(rows.length<4) appendQuestion(rows.length);
    status.textContent=`Assembling the sample · ${rows.length} of 4 questions`;
    if(rows.length===4) {
      ready=true;pause();updateControls();
      status.textContent='Your sample is ready. Try editing or swapping a question.';
      hint.textContent='Click a question to edit it. Change its marks or try the swap button.';
    } else timer=setTimeout(advance,450);
  }
  function start() {
    if(running) {pause();status.textContent=`Build paused · ${rows.length} of 4 questions`;return;}
    if(ready) clearDraft();
    running=true;updateControls();status.textContent='Placing sample questions into your blueprint…';
    if(matchMedia('(max-width: 780px)').matches) {
      const panel=container.closest('.project-viewer-panel');
      if(panel) panel.scrollTo({top:panel.scrollTop+studio.querySelector('.qp-paper-desk').getBoundingClientRect().top-panel.getBoundingClientRect().top-64,behavior:reducedMotion.matches?'instant':'smooth'});
    }
    if(reducedMotion.matches) {while(rows.length<4) appendQuestion(rows.length);advance();}
    else timer=setTimeout(advance,rows.length ? 250 : 700);
  }
  listen(build,'click',start);
  listen(quickBuild,'click',start);
  listen(title,'input',updateHeader);
  listen(size,'change',clearDraft);
  studio.querySelectorAll('[data-subject]').forEach(button=>listen(button,'click',()=>{
    if(subject===button.dataset.subject) return;
    subject=button.dataset.subject;
    studio.querySelectorAll('[data-subject]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    clearDraft();
  }));
  listen(reset,'click',()=>{
    subject='science';size.value='12';title.value='Unit test';
    studio.querySelectorAll('[data-subject]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.subject===subject)));
    clearDraft();
  });
  listen(download,'click',()=>{
    if(!validRows()) return;
    const lines=[studio.querySelector('.qp-paper-title').textContent,`Class 10 · ${samples[subject].subject} · ${samples[subject].chapter}`,`Maximum marks: ${studio.querySelector('.qp-total').textContent}`,`Time: ${studio.querySelector('.qp-duration').textContent}`,'','Answer all questions. Show your working where needed.',''];
    rows.forEach((row,index)=>lines.push(`${index+1}. ${row.text.value.trim()} [${row.marks.value} marks]`,''));
    lines.push('qp-gen portfolio sample · Curated questions, locally edited.');
    const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));urls.add(url);
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`qp-gen-${subject}-sample.txt`;anchor.click();
    const revoke=setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);revokeTimers.delete(revoke);},5000);revokeTimers.add(revoke);
    status.textContent='Your edited sample was downloaded as a text file.';
  });
  listen(document,'visibilitychange',()=>{if(document.hidden && running){pause();status.textContent=`Build paused · ${rows.length} of 4 questions`;}});
  listen(reducedMotion,'change',event=>{
    if(!event.matches) return;
    studio.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    if(running){clearTimeout(timer);while(rows.length<4) appendQuestion(rows.length);advance();}
  });
  const resizeObserver=new ResizeObserver(()=>rows.forEach(row=>autoSize(row.text)));
  resizeObserver.observe(studio.querySelector('.qp-paper-desk'));
  clearDraft();
  return {dispose(){
    disposed=true;pause();lifetime.abort();resizeObserver.disconnect();
    studio.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    revokeTimers.forEach(clearTimeout);urls.forEach(url=>URL.revokeObjectURL(url));
  }};
}
