import { mountTriyaCaseStudy, triyaProducts } from './triya-case-study.js';

const building = `<svg viewBox="0 0 160 120" aria-hidden="true"><path d="M25 108V39l55-25 55 25v69M15 108h130M65 108V78h30v30"/><path d="M43 48h12v12H43zm31-12h12v12H74zm31 12h12v12h-12zM43 76h12v12H43zm62 0h12v12h-12z"/></svg>`;
const screen = `<span class="triya-device-screen"><i></i><span></span><span></span><span></span></span>`;

export function createTriyaCover() {
  const cover = document.createElement('span');
  cover.className = 'triya-cover';
  cover.setAttribute('aria-hidden', 'true');
  cover.innerHTML = `<span class="triya-cover-label">Triya / Client project</span><span class="triya-cover-copy">One client.<br>Three products<span>.</span></span><span class="triya-cover-platforms">Website <span>·</span> Web app <span>·</span> Android</span><span class="triya-cover-devices"><span class="triya-device triya-device-site">${screen}</span><span class="triya-device triya-device-manager">${screen}</span><span class="triya-device triya-device-phone">${screen}</span></span>`;
  return cover;
}

function sitePreview() {
  return `<div class="triya-site-preview"><div class="triya-mock-topline"><span>Example residence</span><span>Accommodation</span></div><div class="triya-site-hero"><div><span class="triya-mock-kicker">A place to settle in</span><h4>Room for<br>everyday life.</h4><p>Explore shared and private living spaces.</p></div>${building}</div><div class="triya-site-categories" role="group" aria-label="Example accommodation category"><button type="button" data-category="shared" aria-pressed="true">Co-living</button><button type="button" data-category="private" aria-pressed="false">Apartments</button></div><div class="triya-site-list"><span class="triya-mock-kicker triya-site-category-title">Shared living</span><h5 class="triya-site-list-title">A space to make your own.</h5><p class="triya-site-list-copy">Furnished rooms, shared spaces, and everyday essentials.</p><button class="triya-demo-button" type="button" data-site-detail>Explore the example <span aria-hidden="true">→</span></button></div><div class="triya-site-detail" hidden><span class="triya-mock-kicker">Illustrative property detail</span><h5>Thoughtful spaces. Simple essentials.</h5><p>Room layouts, amenities, and a clearer picture of daily life, brought together in one detail view.</p><ul><li>Furnished accommodation</li><li>Shared everyday spaces</li><li>Clear accommodation information</li></ul><button type="button" class="triya-demo-button" data-site-back>Back to collection</button></div></div>`;
}

function managerPreview() {
  return `<div class="triya-manager-preview"><div class="triya-mock-topline"><span>Manager / Dashboard</span><label class="triya-property-label"><span class="sr-only">Example active property</span><select aria-label="Example active property"><option value="a">Example property A</option><option value="b">Example property B</option></select></label></div><h4>Property overview<span>.</span></h4><div class="triya-demo-stats"><div><span>Occupied beds</span><strong data-stat="occupancy">36 / 48</strong></div><div><span>Collected this month</span><strong data-stat="collections">₹2,34,000</strong></div><div><span>Pending collection</span><strong data-stat="pending">₹90,000</strong></div></div><div class="triya-demo-ledger"><div class="triya-ledger-heading"><h5>Sample rent ledger</h5><span>Illustrative records</span></div><div class="triya-ledger-row"><span>Resident 01<small>Room 101 · Current cycle</small></span><span data-payment-status>Partially paid</span><strong data-payment-balance>₹4,500 due</strong></div><div class="triya-ledger-row"><span>Resident 02<small>Room 102 · Current cycle</small></span><span>Unpaid</span><strong>₹9,000 due</strong></div><div class="triya-ledger-row"><span>Resident 03<small>Room 103 · Earlier dues</small></span><span>Outstanding</span><strong>₹7,500 due</strong></div></div><div class="triya-demo-actions"><button type="button" class="triya-demo-button" data-collect>Record sample payment</button><button type="button" class="triya-demo-button triya-demo-button-secondary" data-remind>Preview reminders</button></div><p class="triya-demo-feedback" role="status" aria-live="polite">Choose a property or try a sample operation.</p></div>`;
}

function androidPreview() {
  return `<div class="triya-android-preview"><div class="triya-phone"><div class="triya-phone-chrome" aria-hidden="true"><span>9:41</span><i></i><span>100%</span></div><div class="triya-mobile-topline"><span class="triya-mock-kicker">Example property</span><span class="triya-mobile-status">Mock data</span></div><div class="triya-mobile-screen" role="region" aria-label="Example Android screen"></div><div class="triya-mobile-tabs" role="group" aria-label="Example Android navigation"><button type="button" data-screen="dashboard" aria-pressed="true">Home</button><button type="button" data-screen="floors" aria-pressed="false">Floors</button><button type="button" data-screen="collections" aria-pressed="false">Rent</button></div></div><div class="triya-android-context"><span class="triya-mock-kicker">Native counterpart</span><h4>The same work,<br>closer to hand.</h4><p>Property-scoped screens, touch-friendly actions, and consistent financial rules.</p><p class="triya-integration-note">Reviewed build: mock-backed.<br>Production API integration is pending.</p></div></div>`;
}

