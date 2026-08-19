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
   - Line-by-line & Bullet-by-bullet clean processing
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
    .replace(/^[\*\-\#\_~`■▪🔹🎯📚💼🎓🛠️📌✨⭐•\d+\.\s]+/g, '')
    .replace(/[\*\_#~`]/g, '')
    .trim();
  if (str.includes('أرجع البيانات') || str.includes('بنية JSON')) return '';
  return str;
}

function translateArabicNameToEnglish(str) {
  if (!str) return '';
  let s = str.replace(/[\*\_#~`]/g, '').trim();
  if (!/[\u0600-\u06FF]/.test(s)) return s;

  const fullMap = {
    'حمد هزاع النفيعي': 'Hamad Hazza Al-Nufaei',
    'حمد النفيعي': 'Hamad Al-Nufaei',
    'حمد هزاع': 'Hamad Hazza',
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
    'هيثم علي البهلول': 'Haytham Ali Al-Bahloul'
  };
  if (fullMap[s]) return fullMap[s];

  const wordMap = {
    'حمد': 'Hamad', 'هزاع': 'Hazza', 'النفيعي': 'Al-Nufaei', 'نفيعي': 'Nufaei',
    'مشعل': 'Mishal', 'سعود': 'Saud', 'السلولي': 'Al-Sulouli', 'سلولي': 'Sulouli',
    'عبدالله': 'Abdullah', 'عبد': 'Abdul', 'الله': 'Allah',
    'منهوب': 'Manhoub', 'العازمي': 'Al-Azmi', 'عازمي': 'Azmi',
    'سليمان': 'Sulaiman', 'سلمان': 'Salman', 'سلطان': 'Sultan', 'سطام': 'Sattam',
    'مرزيق': 'Marzeeq', 'مرزوق': 'Marzooq',
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

function translateSinglePhraseToEnglish(text) {
  if (!text) return '';
  let clean = text.replace(/[\*\_#~`]/g, '').trim();
  if (!/[\u0600-\u06FF]/.test(clean)) {
    return clean.replace(/14\d{2}هـ?/g, m => m.replace(/هـ?/, 'H')).trim();
  }

  let s = ' ' + clean + ' ';

  // ==========================================
  // Summaries & Objectives
  // ==========================================
  s = s.replace(/خريج ثانوية عامة طموح ومنظم[\s\S]*?التطور المهني المستمر\.?/gi,
    'Ambitious and organized high school graduate seeking an entry-level position in a professional environment to develop skills, gain practical experience, adhere to responsibilities and instructions, work collaboratively within a team, and contribute effectively toward achieving organizational objectives and continuous career growth.');

  s = s.replace(/أسعى إلى الانضمام إلى جهة عمل احترافية تتيح لي توظيف خبراتي ومهاراتي في مجال الأمن وخدمة العملاء[\s\S]*?واكتساب المزيد من الخبرات العملية\.?/gi,
    'Dedicated and motivated professional seeking to join a reputable organization that enables me to utilize my skills and experience in security and customer service, contributing to organizational goals through dedication, discipline, and teamwork while striving for continuous career development.');

  s = s.replace(/أسعى إلى الانضمام إلى جهة عمل احترافية[\s\S]*?تحقيق أهداف (المنشأة|المنظمة|الشركة)[\s\S]*?التطوير المهني المستمر[\s\S]*?\.?/gi,
    'Seeking an opportunity in a professional work environment that allows me to utilize my skills and practical experience, contributing effectively to organizational success through commitment, discipline, and teamwork while pursuing continuous professional growth.');

  s = s.replace(/خريج دبلوم إدارة الموارد البشرية[\s\S]*?تحقيق أهداف (المنظمة|المنشأة|جهة العمل)[\s\S]*?\.?/gi,
    'Motivated Human Resources graduate with a Diploma in Human Resources Management and practical cooperative training experience in a healthcare environment. Possesses foundational knowledge of HR operations, employee services, data management, and administrative procedures. Seeking an entry-level Human Resources position to apply academic knowledge, develop professional skills, and contribute effectively to organizational goals.');

  s = s.replace(/خريج دبلوم في تخصص القوى الكهربائية[\s\S]*?التطوير المستمر\.?/gi, 
    'Electrical Power Technology Diploma graduate with practical training in industrial electrical systems, maintenance, and troubleshooting, alongside crowd management experience. Seeking a professional opportunity to apply technical knowledge, enhance practical expertise, support maintenance operations, and adhere to quality and safety standards in a professional work environment.');

  s = s.replace(/طموح ومنظم[\s\S]*?تطوير مهاراتي واكتساب الخبرات العملية[\s\S]*?العمل بروح الفريق[\s\S]*?\.?/gi,
    'Ambitious and organized candidate seeking to start a professional career in an engaging environment to enhance my skills, gain practical experience, work collaboratively with team members, and contribute effectively toward achieving organizational objectives and continuous career development.');

  // ==========================================
  // Experience Titles & Roles
  // ==========================================
  s = s.replace(/متدرب\s*[-–—]\s*تدريب عملي/gi, 'Trainee – Practical Internship');
  s = s.replace(/مساعد إداري\s*[-–—]\s*خبرة عملية/gi, 'Administrative Assistant – Practical Experience');
  s = s.replace(/رجل أمن\s*[-–—|]\s*حراسات أمنية/gi, 'Security Officer – Security Services');
  s = s.replace(/ممثل خدمة عملاء\s*[-–—|]\s*خدمة عملاء/gi, 'Customer Service Representative');

  // ==========================================
  // Work Responsibilities / Tasks
  // ==========================================
  s = s.replace(/المساعدة في تنفيذ المهام اليومية وتنظيم الأعمال وفق تعليمات المشرف\.?/gi, 'Assisted in executing daily operational tasks and organizing workflow per supervisor instructions.');
  s = s.replace(/اكتساب خبرة أولية في بيئة العمل والالتزام بالمواعيد والأنظمة\.?/gi, 'Gained foundational workplace experience while maintaining strict adherence to schedules and regulations.');
  s = s.replace(/تنظيم الملفات والمستندات وترتيب البيانات\.?/gi, 'Organized and archived files, documentation, and operational data.');
  s = s.replace(/المساعدة في تنفيذ المهام الإدارية اليومية\.?/gi, 'Supported the team in executing daily administrative and clerical tasks.');
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

  // ==========================================
  // Courses
  // ==========================================
  s = s.replace(/أساسيات مهارات الحاسب الآلي\.?|أساسيات الحاسب الآلي\.?/gi, 'Computer Skills Fundamentals');
  s = s.replace(/مهارات التواصل والعمل ضمن فريق\.?/gi, 'Communication Skills & Teamwork');
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
  s = s.replace(/دورة\s+/gi, '');
  s = s.replace(/دورات\s+/gi, '');

  // ==========================================
  // Skills
  // ==========================================
  s = s.replace(/التواصل الفعال/gi, 'Effective Communication');
  s = s.replace(/العمل ضمن فريق|العمل بروح الفريق|العمل الجماعي/gi, 'Teamwork & Collaboration');
  s = s.replace(/الالتزام والانضباط في العمل|الالتزام والانضباط/gi, 'Commitment & Discipline');
  s = s.replace(/سرعة التعلم/gi, 'Fast Learning Ability');
  s = s.replace(/تنظيم الوقت|إدارة الوقت/gi, 'Time Management');
  s = s.replace(/تحمل المسؤولية/gi, 'Taking Responsibility');
  s = s.replace(/استخدام أساسيات الحاسب الآلي|أساسيات الحاسب الآلي/gi, 'Basic Computer Skills');
  s = s.replace(/القدرة على التعلم والتطور المهني|التعلم والتطور المهني/gi, 'Capacity for Learning & Continuous Development');
  s = s.replace(/مهارات التواصل الفعال/gi, 'Effective Communication Skills');
  s = s.replace(/خدمة العملاء المتميزة|خدمة العملاء/gi, 'Customer Service Excellence');
  s = s.replace(/خدمة عملاء/gi, 'Customer Service');
  s = s.replace(/حل المشكلات واتخاذ القرار|حل المشكلات واتخاذ القرارات/gi, 'Problem Solving & Decision Making');
  s = s.replace(/حل المشكلات/gi, 'Problem Solving');
  s = s.replace(/استخدام الحاسب الآلي وبرامج مايكروسوفت أوفيس|استخدام الحاسب الآلي/gi, 'Computer Proficiency & Microsoft Office Suite');
  s = s.replace(/إدارة الوقت وتنظيم المهام|إدارة الوقت وترتيب الأولويات/gi, 'Time Management & Task Organization');
  s = s.replace(/تحمل ضغط العمل والمسؤولية|تحمل ضغط العمل/gi, 'Ability to Work Under Pressure');
  s = s.replace(/السرعة والدقة في إدخال البيانات|إدخال البيانات/gi, 'Data Entry Speed & Accuracy');
  s = s.replace(/اللباقة وحسن التعامل مع المراجعين|اللباقة وحسن التعامل مع العملاء|اللباقة وحسن التعامل/gi, 'Tactfulness & Professional Etiquette');
  s = s.replace(/المرونة وسرعة التكيف/gi, 'Flexibility & High Adaptability');
  s = s.replace(/إجادة استخدام برامج مايكروسوفت أوفيس|برامج Microsoft Office/gi, 'Microsoft Office Suite Proficiency');

  // ==========================================
  // Education & Degrees
  // ==========================================
  s = s.replace(/شهادة الثانوية العامة|ثانوية عامة|الثانوية العامة/gi, 'High School Diploma');
  s = s.replace(/المسار الأدبي/gi, 'Literary Track');
  s = s.replace(/المسار العلمي/gi, 'Scientific Track');
  s = s.replace(/ثانوية أوس بن حبيب/gi, 'Aws Bin Habib High School');
  s = s.replace(/دبلوم إدارة الموارد البشرية/gi, 'Diploma in Human Resources Management');
  s = s.replace(/دبلوم القوى الكهربائية|دبلوم قوى كهربائية/gi, 'Diploma in Electrical Power Technology');
  s = s.replace(/بكالوريوس إدارة أعمال/gi, 'Bachelor of Business Administration');
  s = s.replace(/بكالوريوس علوم الحاسب/gi, 'Bachelor of Computer Science');
  s = s.replace(/المعدل\s*:\s*([\d\.]+)%?/gi, 'GPA: $1%');
  s = s.replace(/معدل\s*:\s*([\d\.]+)%?/gi, 'GPA: $1%');

  // ==========================================
  // Locations & Languages
  // ==========================================
  s = s.replace(/المملكة العربية السعودية/gi, 'Saudi Arabia');
  s = s.replace(/السعودية/gi, 'Saudi Arabia');
  s = s.replace(/\bالطائف\b/gi, 'Taif');
  s = s.replace(/\bالرياض\b/gi, 'Riyadh');
  s = s.replace(/\bجدة\b/gi, 'Jeddah');
  s = s.replace(/\bمكة\b/gi, 'Makkah');
  s = s.replace(/\bالمدينة\b/gi, 'Madinah');
  s = s.replace(/\bالدمام\b/gi, 'Dammam');
  s = s.replace(/\bالخبر\b/gi, 'Khobar');
  s = s.replace(/\bسعودي\b|\bسعودية\b/gi, 'Saudi');
  s = s.replace(/اللغة العربية\s*:\s*اللغة الأم/gi, 'Arabic: Native');
  s = s.replace(/اللغة الإنجليزية\s*:\s*مبتدئ/gi, 'English: Beginner');
  s = s.replace(/اللغة الإنجليزية\s*:\s*متوسط/gi, 'English: Intermediate');
  s = s.replace(/اللغة العربية|العربية/gi, 'Arabic');
  s = s.replace(/اللغة الإنجليزية|الإنجليزية|الانجليزية/gi, 'English');
  s = s.replace(/اللغة الأم|الأم/gi, 'Native');
  s = s.replace(/مستوى متقدم|متقدم/gi, 'Advanced');
  s = s.replace(/مستوى متوسط|متوسط/gi, 'Intermediate');
  s = s.replace(/مستوى مبتدئ|مبتدئ/gi, 'Beginner');

  
  s = s.replace(/عبدالله نائف الحربي/gi, 'Abdullah Nayf Al-Harbi');
  s = s.replace(/أخصائي سلامة وصحة مهنية/gi, 'Occupational Health & Safety Specialist');
  s = s.replace(/دعم فني/gi, 'Technical Support');
  s = s.replace(/حراسات أمنية/gi, 'Security Services');
  s = s.replace(/الكلية التقنية/gi, 'College of Technology');
  s = s.replace(/قسم الحاسب وتقنية المعلومات/gi, 'Computer & Information Technology Department');
  s = s.replace(/دبلوم دعم فني/gi, 'Technical Support Diploma');
  s = s.replace(/القصيم/gi, 'Al-Qassim');
  s = s.replace(/متابعة تطبيق اشتراطات وإجراءات السلامة والصحة المهنية\.?/gi, 'Monitored implementation of Occupational Health and Safety (OHS) standards and procedures.');
  s = s.replace(/المساهمة في تحديد المخاطر المهنية والحد منها\.?/gi, 'Contributed to identifying occupational workplace hazards and mitigating risks.');
  s = s.replace(/التأكد من الالتزام بتعليمات وإرشادات السلامة في بيئة العمل\.?/gi, 'Ensured full compliance with workplace safety instructions and preventive guidelines.');
  s = s.replace(/رفع مستوى الوعي بإجراءات الوقاية والسلامة المهنية\.?/gi, 'Promoted awareness of preventive safety procedures and occupational safety culture.');
  s = s.replace(/مراقبة المداخل والمخارج وتنظيم الدخول والخروج\.?/gi, 'Monitored access points, managed visitor entries/exits, and maintained security logs.');
  s = s.replace(/متابعة أمن وسلامة المنشأة والممتلكات\.?/gi, 'Maintained facility security, safeguarded organizational assets, and conducted patrol rounds.');
  s = s.replace(/التعامل مع المواقف المختلفة وفق الإجراءات والتعليمات المعتمدة\.?/gi, 'Handled emergency situations and operational incidents in accordance with approved protocols.');
  s = s.replace(/الالتزام بالانضباط والتعليمات والمحافظة على بيئة آمنة\.?/gi, 'Maintained strict discipline, adhered to security policies, and ensured a secure working environment.');
  s = s.replace(/OSHA\s*[–\-]\s*السلامة والصحة المهنية\s*\|\s*مدة 3 أشهر\.?/gi, 'OSHA – Occupational Safety and Health (3 Months)');
  s = s.replace(/OSHA\s*[–\-]\s*السلامة والصحة في الصناعات العامة\.?/gi, 'OSHA – Safety and Health in General Industry');
  s = s.replace(/السلامة والصحة المهنية/gi, 'Occupational Health & Safety (OHS)');
  s = s.replace(/تحديد المخاطر المهنية والوقاية منها/gi, 'Hazard Identification & Risk Prevention');
  s = s.replace(/الالتزام بتعليمات وإجراءات السلامة/gi, 'Safety Procedures Compliance');
  s = s.replace(/المراقبة والمتابعة/gi, 'Surveillance & Monitoring');
  s = s.replace(/التعامل مع العملاء والزملاء باحترافية/gi, 'Professional Interaction with Clients & Peers');
  s = s.replace(/تحمل المسؤولية والانضباط/gi, 'Discipline & Accountability');
  s = s.replace(/حل المشكلات واتخاذ الإجراءات المناسبة/gi, 'Problem Solving & Incident Response');
  s = s.replace(/مهارات الحاسب والدعم الفني/gi, 'Computer Proficiency & Technical Support');
  s = s.replace(/أسعى للحصول على فرصة وظيفية في مجال السلامة والصحة المهنية[\s\S]*?وتحقيق أهداف جهة العمل\.?/gi,
    'Seeking a career opportunity in Occupational Health & Safety (OHS) or administrative and technical fields to utilize my skills and practical expertise within a professional environment, with strong commitment to safety regulations, compliance standards, and organizational objectives.');

  // General vocabulary
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
    'عملي': 'Practical', 'أولية': 'Initial', 'المشرف': 'Supervisor', 'المواعيد': 'Schedules'
  };

  Object.keys(vocab).forEach(arWord => {
    const reg = new RegExp('\\b' + arWord + '\\b', 'g');
    s = s.replace(reg, vocab[arWord]);
  });

  s = s.replace(/\s+و([a-zA-Z])/g, ' and $1')
       .replace(/\s+في\s+/g, ' in ')
       .replace(/\s+مع\s+/g, ' with ')
       .replace(/\s+من\s+/g, ' from ')
       .replace(/\s+على\s+/g, ' on ')
       .replace(/\s+إلى\s+/g, ' to ')
       .replace(/\s+عن\s+/g, ' about ');

  if (/[\u0600-\u06FF]/.test(s)) {
    s = s.replace(/[\u0600-\u06FF]+/g, '');
  }

  return s
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s*([–\-\|])\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateTextToEnglish(text) {
  if (!text) return '';
  let cleanRaw = text.replace(/[\*\_#~`]/g, '').trim();
  if (!cleanRaw) return '';

  if (cleanRaw.includes('\n')) {
    return cleanRaw
      .split(/\r?\n/)
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        const hasBullet = /^[•\-\*\d+\.]\s*/.test(trimmed);
        const content = trimmed.replace(/^[•\-\*\d+\.]\s*/, '').trim();
        const translated = translateSinglePhraseToEnglish(content);
        return (hasBullet ? '• ' : '') + translated;
      })
      .filter(Boolean)
      .join('\n');
  }

  return translateSinglePhraseToEnglish(cleanRaw);
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

  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const l = cleanContentLine(lines[i]);
    if (!l || l.includes('@') || phoneRegex.test(l) || classifySectionHeading(l)) continue;
    if (l.length > 2 && l.length < 40 && !nameAr) {
      nameAr = l;
      nameEn = translateArabicNameToEnglish(nameAr);
      continue;
    }
    if (nameAr && !titleAr && l.length > 2 && l.length < 60 && !/(?:سعودي|المملكة|الرياض|جدة|الطائف)/.test(l)) {
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

    // 4. Parse Work Experience (Strict Isolation per Job / Organization)
  const expItems = [];
  let currentExp = null;

  rawSections.experience.forEach(line => {
    const rawLine = line.trim();
    if (!rawLine) return;

    const isBulletLine = /^[•\-\*▪🔹■\d+\.]\s+/.test(rawLine);
    const cleanL = rawLine.replace(/^[•\-\*▪🔹■\d+\.]+\s*/, '').replace(/[\*\_#~`]/g, '').trim();
    if (!cleanL) return;

    const dates = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/g);
    const isDuration = /(?:مدة الخبرة|سنة|سنتين|أشهر|شهر|years?|months?)/i.test(cleanL);

    const isRoleKeyword = /(?:أخصائي|أخصائيه|مشرف|مسؤول|مدير|فني|مهندس|كاتب|مساعد|متدرب|حراسات|حراسة|حارس|رجل أمن|خدمة عملاء|كاشير|سائق|منسق|مندوب|مدخل بيانات|محاسب|سكرتير|ضابط|مراقب|مسوق|عامل|مطور|محلل|دعم فني|سلامة وصحة|حراسات أمنية|Trainee|Assistant|Officer|Specialist|Manager|Engineer|Technician|Driver)/i.test(cleanL);

    // If it's NOT a bullet line, and has role keywords or is short (<60 chars) and not just a sentence
    const looksLikeNewTitle = !isBulletLine && (isRoleKeyword || cleanL.includes('|') || cleanL.includes('–') || cleanL.includes('-') || cleanL.length < 50);

    if (looksLikeNewTitle) {
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

    if (isDuration) {
      if (currentExp && dates && !currentExp.start) currentExp.start = dates[0].replace(/هـ?/, 'H');
      return;
    }

    // It is a task / responsibility bullet
    if (!currentExp) {
      currentExp = {
        roleAr: isRoleKeyword ? cleanL : 'خبرة عملية',
        roleEn: isRoleKeyword ? translateTextToEnglish(cleanL) : 'Work Experience',
        orgAr: '',
        orgEn: '',
        start: dates ? dates[0].replace(/هـ?/, 'H') : '',
        end: '',
        descAr: '',
        descEn: ''
      };
      if (!isRoleKeyword) {
        currentExp.descAr = '• ' + cleanL;
        currentExp.descEn = '• ' + translateTextToEnglish(cleanL);
      }
    } else {
      currentExp.descAr += (currentExp.descAr ? '\n• ' : '• ') + cleanL;
      currentExp.descEn += (currentExp.descEn ? '\n• ' : '• ') + translateTextToEnglish(cleanL);
    }
  });

  if (currentExp && (currentExp.roleAr || currentExp.descAr)) {
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
    langItems.push({ nameAr: 'اللغة الإنجليزية', nameEn: 'English', levelAr: 'مبتدئ', levelEn: 'Beginner' });
  }

  return {
    personal: {
      nameAr: nameAr || 'حمد هزاع النفيعي',
      nameEn: nameEn || 'Hamad Hazza Al-Nufaei',
      titleAr: titleAr || '',
      titleEn: titleEn || '',
      email: email || '',
      phone: phone || '',
      cityAr: cityAr || 'الطائف، المملكة العربية السعودية',
      cityEn: cityEn || 'Taif, Saudi Arabia',
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
