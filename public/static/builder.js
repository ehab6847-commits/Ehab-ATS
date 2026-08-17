/* ============ Ehab ATS - Resume Builder (builder.js) ============ */
const B = { id: null, resume: null, data: null, cust: null, dirty: false, saveTimer: null, verCounter: 0 };

function bEsc(s) { return (s == null ? '' : String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function bid() { return 'x' + Math.random().toString(36).slice(2, 9); }

const FONTS_LIST = [
  { name: 'Cairo', ar: 'Cairo (كايرو - عصري)' },
  { name: 'Tajawal', ar: 'Tajawal (تاجوال - احترافي)' },
  { name: 'Amiri', ar: 'Amiri (أميري - كلاسيكي)' },
  { name: 'Almarai', ar: 'Almarai (المراعي - ناعم)' },
  { name: 'Changa', ar: 'Changa (شانجا - بارز)' },
  { name: 'Kufam', ar: 'Kufam (كوفام - هندسي)' },
  { name: 'Readex Pro', ar: 'Readex Pro (ريدكس - حديث)' },
  { name: 'Noto Sans Arabic', ar: 'Noto Sans Arabic (نوتو)' },
  { name: 'Alexandria', ar: 'Alexandria (الإسكندرية)' },
  { name: 'IBM Plex Sans Arabic', ar: 'IBM Plex (تقني)' },
  { name: 'Rubik', ar: 'Rubik (روبرك - دائري)' },
  { name: 'Inter', ar: 'Inter (إنتر - عالمي)' },
  { name: 'Roboto', ar: 'Roboto (روبوتو - حديث)' },
  { name: 'Montserrat', ar: 'Montserrat (مونتسيرات)' },
  { name: 'Outfit', ar: 'Outfit (أوتفيت - مميز)' }
];

async function openBuilder(id) {
  try {
    const r = (await api.get('/resumes/' + id)).data;
    B.id = id;
    B.resume = r;
    B.data = JSON.parse(r.data || '{}');
    if (!B.data.personal) B.data = defaultResumeData();
    if (!B.data.sections) B.data.sections = [];
    B.cust = JSON.parse(r.customization || '{}');
    B.dirty = false;
    B.verCounter = 0;
    renderBuilder();
  } catch (e) { toast('مش مش لاقي السيرة دي', 'err'); }
}

function renderBuilder() {
  const r = B.resume;
  const c = B.cust || {};
  const tplOpts = Object.entries(TEMPLATE_DEFS).map(([k, t]) => `<option value="${k}" ${r.template === k ? 'selected' : ''}>${bEsc(t.name)}</option>`).join('');
  const fontOptsAr = FONTS_LIST.map(f => `<option value="${f.name}" ${(c.fontAr || 'Cairo') === f.name ? 'selected' : ''}>${bEsc(f.ar)}</option>`).join('');
  
  document.getElementById('root').innerHTML = `
  <div dir="rtl" class="min-h-screen flex flex-col">
    <header class="glass-strong sticky top-0 z-30 flex items-center gap-2 px-3 py-2 flex-wrap" style="min-height:58px">
      <button class="btn-ghost !px-3" onclick="exitBuilder()" title="رجوع"><i class="fas fa-arrow-right"></i></button>
      <input id="b-title" class="input-field !py-1.5 !w-44 md:!w-56 font-bold text-sm" value="${bEsc(r.title)}" onchange="bSet('title', this.value)">
      
      <select id="b-lang" class="input-field !py-1.5 !w-auto text-xs" onchange="bSet('language', this.value)">
        <option value="ar" ${r.language === 'ar' ? 'selected' : ''}>عربي</option>
        <option value="en" ${r.language === 'en' ? 'selected' : ''}>English</option>
        <option value="bilingual" ${r.language === 'bilingual' ? 'selected' : ''}>ثنائي اللغة (عمودين / شقين)</option>
      </select>
      
      <select id="b-tpl" class="input-field !py-1.5 !w-auto text-xs font-semibold" onchange="bSet('template', this.value)">${tplOpts}</select>
      
      <!-- Quick Font Family Selector -->
      <select id="b-font-ar" class="input-field !py-1.5 !w-auto text-xs" onchange="bCust('fontAr', this.value)" title="نوع الخط العربي">
        ${fontOptsAr}
      </select>

      <!-- Quick Font Size Controls -->
      <div class="flex items-center gap-1 glass px-2 py-1 rounded-lg">
        <button class="mini-btn" onclick="bChangeFontSize(-1)" title="تصغير الخط"><i class="fas fa-minus text-xs"></i></button>
        <span class="text-xs font-bold w-6 text-center" id="b-fs-label">${c.fontSize || 14}</span>
        <button class="mini-btn" onclick="bChangeFontSize(1)" title="تكبير الخط"><i class="fas fa-plus text-xs"></i></button>
      </div>

      <div class="mr-auto flex items-center gap-1.5 flex-wrap">
        <span id="b-save-ind" class="text-xs text-slate-400"><i class="fas fa-check"></i> محفوظ</span>
        <button class="btn-primary !bg-gradient-to-r !from-purple-600 !to-indigo-600 !py-1.5 !px-3 text-xs shadow-md" onclick="bOneShotAIModal()" title="ضع معلومات السيرة دفعة واحدة ليقوم الذكاء الاصطناعي بتعبئتها وتوليدها بنفس القالب المختار حالياً"><i class="fas fa-wand-magic-sparkles text-amber-300 ml-1"></i>توليد من نص دفعة واحدة</button>
        <button class="btn-ghost !py-1.5 !px-3 text-xs" onclick="bVersionsModal()" title="الإصدارات"><i class="fas fa-clock-rotate-left"></i></button>
        <button class="btn-ghost !py-1.5 !px-3 text-xs" onclick="bAIModal()" title="مساعد AI الشامل"><i class="fas fa-wand-magic-sparkles text-violet-400 ml-1"></i>ذكاء اصطناعي</button>
        <button class="btn-ghost !py-1.5 !px-3 text-xs" onclick="bExportMenu()" title="تصدير"><i class="fas fa-file-export ml-1"></i>تصدير</button>
        <button class="btn-primary !py-1.5 text-xs" onclick="bSave(true)"><i class="fas fa-save ml-1"></i>حفظ</button>
      </div>
    </header>
    <div class="builder-grid flex-1">
      <div class="builder-form-col" id="b-form"></div>
      <div class="builder-preview-col" id="b-preview-col">
        <div id="b-preview-wrap" style="transform-origin:top center"></div>
      </div>
    </div>
  </div>`;
  renderBuilderForm();
  bPreview();
  window.addEventListener('resize', bScalePreview);
}

function bChangeFontSize(delta) {
  const current = B.cust.fontSize || 14;
  const updated = Math.max(9, Math.min(26, current + delta));
  bCust('fontSize', updated);
  const lbl = document.getElementById('b-fs-label');
  if (lbl) lbl.textContent = updated;
}

function exitBuilder() {
  window.removeEventListener('resize', bScalePreview);
  if (B.saveTimer) { clearTimeout(B.saveTimer); bSave(); }
  nav('resumes');
}

/* ---------- state & autosave ---------- */
function bSet(field, val) {
  B.resume[field] = val;
  if (field === 'language' && (val === 'en' || val === 'bilingual')) {
    if (typeof ensureEnglishData === 'function') {
      ensureEnglishData(B.data, true);
    }
    renderBuilderForm();
  }
  bTouched();
  if (field === 'template' || field === 'language') bPreview();
}
function bTouched() {
  B.dirty = true;
  const ind = document.getElementById('b-save-ind');
  if (ind) ind.innerHTML = '<i class="fas fa-pen text-amber-400"></i> بيتحفظ...';
  if (B.saveTimer) clearTimeout(B.saveTimer);
  B.saveTimer = setTimeout(() => bSave(), 1500);
}
async function bSave(withVersion) {
  if (B.saveTimer) { clearTimeout(B.saveTimer); B.saveTimer = null; }
  B.verCounter++;
  const saveVer = withVersion || B.verCounter % 10 === 0;
  try {
    await api.put('/resumes/' + B.id, {
      title: B.resume.title, language: B.resume.language, template: B.resume.template,
      status: B.resume.status,
      data: JSON.stringify(B.data), customization: JSON.stringify(B.cust),
      save_version: saveVer, version_note: withVersion ? 'حفظ يدوي' : 'حفظ تلقائي'
    });
    B.dirty = false;
    const ind = document.getElementById('b-save-ind');
    if (ind) ind.innerHTML = '<i class="fas fa-check text-emerald-400"></i> محفوظ';
    if (withVersion) toast('اتحفظ مع نسخة إصدار ✅');
  } catch (e) {
    const ind = document.getElementById('b-save-ind');
    if (ind) ind.innerHTML = '<i class="fas fa-triangle-exclamation text-rose-400"></i> فشل الحفظ';
  }
}

/* ---------- live preview ---------- */
function bPreview() {
  const wrap = document.getElementById('b-preview-wrap');
  if (!wrap) return;
  try { wrap.innerHTML = renderTemplate(B.resume.template, B.data, B.cust, B.resume.language); }
  catch (e) { wrap.innerHTML = '<p class="text-rose-400 p-4">خطأ في المعاينة: ' + bEsc(e.message) + '</p>'; }
  bScalePreview();
}
function bScalePreview() {
  const col = document.getElementById('b-preview-col');
  const wrap = document.getElementById('b-preview-wrap');
  if (!col || !wrap) return;
  const avail = col.clientWidth - 32;
  const scale = Math.min(1, avail / 794);
  wrap.style.transform = 'scale(' + scale + ')';
  wrap.style.width = '794px';
  wrap.style.margin = '16px auto';
  wrap.style.height = (wrap.scrollHeight * scale) + 'px';
}

/* ---------- form ---------- */
function renderBuilderForm() {
  if (typeof ensureEnglishData === 'function') {
    ensureEnglishData(B.data);
  }
  const p = B.data.personal || {};
  const pf = (k, label, dir) => `<div><label class="fld">${label}</label><input class="input-field !py-1.5" ${dir ? 'dir="' + dir + '"' : ''} value="${bEsc(p[k] || '')}" oninput="bPersonal('${k}', this.value)"></div>`;
  const sections = (B.data.sections || []).map((sec, i) => bSectionCard(sec, i)).join('');
  
  document.getElementById('b-form').innerHTML = `
    <div class="section-card">
      <div class="section-head" onclick="this.parentElement.classList.toggle('collapsed')">
        <i class="fas fa-user text-indigo-400"></i><span class="font-bold">البيانات الشخصية والمعلومات</span>
        <i class="fas fa-chevron-down mr-auto text-slate-400 text-xs"></i>
      </div>
      <div class="section-body">
        <div class="grid grid-cols-2 gap-2">
          ${pf('nameAr', 'الاسم (عربي) *')} ${pf('nameEn', 'Name (En)', 'ltr')}
          ${pf('titleAr', 'المسمى الوظيفي (اختياري)')} ${pf('titleEn', 'Job Title (En - اختياري)', 'ltr')}
          ${pf('email', 'الإيميل', 'ltr')} ${pf('phone', 'التليفون', 'ltr')}
          ${pf('cityAr', 'المدينة (عربي)')} ${pf('cityEn', 'City (En)', 'ltr')}
          ${pf('linkedin', 'LinkedIn', 'ltr')} ${pf('website', 'موقع/Portfolio', 'ltr')}
          ${pf('nationality', 'الجنسية (اختياري)')} ${pf('birthdate', 'تاريخ الميلاد (اختياري)', 'ltr')}
        </div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <div><label class="fld">صورة شخصية</label><input type="file" accept="image/*" class="input-field !py-1 !text-xs" onchange="bUploadImg(this,'photo')"></div>
          <div><label class="fld">لوجو</label><input type="file" accept="image/*" class="input-field !py-1 !text-xs" onchange="bUploadImg(this,'logo')"></div>
          <div><label class="fld">توقيع</label><input type="file" accept="image/*" class="input-field !py-1 !text-xs" onchange="bUploadImg(this,'signature')"></div>
        </div>
        <div class="flex gap-2 mt-1 text-xs">
          ${p.photo ? '<button class="mini-btn danger" onclick="bPersonal(\'photo\',\'\');renderBuilderForm()">حذف الصورة</button>' : ''}
          ${p.logo ? '<button class="mini-btn danger" onclick="bPersonal(\'logo\',\'\');renderBuilderForm()">حذف اللوجو</button>' : ''}
          ${p.signature ? '<button class="mini-btn danger" onclick="bPersonal(\'signature\',\'\');renderBuilderForm()">حذف التوقيع</button>' : ''}
        </div>
      </div>
    </div>
    
    <div id="b-sections" class="space-y-2 mt-2">${sections}</div>
    
    <div class="mt-3">
      <button class="btn-primary w-full !py-2 text-sm shadow-md" onclick="bOpenAddSectionModal()"><i class="fas fa-plus ml-1.5"></i>إضافة قسم جديد للسيرة الذاتية</button>
    </div>

    ${bCustomizationPanel()}
  `;
}

function bPersonal(k, v) {
  if (!B.data.personal) B.data.personal = {};
  B.data.personal[k] = v;
  if (k === 'nameAr' || k === 'nameEn') { B.data.personal.fullName = B.data.personal.nameAr; B.data.personal.fullNameEn = B.data.personal.nameEn; }
  if (k === 'titleAr' || k === 'titleEn') { B.data.personal.jobTitle = B.data.personal.titleAr; B.data.personal.jobTitleEn = B.data.personal.titleEn; }
  bTouched();
  bPreviewDebounced();
}

let _pvTimer = null;
function bPreviewDebounced() { if (_pvTimer) clearTimeout(_pvTimer); _pvTimer = setTimeout(bPreview, 300); }

function bUploadImg(input, key) {
  const f = input.files[0];
  if (!f) return;
  if (f.size > 1024 * 1024) return toast('الصورة كبيرة — أقصى حجم 1MB', 'err');
  const rd = new FileReader();
  rd.onload = () => { bPersonal(key, rd.result); renderBuilderForm(); toast('اترفعت ✅'); };
  rd.readAsDataURL(f);
}

/* ---------- sections ---------- */
function bSectionCard(sec, i) {
  const def = SECTION_TYPES[sec.type] || { ar: sec.type, icon: 'fa-list', kind: 'list' };
  const items = (sec.items || []).map((it, j) => bItemCard(sec, i, it, j)).join('');
  return `
  <div class="section-card ${sec.visible === false ? 'opacity-50' : ''} collapsed" data-idx="${i}">
    <div class="section-head">
      <span class="drag-handle" onclick="event.stopPropagation()"><i class="fas fa-grip-vertical"></i></span>
      <i class="fas ${def.icon} text-indigo-400" onclick="bToggleCollapse(${i})"></i>
      <span class="font-bold flex-1 cursor-pointer" onclick="bToggleCollapse(${i})">${bEsc(sec.titleAr || def.ar)} <span class="text-xs text-slate-400">(${(sec.items || []).length})</span></span>
      
      <!-- Quick Section AI Button -->
      <button class="mini-btn !bg-violet-500/20 !text-violet-300 hover:!bg-violet-500/40" title="مساعد الذكاء الاصطناعي لهذا القسم" onclick="event.stopPropagation(); bSectionAIModal(${i})"><i class="fas fa-wand-magic-sparkles"></i> AI</button>
      
      <button class="mini-btn" title="أعلى" onclick="bMoveSection(${i},-1)"><i class="fas fa-chevron-up"></i></button>
      <button class="mini-btn" title="أسفل" onclick="bMoveSection(${i},1)"><i class="fas fa-chevron-down"></i></button>
      <button class="mini-btn" title="إظهار/إخفاء" onclick="bToggleVisible(${i})"><i class="fas ${sec.visible === false ? 'fa-eye-slash text-slate-400' : 'fa-eye text-emerald-400'}"></i></button>
      <button class="mini-btn" title="نسخ القسم" onclick="bDupSection(${i})"><i class="fas fa-copy"></i></button>
      <button class="mini-btn danger" title="حذف" onclick="bDelSection(${i})"><i class="fas fa-trash"></i></button>
    </div>
    <div class="section-body">
      <div class="grid grid-cols-2 gap-2 mb-2">
        <div><label class="fld">عنوان القسم (عربي)</label><input class="input-field !py-1.5" value="${bEsc(sec.titleAr || '')}" placeholder="${bEsc(def.ar)}" oninput="bSecField(${i},'titleAr',this.value)"></div>
        <div><label class="fld">Section Title (En)</label><input class="input-field !py-1.5" dir="ltr" value="${bEsc(sec.titleEn || '')}" placeholder="${bEsc(def.en || '')}" oninput="bSecField(${i},'titleEn',this.value)"></div>
      </div>
      ${def.kind === 'skills' ? `<label class="flex items-center gap-2 text-xs text-slate-400 mb-2"><input type="checkbox" ${sec.showBars ? 'checked' : ''} onchange="bSecField(${i},'showBars',this.checked)"> عرض كأشرطة مستوى بدل شرائح</label>` : ''}
      ${items}
      <button class="btn-ghost w-full !py-1.5 !text-sm mt-1" onclick="bAddItem(${i})"><i class="fas fa-plus ml-1"></i>إضافة عنصر للقسم</button>
    </div>
  </div>`;
}

function bToggleCollapse(i) {
  const card = document.querySelector(`.section-card[data-idx="${i}"]`);
  if (card) card.classList.toggle('collapsed');
}

function bItemCard(sec, i, it, j) {
  const def = SECTION_TYPES[sec.type] || { kind: 'list' };
  const kind = def.kind;
  const F = (k, label, val, dir, full) => `<div class="${full ? 'col-span-2' : ''}"><label class="fld">${label}</label><input class="input-field !py-1.5" ${dir ? 'dir="' + dir + '"' : ''} value="${bEsc(val || '')}" oninput="bItemField(${i},${j},'${k}',this.value)"></div>`;
  const T = (k, label, val, rows) => `<div class="col-span-2"><label class="fld">${label}</label><textarea class="input-field !py-1.5" rows="${rows || 2}" oninput="bItemField(${i},${j},'${k}',this.value)">${bEsc(val || '')}</textarea></div>`;
  let fields = '';
  if (kind === 'text') {
    fields = T('textAr', 'النص (عربي)', it.textAr, 3) + T('textEn', 'Text (En)', it.textEn, 3);
  } else if (kind === 'timeline') {
    fields = F('roleAr', 'المسمى (عربي)', it.roleAr) + F('roleEn', 'Role (En)', it.roleEn, 'ltr')
      + F('orgAr', 'الجهة/الشركة (عربي)', it.orgAr || it.companyAr) + F('orgEn', 'Organization (En)', it.orgEn || it.companyEn, 'ltr')
      + F('start', 'من', it.start, 'ltr') + F('end', 'إلى', it.end, 'ltr')
      + `<div class="col-span-2"><label class="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" ${it.current ? 'checked' : ''} onchange="bItemField(${i},${j},'current',this.checked)"> شغال فيها حالياً</label></div>`
      + T('descAr', 'الوصف والإنجازات (عربي)', it.descAr, 3) + T('descEn', 'Description & KPIs (En)', it.descEn, 3);
  } else if (kind === 'education') {
    fields = F('degreeAr', 'الدرجة العلمية (عربي)', it.degreeAr) + F('degreeEn', 'Degree (En)', it.degreeEn, 'ltr')
      + F('schoolAr', 'الجامعة/المؤسسة (عربي)', it.schoolAr) + F('schoolEn', 'School (En)', it.schoolEn, 'ltr')
      + F('year', 'سنة التخرج', it.year, 'ltr') + F('gpa', 'المعدل GPA', it.gpa, 'ltr');
  } else if (kind === 'skills') {
    fields = F('nameAr', 'المهارة (عربي)', it.nameAr) + F('nameEn', 'Skill (En)', it.nameEn, 'ltr')
      + `<div class="col-span-2"><label class="fld">المستوى: <span id="lv-${i}-${j}">${it.level || 4}</span>/5</label><input type="range" min="1" max="5" value="${it.level || 4}" class="w-full" oninput="document.getElementById('lv-${i}-${j}').textContent=this.value; bItemField(${i},${j},'level',+this.value)"></div>`;
  } else if (kind === 'languages') {
    fields = F('nameAr', 'اللغة (عربي)', it.nameAr) + F('nameEn', 'Language (En)', it.nameEn, 'ltr')
      + F('levelAr', 'المستوى (عربي)', it.levelAr) + F('levelEn', 'Level (En)', it.levelEn, 'ltr')
      + `<div class="col-span-2"><label class="fld">المستوى الرقمي: <span id="lv-${i}-${j}">${it.level || 4}</span>/5</label><input type="range" min="1" max="5" value="${it.level || 4}" class="w-full" oninput="document.getElementById('lv-${i}-${j}').textContent=this.value; bItemField(${i},${j},'level',+this.value)"></div>`;
  } else if (kind === 'certs') {
    fields = F('nameAr', 'اسم الشهادة / الدورة (عربي)', it.nameAr) + F('nameEn', 'Certificate / Course (En)', it.nameEn, 'ltr')
      + F('orgAr', 'الجهة المانحة (عربي)', it.orgAr || it.issuerAr) + F('orgEn', 'Issuer (En)', it.orgEn || it.issuerEn, 'ltr')
      + F('year', 'السنة', it.year, 'ltr');
  } else if (kind === 'references') {
    fields = F('nameAr', 'الاسم', it.nameAr) + F('nameEn', 'Name (En)', it.nameEn, 'ltr')
      + F('titleAr', 'الصفة/الجهة', it.titleAr) + F('phone', 'التواصل', it.phone, 'ltr');
  } else {
    fields = F('textAr', 'العنصر (عربي)', it.textAr, null, false) + F('textEn', 'Item (En)', it.textEn, 'ltr', false);
  }
  return `
  <div class="item-card">
    <div class="flex items-center gap-1 mb-1">
      <span class="text-xs text-slate-400 flex-1">عنصر ${j + 1}</span>
      <button class="mini-btn" onclick="bMoveItem(${i},${j},-1)"><i class="fas fa-chevron-up"></i></button>
      <button class="mini-btn" onclick="bMoveItem(${i},${j},1)"><i class="fas fa-chevron-down"></i></button>
      <button class="mini-btn" onclick="bDupItem(${i},${j})"><i class="fas fa-copy"></i></button>
      <button class="mini-btn danger" onclick="bDelItem(${i},${j})"><i class="fas fa-trash"></i></button>
    </div>
    <div class="grid grid-cols-2 gap-2">${fields}</div>
  </div>`;
}

function bSecField(i, k, v) { B.data.sections[i][k] = v; bTouched(); bPreviewDebounced(); }
function bItemField(i, j, k, v) { B.data.sections[i].items[j][k] = v; bTouched(); bPreviewDebounced(); }

function bOpenAddSectionModal() {
  const opts = Object.entries(SECTION_TYPES).map(([k, v]) => `
    <button class="glass p-3 rounded-xl card-hover flex items-center gap-3 text-right" onclick="bAddSectionWithType('${k}')">
      <div class="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
        <i class="fas ${v.icon}"></i>
      </div>
      <div>
        <div class="font-bold text-sm text-slate-100">${bEsc(v.ar)}</div>
        <div class="text-xs text-slate-400">${bEsc(v.en)}</div>
      </div>
    </button>
  `).join('');

  openModal(`
    <h3 class="font-bold text-lg mb-3"><i class="fas fa-plus-circle text-indigo-400 ml-2"></i>إضافة قسم جديد للسيرة الذاتية</h3>
    <p class="text-xs text-slate-400 mb-4">اختر نوع القسم الذي تريد إضافته للسيرة الذاتية:</p>
    <div class="grid grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">${opts}</div>
    <div class="flex justify-end mt-4"><button class="btn-ghost" onclick="closeModal()">إلغاء</button></div>
  `, true);
}

function bAddSectionWithType(type) {
  closeModal();
  const def = SECTION_TYPES[type] || SECTION_TYPES.custom;
  B.data.sections.push({
    id: bid(),
    type: type,
    titleAr: def.ar,
    titleEn: def.en,
    visible: true,
    items: [{}]
  });
  bTouched();
  renderBuilderForm();
  bPreview();
  toast('تم إضافة قسم ' + def.ar + ' ✅');
}

function bDelSection(i) { confirmDialog('حذف القسم ده بكل عناصره؟', () => { B.data.sections.splice(i, 1); bTouched(); renderBuilderForm(); bPreview(); }); }
function bDupSection(i) {
  const copy = JSON.parse(JSON.stringify(B.data.sections[i]));
  copy.id = bid();
  B.data.sections.splice(i + 1, 0, copy);
  bTouched(); renderBuilderForm(); bPreview();
}
function bToggleVisible(i) { B.data.sections[i].visible = B.data.sections[i].visible === false; bTouched(); renderBuilderForm(); bPreview(); }
function bMoveSection(i, d) {
  const j = i + d;
  if (j < 0 || j >= B.data.sections.length) return;
  const t = B.data.sections[i]; B.data.sections[i] = B.data.sections[j]; B.data.sections[j] = t;
  bTouched(); renderBuilderForm(); bPreview();
}
function bAddItem(i) { if (!B.data.sections[i].items) B.data.sections[i].items = []; B.data.sections[i].items.push({}); bTouched(); renderBuilderForm(); document.querySelector(`.section-card[data-idx="${i}"]`)?.classList.remove('collapsed'); }
function bDelItem(i, j) { B.data.sections[i].items.splice(j, 1); bTouched(); renderBuilderForm(); document.querySelector(`.section-card[data-idx="${i}"]`)?.classList.remove('collapsed'); bPreview(); }
function bDupItem(i, j) { B.data.sections[i].items.splice(j + 1, 0, JSON.parse(JSON.stringify(B.data.sections[i].items[j]))); bTouched(); renderBuilderForm(); document.querySelector(`.section-card[data-idx="${i}"]`)?.classList.remove('collapsed'); bPreview(); }
function bMoveItem(i, j, d) {
  const arr = B.data.sections[i].items, k = j + d;
  if (k < 0 || k >= arr.length) return;
  const t = arr[j]; arr[j] = arr[k]; arr[k] = t;
  bTouched(); renderBuilderForm(); document.querySelector(`.section-card[data-idx="${i}"]`)?.classList.remove('collapsed'); bPreview();
}

/* ---------- Section AI Assistant Modal ---------- */
function bSectionAIModal(secIndex) {
  const sec = B.data.sections[secIndex];
  if (!sec) return;
  const secTitleStr = sec.titleAr || (SECTION_TYPES[sec.type] || {}).ar || 'القسم';
  
  openModal(`
    <h3 class="font-bold text-lg mb-2"><i class="fas fa-wand-magic-sparkles text-violet-400 ml-2"></i>مساعد الذكاء الاصطناعي لقسم (${bEsc(secTitleStr)})</h3>
    <p class="text-xs text-slate-400 mb-4">اختر الإجراء المطلوب لتعديل هذا القسم تحديداً بالذكاء الاصطناعي:</p>
    
    <div class="space-y-2 mb-4">
      <button class="btn-ghost w-full !justify-start text-sm" onclick="runSectionAI(${secIndex}, 'rewrite')">
        <i class="fas fa-sparkles ml-2 text-amber-400"></i>🪄 إعادة صياغة احترافية وتقوية المصطلحات (ATS-Friendly)
      </button>
      <button class="btn-ghost w-full !justify-start text-sm" onclick="runSectionAI(${secIndex}, 'shorten')">
        <i class="fas fa-compress ml-2 text-sky-400"></i>✂️ اختصار وتكثيف النص ليكون مركزاً
      </button>
      <button class="btn-ghost w-full !justify-start text-sm" onclick="runSectionAI(${secIndex}, 'kpi')">
        <i class="fas fa-chart-line ml-2 text-emerald-400"></i>📊 تزويد أرقام وإنجازات قابلة للقياس (KPIs & Metrics)
      </button>
      <button class="btn-ghost w-full !justify-start text-sm" onclick="runSectionAI(${secIndex}, 'translate')">
        <i class="fas fa-language ml-2 text-violet-400"></i>🌐 استكمال الترجمة التلقائية (عربي ↔ إنجليزي)
      </button>
    </div>

    <div class="pt-3 border-t border-slate-500/20">
      <label class="fld mb-1">أو اكتب طلباً مخصصاً للذكاء الاصطناعي:</label>
      <div class="flex gap-2">
        <input id="sec-ai-prompt" class="input-field !py-1.5 flex-1" placeholder="مثال: أضف مهارات أمن معلومات / اختصر إلى 3 نقاط فقط">
        <button class="btn-primary !py-1.5 text-xs" onclick="runSectionAI(${secIndex}, 'custom')">تنفيذ</button>
      </div>
    </div>

    <div id="sec-ai-status" class="text-xs text-slate-400 mt-3"></div>
    <div class="flex justify-end mt-4"><button class="btn-ghost" onclick="closeModal()">إغلاق</button></div>
  `, true);
}

async function runSectionAI(secIndex, action) {
  const sec = B.data.sections[secIndex];
  if (!sec) return;
  const st = document.getElementById('sec-ai-status');
  if (st) st.innerHTML = '<div class="spinner !w-4 !h-4 !border-2 inline-block ml-1"></div> جاري التعديل بالذكاء الاصطناعي...';

  const customPrompt = action === 'custom' ? (document.getElementById('sec-ai-prompt')?.value || '').trim() : '';

  const actionPrompts = {
    rewrite: 'أعد صياغة هذا القسم بأسلوب مهني رفيع وتعبيرات قوية تناسب أنظمة التوظيف والـ ATS.',
    shorten: 'اختصر كود هذا القسم وركز على النقاط الجوهرية بدون حشو.',
    kpi: 'أعد صياغة الخبرات/النقاط في هذا القسم بوضع أرقام ونسب مئوية وإنجازات محددة (% وساعات وريال).',
    translate: 'ترجم جميع الحقول في هذا القسم: أي حقل Ar فاضي ترجمه من En والعكس.',
    custom: customPrompt || 'حسّن هذا القسم بأسلوب احترافي.'
  };

  const prompt = `${actionPrompts[action] || actionPrompts.rewrite}
بيانات هذا القسم JSON الحالية:
${JSON.stringify(sec)}
أرجع نفس الـ JSON الخاص بهذا القسم فقط معدّلاً، بدون أي شرح أو markdown فنس.`;

  try {
    const { data } = await api.post('/ai/generate', { prompt, task: 'assist_section', resume_id: B.id });
    const m = data.text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('رد غير صالح');
    const updSec = JSON.parse(m[0]);
    
    // Maintain section ID
    updSec.id = sec.id;
    B.data.sections[secIndex] = updSec;

    bTouched();
    renderBuilderForm();
    bPreview();
    closeModal();
    toast('تم تعديل القسم بنجاح ✅ (' + bEsc(data.provider) + ')');
  } catch (e) {
    if (st) st.innerHTML = '<span class="text-rose-400"><i class="fas fa-circle-xmark ml-1"></i> ' + bEsc(e.message || 'فشل التعديل') + '</span>';
  }
}

/* ---------- customization panel ---------- */
function bCustomizationPanel() {
  const c = B.cust || {};
  const fontOptsAr = FONTS_LIST.map(f => `<option value="${f.name}" ${(c.fontAr || 'Cairo') === f.name ? 'selected' : ''}>${bEsc(f.ar)}</option>`).join('');
  const fontOptsEn = FONTS_LIST.map(f => `<option value="${f.name}" ${(c.fontEn || 'Inter') === f.name ? 'selected' : ''}>${bEsc(f.name)}</option>`).join('');

  return `
  <div class="section-card mt-3 collapsed" id="b-cust-card">
    <div class="section-head" onclick="document.getElementById('b-cust-card').classList.toggle('collapsed')">
      <i class="fas fa-palette text-pink-400"></i><span class="font-bold">التخصيص والألوان والخطوط (15 نوع خط)</span>
      <i class="fas fa-chevron-down mr-auto text-slate-400 text-xs"></i>
    </div>
    <div class="section-body">
      <div class="grid grid-cols-2 gap-2">
        <div><label class="fld">اللون الأساسي</label><input type="color" class="input-field !p-1 !h-9" value="${bEsc(c.themeColor || '#1a3a5c')}" oninput="bCust('themeColor', this.value)"></div>
        <div><label class="fld">لون التمييز</label><input type="color" class="input-field !p-1 !h-9" value="${bEsc(c.accentColor || '#2d6da3')}" oninput="bCust('accentColor', this.value)"></div>
        <div><label class="fld">خط النص العربي (15 خط)</label><select class="input-field !py-1.5 text-xs" onchange="bCust('fontAr', this.value)">${fontOptsAr}</select></div>
        <div><label class="fld">خط النص الإنجليزي</label><select class="input-field !py-1.5 text-xs" onchange="bCust('fontEn', this.value)">${fontOptsEn}</select></div>
        <div><label class="fld">حجم الخط: <span id="cs-fs">${c.fontSize || 14}</span>px</label><input type="range" min="10" max="24" value="${c.fontSize || 14}" class="w-full" oninput="document.getElementById('cs-fs').textContent=this.value; bCust('fontSize', +this.value)"></div>
        <div><label class="fld">تباعد الأسطر: <span id="cs-lh">${c.lineHeight || 1.55}</span></label><input type="range" min="1.2" max="2.2" step="0.05" value="${c.lineHeight || 1.55}" class="w-full" oninput="document.getElementById('cs-lh').textContent=this.value; bCust('lineHeight', +this.value)"></div>
        <div><label class="fld">الهوامش الخارجية: <span id="cs-mg">${c.margin || 40}</span>px</label><input type="range" min="15" max="80" value="${c.margin || 40}" class="w-full" oninput="document.getElementById('cs-mg').textContent=this.value; bCust('margin', +this.value)"></div>
        <div class="flex flex-col justify-end gap-1">
          <label class="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" ${c.showIcons !== false ? 'checked' : ''} onchange="bCust('showIcons', this.checked)"> إظهار أيقونات الأقسام</label>
          <label class="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" ${c.showPhoto !== false ? 'checked' : ''} onchange="bCust('showPhoto', this.checked)"> إظهار الصورة الشخصية</label>
        </div>
      </div>
      <div class="flex gap-2 mt-3">
        <button class="btn-primary !py-1.5 !text-xs flex-1 !bg-gradient-to-r !from-indigo-600 !to-violet-600 shadow-md" onclick="bAutoFitSinglePage()"><i class="fas fa-compress-arrows-alt ml-1"></i>ضبط تلقائي لاستيعاب السيرة في صفحة واحدة ⚡</button>
        <button class="btn-ghost !py-1.5 !text-xs" onclick="bGenQR()"><i class="fas fa-qrcode ml-1"></i>${c.qrDataUrl ? 'تحديث QR' : 'كود QR'}</button>
        ${c.qrDataUrl ? '<button class="mini-btn danger" onclick="bCust(\'qrDataUrl\',\'\');renderBuilderForm()"><i class="fas fa-trash"></i></button>' : ''}
      </div>
    </div>
  </div>`;
}

function bAutoFitSinglePage(silent = false) {
  const previewPage = document.querySelector('#b-preview .cv-page') || document.querySelector('.cv-page');
  if (!previewPage) return;
  let currentHeight = previewPage.scrollHeight;

  if (currentHeight > 1115) {
    // Compress long content to fit 1 single page
    const ratio = Math.max(0.74, 1115 / currentHeight);
    const newFs = Math.max(10.5, Math.round(((B.cust.fontSize || 14) * ratio) * 10) / 10);
    const newLh = Math.max(1.22, Math.round(((B.cust.lineHeight || 1.55) * ratio) * 100) / 100);
    const newMg = Math.max(16, Math.round((B.cust.margin || 40) * ratio));
    const newSecGap = Math.max(12, Math.round((B.cust.secGap || 24) * ratio));
    const newItemGap = Math.max(8, Math.round((B.cust.itemGap || 14) * ratio));

    B.cust.fontSize = newFs;
    B.cust.lineHeight = newLh;
    B.cust.margin = newMg;
    B.cust.secGap = newSecGap;
    B.cust.itemGap = newItemGap;

    bTouched();
    renderBuilderForm();
    bPreview();
    if (!silent) toast(`تم ضغط السيرة لتستوعب صفحة واحدة A4! (خط: ${newFs}px) ✅`);
  } else if (currentHeight < 980) {
    // Expand short/medium content to fill the full A4 page elegantly
    const ratio = Math.min(1.35, 1070 / currentHeight);
    const newFs = Math.min(16, Math.round(((B.cust.fontSize || 14) * ratio) * 10) / 10);
    const newLh = Math.min(1.85, Math.round(((B.cust.lineHeight || 1.55) * ratio) * 100) / 100);
    const newMg = Math.min(54, Math.round((B.cust.margin || 40) * ratio));
    const newSecGap = Math.min(36, Math.round((B.cust.secGap || 24) * ratio));
    const newItemGap = Math.min(22, Math.round((B.cust.itemGap || 14) * ratio));

    B.cust.fontSize = newFs;
    B.cust.lineHeight = newLh;
    B.cust.margin = newMg;
    B.cust.secGap = newSecGap;
    B.cust.itemGap = newItemGap;

    bTouched();
    renderBuilderForm();
    bPreview();
    if (!silent) toast(`تمت توسعة وتعبئة السيرة لتغطي الصفحة بالكامل بدون حواشي فارغة! (خط: ${newFs}px) 🎨✅`);
  } else if (!silent) {
    toast('السيرة الذاتية متناسقة ومكتملة في صفحة واحدة بالفعل 👍', 'info');
  }
}

function bCust(k, v) { B.cust[k] = v; bTouched(); bPreviewDebounced(); }

async function bGenQR() {
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js');
    const url = location.origin + '/cv/' + B.resume.public_slug;
    const dataUrl = await window.QRCode.toDataURL(url, { width: 200, margin: 1 });
    bCust('qrDataUrl', dataUrl);
    renderBuilderForm();
    toast('QR اتضاف — بيوجّه للرابط العام ✅');
  } catch (e) { toast('فشل توليد QR', 'err'); }
}

/* ---------- versions ---------- */
async function bVersionsModal() {
  openModal('<div class="spinner mx-auto my-8"></div>', true);
  let vers = [];
  try { vers = (await api.get('/resumes/' + B.id + '/versions')).data; } catch (e) {}
  const rows = vers.map(v => `
    <div class="flex items-center gap-3 py-2.5 border-b border-slate-500/10 last:border-0">
      <i class="fas fa-clock-rotate-left text-amber-400"></i>
      <div class="flex-1"><div class="text-sm font-semibold">${bEsc(v.note || 'نسخة')}</div>
        <div class="text-xs text-slate-400">${fmtDate(v.created_at)}</div></div>
      <button class="btn-ghost !py-1 !px-3 !text-xs" onclick="bRestoreVersion(${v.id})"><i class="fas fa-rotate-right ml-1"></i>استعادة</button>
    </div>`).join('');
  openModal(`
    <h3 class="font-bold text-lg mb-3"><i class="fas fa-clock-rotate-left text-amber-400 ml-2"></i>سجل الإصدارات (${vers.length})</h3>
    <p class="text-xs text-slate-400 mb-3">بنحتفظ بآخر 30 نسخة. الاستعادة بتحفظ نسخة من الوضع الحالي الأول.</p>
    <div class="max-h-80 overflow-y-auto">${rows || '<p class="text-slate-400 text-sm py-4 text-center">مفيش إصدارات لسه</p>'}</div>
    <div class="flex justify-end mt-4"><button class="btn-ghost" onclick="closeModal()">إغلاق</button></div>`, true);
}

async function bRestoreVersion(vid) {
  try {
    await api.post('/resumes/' + B.id + '/restore/' + vid);
    closeModal(); toast('اتم الاستعادة ✅');
    openBuilder(B.id);
  } catch (e) { toast('فشل الاستعادة', 'err'); }
}

/* ---------- AI assist ---------- */
function bAIModal() {
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-wand-magic-sparkles text-violet-400 ml-2"></i>مساعد الذكاء الاصطناعي الشامل</h3>
    <div class="space-y-2">
      <button class="btn-primary w-full !bg-gradient-to-r !from-purple-600 !to-indigo-600 !justify-start my-2 shadow-md" onclick="bOneShotAIModal()"><i class="fas fa-wand-magic-sparkles ml-2 text-amber-300"></i>توليد وتعبئة السيرة بالكامل من نص / معلومات دفعة واحدة 🚀</button>
      <button class="btn-ghost w-full !justify-start" onclick="bAIAction('summary')"><i class="fas fa-align-right ml-2 text-sky-400"></i>حسّن الملخص المهني للـ ATS</button>
      <button class="btn-ghost w-full !justify-start" onclick="bAIAction('skills')"><i class="fas fa-lightbulb ml-2 text-amber-400"></i>اقترح مهارات إضافية مطلوبة في السوق</button>
      <button class="btn-ghost w-full !justify-start" onclick="bAIAction('translate')"><i class="fas fa-language ml-2 text-emerald-400"></i>كمّل الترجمة الناقصة (عربي ↔ إنجليزي)</button>
      <button class="btn-ghost w-full !justify-start" onclick="bAIAction('improve')"><i class="fas fa-rocket ml-2 text-pink-400"></i>قوّي صياغة الخبرات (أفعال إنجاز + أرقام)</button>
    </div>
    <div id="b-ai-status" class="text-sm text-slate-400 mt-4"></div>
    <div class="flex justify-end mt-3"><button class="btn-ghost" onclick="closeModal()">إغلاق</button></div>`, true);
}

/* ---------- AI One-Shot Generation Modal ---------- */
function bOneShotAIModal() {
  const currentTplName = (TEMPLATE_DEFS[B.resume.template] || {}).name || 'القالب الحالي';
  openModal(`
    <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
      <i class="fas fa-wand-magic-sparkles text-amber-400"></i>
      توليد وتعبئة السيرة الذاتية دفعة واحدة بالذكاء الاصطناعي
    </h3>
    <p class="text-xs text-slate-400 mb-3">
      ضع كامل معلومات صاحب السيرة الذاتية هنا جملة واحدة (سواء نص غير مرتب، أو CV قديم، أو نبذة عشوائية). سيقوم الذكاء الاصطناعي بتنظيم البيانات وتعبئة جميع الحقول وتوليد السيرة فوراً على القالب المختار حالياً (<b>${bEsc(currentTplName)}</b>):
    </p>

    <div class="mb-3">
      <label class="fld mb-1">بيانات والمعلومات (ضع كل التفاصيل جملة واحدة هنا):</label>
      <textarea id="oneshot-text" class="input-field !py-2 text-sm" rows="7" placeholder="مثال: أحمد محمد العتيبي، محاسب أول بالرياض، تليفون 0501234567، بريد ahmed@example.com، خبرة 5 سنوات في إعداد القوائم والزكاة بشركة الرياض المالية، بكالوريوس محاسبة جامعة الملك سعود 2019 بمعدل 4.5، مهارات تحليل مالي وإكسل متقدم واللغة الإنجليزية..."></textarea>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <label class="fld shrink-0">لغة التوليد المطلوب والتنسيق:</label>
      <select id="oneshot-lang" class="input-field !py-1 text-xs !w-auto">
        <option value="ar" ${B.resume.language === 'ar' ? 'selected' : ''}>عربي</option>
        <option value="en" ${B.resume.language === 'en' ? 'selected' : ''}>English</option>
        <option value="bilingual" ${B.resume.language === 'bilingual' ? 'selected' : ''}>ثنائي اللغة (عربي + إنجليزي)</option>
      </select>
    </div>

    <div id="oneshot-status" class="text-xs text-slate-400 mb-3"></div>

    <div class="flex justify-end gap-2">
      <button class="btn-primary !bg-gradient-to-r !from-purple-600 !to-indigo-600 shadow-md" onclick="runOneShotAI()"><i class="fas fa-rocket ml-1"></i>توليد وتعبئة السيرة الذاتية الآن</button>
      <button class="btn-ghost" onclick="closeModal()">إلغاء</button>
    </div>
  `, true);
}

async function runOneShotAI() {
  const text = (document.getElementById('oneshot-text')?.value || '').trim();
  if (!text) return toast('اكتب أو يلصق المعلومات أولاً', 'err');

  const lang = document.getElementById('oneshot-lang')?.value || B.resume.language || 'ar';
  const st = document.getElementById('oneshot-status');
  if (st) st.innerHTML = '<div class="spinner !w-4 !h-4 !border-2 inline-block ml-1"></div> جاري تنظيم البيانات وتوليد محتوى السيرة الذاتية بالذكاء الاصطناعي...';

  const prompt = `استخرج ونظم وحول النص والمعلومات التالية إلى سيرة ذاتية مكتملة الحقول ومحتوى احترافي جداً:
"${text}"
أرجع البيانات كـ JSON بالبنية التالية فقط (بدون أي شروح أو markdown):
{
  "personal": { "nameAr": "", "nameEn": "", "titleAr": "", "titleEn": "", "email": "", "phone": "", "cityAr": "", "cityEn": "", "linkedin": "", "website": "", "nationality": "" },
  "sections": [
    { "id": "s1", "type": "summary", "visible": true, "textAr": "", "textEn": "" },
    { "id": "s2", "type": "experience", "visible": true, "items": [{ "roleAr": "", "roleEn": "", "orgAr": "", "orgEn": "", "start": "", "end": "", "descAr": "", "descEn": "" }] },
    { "id": "s3", "type": "education", "visible": true, "items": [{ "degreeAr": "", "degreeEn": "", "schoolAr": "", "schoolEn": "", "year": "", "gpa": "" }] },
    { "id": "s4", "type": "skills", "visible": true, "items": [{ "nameAr": "", "nameEn": "", "level": 4 }] },
    { "id": "s5", "type": "languages", "visible": true, "items": [{ "nameAr": "", "nameEn": "", "levelAr": "", "levelEn": "" }] }
  ]
}`;

  try {
    const { data } = await api.post('/ai/generate', { prompt, task: 'full_resume', language: lang, resume_id: B.id });
    const m = data.text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('رد غير صالح');
    const upd = JSON.parse(m[0]);
    if (!upd.sections || !upd.personal) throw new Error('بنية غير صحيحة');

    // Retain existing uploaded photos/logos/signatures if any
    if (B.data.personal) {
      upd.personal.photo = B.data.personal.photo || '';
      upd.personal.logo = B.data.personal.logo || '';
      upd.personal.signature = B.data.personal.signature || '';
    }

    B.data = upd;
    B.resume.language = lang;

    const bLangSelect = document.getElementById('b-lang');
    if (bLangSelect) bLangSelect.value = lang;

    bTouched();
    renderBuilderForm();
    bPreview();
    closeModal();
    toast('تم تعبئة وتوليد السيرة الذاتية بنجاح على القالب المختار ✅ (' + bEsc(data.provider) + ')');
  } catch (e) {
    if (st) st.innerHTML = '<span class="text-rose-400"><i class="fas fa-circle-xmark ml-1"></i> ' + bEsc(e.message || 'فشل التوليد') + '</span>';
  }
}

async function bAIAction(action) {
  const st = document.getElementById('b-ai-status');
  if (st) st.innerHTML = '<div class="spinner !w-5 !h-5 !border-2 inline-block ml-2"></div> الذكاء الاصطناعي شغال...';
  const dataJson = JSON.stringify(B.data);
  const prompts = {
    summary: 'حسّن الملخص المهني (قسم summary) في السيرة دي وخلّيه أقوى وأكثر إقناعاً ومناسب لأنظمة ATS.',
    skills: 'أضف مهارات إضافية مطلوبة في سوق العمل السعودي لنفس المجال في قسم skills (من غير حذف الموجود).',
    translate: 'كمّل كل الحقول الناقصة: أي حقل Ar فاضي ترجمه من En والعكس، في كل الأقسام والبيانات الشخصية.',
    improve: 'أعد صياغة أوصاف الخبرات (descAr/descEn) بأفعال قوية وأرقام وإنجازات قابلة للقياس.'
  };
  const prompt = `${prompts[action]}
دي بيانات السيرة الذاتية JSON:
${dataJson}
أرجع نفس الـ JSON كامل بعد التعديل فقط، بدون أي شرح أو markdown، بنفس البنية والمفاتيح بالظبط.`;

  try {
    const { data } = await api.post('/ai/generate', { prompt, task: 'assist_' + action, resume_id: B.id });
    const m = data.text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('رد غير صالح');
    const upd = JSON.parse(m[0]);
    if (!upd.sections || !upd.personal) throw new Error('بنية غير صحيحة');
    upd.personal.photo = B.data.personal.photo || '';
    upd.personal.logo = B.data.personal.logo || '';
    upd.personal.signature = B.data.personal.signature || '';
    B.data = upd;
    bTouched(); renderBuilderForm(); bPreview();
    if (st) st.innerHTML = '<i class="fas fa-circle-check text-emerald-400 ml-1"></i> تم التعديل (' + bEsc(data.provider) + ') — شوف المعاينة';
    toast('التعديل اتطبق ✅');
  } catch (e) {
    const msg = (e.response && e.response.data && e.response.data.error) || e.message || 'فشل';
    if (st) st.innerHTML = '<i class="fas fa-circle-xmark text-rose-400 ml-1"></i> ' + bEsc(msg);
  }
}

/* ---------- export menu & print PDF ---------- */
function bExportMenu() {
  const slug = B ? B.resume.public_slug : '';
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-file-export text-amber-400 ml-2"></i>تصدير وتنزيل السيرة الذاتية</h3>
    <div class="space-y-2.5">
      <button class="btn-primary w-full !justify-start !py-2.5 shadow-md !bg-gradient-to-r !from-rose-600 !to-indigo-600" onclick="bPDFEditorModal()"><i class="fas fa-sliders ml-2 text-white"></i>فتح محرر ومولد الـ PDF المباشر (Built-in PDF Editor)</button>
      <button class="btn-ghost w-full !justify-start !py-2.5 text-rose-300 hover:text-rose-200" onclick="generateDirectPDF()"><i class="fas fa-file-pdf ml-2 text-rose-400"></i>تحميل PDF عالي الدقة فوراً (A4)</button>
      <button class="btn-ghost w-full !justify-start !py-2.5" onclick="exportDocx(${B.id})"><i class="fas fa-file-word ml-2 text-sky-400"></i>تحميل Word (DOCX)</button>
      <button class="btn-ghost w-full !justify-start !py-2.5" onclick="exportJson(${B.id})"><i class="fas fa-code ml-2 text-amber-400"></i>تحميل JSON (نسخة احتياطية كاملة)</button>
      <button class="btn-ghost w-full !justify-start !py-2.5" onclick="exportTxt(${B.id})"><i class="fas fa-file-lines ml-2 text-slate-400"></i>تحميل TXT (نص خام للـ ATS)</button>
      ${slug ? `<button class="btn-ghost w-full !justify-start !py-2.5" onclick="navigator.clipboard.writeText(location.origin+'/?cv=${slug}'); toast('الرابط اتنسخ ✅')"><i class="fas fa-link ml-2 text-emerald-400"></i>نسخ الرابط العام للسيرة</button>` : ''}
    </div>
    <div class="flex justify-end mt-4"><button class="btn-ghost" onclick="closeModal()">إغلاق</button></div>`, true);
}

