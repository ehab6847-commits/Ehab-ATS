/* ===== Ehab ATS — Template Engine (16 templates) ===== */

const TEMPLATE_DEFS = {
  ats_merged_bilingual:{ name: 'سيرة مدمج وفق نظام ATS ⚡', nameEn: 'ATS Merged Bilingual Pro', group: 'ats', layout: 'ats_merged_bilingual', header: 'center', color: '#000000', accent: '#0f172a', line: '1.5px solid #000000', ats: true },
  ats_tinted_cards:{ name: 'البطاقات المظللة الحديث ⭐', nameEn: 'Modern Tinted Cards ATS', group: 'ats', layout: 'tinted_cards', header: 'tinted_top', color: '#0f172a', accent: '#0284c7', line: '2px solid #0284c7', ats: true },
  formal_pro:    { name: 'رسمي احترافي ⭐', nameEn: 'Professional Formal', group: 'bw', layout: 'formal_pro', header: 'formal_center', color: '#000000', accent: '#1e293b', line: '1.5px solid #000000', ats: true },
  ats1:          { name: 'ATS كلاسيكي', nameEn: 'ATS Classic', group: 'bw', layout: 'single', header: 'center', color: '#111827', accent: '#374151', line: '2px solid #111827', ats: true },
  ats2:          { name: 'ATS بسيط', nameEn: 'ATS Simple', group: 'bw', layout: 'single', header: 'right', color: '#111827', accent: '#4b5563', line: '1px solid #9ca3af', ats: true },
  ats3:          { name: 'ATS مضغوط', nameEn: 'ATS Compact', group: 'bw', layout: 'single', header: 'split', color: '#000000', accent: '#374151', line: '1.5px solid #000', ats: true },
  executive_frosted:{ name: 'تنفيذي زجاجي راقي 💎', nameEn: 'Modern Executive Frosted', group: 'color', layout: 'frosted_cards', header: 'frosted_band', color: '#1e1b4b', accent: '#4338ca', bandBg: 'linear-gradient(135deg,#0f172a,#1e1b4b)', line: '2px solid #4338ca' },
  tech_modern_grid:{ name: 'تقني شبكي عصري ⚡', nameEn: 'Modern Tech Grid', group: 'ats', layout: 'tech_grid', header: 'tech_header', color: '#0f172a', accent: '#2563eb', line: '2px solid #2563eb', ats: true },
  creative_subtle:{ name: 'إبداعي هادئ انسيابي 🎨', nameEn: 'Subtle Creative Pastel', group: 'color', layout: 'subtle_cards', header: 'subtle_header', color: '#831843', accent: '#db2777', line: '2px solid #db2777' },
  academic_boxed:{ name: 'أكاديمي بصناديق منظمة 🎓', nameEn: 'Boxed Academic Pro', group: 'bw', layout: 'academic_boxed', header: 'academic_header', color: '#1e293b', accent: '#475569', line: '2px solid #1e293b', ats: true },
  bilingual_2col:{ name: 'ثنائي بحارتين (عمودين متساويين)', nameEn: 'Bilingual 2-Col Split', group: 'bw', layout: 'bilingual_split', header: 'center', color: '#0f172a', accent: '#334155', line: '2px solid #0f172a', ats: true },
  canva_purple:  { name: 'كانفا بنفسجي إبداعي 🎨', nameEn: 'Canva Creative Violet', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#6d28d9', accent: '#8b5cf6', bandBg: 'linear-gradient(135deg,#4c1d95,#7c3aed)' },
  canva_emerald: { name: 'كانفا زمردي فخم 💎', nameEn: 'Canva Royal Emerald', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#047857', accent: '#10b981', bandBg: 'linear-gradient(135deg,#064e3b,#047857)' },
  canva_coral:   { name: 'كانفا غروب مرجاني 🌅', nameEn: 'Canva Sunset Coral', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#be123c', accent: '#f43f5e', bandBg: 'linear-gradient(135deg,#9f1239,#fb7185)' },
  canva_dark_gold:{ name: 'كانفا كحلي وذهبي 👑', nameEn: 'Canva Dark Navy & Gold', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#0f172a', accent: '#d97706', bandBg: 'linear-gradient(135deg,#020617,#1e293b)' },
  canva_cyan:    { name: 'كانفا ديجيتال سيان ⚡', nameEn: 'Canva Digital Cyan', group: 'canva', layout: 'canva_card', header: 'canva_circle', color: '#0284c7', accent: '#38bdf8', bandBg: 'linear-gradient(135deg,#0369a1,#0284c7)' },
  corporate:     { name: 'مؤسسي', nameEn: 'Corporate', group: 'bw', layout: 'topbar', header: 'band', color: '#1f2937', accent: '#4b5563', line: '2px solid #1f2937', bandBg: '#1f2937' },
  executive:     { name: 'تنفيذي', nameEn: 'Executive', group: 'bw', layout: 'single', header: 'center', color: '#111827', accent: '#6b7280', line: '3px double #111827', serif: true },
  creative:      { name: 'إبداعي', nameEn: 'Creative', group: 'color', layout: 'sidebar', header: 'side', color: '#7c3aed', accent: '#8b5cf6', line: '2px solid #7c3aed', sideBg: '#4c1d95', sideText: '#f5f3ff' },
  modern:        { name: 'عصري', nameEn: 'Modern', group: 'color', layout: 'sidebar', header: 'side', color: '#0891b2', accent: '#06b6d4', line: '2px solid #0891b2', sideBg: '#0e7490', sideText: '#ecfeff' },
  minimal:       { name: 'مينيمال', nameEn: 'Minimal', group: 'color', layout: 'single', header: 'right', color: '#e11d48', accent: '#f43f5e', line: '1px solid #fda4af' },
  elegant:       { name: 'أنيق', nameEn: 'Elegant', group: 'color', layout: 'single', header: 'center', color: '#92400e', accent: '#b45309', line: '1.5px solid #d97706', serif: true },
  blue:          { name: 'أزرق احترافي', nameEn: 'Blue Professional', group: 'color', layout: 'sidebar', header: 'side', color: '#1d4ed8', accent: '#3b82f6', line: '2px solid #1d4ed8', sideBg: '#1e3a8a', sideText: '#eff6ff' },
  green:         { name: 'أخضر', nameEn: 'Green', group: 'color', layout: 'sidebar', header: 'side', color: '#047857', accent: '#10b981', line: '2px solid #047857', sideBg: '#065f46', sideText: '#ecfdf5' },
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
  let en = (p.nameEn || p.fullNameEn || '').trim();
  if (ar && typeof translateArabicNameToEnglish === 'function') {
    en = translateArabicNameToEnglish(ar);
  }
  return { ar, en: en || ar, main: ar || en };
}

function resolveTitle(p) {
  const ar = (p.titleAr || p.jobTitleAr || p.jobTitle || p.title || '').trim();
  let en = (p.titleEn || p.jobTitleEn || '').trim();
  if (ar && typeof translateTextToEnglish === 'function') {
    en = translateTextToEnglish(ar);
  }
  return { ar, en: en || ar, main: ar || en };
}

function mkPick(lang) {
  return function (item, arKey, enKey) {
    if (!item) return '';
    const baseKey = arKey.replace(/Ar$/, '');
    const ar = (item[arKey] || item[baseKey] || item[baseKey + 'Ar'] || '').trim();
    let en = (item[enKey] || item[baseKey + 'En'] || '').trim();

    if (lang === 'en') {
      if (en && !/[\u0600-\u06FF]/.test(en)) {
        return tplEsc(en);
      }
      if (ar && typeof translateTextToEnglish === 'function') {
        return tplEsc(translateTextToEnglish(ar));
      }
      return tplEsc(en || ar);
    }
    if (lang === 'bilingual') {
      let enVal = '';
      if (en && !/[\u0600-\u06FF]/.test(en)) {
        enVal = en;
      } else if (ar && typeof translateTextToEnglish === 'function') {
        enVal = translateTextToEnglish(ar);
      } else {
        enVal = en;
      }
      if (ar && enVal && ar !== enVal) {
        return tplEsc(ar) + '<span class="cv-bilingual-sub">' + tplEsc(enVal) + '</span>';
      }
      return tplEsc(ar || enVal);
    }
    return tplEsc(ar || en);
  };
}

function secTitle(sec, lang, showIcons) {
  const def = SECTION_TYPES[sec.type] || SECTION_TYPES.custom;
  let t;
  if (sec.type === 'custom') {
    t = lang === 'en' ? (sec.titleEn || (typeof translateTextToEnglish === 'function' ? translateTextToEnglish(sec.titleAr) : '') || sec.titleAr || 'Custom Section') : (sec.titleAr || sec.titleEn || 'قسم');
  } else {
    t = lang === 'en' ? def.en : (lang === 'bilingual' ? def.ar + ' | ' + def.en : def.ar);
  }
  const icon = showIcons ? `<i class="fas ${def.icon}"></i>` : '';
  return `<h2 class="cv-sec-title">${icon}${tplEsc(t)}</h2>`;
}

function dateRange(item, lang) {
  const cur = lang === 'en' ? 'Present' : 'حتى الآن';
  let end = item.current ? cur : (item.end || '');
  if (lang === 'en' && (end === 'حتى الآن' || end.includes('الآن') || end.includes('الحالي'))) end = 'Present';
  let start = item.start || '';
  if (!start && !end) return '';
  return `<span class="cv-item-date">${tplEsc(start)}${start && end ? ' — ' : ''}${tplEsc(end)}</span>`;
}

function renderBulletList(desc) {
  if (!desc) return '';
  const lines = String(desc).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    const cleanL = line.replace(/^[•\-\*▪🔹■\d+\.]+\s*/, '').trim();
    if (!cleanL) return '';
    return `<div class="cv-bullet-item cv-exp-bullet" style="display:flex;align-items:flex-start;gap:8px;line-height:1.5;margin:2px 0;padding:0;"><span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;margin-top:8px;"></span><span style="font-weight:400;color:#1e293b;line-height:1.5;">${tplEsc(cleanL)}</span></div>`;
  }).join('');
}

function renderSectionBody(sec, lang, tpl, cust = {}) {
  const v = mkPick(lang);
  const kind = SECTION_TYPES[sec.type]?.kind || 'custom';
  const isFormal = tpl.layout === 'formal_pro';
  const isTinted = tpl.layout === 'tinted_cards' || tpl.layout === 'frosted_cards' || tpl.layout === 'subtle_cards' || tpl.layout === 'academic_boxed';
  const items = sec.items || [];
  const skillLayout = cust.skillsLayout || (isTinted ? 'cards_plus' : (isFormal ? 'grid_dots' : 'grid_dots'));
  const courseLayout = cust.coursesLayout || skillLayout;
  const langLayout = cust.languagesLayout || (isTinted ? 'pills_level' : (isFormal ? 'grid_dots' : 'pills_level'));

  if (kind === 'text') {
    let txt = v(sec, 'textAr', 'textEn');
    if (txt) {
      return `<div class="cv-item cv-summary-text" style="font-weight:400;text-align:justify;line-height:1.6;color:#1e293b;">${tplEsc(txt).replace(/\n/g, '<br>')}</div>`;
    }
    return items.map(it => `<div class="cv-item cv-summary-text" style="font-weight:400;text-align:justify;line-height:1.6;color:#1e293b;">${tplEsc(String(v(it, 'textAr', 'textEn') || v(it, 'nameAr', 'nameEn'))).replace(/\n/g, '<br>')}</div>`).join('');
  }

  if (kind === 'education') {
    return items.map(it => {
      const deg = v(it, 'degreeAr', 'degreeEn');
      const sch = v(it, 'schoolAr', 'schoolEn');
      const yr = it.year ? tplEsc(String(it.year)) : '';
      const gpa = it.gpa ? tplEsc(String(it.gpa)) : '';
      const hasHead = deg || yr;
      return `
      <div class="cv-item cv-edu-item" style="margin-bottom:10px;">
        ${hasHead ? `
          <div class="cv-item-head" style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cv-item-role cv-degree-title" style="font-weight:700;font-size:1.02em;color:#0f172a;">${tplEsc(deg)}</span>
            ${yr ? `<span class="cv-item-date" style="font-weight:600;font-size:0.85em;color:#64748b;">${yr}</span>` : ''}
          </div>` : ''}
        ${sch ? `<div class="cv-item-org cv-school-name" style="font-weight:500;font-size:0.95em;color:#334155;margin-top:2px;">${tplEsc(sch)}${gpa ? ' · ' + gpa : ''}</div>` : (gpa ? `<div class="cv-sub" style="font-weight:400;">${gpa}</div>` : '')}
      </div>`;
    }).join('');
  }

  if (kind === 'timeline') {
    return items.map(it => {
      const role = v(it, 'roleAr', 'roleEn');
      const org = v(it, 'orgAr', 'orgEn');
      const dRange = dateRange(it, lang);
      const desc = v(it, 'descAr', 'descEn');
      return `
      <div class="cv-item cv-exp-item" style="margin-bottom:12px;">
        <div class="cv-item-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <span class="cv-item-role" style="font-weight:700;font-size:1.02em;color:#0f172a;">${tplEsc(role)}</span>
          ${dRange}
        </div>
        ${org ? `<div class="cv-item-org" style="font-weight:600;font-size:0.93em;color:#475569;margin-bottom:4px;">${tplEsc(org)}</div>` : ''}
        ${desc ? `<div class="cv-item-desc" style="font-weight:400;margin-top:3px;">${renderBulletList(desc)}</div>` : ''}
      </div>`;
    }).join('');
  }

  // --- Skills Section Layouts ---
  if (kind === 'skills') {
    if (skillLayout === 'chips') {
      return `
        <div class="cv-chips-wrap" style="display:flex;flex-wrap:wrap;gap:6px;">
          ${items.map(it => `
            <span class="cv-chip-pill" style="display:inline-flex;align-items:center;gap:5px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:20px;padding:4px 12px;font-size:0.88em;font-weight:600;color:#1e293b;">
              <i class="fas fa-check text-[10px] text-emerald-600"></i>${tplEsc(v(it, 'nameAr', 'nameEn'))}
            </span>
          `).join('')}
        </div>
      `;
    }

    if (skillLayout === 'columns_clean') {
      return `
        <div class="cv-columns-clean" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 20px;">
          ${items.map(it => `
            <div class="cv-col-item" style="padding:4px 0;border-bottom:1px dashed #cbd5e1;font-weight:600;font-size:0.9em;color:#0f172a;display:flex;align-items:center;justify-content:space-between;">
              <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
              <span style="color:#0284c7;font-weight:bold;font-size:0.85em;">✓</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (skillLayout === 'progress') {
      return `
        <div class="cv-progress-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px 20px;">
          ${items.map(it => {
            const lv = it.level || 4;
            const pct = Math.min(100, Math.max(20, lv * 20));
            return `
              <div class="cv-prog-item">
                <div style="display:flex;justify-content:space-between;font-weight:700;font-size:0.88em;color:#0f172a;margin-bottom:3px;">
                  <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
                  <span style="font-size:0.8em;color:#64748b;">${pct}%</span>
                </div>
                <div style="height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
                  <div style="height:100%;width:${pct}%;background:var(--cv-accent,#0284c7);border-radius:999px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (skillLayout === 'list_classic') {
      return `
        <div class="cv-list-classic" style="display:flex;flex-direction:column;gap:3px;">
          ${items.map(it => `
            <div class="cv-bullet-item" style="display:flex;align-items:center;gap:8px;line-height:1.5;margin:2px 0;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span style="font-weight:600;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (skillLayout === 'grid_dots') {
      return `
        <div class="cv-grid-2col" style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px 20px;">
          ${items.map(it => `
            <div class="cv-bullet-item" style="display:flex;align-items:center;gap:8px;line-height:1.5;margin:2px 0;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span style="font-weight:600;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

        if (skillLayout === 'dots_flow' || skillLayout === 'matrix_dots') {
      return `
        <div class="cv-flow-dots-wrap" style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;line-height:1.6;padding:2px 0;">
          ${items.map(it => `
            <span class="cv-flow-item" style="display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:0.92em;color:#0f172a;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
            </span>
          `).join('')}
        </div>
      `;
    }

    if (skillLayout === 'hyphens_dash' || skillLayout === 'hyphen_list') {
      return `
        <div class="cv-grid-hyphens" style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px 20px;">
          ${items.map(it => `
            <div class="cv-hyphen-item" style="display:flex;align-items:center;gap:6px;line-height:1.4;margin:2px 0;">
              <span style="color:#0284c7;font-weight:700;font-size:1.1em;line-height:1;flex-shrink:0;">—</span>
              <span style="font-weight:600;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Default: cards_plus
    return `
      <div class="cv-cards-plus-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;">
        ${items.map(it => `
          <div class="cv-card-plus" style="display:flex;align-items:center;gap:8px;background:rgba(241,245,249,0.85);border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;font-size:0.9em;font-weight:600;color:#1e293b;">
            <span class="cv-plus-icon" style="color:#0284c7;font-weight:900;font-size:1.1em;line-height:1;">+</span>
            <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Courses / Certifications Section Layouts ---
  if (kind === 'certs') {
    if (courseLayout === 'chips') {
      return `
        <div class="cv-chips-wrap" style="display:flex;flex-wrap:wrap;gap:6px;">
          ${items.map(it => `
            <span class="cv-chip-pill" style="display:inline-flex;align-items:center;gap:5px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:20px;padding:4px 12px;font-size:0.88em;font-weight:600;color:#1e293b;">
              <i class="fas fa-certificate text-[10px] text-sky-600"></i>${tplEsc(v(it, 'nameAr', 'nameEn'))}${(it.issuerAr || it.issuerEn) ? ' — ' + tplEsc(v(it, 'issuerAr', 'issuerEn')) : ''}
            </span>
          `).join('')}
        </div>
      `;
    }

    if (courseLayout === 'columns_clean') {
      return `
        <div class="cv-columns-clean" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 20px;">
          ${items.map(it => `
            <div class="cv-col-item" style="padding:4px 0;border-bottom:1px dashed #cbd5e1;font-weight:600;font-size:0.9em;color:#0f172a;display:flex;align-items:center;justify-content:space-between;">
              <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}${(it.issuerAr || it.issuerEn) ? ' — ' + tplEsc(v(it, 'issuerAr', 'issuerEn')) : ''}</span>
              <span style="color:#0284c7;font-weight:bold;font-size:0.85em;">✓</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (courseLayout === 'org_badge') {
      return `
        <div class="cv-org-badge-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px 12px;">
          ${items.map(it => `
            <div class="cv-org-badge-card" style="background:rgba(241,245,249,0.9);border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;">
              <div style="font-weight:700;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</div>
              ${(it.issuerAr || it.issuerEn || it.year) ? `<div style="font-size:0.82em;color:#64748b;margin-top:2px;">${tplEsc(v(it, 'issuerAr', 'issuerEn'))}${it.year ? ' (' + tplEsc(it.year) + ')' : ''}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    if (courseLayout === 'list_classic') {
      return `
        <div class="cv-list-classic" style="display:flex;flex-direction:column;gap:3px;">
          ${items.map(it => `
            <div class="cv-bullet-item" style="display:flex;align-items:center;gap:8px;line-height:1.5;margin:2px 0;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span style="font-weight:600;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}${(it.issuerAr || it.issuerEn) ? ' — ' + tplEsc(v(it, 'issuerAr', 'issuerEn')) : ''}${it.year ? ' (' + tplEsc(it.year) + ')' : ''}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (courseLayout === 'grid_dots') {
      return `
        <div class="cv-grid-2col" style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px 20px;">
          ${items.map(it => `
            <div class="cv-bullet-item" style="display:flex;align-items:center;gap:8px;line-height:1.5;margin:2px 0;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span style="font-weight:600;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}${(it.issuerAr || it.issuerEn) ? ' — ' + tplEsc(v(it, 'issuerAr', 'issuerEn')) : ''}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Default: cards_plus
    return `
      <div class="cv-cards-plus-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;">
        ${items.map(it => `
          <div class="cv-card-plus" style="display:flex;align-items:center;gap:8px;background:rgba(241,245,249,0.85);border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;font-size:0.9em;font-weight:600;color:#1e293b;">
            <span class="cv-plus-icon" style="color:#0284c7;font-weight:900;font-size:1.1em;line-height:1;">+</span>
            <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}${(it.issuerAr || it.issuerEn) ? ' — ' + tplEsc(v(it, 'issuerAr', 'issuerEn')) : ''}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Languages Section Layouts ---
  if (kind === 'languages') {
    if (langLayout === 'progress') {
      return `
        <div class="cv-lang-progress-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px 20px;">
          ${items.map(it => {
            const lv = it.level || (/(?:أصيل|متقن|ممتاز|Native|Fluent|Excellent)/i.test(it.levelAr || it.levelEn) ? 5 : 4);
            const pct = Math.min(100, Math.max(20, lv * 20));
            return `
              <div class="cv-prog-item">
                <div style="display:flex;justify-content:space-between;font-weight:700;font-size:0.88em;color:#0f172a;margin-bottom:3px;">
                  <span>${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
                  <span style="font-size:0.8em;color:#64748b;">${tplEsc(v(it, 'levelAr', 'levelEn')) || pct + '%'}</span>
                </div>
                <div style="height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
                  <div style="height:100%;width:${pct}%;background:var(--cv-accent,#0284c7);border-radius:999px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (langLayout === 'columns_clean') {
      return `
        <div class="cv-lang-columns" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 20px;">
          ${items.map(it => `
            <div class="cv-col-item" style="padding:4px 0;border-bottom:1px dashed #cbd5e1;font-weight:600;font-size:0.9em;color:#0f172a;display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:700;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
              <span style="color:#64748b;font-size:0.85em;font-weight:500;">${tplEsc(v(it, 'levelAr', 'levelEn'))}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (langLayout === 'cards_plus') {
      return `
        <div class="cv-cards-plus-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;">
          ${items.map(it => `
            <div class="cv-card-plus" style="display:flex;align-items:center;gap:8px;background:rgba(241,245,249,0.85);border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;font-size:0.9em;font-weight:600;color:#1e293b;">
              <span class="cv-plus-icon" style="color:#0284c7;font-weight:900;font-size:1.1em;line-height:1;">+</span>
              <span>${tplEsc(v(it, 'nameAr', 'nameEn'))} ${(it.levelAr || it.levelEn) ? '(' + tplEsc(v(it, 'levelAr', 'levelEn')) + ')' : ''}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (langLayout === 'list_classic') {
      return `
        <div class="cv-list-classic" style="display:flex;flex-direction:column;gap:3px;">
          ${items.map(it => `
            <div class="cv-bullet-item" style="display:flex;align-items:center;gap:8px;line-height:1.5;margin:2px 0;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span style="font-weight:700;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
              ${(it.levelAr || it.levelEn) ? `<span style="font-weight:500;font-size:0.88em;color:#64748b;">— ${tplEsc(v(it, 'levelAr', 'levelEn'))}</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    if (langLayout === 'grid_dots') {
      return `
        <div class="cv-grid-2col" style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px 20px;">
          ${items.map(it => `
            <div class="cv-bullet-item" style="display:flex;align-items:center;gap:8px;line-height:1.5;margin:2px 0;">
              <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;"></span>
              <span style="font-weight:700;font-size:0.92em;color:#0f172a;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</span>
              ${(it.levelAr || it.levelEn) ? `<span style="font-weight:500;font-size:0.88em;color:#64748b;">(${tplEsc(v(it, 'levelAr', 'levelEn'))})</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Default: pills_level
    return `
      <div class="cv-lang-tinted-wrap" style="display:flex;flex-wrap:wrap;gap:8px;">
        ${items.map(it => `
          <div class="cv-lang-pill" style="display:inline-flex;align-items:center;gap:6px;background:rgba(241,245,249,0.9);border:1px solid #cbd5e1;border-radius:6px;padding:5px 12px;font-size:0.9em;color:#1e293b;">
            <b style="font-weight:700;">${tplEsc(v(it, 'nameAr', 'nameEn'))}</b>
            ${(it.levelAr || it.levelEn) ? `<span style="color:#64748b;font-weight:500;">(${tplEsc(v(it, 'levelAr', 'levelEn'))})</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (kind === 'references') {
    if (sec.onRequest) {
      return `<p class="cv-refs-note" style="font-weight:400">${lang === 'en' ? 'Available upon request' : 'متاحة عند الطلب'}</p>`;
    }
    return items.map(it => `
      <div class="cv-item" style="margin-bottom:7px">
        <span class="cv-item-role" style="font-weight:600">${tplEsc(String(v(it, 'nameAr', 'nameEn')).replace(/[\*\_#~\`]/g, '').trim())}</span>
        ${(it.orgAr || it.orgEn) ? ` <span class="cv-item-org" style="font-weight:400">— ${tplEsc(String(v(it, 'orgAr', 'orgEn')).replace(/[\*\_#~\`]/g, '').trim())}</span>` : ''}
        ${it.phone ? `<div class="cv-sub" dir="ltr" style="text-align:inherit;font-weight:400"><a href="tel:${tplEsc(String(it.phone).replace(/\s+/g, ''))}" class="cv-link cv-link-blue" style="color:#2563eb;text-decoration:none;font-weight:600;">${tplEsc(it.phone)}</a>${it.email ? ' • ' + tplEsc(it.email) : ''}</div>` : (it.email ? `<div class="cv-sub" style="font-weight:400">${tplEsc(it.email)}</div>` : '')}
      </div>`).join('');
  }

  // custom
  if (sec.textAr || sec.textEn) {
    return `<p class="cv-item-desc" style="margin:0;font-weight:400;line-height:1.6">${tplEsc(String(v(sec, 'textAr', 'textEn')).replace(/[\*\_#~\`]/g, '').trim())}</p>`;
  }
  return items.map(it => `<div class="cv-item" style="font-weight:400"><span class="cv-item-role" style="font-weight:600">${tplEsc(String(v(it, 'nameAr', 'nameEn') || v(it, 'textAr', 'textEn')).replace(/[\*\_#~\`]/g, '').trim())}</span>${(it.descAr || it.descEn) ? `<div class="cv-item-desc" style="font-weight:400">${tplEsc(String(v(it, 'descAr', 'descEn')).replace(/[\*\_#~\`]/g, '').trim())}</div>` : ''}</div>`).join('');
}

function renderContact(p, lang, allowContactIcons) {
  const bits = [];
  const show = allowContactIcons !== false;
  const ic = (i) => show ? `<i class="${i}" style="margin-inline-end:6px;opacity:0.85;"></i>` : '';
  
  if (p.phone) {
    const rawPhone = String(p.phone).replace(/\s+/g, '');
    bits.push(`<span dir="ltr" style="display:inline-flex;align-items:center;"><a href="tel:${tplEsc(rawPhone)}" class="cv-link cv-link-blue" style="color:#2563eb;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;">${ic('fas fa-phone')}<span>${tplEsc(p.phone)}</span></a></span>`);
  }
  if (p.email) {
    bits.push(`<span style="display:inline-flex;align-items:center;"><a href="mailto:${tplEsc(p.email)}" class="cv-link cv-link-blue" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;">${ic('fas fa-envelope')}<span>${tplEsc(p.email)}</span></a></span>`);
  }
  const city = lang === 'en' ? (p.cityEn || (typeof translateTextToEnglish === 'function' ? translateTextToEnglish(p.cityAr || p.city) : '') || p.city) : (p.cityAr || p.city || p.cityEn);
  if (city) bits.push(`<span style="display:inline-flex;align-items:center;">${ic('fas fa-map-marker-alt')}<span>${tplEsc(city)}</span></span>`);
  
  if (p.linkedin) {
    let lkUrl = p.linkedin.trim();
    if (!lkUrl.startsWith('http://') && !lkUrl.startsWith('https://')) {
      lkUrl = 'https://' + (lkUrl.startsWith('linkedin.com') ? '' : 'linkedin.com/in/') + lkUrl.replace(/^@/, '');
    }
    bits.push(`<span dir="ltr" style="display:inline-flex;align-items:center;"><a href="${tplEsc(lkUrl)}" class="cv-link cv-link-blue" target="_blank" rel="noopener" style="color:#0a66c2;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;">${ic('fab fa-linkedin')}<span>${tplEsc(p.linkedin)}</span></a></span>`);
  }
  if (p.website) {
    let webUrl = p.website.trim();
    if (!webUrl.startsWith('http://') && !webUrl.startsWith('https://')) webUrl = 'https://' + webUrl;
    bits.push(`<span dir="ltr" style="display:inline-flex;align-items:center;"><a href="${tplEsc(webUrl)}" class="cv-link cv-link-blue" target="_blank" rel="noopener" style="color:#0284c7;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;">${ic('fas fa-globe')}<span>${tplEsc(p.website)}</span></a></span>`);
  }

  // Nationality hidden per user request

  if (bits.length === 0) return '';
  const sep = `<span class="cv-contact-sep" style="margin:0 8px;color:#94a3b8;font-weight:300;">|</span>`;
  return `<div class="cv-contact" style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 0;margin-top:8px;">${bits.join(sep)}</div>`;
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

  if (tpl.layout === 'formal_pro' || tpl.header === 'formal_center') {
    const nameAr = nr.ar || nr.main || '';
    const nameEn = nr.en || '';
    const jtFormal = jt ? `<div class="cv-job-title-formal" style="font-size:1.05em;font-weight:600;color:#334155;margin-top:4px;text-align:center;">${tplEsc(jt)}</div>` : '';
    return `
    <header class="cv-header-formal" style="text-align:center;margin-bottom:18px;">
      <h1 class="cv-name-ar" style="font-size:2.05em;font-weight:800;margin:0;color:#000;line-height:1.2;">${tplEsc(nameAr)}</h1>
      ${nameEn ? `<div class="cv-name-en" style="font-size:0.9em;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin-top:4px;">${tplEsc(nameEn)}</div>` : ''}
      ${jtFormal}
      ${renderContact(p, lang, cust.showIcons !== false)}
    </header>`;
  }

  const core = `<h1 class="cv-name">${tplEsc(name || '')}</h1>${nameSub}${jtHtml}${renderContact(p, lang, cust.showIcons !== false)}`;

  if (tpl.header === 'center') return `<header class="cv-header-center">${photo ? `<div style="margin-bottom:10px">${photo}</div>` : ''}${core}${logo ? `<div style="margin-top:8px">${logo}</div>` : ''}</header>`;
  if (tpl.header === 'band') return `<header class="cv-header-band"><div class="cv-header-split"><div>${core}</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${photo}${logo}</div></div></header>`;
  return `<header class="cv-header-split"><div>${core}</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${photo}${logo}</div></header>`;
}

const SIDE_SECTION_KINDS = ['skills', 'languages', 'certs', 'list'];

function ensureEnglishData(data) {
  if (!data) return;
  const p = data.personal || {};
  const srcName = (p.nameAr || p.fullNameAr || p.fullName || p.name || '').trim();
  if (srcName) {
    p.nameEn = typeof translateArabicNameToEnglish === 'function'
      ? translateArabicNameToEnglish(srcName)
      : (typeof translateTextToEnglish === 'function' ? translateTextToEnglish(srcName) : srcName);
  }
  const srcTitle = (p.titleAr || p.jobTitleAr || p.title || p.jobTitle || '').trim();
  if (srcTitle) {
    p.titleEn = typeof translateTextToEnglish === 'function' ? translateTextToEnglish(srcTitle) : srcTitle;
  }
  const srcCity = (p.cityAr || p.city || '').trim();
  if (srcCity) {
    p.cityEn = typeof translateTextToEnglish === 'function' ? translateTextToEnglish(srcCity) : srcCity;
  }
  const srcNat = (p.nationalityAr || p.nationality || '').trim();
  if (srcNat) {
    p.nationalityEn = typeof translateTextToEnglish === 'function' ? translateTextToEnglish(srcNat) : srcNat;
  }

  (data.sections || []).forEach(sec => {
    const srcSecTitle = (sec.titleAr || sec.title || '').trim();
    if (srcSecTitle) {
      sec.titleEn = typeof translateTextToEnglish === 'function' ? translateTextToEnglish(srcSecTitle) : srcSecTitle;
    }
    const srcSecText = (sec.textAr || sec.text || '').trim();
    if (srcSecText) {
      sec.textEn = typeof translateTextToEnglish === 'function' ? translateTextToEnglish(srcSecText) : srcSecText;
    }
    (sec.items || []).forEach(it => {
      ['role', 'org', 'company', 'degree', 'school', 'desc', 'name', 'level', 'issuer', 'text'].forEach(k => {
        const ar = it[k + 'Ar'] || it[k];
        if (ar) {
          it[k + 'En'] = typeof translateTextToEnglish === 'function' ? translateTextToEnglish(String(ar)) : String(ar);
        }
      });
      if (it.year && typeof it.year === 'string') {
        it.year = it.year.replace(/هـ/g, 'H').replace(/ه/g, 'H').trim();
      }
    });
  });
}

function renderTemplate(templateId, data, cust, language) {
  const tpl = TEMPLATE_DEFS[templateId] || TEMPLATE_DEFS.ats1;
  cust = cust || {};
  data = data || {};
  const lang = language || 'ar';

  if (lang === 'en' || lang === 'bilingual' || tpl.layout === 'ats_merged_bilingual' || tpl.layout === 'bilingual_split') {
    ensureEnglishData(data);
  }
  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const color = cust.themeColor || tpl.color;
  const accent = cust.accentColor || tpl.accent;
  const secGap = cust.secGap != null ? cust.secGap : 24;
  const itemGap = cust.itemGap != null ? cust.itemGap : 14;
  const vars = [
    `--cv-color:${color}`, `--cv-accent:${accent}`,
    `--cv-line:${tpl.line || '2px solid ' + color}`,
    `--cv-fs:${cust.fontSize || 14}px`, `--cv-lh:${cust.lineHeight || 1.55}`,
    `--cv-margin:${cust.margin != null ? cust.margin : 40}px`,
    `--cv-sec-gap:${secGap}px`, `--cv-item-gap:${itemGap}px`,
    `--cv-font-ar:'${cust.fontAr || 'Cairo'}'`, `--cv-font-en:'${cust.fontEn || 'Inter'}'`
  ];
  if (tpl.bandBg) vars.push(`--cv-band-bg:${cust.themeColor || tpl.bandBg}`);
  if (tpl.sideBg) vars.push(`--cv-side-bg:${cust.themeColor || tpl.sideBg}`);
  if (tpl.sideText) vars.push(`--cv-side-text:${tpl.sideText}`);

  const sections = (data.sections || []).filter(s => s.visible !== false);
  const showIcons = cust.showIcons !== false && !tpl.ats;
  const secHtml = (s) => `<section class="cv-section">${secTitle(s, lang, showIcons)}${renderSectionBody(s, lang, tpl, cust)}</section>`;

  const qr = cust.qrDataUrl ? `<div class="cv-qr-wrap"><img class="cv-qr" src="${cust.qrDataUrl}" alt="QR"><div class="cv-qr-label">${lang === 'en' ? 'Online CV' : 'نسخة أونلاين'}</div></div>` : '';
  const sig = (data.personal && data.personal.signature) ? `<div class="cv-signature-wrap"><img class="cv-signature" src="${data.personal.signature}" alt=""></div>` : '';

  const cls = `cv-page${tpl.layout === 'formal_pro' ? ' cv-formal-pro' : ''}${tpl.layout === 'tinted_cards' ? ' cv-tinted-cards' : ''}${tpl.serif ? ' cv-serif' : ''}${tpl.ats ? ' cv-ats' : ''}`;
  const styleAttr = `style="${vars.join(';')}"`;

  // Modern Tinted Cards ATS Layout with Top 3 Info Metric Boxes
  if (tpl.layout === 'tinted_cards' || templateId === 'ats_tinted_cards') {
    const p = data.personal || {};
    const eduSection = (data.sections || []).find(s => s.type === 'education');
    const firstEdu = eduSection?.items?.[0] || {};
    const gradYear = firstEdu.year || (lang === 'en' ? '2024' : '١٤٤٥هـ');
    const degreeTitle = (lang === 'en' ? (firstEdu.degreeEn || firstEdu.degreeAr) : (firstEdu.degreeAr || firstEdu.degreeEn)) || (lang === 'en' ? "Bachelor's Degree" : 'درجة البكالوريوس');
    const university = (lang === 'en' ? (firstEdu.schoolEn || firstEdu.schoolAr) : (firstEdu.schoolAr || firstEdu.schoolEn)) || (lang === 'en' ? 'University' : 'الجامعة');
    const targetJob = (lang === 'en' ? (p.titleEn || p.titleAr) : (p.titleAr || p.titleEn)) || (lang === 'en' ? 'Professional Specialist' : 'التخصص المستهدف');

    const topMetricsHtml = `
      <div class="cv-top-metrics-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:14px 0 18px;">
        <div class="cv-metric-box" style="background:rgba(241,245,249,0.85);border:1.5px solid #cbd5e1;border-radius:8px;padding:8px 12px;border-top:3px solid var(--cv-accent,#0284c7);">
          <div class="cv-metric-title" style="font-size:0.75em;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">${lang === 'en' ? 'GRADUATION YEAR' : 'سنة التخرج'}</div>
          <div class="cv-metric-val" style="font-size:0.95em;font-weight:700;color:#0f172a;margin-top:3px;">${tplEsc(gradYear)}</div>
        </div>
        <div class="cv-metric-box" style="background:rgba(241,245,249,0.85);border:1.5px solid #cbd5e1;border-radius:8px;padding:8px 12px;border-top:3px solid var(--cv-accent,#0284c7);">
          <div class="cv-metric-title" style="font-size:0.75em;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">${lang === 'en' ? 'UNIVERSITY & DEGREE' : 'الجامعة والشهادة'}</div>
          <div class="cv-metric-val" style="font-size:0.9em;font-weight:700;color:#0f172a;margin-top:3px;">${tplEsc(degreeTitle)}${university ? ' — ' + tplEsc(university) : ''}</div>
        </div>
        <div class="cv-metric-box" style="background:rgba(241,245,249,0.85);border:1.5px solid #cbd5e1;border-radius:8px;padding:8px 12px;border-top:3px solid var(--cv-accent,#0284c7);">
          <div class="cv-metric-title" style="font-size:0.75em;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">${lang === 'en' ? 'TARGET SPECIALTY' : 'المسمى المستهدف'}</div>
          <div class="cv-metric-val" style="font-size:0.9em;font-weight:700;color:#0f172a;margin-top:3px;">${tplEsc(targetJob)}</div>
        </div>
      </div>
    `;

    const secCards = sections.map(s => `
      <section class="cv-section cv-section-tinted" style="background:rgba(248,250,252,0.8);border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:14px;">
        ${secTitle(s, lang, showIcons)}
        ${renderSectionBody(s, lang, tpl, cust)}
      </section>
    `).join('');

    return `
      <div class="${cls} cv-tinted-cards" dir="${dir}" ${styleAttr}>
        <div class="cv-inner">
          ${renderHeader(tpl, data, cust, lang)}
          ${topMetricsHtml}
          ${secCards}
          ${sig}
        </div>
        ${qr}
      </div>
    `;
  }

  
  // New ATS Merged Bilingual Pro Template (Exact replica of Ahmad Misfer Al-Otaibi layout)
  if (tpl.layout === 'ats_merged_bilingual' || templateId === 'ats_merged_bilingual') {
    const p = data.personal || {};
    const nr = resolveName(p);
    const tr = resolveTitle(p);

    const nameAr = nr.ar || nr.en || '';
    const phoneRaw = String(p.phone || '').replace(/\s+/g, '');
    const phoneLink = phoneRaw ? `<a href="tel:${tplEsc(phoneRaw)}" style="color:#000;text-decoration:none;font-weight:600;">${tplEsc(p.phone)}</a>` : '';
    const emailLink = p.email ? `<a href="mailto:${tplEsc(p.email)}" style="color:#000;text-decoration:none;font-weight:600;">${tplEsc(p.email)}</a>` : '';
    const cityText = p.cityAr || p.city || p.cityEn || '';

    const contactBits = [phoneLink, emailLink, cityText].filter(Boolean);
    const headerHtml = `
      <div class="cv-merged-header" style="text-align:center;margin-bottom:12px;">
        <h1 class="cv-name" style="font-size:26px;font-weight:800;color:#000;margin:0 0 6px;letter-spacing:normal;">${tplEsc(nameAr)}</h1>
        <div class="cv-merged-contact" style="display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:4px 10px;font-size:11.5px;color:#334155;direction:rtl;">
          ${contactBits.join('<span style="color:#94a3b8;margin:0 4px;">|</span>')}
        </div>
        <div style="border-bottom:1.5px solid #cbd5e1;margin-top:10px;"></div>
      </div>
    `;

    const sectionPairs = sections.map(s => {
      const isText = s.type === 'summary' || s.type === 'objective' || s.type === 'custom';
      const isEdu = s.type === 'education';
      const isSkills = s.type === 'skills' || s.type === 'techskills' || s.type === 'softskills';
      const isLangs = s.type === 'languages';
      const isCerts = s.type === 'training' || s.type === 'certifications' || s.type === 'courses';

      // English Title
      const def = SECTION_TYPES[s.type] || { en: s.titleEn || s.type, ar: s.titleAr || s.type };
      const enTitle = (s.titleEn || def.en || '').toUpperCase();
      const arTitle = s.titleAr || def.ar || '';

      // Arabic Content
      let arContent = '';
      if (isText) {
        arContent = `<div style="text-align:justify;line-height:1.6;font-size:11px;color:#1e293b;">${tplEsc(s.textAr || (s.items?.[0]?.textAr) || '').replace(/\n/g, '<br>')}</div>`;
      } else if (isEdu) {
        arContent = (s.items || []).map(it => `
          <div style="border-right:3px solid #64748b;padding:4px 10px;background:rgba(248,250,252,0.7);margin-bottom:6px;font-size:11.5px;font-weight:700;color:#0f172a;">
            <div>${tplEsc(it.degreeAr || it.degreeEn || '')}</div>
            ${it.schoolAr ? `<div style="font-weight:500;color:#64748b;font-size:10.5px;margin-top:2px;">${tplEsc(it.schoolAr)}</div>` : ''}
          </div>
        `).join('');
      } else if (isSkills) {
        arContent = (s.items || []).map((it, idx) => `
          <div style="display:flex;align-items:baseline;gap:6px;font-size:11px;line-height:1.55;margin-bottom:3px;color:#0f172a;">
            <span style="font-weight:700;color:#64748b;flex-shrink:0;min-width:18px;">${String(idx + 1).padStart(2, '0')}.</span>
            <span style="font-weight:600;">${tplEsc(it.nameAr || it.nameEn || '')}</span>
          </div>
        `).join('');
      } else if (isLangs) {
        arContent = (s.items || []).map(it => `
          <div style="display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;border-right:3px solid #0284c7;padding:3px 8px;border-radius:4px;margin-bottom:4px;font-size:11px;">
            <span style="font-weight:700;color:#0f172a;">${tplEsc(it.nameAr || it.nameEn || '')}</span>
            <span style="color:#0284c7;font-weight:600;">${tplEsc(it.levelAr || it.levelEn || '')}</span>
          </div>
        `).join('');
      } else if (isCerts) {
        arContent = (s.items || []).map(it => `
          <div style="display:flex;align-items:baseline;gap:6px;line-height:1.45;margin-bottom:3px;font-size:11px;">
            <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;margin-top:0.45em;"></span>
            <span style="font-weight:600;color:#0f172a;">${tplEsc(it.nameAr || it.nameEn || '')}${(it.issuerAr || it.issuerEn) ? ' (' + tplEsc(it.issuerAr || it.issuerEn) + ')' : ''}</span>
          </div>
        `).join('');
      } else {
        // Experience / Timeline / Custom
        arContent = (s.items || []).map(it => {
          const role = it.roleAr || it.roleEn || '';
          const org = it.orgAr || it.orgEn || '';
          const desc = it.descAr || it.descEn || '';
          return `
            <div style="margin-bottom:8px;font-size:11.5px;">
              <div style="display:flex;align-items:baseline;gap:6px;font-weight:700;color:#0f172a;line-height:1.45;">
                <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;margin-top:0.45em;"></span>
                <span>${tplEsc(role)}${org ? ' - ' + tplEsc(org) : ''}</span>
              </div>
              ${desc ? `<div style="padding-inline-start:12px;margin-top:3px;font-weight:400;color:#334155;font-size:11px;">${renderBulletList(desc)}</div>` : ''}
            </div>
          `;
        }).join('');
      }

      // English Content
      let enContent = '';
      if (isText) {
        enContent = `<div style="text-align:justify;line-height:1.6;font-size:11px;color:#1e293b;">${tplEsc(s.textEn || s.textAr || '').replace(/\n/g, '<br>')}</div>`;
      } else if (isEdu) {
        enContent = (s.items || []).map(it => `
          <div style="border-left:3px solid #64748b;padding:4px 10px;background:rgba(248,250,252,0.7);margin-bottom:6px;font-size:11.5px;font-weight:700;color:#0f172a;">
            <div>${tplEsc(it.degreeEn || it.degreeAr || '')}</div>
            ${it.schoolEn ? `<div style="font-weight:500;color:#64748b;font-size:10.5px;margin-top:2px;">${tplEsc(it.schoolEn)}</div>` : ''}
          </div>
        `).join('');
      } else if (isSkills) {
        enContent = (s.items || []).map((it, idx) => `
          <div style="display:flex;align-items:baseline;gap:6px;font-size:11px;line-height:1.55;margin-bottom:3px;color:#0f172a;">
            <span style="font-weight:700;color:#64748b;flex-shrink:0;min-width:18px;">${String(idx + 1).padStart(2, '0')}.</span>
            <span style="font-weight:600;">${tplEsc(it.nameEn || it.nameAr || '')}</span>
          </div>
        `).join('');
      } else if (isLangs) {
        enContent = (s.items || []).map(it => `
          <div style="display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;border-left:3px solid #0284c7;padding:3px 8px;border-radius:4px;margin-bottom:4px;font-size:11px;">
            <span style="font-weight:700;color:#0f172a;">${tplEsc(it.nameEn || it.nameAr || '')}</span>
            <span style="color:#0284c7;font-weight:600;">${tplEsc(it.levelEn || it.levelAr || '')}</span>
          </div>
        `).join('');
      } else if (isCerts) {
        enContent = (s.items || []).map(it => `
          <div style="display:flex;align-items:baseline;gap:6px;line-height:1.45;margin-bottom:3px;font-size:11px;">
            <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;margin-top:0.45em;"></span>
            <span style="font-weight:600;color:#0f172a;">${tplEsc(it.nameEn || it.nameAr || '')}${(it.issuerEn || it.issuerAr) ? ' (' + tplEsc(it.issuerEn || it.issuerAr) + ')' : ''}</span>
          </div>
        `).join('');
      } else {
        // Experience / Timeline / Custom
        enContent = (s.items || []).map(it => {
          const role = it.roleEn || it.roleAr || '';
          const org = it.orgEn || it.orgAr || '';
          const desc = it.descEn || it.descAr || '';
          return `
            <div style="margin-bottom:8px;font-size:11.5px;">
              <div style="display:flex;align-items:baseline;gap:6px;font-weight:700;color:#0f172a;line-height:1.45;">
                <span class="cv-bullet-dot" style="display:inline-block;width:5.5px;height:5.5px;min-width:5.5px;min-height:5.5px;border-radius:50%!important;background-color:#000000!important;flex-shrink:0;margin-top:0.45em;"></span>
                <span>${tplEsc(role)}${org ? ' - ' + tplEsc(org) : ''}</span>
              </div>
              ${desc ? `<div style="padding-inline-start:12px;margin-top:3px;font-weight:400;color:#334155;font-size:11px;">${renderBulletList(desc)}</div>` : ''}
            </div>
          `;
        }).join('');
      }

      return `
        <div class="cv-merged-row" style="display:table-row;">
          <!-- English Left Column -->
          <div class="cv-merged-col-en" dir="ltr" style="display:table-cell;width:49%;vertical-align:top;padding-right:12px;padding-bottom:14px;text-align:left;">
            <div style="font-weight:800;font-size:12px;color:#000;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px;">${tplEsc(enTitle)}</div>
            ${enContent}
          </div>

          <!-- Divider -->
          <div class="cv-merged-divider" style="display:table-cell;width:2%;border-left:1px solid #e2e8f0;vertical-align:top;"></div>

          <!-- Arabic Right Column -->
          <div class="cv-merged-col-ar" dir="rtl" style="display:table-cell;width:49%;vertical-align:top;padding-left:12px;padding-bottom:14px;text-align:right;">
            <div style="font-weight:800;font-size:13px;color:#000;margin-bottom:6px;">${tplEsc(arTitle)}</div>
            ${arContent}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="${cls} cv-merged-bilingual-page" dir="rtl" ${styleAttr}>
        <div class="cv-inner" style="padding:24px 30px;">
          ${headerHtml}
          <div class="cv-merged-table" style="display:table;width:100%;table-layout:fixed;">
            ${sectionPairs}
          </div>
          ${sig}
        </div>
        ${qr}
      </div>
    `;
  }

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
            ${renderSectionBody(s, 'ar', tpl, cust)}
          </section>
        </div>
        <div class="column-divider" style="display:table-cell; width:4%; border-left:2px solid var(--cv-accent,#b0b0b0); vertical-align:top;"></div>
        <div class="column-en" dir="ltr" style="display:table-cell; width:48%; text-align:left; vertical-align:top; padding-left:10px;">
          <section class="cv-section">
            ${secTitle(s, 'en', showIcons)}
            ${renderSectionBody(s, 'en', tpl, cust)}
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
        ${renderSectionBody(s, lang, tpl, cust)}
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
      <div class="cv-sidebar-wrap">
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
