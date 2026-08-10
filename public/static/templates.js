/* ===== Ehab ATS — Template Engine (16 templates) ===== */

const TEMPLATE_DEFS = {
  ats1:          { name: 'ATS كلاسيكي', nameEn: 'ATS Classic', group: 'bw', layout: 'single', header: 'center', color: '#111827', accent: '#374151', line: '2px solid #111827', ats: true },
  ats2:          { name: 'ATS بسيط', nameEn: 'ATS Simple', group: 'bw', layout: 'single', header: 'right', color: '#111827', accent: '#4b5563', line: '1px solid #9ca3af', ats: true },
  ats3:          { name: 'ATS مضغوط', nameEn: 'ATS Compact', group: 'bw', layout: 'single', header: 'split', color: '#000000', accent: '#374151', line: '1.5px solid #000', ats: true },
  bilingual_2col:{ name: 'ثنائي بحارتين (عمودين متساويين)', nameEn: 'Bilingual 2-Col Split', group: 'bw', layout: 'bilingual_split', header: 'center', color: '#0f172a', accent: '#334155', line: '2px solid #0f172a', ats: true },
  canva_purple:  { name: 'كانفا بنفسجي إبداعي 🎨', nameEn: 'Canva Creative Violet', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#6d28d9', accent: '#8b5cf6', bandBg: 'linear-gradient(135deg,#4c1d95,#7c3aed)' },
  canva_emerald: { name: 'كانفا زمردي فخم 💎', nameEn: 'Canva Royal Emerald', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#047857', accent: '#10b981', bandBg: 'linear-gradient(135deg,#064e3b,#047857)' },
  canva_coral:   { name: 'كانفا غروب مرجاني 🌅', nameEn: 'Canva Sunset Coral', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#be123c', accent: '#f43f5e', bandBg: 'linear-gradient(135deg,#9f1239,#fb7185)' },
  canva_dark_gold:{ name: 'كانفا كحلي وذهبي 👑', nameEn: 'Canva Dark Navy & Gold', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#0f172a', accent: '#d97706', bandBg: 'linear-gradient(135deg,#020617,#1e293b)' },
  canva_cyan:    { name: 'كانفا ديجيتال سيان ⚡', nameEn: 'Canva Digital Cyan', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#0284c7', accent: '#38bdf8', bandBg: 'linear-gradient(135deg,#0369a1,#0284c7)' },
  corporate:     { name: 'مؤسسي', nameEn: 'Corporate', group: 'bw', layout: 'topbar', header: 'band', color: '#1f2937', accent: '#4b5563', line: '2px solid #1f2937', bandBg: '#1f2937' },
  executive:     { name: 'تنفيذي', nameEn: 'Executive', group: 'bw', layout: 'single', header: 'center', color: '#111827', accent: '#6b7280', line: '3px double #111827', serif: true },
  creative:      { name: 'إبداعي', nameEn: 'Creative', group: 'color', layout: 'sidebar', header: 'side', color: '#7c3aed', accent: '#8b5cf6', line: '2px solid #7c3aed', sideBg: '#4c1d95', sideText: '#f5f3ff' },
  modern:        { name: 'عصري', nameEn: 'Modern', group: 'color', layout: 'topbar', header: 'band', color: '#0891b2', accent: '#06b6d4', line: '2px solid #0891b2', bandBg: 'linear-gradient(135deg,#0e7490,#155e75)' },
  minimal:       { name: 'مينيمال', nameEn: 'Minimal', group: 'color', layout: 'single', header: 'right', color: '#e11d48', accent: '#f43f5e', line: '1px solid #fda4af' },
  elegant:       { name: 'أنيق', nameEn: 'Elegant', group: 'color', layout: 'single', header: 'center', color: '#92400e', accent: '#b45309', line: '1.5px solid #d97706', serif: true },
  blue:          { name: 'أزرق احترافي', nameEn: 'Blue Professional', group: 'color', layout: 'sidebar', header: 'side', color: '#1d4ed8', accent: '#3b82f6', line: '2px solid #1d4ed8', sideBg: '#1e3a8a', sideText: '#eff6ff' },
  green:         { name: 'أخضر', nameEn: 'Green', group: 'color', layout: 'topbar', header: 'band', color: '#047857', accent: '#10b981', line: '2px solid #047857', bandBg: '#065f46' },
  navy:          { name: 'كحلي', nameEn: 'Navy', group: 'color', layout: 'sidebar', header: 'side', color: '#0f172a', accent: '#334155', line: '2px solid #0f172a', sideBg: '#0f172a', sideText: '#f1f5f9' },
  academic:      { name: 'أكاديمي', nameEn: 'Academic', group: 'color', layout: 'single', header: 'center', color: '#5b21b6', accent: '#7c3aed', line: '1.5px solid #7c3aed', serif: true },
  healthcare:    { name: 'صحي', nameEn: 'Healthcare', group: 'color', layout: 'topbar', header: 'band', color: '#0d9488', accent: '#14b8a6', line: '2px solid #0d9488', bandBg: 'linear-gradient(135deg,#0f766e,#115e59)' },
  engineering:   { name: 'هندسي', nameEn: 'Engineering', group: 'color', layout: 'sidebar', header: 'side', color: '#c2410c', accent: '#ea580c', line: '2px solid #c2410c', sideBg: '#7c2d12', sideText: '#fff7ed' }
};

const SECTION_TYPES = {
  summary:        { ar: 'الملخص المهني', en: 'Professional Summary', icon: 'fa-user-tie', kind: 'text' },
  objective:      { ar: 'الهدف الوظيفي', en: 'Career Objective', icon: 'fa-bullseye', kind: 'text' },
  experience:     { ar: 'الخبرات العملية', en: 'Work Experience', icon: 'fa-briefcase', kind: 'timeline' },
  education:      { ar: 'التعليم', en: 'Education', icon: 'fa-graduation-cap', kind: 'education' },
  internship:     { ar: 'التدريب التعاوني', en: 'Internships', icon: 'fa-id-badge', kind: 'timeline' },
  training:       { ar: 'الدورات والشهادات', en: 'Training & Courses', icon: 'fa-chalkboard-teacher', kind: 'certs' },
  projects:       { ar: 'المشاريع', en: 'Projects', icon: 'fa-diagram-project', kind: 'timeline' },
  skills:         { ar: 'المهارات', en: 'Skills', icon: 'fa-star', kind: 'skills' },
  techskills:     { ar: 'المهارات التقنية', en: 'Technical Skills', icon: 'fa-laptop-code', kind: 'skills' },
  softskills:     { ar: 'المهارات الشخصية', en: 'Soft Skills', icon: 'fa-people-group', kind: 'skills' },
  languages:      { ar: 'اللغات', en: 'Languages', icon: 'fa-language', kind: 'languages' },
  certifications: { ar: 'الشهادات الاحترافية', en: 'Certifications', icon: 'fa-certificate', kind: 'certs' },
  courses:        { ar: 'الكورسات', en: 'Courses', icon: 'fa-book-open', kind: 'certs' },
  achievements:   { ar: 'الإنجازات', en: 'Achievements', icon: 'fa-trophy', kind: 'list' },
  volunteer:      { ar: 'العمل التطوعي', en: 'Volunteering', icon: 'fa-hand-holding-heart', kind: 'timeline' },
  references:     { ar: 'المعرّفون', en: 'References', icon: 'fa-address-book', kind: 'references' },
  custom:         { ar: 'قسم مخصص', en: 'Custom Section', icon: 'fa-puzzle-piece', kind: 'custom' }
};

function tplEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function resolveName(p) {
  const ar = (p.nameAr || p.fullNameAr || p.fullName || p.name || '').trim();
  const en = (p.nameEn || p.fullNameEn || p.name || '').trim();
  return { ar, en, main: ar || en };
}

function resolveTitle(p) {
  const ar = (p.titleAr || p.jobTitleAr || p.jobTitle || p.title || '').trim();
  const en = (p.titleEn || p.jobTitleEn || p.title || '').trim();
  return { ar, en, main: ar || en };
}

function mkPick(lang) {
  return function (item, arKey, enKey) {
    const ar = item[arKey] || '';
    const en = item[enKey] || '';
    if (lang === 'en') return tplEsc(en || ar);
    if (lang === 'bilingual') {
      if (ar && en) return tplEsc(ar) + '<span class="cv-bilingual-sub">' + tplEsc(en) + '</span>';
      return tplEsc(ar || en);
    }
    return tplEsc(ar || en);
  };
}

function secTitle(sec, lang, showIcons) {
  const def = SECTION_TYPES[sec.type] || SECTION_TYPES.custom;
  let t;
  if (sec.type === 'custom') {
    t = lang === 'en' ? (sec.titleEn || sec.titleAr || 'Custom') : (sec.titleAr || sec.titleEn || 'قسم');
  } else {
    t = lang === 'en' ? def.en : (lang === 'bilingual' ? def.ar + ' | ' + def.en : def.ar);
  }
  const icon = showIcons ? `<i class="fas ${def.icon}"></i>` : '';
  return `<h2 class="cv-sec-title">${icon}${tplEsc(t)}</h2>`;
}

function dateRange(item, lang) {
  const cur = lang === 'en' ? 'Present' : 'حتى الآن';
  const end = item.current ? cur : (item.end || '');
  if (!item.start && !end) return '';
  return `<span class="cv-item-date">${tplEsc(item.start || '')}${item.start && end ? ' — ' : ''}${tplEsc(end)}</span>`;
}

function renderSectionBody(sec, lang, tpl) {
  const v = mkPick(lang);
  const items = sec.items || [];
  const kind = (SECTION_TYPES[sec.type] || {}).kind || sec.kind || 'custom';

  if (kind === 'text') {
    const txt = lang === 'en' ? (sec.textEn || sec.textAr) : (lang === 'bilingual' && sec.textAr && sec.textEn ? sec.textAr + '\n\n' + sec.textEn : (sec.textAr || sec.textEn));
    return `<p class="cv-item-desc" style="margin:0">${tplEsc(txt || '')}</p>`;
  }

  if (kind === 'timeline') {
    return items.map(it => `
      <div class="cv-item">
        <div class="cv-item-head">
          <div><span class="cv-item-role">${v(it, 'roleAr', 'roleEn') || v(it, 'nameAr', 'nameEn')}</span>
          ${(it.orgAr || it.orgEn || it.companyAr || it.companyEn) ? ` <span class="cv-item-org">| ${v(it, 'orgAr', 'orgEn') || v(it, 'companyAr', 'companyEn')}</span>` : ''}</div>
          ${dateRange(it, lang)}
        </div>
        ${(it.descAr || it.descEn) ? `<div class="cv-item-desc">${v(it, 'descAr', 'descEn')}</div>` : ''}
      </div>`).join('');
  }

  if (kind === 'education') {
    return items.map(it => `
      <div class="cv-item">
        <div class="cv-item-head">
          <div><span class="cv-item-role">${v(it, 'degreeAr', 'degreeEn')}</span>
          ${(it.schoolAr || it.schoolEn) ? ` <span class="cv-item-org">| ${v(it, 'schoolAr', 'schoolEn')}</span>` : ''}</div>
          <span class="cv-item-date">${tplEsc(it.year || '')}</span>
        </div>
        ${it.gpa ? `<div class="cv-item-desc">${lang === 'en' ? 'GPA' : 'المعدل'}: ${tplEsc(it.gpa)}</div>` : ''}
        ${(it.descAr || it.descEn) ? `<div class="cv-item-desc">${v(it, 'descAr', 'descEn')}</div>` : ''}
      </div>`).join('');
  }

  if (kind === 'skills') {
    const useBars = !tpl.ats && sec.showBars;
    if (useBars) {
      return items.map(it => `
        <div class="cv-skill-row">
          <span class="cv-skill-name">${v(it, 'nameAr', 'nameEn')}</span>
          <div class="cv-skill-bar"><div class="cv-skill-fill" style="width:${Math.min(100, (Number(it.level) || 3) * 20)}%"></div></div>
        </div>`).join('');
    }
    return `<div class="cv-chips">${items.map(it => `<span class="cv-chip">${v(it, 'nameAr', 'nameEn')}</span>`).join('')}</div>`;
  }

  if (kind === 'languages') {
    return items.map(it => `
      <div class="cv-lang-row">
        <span style="font-weight:600">${v(it, 'nameAr', 'nameEn')}</span>
        <span class="cv-lang-level">${v(it, 'levelAr', 'levelEn')}</span>
      </div>`).join('');
  }

  if (kind === 'certs') {
    return items.map(it => `
      <div class="cv-item" style="margin-bottom:7px">
        <div class="cv-item-head">
          <div><span class="cv-item-role">${v(it, 'nameAr', 'nameEn')}</span>
          ${(it.orgAr || it.orgEn || it.issuerAr || it.issuerEn) ? ` <span class="cv-item-org">| ${v(it, 'orgAr', 'orgEn') || v(it, 'issuerAr', 'issuerEn')}</span>` : ''}</div>
          <span class="cv-item-date">${tplEsc(it.year || '')}</span>
        </div>
      </div>`).join('');
  }

  if (kind === 'list') {
    return `<ul style="margin:0;padding-inline-start:18px">${items.map(it => `<li class="cv-item-desc" style="margin-bottom:4px">${v(it, 'textAr', 'textEn')}</li>`).join('')}</ul>`;
  }

  if (kind === 'references') {
    if (sec.onRequest) {
      return `<p class="cv-refs-note">${lang === 'en' ? 'Available upon request' : 'متاحة عند الطلب'}</p>`;
    }
    return items.map(it => `
      <div class="cv-item" style="margin-bottom:7px">
        <span class="cv-item-role">${v(it, 'nameAr', 'nameEn')}</span>
        ${(it.orgAr || it.orgEn) ? ` <span class="cv-item-org">— ${v(it, 'orgAr', 'orgEn')}</span>` : ''}
        ${it.phone ? `<div class="cv-sub" dir="ltr" style="text-align:inherit">${tplEsc(it.phone)}${it.email ? ' • ' + tplEsc(it.email) : ''}</div>` : (it.email ? `<div class="cv-sub">${tplEsc(it.email)}</div>` : '')}
      </div>`).join('');
  }

  // custom
  if (sec.textAr || sec.textEn) {
    return `<p class="cv-item-desc" style="margin:0">${v(sec, 'textAr', 'textEn')}</p>`;
  }
  return items.map(it => `<div class="cv-item"><span class="cv-item-role">${v(it, 'nameAr', 'nameEn') || v(it, 'textAr', 'textEn')}</span>${(it.descAr || it.descEn) ? `<div class="cv-item-desc">${v(it, 'descAr', 'descEn')}</div>` : ''}</div>`).join('');
}

function renderContact(p, lang, allowContactIcons) {
  const bits = [];
  const show = allowContactIcons !== false;
  const ic = (i) => show ? `<i class="${i}"></i>` : '';
  
  if (p.phone) bits.push(`<span dir="ltr">${ic('fas fa-phone')}${tplEsc(p.phone)}</span>`);
  if (p.email) bits.push(`<span>${ic('fas fa-envelope')}${tplEsc(p.email)}</span>`);
  const city = lang === 'en' ? (p.cityEn || p.city) : (p.city || p.cityEn);
  if (city) bits.push(`<span>${ic('fas fa-map-marker-alt')}${tplEsc(city)}</span>`);
  if (p.linkedin) bits.push(`<span dir="ltr">${ic('fab fa-linkedin')}${tplEsc(p.linkedin)}</span>`);
  if (p.website) bits.push(`<span dir="ltr">${ic('fas fa-globe')}${tplEsc(p.website)}</span>`);
  if (p.nationality) bits.push(`<span>${ic('fas fa-flag')}${tplEsc(p.nationality)}</span>`);

  if (bits.length === 0) return '';
  const sep = `<span class="cv-contact-sep">•</span>`;
  return `<div class="cv-contact">${bits.join(sep)}</div>`;
}

function renderHeader(tpl, data, cust, lang) {
  const p = data.personal || {};
  const showIcons = cust.showIcons !== false && !tpl.ats;
  const nr = resolveName(p);
  const tr = resolveTitle(p);

  const name = lang === 'en' ? (nr.en || nr.ar) : (nr.ar || nr.en);
  const nameSub = (lang === 'bilingual' && nr.en && nr.ar && nr.ar !== nr.en)
    ? `<div class="cv-sub" dir="ltr" style="font-weight:600;text-align:inherit">${tplEsc(nr.en)}</div>`
    : '';

  const hasTitle = Boolean(tr.ar || tr.en);
  const jt = lang === 'en' ? (tr.en || tr.ar) : (tr.ar || tr.en);
  const jtSub = (lang === 'bilingual' && tr.en && tr.ar && tr.ar !== tr.en)
    ? ` <span class="cv-sub" dir="ltr">| ${tplEsc(tr.en)}</span>`
    : '';
  const jtHtml = hasTitle ? `<div class="cv-jobtitle">${tplEsc(jt || '')}${jtSub}</div>` : '';

  const photo = (cust.showPhoto !== false && p.photo && !tpl.ats) ? `<img class="cv-photo" src="${p.photo}" alt="">` : '';
  const logo = p.logo ? `<img class="cv-logo" src="${p.logo}" alt="">` : '';
  const core = `<h1 class="cv-name">${tplEsc(name || '')}</h1>${nameSub}${jtHtml}${renderContact(p, lang, cust.showIcons !== false)}`;

  if (tpl.header === 'center') return `<header class="cv-header-center">${photo ? `<div style="margin-bottom:10px">${photo}</div>` : ''}${core}${logo ? `<div style="margin-top:8px">${logo}</div>` : ''}</header>`;
  if (tpl.header === 'band') return `<header class="cv-header-band"><div class="cv-header-split"><div>${core}</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${photo}${logo}</div></div></header>`;
  return `<header class="cv-header-split"><div>${core}</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${photo}${logo}</div></header>`;
}

const SIDE_SECTION_KINDS = ['skills', 'languages', 'certs', 'list'];

function renderTemplate(templateId, data, cust, language) {
  const tpl = TEMPLATE_DEFS[templateId] || TEMPLATE_DEFS.ats1;
  cust = cust || {};
  data = data || {};
  const lang = language || 'ar';
  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const color = cust.themeColor || tpl.color;
  const accent = cust.accentColor || tpl.accent;
  const vars = [
    `--cv-color:${color}`, `--cv-accent:${accent}`,
    `--cv-line:${tpl.line || '2px solid ' + color}`,
    `--cv-fs:${cust.fontSize || 14}px`, `--cv-lh:${cust.lineHeight || 1.55}`,
    `--cv-margin:${cust.margin != null ? cust.margin : 40}px`,
    `--cv-font-ar:'${cust.fontAr || 'Cairo'}'`, `--cv-font-en:'${cust.fontEn || 'Inter'}'`
  ];
  if (tpl.bandBg) vars.push(`--cv-band-bg:${cust.themeColor || tpl.bandBg}`);
  if (tpl.sideBg) vars.push(`--cv-side-bg:${cust.themeColor || tpl.sideBg}`);
  if (tpl.sideText) vars.push(`--cv-side-text:${tpl.sideText}`);

  const sections = (data.sections || []).filter(s => s.visible !== false);
  const showIcons = cust.showIcons !== false && !tpl.ats;
  const secHtml = (s) => `<section class="cv-section">${secTitle(s, lang, showIcons)}${renderSectionBody(s, lang, tpl)}</section>`;

  const qr = cust.qrDataUrl ? `<div class="cv-qr-wrap"><img class="cv-qr" src="${cust.qrDataUrl}" alt="QR"><div class="cv-qr-label">${lang === 'en' ? 'Online CV' : 'نسخة أونلاين'}</div></div>` : '';
  const sig = (data.personal && data.personal.signature) ? `<div class="cv-signature-wrap"><img class="cv-signature" src="${data.personal.signature}" alt=""></div>` : '';

  const cls = `cv-page${tpl.serif ? ' cv-serif' : ''}${tpl.ats ? ' cv-ats' : ''}`;
  const styleAttr = `style="${vars.join(';')}"`;

  // 2-Column Split Bilingual Layout: Activated whenever language is bilingual OR bilingual template is selected
  if (lang === 'bilingual' || tpl.layout === 'bilingual_split' || templateId === 'bilingual_2col') {
    const p = data.personal || {};
    const nr = resolveName(p);
    const tr = resolveTitle(p);

    const hasTitle = Boolean(tr.ar || tr.en);
    const jtHtml = hasTitle ? `<div class="cv-job-title-strip">${tplEsc(tr.ar || tr.en)} ${tr.en && tr.ar && tr.ar !== tr.en ? `<span dir="ltr"> | ${tplEsc(tr.en)}</span>` : ''}</div>` : '';

    const headerHtml = `
      <div class="header-container">
        <h1 class="cv-name-ar">${tplEsc(nr.ar || nr.en)}</h1>
        ${nr.en && nr.ar && nr.ar !== nr.en ? `<div class="cv-name-en">${tplEsc(nr.en)}</div>` : ''}
        ${jtHtml}
        ${renderContact(p, 'bilingual', cust.showIcons !== false)}
      </div>
    `;

    const sectionRows = sections.map(s => `
      <div class="bilingual-row" style="display:table-row;">
        <div class="column-ar" dir="rtl" style="display:table-cell; width:48%; text-align:right; vertical-align:top; padding-right:10px;">
          <section class="cv-section">
            ${secTitle(s, 'ar', showIcons)}
            ${renderSectionBody(s, 'ar', tpl)}
          </section>
        </div>
        <div class="column-divider" style="display:table-cell; width:4%; border-left:2px solid var(--cv-accent,#b0b0b0); vertical-align:top;"></div>
        <div class="column-en" dir="ltr" style="display:table-cell; width:48%; text-align:left; vertical-align:top; padding-left:10px;">
          <section class="cv-section">
            ${secTitle(s, 'en', showIcons)}
            ${renderSectionBody(s, 'en', tpl)}
          </section>
        </div>
      </div>
    `).join('');

    return `
      <div class="${cls} cv-bilingual-split-page" dir="rtl" ${styleAttr}>
        <div class="cv-inner">
          ${headerHtml}
          <div class="bilingual-container" dir="rtl" style="display:table; width:100%; table-layout:fixed;">
            ${sectionRows}
          </div>
          ${sig}
        </div>
        ${qr}
      </div>
    `;
  }

  // 5 Canva Modern Templates with Top Center Circular Avatar Photo
  if (tpl.layout === 'canva_card' || tpl.header === 'canva_circle') {
    const p = data.personal || {};
    const nr = resolveName(p);
    const tr = resolveTitle(p);

    const photoUrl = (cust.showPhoto !== false && p.photo) ? p.photo : '';
    const avatarHtml = photoUrl
      ? `<div class="cv-canva-avatar-wrap"><img src="${photoUrl}" class="cv-canva-avatar-img" alt="Photo"></div>`
      : `<div class="cv-canva-avatar-wrap"><div class="cv-canva-avatar-placeholder"><i class="fas fa-camera"></i></div></div>`;

    const hasTitle = Boolean(tr.ar || tr.en);
    const jtHtml = hasTitle ? `<div class="cv-jobtitle">${tplEsc(tr.ar || tr.en)}${tr.en && tr.ar && tr.ar !== tr.en ? `<span dir="ltr"> | ${tplEsc(tr.en)}</span>` : ''}</div>` : '';

    const headerHtml = `
      <div class="cv-canva-header" style="background:${tpl.bandBg}">
        ${avatarHtml}
        <h1 class="cv-name">${tplEsc(nr.ar || nr.en)}</h1>
        ${nr.en && nr.ar && nr.ar !== nr.en ? `<div style="font-size:0.9em;opacity:0.9;margin-top:2px" dir="ltr">${tplEsc(nr.en)}</div>` : ''}
        ${jtHtml}
        ${renderContact(p, lang, cust.showIcons !== false)}
      </div>
    `;

    const secCards = sections.map(s => `
      <section class="cv-canva-card">
        ${secTitle(s, lang, showIcons)}
        ${renderSectionBody(s, lang, tpl)}
      </section>
    `).join('');

    return `
      <div class="${cls} cv-canva-page" dir="${dir}" ${styleAttr}>
        ${headerHtml}
        <div class="cv-inner" style="padding:0 24px 24px">
          ${secCards}
          ${sig}
        </div>
        ${qr}
      </div>
    `;
  }

  if (tpl.layout === 'sidebar') {
    const side = sections.filter(s => SIDE_SECTION_KINDS.includes((SECTION_TYPES[s.type] || {}).kind || ''));
    const main = sections.filter(s => !SIDE_SECTION_KINDS.includes((SECTION_TYPES[s.type] || {}).kind || ''));
    const p = data.personal || {};
    const photo = (cust.showPhoto !== false && p.photo) ? `<div style="text-align:center;margin-bottom:14px"><img class="cv-photo" src="${p.photo}" alt=""></div>` : '';
    const nr = resolveName(p);
    const tr = resolveTitle(p);
    const name = lang === 'en' ? (nr.en || nr.ar) : (nr.ar || nr.en);
    const jt = lang === 'en' ? (tr.en || tr.ar) : (tr.ar || tr.en);
    const hasTitle = Boolean(tr.ar || tr.en);
    const jtHtml = hasTitle ? `<div class="cv-jobtitle">${tplEsc(jt || '')}</div>` : '';
    return `<div class="${cls}" dir="${dir}" ${styleAttr}>
      <div class="sidebar-wrap">
        <aside class="cv-side">
          ${photo}
          <h1 class="cv-name" style="font-size:1.55em">${tplEsc(name || '')}</h1>
          ${jtHtml}
          ${renderContact(p, lang, true)}
          ${side.map(secHtml).join('')}
        </aside>
        <div class="cv-main-col">${main.map(secHtml).join('')}${sig}</div>
      </div>${qr}</div>`;
  }

  if (tpl.header === 'band') {
    return `<div class="${cls}" dir="${dir}" ${styleAttr}>${renderHeader(tpl, data, cust, lang)}<div class="cv-inner" style="padding-top:24px">${sections.map(secHtml).join('')}${sig}</div>${qr}</div>`;
  }

  return `<div class="${cls}" dir="${dir}" ${styleAttr}><div class="cv-inner">${renderHeader(tpl, data, cust, lang)}${sections.map(secHtml).join('')}${sig}</div>${qr}</div>`;
}

function defaultResumeData() {
  return {
    personal: { nameAr: '', nameEn: '', fullName: '', fullNameEn: '', titleAr: '', titleEn: '', jobTitle: '', jobTitleEn: '', email: '', phone: '', cityAr: '', cityEn: '', city: '', linkedin: '', website: '', nationality: '', photo: '', logo: '', signature: '' },
    sections: [
      { id: 's1', type: 'summary', visible: true, textAr: '', textEn: '' },
      { id: 's2', type: 'experience', visible: true, items: [] },
      { id: 's3', type: 'education', visible: true, items: [] },
      { id: 's4', type: 'skills', visible: true, items: [], showBars: false },
      { id: 's5', type: 'languages', visible: true, items: [] },
      { id: 's6', type: 'certifications', visible: true, items: [] }
    ]
  };
}

if (typeof window !== 'undefined') {
  window.TEMPLATE_DEFS = TEMPLATE_DEFS;
  window.SECTION_TYPES = SECTION_TYPES;
  window.renderTemplate = renderTemplate;
  window.defaultResumeData = defaultResumeData;
}