const mobileScreens = {
  dashboard: `<h4>Overview<span>.</span></h4><p class="triya-mobile-subtitle">Today at a glance</p><div class="triya-mobile-stats"><div><span>Occupied</span><strong>36 / 48</strong></div><div><span>Collected</span><strong>₹2.34L</strong></div></div><h5>Recent activity</h5><div class="triya-mobile-row"><span>Rent receipt recorded</span><small>Resident 01 · Sample</small></div><div class="triya-mobile-row"><span>Complaint updated</span><small>Room 102 · Sample</small></div>`,
  floors: `<h4>Floor manager<span>.</span></h4><p class="triya-mobile-subtitle">First floor · Example rooms</p><div class="triya-room-grid">${['101','102','103','104','105','106'].map((room,index)=>`<div><strong>${room}</strong><span>${index === 2 ? 'Vacant' : index === 4 ? 'Pending' : 'Occupied'}</span><i class="${index === 2 ? 'is-vacant' : ''}"></i></div>`).join('')}</div><p class="triya-mobile-subtitle">Rooms and bed states stay within the active property.</p>`,
  collections: `<h4>Collections<span>.</span></h4><p class="triya-mobile-subtitle">Current billing cycle</p><div class="triya-mobile-stats"><div><span>Collected</span><strong>₹2.34L</strong></div><div><span>Pending</span><strong>₹90K</strong></div></div><div class="triya-mobile-row"><span>Resident 01 <strong>₹4,500</strong></span><small>Partially paid</small></div><div class="triya-mobile-row"><span>Resident 02 <strong>₹9,000</strong></span><small>Unpaid</small></div><p class="triya-mobile-subtitle">A billing month can include multiple receipts.</p>`,
};

