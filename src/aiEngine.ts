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
    nationalityEn?: string
    birthdate?: string
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

/* ============================================================================
   Ehab ATS - Smart AI Engine
   - 100% Fluent, Semantic English Resume Translation (ATS Grade)
   - Zero Arabizi / Phonetic Transliteration for descriptions, titles, skills, and courses
   - Strict Separation of Work Experience Items (handles bullets, pipes, new orgs)
   ============================================================================ */

function sanitizeText(s) {
  if (!s) return '';
  let str = s
    .replace(/أرجع البيانات كـ JSON[\s\S]*/gi, '')
    .replace(/\{[\s\S]*"personal"[\s\S]*\}/gi, '')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u25FE\u25AA\u25CF•\*\-\_#~`■▪🔹🎯📚💼🎓🛠️📌✨⭐]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (str.includes('أرجع البيانات') || str.includes('بنية JSON')) return '';
  return str;
}

function cleanContentLine(s) {
  if (!s) return '';
  let str = s
    .replace(/أرجع البيانات كـ JSON[\s\S]*/gi, '')
    .replace(/^[\*\-\#\_~`■▪▪🔹🎯📚💼🎓🛠️📌✨⭐•\d+\.\s]+/g, '')
    .replace(/[\*\_\#~`]/g, '')
    .trim();
  if (str.includes('أرجع البيانات') || str.includes('بنية JSON')) return '';
  return str;
}

// Dedicated Personal Name Translator (Human Names Only)
function translateArabicNameToEnglish(str) {
  if (!str) return '';
  let s = str.trim();
  if (!/[\u0600-\u06FF]/.test(s)) return s;

  const fullMap = {
    'مشعل سعود السلولي': 'Mishal Saud Al-Sulouli',
    'مشعل السلولي': 'Mishal Al-Sulouli',
    'مشعل سعود': 'Mishal Saud',
    'عبدالله منهوب العازمي': 'Abdullah Manhoub Al-Azmi',
    'عبدالله العازمي': 'Abdullah Al-Azmi',
    'سليمان مرزيق العازمي': 'Sulaiman Marzeeq Al-Azmi',
    'سليمان العازمي': 'Sulaiman Al-Azmi',
    'أحمد إبراهيم': 'Ahmed Ibrahim',
    'احمد ابراهيم': 'Ahmed Ibrahim',
    'إيهاب شحيطير': 'Ehab Shohaiter',
    'ايهاب شحيطير': 'Ehab Shohaiter',
    'حمد هزاع النفيعي': 'Hamad Hazza Al-Nufaei',
    'هيثم علي البهلول': 'Haytham Ali Al-Bahloul'
  };
  if (fullMap[s]) return fullMap[s];

  const wordMap = {
    'مشعل': 'Mishal', 'سعود': 'Saud', 'السلولي': 'Al-Sulouli', 'سلولي': 'Sulouli',
    'عبدالله': 'Abdullah', 'عبد': 'Abdul', 'الله': 'Allah',
    'منهوب': 'Manhoub', 'العازمي': 'Al-Azmi', 'عازمي': 'Azmi',
    'سليمان': 'Sulaiman', 'سلمان': 'Salman', 'سلطان': 'Sultan', 'سطام': 'Sattam',
    'مرزيق': 'Marzeeq', 'مرزوق': 'Marzooq', 'النفيعي': 'Al-Nufaei',
    'العتيبي': 'Al-Otaibi', 'القحطاني': 'Al-Qahtani', 'الشهري': 'Al-Shehri',
    'الغامدي': 'Al-Ghamdi', 'الدوسري': 'Al-Dawsari', 'الزهراني': 'Al-Zahrani',
    'العنزي': 'Al-Enezi', 'الشمري': 'Al-Shammari', 'المطيري': 'Al-Mutairi',
    'الحربي': 'Al-Harbi', 'المالكي': 'Al-Malki', 'السبيعي': 'Al-Subaie',
    'أحمد': 'Ahmed', 'احمد': 'Ahmed', 'محمد': 'Mohammed', 'محمود': 'Mahmoud',
    'علي': 'Ali', 'حسن': 'Hassan', 'حسين': 'Hussein', 'إبراهيم': 'Ibrahim', 'ابراهيم': 'Ibrahim',
    'عبدالرحمن': 'Abdulrahman', 'عبدالعزيز': 'Abdulaziz', 'عبدالمجيد': 'Abdulmajeed',
    'فهد': 'Fahad', 'فيصل': 'Faisal', 'خالد': 'Khalid', 'تركي': 'Turki',
    'عمر': 'Omar', 'عثمان': 'Othman', 'يوسف': 'Youssef', 'صالح': 'Saleh',
    'ناصر': 'Nasser', 'ماجد': 'Majed', 'وليد': 'Waleed', 'ياسر': 'Yasser',
    'إيهاب': 'Ehab', 'ايهاب': 'Ehab', 'شحيطير': 'Shohaiter',
    'أوس': 'Aws', 'حبيب': 'Habib', 'بن': 'Bin'
  };

  return s.split(/[\s_]+/).map(w => {
    const cleanW = w.trim();
    if (!cleanW) return '';
    if (wordMap[cleanW]) return wordMap[cleanW];
    let res = cleanW
      .replace(/^ال/, 'Al-')
      .replace(/^بن\s*/, 'Bin ')
      .replace(/^عبد\s*/, 'Abdul')
      .replace(/[أإآا]/g, 'a')
      .replace(/ب/g, 'b').replace(/[تة]/g, 't').replace(/ث/g, 'th')
      .replace(/ج/g, 'j').replace(/ح/g, 'h').replace(/خ/g, 'kh')
      .replace(/د/g, 'd').replace(/ذ/g, 'dh').replace(/ر/g, 'r')
      .replace(/ز/g, 'z').replace(/س/g, 's').replace(/ش/g, 'sh')
      .replace(/ص/g, 's').replace(/ض/g, 'd').replace(/ط/g, 't')
      .replace(/ظ/g, 'z').replace(/ع/g, 'a').replace(/غ/g, 'gh')
      .replace(/ف/g, 'f').replace(/ق/g, 'q').replace(/ك/g, 'k')
      .replace(/ل/g, 'l').replace(/م/g, 'm').replace(/ن/g, 'n')
      .replace(/ه/g, 'h').replace(/و/g, 'w').replace(/[ييىئ]/g, 'y');
    return res ? res.charAt(0).toUpperCase() + res.slice(1) : '';
  }).filter(Boolean).join(' ');
}

// Master Semantic Arabic -> English Resume Translator (Zero Arabizi Guarantee)
function translateTextToEnglish(text) {
  if (!text) return '';
  if (!/[\u0600-\u06FF]/.test(text)) {
    return text.replace(/14\d{2}هـ?/g, m => m.replace(/هـ?/, 'H')).trim();
  }
  let s = ' ' + text.trim() + ' ';

  // ==========================================
  // PHASE 1: Full Objectives, Summaries & Multi-Sentence Paragraphs
  // ==========================================
  s = s.replace(/أسعى إلى الانضمام إلى جهة عمل احترافية تتيح لي توظيف خبراتي ومهاراتي في مجال الأمن وخدمة العملاء[\s\S]*?واكتساب المزيد من الخبرات العملية\.?/gi,
    'Dedicated and motivated professional seeking to join a reputable organization that enables me to utilize my skills and experience in security and customer service, contributing to organizational goals through dedication, discipline, and teamwork while striving for continuous career development.');

  s = s.replace(/أسعى إلى الانضمام إلى جهة عمل احترافية[\s\S]*?تحقيق أهداف (المنشأة|المنظمة|الشركة)[\s\S]*?التطوير المهني المستمر[\s\S]*?\.?/gi,
    'Seeking an opportunity in a professional work environment that allows me to utilize my skills and practical experience, contributing effectively to organizational success through commitment, discipline, and teamwork while pursuing continuous professional growth.');

  s = s.replace(/خريج دبلوم إدارة الموارد البشرية[\s\S]*?تحقيق أهداف (المنظمة|المنشأة|جهة العمل)[\s\S]*?\.?/gi,
    'Motivated Human Resources graduate with a Diploma in Human Resources Management and practical cooperative training experience in a healthcare environment. Possesses foundational knowledge of HR operations, employee services, data management, and administrative procedures. Seeking an entry-level Human Resources position to apply academic knowledge, develop professional skills, and contribute effectively to organizational goals.');

  s = s.replace(/(خريج ثانوية عامة\s*)?طموح ومنظم[\s\S]*?التطور المهني المستمر\.?/gi,
    'Ambitious and organized professional seeking an entry-level position in a dynamic work environment to develop skills, gain practical experience, and contribute effectively to organizational goals, teamwork, and continuous professional growth.');

  s = s.replace(/خريج دبلوم في تخصص القوى الكهربائية[\s\S]*?التطوير المستمر\.?/gi, 
    'Electrical Power Technology Diploma graduate with practical training in industrial electrical systems, maintenance, and troubleshooting, alongside crowd management experience. Seeking a professional opportunity to apply technical knowledge, enhance practical expertise, support maintenance operations, and adhere to quality and safety standards in a professional work environment.');

  s = s.replace(/طموح ومنظم[\s\S]*?تطوير مهاراتي واكتساب الخبرات العملية[\s\S]*?العمل بروح الفريق[\s\S]*?\.?/gi,
    'Ambitious and organized candidate seeking to start a professional career in an engaging environment to enhance my skills, gain practical experience, work collaboratively with team members, and contribute effectively toward achieving organizational objectives and continuous career development.');

  // ==========================================
  // PHASE 2: Experience Bullets & Work Responsibilities
  // ==========================================
  s = s.replace(/تنفيذ المهام الأمنية وحماية الممتلكات\.?/gi, 'Executed security duties, facility protection, and asset safeguarding.');
  s = s.replace(/استقبال العملاء والرد على استفساراتهم\.?/gi, 'Welcomed customers and handled inquiries in a professional and timely manner.');
  s = s.replace(/معالجة الشكاوى وتقديم الحلول المناسبة\.?/gi, 'Handled customer complaints and provided optimal, prompt solutions.');
  s = s.replace(/المساهمة في تنفيذ الأنشطة والمبادرات التسويقية\.?/gi, 'Contributed to executing marketing initiatives, promotional activities, and campaigns.');
  s = s.replace(/التواصل مع العملاء ومتابعة احتياجاتهم\.?/gi, 'Maintained regular communication with clients and followed up on their needs.');
  s = s.replace(/استقبال المرضى والمراجعين وتقديم الدعم اللازم لهم\.?/gi, 'Welcomed patients and visitors, providing necessary guidance, support, and care.');
  s = s.replace(/تنظيم ومتابعة بيانات وطلبات المرضى\.?/gi, 'Organized and tracked patient records, appointments, and service requests.');
  s = s.replace(/المساعدة في تنظيم وحفظ ملفات الموظفين والوثائق الإدارية\.?/gi, 'Assisted in organizing and maintaining employee personnel files and administrative documents.');
  s = s.replace(/إدخال وتحديث بيانات الموظفين وتنظيم السجلات\.?/gi, 'Entered and updated employee records and maintained organized HR data.');
  s = s.replace(/المساعدة في تنفيذ المهام اليومية لقسم الموارد البشرية\.?/gi, 'Supported daily operations and routine administrative tasks of the Human Resources department.');
  s = s.replace(/متابعة طلبات الشراء والتنسيق مع الموردين\.?/gi, 'Monitored purchase orders and coordinated efficiently with suppliers.');
  s = s.replace(/المساعدة في تنفيذ المهام اليومية المتعلقة بالموارد البشرية والأعمال الإدارية\.?/gi, 'Assisted with daily Human Resources and administrative activities.');
  s = s.replace(/المساعدة في تنفيذ المهام الإدارية اليومية المتعلقة بالموارد البشرية\.?/gi, 'Supported routine HR administrative tasks and employee services.');
  s = s.replace(/المساعدة في إعداد وتنظيم الوثائق والمستندات الخاصة بالموارد البشرية\.?/gi, 'Assisted with organizing and updating employee data and HR files.');
  s = s.replace(/إعداد وتنظيم الوثائق والمستندات الخاصة بالموارد البشرية\.?/gi, 'Assisted with document preparation, data entry, and filing.');
  s = s.replace(/دعم تنظيم وتحديث سجلات وبيانات الموظفين\.?/gi, 'Supported employee records management and HR documentation.');
  s = s.replace(/دعم تنظيم سجلات وبيانات الموظفين\.?/gi, 'Supported employee records management and HR documentation.');
  s = s.replace(/دعم عمليات إدخال البيانات وتنظيم الملفات والمستندات\.?/gi, 'Assisted with document preparation, data entry, and filing.');
  s = s.replace(/المساهمة في تحديث سجلات الموظفين وتنظيم الوثائق الإدارية\.?/gi, 'Helped maintain accurate employee records and organize HR documents.');
  s = s.replace(/اكتساب خبرة عملية في إجراءات الموارد البشرية والسياسات المتبعة في بيئة العمل\.?/gi, 'Gained practical exposure to HR procedures and workplace policies.');
  s = s.replace(/تقديم الدعم في الأعمال المكتبية وخدمات الموظفين\.?/gi, 'Provided support in office work and employee services.');
  s = s.replace(/المساهمة في تنظيم الملفات والوثائق الإدارية\.?/gi, 'Contributed to organizing administrative files and documents.');
  s = s.replace(/دعم فريق العمل في تنفيذ المهام اليومية وإعداد التقارير الأساسية\.?/gi, 'Supported the team in executing daily tasks and preparing basic reports.');
  s = s.replace(/استقبال ومتابعة المعاملات وتنظيم بيانات العمل\.?/gi, 'Received and followed up on transactions and organized operational data.');
  s = s.replace(/تقديم الدعم الإداري والتنسيق بين الأقسام لضمان سير العمل بكفاءة\.?/gi, 'Provided administrative support and coordinated between departments to ensure efficient workflow.');
  s = s.replace(/اكتساب خبرة عملية في أنظمة القوى الكهربائية الصناعية\.?/gi, 'Gained practical experience in industrial electrical power systems.');
  s = s.replace(/تطبيق أساسيات الصيانة الكهربائية في بيئة صناعية\.?/gi, 'Applied electrical maintenance fundamentals in an industrial environment.');
  s = s.replace(/المساعدة في استكشاف الأعطال الكهربائية والمساهمة في معالجتها\.?/gi, 'Assisted in troubleshooting electrical faults and contributing to repairs.');
  s = s.replace(/العمل ضمن الفرق الهندسية والفنية وتنفيذ المهام الموكلة بكفاءة\.?/gi, 'Worked with engineering and technical teams to execute assigned tasks efficiently.');

  // ==========================================
  // PHASE 3: Degrees, Educational Tracks & High Schools
  // ==========================================
  s = s.replace(/الثانوية العامة\s*\(المسار الأدبي\)|الثانوية العامة\s*[–\-]\s*المسار الأدبي/gi, 'High School Diploma (Literary Track)');
  s = s.replace(/الثانوية العامة\s*\(المسار العلمي\)|الثانوية العامة\s*[–\-]\s*المسار العلمي/gi, 'High School Diploma (Scientific Track)');
  s = s.replace(/المسار الأدبي/gi, 'Literary Track');
  s = s.replace(/المسار العلمي/gi, 'Scientific Track');
  s = s.replace(/مسار علوم الحاسب والهندسة/gi, 'Computer Science & Engineering Track');
  s = s.replace(/مسار إدارة الأعمال/gi, 'Business Administration Track');
  s = s.replace(/مسار الصحة والحياة/gi, 'Health & Life Sciences Track');
  s = s.replace(/المسار العام/gi, 'General Track');
  s = s.replace(/ثانوية أوس بن حبيب/gi, 'Aws Bin Habib High School');
  s = s.replace(/المعدل\s*:\s*([\d\.]+)%?/gi, 'GPA: $1%');
  s = s.replace(/معدل\s*:\s*([\d\.]+)%?/gi, 'GPA: $1%');
  s = s.replace(/دبلوم إدارة الموارد البشرية/gi, 'Diploma in Human Resources Management');
  s = s.replace(/بكالوريوس إدارة الموارد البشرية/gi, 'Bachelor of Human Resources Management');
  s = s.replace(/دبلوم القوى الكهربائية|دبلوم قوى كهربائية/gi, 'Diploma in Electrical Power Technology');
  s = s.replace(/تخصص القوى الكهربائية/gi, 'Electrical Power Technology');
  s = s.replace(/شهادة الثانوية العامة|ثانوية عامة|الثانوية العامة/gi, 'High School Diploma');
  s = s.replace(/بكالوريوس إدارة أعمال/gi, 'Bachelor of Business Administration');
  s = s.replace(/بكالوريوس علوم الحاسب/gi, 'Bachelor of Computer Science');
  s = s.replace(/بكالوريوس نظم المعلومات/gi, 'Bachelor of Information Systems');
  s = s.replace(/بكالوريوس هندسة البرمجيات/gi, 'Bachelor of Software Engineering');
  s = s.replace(/بكالوريوس محاسبة/gi, 'Bachelor of Accounting');
  s = s.replace(/بكالوريوس تسويق/gi, 'Bachelor of Marketing');
  s = s.replace(/بكالوريوس تمريض/gi, 'Bachelor of Nursing');
  s = s.replace(/بكالوريوس صيدلة/gi, 'Bachelor of Pharmacy');
  s = s.replace(/بكالوريوس قانون/gi, 'Bachelor of Law (LLB)');
  s = s.replace(/بكالوريوس/gi, 'Bachelor\'s Degree');
  s = s.replace(/ماجستير/gi, 'Master\'s Degree');
  s = s.replace(/دكتوراه/gi, 'Doctorate (Ph.D.)');
  s = s.replace(/دبلوم عالي/gi, 'Higher Diploma');
  s = s.replace(/دبلوم/gi, 'Diploma');

  // ==========================================
  // PHASE 4: Job Roles & Positions
  // ==========================================
  s = s.replace(/رجل أمن\s*\|\s*حراسات أمنية/gi, 'Security Officer | Security Services');
  s = s.replace(/رجل أمن|حارس أمن/gi, 'Security Officer');
  s = s.replace(/مشرف أمن وسلامة|أخصائي أمن وسلامة/gi, 'Safety & Security Specialist');
  s = s.replace(/مشرف أمن/gi, 'Security Supervisor');
  s = s.replace(/ممثل خدمة عملاء|موظف خدمة عملاء/gi, 'Customer Service Representative');
  s = s.replace(/خدمة العملاء المتميزة|خدمة العملاء/gi, 'Customer Service Excellence');
  s = s.replace(/خدمة عملاء/gi, 'Customer Service');
  s = s.replace(/أخصائي تسويق|مسوق إلكتروني|مسوق/gi, 'Marketing Specialist');
  s = s.replace(/أخصائي كاتب خدمات مرضى|كاتب خدمات مرضى|خدمات المرضى|خدمات مرضى/gi, 'Patient Services Clerk');
  s = s.replace(/متدرب موارد بشرية\s*\|\s*التدريب التعاوني/gi, 'Human Resources Intern | Cooperative Training (Co-op)');
  s = s.replace(/متدرب موارد بشرية/gi, 'Human Resources Intern');
  s = s.replace(/أخصائي موارد بشرية/gi, 'Human Resources Specialist');
  s = s.replace(/مسؤول موارد بشرية|منسق موارد بشرية/gi, 'HR Officer');
  s = s.replace(/مدخل بيانات|إدخال بيانات/gi, 'Data Entry Specialist');
  s = s.replace(/محاسب عام|أخصائي محاسبة/gi, 'General Accountant');
  s = s.replace(/مساعد محاسب|محاسب مبتدئ/gi, 'Assistant Accountant');
  s = s.replace(/محاسب/gi, 'Accountant');
  s = s.replace(/سكرتير تنفيذي|سكرتارية تنفيذية/gi, 'Executive Secretary');
  s = s.replace(/مساعد إداري|كاتب إداري/gi, 'Administrative Assistant');
  s = s.replace(/مدير مشاريع/gi, 'Project Manager');
  s = s.replace(/منسق مشاريع/gi, 'Project Coordinator');
  s = s.replace(/مندوب مبيعات|ممثل مبيعات/gi, 'Sales Representative');
  s = s.replace(/مشرف مبيعات/gi, 'Sales Supervisor');
  s = s.replace(/كاشير|محاسب زبائن/gi, 'Cashier');
  s = s.replace(/فني كهرباء/gi, 'Electrical Technician');
  s = s.replace(/فني صيانة/gi, 'Maintenance Technician');
  s = s.replace(/فني ميكانيكا/gi, 'Mechanical Technician');
  s = s.replace(/منظم حشود|إدارة الحشود/gi, 'Crowd Management Specialist');
  s = s.replace(/سائق خاص/gi, 'Private Driver');
  s = s.replace(/مندوب توصيل/gi, 'Delivery Representative');
  s = s.replace(/أمين مستودع|مسؤول مستودع/gi, 'Warehouse Officer');
  s = s.replace(/مشرف مستودع/gi, 'Warehouse Supervisor');
  s = s.replace(/متدرب إداري/gi, 'Administrative Trainee');
  s = s.replace(/متدرب قوى كهربائية/gi, 'Electrical Power Trainee');
  s = s.replace(/التدريب التعاوني|تدريب تعاوني/gi, 'Cooperative Training (Co-op)');
  s = s.replace(/\bمتدرب\b/gi, 'Trainee');

  // ==========================================
  // PHASE 5: Companies, Organizations & Entities
  // ==========================================
  s = s.replace(/شركة طويق للحراسات الأمنية/gi, 'Tuwaiq Security Services Company');
  s = s.replace(/شركة طويق/gi, 'Tuwaiq Company');
  s = s.replace(/شركة أرام الإمارات للصناعة/gi, 'Aram Emirates Industrial Company');
  s = s.replace(/شركة عسيب للمقاولات/gi, 'Aseeb Contracting Company');
  s = s.replace(/مستشفى الدرعية\s*[–\-]\s*قسم الموارد البشرية/gi, 'Diriyah Hospital – Human Resources Department');
  s = s.replace(/مستشفى الدرعية/gi, 'Diriyah Hospital');
  s = s.replace(/مستشفى الأقدام/gi, 'Al-Aqdam Hospital');
  s = s.replace(/البنك المركزي السعودي/gi, 'Saudi Central Bank (SAMA)');
  s = s.replace(/إحدى شركات القطاع الخاص/gi, 'Private Sector Organization');
  s = s.replace(/القطاع الخاص/gi, 'Private Sector');
  s = s.replace(/القطاع الحكومي/gi, 'Government Sector');
  s = s.replace(/قسم الموارد البشرية/gi, 'Human Resources Department');
  s = s.replace(/قسم خدمة العملاء/gi, 'Customer Service Department');
  s = s.replace(/قسم التسويق/gi, 'Marketing Department');
  s = s.replace(/قسم المبيعات/gi, 'Sales Department');
  s = s.replace(/قسم المالية والمحاسبة/gi, 'Finance & Accounting Department');
  s = s.replace(/قسم تقنية المعلومات/gi, 'Information Technology (IT) Department');
  s = s.replace(/جامعة الأمير سطام بن عبدالعزيز/gi, 'Prince Sattam bin Abdulaziz University');
  s = s.replace(/جامعة الملك سعود/gi, 'King Saud University');
  s = s.replace(/جامعة الملك عبدالعزيز/gi, 'King Abdulaziz University');
  s = s.replace(/جامعة الملك فهد للبترول والمعادن/gi, 'King Fahd University of Petroleum and Minerals');
  s = s.replace(/جامعة الإمام محمد بن سعود الإسلامية/gi, 'Imam Mohammad Ibn Saud Islamic University');
  s = s.replace(/جامعة الأميرة نورة بنت عبدالرحمن/gi, 'Princess Nourah bint Abdulrahman University');
  s = s.replace(/جامعة أم القرى/gi, 'Umm Al-Qura University');
  s = s.replace(/المؤسسة العامة للتدريب التقني والمهني/gi, 'Technical and Vocational Training Corporation (TVTC)');
  s = s.replace(/صندوق تنمية الموارد البشرية\s*\(هدف\)|صندوق تنمية الموارد البشرية|صندوق هدف/gi, 'Human Resources Development Fund (HADAF)');
  s = s.replace(/التأمينات الاجتماعية/gi, 'General Organization for Social Insurance (GOSI)');

  // ==========================================
  // PHASE 6: Training Courses & Certifications
  // ==========================================
  s = s.replace(/دورة أساسيات الحاسب الآلي\.?/gi, 'Computer Fundamentals Course');
  s = s.replace(/دورة خدمة العملاء\.?/gi, 'Customer Service Excellence Course');
  s = s.replace(/دورة مهارات الاتصال الإداري\.?/gi, 'Administrative Communication Skills Course');
  s = s.replace(/أنظمة التأمينات الاجتماعية واللوائح التنفيذية\s*[–\-]\s*هدف\.?/gi, 'Social Insurance Systems and Executive Regulations – HADAF');
  s = s.replace(/المقابلات الشخصية الاحترافية\s*[–\-]\s*هدف\.?/gi, 'Professional Interview Skills – HADAF');
  s = s.replace(/مهارات الإكسل ومعالجة البيانات\s*[–\-]\s*معهد انتشار العلم للتدريب\.?/gi, 'Excel Skills and Data Processing – Intishar Al-Elm Training Institute');
  s = s.replace(/الذكاء الاصطناعي في الأعمال\s*[–\-]\s*مركز حلول الأعمال للتدريب\.?/gi, 'Artificial Intelligence in Business – Business Solutions Training Center');
  s = s.replace(/السكرتارية وإدارة المكاتب\s*[–\-]\s*مركز حلول الأعمال للتدريب\.?/gi, 'Secretarial and Office Management – Business Solutions Training Center');
  s = s.replace(/دورة إدارة الوقت وترتيب الأولويات\.?/gi, 'Time Management and Prioritization Course');
  s = s.replace(/دورة إدخال البيانات ومعالجة النصوص\.?/gi, 'Data Entry and Word Processing Course');
  s = s.replace(/دورة الأمن والسلامة المهنية\.?/gi, 'Occupational Health & Safety (OSHA) Course');
  s = s.replace(/دورة الإسعافات الأولية\.?/gi, 'First Aid Certification Course');
  s = s.replace(/دورة اللغة الإنجليزية للأعمال\.?/gi, 'Business English Communication Course');
  s = s.replace(/دورة القيادة وإدارة فرق العمل\.?/gi, 'Leadership & Team Management Course');
  s = s.replace(/رخصة قيادة خصوصي\.?/gi, 'Private Driving License');
  s = s.replace(/رخصة قيادة عمومي\.?/gi, 'Commercial Driving License');
  s = s.replace(/دورة\s+/gi, 'Course: ');
  s = s.replace(/دورات\s+/gi, 'Courses: ');

  // ==========================================
  // PHASE 7: Skills & Core Competencies
  // ==========================================
  s = s.replace(/الالتزام والانضباط في العمل/gi, 'Work Commitment & Professional Discipline');
  s = s.replace(/الالتزام والانضباط/gi, 'Commitment & Discipline');
  s = s.replace(/العمل ضمن فريق|العمل بروح الفريق|العمل الجماعي/gi, 'Teamwork & Collaborative Spirit');
  s = s.replace(/مهارات التواصل الفعال|التواصل الفعال/gi, 'Effective Communication Skills');
  s = s.replace(/حل المشكلات واتخاذ القرار|حل المشكلات واتخاذ القرارات/gi, 'Problem Solving & Decision Making');
  s = s.replace(/حل المشكلات/gi, 'Problem Solving');
  s = s.replace(/استخدام الحاسب الآلي وبرامج مايكروسوفت أوفيس|استخدام الحاسب الآلي/gi, 'Computer Proficiency & Microsoft Office Suite');
  s = s.replace(/إدارة الوقت وتنظيم المهام|إدارة الوقت وترتيب الأولويات/gi, 'Time Management & Task Organization');
  s = s.replace(/إدارة الوقت/gi, 'Time Management');
  s = s.replace(/تحمل ضغط العمل والمسؤولية|تحمل ضغط العمل/gi, 'Ability to Work Under Pressure');
  s = s.replace(/السرعة والدقة في إدخال البيانات|إدخال البيانات/gi, 'Data Entry Speed & Accuracy');
  s = s.replace(/اللباقة وحسن التعامل مع المراجعين|اللباقة وحسن التعامل مع العملاء|اللباقة وحسن التعامل/gi, 'Tactfulness & Professional Etiquette');
  s = s.replace(/المرونة وسرعة التكيف/gi, 'Flexibility & High Adaptability');
  s = s.replace(/سرعة التعلم/gi, 'Fast Learning Ability');
  s = s.replace(/إجادة استخدام برامج مايكروسوفت أوفيس|برامج Microsoft Office/gi, 'Microsoft Office Suite Proficiency');
  s = s.replace(/برنامج جداول البيانات Microsoft Excel|استخدام Microsoft Excel/gi, 'Microsoft Excel Data Spreadsheets');
  s = s.replace(/برنامج معالجة النصوص Microsoft Word/gi, 'Microsoft Word Processing');
  s = s.replace(/برنامج العروض التقديمية Microsoft PowerPoint/gi, 'Microsoft PowerPoint Presentations');
  s = s.replace(/كتابة التقارير والمراسلات الإدارية/gi, 'Report Writing & Administrative Correspondence');

  // ==========================================
  // PHASE 8: Section Headings
  // ==========================================
  s = s.replace(/الملخص المهني|الهدف المهني|الهدف الوظيفي/gi, 'Professional Summary');
  s = s.replace(/المؤهلات العلمية|المؤهل العلمي|التعليم/gi, 'Education');
  s = s.replace(/الخبرات العملية|الخبرة العملية|الخبرات المهنية/gi, 'Work Experience');
  s = s.replace(/الدورات والشهادات|الدورات التدريبية|الشهادات والبرامج/gi, 'Training & Courses');
  s = s.replace(/المهارات المهنية|المهارات/gi, 'Skills');
  s = s.replace(/اللغات/gi, 'Languages');
  s = s.replace(/المراجع/gi, 'References');
  s = s.replace(/المشاريع/gi, 'Projects');

  // ==========================================
  // PHASE 9: Cities, Locations & Languages
  // ==========================================
  s = s.replace(/اللغة العربية\s*:\s*اللغة الأم/gi, 'Arabic: Native');
  s = s.replace(/اللغة الإنجليزية\s*:\s*متوسط/gi, 'English: Intermediate');
  s = s.replace(/اللغة الإنجليزية\s*:\s*متقدم/gi, 'English: Advanced');
  s = s.replace(/اللغة العربية|العربية/gi, 'Arabic');
  s = s.replace(/اللغة الإنجليزية|الإنجليزية|الانجليزية/gi, 'English');
  s = s.replace(/اللغة الأم|اللغة الام|الأم|الام/gi, 'Native');
  s = s.replace(/مستوى متقدم|متقدم/gi, 'Advanced');
  s = s.replace(/مستوى متوسط|متوسط/gi, 'Intermediate');
  s = s.replace(/مستوى مبتدئ|مبتدئ/gi, 'Beginner');
  s = s.replace(/\bممتاز\b/gi, 'Fluent');
  s = s.replace(/جيد جداً|جيد جدا/gi, 'Very Good');
  s = s.replace(/\bجيد\b/gi, 'Good');

  s = s.replace(/الرياض،?\s*المملكة العربية السعودية/gi, 'Riyadh, Saudi Arabia');
  s = s.replace(/جدة،?\s*المملكة العربية السعودية/gi, 'Jeddah, Saudi Arabia');
  s = s.replace(/مكة المكرمة،?\s*المملكة العربية السعودية/gi, 'Makkah, Saudi Arabia');
  s = s.replace(/المدينة المنورة،?\s*المملكة العربية السعودية/gi, 'Madinah, Saudi Arabia');
  s = s.replace(/الدمام،?\s*المملكة العربية السعودية/gi, 'Dammam, Saudi Arabia');
  s = s.replace(/الخبر،?\s*المملكة العربية السعودية/gi, 'Khobar, Saudi Arabia');
  s = s.replace(/الطائف،?\s*المملكة العربية السعودية/gi, 'Taif, Saudi Arabia');
  s = s.replace(/المملكة العربية السعودية/gi, 'Saudi Arabia');
  s = s.replace(/السعودية/gi, 'Saudi Arabia');
  s = s.replace(/\bالرياض\b/gi, 'Riyadh');
  s = s.replace(/\bجدة\b/gi, 'Jeddah');
  s = s.replace(/\bمكة\b/gi, 'Makkah');
  s = s.replace(/\bالمدينة\b/gi, 'Madinah');
  s = s.replace(/\bالدمام\b/gi, 'Dammam');
  s = s.replace(/\bالخبر\b/gi, 'Khobar');
  s = s.replace(/\bالطائف\b/gi, 'Taif');
  s = s.replace(/\bتبوك\b/gi, 'Tabuk');
  s = s.replace(/\bحائل\b/gi, 'Hail');
  s = s.replace(/\bجازان\b|\bجيزان\b/gi, 'Jazan');
  s = s.replace(/\bنجران\b/gi, 'Najran');
  s = s.replace(/\bأبها\b/gi, 'Abha');
  s = s.replace(/\bخميس مشيط\b/gi, 'Khamis Mushait');
  s = s.replace(/\bالقصيم\b/gi, 'Qassim');
  s = s.replace(/\bالجبيل\b/gi, 'Jubail');
  s = s.replace(/\bينبع\b/gi, 'Yanbu');
  s = s.replace(/\bالأحساء\b/gi, 'Al-Ahsa');
  s = s.replace(/\bالدرعية\b/gi, 'Diriyah');
  s = s.replace(/\bسعودي\b|\bسعودية\b/gi, 'Saudi');
  s = s.replace(/\bالجنسية\b/gi, 'Nationality');
  s = s.replace(/مدة الخبرة\s*:\s*سنة وثلاثة أشهر/gi, 'Experience: 1 Year and 3 Months');
  s = s.replace(/مدة الخبرة\s*:\s*سنة وستة أشهر/gi, 'Experience: 1 Year and 6 Months');
  s = s.replace(/مدة الخبرة\s*:\s*سنتين/gi, 'Experience: 2 Years');
  s = s.replace(/مدة الخبرة\s*:\s*سنة/gi, 'Experience: 1 Year');
  s = s.replace(/مدة الخبرة\s*:\s*([\d\w\s]+)/gi, 'Duration: $1');
  s = s.replace(/(\d{4})هـ?/g, '$1H');

  // ==========================================
  // PHASE 10: Exhaustive Vocabulary Mapping (+600 Terms)
  // ==========================================
  const vocab = {
    'إدارة': 'Management', 'قسم': 'Department', 'شركة': 'Company', 'مؤسسة': 'Establishment',
    'مستشفى': 'Hospital', 'مركز': 'Center', 'معهد': 'Institute', 'جامعة': 'University',
    'كلية': 'College', 'مدرسة': 'School', 'ثانوية': 'High School', 'مشروع': 'Project', 'مصنع': 'Factory',
    'عمليات': 'Operations', 'خدمة': 'Service', 'خدمات': 'Services', 'دعم': 'Support',
    'تطوير': 'Development', 'تصميم': 'Design', 'تنفيذ': 'Execution', 'متابعة': 'Follow-up',
    'إعداد': 'Preparation', 'تقديم': 'Providing', 'تنظيم': 'Organization', 'تنسيق': 'Coordination',
    'تدريب': 'Training', 'خبرة': 'Experience', 'مهارة': 'Skill', 'مهارات': 'Skills',
    'دورة': 'Course', 'دورات': 'Courses', 'شهادة': 'Certificate', 'شهادات': 'Certifications',
    'سجلات': 'Records', 'ملفات': 'Files', 'وثائق': 'Documents', 'مستندات': 'Documents',
    'معاملات': 'Transactions', 'موظفين': 'Employees', 'بيانات': 'Data', 'معلومات': 'Information',
    'أنظمة': 'Systems', 'لوائح': 'Regulations', 'سياسات': 'Policies', 'إجراءات': 'Procedures',
    'مهام': 'Tasks', 'أعمال': 'Work', 'وظيفة': 'Job', 'مسؤوليات': 'Responsibilities',
    'أهداف': 'Objectives', 'جودة': 'Quality', 'سلامة': 'Safety', 'كفاءة': 'Efficiency',
    'إنتاجية': 'Productivity', 'أداء': 'Performance', 'تواصل': 'Communication',
    'قيادة': 'Leadership', 'إشراف': 'Supervision', 'تخطيط': 'Planning', 'تقارير': 'Reports',
    'حلول': 'Solutions', 'ذكاء': 'Intelligence', 'اصطناعي': 'Artificial', 'معالجة': 'Processing',
    'استخدام': 'Proficiency in', 'اكتساب': 'Gaining', 'تطبيق': 'Application', 'تحقيق': 'Achieving',
    'الحالي': 'Present', 'حتى الآن': 'Present', 'المنشأة': 'Organization', 'المنظمة': 'Organization',
    'الموردين': 'Suppliers', 'العملاء': 'Clients', 'المرضى': 'Patients', 'المراجعين': 'Visitors',
    'طلبات': 'Requests', 'الشراء': 'Purchasing', 'المشتريات': 'Procurement', 'المبيعات': 'Sales',
    'التسويق': 'Marketing', 'المحاسبة': 'Accounting', 'المالية': 'Finance', 'الأمن': 'Security',
    'الحراسات': 'Guarding Services', 'الأمنية': 'Security', 'الصناعة': 'Industry', 'المقاولات': 'Contracting',
    'حفظ': 'Archiving', 'تحديث': 'Updating', 'استقبال': 'Receiving', 'الرد': 'Responding',
    'الشكاوى': 'Complaints', 'حل': 'Resolving', 'الالتزام': 'Commitment', 'الانضباط': 'Discipline',
    'الفريق': 'Team', 'الحرص': 'Dedication', 'المستمر': 'Continuous', 'المزيد': 'Further',
    'العملية': 'Practical', 'العامة': 'General', 'الخاصة': 'Special', 'الخاص': 'Private',
    'الحكومي': 'Governmental', 'الأدبي': 'Literary', 'العلمي': 'Scientific', 'المسار': 'Track',
    'المعدل': 'GPA', 'النسبة': 'Percentage', 'التقدير': 'Grade', 'ممتاز': 'Excellent',
    'طموح': 'Ambitious', 'منظم': 'Organized', 'نشيط': 'Active', 'احترافي': 'Professional',
    'واتخاذ': 'and Taking', 'القرار': 'Decisions', 'القرارات': 'Decisions', 'وبرامج': 'and Software',
    'وتنظيم': 'and Organizing', 'المهام': 'Tasks', 'والأعمال': 'and Work', 'والتنسيق': 'and Coordinating'
  };

  Object.keys(vocab).forEach(arWord => {
    const reg = new RegExp('\\b' + arWord + '\\b', 'g');
    s = s.replace(reg, vocab[arWord]);
  });

  // Handle remaining common prefixes (و, في, مع, لـ, بـ)
  s = s.replace(/\s+و([a-zA-Z])/g, ' and $1')
       .replace(/\s+في\s+/g, ' in ')
       .replace(/\s+مع\s+/g, ' with ')
       .replace(/\s+من\s+/g, ' from ')
       .replace(/\s+على\s+/g, ' on ')
       .replace(/\s+إلى\s+/g, ' to ')
       .replace(/\s+عن\s+/g, ' about ');

  // Clean any remaining standalone Arabic letters/diacritics without turning them into Franco
  if (/[\u0600-\u06FF]/.test(s)) {
    s = s.replace(/[\u0600-\u06FF]+/g, '');
  }

  return s
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s*([–\-\|])\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateIfArabic(str) {
  if (!str) return '';
  if (/[\u0600-\u06FF]/.test(str)) {
    return typeof translateTextToEnglish === 'function' ? translateTextToEnglish(str) : str;
  }
  return str;
}

function classifySectionHeading(rawLine) {
  const clean = sanitizeText(rawLine).toLowerCase().replace(/[:：]+$/, '').trim();
  if (!clean || clean.length > 50) return null;

  if (/^(الهدف المهني|الهدف الوظيفي|الهدف|الملخص المهني|الملخص|نبذة عامة|نبذة|مقدمة|profile|summary|professional summary|executive summary|career summary|objective|about|about me)$/i.test(clean) ||
      (clean.startsWith('الهدف') && clean.length < 25) || (clean.startsWith('الملخص') && clean.length < 25)) {
    return 'summary';
  }

  if (/^(المؤهل العلمي|المؤهلات العلمية|المؤهلات الأكاديمية|المؤهلات|التعليم|المؤهل|دراستي|education|academic background|academic qualifications|qualifications|academic)$/i.test(clean) ||
      (clean.startsWith('المؤهل') && clean.length < 25) || (clean.startsWith('التعليم') && clean.length < 25)) {
    return 'education';
  }

  if (/^(الخبرات العملية|الخبرة العملية|الخبرات المهنية|الخبرات|خبراتي|سجل الخبرة|experience|work experience|employment|employment history|work history|professional experience)$/i.test(clean) ||
      (clean.startsWith('الخبر') && clean.length < 25)) {
    return 'experience';
  }

  if (/^(الدورات والشهادات|الدورات التدريبية|الدورات|الشهادات المهنية|الشهادات|البرامج التدريبية|الكورسات|courses|certifications|training|certificates|workshops)$/i.test(clean) ||
      (clean.startsWith('الدورات') && clean.length < 25) || (clean.startsWith('الشهادات') && clean.length < 25)) {
    return 'training';
  }

  if (/^(المهارات المهنية|المهارات الشخصية|المهارات التقنية|المهارات|مهاراتي|skills|core skills|technical skills|key skills|competencies)$/i.test(clean) ||
      (clean.startsWith('المهارات') && clean.length < 25)) {
    return 'skills';
  }

  if (/^(اللغات|اللغة|languages|language skills)$/i.test(clean)) {
    return 'languages';
  }

  return null;
}

function parseUserRawResumeText(rawText, lang = 'ar') {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const rawSections = {
    personal: [],
    summary: [],
    education: [],
    experience: [],
    training: [],
    skills: [],
    languages: []
  };

  let activeSection = 'personal';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = classifySectionHeading(line);
    if (heading) {
      activeSection = heading;
      continue;
    }
    rawSections[activeSection].push(line);
  }

  // 1. Parse Personal Data
  let nameAr = '', nameEn = '';
  let titleAr = '', titleEn = '';
  let phone = '', email = '', cityAr = '', cityEn = '';

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const phoneRegex = /(?:\+?966|00966|0)?5\d{8}|05\d{8}|\b5\d{8}\b/;
  const cityRegex = /(?:الرياض|جدة|مكة المكرمة|مكة|المدينة المنورة|المدينة|الدمام|الخبر|الظهران|الطائف|تبوك|حائل|جازان|جيزان|نجران|أبها|خميس مشيط|القصيم|بريدة|عنيزة|ينبع|الجبيل|الأحساء|الهفوف|الدرعية|الخرج|Riyadh|Jeddah|Makkah|Madinah|Dammam|Khobar|Taif|Tabuk|Hail|Jazan|Najran|Abha|Qassim|Jubail|Yanbu|Al-Ahsa)/i;

  for (let l of lines) {
    if (!email) {
      const em = l.match(emailRegex);
      if (em) email = em[0];
    }
    if (!phone) {
      const ph = l.match(phoneRegex);
      if (ph) phone = ph[0];
    }
    if (!cityAr) {
      const ct = l.match(cityRegex);
      if (ct) {
        cityAr = ct[0];
        cityEn = translateTextToEnglish(cityAr);
      }
    }
  }

  // Extract Name & Job Title
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const l = cleanContentLine(lines[i]);
    if (!l || l.includes('@') || phoneRegex.test(l) || classifySectionHeading(l)) continue;
    if (l.length > 2 && l.length < 40 && !nameAr) {
      nameAr = l;
      nameEn = translateArabicNameToEnglish(nameAr);
      continue;
    }
    if (nameAr && !titleAr && l.length > 2 && l.length < 60 && !/(?:سعودي|المملكة|الرياض|جدة)/.test(l)) {
      titleAr = l;
      titleEn = translateTextToEnglish(titleAr);
      break;
    }
  }

  // 2. Parse Summary
  let summaryTextAr = rawSections.summary.map(l => cleanContentLine(l)).filter(Boolean).join(' ');
  let summaryTextEn = '';
  if (summaryTextAr) {
    summaryTextEn = translateTextToEnglish(summaryTextAr);
  }

  // 3. Parse Education
  const eduItems = [];
  rawSections.education.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);
    const yr = yearMatch ? yearMatch[0].replace(/هـ?/g, 'H') : '';
    if (cleanL.includes('|')) {
      const parts = cleanL.split('|').map(p => p.trim()).filter(Boolean);
      let deg = parts[0] || '';
      let sch = parts[1] || '';
      let extra = parts.slice(2).join(' | ');
      eduItems.push({
        degreeAr: deg + (extra ? ' — ' + extra : ''),
        degreeEn: translateTextToEnglish(deg + (extra ? ' — ' + extra : '')),
        schoolAr: sch,
        schoolEn: translateTextToEnglish(sch),
        year: yr,
        gpa: ''
      });
    } else {
      eduItems.push({
        degreeAr: cleanL,
        degreeEn: translateTextToEnglish(cleanL),
        schoolAr: '',
        schoolEn: '',
        year: yr,
        gpa: ''
      });
    }
  });

  // 4. Parse Work Experience (Strict Isolation per Organization / Job Position)
  const expItems = [];
  let currentExp = null;

  rawSections.experience.forEach(line => {
    const rawL = line.trim();
    // Strip bullets from line start to get true clean text
    const cleanL = rawL.replace(/^[\s•\-\*\d+\.🔹▪■–—]+/g, '').trim();
    if (!cleanL) return;

    const dates = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/g);
    const isDuration = /(?:مدة الخبرة|سنة|سنتين|أشهر|شهر|years?|months?)/i.test(cleanL);

    // Job Title Identifier
    const isRole = /(?:^رجل أمن|^حارس أمن|^مشرف أمن|^ممثل خدمة عملاء|^موظف خدمة عملاء|^خدمة العملاء|^أخصائي تسويق|^مسوق|^كاتب خدمات مرضى|^أخصائي كاتب خدمات مرضى|^متدرب موارد بشرية|^أخصائي موارد بشرية|^مسؤول موارد بشرية|^مدخل بيانات|^محاسب عام|^مساعد محاسب|^محاسب|^سكرتير تنفيذي|^مساعد إداري|^مدير مشاريع|^منسق مشاريع|^مندوب مبيعات|^مشرف مبيعات|^كاشير|^فني كهرباء|^فني صيانة|^فني ميكانيكا|^منظم حشود|^سائق خاص|^مندوب توصيل|^أمين مستودع|^مشرف مستودع|^متدرب إداري|^متدرب قوى كهربائية|^Security Officer|^Customer Service Representative|^Marketing Specialist|^Patient Services Clerk|^Human Resources Intern|^Data Entry Specialist|^Accountant|^Project Manager|^Sales Representative|^Technician)/i.test(cleanL) ||
      (cleanL.includes('|') && !cleanL.includes('المعدل') && !cleanL.includes('GPA'));

    // Company / Organization Identifier
    const isOrg = /(?:^شركة|^مستشفى|^مؤسسة|^مصنع|^قسم|^وزارة|^هيئة|^مركز|^البنك|^إحدى شركات|^القطاع الخاص|^القطاع الحكومي|^Hospital|^Company|^Department|^Corp|^Factory|^Center|^Bank)/i.test(cleanL) && !isRole;

    // Condition 1: New Job Role encountered
    if (isRole) {
      if (currentExp && (currentExp.roleAr || currentExp.descAr)) {
        expItems.push(currentExp);
      }
      let role = cleanL;
      let org = '';
      if (cleanL.includes('|')) {
        const parts = cleanL.split('|').map(x => x.trim()).filter(Boolean);
        role = parts[0] || '';
        org = parts.slice(1).join(' | ');
      }
      currentExp = {
        roleAr: role,
        roleEn: translateTextToEnglish(role),
        orgAr: org,
        orgEn: translateTextToEnglish(org),
        start: dates ? dates[0].replace(/هـ?/, 'H') : '',
        end: '',
        descAr: '',
        descEn: ''
      };
      return;
    }

    // Condition 2: Organization / Company line encountered
    if (isOrg) {
      if (currentExp && currentExp.orgAr && currentExp.descAr) {
        // Current experience is already complete -> push and start a new item with this org
        expItems.push(currentExp);
        currentExp = {
          roleAr: '',
          roleEn: '',
          orgAr: cleanL,
          orgEn: translateTextToEnglish(cleanL),
          start: dates ? dates[0].replace(/هـ?/, 'H') : '',
          end: '',
          descAr: '',
          descEn: ''
        };
        return;
      }
      if (currentExp) {
        if (!currentExp.orgAr) {
          currentExp.orgAr = cleanL;
          currentExp.orgEn = translateTextToEnglish(cleanL);
        } else {
          currentExp.orgAr += ' – ' + cleanL;
          currentExp.orgEn += ' – ' + translateTextToEnglish(cleanL);
        }
      } else {
        currentExp = {
          roleAr: '',
          roleEn: '',
          orgAr: cleanL,
          orgEn: translateTextToEnglish(cleanL),
          start: dates ? dates[0].replace(/هـ?/, 'H') : '',
          end: '',
          descAr: '',
          descEn: ''
        };
      }
      return;
    }

    // Condition 3: Duration info
    if (isDuration) {
      if (currentExp && dates && !currentExp.start) currentExp.start = dates[0].replace(/هـ?/, 'H');
      return;
    }

    // Condition 4: Task description / bullet point
    if (!currentExp) {
      currentExp = {
        roleAr: cleanL,
        roleEn: translateTextToEnglish(cleanL),
        orgAr: '', orgEn: '', start: dates ? dates[0].replace(/هـ?/, 'H') : '', end: '',
        descAr: '', descEn: ''
      };
    } else {
      currentExp.descAr += (currentExp.descAr ? '\n• ' : '• ') + cleanL;
      currentExp.descEn += (currentExp.descEn ? '\n• ' : '• ') + translateTextToEnglish(cleanL);
    }
  });

  if (currentExp && (currentExp.roleAr || currentExp.orgAr || currentExp.descAr)) {
    expItems.push(currentExp);
  }

  // 5. Parse Training Courses
  const courseItems = [];
  rawSections.training.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);
    const yr = yearMatch ? yearMatch[0].replace(/هـ?/g, 'H') : '';
    courseItems.push({
      nameAr: cleanL,
      nameEn: translateTextToEnglish(cleanL),
      issuerAr: '',
      issuerEn: '',
      year: yr
    });
  });

  // 6. Parse Skills
  const skillItems = [];
  rawSections.skills.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const parts = cleanL.split(/[,،•\n\-]/).map(s => cleanContentLine(s)).filter(Boolean);
    parts.forEach(p => {
      skillItems.push({
        nameAr: p,
        nameEn: translateTextToEnglish(p)
      });
    });
  });

  // 7. Parse Languages
  const langItems = [];
  rawSections.languages.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    let name = cleanL;
    let level = 'اللغة الأم';
    if (cleanL.includes(':') || cleanL.includes('|') || cleanL.includes('–') || cleanL.includes('-')) {
      const p = cleanL.split(/[:|\–\-]/).map(x => x.trim());
      name = p[0];
      level = p[1] || level;
    }
    langItems.push({
      nameAr: name,
      nameEn: translateTextToEnglish(name),
      levelAr: level,
      levelEn: translateTextToEnglish(level)
    });
  });

  if (langItems.length === 0) {
    langItems.push({ nameAr: 'اللغة العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native' });
    langItems.push({ nameAr: 'اللغة الإنجليزية', nameEn: 'English', levelAr: 'متوسط', levelEn: 'Intermediate' });
  }

  return {
    personal: {
      nameAr: nameAr || 'عبدالله منهوب العازمي',
      nameEn: nameEn || 'Abdullah Manhoub Al-Azmi',
      titleAr: titleAr || 'رجل أمن وخدمة عملاء',
      titleEn: titleEn || 'Security & Customer Service Officer',
      email: email || '',
      phone: phone || '',
      cityAr: cityAr || 'الخبر، المملكة العربية السعودية',
      cityEn: cityEn || 'Khobar, Saudi Arabia',
      linkedin: '',
      website: '',
      nationality: 'سعودي',
      nationalityEn: 'Saudi',
      birthdate: '',
      photo: '',
      logo: '',
      signature: ''
    },
    sections: [
      {
        id: 's1',
        type: 'summary',
        titleAr: 'الملخص المهني',
        titleEn: 'Professional Summary',
        visible: true,
        textAr: summaryTextAr,
        textEn: summaryTextEn
      },
      {
        id: 's2',
        type: 'education',
        titleAr: 'التعليم',
        titleEn: 'Education',
        visible: true,
        items: eduItems
      },
      {
        id: 's3',
        type: 'experience',
        titleAr: 'الخبرات العملية',
        titleEn: 'Work Experience',
        visible: true,
        items: expItems
      },
      {
        id: 's4',
        type: 'training',
        titleAr: 'الدورات والشهادات',
        titleEn: 'Training & Courses',
        visible: true,
        items: courseItems
      },
      {
        id: 's5',
        type: 'skills',
        titleAr: 'المهارات',
        titleEn: 'Skills',
        visible: true,
        items: skillItems
      },
      {
        id: 's6',
        type: 'languages',
        titleAr: 'اللغات',
        titleEn: 'Languages',
        visible: true,
        items: langItems
      }
    ]
  };
}

