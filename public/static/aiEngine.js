/* ============================================================================
   Ehab ATS - Smart AI Engine (Client-Side Browser Bundle)
   ============================================================================ */

const JOB_DOMAINS = {
  accounting: {
    keywordsAr: ['محاسب', 'مالي', 'تدقيق', 'ضرائب', 'حسابات', 'ميزانية', 'تكاليف', 'فواتير'],
    keywordsEn: ['accountant', 'finance', 'audit', 'tax', 'accounts', 'budget', 'cost', 'payroll'],
    titleAr: 'محاسب عام وتكاليف',
    titleEn: 'Senior General & Cost Accountant',
    summaryAr: 'محاسب مالي معتمد بخبرة أكثر من 5 سنوات في إدارة الحسابات العامة، إعداد القوائم المالية، والالتزام بمعايير الإبلاغ المالي الدولية (IFRS). متمكن من تقديم الإقرارات الضريبية (ZATCA)، إدارة التكاليف، وتحسين التدفقات النقدية مع إتقان تام لأنظمة ERP مثل SAP وOracle.',
    summaryEn: 'Certified Financial Accountant with 5+ years of experience in general ledger management, financial statement preparation, and IFRS compliance. Proficient in Saudi ZATCA tax filings, cost optimization, and cash flow management using SAP & Oracle ERP systems.',
    skillsAr: ['إعداد القوائم المالية (IFRS)', 'الاقرارات الضريبية والزكاة (ZATCA)', 'برامج SAP & ERP', 'إدارة التدفقات النقدية', 'الموازنات والتنبؤ المالي', 'التدقيق والرقابة الداخلية', 'إكسل متقدم (VLOOKUP & Pivot Tables)', 'محاسبة التكاليف'],
    skillsEn: ['Financial Statements (IFRS)', 'ZATCA Tax & Zakat Filings', 'SAP & Oracle ERP Systems', 'Cash Flow Management', 'Budgeting & Forecasting', 'Internal Auditing & Controls', 'Advanced Excel (VBA/Pivot)', 'Cost Accounting'],
    certsAr: ['SOCPA - الهيئة السعودية للمحاسبين', 'CMA - محاسب إداري معتمد', 'شهادة ضريبة القيمة المضافة (ZATCA)'],
    certsEn: ['SOCPA Certified Accountant', 'CMA (Certified Management Accountant)', 'VAT & Zakat Specialist Certification'],
    experiencesAr: [
      { role: 'محاسب أول', company: 'مجموعة الرياض المالية والتجارية', location: 'الرياض، المملكة العربية السعودية', period: '2022 - الحالي', points: ['أدرت إعداد القوائم المالية الشهيرة لـ 3 شركات تابعة بقيمة أصول تتجاوز 45 مليون ريال سعودي مع الالتزام التام بمعايير IFRS.', 'خفضت التكاليف التشغيلية بنسبة 14% من خلال مراجعة وتحليل بنود المصروفات الدورية وتطوير نظام الرقابة الداخلية.', 'أشرفت على تقديم الإقرارات الضريبية والزكوية بنسبة دقة 100% لدى هيئة الزكاة والضريبة والجمارك (ZATCA).', 'قدت تطبيق نظام SAP S/4HANA المالي، مما قلل الوقت المستغرق في الإغلاق الشهرى بنسبة 35%.'] },
      { role: 'محاسب عام', company: 'شركة الحلول المتقدمة للمقاولات', location: 'جدة، المملكة العربية السعودية', period: '2019 - 2022', points: ['تابعت حسابات الموردين والعملاء والتسويات البنكية لعمليات تتجاوز 12 مليون ريال سنوياً.', 'حققت زيادة في تحصيل المستحقات الآجلة بنسبة 22% عبر تطبيق سياسة ائتمانية دقيقة.', 'أعددت التقارير الدورية لميزان المراجعة والتسويات الشهرية بدقة عالية.'] }
    ],
    experiencesEn: [
      { role: 'Senior Accountant', company: 'Riyadh Financial Group', location: 'Riyadh, Saudi Arabia', period: '2022 - Present', points: ['Managed financial statements for 3 subsidiaries with SAR 45M+ assets under IFRS.', 'Reduced operating expenses by 14% through audit controls.', 'Ensured 100% ZATCA tax compliance.'] }
    ],
    degreeAr: 'بكالوريوس في المحاسبة والمالية', degreeEn: 'Bachelor of Science in Accounting & Finance',
    majorAr: 'محاسبة', majorEn: 'Accounting', uniAr: 'جامعة الملك سعود', uniEn: 'King Saud University'
  },
  software: {
    keywordsAr: ['برمجة', 'مطور', 'مهندس برمجيات', 'فرونت اند', 'باك اند', 'فل ستاك', 'تطبيق', 'جاوا سكريبت', 'بايثون', 'رياكت'],
    keywordsEn: ['software', 'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'react', 'node', 'python', 'javascript', 'java', 'web'],
    titleAr: 'مهندس برمجيات متكامل (Full Stack Engineer)', titleEn: 'Senior Full Stack Software Engineer',
    summaryAr: 'مهندس برمجيات شغوف بخبرة أكثر من 5 سنوات في بناء وتطوير التطبيقات السحابية عالية الأداء والنظم الموزعة. متخصص في React، Node.js، Python، وحلول Cloud Architecture (AWS/GCP). أتمتعت بسجل حافل في تحسين سرعة النظم، قيادة الفرق التقنية، وتطبيق أفضل ممارسات CI/CD والبرمجة النظيفة.',
    summaryEn: 'Passionate Senior Software Engineer with 5+ years of experience designing and scaling high-throughput cloud applications and microservices. Expert in TypeScript, React, Node.js, Python, and AWS Cloud Services.',
    skillsAr: ['JavaScript / TypeScript', 'React.js & Next.js', 'Node.js & Express / NestJS', 'Python & FastAPI', 'RESTful APIs & GraphQL', 'PostgreSQL / MongoDB / Redis', 'Docker & Kubernetes & AWS', 'Git & CI/CD Pipelines'],
    skillsEn: ['JavaScript / TypeScript', 'React.js & Next.js', 'Node.js & Express', 'Python & FastAPI', 'RESTful APIs & GraphQL', 'PostgreSQL / MongoDB / Redis', 'Docker & Kubernetes & AWS', 'Git & CI/CD Pipelines'],
    certsAr: ['AWS Certified Solutions Architect - Associate', 'Meta Full Stack Developer Certificate', 'Certified ScrumMaster (CSM)'],
    certsEn: ['AWS Certified Solutions Architect - Associate', 'Meta Full Stack Developer Certificate', 'Certified ScrumMaster (CSM)'],
    experiencesAr: [
      { role: 'مهندس برمجيات أول', company: 'شركة التقنيات الحديثة للحلول السحابية', location: 'الرياض، المملكة العربية السعودية', period: '2022 - الحالي', points: ['قمت بتصميم وتطوير منصة خدمات سحابية يخدم أكثر من 350,000 مستخدم نشط شهرياً باستخدام React وNode.js وAWS Microservices.', 'حسّنت سرعة تحميل الاستجابات (LCP & INP) بنسبة 45% من خلال تحسين استعلامات SQL وتفعيل Redis Caching Layer.', 'قُدت فريقاً هندسياً مكوناً من 6 مطورين وطبّقت منهجية Agile/Scrum وحققت زيادة في التوصيل بنسبة 28%.'] }
    ],
    experiencesEn: [
      { role: 'Senior Software Engineer', company: 'Cloud Solutions Tech', location: 'Riyadh, Saudi Arabia', period: '2022 - Present', points: ['Designed scalable microservices serving 350K+ monthly active users using React, Node.js, and AWS.', 'Optimized database queries and Redis caching, cutting API response latency by 45%.'] }
    ],
    degreeAr: 'بكالوريوس في علوم الحاسب والمعلومات', degreeEn: 'Bachelor of Science in Computer Science',
    majorAr: 'علوم حاسب', majorEn: 'Computer Science', uniAr: 'جامعة الملك فهد للبترول والمعادن', uniEn: 'KFUPM'
  }
};

function detectDomain(promptText) {
  const text = (promptText || '').toLowerCase();
  for (const [key, dom] of Object.entries(JOB_DOMAINS)) {
    if (dom.keywordsAr.some(k => text.includes(k.toLowerCase())) || dom.keywordsEn.some(k => text.includes(k.toLowerCase()))) {
      return dom;
    }
  }
  return JOB_DOMAINS.software; // Default fallback domain
}

function extractDetailsFromText(rawText) {
  const t = rawText || '';
  let nameAr = '', nameEn = '', titleAr = '', titleEn = '', email = '', phone = '', cityAr = 'الرياض', cityEn = 'Riyadh';

  const emailMatch = t.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  if (emailMatch) email = emailMatch[1];

  const phoneMatch = t.match(/(05\d{8}|\+966\d{9}|\d{10})/);
  if (phoneMatch) phone = phoneMatch[1];

  const nameMatch = t.match(/(?:أنا|الاسم|اسم|Candidate|Name)?[:\s]*([\u0621-\u064A]{3,}(?:\s+[\u0621-\u064A]{3,}){1,3})/i);
  if (nameMatch) nameAr = nameMatch[1];

  if (t.includes('جدة')) { cityAr = 'جدة'; cityEn = 'Jeddah'; }
  if (t.includes('الدمام') || t.includes('الخبر')) { cityAr = 'الدمام'; cityEn = 'Dammam'; }

  const domain = detectDomain(t);
  titleAr = domain.titleAr;
  titleEn = domain.titleEn;

  return { nameAr: nameAr || 'عبدالله محمد السالم', nameEn: nameEn || 'Abdullah Al-Salem', titleAr, titleEn, email: email || 'abdullah@example.com', phone: phone || '0501234567', cityAr, cityEn };
}

window.smartAIEngine = {
  generateResumeFromSmartEngine(jobTitle, lang = 'ar') {
    const domain = detectDomain(jobTitle);
    const parsedDetails = extractDetailsFromText(jobTitle);

    const result = {
      personal: {
        nameAr: parsedDetails.nameAr,
        nameEn: parsedDetails.nameEn,
        titleAr: domain.titleAr,
        titleEn: domain.titleEn,
        email: parsedDetails.email,
        phone: parsedDetails.phone,
        cityAr: parsedDetails.cityAr,
        cityEn: parsedDetails.cityEn,
        linkedin: 'linkedin.com/in/profile',
        website: 'github.com/profile',
        nationality: 'سعودي / Saudi'
      },
      sections: [
        { id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', visible: true, textAr: domain.summaryAr, textEn: domain.summaryEn },
        {
          id: 's2', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true,
          items: domain.experiencesAr.map((exp, i) => ({
            roleAr: exp.role, roleEn: (domain.experiencesEn[i] || {}).role || exp.role,
            orgAr: exp.company, orgEn: (domain.experiencesEn[i] || {}).company || exp.company,
            start: exp.period.split('-')[0].trim(), end: exp.period.split('-')[1]?.trim() || 'الحالي',
            descAr: exp.points.map(p => `• ${p}`).join('\n'), descEn: ((domain.experiencesEn[i] || {}).points || exp.points).map(p => `• ${p}`).join('\n')
          }))
        },
        {
          id: 's3', type: 'education', titleAr: 'التعليم والشهادات الأكاديمية', titleEn: 'Education', visible: true,
          items: [{ degreeAr: domain.degreeAr, degreeEn: domain.degreeEn, schoolAr: domain.uniAr, schoolEn: domain.uniEn, year: '2020', gpa: '4.85 / 5.00' }]
        },
        {
          id: 's4', type: 'skills', titleAr: 'المهارات والتقنيات', titleEn: 'Skills & Competencies', visible: true,
          items: domain.skillsAr.map((sk, i) => ({ nameAr: sk, nameEn: domain.skillsEn[i] || sk, level: 90 }))
        },
        {
          id: 's5', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true,
          items: [{ nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم (Native)', levelEn: 'Native' }, { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متقدم / احترافي', levelEn: 'Full Professional' }]
        }
      ]
    };
    return JSON.stringify(result);
  },

  handleSmartAssist(action, dataJson) {
    let parsed;
    try { parsed = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson; } catch { parsed = JSON.parse(this.generateResumeFromSmartEngine('أخصائي')); }
    const domain = detectDomain(parsed.personal?.titleAr || parsed.personal?.titleEn || 'generic');

    if (action === 'summary' || action.includes('summary')) {
      const sumSec = parsed.sections?.find(s => s.type === 'summary' || s.type === 'objective');
      if (sumSec) { sumSec.textAr = domain.summaryAr; sumSec.textEn = domain.summaryEn; }
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
      return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job} position. With over 5 years of professional experience in Saudi Arabia, I am confident in my ability to make an immediate impact.\n\nSincerely,\n${name || 'Applicant'}`;
    }
    return `السادة / فريق التوظيف المحترمين،\n\nالسلام عليكم ورحمة الله وبركاته،،\n\nأتقدم إليكم بخالص الرغبة بالترشح لوظيفة "${job}". متسلحاً بخبرة عملية متقدمة تتجاوز 5 سنوات في تحسين الأداء التشغيلي وتنفيذ المشاريع وفق رؤية 2030.\n\nوتقبلوا فائق الاحترام،،\n\n${name || 'المتقدم'}`;
  }
};
