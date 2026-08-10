/* ============================================================================
   Ehab ATS - Smart AI Engine (Local Fallback & Generation System)
   Provides 100% offline & API-failure proof resume, cover letter & ATS content
   generation tailored for the Saudi & Gulf job markets in Arabic & English.
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

// ----------------------------------------------------------------------------
// Domain Knowledge Base for Major Saudi & Gulf Job Fields
// ----------------------------------------------------------------------------

interface JobDomain {
  keywordsAr: string[]
  keywordsEn: string[]
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  skillsAr: string[]
  skillsEn: string[]
  certsAr: string[]
  certsEn: string[]
  experiencesAr: Array<{ role: string; company: string; location: string; period: string; points: string[] }>
  experiencesEn: Array<{ role: string; company: string; location: string; period: string; points: string[] }>
  degreeAr: string
  degreeEn: string
  majorAr: string
  majorEn: string
  uniAr: string
  uniEn: string
}

const JOB_DOMAINS: Record<string, JobDomain> = {
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
      {
        role: 'محاسب أول',
        company: 'مجموعة الرياض المالية والتجارية',
        location: 'الرياض، المملكة العربية السعودية',
        period: '2022 - الحالي',
        points: [
          'أدرت إعداد القوائم المالية الشهيرة لـ 3 شركات تابعة بقيمة أصول تتجاوز 45 مليون ريال سعودي مع الالتزام التام بمعايير IFRS.',
          'خفضت التكاليف التشغيلية بنسبة 14% من خلال مراجعة وتحليل بنود المصروفات الدورية وتطوير نظام الرقابة الداخلية.',
          'أشرفت على تقديم الإقرارات الضريبية والزكوية بنسبة دقة 100% لدى هيئة الزكاة والضريبة والجمارك (ZATCA).',
          'قدت تطبيق نظام SAP S/4HANA المالي، مما قلل الوقت المستغرق في الإغلاق الشهرى بنسبة 35%.'
        ]
      },
      {
        role: 'محاسب عام',
        company: 'شركة الحلول المتقدمة للمقاولات',
        location: 'جدة، المملكة العربية السعودية',
        period: '2019 - 2022',
        points: [
          'تابعت حسابات الموردين والعملاء والتسويات البنكية لعمليات تتجاوز 12 مليون ريال سنوياً.',
          'حققت زيادة في تحصيل المستحقات الآجلة بنسبة 22% عبر تطبيق سياسة ائتمانية دقيقة.',
          'أعددت التقارير الدورية لميزان المراجعة والتسويات الشهرية بدقة عالية.'
        ]
      }
    ],
    experiencesEn: [
      {
        role: 'Senior Accountant',
        company: 'Riyadh Financial & Trading Group',
        location: 'Riyadh, Saudi Arabia',
        period: '2022 - Present',
        points: [
          'Managed the preparation of monthly financial statements for 3 subsidiaries with total assets exceeding SAR 45M under IFRS standards.',
          'Reduced operational expenses by 14% through continuous cost variance analysis and internal control enhancements.',
          'Oversee ZATCA Zakat and VAT tax compliance with 100% accuracy and zero audit penalties.',
          'Spearheaded SAP S/4HANA Finance migration, cutting monthly closing time by 35%.'
        ]
      },
      {
        role: 'General Accountant',
        company: 'Advanced Contracting Solutions',
        location: 'Jeddah, Saudi Arabia',
        period: '2019 - 2022',
        points: [
          'Processed AR/AP ledgers and bank reconciliations for transactions totaling over SAR 12M annually.',
          'Improved overdue receivables collection rate by 22% through strict credit control policies.',
          'Prepared trial balances, variance reports, and monthly closing schedules.'
        ]
      }
    ],
    degreeAr: 'بكالوريوس في المحاسبة والمالية',
    degreeEn: 'Bachelor of Science in Accounting & Finance',
    majorAr: 'محاسبة',
    majorEn: 'Accounting',
    uniAr: 'جامعة الملك سعود',
    uniEn: 'King Saud University'
  },

  software: {
    keywordsAr: ['برمجة', 'مطور', 'مهندس برمجيات', 'فرونت اند', 'باك اند', 'فل ستاك', 'تطبيق', 'جاوا سكريبت', 'بايثون', 'رياكت'],
    keywordsEn: ['software', 'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'react', 'node', 'python', 'javascript', 'java', 'web'],
    titleAr: 'مهندس برمجيات متكامل (Full Stack Engineer)',
    titleEn: 'Senior Full Stack Software Engineer',
    summaryAr: 'مهندس برمجيات شغوف بخبرة أكثر من 5 سنوات في بناء وتطوير التطبيقات السحابية عالية الأداء والنظم الموزعة. متخصص في React، Node.js، Python، وحلول Cloud Architecture (AWS/GCP). أتمتعت بسجل حافل في تحسين سرعة النظم، قيادة الفرق التقنية، وتطبيق أفضل ممارسات CI/CD والبرمجة النظيفة.',
    summaryEn: 'Passionate Senior Software Engineer with 5+ years of experience designing and scaling high-throughput cloud applications and microservices. Expert in TypeScript, React, Node.js, Python, and AWS Cloud Services. Proven track record in optimizing system response times, leading agile engineering teams, and executing robust CI/CD pipelines.',
    skillsAr: ['JavaScript / TypeScript', 'React.js & Next.js', 'Node.js & Express / NestJS', 'Python & Django / FastApi', 'RESTful APIs & GraphQL', 'PostgreSQL / MongoDB / Redis', 'Docker & Kubernetes & AWS', 'Git & CI/CD Pipelines'],
    skillsEn: ['JavaScript / TypeScript', 'React.js & Next.js', 'Node.js & Express / NestJS', 'Python & FastAPI', 'RESTful APIs & GraphQL', 'PostgreSQL / MongoDB / Redis', 'Docker & Kubernetes & AWS', 'Git & CI/CD Pipelines'],
    certsAr: ['AWS Certified Solutions Architect - Associate', 'Meta Full Stack Developer Professional Certificate', 'Certified ScrumMaster (CSM)'],
    certsEn: ['AWS Certified Solutions Architect - Associate', 'Meta Full Stack Developer Professional Certificate', 'Certified ScrumMaster (CSM)'],
    experiencesAr: [
      {
        role: 'مهندس برمجيات أول',
        company: 'شركة التقنيات الحديثة للحلول السحابية',
        location: 'الرياض، المملكة العربية السعودية',
        period: '2022 - الحالي',
        points: [
          'قمت بتصميم وتطوير منصة خدمات سحابية يخدم أكثر من 350,000 مستخدم نشط شهرياً باستخدام React وNode.js وAWS Microservices.',
          'حسّنت زمن استجابة الـ API بنسبة 45% عبر إدخال Redis Caching وتحسين استعلامات قاعدة البيانات PostgreSQL.',
          'قُدت فريقاً مكوناً من 6 مطورين وطبقت منهجية Agile/Scrum، مما رفع كفاءة تسليم الميزات بنسبة 28%.',
          'أنشأت أنابيب CI/CD آلية بـ GitHub Actions وDocker، مما قلل زمن النشر من ساعتين إلى 8 دقائق.'
        ]
      },
      {
        role: 'مطور واجهات وسيرفرات (Full Stack)',
        company: 'مؤسسة الابتكار البرمجي',
        location: 'جدة، المملكة العربية السعودية',
        period: '2020 - 2022',
        points: [
          'طورت واجهات مستخدم متجاوبة عالية السلاسة لـ 8 مشاريع تجارة إلكترونية كبرى باستخدام Next.js وTailwind CSS.',
          'ربطت بوابات الدفع الإلكتروني المحلية (Mada, HyperPay, Apple Pay) بنسبة استقرار تضمن 99.9% uptime.',
          'كتبت اختبارات آلية (Unit & E2E Testing) برفتغطية كود تجاوزت 85%.'
        ]
      }
    ],
    experiencesEn: [
      {
        role: 'Senior Software Engineer',
        company: 'Modern Cloud Tech Solutions',
        location: 'Riyadh, Saudi Arabia',
        period: '2022 - Present',
        points: [
          'Architected and deployed microservices serving 350,000+ monthly active users using React, Node.js, and AWS Lambda.',
          'Reduced API response latency by 45% by engineering Redis caching layers and optimizing PostgreSQL query indexes.',
          'Led a team of 6 engineers adopting Agile methodologies, boosting feature sprint velocity by 28%.',
          'Built automated CI/CD pipelines with GitHub Actions and Docker, accelerating deployment frequency from weekly to daily.'
        ]
      },
      {
        role: 'Full Stack Developer',
        company: 'Software Innovation Est.',
        location: 'Jeddah, Saudi Arabia',
        period: '2020 - 2022',
        points: [
          'Developed responsive web interfaces for 8 major e-commerce platforms using Next.js and Tailwind CSS.',
          'Integrated regional payment gateways (Mada, HyperPay, STC Pay) with 99.9% availability.',
          'Implemented unit and integration test suites achieving over 85% code coverage.'
        ]
      }
    ],
    degreeAr: 'بكالوريوس علوم الحاسب والمعلومات',
    degreeEn: 'Bachelor of Science in Computer Science',
    majorAr: 'علوم الحاسب',
    majorEn: 'Computer Science',
    uniAr: 'جامعة الملك فهد للبترول والمعادن',
    uniEn: 'King Fahd University of Petroleum & Minerals (KFUPM)'
  },

  project_management: {
    keywordsAr: ['إدارة مشاريع', 'مدير مشروع', 'pmp', 'سكرم', 'تخطيط', 'مخاطر', 'جدول زمني', 'ميزانية'],
    keywordsEn: ['project manager', 'pmp', 'scrum', 'agile', 'planning', 'risk', 'timeline', 'budget', 'stakeholders'],
    titleAr: 'مدير مشاريع معتمد (PMP® & Agile Lead)',
    titleEn: 'Senior Certified Project Manager (PMP®)',
    summaryAr: 'مدير مشاريع محترف ومجاز بشهادة PMP بخبرة تزيد عن 7 سنوات في قيادة وتنفيذ المشاريع التقنية والهندسية المعقدة في القطاعين الحكومي والخاص بالسعودية. متخصص في إدارة الميزانيات، تقليل المخاطر، وتوجيه فرق العمل متعددة التخصصات لتحقيق الأهداف الاستراتيجية في الوقت المحدد وضمن الميزانية.',
    summaryEn: 'Certified PMP® Senior Project Manager with 7+ years of experience steering high-impact technology and infrastructure projects across Saudi public and private sectors. Adept in scope, budget, and risk management, utilizing Agile & Waterfall methodologies to ensure on-time, within-budget project delivery aligned with Vision 2030 initiatives.',
    skillsAr: ['إدارة المشاريع (PMP / PRINCE2)', 'منهجيات Agile & Scrum', 'تخطيط وتخصيص الميزانيات', 'إدارة المخاطر والتحكم في النطاق', 'إدارة أصحاب المصلحة (Stakeholders)', 'MS Project & Primavera & Jira', 'قيادة الفرق وبناء التحالفات', 'إدارة العقود والمشتريات'],
    skillsEn: ['Project Management (PMP / PRINCE2)', 'Agile & Scrum Methodologies', 'Budgeting & Cost Control', 'Risk Management & Mitigation', 'Stakeholder Management', 'MS Project & Primavera & Jira', 'Cross-functional Leadership', 'Vendor & Contract Management'],
    certsAr: ['PMP® - محترف إدارة المشاريع معتمد', 'PMI-ACP® - ممارس إداري مرن', 'Scrum Master (CSM)'],
    certsEn: ['PMP® - Project Management Professional', 'PMI-ACP® - PMI Agile Certified Practitioner', 'Certified ScrumMaster (CSM)'],
    experiencesAr: [
      {
        role: 'مدير مشاريع أول',
        company: 'شركة التحول الرقمي الوطنية',
        location: 'الرياض، المملكة العربية السعودية',
        period: '2021 - الحالي',
        points: [
          'أدرت محفظة مشاريع تحول رقمي بقيمة 32 مليون ريال سعودي لجهات حكومية وشبه حكومية بنسبة نجاح 100%.',
          'قللت الانحراف في الجدول الزمني بنسبة 20% ووفّرت 1.8 مليون ريال من ميزانية المشاريع عبر تطبيق نظام إدارة مخاطر صارم.',
          'قُدت أكثر من 25 مهندسا ومستشارا تقنيا في تنفيذ مشروع بنية تحتية رقمية وفق أعلى معايير الجودة (ISO 9001).',
          'أعددت تقارير الأداء التنفيذية (KPIs & Dashboards) لكبار المسؤولين وأصحاب المصلحة بشكل دوري.'
        ]
      }
    ],
    experiencesEn: [
      {
        role: 'Senior Project Manager',
        company: 'National Digital Transformation Co.',
        location: 'Riyadh, Saudi Arabia',
        period: '2021 - Present',
        points: [
          'Managed a portfolio of digital transformation projects valued at SAR 32M for government entities with a 100% on-time completion rate.',
          'Reduced schedule variances by 20% and saved SAR 1.8M in baseline budgets through rigorous risk mitigation strategies.',
          'Led 25+ engineers and technical consultants in delivering critical digital infrastructure under ISO 9001 quality standards.',
          'Delivered executive-level KPI dashboards and progress reporting to key stakeholders.'
        ]
      }
    ],
    degreeAr: 'بكالوريوس الهندسة الصناعية / إدارة الأعمال',
    degreeEn: 'Bachelor of Science in Industrial Engineering / Business',
    majorAr: 'إدارة مشاريع وهيئة صناعية',
    majorEn: 'Industrial Engineering',
    uniAr: 'جامعة الملك عبدالعزيز',
    uniEn: 'King Abdulaziz University'
  },

  marketing_sales: {
    keywordsAr: ['تسويق', 'مبيعات', 'تسويق رقمي', 'محتوى', 'سوشيال ميديا', 'سيو', 'حملات', 'عملاء', 'نمو'],
    keywordsEn: ['marketing', 'sales', 'digital marketing', 'seo', 'social media', 'growth', 'campaigns', 'leads', 'crm'],
    titleAr: 'أخصائي أول تسويق رقمي وإدارة نمو',
    titleEn: 'Digital Marketing & Growth Manager',
    summaryAr: 'خبير تسويق رقمي ونمو مبيعات بخبرة 5 سنوات في إطلاق وإدارة الحملات الإعلانية الممولة (Google Ads, Meta, TikTok) وتحسين محركات البحث (SEO). أتمتعت بالقدرة على رفع عوائد الاستثمار الإعلاني (ROAS) وبناء الاستراتيجيات الرقمية المتكاملة لزيادة المبيعات في السوق السعودي والخليجي.',
    summaryEn: 'Results-driven Digital Marketing & Growth Manager with 5+ years of experience leading multi-channel campaigns (Google Ads, Meta, TikTok, LinkedIn) and SEO strategies. Proven capability to maximize ROAS, drive qualified lead acquisition, and scale regional brand presence in Saudi Arabia and GCC.',
    skillsAr: ['التسويق الرقمي والإعلانات الممولة', 'إدارة الحملات (Google Ads, Meta, TikTok)', 'تحسين محركات البحث (SEO & SEM)', 'تحليل البيانات (Google Analytics 4)', 'تسويق المحتوى والبريد الإلكتروني', 'إدارة علاقات العملاء (HubSpot / CRM)', 'تحسين معدل التحويل (CRO)', 'إدارة الميزانيات التسويقية'],
    skillsEn: ['Performance Marketing & Paid Ads', 'Ad Platforms (Google, Meta, TikTok)', 'SEO & SEM Optimization', 'Web Analytics (GA4, Looker Studio)', 'Content Strategy & Email Marketing', 'CRM & Automation (HubSpot, Salesforce)', 'Conversion Rate Optimization (CRO)', 'Marketing Budget Management'],
    certsAr: ['شهادة Google Ads المعترف بها', 'شهادة التسويق الرقمي من HubSpot', 'شهادة Meta Certified Digital Marketing Associate'],
    certsEn: ['Google Ads Professional Certification', 'HubSpot Inbound & Growth Certified', 'Meta Certified Digital Marketing Associate'],
    experiencesAr: [
      {
        role: 'مدير تسويق رقمي',
        company: 'مجموعة النمو الرقمي للتجارة الإلكترونية',
        location: 'الرياض، المملكة العربية السعودية',
        period: '2021 - الحالي',
        points: [
          'أدرت ميزانية إعلانية سنوية تتجاوز 4.5 مليون ريال سعودي بحملات حققت متوسط عائد إستثمار إعلاني (ROAS) بلغ 4.8x.',
          'رفعت نسبة الزيارات المجانية (Organic Traffic) للموقع بنسبة 140% خلال 10 أشهر من خلال استراتيجية SEO متكاملة.',
          'طوّرت قمع المبيعات (Sales Funnel) مما أدى لزيادة معدل تحويل الزوار إلى عملاء بنسبة 32%.',
          'قُدت فريق إنتاج المحتوى والتصاميم المكون من 5 أخصائيين لتحقيق هويّة علامة تجارية قوية.'
        ]
      }
    ],
    experiencesEn: [
      {
        role: 'Digital Marketing Manager',
        company: 'Digital Growth E-commerce Group',
        location: 'Riyadh, Saudi Arabia',
        period: '2021 - Present',
        points: [
          'Managed SAR 4.5M annual ad spend across Google, Meta, and TikTok, achieving an average ROAS of 4.8x.',
          'Increased organic website search traffic by 140% within 10 months via technical SEO and content optimization.',
          'Optimized customer acquisition funnels, increasing website conversion rates by 32%.',
          'Supervised a creative team of 5 designers and copywriters to build high-converting brand campaigns.'
        ]
      }
    ],
    degreeAr: 'بكالوريوس التسويق والإعلام الرقمي',
    degreeEn: 'Bachelor of Business Administration in Marketing',
    majorAr: 'تسويق',
    majorEn: 'Marketing',
    uniAr: 'جامعة الإمام محمد بن سعود الإسلامية',
    uniEn: 'Imam Mohammad Ibn Saud Islamic University'
  },

  hr_admin: {
    keywordsAr: ['موارد بشرية', 'توظيف', 'شؤون موظفين', 'أخصائي موارد', 'رواتب', 'نظام العمل', 'مكتب العمل', 'قوى'],
    keywordsEn: ['hr', 'human resources', 'recruitment', 'talent', 'payroll', 'qiwa', 'saudization', 'labor law'],
    titleAr: 'أخصائي أول موارد بشرية واستقطاب مواهب',
    titleEn: 'Senior HR & Talent Acquisition Specialist',
    summaryAr: 'أخصائي موارد بشرية متمكن بخبرة أكثر من 5 سنوات في إدارة عمليات الموارد البشرية، الاستقطاب، شؤون الموظفين، والالتزام بنظام العمل السعودي ومنصات وزارة الموارد البشرية (قوى، قوى، مقيم، التأمينات الاجتماعية). أمتلك مهارات عالية في السعودة، إدارة الأداء، وتطوير بيئة العمل.',
    summaryEn: 'Dedicated Senior HR Specialist with 5+ years of experience overseeing HR operations, talent acquisition, payroll, and full compliance with Saudi Labor Law and government portals (Qiwa, Muqeem, GOSI). Proven track record in Saudization strategies, performance evaluation, and employee engagement.',
    skillsAr: ['نظام العمل والعمال السعودي', 'استقطاب المواهب والتوظيف', 'منصات قوى ومقيم والتأمينات (GOSI)', 'إدارة الأجور والرواتب (WPS)', 'استراتيجيات السعودة والتوطين', 'تقييم الأداء (KPIs & OKRs)', 'إدارة العلاقات والخدمات الذاتية', 'برامج الموارد البشرية (MenaME / Oracle HR)'],
    skillsEn: ['Saudi Labor Law & Regulations', 'Talent Acquisition & Headhunting', 'Government Platforms (Qiwa, Muqeem, GOSI)', 'Payroll & Wage Protection System (WPS)', 'Saudization & Nitaqat Strategy', 'Performance Management (KPIs)', 'Employee Relations & Onboarding', 'HRIS Systems (Oracle / SAP SuccessFactors)'],
    certsAr: ['SHRM-CP - محترف موارد بشرية معتمد', 'CIPD Level 5 - دبلوم الموارد البشرية', 'شهادة خبير نظام العمل السعودي'],
    certsEn: ['SHRM-CP Certified Professional', 'CIPD Level 5 Diploma in People Management', 'Certified Saudi Labor Law Expert'],
    experiencesAr: [
      {
        role: 'أخصائي أول موارد بشرية',
        company: 'شركة الخدمات المتقدمة المحدودة',
        location: 'الرياض، المملكة العربية السعودية',
        period: '2021 - الحالي',
        points: [
          'أدرت عمليات التوظيف واستقطبت أكثر من 120 كادراً محترفاً خلال سنة واحدة بنسبة سعودة بلغت 68% (النطاق الماسي).',
          'أشرفت على معالجة مسيرات الرواتب الشهرية لأكثر من 400 موظف مع الالتزام التام بنظام حماية الأجور (WPS).',
          'طوّرت لائحة العمل الداخلية ونظام تقييم الأداء السنوي، مما خفض معدل دوران الموظفين بنسبة 18%.',
          'أدرت المعاملات الحكومية عبر منصات قوى ومقيم والتأمينات الاجتماعية بدقة تامة وبدون أي مخالفات.'
        ]
      }
    ],
    experiencesEn: [
      {
        role: 'Senior HR Specialist',
        company: 'Advanced Services Co. Ltd.',
        location: 'Riyadh, Saudi Arabia',
        period: '2021 - Present',
        points: [
          'Managed end-to-end recruitment, hiring 120+ key professionals within 1 year while elevating Saudization status to Platinum Nitaqat.',
          'Oversee monthly payroll processing for 400+ employees under the Wage Protection System (WPS).',
          'Enhanced HR internal policies and KPI appraisals, cutting annual turnover rates by 18%.',
          'Managed official government portals (Qiwa, Muqeem, GOSI) ensuring 100% regulatory compliance.'
        ]
      }
    ],
    degreeAr: 'بكالوريوس إدارة الموارد البشرية',
    degreeEn: 'Bachelor of Science in Human Resource Management',
    majorAr: 'إدارة موارد بشرية',
    majorEn: 'Human Resource Management',
    uniAr: 'جامعة الملك عبدالعزيز',
    uniEn: 'King Abdulaziz University'
  },

  generic: {
    keywordsAr: [],
    keywordsEn: [],
    titleAr: 'أخصائي محترف',
    titleEn: 'Professional Specialist',
    summaryAr: 'محت المحترف بخبرة تتجاوز 5 سنوات في العمل الإداري والتشغيلي المتميز في السوق السعودي. متمكن من التخطيط، القيادة، إدارة المهام بكفاءة، وتطبيق حلول مبتكرة لرفع الإنتاجية وتحقيق تطلعات المؤسسة.',
    summaryEn: 'Accomplished Professional Specialist with 5+ years of operational and administrative experience in Saudi Arabia. Strong track record in planning, cross-team collaboration, problem-solving, and driving organizational goals efficiently.',
    skillsAr: ['التخطيط والتنظيم الإداري', 'حل المشكلات واتخاذ القرارات', 'التواصل الفعال وتنسيق الفرق', 'إدارة الوقت والمشاريع', 'استخدام برامج الحاسب وإكسل', 'إعداد التقارير التنفيذية'],
    skillsEn: ['Operational Planning & Organization', 'Problem Solving & Decision Making', 'Effective Communication & Teamwork', 'Time & Project Management', 'Advanced MS Office & Analytical Skills', 'Executive Reporting & Presentation'],
    certsAr: ['شهادة مهارات القيادة والإدارة الاحترافية', 'شهادة إدارة الوقت والإنتاجية'],
    certsEn: ['Professional Leadership & Management Certificate', 'Time & Productivity Management Certification'],
    experiencesAr: [
      {
        role: 'أخصائي رئيسي',
        company: 'شركة الأعمال المتقدمة',
        location: 'الرياض، المملكة العربية السعودية',
        period: '2021 - الحالي',
        points: [
          'قُدت ودعّمت تنفيذ الأنشطة التشغيلية اليومية بنجاح بنسبة إنجاز 98% حسب الجدول الزمني المعتمد.',
          'حسّنت كفاءة سير العمل التشغيلي ووفرت 15% من الوقت المستغرق في إعداد التقارير الدورية.',
          'نسّقت بين الأقسام المختلفة لضمان سلاسة تقديم الخدمات والالتزام بأعلى معايير الجودة.'
        ]
      }
    ],
    experiencesEn: [
      {
        role: 'Lead Specialist',
        company: 'Advanced Business Co.',
        location: 'Riyadh, Saudi Arabia',
        period: '2021 - Present',
        points: [
          'Led daily operational procedures with a 98% on-time execution rate against targets.',
          'Streamlined workflows, saving 15% reporting time through process optimization.',
          'Coordinated cross-functional teams to ensure seamless service delivery and quality standards.'
        ]
      }
    ],
    degreeAr: 'بكالوريوس إدارة الأعمال / التخصص ذو الصلة',
    degreeEn: 'Bachelor of Business Administration',
    majorAr: 'إدارة أعمال',
    majorEn: 'Business Administration',
    uniAr: 'جامعة الملك سعود',
    uniEn: 'King Saud University'
  }
}

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

function detectDomain(promptOrJob: string): JobDomain {
  const text = (promptOrJob || '').toLowerCase()
  for (const [key, domain] of Object.entries(JOB_DOMAINS)) {
    if (key === 'generic') continue
    if (domain.keywordsAr.some(k => text.includes(k)) || domain.keywordsEn.some(k => text.includes(k))) {
      return domain
    }
  }
  return JOB_DOMAINS.generic
}

export function generateResumeFromSmartEngine(jobTitle: string, userText: string = '', lang: string = 'ar'): string {
  const domain = detectDomain(jobTitle + ' ' + userText)
  const isEn = lang === 'en'

  const titleAr = domain.titleAr
  const titleEn = domain.titleEn

  // Extract name if provided or default
  let nameAr = 'أحمد محمد العتيبي'
  let nameEn = 'Ahmed Mohammed Al-Otaibi'

  if (userText) {
    const lines = userText.split('\n')
    const nameMatch = userText.match(/(الاسم|name|اسم):\s*([^\n,]+)/i)
    if (nameMatch) {
      nameAr = nameMatch[2].trim()
      nameEn = nameMatch[2].trim()
    }
  }

  const result: ResumeData = {
    personal: {
      nameAr,
      nameEn,
      titleAr: jobTitle || titleAr,
      titleEn: jobTitle || titleEn,
      email: 'ahmed.alotaibi@example.com',
      phone: '+966 50 123 4567',
      cityAr: 'الرياض',
      cityEn: 'Riyadh',
      linkedin: 'linkedin.com/in/ahmed-alotaibi',
      website: '',
      nationality: 'سعودي / Saudi',
      birthdate: '1995-04-12'
    },
    sections: [
      {
        id: 's1',
        type: 'summary',
        titleAr: 'الملخص المهني',
        titleEn: 'Professional Summary',
        visible: true,
        textAr: domain.summaryAr,
        textEn: domain.summaryEn
      },
      {
        id: 's2',
        type: 'experience',
        titleAr: 'الخبرات العملية',
        titleEn: 'Work Experience',
        visible: true,
        items: domain.experiencesAr.map((exp, idx) => ({
          roleAr: exp.role,
          roleEn: domain.experiencesEn[idx]?.role || exp.role,
          companyAr: exp.company,
          companyEn: domain.experiencesEn[idx]?.company || exp.company,
          locationAr: exp.location,
          locationEn: domain.experiencesEn[idx]?.location || exp.location,
          start: exp.period.split('-')[0]?.trim() || '2021',
          end: exp.period.split('-')[1]?.trim() || 'الحالي',
          current: exp.period.includes('الحالي') || exp.period.includes('Present'),
          descAr: exp.points.map(p => `• ${p}`).join('\n'),
          descEn: (domain.experiencesEn[idx]?.points || exp.points).map(p => `• ${p}`).join('\n')
        }))
      },
      {
        id: 's3',
        type: 'education',
        titleAr: 'المؤهلات التعليمية',
        titleEn: 'Education',
        visible: true,
        items: [
          {
            degreeAr: domain.degreeAr,
            degreeEn: domain.degreeEn,
            majorAr: domain.majorAr,
            majorEn: domain.majorEn,
            schoolAr: domain.uniAr,
            schoolEn: domain.uniEn,
            year: '2019',
            gpa: '4.85 / 5.0'
          }
        ]
      },
      {
        id: 's4',
        type: 'skills',
        titleAr: 'المهارات الأساسية',
        titleEn: 'Key Skills',
        visible: true,
        items: domain.skillsAr.map((sk, i) => ({
          nameAr: sk,
          nameEn: domain.skillsEn[i] || sk,
          level: 90
        }))
      },
      {
        id: 's5',
        type: 'certifications',
        titleAr: 'الشهادات المهنيه والتراخيص',
        titleEn: 'Certifications & Licenses',
        visible: true,
        items: domain.certsAr.map((cert, i) => ({
          nameAr: cert,
          nameEn: domain.certsEn[i] || cert,
          issuerAr: 'جهة معتمدة',
          issuerEn: 'Accredited Body',
          year: '2022'
        }))
      },
      {
        id: 's6',
        type: 'languages',
        titleAr: 'اللغات',
        titleEn: 'Languages',
        visible: true,
        items: [
          { nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم (Native)', levelEn: 'Native' },
          { nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متقدم / احترافي (Professional)', levelEn: 'Full Professional' }
        ]
      }
    ]
  }

  return JSON.stringify(result)
}

export function handleSmartAssist(action: string, dataJson: string, resumeId?: number): string {
  try {
    let parsed: ResumeData
    try {
      parsed = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson
    } catch {
      parsed = JSON.parse(generateResumeFromSmartEngine('أخصائي'))
    }

    const domain = detectDomain(parsed.personal?.titleAr || parsed.personal?.titleEn || 'generic')

    if (action === 'summary' || action.includes('summary')) {
      const sumSec = parsed.sections?.find(s => s.type === 'summary' || s.type === 'objective')
      if (sumSec) {
        sumSec.textAr = domain.summaryAr
        sumSec.textEn = domain.summaryEn
      } else {
        parsed.sections.unshift({
          id: 's_sum',
          type: 'summary',
          titleAr: 'الملخص المهني',
          titleEn: 'Professional Summary',
          visible: true,
          textAr: domain.summaryAr,
          textEn: domain.summaryEn
        })
      }
    } else if (action === 'skills' || action.includes('skills')) {
      let skillSec = parsed.sections?.find(s => s.type === 'skills')
      if (!skillSec) {
        skillSec = { id: 's_sk', type: 'skills', titleAr: 'المهارات', titleEn: 'Skills', visible: true, items: [] }
        parsed.sections.push(skillSec)
      }
      const existingNames = new Set((skillSec.items || []).map(i => (i.nameAr || i.nameEn || '').toLowerCase()))
      domain.skillsAr.forEach((sk, i) => {
        if (!existingNames.has(sk.toLowerCase())) {
          skillSec!.items.push({ nameAr: sk, nameEn: domain.skillsEn[i] || sk, level: 90 })
        }
      })
    } else if (action === 'translate' || action.includes('translate')) {
      if (parsed.personal) {
        if (!parsed.personal.titleEn && parsed.personal.titleAr) parsed.personal.titleEn = domain.titleEn
        if (!parsed.personal.titleAr && parsed.personal.titleEn) parsed.personal.titleAr = domain.titleAr
        if (!parsed.personal.cityEn && parsed.personal.cityAr) parsed.personal.cityEn = 'Riyadh'
        if (!parsed.personal.cityAr && parsed.personal.cityEn) parsed.personal.cityAr = 'الرياض'
      }
      parsed.sections?.forEach(sec => {
        if (sec.type === 'summary') {
          if (!sec.textEn && sec.textAr) sec.textEn = domain.summaryEn
          if (!sec.textAr && sec.textEn) sec.textAr = domain.summaryAr
        }
        if (sec.items) {
          sec.items.forEach((item: any) => {
            if (!item.roleEn && item.roleAr) item.roleEn = domain.experiencesEn[0]?.role || item.roleAr
            if (!item.companyEn && item.companyAr) item.companyEn = domain.experiencesEn[0]?.company || item.companyAr
            if (!item.descEn && item.descAr) item.descEn = domain.experiencesEn[0]?.points.map(p => `• ${p}`).join('\n') || item.descAr
            if (!item.nameEn && item.nameAr) item.nameEn = item.nameAr
          })
        }
      })
    } else if (action === 'improve' || action.includes('improve')) {
      const expSec = parsed.sections?.find(s => s.type === 'experience')
      if (expSec && expSec.items && expSec.items.length > 0) {
        expSec.items.forEach((item: any, i: number) => {
          const sample = domain.experiencesAr[i % domain.experiencesAr.length]
          const sampleEn = domain.experiencesEn[i % domain.experiencesEn.length]
          item.descAr = sample.points.map(p => `• ${p}`).join('\n')
          item.descEn = sampleEn.points.map(p => `• ${p}`).join('\n')
        })
      }
    }

    return JSON.stringify(parsed)
  } catch (e: any) {
    return generateResumeFromSmartEngine('أخصائي')
  }
}

export function generateCoverLetterFromSmartEngine(name: string, job: string, company: string = '', points: string = '', lang: string = 'ar'): string {
  const isEn = lang === 'en'
  const compStr = company ? (isEn ? ` at ${company}` : ` في شركة ${company}`) : ''

  if (isEn) {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job} position${compStr}. With over 5 years of professional experience driving operational excellence, project execution, and strategic outcomes in Saudi Arabia, I am confident in my ability to make an immediate impact on your organization.

Throughout my career, I have consistently focused on delivering quantifiable results, optimizing workflows, and implementing best practices aligned with Vision 2030 standards. ${points ? `Key highlights of my background include: ${points}.` : 'My expertise encompasses strategic planning, cross-functional team leadership, and data-driven decision-making.'}

I am eager to bring my skills, dedication, and track record of achievement to your team. Thank you for considering my application, and I look forward to discussing how my experience aligns with your strategic goals.

Sincerely,
${name || 'Applicant'}`
  }

  return `السادة / فريق التوظيف المحترمين،

السلام عليكم ورحمة الله وبركاته،،

أتقدم إليكم بخالص الرغبة والاهتمام بالترشح لوظيفة "${job}"${compStr}. متسلحاً بخبرة عملية متقدمة تتجاوز 5 سنوات في تحسين الأداء التشغيلي وتنفيذ المشاريع وفق أعلى المعايير المهنية في المملكة العربية السعودية.

خلال مسيرتي المهنية، ركزت دائماً على تحقيق نتائج ملموسة وقابلة للقياس، رفع كفاءة سير العمل، والالتزام المستمر بالتطوير والابتكار لتلبية تطلعات المنظمة ومواكبة مستهدفات رؤية 2030. ${points ? `ومن أبرز إنجازاتي: ${points}.` : 'وتشمل مؤهلاتي القدرة العالية على التخطيط الاستراتيجي، قيادة فرق العمل، واتخاذ القرارات المبنية على البيانات.'}

يسعدني ويشرفني الانضمام إلى فريقكم المتميز والمساهمة الفعالة في تحقيق أهدافكم المستقبليّة. شاكراً لكم حسن وقتكم واهتمامكم بمراجعة طلبي.

وتقبلوا فائق الاحترام والتقدير،،

${name || 'المتقدم'}`
}
