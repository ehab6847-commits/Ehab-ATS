/* ============ Ehab ATS - Resume Builder (builder.js) ============ */
const B = { liveEditMode: false, id: null, resume: null, data: null, cust: null, dirty: false, saveTimer: null, verCounter: 0 };

function bEsc(s) { return (s == null ? '' : String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function bid() { return 'x' + Math.random().toString(36).slice(2, 9); }

const ARABIC_FONTS = [
  { name: 'Cairo', ar: 'Cairo (كايرو - عصري رسمي)' },
  { name: 'Tajawal', ar: 'Tajawal (تاجوال - احترافي للشركات)' },
  { name: 'Almarai', ar: 'Almarai (المراعي - ناعم وأنيق)' },
  { name: 'IBM Plex Sans Arabic', ar: 'IBM Plex (آي بي إم بلكس - تقني عالمي)' },
  { name: 'Alexandria', ar: 'Alexandria (الإسكندرية - حديث ومقروء)' },
  { name: 'Readex Pro', ar: 'Readex Pro (ريدكس برو - هندسي عصري)' },
  { name: 'Noto Sans Arabic', ar: 'Noto Sans (نوتو سانس - قياسي ومعتمد)' },
  { name: 'Amiri', ar: 'Amiri (أميري - كلاسيكي عريق)' },
  { name: 'Changa', ar: 'Changa (شانجا - عريض وجريء)' },
  { name: 'Kufam', ar: 'Kufam (كوفام - كوفي حديث)' },
  { name: 'Rubik', ar: 'Rubik (روبيك - انسيابي ودائري)' },
  { name: 'Noto Kufi Arabic', ar: 'Noto Kufi (نوتو كوفي - هندسي رسمي)' },
  { name: 'Mada', ar: 'Mada (مدى - بسيط وواضح)' },
  { name: 'Marhey', ar: 'Marhey (مرحي - جذاب وحيوي)' },
  { name: 'Reem Kufi', ar: 'Reem Kufi (ريم كوفي - كوفي تراثي عصري)' },
  { name: 'Aref Ruqaa', ar: 'Aref Ruqaa (عارف رقعة - رقعة مميز)' },
  { name: 'Lateef', ar: 'Lateef (لطيف - رشيق وواضح)' },
  { name: 'Scheherazade New', ar: 'Scheherazade (شهرزاد - نسخي كلاسيكي)' },
  { name: 'El Messiri', ar: 'El Messiri (المسيري - فني أنيق)' },
  { name: 'Lemonada', ar: 'Lemonada (ليمونادة - مرح وعصري)' }
];

const ENGLISH_FONTS = [
  { name: 'Times New Roman', en: 'Times New Roman (تايمز نيو رومان - كلاسيكي رسمي)' },
  { name: 'Inter', en: 'Inter (إنتر - معيار الـ ATS العالمي)' },
  { name: 'Roboto', en: 'Roboto (روبوتو - قياسي واحترافي)' },
  { name: 'Montserrat', en: 'Montserrat (مونتسيرات - هندسي أنيق)' },
  { name: 'Outfit', en: 'Outfit (أوتفيت - مودرن وعصري)' },
  { name: 'Poppins', en: 'Poppins (بوبينز - متناسق ودائري)' },
  { name: 'Open Sans', en: 'Open Sans (أوبن سانس - مقروء وواضح)' },
  { name: 'Lato', en: 'Lato (لاتو - كلاسيكي وتنفيذي)' },
  { name: 'Plus Jakarta Sans', en: 'Plus Jakarta (جاكرتا سانس - تقني فاخر)' },
  { name: 'Space Grotesk', en: 'Space Grotesk (سبيس غروتسك - حديث ومبتكر)' },
  { name: 'Raleway', en: 'Raleway (ريلواي - راقي ورفيع)' },
  { name: 'Playfair Display', en: 'Playfair Display (بليفير ديسبلاي - سيرف فاخر)' },
  { name: 'Merriweather', en: 'Merriweather (ميريويذر - مقروء ورسمي)' },
  { name: 'Fira Sans', en: 'Fira Sans (فيرا سانس - تنفيذي متقن)' },
  { name: 'Work Sans', en: 'Work Sans (ورك سانس - عملي للوظائف)' },
  { name: 'Oswald', en: 'Oswald (أوزوالد - بارز للعناوين)' }
];

const FONTS_LIST = ARABIC_FONTS;

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
  const fontOptsAr = ARABIC_FONTS.map(f => `<option value="${f.name}" ${(c.fontAr || 'Cairo') === f.name ? 'selected' : ''}>${bEsc(f.ar)}</option>`).join('');
  const fontOptsEn = ENGLISH_FONTS.map(f => `<option value="${f.name}" ${(c.fontEn || 'Inter') === f.name ? 'selected' : ''}>${bEsc(f.en)}</option>`).join('');
  
  const isEnOnly = r.language === 'en';
  const isBilingual = r.language === 'bilingual';

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
      
      <!-- Quick Font Family Selectors (20 Arabic & 15 English) -->
      ${!isEnOnly ? `
      <select id="b-font-ar" class="input-field !py-1.5 !w-auto text-xs" onchange="bCust('fontAr', this.value)" title="نوع الخط العربي (20 خط)">
        ${fontOptsAr}
      </select>` : ''}

      ${(isEnOnly || isBilingual) ? `
      <select id="b-font-en" class="input-field !py-1.5 !w-auto text-xs" onchange="bCust('fontEn', this.value)" title="نوع الخط الإنجليزي (15 خط)">
        ${fontOptsEn}
      </select>` : ''}

      <!-- Quick Font Size Controls -->
      <div class="flex items-center gap-1 glass px-2 py-1 rounded-lg">
        <button class="mini-btn" onclick="bChangeFontSize(-1)" title="تصغير الخط"><i class="fas fa-minus text-xs"></i></button>
        <span class="text-xs font-bold w-6 text-center" id="b-fs-label">${c.fontSize || 14}</span>
        <button class="mini-btn" onclick="bChangeFontSize(1)" title="تكبير الخط"><i class="fas fa-plus text-xs"></i></button>
      </div>

      <div class="mr-auto flex items-center gap-1.5 flex-wrap">
        <span id="b-save-ind" class="text-xs text-slate-400"><i class="fas fa-check"></i> محفوظ</span>
        
        <!-- Prominent Download & Share Buttons -->
        <button class="btn-primary !bg-gradient-to-r !from-emerald-600 !to-teal-600 hover:!from-emerald-500 hover:!to-teal-500 !py-1.5 !px-3.5 text-xs font-bold shadow-lg flex items-center gap-1.5 text-white" onclick="generateDirectPDF()" title="تحميل ملف PDF فوري عالي الدقة A4"><i class="fas fa-download text-amber-300"></i><span>تنزيل PDF</span></button>
        <button class="btn-ghost !bg-slate-800 hover:!bg-slate-700 !py-1.5 !px-3 text-xs font-semibold flex items-center gap-1.5 text-emerald-400 border border-emerald-500/30" onclick="bShareModal()" title="مشاركة السيرة عبر واتساب وفيسبوك وتيليجرام"><i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i><i class="fas fa-share-nodes text-sky-400"></i><span>مشاركة</span></button>

        <button class="btn-primary !bg-gradient-to-r !from-purple-600 !to-indigo-600 !py-1.5 !px-3 text-xs shadow-md" onclick="bOneShotAIModal()" title="ضع معلومات السيرة دفعة واحدة ليقوم الذكاء الاصطناعي بتعبئتها وتوليدها بنفس القالب المختار حالياً"><i class="fas fa-wand-magic-sparkles text-amber-300 ml-1"></i>توليد من نص</button>
        <button class="btn-ghost !py-1.5 !px-2.5 text-xs" onclick="bVersionsModal()" title="الإصدارات"><i class="fas fa-clock-rotate-left"></i></button>
        <button class="btn-ghost !py-1.5 !px-2.5 text-xs" onclick="bAIModal()" title="مساعد AI الشامل"><i class="fas fa-wand-magic-sparkles text-violet-400 ml-1"></i>AI</button>
        <button class="btn-ghost !py-1.5 !px-2.5 text-xs" onclick="bExportMenu()" title="تصدير وتنسيقات أخرى"><i class="fas fa-file-export ml-1"></i>تصدير</button>
        <button class="btn-primary !py-1.5 text-xs" onclick="bSave(true)"><i class="fas fa-save ml-1"></i>حفظ</button>
      </div>
    </header>
    
    <!-- Mobile View Switcher Tab Bar -->
    <div class="md:hidden flex items-center justify-center p-2 bg-slate-900 border-b border-slate-700/60 sticky top-[58px] z-20 gap-2">
      <button id="b-tab-form" class="btn-primary !py-1.5 !px-4 text-xs font-bold shadow-md flex-1 !bg-indigo-600 text-white" onclick="bSwitchMobileTab('form')"><i class="fas fa-pen-to-square ml-1.5"></i>تعديل السيرة</button>
      <button id="b-tab-preview" class="btn-ghost !py-1.5 !px-4 text-xs font-bold flex-1 text-slate-300 border border-slate-700" onclick="bSwitchMobileTab('preview')"><i class="fas fa-eye ml-1.5 text-sky-400"></i>معاينة السيرة 👁️</button>
    </div>

    <div class="builder-grid flex-1">
      <div class="builder-form-col" id="b-form"></div>
                  <div class="builder-preview-col" id="b-preview-col" dir="ltr" style="display:block; position:relative; overflow-y:auto; overflow-x:hidden; width:100%; height:100%; background:#0b0f19; padding:0 0 140px 0;">
        <!-- Top Customizer Floating Bar (matching requested layout) -->
        <div id="b-preview-customizer" class="w-full sticky top-0 z-20 glass-strong border-b border-slate-700/80 px-3 py-2 flex items-center justify-between gap-2 flex-wrap shadow-xl">
          <!-- Quick Color Themes -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[11px] font-bold text-slate-300">الثيمات:</span>
            <button class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-sky-400 hover:bg-slate-800" onclick="bApplyTheme('#0f172a','#0284c7')" title="كحلي"><span class="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block ml-1"></span>كحلي</button>
            <button class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-rose-400 hover:bg-slate-800" onclick="bApplyTheme('#881337','#be123c')" title="نبيذي"><span class="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block ml-1"></span>نبيذي</button>
            <button class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800" onclick="bApplyTheme('#064e3b','#059669')" title="زيتوني"><span class="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block ml-1"></span>زيتوني</button>
            <button class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800" onclick="bApplyTheme('#1e293b','#475569')" title="رمادي"><span class="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block ml-1"></span>رمادي</button>
            <button class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-amber-300 hover:bg-slate-800" onclick="bApplyTheme('#000000','#d97706')" title="أسود وذهبي"><span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-1"></span>ذهبي</button>
            <button class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-white hover:bg-slate-800" onclick="bApplyTheme('#000000','#000000')" title="رسمي أسود"><span class="w-2.5 h-2.5 rounded-full bg-black inline-block ml-1"></span>أسود</button>
          </div>

          <!-- 6 Skills & Courses Layout Selector -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[11px] font-bold text-slate-300">المهارات:</span>
            <select id="b-skills-layout-sel" class="input-field !py-1 !px-2 text-xs font-semibold !w-auto bg-slate-900 border-slate-700 text-sky-300" onchange="bSetSkillsLayout(this.value)">
              <option value="cards_plus" ${(c.skillsLayout === 'cards_plus' || !c.skillsLayout) ? 'selected' : ''}>➕ بطاقات بأيقونة (+)</option>
              <option value="chips" ${c.skillsLayout === 'chips' ? 'selected' : ''}>🏷️ كبسولات ملونة (Tags)</option>
              <option value="grid_dots" ${c.skillsLayout === 'grid_dots' ? 'selected' : ''}>• شبكة منقطة (عمودين)</option>
              <option value="columns_clean" ${c.skillsLayout === 'columns_clean' ? 'selected' : ''}>📑 أعمدة متوازية</option>
              <option value="progress" ${c.skillsLayout === 'progress' ? 'selected' : ''}>📊 شريط مستوى وتقدم</option>
              <option value="list_classic" ${c.skillsLayout === 'list_classic' ? 'selected' : ''}>📜 قائمة كلاسيكية</option>
            </select>
          </div>

          <!-- Font Size & Margin Controls -->
          <div class="flex items-center gap-1.5">
            <div class="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-xs">
              <span class="text-[10px] text-slate-400 font-bold">العناوين:</span>
              <button class="mini-btn" onclick="bChangeFontSize(-1)" title="تصغير">-</button>
              <span class="text-xs font-bold text-white w-5 text-center">${c.fontSize || 14}</span>
              <button class="mini-btn" onclick="bChangeFontSize(1)" title="تكبير">+</button>
            </div>

            <!-- Inline Live Edit Toggle -->
            <button id="b-btn-live-edit" class="btn-ghost !py-1 !px-2.5 text-xs font-bold ${B.liveEditMode ? '!bg-amber-500 !text-slate-950 shadow-md' : 'text-slate-300 border border-slate-700 bg-slate-900'}" onclick="bToggleLiveEditMode()" title="تعديل مباشر بالكتابة داخل السيرة مباشرة">
              <i class="fas fa-pen-to-square ml-1 text-sky-400"></i><span>${B.liveEditMode ? 'إيقاف التعديل المباشر' : 'تعديل مباشر ✏️'}</span>
            </button>
          </div>
        </div>

        <div id="b-preview-outer" style="display:flex; justify-content:center; align-items:flex-start; width:100%; margin-top:16px; margin-bottom:20px; padding:0 8px;">
          <div id="b-preview-wrap" dir="${r.language === 'en' ? 'ltr' : 'rtl'}" style="transform-origin:top center; width:794px; min-width:794px; max-width:794px; margin:0 auto;"></div>
        </div>

        <!-- Bottom Template Carousel Dock -->
        <div id="b-template-carousel-dock" class="w-full fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-slate-700/80 px-3 py-2 shadow-2xl">
          <div class="flex items-center justify-between mb-1.5 px-2">
            <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5"><i class="fas fa-layer-group text-sky-400"></i>اختر قالب السيرة لمعاينته فوراً بنقرة واحدة (${Object.keys(TEMPLATE_DEFS).length} قالب متاح):</span>
            <span class="text-[11px] text-emerald-400 font-semibold">القالب المختار: <b class="text-white">${bEsc(TEMPLATE_DEFS[r.template]?.name || r.template)}</b></span>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin px-1" id="b-tpl-cards-row" style="scrollbar-width:thin;">
            ${bRenderTemplateCarouselCards(r.template)}
          </div>
        </div>
      </div>
    </div>
  </div>`;

  renderBuilderForm();
  bPreview();

  if (window.innerWidth <= 900) {
    const formCol = document.getElementById('b-form');
    const prevCol = document.getElementById('b-preview-col');
    if (formCol) formCol.style.setProperty('display', 'block', 'important');
    if (prevCol) prevCol.style.setProperty('display', 'none', 'important');
  }

  window.addEventListener('resize', bScalePreview);
}

function bSwitchMobileTab(tab) {
  const formCol = document.getElementById('b-form');
  const prevCol = document.getElementById('b-preview-col');
  const btnForm = document.getElementById('b-tab-form');
  const btnPrev = document.getElementById('b-tab-preview');
  if (!formCol || !prevCol) return;

  if (tab === 'preview') {
    formCol.style.setProperty('display', 'none', 'important');
    prevCol.style.setProperty('display', 'flex', 'important');
    prevCol.style.setProperty('visibility', 'visible', 'important');
    prevCol.style.setProperty('justify-content', 'center', 'important');
    prevCol.style.width = '100%';
    prevCol.style.minHeight = 'calc(100vh - 120px)';
    prevCol.style.background = '#0b0f19';
    prevCol.style.padding = '14px 4px';
    prevCol.style.overflowX = 'hidden';
    prevCol.style.overflowY = 'auto';

    if (btnPrev) {
      btnPrev.className = 'btn-primary !py-2 !px-4 text-xs font-bold shadow-lg flex-1 !bg-indigo-600 text-white';
    }
    if (btnForm) {
      btnForm.className = 'btn-ghost !py-2 !px-4 text-xs font-bold flex-1 text-slate-300 border border-slate-700 bg-slate-800/80';
    }
    bPreview();
    setTimeout(bScalePreview, 40);
    setTimeout(bScalePreview, 180);
  } else {
    prevCol.style.setProperty('display', 'none', 'important');
    formCol.style.setProperty('display', 'block', 'important');
    formCol.style.setProperty('visibility', 'visible', 'important');
    formCol.style.width = '100%';

    if (btnForm) {
      btnForm.className = 'btn-primary !py-2 !px-4 text-xs font-bold shadow-lg flex-1 !bg-indigo-600 text-white';
    }
    if (btnPrev) {
      btnPrev.className = 'btn-ghost !py-2 !px-4 text-xs font-bold flex-1 text-slate-300 border border-slate-700 bg-slate-800/80';
    }
  }
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
  if (field === 'language') {
    if (val === 'en' || val === 'bilingual') {
      if (typeof ensureEnglishData === 'function') {
        ensureEnglishData(B.data, true);
      }
    }
    bTouched();
    renderBuilder();
    return;
  }
  bTouched();
  if (field === 'template') bPreview();
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
  if (B.liveEditMode) {
    bApplyLiveEditToPreview();
  }
}
function bScalePreview() {
  const col = document.getElementById('b-preview-col');
  const wrap = document.getElementById('b-preview-wrap');
  if (!col || !wrap) return;

  const colWidth = (col.clientWidth > 0) ? col.clientWidth : window.innerWidth;
  const padding = (window.innerWidth <= 768) ? 8 : 24;
  const avail = Math.max(240, colWidth - padding);
  const scale = Math.min(1, avail / 794);

  wrap.style.transform = 'scale(' + scale + ')';
  wrap.style.transformOrigin = 'top center';
  wrap.style.width = '794px';
  wrap.style.minWidth = '794px';
  wrap.style.maxWidth = '794px';
  wrap.style.margin = '0 auto';

  const pageEl = wrap.querySelector('.cv-page') || wrap;
  const naturalH = (pageEl && pageEl.scrollHeight > 0) ? pageEl.scrollHeight : 1123;
  wrap.style.height = (naturalH * scale + 40) + 'px';

  const outer = document.getElementById('b-preview-outer');
  if (outer) {
    outer.style.width = '100%';
    outer.style.display = 'flex';
    outer.style.justifyContent = 'center';
  }
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
  const isTextKind = def.kind === 'text';

  return `
  <div class="section-card ${sec.visible === false ? 'opacity-50' : ''} collapsed" data-idx="${i}">
    <div class="section-head">
      <span class="drag-handle" onclick="event.stopPropagation()"><i class="fas fa-grip-vertical"></i></span>
      <i class="fas ${def.icon} text-indigo-400" onclick="bToggleCollapse(${i})"></i>
      <span class="font-bold flex-1 cursor-pointer" onclick="bToggleCollapse(${i})">${bEsc(sec.titleAr || def.ar)} <span class="text-xs text-slate-400">(${isTextKind ? ((sec.textAr || sec.textEn) ? '1' : '0') : (sec.items || []).length})</span></span>
      
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
      ${isTextKind ? `
        <div class="space-y-2 mb-2">
          <div><label class="fld">محتوى ونص القسم (عربي)</label><textarea class="input-field !py-1.5 text-xs" rows="3" oninput="bSecField(${i},'textAr',this.value)">${bEsc(sec.textAr || '')}</textarea></div>
          <div><label class="fld">Section Content (En)</label><textarea class="input-field !py-1.5 text-xs" dir="ltr" rows="3" oninput="bSecField(${i},'textEn',this.value)">${bEsc(sec.textEn || '')}</textarea></div>
        </div>
      ` : ''}
      ${def.kind === 'skills' ? `<label class="flex items-center gap-2 text-xs text-slate-400 mb-2"><input type="checkbox" ${sec.showBars ? 'checked' : ''} onchange="bSecField(${i},'showBars',this.checked)"> عرض كأشرطة مستوى بدل شرائح</label>` : ''}
      ${items}
      ${!isTextKind ? `<button class="btn-ghost w-full !py-1.5 !text-sm mt-1" onclick="bAddItem(${i})"><i class="fas fa-plus ml-1"></i>إضافة عنصر للقسم</button>` : ''}
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
  const fontOptsAr = ARABIC_FONTS.map(f => `<option value="${f.name}" ${(c.fontAr || 'Cairo') === f.name ? 'selected' : ''}>${bEsc(f.ar)}</option>`).join('');
  const fontOptsEn = ENGLISH_FONTS.map(f => `<option value="${f.name}" ${(c.fontEn || 'Inter') === f.name ? 'selected' : ''}>${bEsc(f.en)}</option>`).join('');

  return `
  <div class="section-card mt-3 collapsed" id="b-cust-card">
    <div class="section-head" onclick="document.getElementById('b-cust-card').classList.toggle('collapsed')">
      <i class="fas fa-palette text-pink-400"></i><span class="font-bold">التخصيص والألوان والخطوط (20 خط عربي + 15 خط إنجليزي)</span>
      <i class="fas fa-chevron-down mr-auto text-slate-400 text-xs"></i>
    </div>
    <div class="section-body">
      <div class="grid grid-cols-2 gap-2">
        <div><label class="fld">اللون الأساسي</label><input type="color" class="input-field !p-1 !h-9" value="${bEsc(c.themeColor || '#1a3a5c')}" oninput="bCust('themeColor', this.value)"></div>
        <div><label class="fld">لون التمييز</label><input type="color" class="input-field !p-1 !h-9" value="${bEsc(c.accentColor || '#2d6da3')}" oninput="bCust('accentColor', this.value)"></div>
        <div><label class="fld">خط النص العربي (20 خط)</label><select class="input-field !py-1.5 text-xs" onchange="bCust('fontAr', this.value)">${fontOptsAr}</select></div>
        <div><label class="fld">خط النص الإنجليزي (15 خط)</label><select class="input-field !py-1.5 text-xs" onchange="bCust('fontEn', this.value)">${fontOptsEn}</select></div>
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
  if (!text) return toast('اكتب أو إلصق المعلومات أولاً', 'err');

  const lang = document.getElementById('oneshot-lang')?.value || B.resume.language || 'ar';
  const st = document.getElementById('oneshot-status');
  if (st) st.innerHTML = '<div class="spinner !w-4 !h-4 !border-2 inline-block ml-1"></div> جاري تنظيم البيانات وتوليد محتوى السيرة الذاتية بالذكاء الاصطناعي...';

  try {
    let upd = null;
    if (typeof parseUserRawResumeText === 'function') {
      upd = parseUserRawResumeText(text, lang);
    }

    if (!upd || !upd.sections || !upd.personal) {
      const { data } = await api.post('/ai/generate', { prompt: text, task: 'full_resume', language: lang, resume_id: B.id });
      const m = (data.text || '').match(/\{[\s\S]*\}/);
      if (m) upd = JSON.parse(m[0]);
    }

    if (!upd || !upd.sections || !upd.personal) throw new Error('بنية غير صحيحة');

    // Retain existing uploaded photos/logos/signatures if any
    if (B.data && B.data.personal) {
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
    toast('تم تعبئة وتوليد السيرة الذاتية بنجاح على القالب المختار ✅');
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

/* ---------- share & export modal ---------- */
async function bSharePDFFile() {
  if (!B || !B.data) return toast('لا توجد سيرة مفتوحة للمشاركة', 'err');
  const p = (B && B.data && B.data.personal) || {};
  const filename = (p.nameAr || p.nameEn || (B && B.resume && B.resume.title) || 'CV-ATS') + '.pdf';
  const tpl = (B && B.resume && B.resume.template) || 'ats1';
  const lang = (B && B.resume && B.resume.language) || 'ar';
  const cust = B.cust || {};

  toast('جاري تجهيز ملف الـ PDF للمشاركة المباشرة... 📄📲');

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

  const renderSandbox = document.createElement('div');
  renderSandbox.style.position = 'fixed';
  renderSandbox.style.left = '-9999px';
  renderSandbox.style.top = '0';
  renderSandbox.style.width = '794px';
  renderSandbox.style.minHeight = '1123px';
  renderSandbox.style.background = '#ffffff';
  renderSandbox.style.zIndex = '-9999';
  renderSandbox.style.opacity = '1';
  renderSandbox.style.pointerEvents = 'none';

  renderSandbox.innerHTML = renderTemplate(tpl, B.data, cust, lang);
  document.body.appendChild(renderSandbox);

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await new Promise(r => setTimeout(r, 200));

    const targetEl = renderSandbox.querySelector('.cv-page') || renderSandbox;
    const html2canvasFunc = window.html2canvas;
    const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

    if (html2canvasFunc && jsPDFClass) {
      const canvas = await html2canvasFunc(targetEl, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // Embed clickable PDF hyperlink annotations
      try {
        const targetRect = targetEl.getBoundingClientRect();
        const links = targetEl.querySelectorAll('a[href]');
        links.forEach((a) => {
          const href = a.getAttribute('href');
          if (!href) return;
          const rect = a.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && targetRect.width > 0 && targetRect.height > 0) {
            const xMm = ((rect.left - targetRect.left) / targetRect.width) * 210;
            const yMm = ((rect.top - targetRect.top) / targetRect.height) * 297;
            const wMm = (rect.width / targetRect.width) * 210;
            const hMm = (rect.height / targetRect.height) * 297;
            pdf.link(xMm, yMm, wMm, hMm, { url: href });
          }
        });
      } catch (e) {}

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      // Native Device Share (WhatsApp, Telegram, AirDrop, etc.) with the actual PDF attached!
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: filename,
            text: '📄 ملف السيرة الذاتية المهنية: ' + (p.nameAr || p.nameEn || '')
          });
          toast('تمت مشاركة ملف الـ PDF بنجاح 📲✅');
          return;
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') return; // User cancelled
        }
      }

      // If navigator.share with files is not supported (e.g. desktop browser):
      // Download the PDF file and open the share options modal with the direct file link!
      const blobUrl = URL.createObjectURL(pdfBlob);
      pdf.save(filename);
      bShareModal(blobUrl);
    }
  } catch (err) {
    console.error(err);
    toast('فشل تجهيز ملف المشاركة', 'err');
  } finally {
    if (renderSandbox.parentNode) {
      renderSandbox.parentNode.removeChild(renderSandbox);
    }
  }
}

function bShareModal(pdfBlobUrl) {
  if (!B || !B.data) return toast('لا توجد سيرة مفتوحة للمشاركة', 'err');
  const p = B.data.personal || {};
  const name = p.nameAr || p.nameEn || 'المتقدم';
  const title = B.resume.title || 'سيرة ذاتية احترافية';
  const slug = B.resume.public_slug || ('cv-' + B.id);
  const publicUrl = location.origin + '/?cv=' + slug;

  openModal(`
    <div class="text-center mb-3">
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl mb-2">
        <i class="fas fa-file-pdf text-2xl text-emerald-400"></i>
      </div>
      <h3 class="font-bold text-lg">خيارات مشاركة وفتح ملف السيرة 🚀</h3>
      <p class="text-xs text-slate-400 mt-1">${bEsc(title)} — ${bEsc(name)}</p>
    </div>

    <!-- Direct File Actions: Share File / Open File -->
    <div class="space-y-2 mb-4">
      <button class="btn-primary w-full !py-2.5 !px-4 text-xs font-bold !bg-gradient-to-r !from-emerald-600 !to-teal-600 shadow-lg flex items-center justify-center gap-2" onclick="closeModal(); bSharePDFFile()">
        <i class="fa-brands fa-whatsapp text-lg"></i>
        <span>مشاركة ملف الـ PDF مباشرة عبر واتساب والتطبيقات 📲</span>
      </button>

      ${pdfBlobUrl ? `
      <a href="${pdfBlobUrl}" target="_blank" class="btn-ghost w-full !py-2 !px-4 text-xs font-bold border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20">
        <i class="fas fa-arrow-up-right-from-square"></i>
        <span>فتح وعرض ملف الـ PDF الآن 👁️</span>
      </a>
      ` : `
      <button class="btn-ghost w-full !py-2 !px-4 text-xs font-bold border border-slate-700 text-slate-200 flex items-center justify-center gap-2" onclick="closeModal(); generateDirectPDF()">
        <i class="fas fa-download text-emerald-400"></i>
        <span>تنزيل نسخة PDF إلى الجهاز 📥</span>
      </button>
      `}
    </div>

    <!-- Direct Download Options -->
    <div class="border-t border-slate-700/60 pt-3">
      <div class="text-xs text-slate-400 font-bold mb-2.5">تنسيقات إضافية:</div>
      <div class="grid grid-cols-3 gap-2">
        <button class="btn-ghost !py-2 text-xs text-sky-300" onclick="closeModal(); exportDocx(${B.id})"><i class="fas fa-file-word ml-1 text-sky-400"></i>Word (DOCX)</button>
        <button class="btn-ghost !py-2 text-xs text-slate-300" onclick="closeModal(); exportTxt(${B.id})"><i class="fas fa-file-lines ml-1 text-amber-400"></i>نص ATS (TXT)</button>
        <button class="btn-ghost !py-2 text-xs text-purple-300" onclick="bPDFEditorModal()"><i class="fas fa-sliders ml-1 text-purple-400"></i>محرر PDF</button>
      </div>
    </div>

    <!-- Direct Download Options -->
    <div class="border-t border-slate-700/60 pt-3">
      <div class="text-xs text-slate-400 font-bold mb-2.5">تنزيل السيرة فوراً:</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button class="btn-primary !bg-gradient-to-r !from-emerald-600 !to-teal-600 !py-2 text-xs font-bold shadow-md" onclick="closeModal(); generateDirectPDF()"><i class="fas fa-file-pdf ml-1"></i>PDF فوري</button>
        <button class="btn-ghost !py-2 text-xs text-sky-300" onclick="closeModal(); exportDocx(${B.id})"><i class="fas fa-file-word ml-1 text-sky-400"></i>Word (DOCX)</button>
        <button class="btn-ghost !py-2 text-xs text-slate-300" onclick="closeModal(); exportTxt(${B.id})"><i class="fas fa-file-lines ml-1 text-amber-400"></i>نص ATS (TXT)</button>
        <button class="btn-ghost !py-2 text-xs text-slate-300" onclick="bPDFEditorModal()"><i class="fas fa-sliders ml-1 text-purple-400"></i>محرر PDF</button>
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <button class="btn-ghost" onclick="closeModal()">إغلاق</button>
    </div>
  `, true);
}

/* ---------- export menu & print PDF ---------- */
function bExportMenu() {
  const slug = B ? B.resume.public_slug : '';
  openModal(`
    <h3 class="font-bold text-lg mb-4"><i class="fas fa-file-export text-amber-400 ml-2"></i>تصدير وتنزيل السيرة الذاتية</h3>
    <div class="space-y-2.5">
      <button class="btn-primary w-full !justify-start !py-2.5 shadow-md !bg-gradient-to-r !from-emerald-600 !to-teal-600" onclick="generateDirectPDF()"><i class="fas fa-file-pdf ml-2 text-amber-300"></i>تحميل PDF فوري عالي الدقة (A4)</button>
      <button class="btn-ghost w-full !justify-start !py-2.5 text-emerald-400" onclick="bShareModal()"><i class="fa-brands fa-whatsapp ml-2 text-emerald-400"></i>مشاركة عبر واتساب ومواقع التواصل</button>
      <button class="btn-ghost w-full !justify-start !py-2.5 text-purple-300" onclick="bPDFEditorModal()"><i class="fas fa-sliders ml-2 text-purple-400"></i>فتح محرر ومولد الـ PDF المباشر</button>
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
  const tpl = B.resume.template || 'ats1';
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
  const filename = (p.nameAr || p.nameEn || (B && B.resume && B.resume.title) || 'CV-ATS') + '.pdf';
  const tpl = (B && B.resume && B.resume.template) || 'ats1';
  const lang = (B && B.resume && B.resume.language) || 'ar';
  const cust = B.cust || {};

  toast('جاري تجهيز وتنزيل ملف الـ PDF عالي الدقة... 📄');

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

  // Create isolated off-screen rendering sandbox at exact standard A4 width (794px)
  // This guarantees full rendering regardless of mobile screen width or hidden tabs!
  const renderSandbox = document.createElement('div');
  renderSandbox.style.position = 'fixed';
  renderSandbox.style.left = '-9999px';
  renderSandbox.style.top = '0';
  renderSandbox.style.width = '794px';
  renderSandbox.style.minHeight = '1123px';
  renderSandbox.style.background = '#ffffff';
  renderSandbox.style.zIndex = '-9999';
  renderSandbox.style.opacity = '1';
  renderSandbox.style.pointerEvents = 'none';

  renderSandbox.innerHTML = renderTemplate(tpl, B.data, cust, lang);
  document.body.appendChild(renderSandbox);

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise(r => setTimeout(r, 200));

    const targetEl = renderSandbox.querySelector('.cv-page') || renderSandbox;
    const html2canvasFunc = window.html2canvas;
    const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

    if (html2canvasFunc && jsPDFClass) {
      const canvas = await html2canvasFunc(targetEl, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // Embed clickable PDF hyperlink annotations for email (mailto), LinkedIn, website, and phone
      try {
        const targetRect = targetEl.getBoundingClientRect();
        const links = targetEl.querySelectorAll('a[href]');
        links.forEach((a) => {
          const href = a.getAttribute('href');
          if (!href) return;
          const rect = a.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && targetRect.width > 0 && targetRect.height > 0) {
            const xMm = ((rect.left - targetRect.left) / targetRect.width) * 210;
            const yMm = ((rect.top - targetRect.top) / targetRect.height) * 297;
            const wMm = (rect.width / targetRect.width) * 210;
            const hMm = (rect.height / targetRect.height) * 297;
            pdf.link(xMm, yMm, wMm, hMm, { url: href });
          }
        });
      } catch (e) {
        console.warn('PDF Link annotations notice:', e);
      }

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      pdf.save(filename);
      toast('تم تنزيل السيرة بصيغة PDF مع روابط تفاعلية بنجاح 📄✅');

      setTimeout(() => {
        bShareModal(blobUrl);
      }, 500);
    } else {
      printResumePDF();
    }
  } catch (err) {
    console.error('PDF Export Error:', err);
    printResumePDF();
  } finally {
    if (renderSandbox.parentNode) {
      renderSandbox.parentNode.removeChild(renderSandbox);
    }
  }
}