export function mountTriyaShowcase(container, { panel, reducedMotion, caseStudy }) {
  const lifetime = new AbortController();
  const listen = (element, type, handler) => element.addEventListener(type, handler, { signal: lifetime.signal });
  let reader;
  let productLifetime;
  const root = document.createElement('section');
  root.className = 'triya-showcase';
  root.setAttribute('aria-label', 'Triya three-product client project');
  root.innerHTML = `<header class="triya-suite-header"><span class="triya-eyebrow">Client project / Triya</span><h3>Three products.<br>One connected brief<span>.</span></h3><p>A public website, a property management web app, and a native Android counterpart for the same client.</p><dl class="triya-suite-facts"><div><dt>Engagement</dt><dd>Live client project</dd></div><div><dt>Client scale</dt><dd>~5,000 tenants</dd></div><div><dt>Scope</dt><dd>Website · Web app · Android</dd></div></dl></header><div class="triya-product-picker" role="group" aria-label="Choose a Triya product">${Object.entries(triyaProducts).map(([key,item],index)=>`<button type="button" data-product="${key}" aria-pressed="${index===0}" aria-controls="triya-product-panel"><span class="triya-product-number">0${index+1}</span><span class="triya-product-device triya-product-device-${key}">${screen}</span><strong>${item.label}</strong><span class="triya-product-purpose">${['Discover the offering','Manage daily operations','Work on the move'][index]}</span></button>`).join('')}</div><section id="triya-product-panel" class="triya-selected-product" aria-labelledby="triya-product-title"><div class="triya-product-intro"><div><span class="triya-eyebrow triya-product-repo"></span><h3 id="triya-product-title"></h3><p class="triya-product-summary"></p></div><span class="triya-product-status"></span></div><div class="triya-product-demo"></div><div class="triya-preview-footer"><p>Illustrative interface · Invented records</p><a class="triya-read-notes" href="#triya-website-case-contents">Read engineering notes <span aria-hidden="true">↓</span></a></div></section><p class="triya-suite-note">Approximate client scale, reported by the project owner. Property and tenant details are kept private.</p>`;
  container.replaceChildren(root);
  const demo = root.querySelector('.triya-product-demo');
  const readNotes = root.querySelector('.triya-read-notes');

  function selectProduct(key) {
    if (!triyaProducts[key]) return;
    productLifetime?.abort();
    productLifetime = new AbortController();
    const on = (element,type,handler) => element.addEventListener(type,handler,{signal:productLifetime.signal});
    const item = triyaProducts[key];
    root.querySelectorAll('[data-product]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.product===key)));
    root.querySelector('.triya-product-repo').textContent = item.repo;
    root.querySelector('#triya-product-title').textContent = item.title;
    root.querySelector('.triya-product-summary').textContent = item.summary;
    root.querySelector('.triya-product-status').textContent = item.status;
    readNotes.href = `#triya-${key}-case-contents`;
    demo.innerHTML = key === 'website' ? sitePreview() : key === 'manager' ? managerPreview() : androidPreview();
    reader?.dispose();
    reader = mountTriyaCaseStudy(caseStudy, { panel, reducedMotion }, key);
    if (key === 'website') {
      const list = demo.querySelector('.triya-site-list');
      const detail = demo.querySelector('.triya-site-detail');
      demo.querySelectorAll('[data-category]').forEach(button=>on(button,'click',()=>{
        const shared = button.dataset.category === 'shared';
        demo.querySelectorAll('[data-category]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
        demo.querySelector('.triya-site-category-title').textContent = shared ? 'Shared living' : 'Private living';
        demo.querySelector('.triya-site-list-title').textContent = shared ? 'A space to make your own.' : 'A little more room to yourself.';
        demo.querySelector('.triya-site-list-copy').textContent = shared ? 'Furnished rooms, shared spaces, and everyday essentials.' : 'Independent spaces, practical layouts, and everyday comfort.';
        list.hidden = false; detail.hidden = true;
      }));
      on(demo.querySelector('[data-site-detail]'),'click',()=>{list.hidden=true;detail.hidden=false;demo.querySelector('[data-site-back]').focus({preventScroll:true});});
      on(demo.querySelector('[data-site-back]'),'click',()=>{list.hidden=false;detail.hidden=true;demo.querySelector('[data-site-detail]').focus({preventScroll:true});});
    } else if (key === 'manager') {
      const collect = demo.querySelector('[data-collect]');
      const feedback = demo.querySelector('.triya-demo-feedback');
      function resetProperty() {
        const second = demo.querySelector('select').value === 'b';
        demo.querySelector('[data-stat="occupancy"]').textContent = second ? '24 / 32' : '36 / 48';
        demo.querySelector('[data-stat="collections"]').textContent = second ? '₹1,62,000' : '₹2,34,000';
        demo.querySelector('[data-stat="pending"]').textContent = second ? '₹54,000' : '₹90,000';
        demo.querySelector('[data-payment-status]').textContent = 'Partially paid';
        demo.querySelector('[data-payment-balance]').textContent = '₹4,500 due';
        collect.disabled = false; collect.textContent = 'Record sample payment';
        feedback.textContent = `Example property ${second ? 'B' : 'A'} selected. All figures are illustrative.`;
      }
      on(demo.querySelector('select'),'change',resetProperty);
      on(collect,'click',()=>{
        const second = demo.querySelector('select').value === 'b';
        demo.querySelector('[data-stat="collections"]').textContent = second ? '₹1,66,500' : '₹2,38,500';
        demo.querySelector('[data-stat="pending"]').textContent = second ? '₹49,500' : '₹85,500';
        demo.querySelector('[data-payment-status]').textContent = 'Fully paid';
        demo.querySelector('[data-payment-balance]').textContent = '₹0 due';
        collect.textContent = 'Sample payment recorded'; collect.disabled = true;
        feedback.textContent = '₹4,500 sample receipt recorded locally. The current-cycle balance is now settled.';
      });
      on(demo.querySelector('[data-remind]'),'click',()=>{feedback.textContent='3 sample reminders composed locally, each using the recipient’s own balance. No delivery service is connected to this preview.';});
    } else {
      const screenRoot = demo.querySelector('.triya-mobile-screen');
      screenRoot.innerHTML = mobileScreens.dashboard;
      demo.querySelectorAll('[data-screen]').forEach(button=>on(button,'click',()=>{
        screenRoot.innerHTML = mobileScreens[button.dataset.screen];
        screenRoot.setAttribute('aria-label',`Example Android ${button.dataset.screen} screen`);
        demo.querySelectorAll('[data-screen]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
      }));
    }
  }
  root.querySelectorAll('[data-product]').forEach(button=>listen(button,'click',()=>selectProduct(button.dataset.product)));
  listen(readNotes,'click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const target = caseStudy.querySelector('.qp-case-toc h3');
    if(!target)return;
    event.preventDefault();
    const top = panel.scrollTop + target.getBoundingClientRect().top - panel.getBoundingClientRect().top - 76;
    panel.scrollTo({top,behavior:reducedMotion.matches?'instant':'smooth'});
    target.focus({preventScroll:true});
  });
  selectProduct('website');
  return { dispose() { lifetime.abort(); productLifetime?.abort(); reader?.dispose(); root.remove(); } };
}
