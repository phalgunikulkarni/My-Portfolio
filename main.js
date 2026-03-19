// ===== THEME =====
const toggle = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
const saved = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);
icon.textContent = saved === 'dark' ? '🌙' : '☀️';
toggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  icon.textContent = next === 'dark' ? '🌙' : '☀️';
});

// ===== NAV SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
});

// ===== TYPED ANIMATION =====
const phrases = ['software developer.', 'ML engineer.', 'web developer.', 'deep learning enthusiast.', 'problem solver.'];
let pi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed');
function type() {
  const cur = phrases[pi];
  typedEl.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
  if (!del && ci === cur.length) { del = true; setTimeout(type, 1800); return; }
  if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, del ? 60 : 90);
}
type();

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// ===== RESUME SCORE ANIMATION =====
const scoreObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const circle = document.getElementById('scoreCircle');
    const numEl = document.getElementById('scoreNum');
    const score = 8.6;
    const circumference = 314;
    const offset = circumference - (score / 10) * circumference;
    circle.style.strokeDashoffset = offset;
    let current = 0;
    const step = score / 60;
    const counter = setInterval(() => {
      current = Math.min(current + step, score);
      numEl.textContent = current.toFixed(1);
      if (current >= score) clearInterval(counter);
    }, 25);
    document.querySelectorAll('.score-bar-fill').forEach(bar => {
      bar.style.width = bar.style.getPropertyValue('--w') || getComputedStyle(bar).getPropertyValue('--w');
    });
    scoreObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
const resumeSection = document.getElementById('resume');
if (resumeSection) scoreObs.observe(resumeSection);

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== ADMIN MODE =====
// Secret: Ctrl + Shift + A
let adminMode = false;
const ADMIN_PASS = 'pk2024'; // change this to your own password

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    if (!adminMode) {
      const pass = prompt('Admin password:');
      if (pass === ADMIN_PASS) {
        adminMode = true;
        showAdminButtons(true);
        showToast('admin mode on');
      } else {
        alert('Wrong password.');
      }
    } else {
      adminMode = false;
      showAdminButtons(false);
      showToast('admin mode off');
    }
  }
});

function showAdminButtons(show) {
  ['addProjectBtn', 'addWipBtn', 'addExpBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'block' : 'none';
  });
}

// ===== MODAL =====
function openModal(type) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  overlay.classList.add('open');

  if (type === 'project') {
    title.textContent = 'Add Project';
    body.innerHTML = `
      <div class="form-group"><label>Title</label><input id="f-title" placeholder="Project name" /></div>
      <div class="form-group"><label>Description</label><textarea id="f-desc" placeholder="What does it do?"></textarea></div>
      <div class="form-group"><label>GitHub URL</label><input id="f-url" placeholder="https://github.com/..." /></div>
      <div class="form-group"><label>Tags (comma separated)</label><input id="f-tags" placeholder="Python, ML, React" /></div>
      <div class="form-group"><label>Icon (emoji)</label><input id="f-icon" placeholder="🚀" maxlength="2" /></div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal()">cancel</button>
        <button class="btn btn-primary" onclick="submitProject()">add project</button>
      </div>`;
  } else if (type === 'wip') {
    title.textContent = 'Add Current Work';
    body.innerHTML = `
      <div class="form-group"><label>Title</label><input id="f-title" placeholder="What are you building?" /></div>
      <div class="form-group"><label>Description</label><textarea id="f-desc" placeholder="Brief description..."></textarea></div>
      <div class="form-group"><label>Progress % (0-100)</label><input id="f-progress" type="number" min="0" max="100" placeholder="60" /></div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal()">cancel</button>
        <button class="btn btn-primary" onclick="submitWip()">add work</button>
      </div>`;
  } else if (type === 'experience') {
    title.textContent = 'Add Experience';
    body.innerHTML = `
      <div class="form-group"><label>Role / Title</label><input id="f-role" placeholder="Software Engineer Intern" /></div>
      <div class="form-group"><label>Company</label><input id="f-company" placeholder="Company Name" /></div>
      <div class="form-group"><label>Duration</label><input id="f-date" placeholder="Jun 2024 – Aug 2024" /></div>
      <div class="form-group"><label>Points (one per line)</label><textarea id="f-points" placeholder="Built X using Y&#10;Improved Z by 30%"></textarea></div>
      <div class="form-group"><label>Tags (comma separated)</label><input id="f-tags" placeholder="Python, Django" /></div>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="closeModal()">cancel</button>
        <button class="btn btn-primary" onclick="submitExp()">add experience</button>
      </div>`;
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

function submitProject() {
  const title = document.getElementById('f-title').value.trim();
  const desc = document.getElementById('f-desc').value.trim();
  const url = document.getElementById('f-url').value.trim() || '#';
  const tags = document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(Boolean);
  const icon = document.getElementById('f-icon').value.trim() || '💡';
  if (!title) return;

  const tagsHtml = tags.map(t => `<span class="tag tag-sm">${t}</span>`).join('');
  const card = document.createElement('div');
  card.className = 'project-card revealed';
  card.innerHTML = `
    <div class="project-header">
      <span class="project-icon">${icon}</span>
      <div class="project-links">
        <a href="${url}" target="_blank" class="icon-link" aria-label="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </div>
    </div>
    <h3 class="project-title">${title}</h3>
    <p class="project-desc">${desc}</p>
    <div class="project-tags">${tagsHtml}</div>`;
  document.getElementById('projectsGrid').appendChild(card);
  closeModal();
  showToast('project added');
}

function submitWip() {
  const title = document.getElementById('f-title').value.trim();
  const desc = document.getElementById('f-desc').value.trim();
  const progress = Math.min(100, Math.max(0, parseInt(document.getElementById('f-progress').value) || 50));
  if (!title) return;

  const card = document.createElement('div');
  card.className = 'wip-card revealed';
  card.innerHTML = `
    <div class="wip-status"><span class="pulse"></span><span>in progress</span></div>
    <h3 class="wip-title">${title}</h3>
    <p class="wip-desc">${desc}</p>
    <div class="wip-progress">
      <div class="progress-bar"><div class="progress-fill" style="--progress:${progress}%"></div></div>
      <span class="progress-label">~${progress}% done</span>
    </div>`;
  document.getElementById('wipGrid').appendChild(card);
  closeModal();
  showToast('work added');
}

function submitExp() {
  const role = document.getElementById('f-role').value.trim();
  const company = document.getElementById('f-company').value.trim();
  const date = document.getElementById('f-date').value.trim();
  const points = document.getElementById('f-points').value.split('\n').map(p => p.trim()).filter(Boolean);
  const tags = document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(Boolean);
  if (!role) return;

  const pointsHtml = points.map(p => `<li>${p}</li>`).join('');
  const tagsHtml = tags.map(t => `<span class="tag tag-sm">${t}</span>`).join('');
  const item = document.createElement('div');
  item.className = 'timeline-item revealed';
  item.innerHTML = `
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <h3 class="timeline-role">${role}</h3>
        <span class="timeline-date">${date}</span>
      </div>
      <p class="timeline-company">${company}</p>
      <ul class="timeline-points">${pointsHtml}</ul>
      <div class="skill-tags" style="margin-top:0.75rem">${tagsHtml}</div>
    </div>`;
  document.getElementById('experienceList').appendChild(item);
  closeModal();
  showToast('experience added');
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
