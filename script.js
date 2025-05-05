/* =========  TPHS Peer Tutoring  –  UI Logic v4.2  ========= */

/* ----------  0.  Global helpers ---------- */
function $ (sel , root=document){ return root.querySelector(sel ); }
function $$ (sel , root=document){ return [...root.querySelectorAll(sel)]; }

/* ----------  1. Fade‑in on scroll ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  $$('.fade-in').forEach(el=>el.classList.add('hide'));
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.remove('hide'); io.unobserve(e.target); }
    });
  },{threshold:.2});
  $$('.fade-in').forEach(el=>io.observe(el));
});

/* ----------  2. Mobile burger ---------- */
document.addEventListener('click',e=>{
  if(e.target.closest('.burger')){
      $('.nav-links').classList.toggle('open');
      document.body.classList.toggle('nav-open');
      e.target.closest('.burger').classList.toggle('open');
  }
});

/* ----------  3. Name + Subject filter ---------- */
function runFilter(){
  const nameTerm = ($('#filterName')?.value||'').toLowerCase();
  const subjTerm = $('#filterSubject')?.value || '';
  $$('.tutor-card').forEach(card=>{
    const okName = card.dataset.name.includes(nameTerm);
    const okSubj = !subjTerm || card.dataset.subjects.includes(subjTerm);
    card.style.display = (okName && okSubj) ? 'flex' : 'none';
  });
}
['input','change'].forEach(evt=>{
  $('#filterName')?.addEventListener(evt,runFilter);
  $('#filterSubject')?.addEventListener(evt,runFilter);
});

/* ----------  4. Modal overlay (created once) ---------- */
const overlay = document.createElement('div');
overlay.className='modal-overlay';
overlay.innerHTML='<div class="modal" id="modalBox"></div>';
overlay.style.zIndex='2000'; /* guarantee on top of everything */
document.body.appendChild(overlay);
overlay.addEventListener('click',e=>{
  if(e.target===overlay) overlay.classList.remove('show');
});

/* ----------  5. Event‑delegated “Request this tutor” ---------- */
document.addEventListener('click',e=>{
  const btn = e.target.closest('.request-btn');
  if(!btn) return;

  const card = btn.closest('.tutor-card');
  if(!card) return;

  // Build and show modal
  buildModal(card);
  overlay.classList.add('show');
});

function buildModal(card){
  const box  = $('#modalBox');
  const name = card.querySelector('h3').textContent.trim();
  const subjects = (card.dataset.subjects||'').split(',').filter(Boolean);
  const times    = (card.dataset.times   ||'').split(',').filter(Boolean);
  const x = Math.floor(Math.random()*6)+4, y = Math.floor(Math.random()*6)+1;

  box.innerHTML=`
    <h3>Request ${name}</h3>
    <form id="modalForm">
      <strong>Choose subject(s):</strong>
      <div class="checkbox-list">
        ${subjects.length?subjects.map((s,i)=>`
          <input type="checkbox" id="s${i}" name="subjects" value="${s}">
          <label for="s${i}">${s}</label>`).join(''): '<p><em>No subjects listed.</em></p>'}
      </div>

      <strong>Preferred time(s):</strong>
      <div class="checkbox-list">
        ${times.length?times.map((t,i)=>`
          <input type="checkbox" id="t${i}" name="times" value="${t}">
          <label for="t${i}">${t}</label>`).join(''): '<p><em>No times listed.</em></p>'}
      </div>

      <textarea name="comments" placeholder="Comments for ${name} (optional)"></textarea>

      <div class="captcha">What is ${x} + ${y}? 
        <input type="number" id="captchaAns" required>
      </div>

      <button class="btn btn-primary" type="submit">Submit</button>
    </form>
  `;

  $('#modalForm').addEventListener('submit',e=>{
    e.preventDefault();
    if(+$('#captchaAns').value !== x+y){
      alert('Wrong answer. Please try the CAPTCHA again.'); return;
    }
    /* TODO: integrate EmailJS here if desired */
    window.location.href='confirm.html';
  },{once:true});
}

/* ----------  6. Light‑box gallery ---------- */
const lightbox = document.createElement('div');
lightbox.className='lightbox';
document.body.appendChild(lightbox);
lightbox.addEventListener('click',()=>lightbox.classList.remove('show'));
$$('.gallery-grid img').forEach(img=>{
  img.addEventListener('click',()=>{
    lightbox.innerHTML='';
    lightbox.appendChild(img.cloneNode());
    setTimeout(()=>lightbox.classList.add('show'),10);
  });
});

/* ----------  7. Scroll‑to‑top ---------- */
const toTop = $('#toTop');
window.addEventListener('scroll',()=>{ window.scrollY>500?toTop?.classList.add('show'):toTop?.classList.remove('show'); });
toTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