function printResumePDF() {
  if (!B || !B.data) return toast('لا توجد سيرة مفتوحة للتنزيل', 'err');
  closeModal();

  // On mobile devices, direct PDF rendering is 100% reliable and doesn't rely on popup windows
  if (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return generateDirectPDF();
  }

  const p = B.data.personal || {};
  const tpl = B.resume.template || 'ats1';
  const lang = B.resume.language || 'ar';
  const cust = B.customization || {};
  const title = (p.nameAr || p.nameEn || B.resume.title || 'Sira') + ' - CV';

  const cvHtml = renderTemplate(tpl, B.data, cust, lang);

  const printWin = window.open('', '_blank', 'width=950,height=1150');
  if (!printWin) {
    return generateDirectPDF();
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
  .cv-sec-title,
  .cv-formal-pro .cv-sec-title,
  .cv-bilingual-split-page .cv-sec-title {
    padding-bottom: 10px !important;
    margin-bottom: 14px !important;
    line-height: 1.6 !important;
    display: block !important;
    box-sizing: border-box !important;
  }
  [dir="rtl"] * {
    letter-spacing: normal !important;
    text-transform: none !important;
  }
}
.cv-sec-title,
.cv-formal-pro .cv-sec-title,
.cv-bilingual-split-page .cv-sec-title {
  padding-bottom: 10px !important;
  margin-bottom: 14px !important;
  line-height: 1.6 !important;
  display: block !important;
  box-sizing: border-box !important;
}
[dir="rtl"] .cv-sec-title,
[dir="rtl"] .cv-name-ar,
[dir="rtl"] .cv-name,
[dir="rtl"] .cv-item-role,
[dir="rtl"] .cv-item-desc {
  letter-spacing: normal !important;
  text-transform: none !important;
  font-feature-settings: "kern" 1, "liga" 1;
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


function bRenderTemplateCarouselCards(activeTpl) {
  return Object.entries(TEMPLATE_DEFS).map(([key, tpl]) => {
    const isAct = key === activeTpl;
    return `
      <div class="tpl-dock-card shrink-0 cursor-pointer rounded-xl p-2 transition-all duration-200 ${isAct ? 'border-2 border-sky-400 bg-sky-950/80 shadow-lg shadow-sky-500/20 scale-[1.03]' : 'border border-slate-700/80 bg-slate-900/90 hover:border-slate-500 hover:bg-slate-800/90'}" style="min-width:130px; max-width:145px;" onclick="bSwitchTemplateFromDock('${key}')">
        <div class="h-14 rounded-lg bg-white/95 p-1.5 relative overflow-hidden flex flex-col justify-between border border-slate-300 shadow-inner">
          <div class="flex items-center gap-1">
            <div class="w-2.5 h-2.5 rounded-full" style="background:${tpl.color || '#000'}"></div>
            <div class="h-1.5 rounded-full w-12 bg-slate-700"></div>
          </div>
          <div class="space-y-0.5">
            <div class="h-1 rounded w-full bg-slate-300"></div>
            <div class="h-1 rounded w-4/5 bg-slate-300"></div>
            <div class="h-1 rounded w-3/5 bg-slate-300"></div>
          </div>
          ${isAct ? `<div class="absolute top-1 left-1 bg-sky-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black shadow">✓</div>` : ''}
        </div>
        <div class="text-[11px] font-bold truncate mt-1.5 text-center ${isAct ? 'text-sky-300' : 'text-slate-200'}">${bEsc(tpl.name)}</div>
      </div>
    `;
  }).join('');
}

function bSwitchTemplateFromDock(tplKey) {
  if (!B || !B.resume) return;
  B.resume.template = tplKey;
  const sel = document.getElementById('b-tpl');
  if (sel) sel.value = tplKey;
  bTouched();
  bPreview();
  const row = document.getElementById('b-tpl-cards-row');
  if (row) row.innerHTML = bRenderTemplateCarouselCards(tplKey);
  toast('تم تطبيق قالب: ' + (TEMPLATE_DEFS[tplKey]?.name || tplKey) + ' ✨');
}

function bApplyTheme(primary, accent) {
  if (!B || !B.cust) return;
  B.cust.primaryColor = primary;
  B.cust.accentColor = accent;
  bTouched();
  bPreview();
  toast('تم تطبيق الثيم اللوني بنجاح 🎨');
}

function bSetSkillsLayout(layout) {
  if (!B || !B.cust) return;
  B.cust.skillsLayout = layout;
  B.cust.coursesLayout = layout;
  bTouched();
  bPreview();
  toast('تم تحديث تنسيق المهارات والدورات 🧩');
}

function bToggleLiveEditMode() {
  B.liveEditMode = !B.liveEditMode;
  const btn = document.getElementById('b-btn-live-edit');
  if (btn) {
    btn.className = 'btn-ghost !py-1 !px-2.5 text-xs font-bold ' + (B.liveEditMode ? '!bg-amber-500 !text-slate-950 shadow-md' : 'text-slate-300 border border-slate-700 bg-slate-900');
    btn.innerHTML = '<i class="fas fa-pen-to-square ml-1 ' + (B.liveEditMode ? 'text-slate-950' : 'text-sky-400') + '"></i><span>' + (B.liveEditMode ? 'إيقاف التعديل المباشر' : 'تعديل مباشر ✏️') + '</span>';
  }
  bApplyLiveEditToPreview();
  if (B.liveEditMode) {
    toast('تم تفعيل وضع التعديل المباشر ✏️ — انقر على أي نص لتعديله فوراً!');
  } else {
    toast('تم حفظ التعديلات المباشرة بنجاح ✅');
  }
}

function bApplyLiveEditToPreview() {
  const wrap = document.getElementById('b-preview-wrap');
  if (!wrap) return;
  if (B.liveEditMode) {
    wrap.classList.add('cv-live-editing');
    wrap.querySelectorAll('.cv-name-ar, .cv-name-en, .cv-name, .cv-jobtitle, .cv-item-role, .cv-item-org, .cv-item-desc, .cv-summary-text, .cv-card-plus span, .cv-chip-pill, .cv-degree-title, .cv-school-name, p, span').forEach(el => {
      if (!el.querySelector('input') && !el.querySelector('button') && el.textContent.trim().length > 0) {
        el.setAttribute('contenteditable', 'true');
        el.oninput = function() {
          bTouched();
        };
      }
    });
  } else {
    wrap.classList.remove('cv-live-editing');
    wrap.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
  }
}
