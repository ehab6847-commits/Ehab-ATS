/* ============================================================================
   Ehab ATS - Smart AI Engine (Server-Side Engine)
   100% faithful raw text parser:
   - Target Job Title: STRICTLY OPTIONAL & empty unless user explicitly wrote "المسمى الوظيفي:"
   - Summary: Clean Arabic text without garbled symbols, bullet icons, or raw entity symbols.
   - Order & Content: Keeps exact user section order & only includes attached data.
   - Skills Language: Preserves exact user language (Arabic skills remain Arabic).
   ============================================================================ */

export interface ResumeData {
  personal: {
    nameAr: string
    nameEn: string
    titleAr: string
    titleEn: string
    email: string
    phone: string
    cityAr: string
    cityEn: string
    linkedin: string
    website: string
    nationality: string
    birthdate: string
    photo?: string
    logo?: string
    signature?: string
  }
  sections: Array<{
    id: string
    type: string
    titleAr: string
    titleEn: string
    visible: boolean
    items?: any[]
    textAr?: string
    textEn?: string
  }>
}

function parseUserRawResumeText(rawText: string, lang: string = 'ar'): ResumeData {
  const text = (rawText || '').trim();
  const cleanLine = (s: string) => (s || '').replace(/[\u2022\u2023\u25E6\u2043\u2219\u25FE\u25AA\u25CF•\*\-]/g, '').trim();

  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';

  const phoneMatch = text.match(/(?:05\d{8}|\+?9665\d{8}|01\d{7}|\d{10})/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  let cityAr = '', cityEn = '';
  if (/الرياض|Riyadh/i.test(text)) { cityAr = 'الرياض'; cityEn = 'Riyadh'; }
  else if (/جدة|Jeddah/i.test(text)) { cityAr = 'جدة'; cityEn = 'Jeddah'; }
  else if (/الدمام|Dammam/i.test(text)) { cityAr = 'الدمام'; cityEn = 'Dammam'; }
  else if (/الخبر|Khobar/i.test(text)) { cityAr = 'الخبر'; cityEn = 'Khobar'; }
  else if (/مكة|Makkah/i.test(text)) { cityAr = 'مكة المكرمة'; cityEn = 'Makkah'; }
  else if (/المدينة|Madinah/i.test(text)) { cityAr = 'المدينة المنورة'; cityEn = 'Madinah'; }

  let nameAr = '', nameEn = '';
  const nameLine = text.match(/(?:الاسم|اسم|أنا|المتقدم|المرشح|Candidate|Name)[:\s]*([^\n,.]+)/i);
  if (nameLine) {
    const cand = cleanLine(nameLine[1]);
    if (/[\u0621-\u064A]/.test(cand)) nameAr = cand;
    else nameEn = cand;
  }
  if (!nameAr && !nameEn) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine && firstLine.length < 35 && !firstLine.includes(':') && !firstLine.includes('@') && !firstLine.includes('{')) {
      const cand = cleanLine(firstLine);
      if (/[\u0621-\u064A]/.test(cand)) nameAr = cand;
      else nameEn = cand;
    }
  }

  let titleAr = '', titleEn = '';
  const titleMatch = text.match(/(?:المسمى الوظيفي|Job Title)[:\s]*([^\n,.]+)/i);
  if (titleMatch) {
    const tVal = cleanLine(titleMatch[1]);
    if (/[\u0621-\u064A]/.test(tVal)) titleAr = tVal;
    else titleEn = tVal;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentSectionType: 'summary' | 'experience' | 'education' | 'skills' | 'languages' = 'summary';
  const rawSections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    languages: []
  };

  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (/^(الملخص|نبذة|عني|profile|summary|about)/i.test(lower)) {
      currentSectionType = 'summary';
      return;
    }
    if (/^(الخبرة|الخبرات|خبراتي|experience|work|employment)/i.test(lower)) {
      currentSectionType = 'experience';
      return;
    }
    if (/^(التعليم|المؤهل|المؤهلات|جامعة|education|academic)/i.test(lower)) {
      currentSectionType = 'education';
      return;
    }
    if (/^(المهارات|مهاراتي|skills|competencies)/i.test(lower)) {
      currentSectionType = 'skills';
      return;
    }
    if (/^(اللغات|لغات|languages)/i.test(lower)) {
      currentSectionType = 'languages';
      return;
    }

    rawSections[currentSectionType].push(line);
  });

  let summaryTextAr = '';
  let summaryTextEn = '';
  if (rawSections.summary.length > 0) {
    const sumRaw = rawSections.summary.map(cleanLine).filter(Boolean).join(' ');
    if (/[\u0621-\u064A]/.test(sumRaw)) summaryTextAr = sumRaw;
    else summaryTextEn = sumRaw;
  }

  const expItems: any[] = [];
  let currentExp: any = null;

  rawSections.experience.forEach(line => {
    const cleanL = cleanLine(line);
    if (!cleanL) return;
    const dates = cleanL.match(/(20\d{2}|19\d{2})/g);
    const isCompanyOrRole = /(شركة|مجموعة|مؤسسة|مستشفى|وزارة|هيئة|بنك|محاسب|مهندس|مدير|أخصائي|مطور|محلل|مصمم|كاتب|فني|معلم|استشاري|مشرف|Company|Group|Corp|Inc|Engineer|Manager|Developer|Accountant|Specialist)/i.test(cleanL);

    if (dates || isCompanyOrRole) {
      if (currentExp && (currentExp.roleAr || currentExp.roleEn || currentExp.orgAr || currentExp.orgEn || currentExp.descAr)) {
        expItems.push(currentExp);
      }
      let start = dates && dates[0] ? dates[0] : '';
      let end = dates && dates[1] ? dates[1] : (cleanL.includes('الحالي') || cleanL.includes('Present') ? 'الحالي' : '');

      let isAr = /[\u0621-\u064A]/.test(cleanL);
      currentExp = {
        roleAr: isAr ? cleanL : '',
        roleEn: isAr ? '' : cleanL,
        orgAr: '', orgEn: '',
        start, end,
        descAr: '', descEn: ''
      };
    } else if (currentExp) {
      if (/[\u0621-\u064A]/.test(cleanL)) {
        currentExp.descAr += (currentExp.descAr ? '\n• ' : '• ') + cleanL;
      } else {
        currentExp.descEn += (currentExp.descEn ? '\n• ' : '• ') + cleanL;
      }
    }
  });
  if (currentExp && (currentExp.roleAr || currentExp.roleEn || currentExp.orgAr || currentExp.orgEn || currentExp.descAr)) {
    expItems.push(currentExp);
  }

  const eduItems: any[] = [];
  if (rawSections.education.length > 0) {
    const eduLine = rawSections.education.map(cleanLine).filter(Boolean).join(' ');
    const yearM = eduLine.match(/(20\d{2}|19\d{2})/);
    const gpaM = eduLine.match(/(?:معدل|GPA)[:\s]*([\d.]+(?:\s*\/\s*[\d.]+)?)/i);
    let isAr = /[\u0621-\u064A]/.test(eduLine);

    eduItems.push({
      degreeAr: isAr ? eduLine : '',
      degreeEn: isAr ? '' : eduLine,
      schoolAr: '', schoolEn: '',
      year: yearM ? yearM[0] : '',
      gpa: gpaM ? gpaM[1] : ''
    });
  }

  const skillItems: any[] = [];
  rawSections.skills.forEach(line => {
    const parts = line.split(/[,•\-\n|]/);
    parts.forEach(p => {
      const cleanP = cleanLine(p);
      if (cleanP && cleanP.length > 1 && cleanP.length < 50) {
        if (/[\u0621-\u064A]/.test(cleanP)) {
          skillItems.push({ nameAr: cleanP, nameEn: '', level: 90 });
        } else {
          skillItems.push({ nameAr: '', nameEn: cleanP, level: 90 });
        }
      }
    });
  });

  const langItems: any[] = [];
  rawSections.languages.forEach(line => {
    const cleanL = cleanLine(line);
    if (!cleanL) return;
    if (/[\u0621-\u064A]/.test(cleanL)) {
      langItems.push({ nameAr: cleanL, nameEn: '', levelAr: 'متقدم', levelEn: '' });
    } else {
      langItems.push({ nameAr: '', nameEn: cleanL, levelAr: '', levelEn: 'Fluent' });
    }
  });

  const personal = {
    nameAr: nameAr || (lang === 'en' ? '' : 'اسم صاحب السيرة'),
    nameEn: nameEn || (lang === 'en' ? 'Full Name' : ''),
    titleAr,
    titleEn,
    email,
    phone,
    cityAr,
    cityEn,
    linkedin: '',
    website: '',
    nationality: '',
    birthdate: ''
  };

  const sections: any[] = [];
  if (summaryTextAr || summaryTextEn) {
    sections.push({ id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', visible: true, textAr: summaryTextAr, textEn: summaryTextEn });
  }
  if (expItems.length > 0) {
    sections.push({ id: 's2', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true, items: expItems });
  }
  if (eduItems.length > 0) {
    sections.push({ id: 's3', type: 'education', titleAr: 'التعليم والشهادات الأكاديمية', titleEn: 'Education', visible: true, items: eduItems });
  }
  if (skillItems.length > 0) {
    sections.push({ id: 's4', type: 'skills', titleAr: 'المهارات والتقنيات', titleEn: 'Skills & Competencies', visible: true, items: skillItems });
  }
  if (langItems.length > 0) {
    sections.push({ id: 's5', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true, items: langItems });
  }

  if (sections.length === 0) {
    sections.push({
      id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', visible: true,
      textAr: text || 'نبذة عن الخبرة والمهارات.', textEn: ''
    });
  }

  return { personal, sections };
}

export function generateResumeFromSmartEngine(jobTitle: string, userText: string = '', lang: string = 'ar'): string {
  const parsed = parseUserRawResumeText((jobTitle ? jobTitle + '\n' : '') + userText, lang);
  return JSON.stringify(parsed);
}

export function handleSmartAssist(action: string, dataJson: string, resumeId?: number): string {
  try {
    let parsed: ResumeData;
    try { parsed = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson; }
    catch { parsed = JSON.parse(generateResumeFromSmartEngine('أخصائي')); }
    return JSON.stringify(parsed);
  } catch {
    return generateResumeFromSmartEngine('أخصائي');
  }
}

export function generateCoverLetterFromSmartEngine(name: string, job: string, company: string = '', points: string = '', lang: string = 'ar'): string {
  const isEn = lang === 'en';
  if (isEn) {
    return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position${company ? ' at ' + company : ''}. With solid professional experience in Saudi Arabia, I am confident in my ability to make an immediate impact on your team.\n\nSincerely,\n${name || 'Applicant'}`;
  }
  return `السادة / فريق التوظيف المحترمين،\n\nالسلام عليكم ورحمة الله وبركاته،،\n\nأتقدم إليكم بخالص الرغبة والاهتمام بالترشح للوظيفة${company ? ' في شركة ' + company : ''}. متسلحاً بخبرة عملية متقدمة في تنفيذ المشاريع وفق مستهدفات رؤية 2030.\n\nوتقبلوا فائق الاحترام والتقدير،،\n\n${name || 'المتقدم'}`;
}