function bPDFEditorModal() {
  closeModal();
  if (!B || !B.data) return toast('لا توجد سيرة مفتوحة', 'err');

  const p = B.data.personal || {};
  const tpl = B.resume.template || 'canva_purple';
  const lang = B.resume.language || 'ar';
  const cust = B.customization || {};
  const cvHtml = renderTemplate(tpl, B.data, cust, lang);

  openModal(`
    <div class="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-4">
      <h3 class="font-bold text-lg flex items-center gap-2">
        <i class="fas fa-file-pdf text-rose-500 text-xl"></i>
        <span>محرر الـ PDF المباشر (Built-in PDF Editor)</span>
      </h3>
      <button class="mini-btn" onclick="closeModal()"><i class="fas fa-xmark"></i></button>
    </div>

    <div class="bg-slate-900/80 p-3 rounded-xl mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <div class="flex items-center gap-2">
        <span class="text-slate-400 font-bold">حجم المعاينة:</span>
        <button class="mini-btn" onclick="document.querySelector('#pdf-editor-canvas').style.transform='scale(0.85)'">85%</button>
        <button class="mini-btn !bg-indigo-600 !text-white" onclick="document.querySelector('#pdf-editor-canvas').style.transform='scale(1)'">100%</button>
        <button class="mini-btn" onclick="document.querySelector('#pdf-editor-canvas').style.transform='scale(1.15)'">115%</button>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn-primary !py-2 shadow-lg !bg-gradient-to-r !from-rose-600 !to-indigo-600" onclick="generateDirectPDF()"><i class="fas fa-download ml-1.5"></i>تحميل PDF عالي الدقة (Single-Click)</button>
        <button class="btn-ghost !py-2" onclick="printResumePDF()"><i class="fas fa-print ml-1.5"></i>طباعة النافذة</button>
      </div>
    </div>

    <div class="pdf-editor-viewport bg-slate-950 p-6 rounded-2xl overflow-auto max-h-[70vh] flex justify-center">
      <div id="pdf-editor-canvas" class="transition-transform origin-top duration-200">
        ${cvHtml}
      </div>
    </div>
  `, true);
}

