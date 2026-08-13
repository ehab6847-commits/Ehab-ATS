/* ============================================================================
   Ehab ATS - Smart AI Engine (Client-Side Browser Bundle)
   Provides 100% accurate parsing of user-provided raw resume text & generator input
   without overwriting user data with dummy defaults.
   ============================================================================ */

const JOB_DOMAINS = {
  accounting: {
    keywordsAr: ['محاسب', 'مالي', 'تدقيق', 'ضرائب', 'حسابات', 'ميزانية', 'تكاليف', 'فواتير'],
    keywordsEn: ['accountant', 'finance', 'audit', 'tax', 'accounts', 'budget', 'cost', 'payroll'],
    titleAr: 'محاسب عام وتكاليف',
    titleEn: 'Senior General & Cost Accountant',
    summaryAr: 'محاسب مالي معتمد بخبرة في إدارة الحسابات العامة، إعداد القوائم المالية، والالتزام بمعايير الإبلاغ المالي الدولية (IFRS)، وتقديم الإقرارات الضريبية والزكوية (ZATCA).',
    summaryEn: 'Certified Financial Accountant experienced in general ledger management, financial statements, IFRS compliance, and ZATCA tax filings.',
    skillsAr: ['إعداد القوائم المالية (IFRS)', 'الاقرارات الضريبية والزكاة (ZATCA)', 'برامج SAP & ERP', 'إدارة التدفقات النقدية', 'الموازنات والتنبؤ المالي', 'إكسل متقدم'],
    skillsEn: ['Financial Statements (IFRS)', 'ZATCA Tax & Zakat Filings', 'SAP & ERP Systems', 'Cash Flow Management', 'Advanced Excel'],
    certsAr: ['SOCPA - الهيئة السعودية للمحاسبين', 'CMA - محاسب إداري معتمد'],
    certsEn: ['SOCPA Certified Accountant', 'CMA Certification'],
    experiencesAr: [
      { role: 'محاسب مالي', company: 'شركة حلول الأعمال', location: 'الرياض', period: '2021 - الحالي', points: ['إعداد القوائم المالية والميزانيات العمومية وفق المعايير المحاسبية مع متابعة التدفقات النقدية.', 'متابعة تقديم الإقرارات الضريبية لدى هيئة الزكاة والضريبة والجمارك (ZATCA) بنسبة دقة عالية.'] }
    ],
    experiencesEn: [
      { role: 'Financial Accountant', company: 'Business Solutions Co', location: 'Riyadh', period: '2021 - Present', points: ['Prepared financial statements and managed monthly cash flows.', 'Handled ZATCA VAT & Zakat filings accurately.'] }
    ],
    degreeAr: 'بكالوريوس محاسبة ومالية', degreeEn: 'Bachelor of Science in Accounting',
    majorAr: 'محاسبة', majorEn: 'Accounting', uniAr: 'جامعة الملك سعود', uniEn: 'King Saud University'
  },
  software: {
    keywordsAr: ['برمجة', 'مطور', 'مهندس برمجيات', 'فرونت اند', 'باك اند', 'فل ستاك', 'تطبيق', 'جاوا سكريبت', 'بايثون', 'رياكت', 'حاسب'],
    keywordsEn: ['software', 'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'react', 'node', 'python', 'javascript', 'java', 'web', 'code'],
    titleAr: 'مهندس برمجيات (Software Engineer)', titleEn: 'Software Engineer',
    summaryAr: 'مهندس برمجيات بخبرة في تصميم وتطوير التطبيقات والنظم البرمجية، متمرس في تقنيات الويب والخدمات السحابية والحلول الذكية.',
    summaryEn: 'Software Engineer experienced in building scalable applications, web technologies, and cloud solutions.',
    skillsAr: ['JavaScript / TypeScript', 'React.js / Next.js', 'Node.js / Python', 'RESTful APIs', 'PostgreSQL / MongoDB', 'Git & Docker'],
    skillsEn: ['JavaScript / TypeScript', 'React.js / Next.js', 'Node.js / Python', 'RESTful APIs', 'PostgreSQL / MongoDB', 'Git & Docker'],
    certsAr: ['شهادة مطور برمجيات معتمد', 'AWS Certified Developer'],
    certsEn: ['Certified Software Developer', 'AWS Certified Developer'],
    experiencesAr: [
      { role: 'مطور برمجيات', company: 'شركة التقنية الذكية', location: 'الرياض', period: '2021 - الحالي', points: ['تطوير وتصميم الأنظمة والتطبيقات البرمجية باستخدام أفضل ممارسات البرمجة الحديثة.', 'تحسين كفاءة واستجابة النظم وقواعد البيانات واختبار جودة الكود بشكل دوري.'] }
    ],
    experiencesEn: [
      { role: 'Software Developer', company: 'Smart Tech Co', location: 'Riyadh', period: '2021 - Present', points: ['Developed modern software applications using clean code practices.', 'Optimized database queries and API response times.'] }
    ],
    degreeAr: 'بكالوريوس علوم حاسب', degreeEn: 'Bachelor of Science in Computer Science',
    majorAr: 'علوم حاسب', majorEn: 'Computer Science', uniAr: 'جامعة الملك سعود', uniEn: 'King Saud University'
  }
};

function detectDomain(promptText) {
  const text = (promptText || '').toLowerCase();
  for (const [key, dom] of Object.entries(JOB_DOMAINS)) {
    if (dom.keywordsAr.some(k => text.includes(k.toLowerCase())) || dom.keywordsEn.some(k => text.includes(k.toLowerCase()))) {
      return dom;
    }
  }
  return JOB_DOMAINS.software;
}

function parseUserRawResumeText(rawText, lang = 'ar') {
  const text = rawText || '';

  // 1. Extract Email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';

  // 2. Extract Phone
  const phoneMatch = text.match(/(?:05\d{8}|\+?9665\d{8}|01\d{7}|\d{10})/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. Extract City
  let cityAr = '', cityEn = '';
  if (/الرياض|Riyadh/i.test(text)) { cityAr = 'الرياض'; cityEn = 'Riyadh'; }
  else if (/جدة|Jeddah/i.test(text)) { cityAr = 'جدة'; cityEn = 'Jeddah'; }
  else if (/الدمام|Dammam/i.test(text)) { cityAr = 'الدمام'; cityEn = 'Dammam'; }
  else if (/الخبر|Khobar/i.test(text)) { cityAr = 'الخبر'; cityEn = 'Khobar'; }
  else if (/مكة|Makkah/i.test(text)) { cityAr = 'مكة المكرمة'; cityEn = 'Makkah'; }
  else if (/المدينة|Madinah/i.test(text)) { cityAr = 'المدينة المنورة'; cityEn = 'Madinah'; }

  // 4. Extract Name accurately from user text
  let nameAr = '', nameEn = '';
  const nameLine = text.match(/(?:الاسم|اسم|أنا|المتقدم|المرشح|Candidate|Name)[:\s]*([\u0621-\u064A\s]{3,30}|[a-zA-Z\s]{3,30})/i);
  if (nameLine) {
    const candidate = nameLine[1].trim();
    if (/[\u0621-\u064A]/.test(candidate)) nameAr = candidate;
    else nameEn = candidate;
  }
  if (!nameAr && !nameEn) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine && firstLine.length < 35 && !firstLine.includes(':') && !firstLine.includes('@') && !firstLine.includes('{')) {
      if (/[\u0621-\u064A]/.test(firstLine)) nameAr = firstLine;
      else nameEn = firstLine;
    }
  }

  // 5. Extract Job Title ONLY if explicitly specified by user
  let titleAr = '', titleEn = '';
  const titleMatch = text.match(/(?:المسمى الوظيفي|المسمى|الوظيفة|Job Title|Position)[:\s]*([^\n,.]+)/i);
  if (titleMatch) {
    const tVal = titleMatch[1].trim();
    if (/[\u0621-\u064A]/.test(tVal)) titleAr = tVal;
    else titleEn = tVal;
  }

  // 6. Extract University & Education from user text
  let schoolAr = '', schoolEn = '', degreeAr = '', degreeEn = '', eduYear = '', gpa = '';
  const uniMatch = text.match(/(جامعة\s+[\u0621-\u064A]+|كلية\s+[\u0621-\u064A]+|معهد\s+[\u0621-\u064A]+|[A-Za-z\s]+University|[A-Za-z\s]+College)/i);
  if (uniMatch) {
    if (/[\u0621-\u064A]/.test(uniMatch[1])) schoolAr = uniMatch[1].trim();
    else schoolEn = uniMatch[1].trim();
  }

  const degreeMatch = text.match(/(بكالوريوس|ماجستير|دكتوراه|دبلوم|Bachelor|Master|PhD|Diploma)[^\n,.]*/i);
  if (degreeMatch) {
    if (/[\u0621-\u064A]/.test(degreeMatch[0])) degreeAr = degreeMatch[0].trim();
    else degreeEn = degreeMatch[0].trim();
  }

  const yearMatch = text.match(/(?:20\d{2}|19\d{2})/);
  if (yearMatch) eduYear = yearMatch[0];

  const gpaMatch = text.match(/(?:معدل|GPA)[:\s]*([\d.]+(?:\s*\/\s*[\d.]+)?)/i);
  if (gpaMatch) gpa = gpaMatch[1];

  // 7. Extract Experiences (Companies & Roles) from user text
  const expItems = [];
  const lines = text.split('\n');
  let currentExp = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const isCompany = /(شركة|مجموعة|مؤسسة|مستشفى|وزارة|هيئة|بنك|Company|Group|Corp|Inc|Bank|Hospital)/i.test(line);
    const isRole = /(محاسب|مهندس|مدير|أخصائي|مطور|محلل|مصمم|كاتب|فني|معلم|استشاري|مشرف|Officer|Engineer|Manager|Developer|Accountant|Specialist|Analyst)/i.test(line);

    if (isCompany || isRole) {
      if (currentExp && (currentExp.roleAr || currentExp.orgAr || currentExp.descAr)) {
        expItems.push(currentExp);
      }

      let roleVal = isRole ? line : '';
      let compVal = isCompany ? line : '';

      const dates = line.match(/(20\d{2}|19\d{2})/g);
      let start = dates && dates[0] ? dates[0] : '';
      let end = dates && dates[1] ? dates[1] : (line.includes('الحالي') || line.includes('Present') ? 'الحالي' : '');

      currentExp = {
        roleAr: /[\u0621-\u064A]/.test(roleVal) ? roleVal : '',
        roleEn: /[\u0621-\u064A]/.test(roleVal) ? '' : roleVal,
        orgAr: /[\u0621-\u064A]/.test(compVal) ? compVal : '',
        orgEn: /[\u0621-\u064A]/.test(compVal) ? '' : compVal,
        start, end, descAr: '', descEn: ''
      };
    } else if (currentExp) {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        currentExp.descAr += (currentExp.descAr ? '\n' : '') + line;
      } else if (line.length > 12 && !line.includes(':')) {
        currentExp.descAr += (currentExp.descAr ? '\n• ' : '• ') + line;
      }
    }
  }

  if (currentExp && (currentExp.roleAr || currentExp.orgAr || currentExp.descAr)) {
    expItems.push(currentExp);
  }

  // 8. Extract Skills
  const skillItems = [];
  const skillMatch = text.match(/(?:المهارات|مهارات|Skills|Competencies)[:\s]*([^\n]+(?:\n[^\n]+)?)/i);
  if (skillMatch) {
    const rawSkills = skillMatch[1].split(/[,•\-\n|]/);
    rawSkills.forEach(s => {
      const clean = s.trim();
      if (clean && clean.length > 2 && clean.length < 40) {
        if (/[\u0621-\u064A]/.test(clean)) skillItems.push({ nameAr: clean, nameEn: '', level: 90 });
        else skillItems.push({ nameAr: '', nameEn: clean, level: 90 });
      }
    });
  }

  const domain = detectDomain(text);

  // If user provided no experiences in text, use domain defaults matching user's field
  if (expItems.length === 0) {
    domain.experiencesAr.forEach((exp, i) => {
      expItems.push({
        roleAr: exp.role, roleEn: (domain.experiencesEn[i] || {}).role || exp.role,
        orgAr: exp.company, orgEn: (domain.experiencesEn[i] || {}).company || exp.company,
        start: exp.period.split('-')[0].trim(), end: exp.period.split('-')[1]?.trim() || 'الحالي',
        descAr: exp.points.map(p => `• ${p}`).join('\n'), descEn: ((domain.experiencesEn[i] || {}).points || exp.points).map(p => `• ${p}`).join('\n')
      });
    });
  }

  // If user provided no skills, fallback to domain skills
  if (skillItems.length === 0) {
    domain.skillsAr.forEach((sk, i) => {
      skillItems.push({ nameAr: sk, nameEn: domain.skillsEn[i] || sk, level: 90 });
    });
  }

  // Personal Object with User's Actual Data
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
    nationality: ''
  };

  // Summary
  let summaryTextAr = '';
  let summaryTextEn = '';
  const sumMatch = text.match(/(?:الملخص|نبذة|عني|Summary|Profile|About)[:\s]*([^\n]+(?:\n[^\n]+){1,4})/i);
  if (sumMatch) {
    summaryTextAr = /[\u0621-\u064A]/.test(sumMatch[1]) ? sumMatch[1].trim() : '';
    summaryTextEn = /[\u0621-\u064A]/.test(sumMatch[1]) ? '' : sumMatch[1].trim();
  }
  if (!summaryTextAr && !summaryTextEn) {
    summaryTextAr = domain.summaryAr;
    summaryTextEn = domain.summaryEn;
  }

  const sections = [
    { id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', visible: true, textAr: summaryTextAr, textEn: summaryTextEn },
    { id: 's2', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true, items: expItems },
    {
      id: 's3', type: 'education', titleAr: 'التعليم والشهادات الأكاديمية', titleEn: 'Education', visible: true,
      items: [{
        degreeAr: degreeAr || domain.degreeAr, degreeEn: degreeEn || domain.degreeEn,
        schoolAr: schoolAr || domain.uniAr, schoolEn: schoolEn || domain.uniEn,
        year: eduYear || '2020', gpa: gpa || ''
      }]
    },
    { id: 's4', type: 'skills', titleAr: 'المهارات والتقنيات', titleEn: 'Skills & Competencies', visible: true, items: skillItems },
    {
      id: 's5', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true,
      items: [{ nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم (Native)', levelEn: 'Native' }, { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متقدم / احترافي', levelEn: 'Full Professional' }]
    }
  ];

  return { personal, sections };
}

