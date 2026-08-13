/* ============================================================================
   Ehab ATS - Smart AI Engine (Server-Side Engine)
   100% faithful Markdown / ChatGPT / Word / Raw text parser:
   - Strips ChatGPT stars (**), hashes (##), emojis, squares (■, ▪)
   - Accurately classifies sections (Objective, Education, Experience, Courses, Skills, Languages)
   - Target Job Title: STRICTLY OPTIONAL & empty unless user explicitly wrote "المسمى الوظيفي:"
   - Preserves user's exact section content & clean Arabic text
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

function sanitizeText(s: string): string {
  if (!s) return '';
  return s
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u25FE\u25AA\u25CF•\*\-\_#~`■▪🔹🎯📚💼🎓🛠️📌✨⭐]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanContentLine(s: string): string {
  if (!s) return '';
  return s
    .replace(/^[\*\-\#\_~`■▪🔹🎯📚💼🎓🛠️📌✨⭐•\s]+/g, '')
    .replace(/[\*\_\#~`]/g, '')
    .trim();
}

function classifySectionHeading(rawLine: string): string | null {
  const clean = sanitizeText(rawLine).toLowerCase();
  if (!clean || clean.length > 40) return null;

  if (/(الهدف|الملخص|نبذة|مقدمة|profile|summary|objective|about)/i.test(clean)) {
    return 'summary';
  }
  if (/(التعليم|المؤهلات|المؤهل|دراستي|شهادة الثانوية|جامعة|كلية|مدرسة|education|academic|qualifications)/i.test(clean) && !clean.includes('خبرة')) {
    return 'education';
  }
  if (/(الخبرات|الخبرة|خبراتي|التاريخ المهني|السجل المهني|عملي|متدرب|مساعد إداري|experience|work|employment|jobs)/i.test(clean) && clean.length < 25 && !clean.includes('مهارات')) {
    return 'experience';
  }
  if (/(الدورات|الكورسات|الشهادات التدريبية|الاعتمادات|التدريب|courses|certifications|certificates|training)/i.test(clean)) {
    return 'courses';
  }
  if (/(المهارات|مهاراتي|تقنيات|skills|competencies|abilities)/i.test(clean)) {
    return 'skills';
  }
  if (/(اللغات|لغاتي|languages)/i.test(clean)) {
    return 'languages';
  }

  return null;
}

function parseUserRawResumeText(rawText: string, lang: string = 'ar'): ResumeData {
  const text = (rawText || '').trim();

  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';

  const phoneMatch = text.match(/(?:05\d{8}|\+?9665\d{8}|01\d{7}|\d{10})/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  let cityAr = '', cityEn = '';
  if (/الطائف|Taif/i.test(text)) { cityAr = 'الطائف - الحوية'; cityEn = 'Taif'; }
  else if (/الرياض|Riyadh/i.test(text)) { cityAr = 'الرياض'; cityEn = 'Riyadh'; }
  else if (/جدة|Jeddah/i.test(text)) { cityAr = 'جدة'; cityEn = 'Jeddah'; }
  else if (/الدمام|Dammam/i.test(text)) { cityAr = 'الدمام'; cityEn = 'Dammam'; }
  else if (/الخبر|Khobar/i.test(text)) { cityAr = 'الخبر'; cityEn = 'Khobar'; }
  else if (/مكة|Makkah/i.test(text)) { cityAr = 'مكة المكرمة'; cityEn = 'Makkah'; }
  else if (/المدينة|Madinah/i.test(text)) { cityAr = 'المدينة المنورة'; cityEn = 'Madinah'; }

  let nameAr = '', nameEn = '';
  const nameLine = text.match(/(?:الاسم|اسم|أنا|المتقدم|المرشح|Candidate|Name)[:\s]*([^\n,.]+)/i);
  if (nameLine) {
    const cand = cleanContentLine(nameLine[1]);
    if (/[\u0621-\u064A]/.test(cand)) nameAr = cand;
    else nameEn = cand;
  }
  if (!nameAr && !nameEn) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine && firstLine.length < 35 && !firstLine.includes(':') && !firstLine.includes('@') && !firstLine.includes('{')) {
      const cand = cleanContentLine(firstLine);
      if (/[\u0621-\u064A]/.test(cand)) nameAr = cand;
      else nameEn = cand;
    }
  }

  let titleAr = '', titleEn = '';
  const titleMatch = text.match(/(?:المسمى الوظيفي|Job Title)[:\s]*([^\n,.]+)/i);
  if (titleMatch) {
    const tVal = cleanContentLine(titleMatch[1]);
    if (/[\u0621-\u064A]/.test(tVal)) titleAr = tVal;
    else titleEn = tVal;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentSectionType: 'header' | 'summary' | 'education' | 'experience' | 'courses' | 'skills' | 'languages' = 'header';
  const rawSections: Record<string, string[]> = {
    summary: [],
    education: [],
    experience: [],
    courses: [],
    skills: [],
    languages: []
  };

  lines.forEach(line => {
    const headingType = classifySectionHeading(line);
    if (headingType) {
      currentSectionType = headingType as any;
      return;
    }

    if (currentSectionType !== 'header') {
      const cleanL = cleanContentLine(line);
      if (cleanL) rawSections[currentSectionType].push(cleanL);
    }
  });

  let summaryTextAr = '';
  let summaryTextEn = '';
  if (rawSections.summary.length > 0) {
    const sumRaw = rawSections.summary.map(cleanContentLine).filter(Boolean).join(' ');
    if (/[\u0621-\u064A]/.test(sumRaw)) summaryTextAr = sumRaw;
    else summaryTextEn = sumRaw;
  }

  const eduItems: any[] = [];
  let currentEdu: any = null;
  rawSections.education.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);

    if (!currentEdu || yearMatch || /شهادة|بكالوريوس|ماجستير|دبلوم|ثانوية|جامعة|كلية/i.test(cleanL)) {
      if (currentEdu) eduItems.push(currentEdu);
      let isAr = /[\u0621-\u064A]/.test(cleanL);
      currentEdu = {
        degreeAr: isAr ? cleanL : '',
        degreeEn: isAr ? '' : cleanL,
        schoolAr: '', schoolEn: '',
        year: yearMatch ? yearMatch[0] : '',
        gpa: ''
      };
    } else if (currentEdu) {
      if (yearMatch && !currentEdu.year) currentEdu.year = yearMatch[0];
      else {
        if (/[\u0621-\u064A]/.test(cleanL)) currentEdu.schoolAr = (currentEdu.schoolAr ? currentEdu.schoolAr + ' | ' : '') + cleanL;
        else currentEdu.schoolEn = (currentEdu.schoolEn ? currentEdu.schoolEn + ' | ' : '') + cleanL;
      }
    }
  });
  if (currentEdu) eduItems.push(currentEdu);

  const expItems: any[] = [];
  let currentExp: any = null;
  rawSections.experience.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const dates = cleanL.match(/(14\d{2}هـ?|20\d{2}|19\d{2})/g);
    const isRoleOrComp = /(متدرب|مساعد|محاسب|مهندس|مدير|أخصائي|مطور|محلل|مصمم|كاتب|فني|معلم|استشاري|مشرف|خبرة|شركة|مجموعة|مؤسسة|مستشفى|وزارة|هيئة|بنك|Company|Group|Corp|Engineer|Manager|Developer|Accountant|Specialist)/i.test(cleanL);

    if (!currentExp || isRoleOrComp || dates) {
      if (currentExp && (currentExp.roleAr || currentExp.roleEn || currentExp.descAr || currentExp.descEn)) {
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
  if (currentExp && (currentExp.roleAr || currentExp.roleEn || currentExp.descAr || currentExp.descEn)) {
    expItems.push(currentExp);
  }

  const courseItems: any[] = [];
  rawSections.courses.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);
    let isAr = /[\u0621-\u064A]/.test(cleanL);
    courseItems.push({
      nameAr: isAr ? cleanL : '',
      nameEn: isAr ? '' : cleanL,
      orgAr: '', orgEn: '',
      year: yearMatch ? yearMatch[0] : ''
    });
  });

  const skillItems: any[] = [];
  rawSections.skills.forEach(line => {
    const parts = line.split(/[,•\-\n|]/);
    parts.forEach(p => {
      const cleanP = cleanContentLine(p);
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
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    let name = cleanL;
    let level = 'متقدم';

    if (cleanL.includes(':')) {
      const parts = cleanL.split(':');
      name = parts[0].trim();
      level = parts[1].trim();
    } else if (cleanL.includes('-')) {
      const parts = cleanL.split('-');
      name = parts[0].trim();
      level = parts[1].trim();
    }

    if (/[\u0621-\u064A]/.test(name)) {
      langItems.push({ nameAr: name, nameEn: '', levelAr: level, levelEn: '' });
    } else {
      langItems.push({ nameAr: '', nameEn: name, levelAr: '', levelEn: level });
    }
  });

  const personal = {
    nameAr: nameAr || (lang === 'en' ? '' : 'اسم صاحب السيرة'),
    nameEn: nameEn || (lang === 'en' ? 'Full Name' : ''),
    titleAr: titleAr,
    titleEn: titleEn,
    email: email,
    phone: phone,
    cityAr: cityAr,
    cityEn: cityEn,
    linkedin: '',
    website: '',
    nationality: '',
    birthdate: ''
  };

  const sections: any[] = [];
  if (summaryTextAr || summaryTextEn) {
    sections.push({ id: 's1', type: 'summary', titleAr: 'الهدف المهني', titleEn: 'Professional Objective', visible: true, textAr: summaryTextAr, textEn: summaryTextEn });
  }
  if (eduItems.length > 0) {
    sections.push({ id: 's2', type: 'education', titleAr: 'التعليم', titleEn: 'Education', visible: true, items: eduItems });
  }
  if (expItems.length > 0) {
    sections.push({ id: 's3', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true, items: expItems });
  }
  if (courseItems.length > 0) {
    sections.push({ id: 's4', type: 'courses', titleAr: 'الدورات التدريبية', titleEn: 'Training & Courses', visible: true, items: courseItems });
  }
  if (skillItems.length > 0) {
    sections.push({ id: 's5', type: 'skills', titleAr: 'المهارات', titleEn: 'Skills', visible: true, items: skillItems });
  }
  if (langItems.length > 0) {
    sections.push({ id: 's6', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true, items: langItems });
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