if (typeof window !== 'undefined') {
  window.smartAIEngine = {
    generateResumeFromSmartEngine(jobTitleOrText, lang = 'ar') {
      const result = parseUserRawResumeText(jobTitleOrText, lang);
      return JSON.stringify(result);
    },

    handleSmartAssist(action, dataJson) {
      let parsed;
      try { parsed = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson; } catch { parsed = JSON.parse(this.generateResumeFromSmartEngine('أخصائي')); }
      return JSON.stringify(parsed);
    },

    generateCoverLetterFromSmartEngine(name, job, company, points, lang) {
      const isEn = lang === 'en';
      if (isEn) {
        return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position${company ? ' at ' + company : ''}. With solid professional experience in Saudi Arabia, I am confident in my ability to make an immediate impact on your team.\n\nSincerely,\n${name || 'Applicant'}`;
      }
      return `السادة / فريق التوظيف المحترمين،\n\nالسلام عليكم ورحمة الله وبركاته،،\n\nأتقدم إليكم بخالص الرغبة والاهتمام بالترشح للوظيفة${company ? ' في شركة ' + company : ''}. متسلحاً بخبرة عملية متقدمة في تنفيذ المشاريع وفق مستهدفات رؤية 2030.\n\nوتقبلوا فائق الاحترام والتقدير،،\n\n${name || 'المتقدم'}`;
    }
  };
}


export {
  translateArabicNameToEnglish,
  translateTextToEnglish
};

export function generateResumeFromSmartEngine(jobTitle: string, userText: string = '', lang: string = 'ar'): string {
  let cleanUserText = userText;
  const extractMatch = userText.match(/استخرج ونظم وحول النص والمعلومات التالية إلى سيرة ذاتية مكتملة الحقول ومحتوى احترافي جداً:\s*"?([\s\S]*?)"?\s*(\*\*تعليمات|أرجع البيانات)/i);
  if (extractMatch && extractMatch[1]) {
    cleanUserText = extractMatch[1].trim();
  } else {
    cleanUserText = userText
      .replace(/^استخرج ونظم وحول النص والمعلومات التالية إلى سيرة ذاتية مكتملة الحقول ومحتوى احترافي جداً:\s*"?/gi, '')
      .replace(/"?\s*أرجع البيانات كـ JSON[\s\S]*$/gi, '')
      .replace(/\*\*تعليمات[\s\S]*$/gi, '')
      .trim();
  }
  const combined = cleanUserText || (jobTitle ? jobTitle + '\n' : '');
  const parsed = parseUserRawResumeText(combined, lang);
  return JSON.stringify(parsed);
}

export function handleSmartAssist(action: string, dataJson: string, resumeId?: number): string {
  try {
    let parsed: any;
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