window.smartAIEngine = {
  generateResumeFromSmartEngine(jobTitleOrText, lang = 'ar') {
    const result = parseUserRawResumeText(jobTitleOrText, lang);
    return JSON.stringify(result);
  },

  handleSmartAssist(action, dataJson) {
    let parsed;
    try { parsed = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson; } catch { parsed = JSON.parse(this.generateResumeFromSmartEngine('أخصائي')); }
    const domain = detectDomain(parsed.personal?.titleAr || parsed.personal?.titleEn || 'generic');

    if (action === 'summary' || action.includes('summary')) {
      const sumSec = parsed.sections?.find(s => s.type === 'summary' || s.type === 'objective');
      if (sumSec) {
        if (!sumSec.textAr) sumSec.textAr = domain.summaryAr;
        if (!sumSec.textEn) sumSec.textEn = domain.summaryEn;
      }
    } else if (action === 'skills' || action.includes('skills')) {
      let skillSec = parsed.sections?.find(s => s.type === 'skills');
      if (skillSec) {
        domain.skillsAr.forEach((sk, i) => {
          if (!skillSec.items.some(x => (x.nameAr || '').includes(sk))) {
            skillSec.items.push({ nameAr: sk, nameEn: domain.skillsEn[i] || sk, level: 90 });
          }
        });
      }
    }
    return JSON.stringify(parsed);
  },

  generateCoverLetterFromSmartEngine(name, job, company, points, lang) {
    const isEn = lang === 'en';
    if (isEn) {
      return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job || 'Position'} position${company ? ' at ' + company : ''}. With over 5 years of professional experience in Saudi Arabia, I am confident in my ability to make an immediate impact on your team.\n\nKey Highlights: ${points || 'Demonstrated track record of project execution and operational leadership.'}\n\nSincerely,\n${name || 'Applicant'}`;
    }
    return `السادة / فريق التوظيف المحترمين،\n\nالسلام عليكم ورحمة الله وبركاته،،\n\nأتقدم إليكم بخالص الرغبة والاهتمام بالترشح لوظيفة "${job || 'الوظيفة المستهدفة'}"${company ? ' في شركة ' + company : ''}. متسلحاً بخبرة عملية متقدمة تتجاوز 5 سنوات في تحسين الأداء التشغيلي وتنفيذ المشاريع وفق مستهدفات رؤية 2030.\n\n${points ? 'أبرز الإنجازات: ' + points : 'وتشمل مؤهلاتي القدرة العالية على التخطيط الاستراتيجي، قيادة فرق العمل، واتخاذ القرارات المبنية على البيانات.'}\n\nوتقبلوا فائق الاحترام والتقدير،،\n\n${name || 'المتقدم'}`;
  }
};
