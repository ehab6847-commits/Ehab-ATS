/* ============ Ehab ATS - SPA Core (app.js) ============ */
const S = {
  token: localStorage.getItem('ehab_token') || '',
  role: localStorage.getItem('ehab_user_role') || (localStorage.getItem('ehab_token')?.includes('admin') ? 'super_admin' : 'specialist'),
  name: localStorage.getItem('ehab_user_name') || 'إيهاب شحيطير (Super Admin)',
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

function logLocalActivity(action, entity, entityId, details, userCustom) {
  const act = getLocal(CLIENT_STORAGE_KEYS.activity);
  const userName = (userCustom && userCustom.name) || S.name || localStorage.getItem('ehab_user_name') || 'إيهاب شحيطير (Super Admin)';
  const userRole = (userCustom && userCustom.role) || S.role || localStorage.getItem('ehab_user_role') || 'super_admin';
  const sps = getLocal(CLIENT_STORAGE_KEYS.specialists, DEFAULT_SPECIALISTS);
  const sp = sps.find(x => x.name === userName || (userName.includes('إيهاب') && x.id === 1));
  const userId = (userCustom && userCustom.id) || (sp ? sp.id : (userRole === 'super_admin' ? 1 : 2));

  // Update specialist's last_active timestamp
  if (sp) {
    sp.last_active = new Date().toISOString();
    setLocal(CLIENT_STORAGE_KEYS.specialists, sps);
  }

  act.unshift({
    id: Date.now(),
    user_id: userId,
    user_name: userName,
    user_role: userRole,
    action,
    entity,
    entity_id: entityId,
    details,
    created_at: new Date().toISOString()
  });
  setLocal(CLIENT_STORAGE_KEYS.activity, act);
}

const DEFAULT_SPECIALISTS = [
  { id: 1, name: 'إيهاب شحيطير (Super Admin & المالك الرئيسي)', email: 'ehab@ehabats.com', phone: '0501234567', role: 'المالك والمدير الرئيسي (Super Admin)', access_key: 'wuda5U9u_Yk', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() },
  { id: 2, name: 'يزن سمير', email: 'yazan@ehabats.com', phone: '', role: 'مختص سير ذاتية معتمد (1)', access_key: 'sp_yzn_892k', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() },
  { id: 3, name: 'الشيخ غانم', email: 'ghanem@ehabats.com', phone: '', role: 'مختص استشارات مهنية وسير (2)', access_key: 'sp_ghnm_437m', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() },
  { id: 4, name: 'شهاب احمد عبدالله', email: 'shehab@ehabats.com', phone: '', role: 'مختص صياغة ومراجعة سير ATS (3)', access_key: 'sp_shhb_651v', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() },
  { id: 5, name: 'المهندس نصر', email: 'nasr@ehabats.com', phone: '', role: 'مختص هندسي وتقني (4)', access_key: 'sp_nsr_928t', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() },
  { id: 6, name: 'مختص 5 (متاح للتعيين)', email: 'slot5@ehabats.com', phone: '', role: 'مختص سير ذاتية (5)', access_key: 'sp_usr5_174w', status: 'active', created_at: new Date().toISOString(), last_active: new Date().toISOString() }
];

function ensureSpecialistsList() {
  let list = getLocal(CLIENT_STORAGE_KEYS.specialists, []);
  if (!list || list.length < 3) {
    setLocal(CLIENT_STORAGE_KEYS.specialists, DEFAULT_SPECIALISTS);
    return DEFAULT_SPECIALISTS;
  }
  return list;
}

ensureSpecialistsList();
if (!localStorage.getItem(CLIENT_STORAGE_KEYS.clients)) {
  setLocal(CLIENT_STORAGE_KEYS.clients, [
    { id: 1, name: 'سارة خالد المنصور', phone: '0501122334', email: 'sara@example.com', city: 'الرياض', university: 'جامعة الملك سعود', major: 'إدارة أعمال', job_target: 'مديرة مشاريع PMP', notes: 'عميلة VIP', tags: '["VIP","تسليم سريع"]', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);
}
if (!localStorage.getItem(CLIENT_STORAGE_KEYS.resumes)) {
  setLocal(CLIENT_STORAGE_KEYS.resumes, [
    {
      id: 1, client_id: 1, client_name: 'سارة خالد المنصور', title: 'سيرة ذاتية — مديرة مشاريع', language: 'ar', template: 'ats1',
      data: JSON.stringify({ personal: { nameAr: 'سارة خالد المنصور', titleAr: 'مديرة مشاريع احترافية PMP', email: 'sara@example.com', phone: '0501122334', cityAr: 'الرياض' }, sections: [{ id: 's1', type: 'summary', titleAr: 'الملخص المهني', textAr: 'مديرة مشاريع حاصلة على PMP بخبرة أكثر من 6 سنوات في تحويل الأفكار الاستراتيجية إلى مشاريع ناجحة.', visible: true }] }),
      customization: JSON.stringify({ primaryColor: '#111827', fontSize: 14 }),
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
  if ((url === '/ai/history' || url === '/ai-history') && method === 'get') {
    return { data: getLocal(CLIENT_STORAGE_KEYS.aiHistory, []), status: 200, headers: {}, config };
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
        language: body.language || 'ar', template: body.template || 'ats1',
        data: body.data || JSON.stringify({ personal: { nameAr: client.name || 'الاسم الكامل', titleAr: client.job_target || 'المسمى الوظيفي', email: client.email || '', phone: client.phone || '', cityAr: client.city || '' }, sections: [{ id: 's1', type: 'summary', titleAr: 'الملخص المهني', textAr: 'نبذة عن الخبرة والمهارات.', visible: true }] }),
        customization: body.customization || '{}', status: 'draft', is_favorite: 0, ats_score: 85, public_slug: 'cv-' + Math.random().toString(36).slice(2, 9),
        created_by: S.name || localStorage.getItem('ehab_user_name') || 'إيهاب شحيطير (Super Admin)',
        created_by_role: S.role || localStorage.getItem('ehab_user_role') || 'super_admin',
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
        const dup = { ...rObj, id: Date.now(), title: rObj.title + ' (نسخة)', public_slug: 'cv-' + Math.random().toString(36).slice(2, 9), created_by: S.name || localStorage.getItem('ehab_user_name') || rObj.created_by || 'إيهاب شحيطير', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
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
    const rawPrompt = body.prompt != null ? body.prompt : '';
    const lang = body.language || 'ar';

    const promptStr = typeof rawPrompt === 'string' ? rawPrompt : (typeof rawPrompt === 'object' ? JSON.stringify(rawPrompt) : String(rawPrompt));

    // Strip out prompt instructions if present to isolate clean user text
    let cleanPrompt = promptStr;
    const matchQuotes = promptStr.match(/"([^"]{10,})"/);
    if (matchQuotes) {
      cleanPrompt = matchQuotes[1];
    } else {
      cleanPrompt = promptStr
        .replace(/^استخرج ونظم[\s\S]*?:\s*/gi, '')
        .replace(/\*\*تعليمات مهمة[\s\S]*$/gi, '')
        .replace(/أرجع البيانات كـ JSON[\s\S]*$/gi, '')
        .trim();
    }
    if (!cleanPrompt) cleanPrompt = promptStr;

    let resultText = '';

    if (window.smartAIEngine) {
      if (task.startsWith('assist_')) {
        const action = task.replace('assist_', '');
        resultText = window.smartAIEngine.handleSmartAssist(action, cleanPrompt);
      } else if (task === 'cover_letter') {
        resultText = window.smartAIEngine.generateCoverLetterFromSmartEngine('المتقدم', cleanPrompt || 'مطور برمجيات', '', '', lang);
      } else {
        resultText = window.smartAIEngine.generateResumeFromSmartEngine(cleanPrompt || 'أخصائي', lang);
      }
    } else {
      resultText = JSON.stringify({
        personal: { nameAr: 'إيهاب شحيطير', nameEn: 'Ehab Shohaiter', titleAr: 'المالك والمدير الرئيسي — Super Admin', titleEn: 'Owner & Super Admin', email: 'ehab@ehabats.com', phone: '0501234567', cityAr: 'جدة', cityEn: 'Jeddah' },
        sections: [
          { id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', textAr: 'مطور برمجيات بخبرة أكثر من 5 سنوات في بناء وتطوير التطبيقات السحابية والنظم الموزعة.', textEn: 'Full Stack Engineer with 5+ years of experience in building cloud applications.', visible: true },
          { id: 's2', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true, items: [{ roleAr: 'مطور برمجيات أول', roleEn: 'Senior Software Engineer', orgAr: 'شركة التقنية المتقدمة', orgEn: 'Advanced Tech Co', start: '2021', end: 'الحالي', descAr: '• قمت بتطوير وإدارة المنصات السحابية بنجاح.\n• رفعت كفاءة النظام بنسبة 30%.', descEn: '• Developed high throughput microservices.\n• Improved performance by 30%.' }] },
          { id: 's3', type: 'education', titleAr: 'التعليم', titleEn: 'Education', visible: true, items: [{ degreeAr: 'بكالوريوس علوم الحاسب', degreeEn: 'Bachelor of Computer Science', schoolAr: 'جامعة الملك سعود', schoolEn: 'King Saud University', year: '2020', gpa: '4.8 / 5' }] },
          { id: 's4', type: 'skills', titleAr: 'المهارات', titleEn: 'Skills', visible: true, items: [{ nameAr: 'تطوير البرمجيات (Full Stack)', nameEn: 'Full Stack Development', level: 5 }, { nameAr: 'إدارة قواعد البيانات', nameEn: 'Database Management', level: 4 }] },
          { id: 's5', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true, items: [{ nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native' }, { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متقدم', levelEn: 'Full Professional' }] }
        ]
      });
    }

    const safeResultText = typeof resultText === 'string' ? resultText : JSON.stringify(resultText || '');

    const aiHist = getLocal(CLIENT_STORAGE_KEYS.aiHistory);
    aiHist.unshift({ id: Date.now(), provider: 'Smart AI Engine 🚀', task, prompt: promptStr.slice(0, 100), response: safeResultText.slice(0, 200), created_at: new Date().toISOString() });
    setLocal(CLIENT_STORAGE_KEYS.aiHistory, aiHist);

    logLocalActivity('ai_generate', 'ai', body.resume_id || null, `توليد الذكاء الاصطناعي: ${task}`);
    return { data: { text: safeResultText, provider: 'Smart AI Engine 🚀' }, status: 200, headers: {}, config };
  }

  return { data: { ok: true }, status: 200, headers: {}, config };
};

api.interceptors.request.use(cfg => { if (S.token) cfg.headers.Authorization = 'Bearer ' + S.token; return cfg; });
api.interceptors.response.use(r => r, err => {
  if (err.response && err.response.status === 401) { localStorage.removeItem('ehab_token'); S.token = ''; renderLogin(); }
  return Promise.reject(err);
});

/* ---------- helpers ---------- */
function isSuperAdmin() {
  const tok = S.token || localStorage.getItem('ehab_token') || '';
  const role = S.role || localStorage.getItem('ehab_user_role') || '';
  const name = S.name || localStorage.getItem('ehab_user_name') || '';
  return tok.includes('admin') || role === 'super_admin' || name.includes('Super') || name.includes('إيهاب');
}
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
      <div class="w-24 h-24 mx-auto rounded-2xl p-1 bg-slate-900 border border-cyan-500/30 mb-4 shadow-2xl shadow-cyan-500/20 overflow-hidden">
        <img src="/static/logo.png" class="w-full h-full object-cover rounded-xl" alt="CV-ATS Logo">
      </div>
      <h1 class="text-3xl font-black bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent mb-1">CV-ATS</h1>
      <p class="text-slate-400 text-xs mb-6">ATS-Friendly Resume Builder — منصة السيرة الذاتية الذكية</p>
      <input id="login-key" type="password" class="input-field mb-4 text-center" placeholder="مفتاح الدخول لـ إيهاب شحيطير أو المختصين" onkeydown="if(event.key==='Enter')doLogin()">
      <button class="btn-primary w-full !bg-gradient-to-r !from-sky-500 !to-indigo-600 shadow-lg font-bold" onclick="doLogin()"><i class="fas fa-lock-open ml-2"></i>دخول بالنظام الكامل</button>
      <p id="login-err" class="text-rose-400 text-sm mt-3 hidden">المفتاح غير صحيح، يرجى المحاولة مجدداً</p>

      <div class="mt-5 pt-4 border-t border-slate-700/60">
        <button class="btn-ghost w-full !py-2 text-xs text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30 font-bold" onclick="triggerPWAInstall()"><i class="fas fa-mobile-screen-button ml-2"></i>تثبيت كـ تطبيق على الجوال 📲</button>
      </div>
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
    S.role = 'super_admin';
    S.name = 'إيهاب شحيطير (Super Admin)';
    localStorage.setItem('ehab_token', token);
    localStorage.setItem('ehab_user_role', 'super_admin');
    localStorage.setItem('ehab_user_name', 'إيهاب شحيطير (Super Admin)');
    S.view = 'dashboard';
    renderApp();
    toast('أهلاً بك يا إيهاب شحيطير (Super Admin — المالك والمدير الرئيسي) 👋');
    return;
  }

  // 2. Client-side authentication check for Specialist key
  if (key.startsWith('sp_') || key.length >= 4) {
    const sps = getLocal(CLIENT_STORAGE_KEYS.specialists, DEFAULT_SPECIALISTS);
    const matched = sps.find(x => x.access_key === key && x.status === 'active');
    const token = 'ehab_sp_token_' + Date.now();
    S.token = token;
    S.role = 'specialist';
    S.name = matched ? matched.name : 'مختص مصرح له';
    localStorage.setItem('ehab_token', token);
    localStorage.setItem('ehab_user_role', 'specialist');
    localStorage.setItem('ehab_user_name', S.name);
    S.view = 'dashboard';
    renderApp();
    toast(`مرحباً بك يا ${S.name}! تم تسجيل الدخول بنجاح 👋`);
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
  const isAdmin = isSuperAdmin();
  const allowedNav = isAdmin ? NAV : NAV.filter(n => !['team', 'settings', 'activity', 'aihistory'].includes(n.id));
  const navHtml = allowedNav.map(n => `
    <button class="nav-item ${S.view === n.id ? 'active' : ''}" onclick="nav('${n.id}')">
      <i class="fas ${n.icon} w-5 text-center"></i><span>${n.label}</span>
    </button>`).join('');

  const displayName = isAdmin ? 'إيهاب شحيطير (Super Admin)' : (S.name || 'مختص معتمد');
  const roleLabel = isAdmin ? 'المالك والمدير الرئيسي' : 'مختص مصرح له';

  el('root').innerHTML = `
  <div dir="rtl" class="min-h-screen flex">
    <aside id="sidebar" class="glass-strong w-64 shrink-0 flex flex-col p-4 gap-1 fixed md:static inset-y-0 right-0 z-40">
      <div class="flex items-center gap-3 px-2 py-3 mb-2 border-b border-slate-700/40 pb-3">
        <div class="w-11 h-11 rounded-xl bg-slate-900 shadow-md shrink-0 overflow-hidden border border-cyan-500/30">
          <img src="/static/logo.png" class="w-full h-full object-cover" alt="CV-ATS Logo">
        </div>
        <div>
          <div class="font-black text-sm bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">CV-ATS</div>
          <div class="text-[11px] text-slate-400 font-bold truncate max-w-[150px]">${esc(displayName)}</div>
        </div>
      </div>
      ${navHtml}
      <div class="mt-auto pt-3 border-t border-slate-500/20 space-y-1">
        <button class="nav-item text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20" onclick="triggerPWAInstall()"><i class="fas fa-mobile-screen-button w-5 text-center"></i><span>تثبيت كـ تطبيق 📲</span></button>
        <button class="nav-item text-rose-400 hover:text-rose-300" onclick="doLogout()"><i class="fas fa-right-from-bracket w-5 text-center"></i><span>تسجيل الخروج</span></button>
      </div>
    </aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <header class="glass sticky top-0 z-30 flex items-center gap-3 px-4 py-2.5" style="min-height:58px">
        <button class="md:hidden btn-ghost !px-3" onclick="el('sidebar').classList.toggle('open')"><i class="fas fa-bars"></i></button>
        <button class="md:hidden btn-ghost !px-2.5 text-xs text-emerald-400 border border-emerald-500/30" onclick="triggerPWAInstall()" title="تثبيت التطبيق على الجوال"><i class="fas fa-download ml-1"></i>تثبيت</button>
        <div class="relative flex-1 max-w-md">
          <i class="fas fa-search absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 text-sm"></i>
          <input id="global-search" class="input-field !py-2 !pr-9" placeholder="ابحث في السير الذاتية..." onkeydown="if(event.key==='Enter')nav('resumes',{q:this.value})">
        </div>
        <div class="flex items-center gap-2 mr-auto">
          <span class="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full ${isAdmin ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'}"><i class="fas ${isAdmin ? 'fa-crown text-amber-400' : 'fa-user-check text-emerald-400'} ml-1"></i>${esc(displayName)}</span>
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
  const authorName = r.created_by || r.specialist_name || (r.id === 1 ? 'إيهاب شحيطير (Super Admin)' : 'إيهاب شحيطير');
  const isSuper = authorName.includes('Super') || authorName.includes('إيهاب');
  return `
  <div class="glass rounded-2xl p-4 card-hover">
    <div class="flex items-start gap-3">
      <div class="flex-1 min-w-0 cursor-pointer" onclick="openBuilder(${r.id})">
        <div class="font-bold truncate mb-1">${esc(r.title)}</div>
        <div class="flex flex-wrap items-center gap-1.5 mb-2">
          ${langBadge(r.language)} ${statusBadge(r.status)}
          ${r.client_name ? `<span class="tag bg-sky-500/15 text-sky-400"><i class="fas fa-user ml-1"></i>${esc(r.client_name)}</span>` : ''}
          <span class="tag ${isSuper ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'}" title="المختص الذي أنشأ هذه السيرة">
            <i class="fas ${isSuper ? 'fa-crown text-[10px]' : 'fa-user-tie text-[10px]'} ml-1"></i>بواسطة: ${esc(authorName)}
          </span>
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
      template: 'ats1',
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
function renderActivityRow(a) {
  const isSuper = !a.user_name || a.user_name.includes('Super') || a.user_name.includes('إيهاب');
  const uName = a.user_name || (a.details?.includes('إيهاب') ? 'إيهاب شحيطير (Super Admin)' : (a.details?.includes('يزن') ? 'يزن سمير' : 'إيهاب شحيطير (Super Admin)'));
  const uRole = a.user_role || (isSuper ? 'المالك والمدير الرئيسي' : 'مختص سير ذاتية معتمد');
  
  let actionIcon = 'fa-bolt text-amber-400';
  let actionBg = 'bg-amber-500/10 border-amber-500/20';
  if (a.action?.includes('create')) { actionIcon = 'fa-circle-plus text-emerald-400'; actionBg = 'bg-emerald-500/10 border-emerald-500/20'; }
  else if (a.action?.includes('ai') || a.action === 'ai_generate') { actionIcon = 'fa-wand-magic-sparkles text-purple-400'; actionBg = 'bg-purple-500/10 border-purple-500/20'; }
  else if (a.action?.includes('login')) { actionIcon = 'fa-right-to-bracket text-sky-400'; actionBg = 'bg-sky-500/10 border-sky-500/20'; }
  else if (a.action?.includes('delete')) { actionIcon = 'fa-trash text-rose-400'; actionBg = 'bg-rose-500/10 border-rose-500/20'; }
  else if (a.action?.includes('update')) { actionIcon = 'fa-pen text-indigo-400'; actionBg = 'bg-indigo-500/10 border-indigo-500/20'; }
  else if (a.action?.includes('duplicate')) { actionIcon = 'fa-copy text-teal-400'; actionBg = 'bg-teal-500/10 border-teal-500/20'; }

  return `
    <div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/70 transition text-xs">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center border ${actionBg} shrink-0 text-sm shadow-inner">
          <i class="fas ${actionIcon}"></i>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="font-bold px-2 py-0.5 rounded-lg text-[11px] ${isSuper ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'}">
              <i class="fas ${isSuper ? 'fa-crown text-[10px]' : 'fa-user-tie text-[10px]'} ml-1"></i>${esc(uName)}
            </span>
            <span class="text-slate-200 font-semibold">${esc(a.details || a.action)}</span>
          </div>
          <div class="text-[11px] text-slate-400 flex items-center gap-2">
            <span class="text-slate-300">${esc(uRole)}</span>
            ${a.entity ? `<span>• الكيان: ${esc(a.entity)} ${a.entity_id ? '#' + a.entity_id : ''}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="text-right shrink-0">
        <span class="text-slate-300 font-mono text-[11px] block">${fmtDate(a.created_at)}</span>
      </div>
    </div>
  `;
}

async function viewActivity() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  let acts = [];
  const specialists = ensureSpecialistsList();
  try { acts = (await api.get('/activity')).data; } catch (e) {}

  window._allActivityList = acts;
  window.filterActivityPage = function(spName, actType) {
    let filtered = window._allActivityList || [];
    if (spName && spName !== 'all') {
      filtered = filtered.filter(a => {
        const u = a.user_name || (a.details?.includes('إيهاب') ? 'إيهاب شحيطير (Super Admin)' : (a.details?.includes('يزن') ? 'يزن سمير' : 'إيهاب شحيطير (Super Admin)'));
        return u === spName || (spName.includes('إيهاب') && u.includes('إيهاب'));
      });
    }
    if (actType && actType !== 'all') {
      filtered = filtered.filter(a => a.action?.includes(actType));
    }
    const container = el('activity-items-wrap');
    if (container) {
      container.innerHTML = filtered.length ? filtered.map(renderActivityRow).join('') : '<p class="text-slate-400 text-sm py-8 text-center">لا توجد أنشطة مطابقة لهذا الفلتر</p>';
    }
  };

  const spOptions = specialists.map(sp => {
    const cnt = acts.filter(a => {
      const u = a.user_name || (a.details?.includes('إيهاب') ? 'إيهاب شحيطير (Super Admin)' : (a.details?.includes('يزن') ? 'يزن سمير' : 'إيهاب شحيطير (Super Admin)'));
      return u === sp.name || (sp.id === 1 && u.includes('إيهاب'));
    }).length;
    return `<option value="${esc(sp.name)}">${esc(sp.name)} (${cnt})</option>`;
  }).join('');

  el('main').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div>
        <h2 class="text-xl font-bold"><i class="fas fa-clock-rotate-left text-sky-400 ml-2"></i>سجل نشاط وتفاعل المختصين والأمان <span class="text-sm text-slate-400">(${acts.length})</span></h2>
        <p class="text-xs text-slate-400 mt-1">مراقبة دقيقة لكل عملية إنشاء سيرة ذاتية، تعديل، أو توليد بالذكاء الاصطناعي مع اسم المختص والوقت.</p>
      </div>
    </div>

    <div class="glass rounded-2xl p-4 mb-4 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-slate-400"><i class="fas fa-user-tie text-indigo-400 ml-1"></i>المختص:</span>
          <select id="act-sp-sel" class="input-field !py-1.5 !px-3 text-xs w-auto" onchange="filterActivityPage(this.value, el('act-type-sel').value)">
            <option value="all">جميع المختصين (${acts.length})</option>
            ${spOptions}
          </select>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-slate-400"><i class="fas fa-filter text-amber-400 ml-1"></i>نوع النشاط:</span>
          <select id="act-type-sel" class="input-field !py-1.5 !px-3 text-xs w-auto" onchange="filterActivityPage(el('act-sp-sel').value, this.value)">
            <option value="all">جميع العمليات</option>
            <option value="create">إنشاء سيرة / عميل</option>
            <option value="ai">توليد الذكاء الاصطناعي</option>
            <option value="update">تعديل وحفظ</option>
            <option value="login">تسجيل الدخول</option>
            <option value="delete">حذف</option>
          </select>
        </div>
      </div>
      <div class="text-xs text-slate-400">
        إجمالي الأنشطة: <b class="text-amber-300">${acts.length}</b> سجل
      </div>
    </div>

    <div class="glass rounded-2xl p-4">
      <div id="activity-items-wrap" class="space-y-2.5">
        ${acts.length ? acts.map(renderActivityRow).join('') : '<p class="text-slate-400 text-sm py-6 text-center">مفيش نشاط لسه</p>'}
      </div>
    </div>`;
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

/* ---------- Team & Specialists Management (Admin Control Center) ---------- */
async function viewTeam() {
  el('main').innerHTML = '<div class="spinner mx-auto mt-20"></div>';
  
  try {
    const spsLocal = ensureSpecialistsList();
    let specialists = [];
    let activity = [];
    let resumes = [];
    let aiHistory = [];

    try {
      const r = await api.get('/specialists');
      specialists = Array.isArray(r.data) ? r.data : (r.data?.results || []);
    } catch (e) {}

    try {
      const r = await api.get('/activity');
      activity = Array.isArray(r.data) ? r.data : (r.data?.results || []);
    } catch (e) {}

    try {
      const r = await api.get('/resumes');
      resumes = Array.isArray(r.data) ? r.data : (r.data?.results || []);
    } catch (e) {}

    try {
      const r = await api.get('/ai-history');
      aiHistory = Array.isArray(r.data) ? r.data : (r.data?.results || []);
    } catch (e) {}

    if (!Array.isArray(specialists) || specialists.length < 3) {
      specialists = Array.isArray(specialists) && specialists.length > 0 ? specialists : spsLocal;
    }
    if (!Array.isArray(activity) || activity.length === 0) {
      activity = getLocal(CLIENT_STORAGE_KEYS.activity, []);
    }
    if (!Array.isArray(resumes) || resumes.length === 0) {
      resumes = getLocal(CLIENT_STORAGE_KEYS.resumes, []);
    }
    if (!Array.isArray(aiHistory)) {
      aiHistory = getLocal(CLIENT_STORAGE_KEYS.aiHistory, []);
    }

    // Calculate live dynamic metrics for each specialist accurately
    specialists.forEach(sp => {
      const spKeywords = [sp.name, sp.access_key, sp.email].filter(Boolean);
      const isSpMatch = (str) => {
        if (!str) return false;
        return spKeywords.some(k => str === k || str.includes(k));
      };

      sp.resumesCount = resumes.filter(r => {
        const creator = r.created_by || r.specialist_name || '';
        if (isSpMatch(creator)) return true;
        if (sp.id === 1 && (!creator || creator.includes('إيهاب'))) return true;
        return false;
      }).length;

      sp.aiCallsCount = activity.filter(a => {
        const isAI = a.action?.includes('ai') || a.action === 'ai_generate' || a.entity === 'ai';
        if (!isAI) return false;
        const user = a.user_name || '';
        const details = a.details || '';
        if (isSpMatch(user) || isSpMatch(details)) return true;
        if (sp.id === 1 && (!user || user.includes('إيهاب')) && !details.includes('يزن') && !details.includes('شهاب') && !details.includes('غانم') && !details.includes('نصر')) return true;
        return false;
      }).length + (Array.isArray(aiHistory) ? aiHistory.filter(h => isSpMatch(h.user_name) || isSpMatch(h.prompt)).length : 0);

      sp.totalActions = activity.filter(a => {
        const user = a.user_name || '';
        const details = a.details || '';
        if (isSpMatch(user) || isSpMatch(details)) return true;
        if (sp.id === 1 && (!user || user.includes('إيهاب')) && !details.includes('يزن') && !details.includes('شهاب') && !details.includes('غانم') && !details.includes('نصر')) return true;
        return false;
      }).length;
    });

    const canManage = isSuperAdmin();

    const totalTeamResumes = resumes.length;
    const totalTeamAICalls = activity.filter(a => a.action?.includes('ai') || a.action === 'ai_generate').length + (Array.isArray(aiHistory) ? aiHistory.length : 0);

  const rows = specialists.map((sp, idx) => {
    const directUrl = (window.location.origin || '') + '/?key=' + sp.access_key;
    const isAct = sp.status === 'active';
    const isAdmin = sp.id === 1 || sp.role?.includes('Admin') || sp.role?.includes('المدير الرئيسي');
    const waText = encodeURIComponent(`مرحباً أستاذ ${sp.name}،\nإليك رابط دخولك المباشر لمنصة السير الذاتية ATS Resume Builder:\n${directUrl}\nالمفتاح السري الخاص بك: ${sp.access_key}\nيمكنك الآن الدخول وإنشاء وتنزيل السير الذاتية بالذكاء الاصطناعي.`);
    const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

    return `
      <div class="glass rounded-2xl p-4 card-hover border border-slate-700/60 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${isAdmin ? 'from-amber-500 via-yellow-600 to-indigo-600 border border-amber-400/40' : 'from-indigo-600 to-purple-600 border border-indigo-400/30'} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              <i class="fas ${isAdmin ? 'fa-crown text-amber-300' : 'fa-user-tie'}"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-base flex items-center gap-2 flex-wrap">
                <span>${esc(sp.name)}</span>
                <span class="tag ${isAct ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400'}">${isAct ? 'نشط' : 'مجمد'}</span>
              </div>
              <div class="text-xs text-slate-300 font-semibold mt-0.5">${esc(sp.role || 'مختص سير ذاتية')} ${sp.email ? `• <span class="text-slate-400">${esc(sp.email)}</span>` : ''}</div>
            </div>
          </div>

          <!-- Live Specialist Stats -->
          <div class="grid grid-cols-3 gap-1.5 my-3 p-2 rounded-xl bg-slate-950/70 border border-slate-700/60 text-center">
            <div>
              <div class="text-[10px] text-slate-400 font-semibold">السير الذاتية</div>
              <div class="text-sm font-black text-sky-400 mt-0.5"><i class="fas fa-file-lines text-[11px] ml-1"></i>${sp.resumesCount}</div>
            </div>
            <div class="border-x border-slate-800">
              <div class="text-[10px] text-slate-400 font-semibold">توليد AI</div>
              <div class="text-sm font-black text-purple-400 mt-0.5"><i class="fas fa-wand-magic-sparkles text-[11px] ml-1"></i>${sp.aiCallsCount}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-semibold">إجمالي النشاط</div>
              <div class="text-sm font-black text-amber-400 mt-0.5"><i class="fas fa-bolt text-[11px] ml-1"></i>${sp.totalActions}</div>
            </div>
          </div>

          <div class="bg-slate-900/90 p-3 rounded-xl text-xs space-y-1.5 mb-3 font-mono dir-ltr border border-slate-700/80">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Key: <span class="text-amber-300 font-bold">${esc(sp.access_key)}</span></span>
              <span class="px-2 py-0.5 rounded text-[10px] font-sans font-bold ${isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}"><i class="fas fa-shield-halved ml-1"></i>${isAdmin ? 'المالك والآدمن' : 'مختص مصرح'}</span>
            </div>
            <div class="text-slate-400 truncate">Link: <span class="text-sky-300">${esc(directUrl)}</span></div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-400 mb-3 border-t border-slate-500/15 pt-2">
            <span>آخر نشاط: <b>${fmtDate(sp.last_active)}</b></span>
            <span>الحالة: <b class="${isAct ? 'text-emerald-400' : 'text-rose-400'}">${isAct ? 'مفعل' : 'معطل'}</b></span>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-700/50">
          <div class="flex gap-1.5">
            <button class="btn-primary flex-1 !py-1.5 !text-xs !bg-gradient-to-r !from-sky-600 !to-indigo-600" onclick="navigator.clipboard.writeText('${directUrl}'); toast('تم نسخ رابط الدخول المباشر بنجاح ✅')"><i class="fas fa-copy ml-1"></i>نسخ الرابط</button>
            <a href="${waUrl}" target="_blank" class="btn-ghost !py-1.5 !px-2.5 text-xs text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-decoration-none flex items-center gap-1" title="إرسال بيانات الدخول عبر واتساب"><i class="fa-brands fa-whatsapp text-sm"></i>واتساب</a>
          </div>

          ${canManage && !isAdmin ? `
          <div class="flex gap-1.5 text-xs">
            <button class="btn-ghost flex-1 !py-1 text-slate-300" onclick="editSpecialistModal(${sp.id})" title="تعديل اسم وبيانات المختص"><i class="fas fa-pen ml-1 text-sky-400"></i>تعديل</button>
            <button class="btn-ghost flex-1 !py-1 ${isAct ? 'text-amber-400' : 'text-emerald-400'}" onclick="toggleSpecialistStatus(${sp.id}, '${isAct ? 'inactive' : 'active'}')"><i class="fas ${isAct ? 'fa-ban' : 'fa-check'} ml-1"></i>${isAct ? 'تجميد' : 'تفعيل'}</button>
            <button class="btn-ghost !py-1 text-rose-400 hover:!bg-rose-500/20 border border-rose-500/30" onclick="delSpecialist(${sp.id})" title="حذف وإزالة المختص نهائياً من الموقع"><i class="fas fa-trash ml-1"></i>إزالة</button>
          </div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  window._teamActivityList = activity;
  window.filterTeamActivityList = function(spName) {
    let filtered = window._teamActivityList || [];
    if (spName && spName !== 'all') {
      filtered = filtered.filter(a => {
        const u = a.user_name || (a.details?.includes('إيهاب') ? 'إيهاب شحيطير (Super Admin)' : (a.details?.includes('يزن') ? 'يزن سمير' : 'إيهاب شحيطير (Super Admin)'));
        return u === spName || (spName.includes('إيهاب') && u.includes('إيهاب'));
      });
    }
    const container = el('team-act-rows-wrap');
    if (container) {
      container.innerHTML = filtered.length ? filtered.slice(0, 30).map(renderActivityRow).join('') : '<p class="text-slate-400 text-xs py-6 text-center">لا توجد نشاطات لهذا المختص حتى الآن</p>';
    }
  };

  const spFilterButtons = [
    `<button class="tag cursor-pointer bg-indigo-500 text-white font-bold" onclick="filterTeamActivityList('all'); document.querySelectorAll('.sp-flt-btn').forEach(b=>b.classList.replace('bg-indigo-500','bg-slate-500/10')); this.classList.add('bg-indigo-500');">الكل (${activity.length})</button>`
  ].concat(specialists.map(sp => {
    return `<button class="tag sp-flt-btn cursor-pointer bg-slate-500/10 text-slate-300 hover:bg-slate-500/20" onclick="filterTeamActivityList('${esc(sp.name)}'); document.querySelectorAll('.sp-flt-btn').forEach(b=>b.classList.replace('bg-indigo-500','bg-slate-500/10')); this.classList.replace('bg-slate-500/10','bg-indigo-500');">${esc(sp.name)} (${sp.totalActions})</button>`;
  })).join('');

  el('main').innerHTML = `
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div>
        <h2 class="text-xl font-bold"><i class="fas fa-user-shield text-indigo-400 ml-2"></i>إدارة ومراقبة أداء المختصين <span class="text-sm text-slate-400">(${specialists.length})</span></h2>
        <p class="text-xs text-slate-400 mt-1">لوحة مراقبة شاملة تمكنك من تتبع نشاط كل مختص، عدد السير الذاتية التي أنشأها، وعدد عمليات الذكاء الاصطناعي بالتفصيل.</p>
      </div>
      ${canManage ? `
      <div class="mr-auto flex gap-2">
        <button class="btn-primary !py-2 !bg-gradient-to-r !from-amber-500 !to-indigo-600 shadow-md font-bold text-xs" onclick="newSpecialistModal()"><i class="fas fa-user-plus ml-1"></i>إضافة مصرح له جديد</button>
      </div>` : `
      <div class="mr-auto">
        <span class="text-xs text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20"><i class="fas fa-lock ml-1"></i>لوحة حصرية لـ إيهاب شحيطير</span>
      </div>`}
    </div>

    <!-- Overview Counters -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="glass rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xl font-bold"><i class="fas fa-users-gear"></i></div>
        <div><div class="text-2xl font-black text-white">${specialists.length}</div><div class="text-xs text-slate-400">عدد المختصين</div></div>
      </div>
      <div class="glass rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xl font-bold"><i class="fas fa-file-circle-check"></i></div>
        <div><div class="text-2xl font-black text-white">${totalTeamResumes}</div><div class="text-xs text-slate-400">إجمالي السير المولدة</div></div>
      </div>
      <div class="glass rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-xl font-bold"><i class="fas fa-wand-magic-sparkles"></i></div>
        <div><div class="text-2xl font-black text-white">${totalTeamAICalls}</div><div class="text-xs text-slate-400">توليد الذكاء الاصطناعي</div></div>
      </div>
      <div class="glass rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-xl font-bold"><i class="fas fa-bolt"></i></div>
        <div><div class="text-2xl font-black text-white">${activity.length}</div><div class="text-xs text-slate-400">إجمالي العمليات المسجلة</div></div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      ${rows}
    </div>

    <div class="glass rounded-2xl p-5 border border-slate-700/60">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700/50">
        <div>
          <h3 class="font-bold text-base flex items-center gap-2"><i class="fas fa-clock-rotate-left text-sky-400"></i>سجل نشاطات وتفاعل المختصين المباشر</h3>
          <p class="text-xs text-slate-400 mt-0.5">انقر على اسم أي مختص لتصفية ورؤية سجل العمليات والتوليد الخاص به فقط.</p>
        </div>
        <div class="text-xs text-slate-400 font-mono">
          Live Tracking Enabled <i class="fas fa-circle text-emerald-400 text-[9px] animate-pulse mr-1"></i>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        ${spFilterButtons}
      </div>

      <div id="team-act-rows-wrap" class="space-y-2">
        ${activity.length ? activity.slice(0, 30).map(renderActivityRow).join('') : '<p class="text-slate-400 text-xs py-6 text-center">مفيش نشاط مسجل لسه</p>'}
      </div>
    </div>
  `;
  } catch (err) {
    console.error('viewTeam error:', err);
    el('main').innerHTML = `
      <div class="glass rounded-2xl p-8 max-w-xl mx-auto my-12 text-center border border-rose-500/30 shadow-2xl">
        <div class="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto mb-4"><i class="fas fa-triangle-exclamation"></i></div>
        <h3 class="font-bold text-lg text-white mb-2">تعذر تحميل لوحة المختصين</h3>
        <p class="text-xs text-slate-400 mb-6">${esc(err.message || 'حدث خطأ أثناء تحميل البيانات')}</p>
        <button class="btn-primary !py-2 !px-6 text-xs" onclick="viewTeam()"><i class="fas fa-rotate-right ml-1"></i>إعادة المحاولة</button>
      </div>
    `;
  }
}

function newSpecialistModal() {
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-user-plus text-indigo-400 ml-2"></i>إضافة مصرح له / مختص جديد</h3>
    <div class="space-y-3 mb-4">
      <div><label class="fld">الاسم الكامل *</label><input id="sp-name" class="input-field" placeholder="مثال: يزن سمير"></div>
      <div><label class="fld">الدور / المسمى الوظيفي</label><input id="sp-role" class="input-field" placeholder="مثال: مختص سير ذاتية معتمد"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="fld">البريد الإلكتروني</label><input id="sp-email" type="email" class="input-field" placeholder="email@example.com"></div>
        <div><label class="fld">رقم الجوال</label><input id="sp-phone" class="input-field" placeholder="050..."></div>
      </div>
    </div>
    <div class="flex gap-3 justify-end">
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn-primary" onclick="saveSpecialist()"><i class="fas fa-save ml-1"></i>حفظ وتوليد المفتاح</button>
    </div>
  `);
  setTimeout(() => el('sp-name') && el('sp-name').focus(), 100);
}

async function saveSpecialist() {
  const name = (el('sp-name')?.value || '').trim();
  if (!name) return toast('ادخل اسم المختص أولاً', 'err');
  const body = {
    name,
    role: el('sp-role')?.value?.trim() || 'مختص سير ذاتية',
    email: el('sp-email')?.value?.trim() || '',
    phone: el('sp-phone')?.value?.trim() || ''
  };
  try {
    await api.post('/specialists', body);
    toast('تمت إضافة المختص وتوليد رابط دخوله المشفر بنجاح ✅');
    closeModal();
    viewTeam();
  } catch (e) {
    toast('حدث خطأ أثناء إضافة المختص', 'err');
  }
}

async function editSpecialistModal(id) {
  const sps = ensureSpecialistsList();
  const sp = sps.find(x => x.id === id);
  if (!sp) return;
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-user-pen text-sky-400 ml-2"></i>تعديل بيانات المختص</h3>
    <div class="space-y-3 mb-4">
      <div><label class="fld">الاسم الكامل *</label><input id="sp-edit-name" class="input-field" value="${esc(sp.name)}"></div>
      <div><label class="fld">الدور / المسمى الوظيفي</label><input id="sp-edit-role" class="input-field" value="${esc(sp.role || '')}"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="fld">البريد الإلكتروني</label><input id="sp-edit-email" type="email" class="input-field" value="${esc(sp.email || '')}"></div>
        <div><label class="fld">رقم الجوال</label><input id="sp-edit-phone" class="input-field" value="${esc(sp.phone || '')}"></div>
      </div>
    </div>
    <div class="flex gap-3 justify-end">
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn-primary" onclick="updateSpecialist(${id})"><i class="fas fa-save ml-1"></i>حفظ التعديلات</button>
    </div>
  `);
}

async function updateSpecialist(id) {
  const name = (el('sp-edit-name')?.value || '').trim();
  if (!name) return toast('ادخل الاسم', 'err');
  const sps = getLocal(CLIENT_STORAGE_KEYS.specialists);
  const idx = sps.findIndex(x => x.id === id);
  if (idx !== -1) {
    sps[idx].name = name;
    sps[idx].role = el('sp-edit-role')?.value?.trim() || 'مختص سير ذاتية';
    sps[idx].email = el('sp-edit-email')?.value?.trim() || '';
    sps[idx].phone = el('sp-edit-phone')?.value?.trim() || '';
    setLocal(CLIENT_STORAGE_KEYS.specialists, sps);
  }
  toast('تم تحديث بيانات المختص ✅');
  closeModal();
  viewTeam();
}

async function toggleSpecialistStatus(id, newStatus) {
  try {
    await api.put('/specialists/' + id + '/status', { status: newStatus });
    toast(newStatus === 'active' ? 'تم تفعيل حساب المختص ✅' : 'تم تجميد حساب المختص ⛔');
    viewTeam();
  } catch (e) {
    toast('تعذر تغيير الحالة', 'err');
  }
}

async function delSpecialist(id) {
  confirmDialog('هل أنت متأكد من حذف هذا المختص نهائياً من النظام؟', async () => {
    try {
      await api.delete('/specialists/' + id);
      toast('تم حذف المختص بنجاح 🗑️');
      viewTeam();
    } catch (e) {
      toast('تعذر الحذف', 'err');
    }
  });
}

/* ---------- boot & direct link auto-login & public view ---------- */
async function renderPublicResumeView(slug) {
  const root = document.getElementById('root');
  if (!root) return;
  root.innerHTML = '<div class="min-h-screen flex items-center justify-center p-4 bg-slate-950" style="background:radial-gradient(ellipse at top,#1e293b,#0f172a)"><div class="spinner !w-8 !h-8 ml-3"></div><p class="text-slate-300 font-bold text-sm">جاري تحميل السيرة الذاتية...</p></div>';

  let r = null;
  const rs = getLocal(CLIENT_STORAGE_KEYS.resumes, []);
  r = rs.find(x => x.public_slug === slug || x.id == slug);

  if (!r) {
    try {
      const res = await api.get('/api/public/cv/' + slug);
      r = res.data;
    } catch (e) {}
  }

  if (!r) {
    root.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center" dir="rtl" style="background:radial-gradient(ellipse at top,#1e293b,#0f172a)">
      <div class="glass-strong p-8 rounded-3xl max-w-md w-full border border-slate-700">
        <i class="fas fa-file-circle-xmark text-5xl text-rose-400 mb-3"></i>
        <h2 class="text-xl font-bold text-white mb-2">السيرة الذاتية غير متوفرة</h2>
        <p class="text-slate-400 text-xs mb-6">يرجى التأكد من صحة الرابط أو طلب ملف الـ PDF مباشرة من صاحب السيرة.</p>
        <a href="/" class="btn-primary !py-2 !px-5 text-xs">الصفحة الرئيسية</a>
      </div>
    </div>`;
    return;
  }

  const data = typeof r.data === 'string' ? JSON.parse(r.data || '{}') : (r.data || {});
  const cust = typeof r.customization === 'string' ? JSON.parse(r.customization || '{}') : (r.customization || {});
  const p = data.personal || {};
  const candName = p.nameAr || p.nameEn || r.title || 'سيرة ذاتية';
  const lang = r.language || 'ar';
  const tpl = r.template || 'ats1';

  let cvHtml = '';
  try {
    cvHtml = renderTemplate(tpl, data, cust, lang);
  } catch(e) {
    cvHtml = '<p class="p-6 text-rose-400">فشل عرض القالب: ' + esc(e.message) + '</p>';
  }

  root.innerHTML = `
  <div dir="${lang === 'en' ? 'ltr' : 'rtl'}" class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <header class="glass-strong sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 border-b border-slate-700/80 flex-wrap gap-2 shadow-lg">
      <div class="flex items-center gap-3">
        <img src="/static/favicon.png" alt="CV-ATS" class="w-8 h-8 rounded-xl shadow border border-sky-500/30">
        <div>
          <h1 class="font-bold text-sm text-white">${esc(candName)}</h1>
          <div class="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <i class="fas fa-circle-check"></i>
            <span>سيرة ذاتية متوافقة مع أنظمة ATS</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button id="pub-download-btn" class="btn-primary !py-1.5 !px-3.5 text-xs font-bold !bg-gradient-to-r !from-emerald-600 !to-teal-600 shadow-md flex items-center gap-1.5" onclick="downloadPublicPDF()"><i class="fas fa-download"></i><span>تحميل ملف PDF 📄</span></button>
        <button class="btn-ghost !py-1.5 !px-2.5 text-xs border border-slate-700 text-slate-300" onclick="window.print()" title="طباعة"><i class="fas fa-print"></i></button>
      </div>
    </header>

    <main class="flex-1 flex justify-center p-3 md:p-8 overflow-y-auto bg-slate-900/70">
      <div id="pub-cv-wrap" class="shadow-2xl rounded-sm overflow-hidden" style="width:794px; min-height:1123px; background:#fff; transform-origin: top center;">
        ${cvHtml}
      </div>
    </main>
  </div>`;

  function scalePubView() {
    const wrap = document.getElementById('pub-cv-wrap');
    if (!wrap) return;
    const winW = window.innerWidth;
    if (winW < 840) {
      const avail = winW - 20;
      const scale = Math.min(1, Math.max(0.35, avail / 794));
      wrap.style.transform = 'scale(' + scale + ')';
      const pageEl = wrap.querySelector('.cv-page') || wrap;
      const naturalH = pageEl.scrollHeight || 1123;
      wrap.style.height = (naturalH * scale + 20) + 'px';
      wrap.style.margin = '0 auto';
    } else {
      wrap.style.transform = 'none';
      wrap.style.height = 'auto';
      wrap.style.margin = '0';
    }
  }
  scalePubView();
  window.addEventListener('resize', scalePubView);

  window.downloadPublicPDF = async function() {
    const btn = document.getElementById('pub-download-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner !w-3.5 !h-3.5 !border-2 inline-block ml-1"></div> جاري التجهيز...'; }
    toast('جاري تجهيز وتنزيل ملف الـ PDF... 📄');

    try {
      const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      const html2canvasFunc = window.html2canvas;
      const targetEl = document.querySelector('#pub-cv-wrap .cv-page') || document.getElementById('pub-cv-wrap');
      
      const canvas = await html2canvasFunc(targetEl, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save((candName || 'Resume') + '.pdf');
      toast('تم تنزيل السيرة بنجاح ✅');
    } catch(e) {
      window.print();
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-download ml-1.5"></i>تحميل ملف PDF 📄'; }
    }
  };
}

(function checkDirectKeyAccess() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key') || params.get('auth') || params.get('token');
  if (key) {
    const cleanKey = key.trim();
    if (cleanKey === 'wuda5U9u_Yk') {
      const mockToken = 'ehab_admin_token_' + Date.now();
      S.token = mockToken;
      S.role = 'super_admin';
      S.name = 'إيهاب شحيطير (Super Admin)';
      localStorage.setItem('ehab_token', mockToken);
      localStorage.setItem('ehab_user_role', 'super_admin');
      history.replaceState(null, '', window.location.pathname);
      toast('أهلاً بك يا إيهاب شحيطير (Super Admin — المالك والمدير الرئيسي) 👋');
    } else {
      const sps = getLocal(CLIENT_STORAGE_KEYS.specialists, DEFAULT_SPECIALISTS);
      const matched = sps.find(x => x.access_key === cleanKey && x.status === 'active');
      const mockToken = 'ehab_sp_token_' + Date.now();
      S.token = mockToken;
      S.role = 'specialist';
      S.name = matched ? matched.name : 'مختص مصرح له';
      localStorage.setItem('ehab_token', mockToken);
      localStorage.setItem('ehab_user_role', 'specialist');
      history.replaceState(null, '', window.location.pathname);
      toast(`مرحباً بك يا ${S.name}! تم تسجيل الدخول المباشر للمنصة بنجاح ✅`);
    }
  }
})();

function initAppBoot() {
  const params = new URLSearchParams(window.location.search);
  const cvSlug = params.get('cv') || params.get('view');
  if (cvSlug) {
    return renderPublicResumeView(cvSlug);
  }
  S.token ? renderApp() : renderLogin();
}

document.addEventListener('DOMContentLoaded', initAppBoot);
if (document.readyState !== 'loading') { initAppBoot(); }