async function generateDirectPDF() {
  if (!B || !B.data) return toast('لا توجد سيرة مفتوحة', 'err');
  
  const p = (B && B.data && B.data.personal) || {};
  const filename = (p.nameAr || p.nameEn || (B && B.resume && B.resume.title) || 'Sira_CV') + '.pdf';
  
  const element = document.querySelector('#b-preview .cv-page') || document.querySelector('#pdf-editor-canvas .cv-page') || document.querySelector('.cv-page');
  if (!element) return toast('تعذر العثور على نموذج المعاينة للسيرة الذاتية', 'err');

  toast('جاري تحضير ملف الـ PDF المطابق للمعاينة 100%... 📄');

  const ensureScript = (src, globalKey) => {
    return new Promise((resolve) => {
      if (window[globalKey] || window[globalKey.toLowerCase()]) return resolve(true);
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        return setTimeout(() => resolve(!!window[globalKey]), 1500);
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  };

  await ensureScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas');
  await ensureScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf');

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const html2canvasFunc = window.html2canvas;
    const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

    if (html2canvasFunc && jsPDFClass) {
      // 100% WYSIWYG: Capture preview element EXACTLY as custom-formatted by user (fonts, sizes, margins)
      const canvas = await html2canvasFunc(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Fit captured preview image to exact A4 dimensions (210mm x 297mm)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      pdf.save(filename);
      toast('تم تنزيل الـ PDF بنفس الخط والتنسيق والمقاس المختار من قِبَلك 100% بنجاح ✅');
    } else {
      printResumePDF();
    }
  } catch (err) {
    console.error('Exact PDF Export Error:', err);
    printResumePDF();
  }
}

function printResumePDF() {
  if (!B || !B.data) return toast('لا توجد سيرة مفتوحة للتنزيل', 'err');
  closeModal();

  const p = B.data.personal || {};
  const tpl = B.resume.template || 'canva_purple';
  const lang = B.resume.language || 'ar';
  const cust = B.customization || {};
  const title = (p.nameAr || p.nameEn || B.resume.title || 'Sira') + ' - CV';

  const cvHtml = renderTemplate(tpl, B.data, cust, lang);

  const printWin = window.open('', '_blank', 'width=950,height=1150');
  if (!printWin) {
    toast('يرجى السماح بفتح النوافذ المنبثقة من المتصفح لتنزيل الـ PDF', 'err');
    return;
  }

  printWin.document.write(`<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : 'ar'}" dir="${lang === 'en' ? 'ltr' : 'rtl'}">
<head>
<meta charset="UTF-8">
<title>${bEsc(title)}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700&family=Almarai:wght@300;400;700&family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700;800&family=Changa:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&family=Inter:wght@300;400;600;700&family=Kufam:wght@400;600;700&family=Montserrat:wght@300;400;600;700&family=Noto+Sans+Arabic:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&family=Readex+Pro:wght@300;400;600;700&family=Roboto:wght@300;400;600;700&family=Rubik:wght@300;400;500;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
<link href="/static/styles.css" rel="stylesheet">
<link href="/static/templates.css" rel="stylesheet">
<style>
@page { size: A4 portrait; margin: 0; }
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 210mm !important;
  min-height: 297mm !important;
  background: #ffffff !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
.cv-page {
  width: 210mm !important;
  height: 297mm !important;
  max-height: 297mm !important;
  overflow: hidden !important;
  margin: 0 auto !important;
  box-shadow: none !important;
  border: none !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
@media print {
  .no-print { display: none !important; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    overflow: hidden !important;
    background: #ffffff !important;
  }
  .cv-page {
    margin: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    box-shadow: none !important;
    border: none !important;
  }
}
body { background: #0f172a; padding: 20px; font-family: 'Cairo', sans-serif; display: flex; flex-direction: column; align-items: center; }
.print-banner { background: #1e293b; color: #fff; padding: 12px 24px; border-radius: 12px; margin-bottom: 20px; text-align: center; max-width: 800px; width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
.print-btn { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 8px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; margin-top: 8px; font-family: inherit; }
</style>
</head>
<body>
<div class="print-banner no-print">
  <div><b>اختر "حفظ بتنسيق PDF" (Save as PDF) من نافذة الطباعة لتنزيل الملف بالتنسيق والخط والرموز كاملة في صفحة واحدة A4</b></div>
  <button class="print-btn" onclick="window.print()"><i class="fas fa-file-pdf ml-1"></i>حفظ / تنزيل PDF الآن</button>
</div>
${cvHtml}
<script>
window.onload = function() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() {
      setTimeout(function() { window.print(); }, 300);
    });
  } else {
    setTimeout(function() { window.print(); }, 600);
  }
};
</script>
</body>
</html>`);
  printWin.document.close();
  toast('جاري فتح نافذة تنزيل ملف الـ PDF... 📄');
}
