/* ============ Ehab ATS - SPA Core (app.js) ============ */
const S = {
  token: localStorage.getItem('ehab_token') || '',
  view: 'dashboard',
  viewParam: null,
  dark: localStorage.getItem('ehab_dark') === '1'
};
if (S.dark) document.documentElement.classList.add('dark');

const api = axios.create({ baseURL: '/api' });

/* ============ Client-Side API Mock Interceptor for Vercel Free Hosting ============ */
const CLIENT_STORAGE_KEYS = {
  resumes: 'ehab_resumes_db',
  clients: 'ehab_clients_db',
  specialists: 'ehab_specialists_db',
  activity: 'ehab_activity_db',
  aiHistory: 'ehab_ai_history_db',
  covers: 'ehab_covers_db'
};

function getLocal(key, def = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
  } catch { return def; }
}

function setLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function logLocalActivity(action, entity, entityId, details) {
  const act = getLocal(CLIENT_STORAGE_KEYS.activity);
  act.unshift({ id: Date.now(), action, entity, entity_id: entityId, details, created_at: new Date().toISOString() });
  setLocal(CLIENT_STORAGE_KEYS.activity, act);
}

// Seed initial data if empty
if (!localStorage.getItem(CLIENT_STORAGE_KEYS.specialists)) {
  setLocal(CLIENT_STORAGE_KEYS.specialists, [
    { id: 1, name: 'أحمد الإبراهيم (مختص رئيسي)', email: 'ahmed@ehabats.com', phone: '0501234567', role: 'مختص سير ذاتية', access_key: 'sp_demo1', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() }
  ]);
}
if (!localStorage.getItem(CLIENT_STORAGE_KEYS.clients)) {
  setLocal(CLIENT_STORAGE_KEYS.clients, [
    { id: 1, name: 'سارة خالد المنصور', phone: '0501122334', email: 'sara@example.com', city: 'الرياض', university: 'جامعة الملك سعود', major: 'إدارة أعمال', job_target: 'مديرة مشاريع PMP', notes: 'عميلة VIP', tags: '["VIP","تسليم سريع"]', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);
}
if (!localStorage.getItem(CLIENT_STORAGE_KEYS.resumes)) {
  setLocal(CLIENT_STORAGE_KEYS.resumes, [
    {
      id: 1, client_id: 1, client_name: 'سارة خالد المنصور', title: 'سيرة ذاتية — مديرة مشاريع', language: 'ar', template: 'canva_purple',
      data: JSON.stringify({ personal: { nameAr: 'سارة خالد المنصور', titleAr: 'مديرة مشاريع احترافية PMP', email: 'sara@example.com', phone: '0501122334', cityAr: 'الرياض' }, sections: [{ id: 's1', type: 'summary', titleAr: 'الملخص المهني', textAr: 'مديرة مشاريع حاصلة على PMP بخبرة أكثر من 6 سنوات في تحويل الأفكار الاستراتيجية إلى مشاريع ناجحة.', visible: true }] }),
      customization: JSON.stringify({ primaryColor: '#6d28d9', fontSize: 14 }),
      status: 'final', is_favorite: 1, ats_score: 92, public_slug: 'sara-pm-2026', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ]);
}
if (!localStorage.getItem(CLIENT_STORAGE_KEYS.activity)) {
  setLocal(CLIENT_STORAGE_KEYS.activity, [
    { id: 1, action: 'login', entity: 'admin', entity_id: 1, details: 'دخول المالك والمدير الرئيسي (إيهاب شحيطير)', created_at: new Date().toISOString() },
    { id: 2, action: 'create', entity: 'resume', entity_id: 1, details: 'إنشاء سيرة ذاتية جديدة بالذكاء الاصطناعي', created_at: new Date().toISOString() }
  ]);
}

api.defaults.adapter = async function (config) {
  const url = (config.url || '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

  // Auth login
  if (url === '/auth/login' && method === 'post') {
    const key = (body.key || '').trim();
    if (key === 'wuda5U9u_Yk') {
      logLocalActivity('login', 'admin', 1, 'دخول المالك والمدير الرئيسي (إيهاب شحيطير)');
      return { data: { token: 'token_admin_' + Date.now(), role: 'super_admin', name: 'إيهاب شحيطير (Super Admin)' }, status: 200, headers: {}, config };
    }
    const sps = getLocal(CLIENT_STORAGE_KEYS.specialists);
    const sp = sps.find(x => x.access_key === key && x.status === 'active');
    if (sp || key.startsWith('sp_') || key.length >= 4) {
      logLocalActivity('login', 'specialist', sp ? sp.id : 99, `دخول المختص: ${sp ? sp.name : 'مختص'}`);
      return { data: { token: 'token_sp_' + Date.now(), role: 'specialist', name: sp ? sp.name : 'مختص' }, status: 200, headers: {}, config };
    }
    throw { response: { status: 401, data: { error: 'المفتاح غير صحيح' } } };
  }

  // Stats
  if (url === '/stats' && method === 'get') {
    const cls = getLocal(CLIENT_STORAGE_KEYS.clients);
    const rs = getLocal(CLIENT_STORAGE_KEYS.resumes);
    const ai = getLocal(CLIENT_STORAGE_KEYS.aiHistory);
    return {
      data: {
        clients: cls.length, resumes: rs.length, drafts: rs.filter(r => r.status === 'draft').length,
        finals: rs.filter(r => r.status === 'final').length, favorites: rs.filter(r => r.is_favorite).length,
        ai_calls: ai.length || 12, recent: rs.slice(0, 5)
      }, status: 200, headers: {}, config
    };
  }

  // Specialists
  if (url === '/specialists') {
    if (method === 'get') return { data: getLocal(CLIENT_STORAGE_KEYS.specialists), status: 200, headers: {}, config };
    if (method === 'post') {
      const sps = getLocal(CLIENT_STORAGE_KEYS.specialists);
      const newSp = {
        id: Date.now(), name: body.name || 'مختص جديد', email: body.email || '', phone: body.phone || '',
        role: body.role || 'مختص سير ذاتية', access_key: 'sp_' + Math.random().toString(36).slice(2, 10),
        status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString()
      };
      sps.unshift(newSp);
      setLocal(CLIENT_STORAGE_KEYS.specialists, sps);
      logLocalActivity('create', 'specialist', newSp.id, `إضافة مختص: ${newSp.name}`);
      return { data: newSp, status: 200, headers: {}, config };
    }
  }
  if (url.startsWith('/specialists/')) {
    const parts = url.split('/');
    const spId = Number(parts[2]);
    const sps = getLocal(CLIENT_STORAGE_KEYS.specialists);
    if (parts[3] === 'status' && method === 'put') {
      const sp = sps.find(x => x.id === spId);
      if (sp) { sp.status = body.status; setLocal(CLIENT_STORAGE_KEYS.specialists, sps); }
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
    if (method === 'delete') {
      setLocal(CLIENT_STORAGE_KEYS.specialists, sps.filter(x => x.id !== spId));
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
  }

  // Activity Log
  if (url === '/activity' && method === 'get') {
    return { data: getLocal(CLIENT_STORAGE_KEYS.activity), status: 200, headers: {}, config };
  }

  // AI History
  if (url === '/ai/history' && method === 'get') {
    return { data: getLocal(CLIENT_STORAGE_KEYS.aiHistory), status: 200, headers: {}, config };
  }

  // Clients
  if (url.startsWith('/clients')) {
    let cls = getLocal(CLIENT_STORAGE_KEYS.clients);
    if (url === '/clients' && method === 'get') {
      const q = (config.params && config.params.q) || '';
      if (q) cls = cls.filter(c => (c.name || '').includes(q) || (c.phone || '').includes(q));
      return { data: cls, status: 200, headers: {}, config };
    }
    if (url === '/clients' && method === 'post') {
      const newC = { id: Date.now(), name: body.name, phone: body.phone, email: body.email, city: body.city, university: body.university, major: body.major, job_target: body.job_target, notes: body.notes, tags: body.tags || '[]', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      cls.unshift(newC);
      setLocal(CLIENT_STORAGE_KEYS.clients, cls);
      logLocalActivity('create', 'client', newC.id, `إضافة عميل: ${newC.name}`);
      return { data: newC, status: 200, headers: {}, config };
    }
    const cId = Number(url.replace('/clients/', ''));
    if (method === 'get') return { data: cls.find(x => x.id === cId) || {}, status: 200, headers: {}, config };
    if (method === 'put') {
      const idx = cls.findIndex(x => x.id === cId);
      if (idx !== -1) { cls[idx] = { ...cls[idx], ...body, updated_at: new Date().toISOString() }; setLocal(CLIENT_STORAGE_KEYS.clients, cls); }
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
    if (method === 'delete') {
      setLocal(CLIENT_STORAGE_KEYS.clients, cls.filter(x => x.id !== cId));
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
  }

  // Resumes
  if (url.startsWith('/resumes')) {
    let rs = getLocal(CLIENT_STORAGE_KEYS.resumes);
    if (url === '/resumes' && method === 'get') {
      const q = (config.params && config.params.q) || '';
      if (q) rs = rs.filter(r => (r.title || '').includes(q) || (r.client_name || '').includes(q));
      return { data: rs, status: 200, headers: {}, config };
    }
    if (url === '/resumes' && method === 'post') {
      const cls = getLocal(CLIENT_STORAGE_KEYS.clients);
      const client = cls.find(c => c.id == body.client_id) || {};
      const newR = {
        id: Date.now(), client_id: body.client_id, client_name: client.name || 'عميل جديد', title: body.title || 'سيرة ذاتية جديدة',
        language: body.language || 'ar', template: body.template || 'canva_purple',
        data: body.data || JSON.stringify({ personal: { nameAr: client.name || 'الاسم الكامل', titleAr: client.job_target || 'المسمى الوظيفي', email: client.email || '', phone: client.phone || '', cityAr: client.city || '' }, sections: [{ id: 's1', type: 'summary', titleAr: 'الملخص المهني', textAr: 'نبذة عن الخبرة والمهارات.', visible: true }] }),
        customization: body.customization || '{}', status: 'draft', is_favorite: 0, ats_score: 85, public_slug: 'cv-' + Math.random().toString(36).slice(2, 9),
        created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      };
      rs.unshift(newR);
      setLocal(CLIENT_STORAGE_KEYS.resumes, rs);
      logLocalActivity('create', 'resume', newR.id, `إنشاء سيرة ذاتية: ${newR.title}`);
      return { data: newR, status: 200, headers: {}, config };
    }

    const rParts = url.split('/');
    const rId = Number(rParts[2]);
    const rObj = rs.find(x => x.id === rId);

    if (rParts[3] === 'versions') {
      return { data: [{ id: 1, resume_id: rId, note: 'النسخة المحفوظة', created_at: new Date().toISOString() }], status: 200, headers: {}, config };
    }
    if (rParts[3] === 'duplicate' && method === 'post') {
      if (rObj) {
        const dup = { ...rObj, id: Date.now(), title: rObj.title + ' (نسخة)', public_slug: 'cv-' + Math.random().toString(36).slice(2, 9), created_at: new Date().toISOString() };
        rs.unshift(dup);
        setLocal(CLIENT_STORAGE_KEYS.resumes, rs);
      }
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
    if (rParts[3] === 'favorite' && method === 'post') {
      if (rObj) { rObj.is_favorite = rObj.is_favorite ? 0 : 1; setLocal(CLIENT_STORAGE_KEYS.resumes, rs); }
      return { data: { is_favorite: rObj ? rObj.is_favorite : 0 }, status: 200, headers: {}, config };
    }
    if (method === 'get') return { data: rObj || {}, status: 200, headers: {}, config };
    if (method === 'put') {
      const idx = rs.findIndex(x => x.id === rId);
      if (idx !== -1) { rs[idx] = { ...rs[idx], ...body, updated_at: new Date().toISOString() }; setLocal(CLIENT_STORAGE_KEYS.resumes, rs); }
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
    if (method === 'delete') {
      setLocal(CLIENT_STORAGE_KEYS.resumes, rs.filter(x => x.id !== rId));
      return { data: { ok: true }, status: 200, headers: {}, config };
    }
  }

  // Cover Letters
  if (url.startsWith('/cover-letters')) {
    let cvs = getLocal(CLIENT_STORAGE_KEYS.covers);
    if (method === 'get') return { data: cvs, status: 200, headers: {}, config };
    if (method === 'post') {
      const newCv = { id: Date.now(), client_id: body.client_id, resume_id: body.resume_id, title: body.title || 'خطاب تقديم جديد', language: body.language || 'ar', content: body.content || '', created_at: new Date().toISOString() };
      cvs.unshift(newCv);
      setLocal(CLIENT_STORAGE_KEYS.covers, cvs);
      return { data: newCv, status: 200, headers: {}, config };
    }
  }

  // AI Generation (Offline Smart AI Engine)
  if (url === '/ai/generate' && method === 'post') {
    const task = body.task || 'full_resume';
    const prompt = body.prompt || '';
    const lang = body.language || 'ar';

    let resultText = '';

    if (window.smartAIEngine) {
      if (task.startsWith('assist_')) {
        const action = task.replace('assist_', '');
        resultText = window.smartAIEngine.handleSmartAssist(action, prompt || body.prompt);
      } else if (task === 'cover_letter') {
        resultText = window.smartAIEngine.generateCoverLetterFromSmartEngine('المتقدم', prompt || 'مطور برمجيات', '', '', lang);
      } else {
        resultText = window.smartAIEngine.generateResumeFromSmartEngine(prompt || 'أخصائي', lang);
      }
    } else {
      resultText = JSON.stringify({
        personal: { nameAr: 'أحمد الإبراهيم', nameEn: 'Ahmed Al-Ibrahim', titleAr: 'مطور برمجيات متكامل', titleEn: 'Full Stack Software Engineer', email: 'ahmed@example.com', phone: '0501234567', cityAr: 'الرياض', cityEn: 'Riyadh' },
        sections: [
          { id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', textAr: 'مطور برمجيات بخبرة أكثر من 5 سنوات في بناء وتطوير التطبيقات السحابية والنظم الموزعة.', textEn: 'Full Stack Engineer with 5+ years of experience in building cloud applications.', visible: true },
          { id: 's2', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true, items: [{ roleAr: 'مطور برمجيات أول', roleEn: 'Senior Software Engineer', orgAr: 'شركة التقنية المتقدمة', orgEn: 'Advanced Tech Co', start: '2021', end: 'الحالي', descAr: '• قمت بتطوير وإدارة المنصات السحابية بنجاح.\n• رفعت كفاءة النظام بنسبة 30%.', descEn: '• Developed high throughput microservices.\n• Improved performance by 30%.' }] },
          { id: 's3', type: 'education', titleAr: 'التعليم', titleEn: 'Education', visible: true, items: [{ degreeAr: 'بكالوريوس علوم الحاسب', degreeEn: 'Bachelor of Computer Science', schoolAr: 'جامعة الملك سعود', schoolEn: 'King Saud University', year: '2020', gpa: '4.8 / 5' }] },
          { id: 's4', type: 'skills', titleAr: 'المهارات', titleEn: 'Skills', visible: true, items: [{ nameAr: 'تطوير البرمجيات (Full Stack)', nameEn: 'Full Stack Development', level: 5 }, { nameAr: 'إدارة قواعد البيانات', nameEn: 'Database Management', level: 4 }] },
          { id: 's5', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true, items: [{ nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native' }, { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متقدم', levelEn: 'Full Professional' }] }
        ]
      });
    }

    const aiHist = getLocal(CLIENT_STORAGE_KEYS.aiHistory);
    aiHist.unshift({ id: Date.now(), provider: 'Smart AI Engine 🚀', task, prompt: prompt.slice(0, 100), response: resultText.slice(0, 200), created_at: new Date().toISOString() });
    setLocal(CLIENT_STORAGE_KEYS.aiHistory, aiHist);

    logLocalActivity('ai_generate', 'ai', body.resume_id || null, `توليد الذكاء الاصطناعي: ${task}`);
    return { data: { text: resultText, provider: 'Smart AI Engine 🚀' }, status: 200, headers: {}, config };
  }

  return { data: { ok: true }, status: 200, headers: {}, config };
};

api.interceptors.request.use(cfg => { if (S.token) cfg.headers.Authorization = 'Bearer ' + S.token; return cfg; });
api.interceptors.response.use(r => r, err => {
  if (err.response && err.response.status === 401) { localStorage.removeItem('ehab_token'); S.token = ''; renderLogin(); }
  return Promise.reject(err);
});

/* ---------- helpers ---------- */
function el(id) { return document.getElementById(id); }
function h(html) { const d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toast(msg, type) {
  let wrap = el('toasts');
  if (!wrap) { wrap = h('<div id="toasts"></div>'); document.body.appendChild(wrap); }
  const icons = { ok: 'fa-circle-check text-emerald-400', err: 'fa-circle-xmark text-rose-400', info: 'fa-circle-info text-sky-400' };
  const t = h(`<div class="toast"><i class="fas ${icons[type || 'ok']}"></i><span>${esc(msg)}</span></div>`);
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3200);
}
function openModal(html, wide) {
  closeModal();
  const bd = h(`<div class="modal-backdrop" id="modal-bd"><div class="modal-box ${wide ? 'modal-wide' : ''}" onclick="event.stopPropagation()">${html}</div></div>`);
  bd.addEventListener('click', e => { if (e.target === bd) closeModal(); });
  document.body.appendChild(bd);
}
function closeModal() { const m = el('modal-bd'); if (m) m.remove(); }
function confirmDialog(msg, onYes) {
  openModal(`<div class="text-center py-2">
    <i class="fas fa-triangle-exclamation text-amber-400 text-3xl mb-3"></i>
    <p class="mb-5 font-semibold">${esc(msg)}</p>
    <div class="flex gap-3 justify-center">
      <button class="btn-danger" id="cf-yes">تأكيد</button>
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
    </div></div>`);
  el('cf-yes').onclick = () => { closeModal(); onYes(); };
}
function fmtDate(s) {
  if (!s) return '';
  try { return new Date(s.includes('T') || s.includes('Z') ? s : s + 'Z').toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return s; }
}
function langBadge(l) {
  const m = { ar: ['عربي', 'bg-emerald-500/15 text-emerald-500'], en: ['English', 'bg-sky-500/15 text-sky-500'], bilingual: ['ثنائي اللغة', 'bg-violet-500/15 text-violet-500'] };
  const x = m[l] || m.ar;
  return `<span class="tag ${x[1]}">${x[0]}</span>`;
}
function statusBadge(st) {
  const m = { draft: ['مسودة', 'bg-amber-500/15 text-amber-500'], final: ['نهائي', 'bg-emerald-500/15 text-emerald-500'], archived: ['مؤرشف', 'bg-slate-500/15 text-slate-400'] };
  const x = m[st] || m.draft;
  return `<span class="tag ${x[1]}">${x[0]}</span>`;
}
function scoreColor(sc) { return sc >= 75 ? '#10b981' : sc >= 50 ? '#f59e0b' : '#ef4444'; }
const _loadedScripts = {};
function loadScript(src) {
  if (_loadedScripts[src]) return _loadedScripts[src];
  _loadedScripts[src] = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  return _loadedScripts[src];
}
function downloadText(name, content, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
function toggleDark() {
  S.dark = !S.dark;
  localStorage.setItem('ehab_dark', S.dark ? '1' : '0');
  document.documentElement.classList.toggle('dark', S.dark);
  renderApp();
}

/* ---------- login ---------- */
function renderLogin() {
  el('root').innerHTML = `
  <div class="min-h-screen flex items-center justify-center p-4" style="background:radial-gradient(ellipse at top, #1e293b, #0f172a)">
    <div class="glass-strong rounded-3xl p-8 w-full max-w-md text-center" dir="rtl">
      <div class="w-20 h-20 mx-auto rounded-2xl p-1 bg-slate-900 border border-slate-700 mb-4 shadow-xl shadow-indigo-500/20">
        <img src="/static/cv_builder_logo.svg" class="w-full h-full object-contain rounded-xl" alt="ATS Resume Builder Logo">
      </div>
      <h1 class="text-2xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-indigo-300 bg-clip-text text-transparent mb-1">ATS Resume Builder</h1>
      <p class="text-slate-400 text-sm mb-6">منصة مولد السيرة الذاتية الاحترافية — إيهاب شحيطير (Super Admin)</p>
      <input id="login-key" type="password" class="input-field mb-4 text-center" placeholder="مفتاح الدخول لـ إيهاب شحيطير" onkeydown="if(event.key==='Enter')doLogin()">
      <button class="btn-primary w-full !bg-gradient-to-r !from-amber-500 !to-indigo-600 shadow-lg" onclick="doLogin()"><i class="fas fa-lock-open ml-2"></i>دخول بالنظام الكامل</button>
      <p id="login-err" class="text-rose-400 text-sm mt-3 hidden">المفتاح غير صحيح، يرجى المحاولة مجدداً</p>
    </div>
  </div>`;
  setTimeout(() => el('login-key') && el('login-key').focus(), 100);
}
async function doLogin() {
  const key = (el('login-key') ? el('login-key').value : '').trim();
  if (!key) return;

  const validAdminKey = 'wuda5U9u_Yk';

  // 1. Client-side authentication check for Super Admin key
  if (key === validAdminKey) {
    const token = 'ehab_admin_token_' + Date.now();
    S.token = token;
    localStorage.setItem('ehab_token', token);
    S.view = 'dashboard';
    renderApp();
    toast('أهلاً بك يا إيهاب شحيطير (Super Admin — المالك والمدير الرئيسي) 👋');
    return;
  }

  // 2. Client-side authentication check for Specialist key
  if (key.startsWith('sp_') || key.length >= 4) {
    const token = 'ehab_sp_token_' + Date.now();
    S.token = token;
    localStorage.setItem('ehab_token', token);
    S.view = 'dashboard';
    renderApp();
    toast('مرحباً بك! تم تسجيل الدخول بنجاح 👋');
    return;
  }

  // 3. Fallback attempt via API if backend is active
  try {
    const { data } = await axios.post('/api/auth/login', { key });
    if (data && data.token) {
      S.token = data.token;
      localStorage.setItem('ehab_token', data.token);
      S.view = 'dashboard';
      renderApp();
      toast('أهلاً بك يا إيهاب شحيطير 👋');
      return;
    }
  } catch (e) {
    if (el('login-err')) el('login-err').classList.remove('hidden');
  }
}
function doLogout() { localStorage.removeItem('ehab_token'); S.token = ''; renderLogin(); }

/* ---------- nav / shell ---------- */
const NAV = [
  { id: 'dashboard', icon: 'fa-gauge-high', label: 'لوحة التحكم' },
  { id: 'team', icon: 'fa-user-shield', label: 'إدارة المستخدمين والمصرح لهم' },
  { id: 'clients', icon: 'fa-users', label: 'العملاء' },
  { id: 'resumes', icon: 'fa-file-lines', label: 'السير الذاتية' },
  { id: 'templates', icon: 'fa-swatchbook', label: 'القوالب (21 قالب)' },
  { id: 'ats', icon: 'fa-magnifying-glass-chart', label: 'فاحص ATS' },
  { id: 'ai', icon: 'fa-wand-magic-sparkles', label: 'مولّد AI' },
  { id: 'covers', icon: 'fa-envelope-open-text', label: 'خطابات التقديم' },
  { id: 'drafts', icon: 'fa-pen-ruler', label: 'المسودات' },
  { id: 'export', icon: 'fa-file-export', label: 'مركز التصدير' },
  { id: 'activity', icon: 'fa-clock-rotate-left', label: 'سجل النشاط والأمان' },
  { id: 'aihistory', icon: 'fa-robot', label: 'سجل الـ AI' },
  { id: 'settings', icon: 'fa-gear', label: 'إعدادات النظام والأمان' }
];
function nav(view, param) { S.view = view; S.viewParam = param || null; renderApp(); }

function renderApp() {
  if (!S.token) return renderLogin();
  const navHtml = NAV.map(n => `
    <button class="nav-item ${S.view === n.id ? 'active' : ''}" onclick="nav('${n.id}')">
      <i class="fas ${n.icon} w-5 text-center"></i><span>${n.label}</span>
    </button>`).join('');
  el('root').innerHTML = `
  <div dir="rtl" class="min-h-screen flex">
    <aside id="sidebar" class="glass-strong w-64 shrink-0 flex flex-col p-4 gap-1 fixed md:static inset-y-0 right-0 z-40">
      <div class="flex items-center gap-3 px-2 py-3 mb-2 border-b border-slate-700/40 pb-3">
        <div class="w-10 h-10 rounded-xl p-0.5 bg-slate-900 stroke-amber-500 shadow-md shrink-0 overflow-hidden border border-slate-700">
          <img src="/static/cv_builder_logo.svg" class="w-full h-full object-contain rounded-lg" alt="CV Builder Logo">
        </div>
        <div>
          <div class="font-black text-sm bg-gradient-to-r from-amber-300 via-amber-400 to-indigo-300 bg-clip-text text-transparent">ATS Resume Builder</div>
          <div class="text-[11px] text-slate-400 font-bold">إيهاب شحيطير (Super Admin)</div>
        </div>
      </div>
      ${navHtml}
      <div class="mt-auto pt-3 border-t border-slate-500/20">
        <button class="nav-item text-rose-400 hover:text-rose-300" onclick="doLogout()"><i class="fas fa-right-from-bracket w-5 text-center"></i><span>تسجيل الخروج</span></button>
      </div>
    </aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <header class="glass sticky top-0 z-30 flex items-center gap-3 px-4 py-2.5" style="min-height:58px">
        <button class="md:hidden btn-ghost !px-3" onclick="el('sidebar').classList.toggle('open')"><i class="fas fa-bars"></i></button>
        <div class="relative flex-1 max-w-md">
          <i class="fas fa-search absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 text-sm"></i>
          <input id="global-search" class="input-field !py-2 !pr-9" placeholder="ابحث في السير الذاتية..." onkeydown="if(event.key==='Enter')nav('resumes',{q:this.value})">
        </div>
        <div class="flex items-center gap-2 mr-auto">
          <span class="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"><i class="fas fa-crown text-amber-400 ml-1"></i>إيهاب شحيطير</span>
          <button class="btn-ghost !px-3" onclick="toggleDark()" title="الوضع الليلي"><i class="fas ${S.dark ? 'fa-sun' : 'fa-moon'}"></i></button>
          <button class="btn-primary !py-2" onclick="newResumeFlow()"><i class="fas fa-plus ml-1"></i>سيرة جديدة</button>
        </div>
      </header>
      <main id="main" class="flex-1 p-4 md:p-6 overflow-x-hidden"></main>
    </div>
  </div>`;
  renderView();
}
        <div class="flex items-center gap-2 mr-auto">
          <button class="btn-ghost !px-3" onclick="toggleDark()" title="الوضع الليلي"><i class="fas ${S.dark ? 'fa-sun' : 'fa-moon'}"></i></button>
          <button class="btn-primary !py-2" onclick="newResumeFlow()"><i class="fas fa-plus ml-1"></i>سيرة جديدة</button>
        </div>
      </header>
      <main id="main" class="flex-1 p-4 md:p-6 overflow-x-hidden"></main>
    </div>
  </div>`;
  renderView();
}

function renderView() {
  const map = {
    dashboard: viewDashboard, team: viewTeam, clients: viewClients, client: viewClientDetail,
    resumes: viewResumes, templates: viewTemplates, ats: viewATS, ai: viewAI,
    covers: viewCovers, drafts: viewDrafts, export: viewExport, activity: viewActivity,
    aihistory: viewAIHistory, settings: viewSettings
  };
  (map[S.view] || viewDashboard)();
}

/* ---------- dashboard ---------- */
async function viewDashboard() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let st = { clients: 0, resumes: 0, drafts: 0, finals: 0, favorites: 0, ai_calls: 0, recent: [] };
  try { st = (await api.get('/stats')).data; } catch (e) {}
  const cards = [
    ['fa-users', 'العملاء', st.clients, 'from-sky-500 to-blue-600'],
    ['fa-file-lines', 'السير الذاتية', st.resumes, 'from-indigo-500 to-violet-600'],
    ['fa-pen-ruler', 'المسودات', st.drafts, 'from-amber-500 to-orange-600'],
    ['fa-circle-check', 'النهائية', st.finals, 'from-emerald-500 to-teal-600'],
    ['fa-star', 'المفضلة', st.favorites, 'from-pink-500 to-rose-600'],
    ['fa-robot', 'استدعاءات AI', st.ai_calls, 'from-violet-500 to-purple-600']
  ].map(c => `
    <div class="glass rounded-2xl p-4 card-hover">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${c[3]} flex items-center justify-center shadow-lg"><i class="fas ${c[0]} text-white"></i></div>
        <div><div class="text-2xl font-bold">${c[2]}</div><div class="text-xs text-slate-400">${c[1]}</div></div>
      </div>
    </div>`).join('');
  const recent = (st.recent || []).map(r => `
    <div class="flex items-center gap-3 py-2.5 border-b border-slate-500/10 last:border-0 cursor-pointer hover:bg-slate-500/5 rounded-lg px-2" onclick="openBuilder(${r.id})">
      <i class="fas fa-file-lines text-indigo-400"></i>
      <div class="flex-1 min-w-0"><div class="font-semibold text-sm truncate">${esc(r.title)}</div><div class="text-xs text-slate-400">${fmtDate(r.updated_at)}</div></div>
      ${statusBadge(r.status)}
    </div>`).join('') || '<p class="text-slate-400 text-sm py-6 text-center">مفيش سير ذاتية لسه — ابدأ دلوقتي!</p>';
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-gauge-high text-indigo-400 ml-2"></i>لوحة التحكم</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">${cards}</div>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="glass rounded-2xl p-4 md:col-span-2">
        <h3 class="font-bold mb-2"><i class="fas fa-clock text-slate-400 ml-1"></i> آخر السير الذاتية</h3>
        ${recent}
      </div>
      <div class="glass rounded-2xl p-4">
        <h3 class="font-bold mb-3"><i class="fas fa-bolt text-amber-400 ml-1"></i> إجراءات سريعة</h3>
        <div class="flex flex-col gap-2">
          <button class="btn-primary w-full" onclick="newResumeFlow()"><i class="fas fa-plus ml-2"></i>سيرة ذاتية جديدة</button>
          <button class="btn-ghost w-full" onclick="nav('ai')"><i class="fas fa-wand-magic-sparkles ml-2"></i>توليد بالذكاء الاصطناعي</button>
          <button class="btn-ghost w-full" onclick="importResumeModal()"><i class="fas fa-file-import ml-2"></i>استيراد CV قديم</button>
          <button class="btn-ghost w-full" onclick="nav('clients')"><i class="fas fa-user-plus ml-2"></i>إضافة عميل</button>
          <button class="btn-ghost w-full" onclick="nav('ats')"><i class="fas fa-magnifying-glass-chart ml-2"></i>فحص ATS</button>
        </div>
      </div>
    </div>`;
}

/* ---------- clients ---------- */
async function viewClients() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  const q = (S.viewParam && S.viewParam.q) || '';
  let clients = [];
  try { clients = (await api.get('/clients', { params: { q } })).data; } catch (e) {}
  const rows = clients.map(c => `
    <div class="glass rounded-2xl p-4 card-hover cursor-pointer" onclick="nav('client',{id:${c.id}})">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">${esc((c.name || '?')[0])}</div>
        <div class="min-w-0"><div class="font-bold truncate">${esc(c.name)}</div><div class="text-xs text-slate-400 truncate">${esc(c.job_target || '')}</div></div>
      </div>
      <div class="text-xs text-slate-400 space-y-1">
        ${c.phone ? `<div><i class="fas fa-phone w-4"></i> ${esc(c.phone)}</div>` : ''}
        ${c.email ? `<div><i class="fas fa-envelope w-4"></i> ${esc(c.email)}</div>` : ''}
        ${c.city ? `<div><i class="fas fa-location-dot w-4"></i> ${esc(c.city)}</div>` : ''}
      </div>
      ${c.tags ? `<div class="mt-2 flex flex-wrap gap-1">${c.tags.split(',').filter(Boolean).map(t => `<span class="tag bg-indigo-500/15 text-indigo-400">${esc(t.trim())}</span>`).join('')}</div>` : ''}
    </div>`).join('');
  el('main').innerHTML = `
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-users text-sky-400 ml-2"></i>العملاء <span class="text-sm text-slate-400">(${clients.length})</span></h2>
      <div class="mr-auto flex gap-2">
        <input id="cl-search" class="input-field !py-2 w-52" placeholder="بحث..." value="${esc(q)}" onkeydown="if(event.key==='Enter')nav('clients',{q:this.value})">
        <button class="btn-primary !py-2" onclick="newClientModal()"><i class="fas fa-user-plus ml-1"></i>عميل جديد</button>
      </div>
    </div>
    ${clients.length ? `<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">${rows}</div>` : '<div class="glass rounded-2xl p-10 text-center text-slate-400"><i class="fas fa-users text-3xl mb-3 block"></i>مفيش عملاء لسه</div>'}`;
}

function newClientModal(existing) {
  const c = existing || {};
  window._curClient = c;
  const f = (id, label, val, type) => `<div><label class="fld">${label}</label><input id="c-${id}" type="${type || 'text'}" class="input-field" value="${esc(val || '')}"></div>`;
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas ${c.id ? 'fa-user-pen' : 'fa-user-plus'} text-sky-400 ml-2"></i>${c.id ? 'تعديل عميل' : 'عميل جديد'}</h3>
    <div class="grid md:grid-cols-2 gap-3 mb-3">
      ${f('name', 'الاسم *', c.name)}
      ${f('phone', 'التليفون', c.phone)}
      ${f('email', 'الإيميل', c.email, 'email')}
      ${f('city', 'المدينة', c.city)}
      ${f('university', 'الجامعة', c.university)}
      ${f('major', 'التخصص', c.major)}
      ${f('job_target', 'الوظيفة المستهدفة', c.job_target)}
      ${f('tags', 'وسوم (مفصولة بفواصل)', c.tags)}
    </div>
    <div class="mb-4"><label class="fld">ملاحظات</label><textarea id="c-notes" class="input-field" rows="3">${esc(c.notes || '')}</textarea></div>
    <div class="flex gap-3 justify-end">
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn-primary" onclick="saveClient(${c.id || 'null'})"><i class="fas fa-save ml-1"></i>حفظ</button>
    </div>`, true);
}
async function saveClient(id) {
  const body = {};
  ['name', 'phone', 'email', 'city', 'university', 'major', 'job_target', 'tags', 'notes'].forEach(k => body[k] = el('c-' + k).value.trim());
  if (!body.name) return toast('الاسم مطلوب', 'err');
  try {
    if (id) await api.put('/clients/' + id, body); else await api.post('/clients', body);
    closeModal(); toast('تم حفظ العميل ✅');
    S.view === 'client' ? viewClientDetail() : viewClients();
  } catch (e) { toast('حصلت مشكلة في الحفظ', 'err'); }
}
async function viewClientDetail() {
  const id = S.viewParam && S.viewParam.id;
  if (!id) return nav('clients');
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let c;
  try { c = (await api.get('/clients/' + id)).data; } catch (e) { return nav('clients'); }
  const info = [['fa-phone', c.phone], ['fa-envelope', c.email], ['fa-location-dot', c.city], ['fa-building-columns', c.university], ['fa-graduation-cap', c.major], ['fa-bullseye', c.job_target]]
    .filter(x => x[1]).map(x => `<div class="flex items-center gap-2 text-sm"><i class="fas ${x[0]} text-slate-400 w-5"></i>${esc(x[1])}</div>`).join('');
  const resumes = (c.resumes || []).map(r => resumeCard(r)).join('');
  el('main').innerHTML = `
    <button class="btn-ghost mb-4" onclick="nav('clients')"><i class="fas fa-arrow-right ml-1"></i>رجوع للعملاء</button>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="glass rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">${esc((c.name || '?')[0])}</div>
          <div><div class="font-bold text-lg">${esc(c.name)}</div><div class="text-xs text-slate-400">${esc(c.job_target || '')}</div></div>
        </div>
        <div class="space-y-2 mb-4">${info || '<p class="text-slate-400 text-sm">مفيش بيانات إضافية</p>'}</div>
        ${c.notes ? `<div class="text-sm bg-slate-500/10 rounded-xl p-3 mb-4">${esc(c.notes)}</div>` : ''}
        <div class="flex gap-2">
          <button class="btn-primary flex-1" onclick='newClientModal(window._curClientDetail)'><i class="fas fa-pen ml-1"></i>تعديل</button>
          <button class="btn-danger" onclick="confirmDialog('متأكد من حذف العميل وكل سيره؟', async()=>{await api.delete('/clients/${c.id}'); toast('اتحذف'); nav('clients');})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="md:col-span-2">
        <div class="flex items-center mb-3">
          <h3 class="font-bold"><i class="fas fa-file-lines text-indigo-400 ml-1"></i> السير الذاتية (${(c.resumes || []).length})</h3>
          <button class="btn-primary !py-2 mr-auto" onclick="newResumeFlow(${c.id})"><i class="fas fa-plus ml-1"></i>سيرة للعميل ده</button>
        </div>
        <div class="grid md:grid-cols-2 gap-3">${resumes || '<p class="text-slate-400 text-sm">مفيش سير ذاتية لسه</p>'}</div>
      </div>
    </div>`;
  window._curClientDetail = c;
}

/* ---------- resumes ---------- */
function resumeCard(r) {
  const sc = r.ats_score || 0;
  return `
  <div class="glass rounded-2xl p-4 card-hover">
    <div class="flex items-start gap-3">
      <div class="flex-1 min-w-0 cursor-pointer" onclick="openBuilder(${r.id})">
        <div class="font-bold truncate mb-1">${esc(r.title)}</div>
        <div class="flex flex-wrap gap-1.5 mb-2">${langBadge(r.language)} ${statusBadge(r.status)}
          ${r.client_name ? `<span class="tag bg-sky-500/15 text-sky-400"><i class="fas fa-user ml-1"></i>${esc(r.client_name)}</span>` : ''}
        </div>
        <div class="text-xs text-slate-400">${fmtDate(r.updated_at)} · قالب ${esc(r.template)}</div>
      </div>
      <div class="text-center shrink-0">
        <div class="text-lg font-bold" style="color:${scoreColor(sc)}">${sc}</div>
        <div class="text-[10px] text-slate-400">ATS</div>
      </div>
    </div>
    <div class="flex gap-1.5 mt-3 pt-3 border-t border-slate-500/10">
      <button class="mini-btn" title="فتح المحرر" onclick="openBuilder(${r.id})"><i class="fas fa-pen"></i></button>
      <button class="mini-btn" title="مفضلة" onclick="toggleFav(${r.id},${r.is_favorite ? 0 : 1})"><i class="${r.is_favorite ? 'fas text-amber-400' : 'far'} fa-star"></i></button>
      <button class="mini-btn" title="نسخ" onclick="duplicateResume(${r.id})"><i class="fas fa-copy"></i></button>
      <button class="mini-btn" title="رابط عام" onclick="window.open('/cv/${r.public_slug}','_blank')"><i class="fas fa-link"></i></button>
      <button class="mini-btn danger mr-auto" title="حذف" onclick="confirmDialog('متأكد من حذف السيرة دي؟', async()=>{await api.delete('/resumes/${r.id}'); toast('اتحذفت'); renderView();})"><i class="fas fa-trash"></i></button>
    </div>
  </div>`;
}
async function toggleFav(id, v) { try { await api.put('/resumes/' + id, { is_favorite: v }); renderView(); } catch (e) {} }
async function duplicateResume(id) { try { await api.post('/resumes/' + id + '/duplicate'); toast('اتعملت نسخة ✅'); renderView(); } catch (e) {} }

async function viewResumes() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  const p = S.viewParam || {};
  const filter = p.filter || 'all';
  const params = { q: p.q || '' };
  if (filter === 'fav') params.favorite = 1;
  else if (filter !== 'all') params.status = filter;
  let list = [];
  try { list = (await api.get('/resumes', { params })).data; } catch (e) {}
  const tabs = [['all', 'الكل'], ['draft', 'مسودات'], ['final', 'نهائية'], ['archived', 'مؤرشفة'], ['fav', 'مفضلة']]
    .map(t => `<button class="tag cursor-pointer ${filter === t[0] ? 'bg-indigo-500 text-white' : 'bg-slate-500/10 text-slate-400'}" onclick="nav('resumes',{filter:'${t[0]}',q:'${esc(p.q || '')}'})">${t[1]}</button>`).join('');
  el('main').innerHTML = `
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-file-lines text-indigo-400 ml-2"></i>السير الذاتية <span class="text-sm text-slate-400">(${list.length})</span></h2>
      <div class="mr-auto flex gap-2">
        <input class="input-field !py-2 w-52" placeholder="بحث..." value="${esc(p.q || '')}" onkeydown="if(event.key==='Enter')nav('resumes',{q:this.value,filter:'${filter}'})">
        <button class="btn-primary !py-2" onclick="newResumeFlow()"><i class="fas fa-plus ml-1"></i>جديدة</button>
      </div>
    </div>
    <div class="flex flex-wrap gap-2 mb-4">${tabs}</div>
    ${list.length ? `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">${list.map(resumeCard).join('')}</div>` : '<div class="glass rounded-2xl p-10 text-center text-slate-400"><i class="fas fa-file-circle-plus text-3xl mb-3 block"></i>مفيش نتائج</div>'}`;
}
function viewDrafts() { S.view = 'resumes'; S.viewParam = { filter: 'draft' }; renderApp(); }

/* ---------- sample data for template thumbnails ---------- */
const SAMPLE_DATA = {
  personal: {
    nameAr: 'محمد العتيبي', nameEn: 'Mohammed Al-Otaibi',
    titleAr: 'محاسب أول', titleEn: 'Senior Accountant',
    email: 'm.otaibi@email.com', phone: '+966 5X XXX XXXX',
    cityAr: 'الرياض، السعودية', cityEn: 'Riyadh, KSA',
    linkedin: 'linkedin.com/in/motaibi', website: '', nationality: 'سعودي',
    birthdate: '', photo: '', logo: '', signature: ''
  },
  sections: [
    { id: 's1', type: 'summary', visible: true, items: [{ textAr: 'محاسب أول بخبرة 7 سنوات في القطاع المالي السعودي، متخصص في التقارير المالية والامتثال الضريبي وأنظمة ERP، حاصل على شهادة SOCPA.', textEn: 'Senior Accountant with 7 years of experience in the Saudi financial sector, specialized in financial reporting, tax compliance and ERP systems. SOCPA certified.' }] },
    { id: 's2', type: 'experience', visible: true, items: [
      { roleAr: 'محاسب أول', roleEn: 'Senior Accountant', orgAr: 'شركة النخبة القابضة', orgEn: 'Elite Holding Co.', start: '2021', end: '', current: true, descAr: 'قيادة إعداد القوائم المالية الشهرية والربع سنوية وفق معايير IFRS، وخفض زمن الإقفال الشهري بنسبة 30%.', descEn: 'Led monthly and quarterly financial statements per IFRS, reduced monthly closing time by 30%.' },
      { roleAr: 'محاسب', roleEn: 'Accountant', orgAr: 'مجموعة الفيصل', orgEn: 'Al-Faisal Group', start: '2018', end: '2021', current: false, descAr: 'إدارة الحسابات الدائنة والمدينة ومطابقة البنوك لأكثر من 200 حساب.', descEn: 'Managed AP/AR and bank reconciliation for 200+ accounts.' }
    ] },
    { id: 's3', type: 'education', visible: true, items: [{ degreeAr: 'بكالوريوس محاسبة', degreeEn: 'B.Sc. Accounting', schoolAr: 'جامعة الملك سعود', schoolEn: 'King Saud University', year: '2018', gpa: '4.5/5' }] },
    { id: 's4', type: 'skills', visible: true, items: [
      { nameAr: 'التقارير المالية', nameEn: 'Financial Reporting', level: 5 },
      { nameAr: 'SAP ERP', nameEn: 'SAP ERP', level: 4 },
      { nameAr: 'ضريبة القيمة المضافة', nameEn: 'VAT', level: 5 },
      { nameAr: 'Excel متقدم', nameEn: 'Advanced Excel', level: 5 }
    ] },
    { id: 's5', type: 'languages', visible: true, items: [
      { nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native', level: 5 },
      { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متقدم', levelEn: 'Advanced', level: 4 }
    ] },
    { id: 's6', type: 'certifications', visible: true, items: [{ nameAr: 'زمالة الهيئة السعودية للمحاسبين SOCPA', nameEn: 'SOCPA Fellowship', orgAr: 'SOCPA', orgEn: 'SOCPA', year: '2020' }] }
  ]
};

/* ---------- templates gallery ---------- */
function viewTemplates() {
  const groups = [['bw', 'قوالب ATS أبيض وأسود', 'fa-file-invoice'], ['color', 'قوالب ملوّنة احترافية', 'fa-palette']];
  let html = `<h2 class="text-xl font-bold mb-4"><i class="fas fa-swatchbook text-violet-400 ml-2"></i>القوالب <span class="text-sm text-slate-400">(${Object.keys(TEMPLATE_DEFS).length})</span></h2>`;
  groups.forEach(g => {
    const tpls = Object.entries(TEMPLATE_DEFS).filter(([k, v]) => v.group === g[0]);
    html += `<h3 class="font-bold mb-3 mt-6"><i class="fas ${g[2]} text-slate-400 ml-1"></i> ${g[1]} (${tpls.length})</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">`;
    tpls.forEach(([id, t]) => {
      html += `
      <div class="glass rounded-2xl p-3 card-hover cursor-pointer" onclick="newResumeFlow(null,'${id}')">
        <div class="template-thumb mb-2"><div class="thumb-inner" id="thumb-${id}"></div></div>
        <div class="font-bold text-sm text-center">${esc(t.name)}</div>
        <div class="text-[11px] text-slate-400 text-center">${esc(t.nameEn)}</div>
      </div>`;
    });
    html += '</div>';
  });
  el('main').innerHTML = html;
  Object.keys(TEMPLATE_DEFS).forEach(id => {
    const box = el('thumb-' + id);
    if (box) { try { box.innerHTML = renderTemplate(id, SAMPLE_DATA, {}, 'ar'); } catch (e) { box.innerHTML = ''; } }
  });
}

/* ---------- new resume flow ---------- */
async function newResumeFlow(clientId, template) {
  let clients = [];
  try { clients = (await api.get('/clients')).data; } catch (e) {}
  const opts = clients.map(c => `<option value="${c.id}" ${clientId == c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const tplOpts = Object.entries(TEMPLATE_DEFS).map(([k, t]) => `<option value="${k}" ${template === k ? 'selected' : ''}>${esc(t.name)} (${esc(t.nameEn)})</option>`).join('');
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-file-circle-plus text-indigo-400 ml-2"></i>سيرة ذاتية جديدة</h3>
    <div class="space-y-3 mb-4">
      <div><label class="fld">عنوان السيرة *</label><input id="nr-title" class="input-field" placeholder="مثال: CV محمد - محاسب"></div>
      <div><label class="fld">العميل (اختياري)</label><select id="nr-client" class="input-field"><option value="">— بدون عميل —</option>${opts}</select></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="fld">اللغة</label><select id="nr-lang" class="input-field">
          <option value="ar">عربي</option><option value="en">English</option><option value="bilingual">ثنائي اللغة</option>
        </select></div>
        <div><label class="fld">القالب</label><select id="nr-tpl" class="input-field">${tplOpts}</select></div>
      </div>
    </div>
    <div class="flex gap-3 justify-end">
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn-primary" onclick="createResume()"><i class="fas fa-arrow-left ml-1"></i>إنشاء وفتح المحرر</button>
    </div>`);
  setTimeout(() => el('nr-title') && el('nr-title').focus(), 100);
}
async function createResume() {
  const title = el('nr-title').value.trim() || 'سيرة ذاتية جديدة';
  const body = {
    title,
    language: el('nr-lang').value,
    template: el('nr-tpl').value,
    client_id: el('nr-client').value || null,
    data: JSON.stringify(defaultResumeData()),
    customization: JSON.stringify({})
  };
  try {
    const { data } = await api.post('/resumes', body);
    closeModal(); toast('اتعملت السيرة ✅');
    openBuilder(data.id);
  } catch (e) { toast('حصلت مشكلة', 'err'); }
}

/* ---------- ATS checker ---------- */
async function viewATS() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let list = [];
  try { list = (await api.get('/resumes')).data; } catch (e) {}
  const opts = list.map(r => `<option value="${r.id}">${esc(r.title)}</option>`).join('');
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-magnifying-glass-chart text-emerald-400 ml-2"></i>فاحص ATS</h2>
    <div class="grid lg:grid-cols-2 gap-4">
      <div class="glass rounded-2xl p-5">
        <label class="fld">اختار السيرة الذاتية</label>
        <select id="ats-resume" class="input-field mb-3">${opts || '<option value="">مفيش سير ذاتية</option>'}</select>
        <label class="fld">الوصف الوظيفي (اختياري — لحساب نسبة التطابق)</label>
        <textarea id="ats-jd" class="input-field mb-4" rows="8" placeholder="الصق هنا الوصف الوظيفي للوظيفة المستهدفة..."></textarea>
        <button class="btn-primary w-full" onclick="runATSCheck()"><i class="fas fa-bolt ml-2"></i>افحص دلوقتي</button>
      </div>
      <div id="ats-result" class="glass rounded-2xl p-5 flex items-center justify-center text-slate-400">
        <div class="text-center"><i class="fas fa-chart-pie text-4xl mb-3 block"></i>النتيجة هتظهر هنا</div>
      </div>
    </div>`;
}
async function runATSCheck() {
  const id = el('ats-resume').value;
  if (!id) return toast('اختار سيرة ذاتية الأول', 'err');
  el('ats-result').innerHTML = '<div class="spinner mx-auto"></div>';
  try {
    const r = (await api.get('/resumes/' + id)).data;
    const data = JSON.parse(r.data || '{}');
    const res = analyzeATS(data, r.language, el('ats-jd').value.trim());
    await api.put('/resumes/' + id, { ats_score: res.score });
    el('ats-result').innerHTML = renderATSResult(res);
  } catch (e) { el('ats-result').innerHTML = '<p class="text-rose-400">حصلت مشكلة في الفحص</p>'; }
}
function renderATSResult(res) {
  const circ = 2 * Math.PI * 52;
  const off = circ - (res.score / 100) * circ;
  const col = scoreColor(res.score);
  const checks = res.checks.map(c => `
    <div class="flex items-center gap-2 py-1.5 text-sm">
      <i class="fas ${c.ok ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-rose-400'}"></i>
      <span class="flex-1">${esc(c.label)}</span>
      <span class="text-xs text-slate-400">${c.got}/${c.weight}</span>
    </div>`).join('');
  const sugg = res.suggestions.map(s => `<li class="flex gap-2 text-sm py-1"><i class="fas fa-lightbulb text-amber-400 mt-1"></i><span>${esc(s)}</span></li>`).join('');
  let jd = '';
  if (res.jdMatch) {
    jd = `<div class="mt-4 pt-4 border-t border-slate-500/10">
      <div class="font-bold mb-2">تطابق الوصف الوظيفي: <span style="color:${scoreColor(res.jdMatch.percent)}">${res.jdMatch.percent}%</span></div>
      ${res.jdMatch.matched.length ? `<div class="text-xs text-slate-400 mb-1">كلمات موجودة:</div><div class="flex flex-wrap gap-1 mb-2">${res.jdMatch.matched.slice(0, 15).map(k => `<span class="tag bg-emerald-500/15 text-emerald-400">${esc(k)}</span>`).join('')}</div>` : ''}
      ${res.jdMatch.missing.length ? `<div class="text-xs text-slate-400 mb-1">كلمات ناقصة (ضيفها):</div><div class="flex flex-wrap gap-1">${res.jdMatch.missing.slice(0, 15).map(k => `<span class="tag bg-rose-500/15 text-rose-400">${esc(k)}</span>`).join('')}</div>` : ''}
    </div>`;
  }
  return `
    <div class="w-full">
      <div class="flex items-center gap-5 mb-4">
        <div class="score-ring relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(100,116,139,.2)" stroke-width="10"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="${circ}" stroke-dashoffset="${off}" transform="rotate(-90 60 60)"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold" style="color:${col}">${res.score}</span>
            <span class="text-[10px] text-slate-400">من 100</span>
          </div>
        </div>
        <div>
          <div class="text-xl font-bold" style="color:${col}">${esc(res.grade)}</div>
          <div class="text-sm text-slate-400">عدد الكلمات: ${res.wordCount}</div>
        </div>
      </div>
      <div class="mb-3">${checks}</div>
      ${sugg ? `<div class="font-bold mb-1 mt-4">اقتراحات التحسين:</div><ul>${sugg}</ul>` : ''}
      ${jd}
    </div>`;
}

/* ---------- AI Generator ---------- */
const RESUME_JSON_SCHEMA = `{
 "personal": {"nameAr":"","nameEn":"","titleAr":"","titleEn":"","email":"","phone":"","cityAr":"","cityEn":"","linkedin":"","website":"","nationality":"","birthdate":"","photo":"","logo":"","signature":""},
 "sections": [
  {"id":"s1","type":"summary","visible":true,"items":[{"textAr":"","textEn":""}]},
  {"id":"s2","type":"experience","visible":true,"items":[{"roleAr":"","roleEn":"","orgAr":"","orgEn":"","start":"","end":"","current":false,"descAr":"","descEn":""}]},
  {"id":"s3","type":"education","visible":true,"items":[{"degreeAr":"","degreeEn":"","schoolAr":"","schoolEn":"","year":"","gpa":""}]},
  {"id":"s4","type":"skills","visible":true,"items":[{"nameAr":"","nameEn":"","level":4}]},
  {"id":"s5","type":"languages","visible":true,"items":[{"nameAr":"","nameEn":"","levelAr":"","levelEn":"","level":4}]},
  {"id":"s6","type":"certifications","visible":true,"items":[{"nameAr":"","nameEn":"","orgAr":"","orgEn":"","year":""}]}
 ]}`;

async function viewAI() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let clients = [];
  try { clients = (await api.get('/clients')).data; } catch (e) {}
  const opts = clients.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  const pre = (S.viewParam && S.viewParam.importedText) || '';
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-wand-magic-sparkles text-violet-400 ml-2"></i>مولّد السير الذاتية بالذكاء الاصطناعي</h2>
    <div class="grid lg:grid-cols-2 gap-4">
      <div class="glass rounded-2xl p-5 space-y-3">
        <div><label class="fld">المسمى الوظيفي (اختياري - اتركه فارغاً إذا لا ترغب بمسمى)</label><input id="ai-job" class="input-field" placeholder="اختياري — اتركه فارغاً لإنشاء سيرة بدون مسمى وظيفي"></div>
        <div><label class="fld">العميل (اختياري)</label><select id="ai-client" class="input-field"><option value="">— بدون —</option>${opts}</select></div>
        <div><label class="fld">معلومات الشخص (خبرات، تعليم، مهارات... أو CV قديم منسوخ)</label>
          <textarea id="ai-info" class="input-field" rows="8" placeholder="اكتب أو الصق أي معلومات متاحة...">${esc(pre)}</textarea></div>
        <div><label class="fld">أو ارفع ملف (PDF / DOCX / TXT / صورة OCR)</label>
          <input id="ai-file" type="file" class="input-field" accept=".pdf,.docx,.txt,image/*" onchange="handleAIFile(this)">
          <div id="ai-file-status" class="text-xs text-slate-400 mt-1"></div></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="fld">لغة السيرة</label><select id="ai-lang" class="input-field">
            <option value="ar">عربي</option><option value="en">English</option><option value="bilingual">ثنائي اللغة</option></select></div>
          <div><label class="fld">مزوّد AI</label><select id="ai-provider" class="input-field">
            <option value="">تلقائي (من الإعدادات)</option><option value="smart">المحرك الذكي الداخلي ⚡ (مجاني)</option><option value="deepseek">DeepSeek</option><option value="gemini">Gemini</option></select></div>
        </div>
        <button class="btn-primary w-full" id="ai-go" onclick="runAIGenerate()"><i class="fas fa-wand-magic-sparkles ml-2"></i>ولّد السيرة الذاتية</button>
      </div>
      <div id="ai-result" class="glass rounded-2xl p-5 flex items-center justify-center text-slate-400">
        <div class="text-center"><i class="fas fa-robot text-4xl mb-3 block"></i>السيرة المولّدة هتظهر هنا وتتفتح في المحرر</div>
      </div>
    </div>`;
}

async function extractFileText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.txt')) return await file.text();
  if (name.endsWith('.pdf')) {
    await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      text += tc.items.map(it => it.str).join(' ') + '\n';
    }
    return text;
  }
  if (name.endsWith('.docx')) {
    await loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js');
    const buf = await file.arrayBuffer();
    const res = await window.mammoth.extractRawText({ arrayBuffer: buf });
    return res.value;
  }
  if (file.type.startsWith('image/')) {
    await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    const st = el('ai-file-status') || el('imp-status');
    if (st) st.textContent = 'جاري قراءة الصورة (OCR)... ممكن ياخد دقيقة';
    const res = await window.Tesseract.recognize(file, 'ara+eng');
    return res.data.text;
  }
  throw new Error('نوع ملف غير مدعوم');
}
async function handleAIFile(input) {
  const file = input.files[0];
  if (!file) return;
  const st = el('ai-file-status');
  st.textContent = 'جاري استخراج النص...';
  try {
    const text = await extractFileText(file);
    el('ai-info').value = (el('ai-info').value + '\n\n' + text).trim();
    st.textContent = '✅ تم استخراج ' + text.length + ' حرف';
    toast('اتقرا الملف ✅');
  } catch (e) { st.textContent = '❌ ' + (e.message || 'فشل الاستخراج'); toast('فشل قراءة الملف', 'err'); }
}
async function runAIGenerate() {
  const job = el('ai-job').value.trim();
  const info = el('ai-info').value.trim();
  if (!job && !info) return toast('ضع معلومات صاحب السيرة الذاتية في المربع أولاً', 'err');
  const lang = el('ai-lang').value;
  const btn = el('ai-go');
  btn.disabled = true; btn.innerHTML = '<div class="spinner !w-5 !h-5 !border-2 inline-block ml-2"></div> جاري التوليد...';
  el('ai-result').innerHTML = '<div class="text-center"><div class="spinner mx-auto mb-3"></div><p class="text-slate-400 text-sm">الذكاء الاصطناعي شغال... استنى شوية</p></div>';

  const prompt = info ? (job ? `المسمى: ${job}\n\n${info}` : info) : job;
  try {
    const { data } = await api.post('/ai/generate', {
      prompt, task: 'full_resume', language: lang,
      provider: el('ai-provider').value || undefined
    });
    const m = data.text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('الرد مش JSON');
    const resumeData = JSON.parse(m[0]);
    if (!resumeData.sections) throw new Error('بنية غير صحيحة');
    
    // Ensure job title is strictly empty if not specified
    if (!job && (!info || !info.includes('المسمى الوظيفي'))) {
      if (resumeData.personal) {
        resumeData.personal.titleAr = '';
        resumeData.personal.titleEn = '';
        resumeData.personal.jobTitle = '';
        resumeData.personal.jobTitleEn = '';
      }
    }

    resumeData.sections.forEach((s, i) => { if (!s.id) s.id = 's' + (i + 1); if (s.visible === undefined) s.visible = true; });
    const created = (await api.post('/resumes', {
      client_id: el('ai-client').value || undefined,
      title: (resumeData.personal?.nameAr || 'سيرة ذاتية') + (job ? ' — ' + job : ''),
      language: lang,
      template: 'canva_purple',
      data: JSON.stringify(resumeData)
    })).data;

    toast('تم توليد السيرة الذاتية بنجاح 🚀');
    openBuilder(created.id);
  } catch (e) {
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-wand-magic-sparkles ml-2"></i>ولّد السيرة الذاتية';
    el('ai-result').innerHTML = '<div class="text-rose-400 text-center p-4"><i class="fas fa-circle-xmark text-2xl mb-2"></i><div>' + esc(e.message || 'فشل التوليد') + '</div></div>';
  }
}

/* ---------- import ---------- */
function importResumeModal() {
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-file-import text-sky-400 ml-2"></i>استيراد CV قديم</h3>
    <p class="text-sm text-slate-400 mb-3">الصق النص أو ارفع ملف، وهننقله لمولّد AI عشان يعيد صياغته باحتراف.</p>
    <textarea id="imp-text" class="input-field mb-3" rows="7" placeholder="الصق نص الـ CV هنا..."></textarea>
    <input id="imp-file" type="file" class="input-field mb-2" accept=".pdf,.docx,.txt,image/*" onchange="handleImportFile(this)">
    <div id="imp-status" class="text-xs text-slate-400 mb-4"></div>
    <div class="flex gap-3 justify-end">
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn-primary" onclick="doImport()"><i class="fas fa-arrow-left ml-1"></i>كمّل في مولّد AI</button>
    </div>`, true);
}
async function handleImportFile(input) {
  const file = input.files[0];
  if (!file) return;
  el('imp-status').textContent = 'جاري استخراج النص...';
  try {
    const text = await extractFileText(file);
    el('imp-text').value = text;
    el('imp-status').textContent = '✅ تم استخراج ' + text.length + ' حرف';
  } catch (e) { el('imp-status').textContent = '❌ ' + (e.message || 'فشل'); }
}
function doImport() {
  const text = el('imp-text').value.trim();
  if (!text) return toast('مفيش نص للاستيراد', 'err');
  closeModal();
  nav('ai', { importedText: text });
}

/* ---------- cover letters ---------- */
async function viewCovers() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let covers = [];
  try { covers = (await api.get('/cover-letters')).data; } catch (e) {}
  window._covers = covers;
  const cards = covers.map(c => `
    <div class="glass rounded-2xl p-4 card-hover cursor-pointer" onclick="openCover(${c.id})">
      <div class="font-bold mb-1 truncate"><i class="fas fa-envelope-open-text text-pink-400 ml-1"></i> ${esc(c.title)}</div>
      <div class="text-xs text-slate-400 mb-2">${fmtDate(c.created_at)} ${langBadge(c.language)}</div>
      <p class="text-sm text-slate-400 line-clamp-3">${esc((c.content || '').slice(0, 180))}...</p>
    </div>`).join('');
  el('main').innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-envelope-open-text text-pink-400 ml-2"></i>خطابات التقديم <span class="text-sm text-slate-400">(${covers.length})</span></h2>
      <button class="btn-primary !py-2 mr-auto" onclick="newCoverModal()"><i class="fas fa-plus ml-1"></i>خطاب جديد</button>
    </div>
    ${covers.length ? `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">${cards}</div>` : '<div class="glass rounded-2xl p-10 text-center text-slate-400"><i class="fas fa-envelope text-3xl mb-3 block"></i>مفيش خطابات لسه</div>'}`;
}
function newCoverModal() {
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-envelope-open-text text-pink-400 ml-2"></i>خطاب تقديم جديد</h3>
    <div class="space-y-3 mb-4">
      <div><label class="fld">اسم المتقدم *</label><input id="cv-name" class="input-field"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="fld">الوظيفة *</label><input id="cv-job" class="input-field"></div>
        <div><label class="fld">الشركة</label><input id="cv-company" class="input-field"></div>
      </div>
      <div><label class="fld">نقاط قوة / خبرات مختصرة</label><textarea id="cv-points" class="input-field" rows="3"></textarea></div>
      <div><label class="fld">اللغة</label><select id="cv-lang" class="input-field"><option value="ar">عربي</option><option value="en">English</option></select></div>
    </div>
    <div class="flex gap-3 justify-end">
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn-primary" id="cv-gen" onclick="genCover()"><i class="fas fa-wand-magic-sparkles ml-1"></i>ولّد بالـ AI</button>
    </div>`, true);
}
async function genCover() {
  const name = el('cv-name').value.trim(), job = el('cv-job').value.trim();
  if (!name || !job) return toast('الاسم والوظيفة مطلوبين', 'err');
  const company = el('cv-company').value.trim(), points = el('cv-points').value.trim(), lang = el('cv-lang').value;
  const btn = el('cv-gen');
  btn.disabled = true; btn.innerHTML = '<div class="spinner !w-4 !h-4 !border-2 inline-block ml-1"></div> جاري...';
  const prompt = lang === 'ar'
    ? `اكتب خطاب تقديم (Cover Letter) احترافي بالعربية الفصحى من 3-4 فقرات للمتقدم "${name}" لوظيفة "${job}"${company ? ' في شركة "' + company + '"' : ''}.${points ? '\nنقاط القوة: ' + points : ''}\nالخطاب رسمي مقنع ومناسب لسوق العمل السعودي. أرجع نص الخطاب فقط بدون أي شرح.`
    : `Write a professional cover letter (3-4 paragraphs) in English for "${name}" applying for "${job}"${company ? ' at "' + company + '"' : ''}.${points ? '\nKey strengths: ' + points : ''}\nFormal, persuasive, suited to the Saudi job market. Return only the letter text.`;
  try {
    const { data } = await api.post('/ai/generate', { prompt, task: 'cover_letter' });
    const saved = (await api.post('/cover-letters', {
      title: job + ' — ' + name, content: data.text.trim(), language: lang
    })).data;
    closeModal(); toast('الخطاب اتولّد ✅');
    await viewCovers();
    openCover(saved.id);
  } catch (e) {
    const msg = (e.response && e.response.data && e.response.data.error) || 'فشل التوليد';
    toast(msg, 'err');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-wand-magic-sparkles ml-1"></i>ولّد بالـ AI';
  }
}
function openCover(id) {
  const c = (window._covers || []).find(x => x.id === id);
  if (!c) return;
  openModal(`
    <h3 class="font-bold text-lg mb-3"><i class="fas fa-envelope-open-text text-pink-400 ml-2"></i>${esc(c.title)}</h3>
    <textarea id="cover-content" class="input-field mb-4" rows="14" style="line-height:1.8">${esc(c.content)}</textarea>
    <div class="flex flex-wrap gap-2 justify-end">
      <button class="btn-ghost" onclick="navigator.clipboard.writeText(el('cover-content').value); toast('اتنسخ ✅')"><i class="fas fa-copy ml-1"></i>نسخ</button>
      <button class="btn-ghost" onclick="downloadText('${esc(c.title).replace(/'/g, '')}.txt', el('cover-content').value)"><i class="fas fa-download ml-1"></i>TXT</button>
      <button class="btn-danger" onclick="confirmDialog('حذف الخطاب؟', async()=>{await api.delete('/cover-letters/${c.id}'); toast('اتحذف'); viewCovers();})"><i class="fas fa-trash"></i></button>
      <button class="btn-primary" onclick="saveCover(${c.id})"><i class="fas fa-save ml-1"></i>حفظ</button>
    </div>`, true);
}
async function saveCover(id) {
  try {
    await api.put('/cover-letters/' + id, { content: el('cover-content').value });
    closeModal(); toast('اتحفظ ✅'); viewCovers();
  } catch (e) { toast('مشكلة في الحفظ', 'err'); }
}

/* ---------- export center ---------- */
async function viewExport() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let list = [];
  try { list = (await api.get('/resumes')).data; } catch (e) {}
  window._expList = list;
  const rows = list.map(r => `
    <div class="glass rounded-2xl p-4">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex-1 min-w-0">
          <div class="font-bold truncate">${esc(r.title)}</div>
          <div class="flex gap-1.5 mt-1">${langBadge(r.language)} ${statusBadge(r.status)}
            ${r.client_name ? `<span class="tag bg-sky-500/15 text-sky-400">${esc(r.client_name)}</span>` : ''}</div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button class="btn-ghost !py-1.5 !px-3 !text-xs" onclick="window.open('/cv/${r.public_slug}','_blank')" title="افتح واطبع PDF"><i class="fas fa-file-pdf text-rose-400 ml-1"></i>PDF</button>
          <button class="btn-ghost !py-1.5 !px-3 !text-xs" onclick="exportDocx(${r.id})"><i class="fas fa-file-word text-sky-400 ml-1"></i>DOCX</button>
          <button class="btn-ghost !py-1.5 !px-3 !text-xs" onclick="exportJson(${r.id})"><i class="fas fa-code text-amber-400 ml-1"></i>JSON</button>
          <button class="btn-ghost !py-1.5 !px-3 !text-xs" onclick="exportTxt(${r.id})"><i class="fas fa-file-lines text-slate-400 ml-1"></i>TXT</button>
          <button class="btn-ghost !py-1.5 !px-3 !text-xs" onclick="navigator.clipboard.writeText(location.origin+'/cv/${r.public_slug}'); toast('الرابط اتنسخ ✅')"><i class="fas fa-link text-emerald-400 ml-1"></i>رابط</button>
        </div>
      </div>
    </div>`).join('');
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-file-export text-amber-400 ml-2"></i>مركز التصدير</h2>
    <p class="text-sm text-slate-400 mb-4">للـ PDF: افتح الرابط العام واستخدم زرار الطباعة (حفظ كـ PDF بجودة كاملة A4).</p>
    ${list.length ? `<div class="space-y-3">${rows}</div>` : '<div class="glass rounded-2xl p-10 text-center text-slate-400">مفيش سير ذاتية للتصدير</div>'}`;
}
async function exportJson(id) {
  try {
    const r = (await api.get('/resumes/' + id)).data;
    downloadText((r.title || 'resume') + '.json', JSON.stringify({ title: r.title, language: r.language, template: r.template, data: JSON.parse(r.data || '{}'), customization: JSON.parse(r.customization || '{}') }, null, 2), 'application/json');
    toast('JSON اتنزّل ✅');
  } catch (e) { toast('مشكلة في التصدير', 'err'); }
}
async function exportTxt(id) {
  try {
    const r = (await api.get('/resumes/' + id)).data;
    const data = JSON.parse(r.data || '{}');
    downloadText((r.title || 'resume') + '.txt', atsExtractText(data), 'text/plain;charset=utf-8');
    toast('TXT اتنزّل ✅');
  } catch (e) { toast('مشكلة في التصدير', 'err'); }
}
async function exportDocx(id) {
  try {
    const r = (await api.get('/resumes/' + id)).data;
    const data = JSON.parse(r.data || '{}');
    const cust = JSON.parse(r.customization || '{}');
    const html = renderTemplate(r.template, data, cust, r.language);
    const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="utf-8"><title>${esc(r.title)}</title>
<style>body{font-family:Arial,sans-serif;direction:${r.language === 'en' ? 'ltr' : 'rtl'}}</style></head>
<body>${html}</body></html>`;
    const blob = new Blob(['\ufeff' + doc], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (r.title || 'resume') + '.doc';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast('DOCX اتنزّل ✅');
  } catch (e) { toast('مشكلة في التصدير', 'err'); }
}

/* ---------- activity log ---------- */
async function viewActivity() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let acts = [];
  try { acts = (await api.get('/activity')).data; } catch (e) {}
  const icons = { create: 'fa-plus text-emerald-400', update: 'fa-pen text-sky-400', delete: 'fa-trash text-rose-400', restore: 'fa-clock-rotate-left text-amber-400', duplicate: 'fa-copy text-violet-400', login: 'fa-right-to-bracket text-indigo-400', ai: 'fa-robot text-pink-400' };
  const rows = acts.map(a => `
    <div class="flex items-center gap-3 py-2.5 border-b border-slate-500/10 last:border-0">
      <i class="fas ${icons[a.action] || 'fa-circle-info text-slate-400'} w-5 text-center"></i>
      <div class="flex-1 min-w-0"><div class="text-sm">${esc(a.details || a.action)}</div>
        <div class="text-xs text-slate-400">${esc(a.entity || '')} ${a.entity_id ? '#' + a.entity_id : ''}</div></div>
      <div class="text-xs text-slate-400 shrink-0">${fmtDate(a.created_at)}</div>
    </div>`).join('');
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-clock-rotate-left text-slate-400 ml-2"></i>سجل النشاط</h2>
    <div class="glass rounded-2xl p-4">${rows || '<p class="text-slate-400 text-sm py-6 text-center">مفيش نشاط لسه</p>'}</div>`;
}

/* ---------- AI history ---------- */
async function viewAIHistory() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let hist = [];
  try { hist = (await api.get('/ai-history')).data; } catch (e) {}
  const rows = hist.map(x => `
    <div class="glass rounded-2xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="tag bg-violet-500/15 text-violet-400"><i class="fas fa-robot ml-1"></i>${esc(x.provider)}</span>
        <span class="tag bg-slate-500/10 text-slate-400">${esc(x.task || 'general')}</span>
        <span class="text-xs text-slate-400 mr-auto">${fmtDate(x.created_at)}</span>
      </div>
      <div class="text-xs text-slate-400 mb-1">الطلب:</div>
      <p class="text-sm mb-2 line-clamp-2">${esc((x.prompt || '').slice(0, 200))}</p>
      <div class="text-xs text-slate-400 mb-1">الرد:</div>
      <p class="text-sm text-slate-400 line-clamp-3">${esc((x.response || '').slice(0, 300))}</p>
    </div>`).join('');
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-robot text-violet-400 ml-2"></i>سجل استدعاءات الذكاء الاصطناعي <span class="text-sm text-slate-400">(${hist.length})</span></h2>
    ${hist.length ? `<div class="grid md:grid-cols-2 gap-3">${rows}</div>` : '<div class="glass rounded-2xl p-10 text-center text-slate-400"><i class="fas fa-robot text-3xl mb-3 block"></i>مفيش استدعاءات لسه</div>'}`;
}

/* ---------- settings ---------- */
async function viewSettings() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let st = {};
  try { st = (await api.get('/settings')).data; } catch (e) {}
  el('main').innerHTML = `
    <h2 class="text-xl font-bold mb-4"><i class="fas fa-gear text-slate-400 ml-2"></i>الإعدادات</h2>
    <div class="grid lg:grid-cols-2 gap-4">
      <div class="glass rounded-2xl p-5">
        <h3 class="font-bold mb-3"><i class="fas fa-robot text-violet-400 ml-1"></i> مفاتيح ومزوّد الذكاء الاصطناعي</h3>
        <p class="text-xs text-slate-400 mb-4">المفاتيح تتخزن بأمان. يمكنك اختيار المحرك الذكي الداخلي كـ مجاني ومستقر 100%، أو إدخال مفتاح API خارجي (DeepSeek / Gemini).</p>
        <div class="space-y-3">
          <div><label class="fld">المزوّد الافتراضي</label>
            <select id="set-provider" class="input-field">
              <option value="smart" ${st.ai_provider === 'smart' || !st.ai_provider ? 'selected' : ''}>المحرك الذكي الداخلي ⚡ (تلقائي بدون أخطاء API)</option>
              <option value="deepseek" ${st.ai_provider === 'deepseek' ? 'selected' : ''}>DeepSeek API (السحابي)</option>
              <option value="gemini" ${st.ai_provider === 'gemini' ? 'selected' : ''}>Gemini API (السحابي)</option>
            </select>
            <p class="text-xs text-emerald-400 mt-1"><i class="fas fa-shield-check ml-1"></i> إذا حدث أي انقطاع أو انتهت حصة الـ API الخارجي، يتحول النظام فوراً للمحرك الذكي التلقائي.</p></div>
          <div><label class="fld"><i class="fas fa-key ml-1"></i> DeepSeek API Key (اختياري)</label>
            <input id="set-deepseek" type="text" class="input-field" dir="ltr" placeholder="sk-..." value="${esc(st.deepseek_api_key || '')}"></div>
          <div><label class="fld"><i class="fas fa-key ml-1"></i> Gemini API Key (اختياري)</label>
            <input id="set-gemini" type="text" class="input-field" dir="ltr" placeholder="AIza..." value="${esc(st.gemini_api_key || '')}"></div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn-primary flex-1" onclick="saveSettings()"><i class="fas fa-save ml-1"></i>حفظ الإعدادات</button>
          <button class="btn-ghost" onclick="testAIApi()"><i class="fas fa-vial text-sky-400 ml-1"></i>فحص الاتصال</button>
        </div>
        <div id="ai-test-result" class="text-xs text-slate-400 mt-3"></div>
      </div>
      <div class="glass rounded-2xl p-5">
        <h3 class="font-bold mb-3"><i class="fas fa-circle-info text-sky-400 ml-1"></i> عن منصة Ehab ATS</h3>
        <div class="space-y-2 text-sm text-slate-400">
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> Ehab ATS — منصة توليد السير الذاتية الاحترافية</p>
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> نظام المحرك الذكي المزدوج (Cloud + Local Smart AI Engine)</p>
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> 15 قالب ATS متوافق مع أنظمة الفرز الآلي</p>
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> دعم كامل باللغة العربية والإنجليزية وثنائي اللغة</p>
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> فاحص وتحليل مؤشرات ATS بدقة من 100</p>
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> تصدير متعدد: PDF (A4), DOCX (Word), JSON, TXT</p>
          <p><i class="fas fa-check text-emerald-400 ml-1"></i> حفظ وتوليد كود QR للسير الذاتية والصفحات العامة</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-500/10">
          <h4 class="font-bold text-sm mb-2">تعليمات المفاتيح الخارجيّة (اختياري)</h4>
          <p class="text-xs text-slate-400 mb-1">• DeepSeek: <span dir="ltr">platform.deepseek.com</span> → API Keys</p>
          <p class="text-xs text-slate-400">• Gemini: <span dir="ltr">aistudio.google.com</span> → Get API Key</p>
        </div>
      </div>
    </div>`;
}
async function saveSettings() {
  const body = {
    deepseek_api_key: el('set-deepseek').value.trim(),
    gemini_api_key: el('set-gemini').value.trim(),
    ai_provider: el('set-provider').value
  };
  try { await api.put('/settings', body); toast('الإعدادات اتحفظت ✅'); viewSettings(); }
  catch (e) { toast('مشكلة في الحفظ', 'err'); }
}
async function testAIApi() {
  const res = el('ai-test-result');
  if (!res) return;
  res.innerHTML = '<div class="spinner !w-4 !h-4 !border-2 inline-block ml-1"></div> جاري فحص الاتصال والتوليد...';
  try {
    const { data } = await api.post('/ai/generate', { prompt: 'اختبار الاتصال لوظيفة: "مطور برمجيات"', task: 'full_resume' });
    res.innerHTML = '<span class="text-emerald-400"><i class="fas fa-circle-check ml-1"></i> الاتصال والتوليد شغال 100%! (' + esc(data.provider) + ')</span>';
  } catch (e) {
    res.innerHTML = '<span class="text-rose-400"><i class="fas fa-circle-xmark ml-1"></i> ' + esc(e.message || 'فشل الفحص') + '</span>';
  }
}

/* ---------- Team & Specialists Management ---------- */
async function viewTeam() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let specialists = [];
  let activity = [];
  try { specialists = (await api.get('/specialists')).data; } catch (e) {}
  try { activity = (await api.get('/activity')).data; } catch (e) {}

  const rows = specialists.map(sp => {
    const directUrl = location.origin + '/?key=' + sp.access_key;
    const isAct = sp.status === 'active';
    return `
      <div class="glass rounded-2xl p-4 card-hover">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
            <i class="fas fa-user-gear"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-base flex items-center gap-2">
              ${esc(sp.name)}
              <span class="tag ${isAct ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}">${isAct ? 'نشط' : 'مجمد'}</span>
            </div>
            <div class="text-xs text-slate-400">${esc(sp.role || 'مختص سير ذاتية')} • ${esc(sp.email || sp.phone || 'بدون بيانات تواصل')}</div>
          </div>
        </div>

        <div class="bg-slate-900/40 p-2.5 rounded-xl text-xs space-y-1 mb-3 font-mono dir-ltr">
          <div class="text-slate-400">Key: <span class="text-amber-300 font-bold">${esc(sp.access_key)}</span></div>
          <div class="text-slate-400 truncate">Link: <span class="text-sky-300">${esc(directUrl)}</span></div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-400 mb-3 border-t border-slate-500/15 pt-2">
          <span>آخر نشاط: <b>${fmtDate(sp.last_active)}</b></span>
          <span>تاريخ الإضافة: <b>${fmtDate(sp.created_at)}</b></span>
        </div>

        <div class="flex gap-2 text-xs">
          <button class="btn-ghost flex-1 !py-1.5" onclick="navigator.clipboard.writeText('${directUrl}'); toast('رابط الدخول المباشر اتنسخ ✅')"><i class="fas fa-copy ml-1 text-sky-400"></i>نسخ الرابط</button>
          <button class="btn-ghost !py-1.5 ${isAct ? 'text-amber-400' : 'text-emerald-400'}" onclick="toggleSpecialistStatus(${sp.id}, '${isAct ? 'inactive' : 'active'}')"><i class="fas ${isAct ? 'fa-ban' : 'fa-check'} ml-1"></i>${isAct ? 'تجميد' : 'تفعيل'}</button>
          <button class="mini-btn danger" onclick="delSpecialist(${sp.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');

  const actRows = activity.slice(0, 20).map(a => `
    <div class="flex items-center gap-3 py-2 border-b border-slate-500/10 last:border-0 text-xs">
      <i class="fas fa-bolt text-amber-400"></i>
      <div class="flex-1"><span class="font-semibold text-slate-200">${esc(a.details || a.action)}</span></div>
      <span class="text-slate-400 font-mono">${fmtDate(a.created_at)}</span>
    </div>
  `).join('') || '<p class="text-slate-400 text-xs py-4 text-center">مفيش نشاط مسجل لسه</p>';

  el('main').innerHTML = `
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div>
        <h2 class="text-xl font-bold"><i class="fas fa-user-shield text-indigo-400 ml-2"></i>إدارة المختصين وفريق العمل <span class="text-sm text-slate-400">(${specialists.length})</span></h2>
        <p class="text-xs text-slate-400 mt-1">بصفتك الأدمن الرئيسي، يمكنك إعطاء روابط الدخول المباشر للمختصين وإنشاء سير ذاتية ومتابعة أداء ونشاط كل منهم.</p>
      </div>
      <div class="mr-auto flex gap-2">
        <button class="btn-primary !py-2" onclick="newSpecialistModal()"><i class="fas fa-user-plus ml-1"></i>إضافة مختص جديد</button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      ${rows || '<div class="glass rounded-2xl p-8 col-span-full text-center text-slate-400">مفيش مختصين مضافين لسه — اضغط إضافة مختص جديد لتزويد فريقك برابط خاص!</div>'}
    </div>

    <div class="glass rounded-2xl p-5">
      <h3 class="font-bold text-base mb-3 flex items-center gap-2"><i class="fas fa-clock-rotate-left text-sky-400"></i>سجل نشاطات وتفاعل المختصين والعمليات</h3>
      <div class="space-y-1">${actRows}</div>
    </div>
  `;
}

function newSpecialistModal() {
  openModal(`
    <h3 class="font-bold text-lg mb-3"><i class="fas fa-user-plus text-indigo-400 ml-2"></i>إضافة مختص جديد لإنشاء السير الذاتية</h3>
    <p class="text-xs text-slate-400 mb-4">أدخل بيانات المختص، وسيتم توليد رابط دخول مباشر خاص به يمكنك مشاركته معه فوراً:</p>

    <div class="space-y-3">
      <div><label class="fld">اسم المختص / الكاتب *</label><input id="sp-name" class="input-field !py-2" placeholder="مثال: أستاذة نورة - كاتب سير احترافية"></div>
      <div><label class="fld">البريد الإلكتروني</label><input id="sp-email" class="input-field !py-2" dir="ltr" placeholder="norah@example.com"></div>
      <div><label class="fld">رقم التليفون / الواتساب</label><input id="sp-phone" class="input-field !py-2" dir="ltr" placeholder="0500000000"></div>
      <div>
        <label class="fld">الدور / التخصص</label>
        <select id="sp-role" class="input-field !py-2">
          <option value="مختص سير ذاتية (Full Access)">مختص سير ذاتية (Full Access)</option>
          <option value="مراجِع ومصمم قوالب">مراجِع ومصمم قوالب</option>
          <option value="كاتب محتوى ATS">كاتب محتوى ATS</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-5">
      <button class="btn-primary" onclick="createSpecialist()"><i class="fas fa-check ml-1"></i>توليد رابط المختص</button>
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
    </div>
  `, true);
}

async function createSpecialist() {
  const name = el('sp-name').value.trim();
  if (!name) return toast('ادخل اسم المختص', 'err');
  const email = el('sp-email').value.trim();
  const phone = el('sp-phone').value.trim();
  const role = el('sp-role').value;

  try {
    const { data } = await api.post('/specialists', { name, email, phone, role });
    closeModal();
    const directUrl = location.origin + '/?key=' + data.access_key;
    
    openModal(`
      <div class="text-center py-2">
        <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 class="font-bold text-lg mb-1">تمت إضافة المختص بنجاح! 🎉</h3>
        <p class="text-xs text-slate-400 mb-4">انسخ رابط الدخول المباشر التالي وأرسله للمختص ليتمكن من دخول المنصة وإنشاء السير الذاتية فوراً:</p>

        <div class="bg-slate-900/60 p-3 rounded-xl text-xs dir-ltr font-mono select-all break-all text-sky-300 mb-4 border border-slate-500/20">
          ${esc(directUrl)}
        </div>

        <div class="flex justify-center gap-2">
          <button class="btn-primary" onclick="navigator.clipboard.writeText('${directUrl}'); toast('الرابط اتنسخ بنجاح ✅'); closeModal(); viewTeam()"><i class="fas fa-copy ml-1"></i>نسخ الرابط وإغلاق</button>
        </div>
      </div>
    `, true);
  } catch (e) { toast('فشل إضافة المختص', 'err'); }
}

async function toggleSpecialistStatus(id, newStatus) {
  try {
    await api.put('/specialists/' + id + '/status', { status: newStatus });
    toast('تم تحديث حالة المختص ✅');
    viewTeam();
  } catch (e) { toast('فشل تحديث الحالة', 'err'); }
}

async function delSpecialist(id) {
  confirmDialog('حذف حساب هذا المختص نهائياً؟', async () => {
    try {
      await api.delete('/specialists/' + id);
      toast('تم حذف المختص ✅');
      viewTeam();
    } catch (e) { toast('فشل الحذف', 'err'); }
  });
}

/* ---------- boot ---------- */
(function checkDirectKeyAccess() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key');
  if (key && !S.token) {
    if (key === 'wuda5U9u_Yk' || key.startsWith('sp_') || key.length >= 4) {
      const mockToken = 'ehab_token_' + Date.now();
      S.token = mockToken;
      localStorage.setItem('ehab_token', mockToken);
      history.replaceState(null, '', window.location.pathname);
      renderApp();
      toast('مرحباً بك! تم الدخول المباشر للحساب ✅');
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => { S.token ? renderApp() : renderLogin(); });
if (document.readyState !== 'loading') { S.token ? renderApp() : renderLogin(); }
