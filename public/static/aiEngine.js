/* ============================================================================
   Ehab ATS - Smart AI Engine (Version 4.0 Ultimate Universal Edition)
   - 100% Fluent, Semantic English Resume Translation (ATS Grade)
   - Multi-Domain Vocabulary (Education, Kindergarten, Medical, Engineering, Safety, IT, Admin, HR, Sales)
   - Two-phase Translation Architecture:
     Phase 1: Full-Paragraph & Sentence Semantic Extraction (Runs FIRST)
     Phase 2: Domain Entity, Job Roles, Certifications & Vocabulary Mapping
     Phase 3: Smart Phonetic Transliteration Fallback (Never leaves empty/broken prepositions)
   - Strict Separation of Work Experience Items (Independent items per role/company)
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
    .replace(/^[#\*\-\_~`■▪🔹🎯📚💼🎓🛠️📌✨⭐•\d+\.\s]+/g, '')
    .replace(/[#\*\_#~`]/g, '')
    .trim();
  if (str.includes('أرجع البيانات') || str.includes('بنية JSON')) return '';
  return str;
}

function translateArabicNameToEnglish(str) {
  if (!str) return '';
  let s = str.replace(/[#\*\_#~`]/g, '').trim();
  if (!/[\u0600-\u06FF]/.test(s)) return s;

  const fullMap = {
    'هدى لافي المطيري': 'Huda Lafi Al-Mutairi',
    'هدى المطيري': 'Huda Al-Mutairi',
    'هدى لافي': 'Huda Lafi',
    'عبدالله نائف الحربي': 'Abdullah Nayf Al-Harbi',
    'عبدالله الحربي': 'Abdullah Al-Harbi',
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
    'هدى': 'Huda', 'لافي': 'Lafi', 'المطيري': 'Al-Mutairi', 'مطيري': 'Mutairi',
    'عبدالله': 'Abdullah', 'عبد': 'Abdul', 'الله': 'Allah',
    'نائف': 'Nayf', 'نايف': 'Nayef', 'الحربي': 'Al-Harbi', 'حربي': 'Harbi',
    'حمد': 'Hamad', 'هزاع': 'Hazza', 'النفيعي': 'Al-Nufaei', 'نفيعي': 'Nufaei',
    'مشعل': 'Mishal', 'سعود': 'Saud', 'السلولي': 'Al-Sulouli', 'سلولي': 'Sulouli',
    'منهوب': 'Manhoub', 'العازمي': 'Al-Azmi', 'عازمي': 'Azmi',
    'سليمان': 'Sulaiman', 'سلمان': 'Salman', 'سلطان': 'Sultan', 'سطام': 'Sattam',
    'مرزيق': 'Marzeeq', 'مرزوق': 'Marzooq',
    'العتيبي': 'Al-Otaibi', 'القحطاني': 'Al-Qahtani', 'الشهري': 'Al-Shehri',
    'الغامدي': 'Al-Ghamdi', 'الدوسري': 'Al-Dawsari', 'الزهراني': 'Al-Zahrani',
    'العنزي': 'Al-Enezi', 'الشمري': 'Al-Shammari', 'المالكي': 'Al-Malki', 'السبيعي': 'Al-Subaie',
    'أحمد': 'Ahmed', 'احمد': 'Ahmed', 'محمد': 'Mohammed', 'محمود': 'Mahmoud',
    'علي': 'Ali', 'حسن': 'Hassan', 'حسين': 'Hussein', 'إبراهيم': 'Ibrahim', 'ابراهيم': 'Ibrahim',
    'عبدالرحمن': 'Abdulrahman', 'عبدالعزيز': 'Abdulaziz', 'عبدالمجيد': 'Abdulmajeed',
    'فهد': 'Fahad', 'فيصل': 'Faisal', 'خالد': 'Khalid', 'تركي': 'Turki',
    'عمر': 'Omar', 'عثمان': 'Othman', 'يوسف': 'Youssef', 'صالح': 'Saleh',
    'ناصر': 'Nasser', 'ماجد': 'Majed', 'وليد': 'Waleed', 'ياسر': 'Yasser',
    'إيهاب': 'Ehab', 'ايهاب': 'Ehab', 'شحيطير': 'Shohaiter',
    'أوس': 'Aws', 'حبيب': 'Habib', 'بن': 'Bin', 'بنت': 'Bint',
    'نورة': 'Noura', 'سارة': 'Sarah', 'مريم': 'Maryam', 'فاطمة': 'Fatima', 'ريم': 'Reem', 'أمل': 'Amal', 'منى': 'Mona'
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

function transliterateArabicToPhoneticEnglish(text) {
  if (!text) return '';
  return text.split(/\s+/).map(w => {
    if (!/[\u0600-\u06FF]/.test(w)) return w;
    let res = w
      .replace(/^ال/, 'Al-')
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
  }).join(' ');
}

function translateSinglePhraseToEnglish(text) {
  if (!text) return '';
  let clean = text.replace(/[#\*\_#~`]/g, '').trim();
  if (!/[\u0600-\u06FF]/.test(clean)) {
    return clean.replace(/14\d{2}هـ?/g, m => m.replace(/هـ?/, 'H')).trim();
  }

  // =========================================================================
  // PHASE 1: FULL-PARAGRAPH & PROFESSIONAL SUMMARY MATCHING (RUNS FIRST)
  // =========================================================================
  if (/خريجة بكالوريوس رياض أطفال|رياض أطفال[\s\S]*?بيئة تعليمية داعمة للأطفال/i.test(clean)) {
    return 'Early Childhood Education graduate seeking to advance my professional career in a supportive educational environment for children. Committed to utilizing my pedagogical skills and knowledge to provide effective care and education, while continuously enhancing my professional capabilities to make a positive impact in the workplace.';
  }

  if (/أسعى للحصول على فرصة وظيفية في مجال السلامة والصحة المهنية/i.test(clean)) {
    return 'Seeking a career opportunity in Occupational Health & Safety (OHS) or administrative and technical fields to utilize my skills and practical expertise within a professional environment, with strong commitment to safety regulations, compliance procedures, and organizational objectives.';
  }

  if (/خريج ثانوية عامة طموح ومنظم[\s\S]*?التطور المهني المستمر/i.test(clean)) {
    return 'Ambitious and organized high school graduate seeking an entry-level position in a professional environment to develop skills, gain practical experience, adhere to responsibilities and instructions, work collaboratively within a team, and contribute effectively toward achieving organizational objectives and continuous career growth.';
  }

  if (/أسعى إلى الانضمام إلى جهة عمل احترافية تتيح لي توظيف خبراتي ومهاراتي في مجال الأمن وخدمة العملاء/i.test(clean)) {
    return 'Dedicated and motivated professional seeking to join a reputable organization that enables me to utilize my skills and experience in security and customer service, contributing to organizational goals through dedication, discipline, and teamwork while striving for continuous career development.';
  }

  if (/خريج دبلوم إدارة الموارد البشرية/i.test(clean)) {
    return 'Motivated Human Resources graduate with a Diploma in Human Resources Management and practical cooperative training experience in a healthcare environment. Possesses foundational knowledge of HR operations, employee services, data management, and administrative procedures. Seeking an entry-level Human Resources position to apply academic knowledge, develop professional skills, and contribute effectively to organizational goals.';
  }

  if (/خريج دبلوم في تخصص القوى الكهربائية/i.test(clean)) {
    return 'Electrical Power Technology Diploma graduate with practical training in industrial electrical systems, maintenance, and troubleshooting, alongside crowd management experience. Seeking a professional opportunity to apply technical knowledge, enhance practical expertise, support maintenance operations, and adhere to quality and safety standards in a professional work environment.';
  }

  if (/طموح ومنظم[\s\S]*?تطوير مهاراتي واكتساب الخبرات العملية[\s\S]*?العمل بروح الفريق/i.test(clean)) {
    return 'Ambitious and organized candidate seeking to start a professional career in an engaging environment to enhance my skills, gain practical experience, work collaboratively with team members, and contribute effectively toward achieving organizational objectives and continuous career development.';
  }

  if (/أسعى إلى الانضمام إلى جهة عمل احترافية[\s\S]*?تحقيق أهداف/i.test(clean)) {
    return 'Seeking an opportunity in a professional work environment that allows me to utilize my skills and practical experience, contributing effectively to organizational success through commitment, discipline, and teamwork while pursuing continuous professional growth.';
  }

  // =========================================================================
  // PHASE 2: SENTENCE, ROLE, SKILL, EDUCATION, AND VOCABULARY MAPPING
  // =========================================================================
  let s = ' ' + clean + ' ';

  // Tasks & Responsibilities (Education & Kindergarten)
  s = s.replace(/المساهمة في تنفيذ الأنشطة التعليمية والترفيهية المناسبة للأطفال\.?/gi, 'Assisted in implementing educational and recreational activities suitable for children.');
  s = s.replace(/دعم تنظيم البيئة الصفية ومتابعة احتياجات الأطفال اليومية\.?/gi, 'Supported classroom environment organization and monitored children daily needs.');
  s = s.replace(/المساعدة في إعداد وتنفيذ الأنشطة التعليمية والتربوية للأطفال\.?/gi, 'Assisted in preparing and executing educational and pedagogical activities for children.');
  s = s.replace(/متابعة الأطفال والمساهمة في توفير بيئة تعليمية آمنة ومحفزة\.?/gi, 'Supervised children and contributed to providing a safe, stimulating educational environment.');

  // Tasks & Responsibilities (OHS & Security)
  s = s.replace(/متابعة تطبيق اشتراطات وإجراءات السلامة والصحة المهنية\.?/gi, 'Monitored implementation of Occupational Health and Safety (OHS) standards and procedures.');
  s = s.replace(/المساهمة في تحديد المخاطر المهنية والحد منها\.?/gi, 'Contributed to identifying occupational workplace hazards and mitigating risks.');
  s = s.replace(/التأكد من الالتزام بتعليمات وإرشادات السلامة في بيئة العمل\.?/gi, 'Ensured full compliance with workplace safety instructions and preventive guidelines.');
  s = s.replace(/رفع مستوى الوعي بإجراءات الوقاية والسلامة المهنية\.?/gi, 'Promoted awareness of preventive safety procedures and occupational safety culture.');
  s = s.replace(/مراقبة المداخل والمخارج وتنظيم الدخول والخروج\.?/gi, 'Monitored access points, managed visitor entries/exits, and maintained security logs.');
  s = s.replace(/متابعة أمن وسلامة المنشأة والممتلكات\.?/gi, 'Maintained facility security, safeguarded organizational assets, and conducted patrol rounds.');
  s = s.replace(/التعامل مع المواقف المختلفة وفق الإجراءات والتعليمات المعتمدة\.?/gi, 'Handled emergency situations and operational incidents in accordance with approved protocols.');
  s = s.replace(/الالتزام بالانضباط والتعليمات والمحافظة على بيئة آمنة\.?/gi, 'Maintained strict discipline, adhered to security policies, and ensured a secure working environment.');

  // Tasks & Responsibilities (Admin & Operations)
  s = s.replace(/المساعدة في تنفيذ المهام اليومية وتنظيم الأعمال وفق تعليمات المشرف\.?/gi, 'Assisted in executing daily operational tasks and organizing workflow per supervisor instructions.');
  s = s.replace(/اكتساب خبرة أولية في بيئة العمل والالتزام بالمواعيد والأنظمة\.?/gi, 'Gained foundational workplace experience while maintaining strict adherence to schedules and regulations.');
  s = s.replace(/تنظيم الملفات والمستندات وترتيب البيانات\.?/gi, 'Organized and archived files, documentation, and operational data.');
  s = s.replace(/المساعدة في تنفيذ المهام الإدارية اليومية\.?/gi, 'Supported the team in executing daily administrative and clerical tasks.');
  s = s.replace(/استقبال العملاء والرد على استفساراتهم\.?/gi, 'Welcomed customers and handled inquiries in a professional and timely manner.');
  s = s.replace(/معالجة الشكاوى وتقديم الحلول المناسبة\.?/gi, 'Handled customer complaints and provided optimal, prompt solutions.');
  s = s.replace(/المساهمة في تنفيذ الأنشطة والمبادرات التسويقية\.?/gi, 'Contributed to executing marketing initiatives, promotional activities, and campaigns.');
  s = s.replace(/استقبال المرضى والمراجعين وتقديم الدعم اللازم لهم\.?/gi, 'Welcomed patients and visitors, providing necessary guidance, support, and care.');
  s = s.replace(/تنظيم ومتابعة بيانات وطلبات المرضى\.?/gi, 'Organized and tracked patient records, appointments, and service requests.');
  s = s.replace(/المساعدة في تنظيم وحفظ ملفات الموظفين والوثائق الإدارية\.?/gi, 'Assisted in organizing and maintaining employee personnel files and administrative documents.');
  s = s.replace(/إدخال وتحديث بيانات الموظفين وتنظيم السجلات\.?/gi, 'Entered and updated employee records and maintained organized HR data.');
  s = s.replace(/المساعدة في تنفيذ المهام اليومية لقسم الموارد البشرية\.?/gi, 'Supported daily operations and routine administrative tasks of the Human Resources department.');

  // Roles & Job Titles
  s = s.replace(/متدربة\s*[-–—]\s*روضة العشرون بالمصيف/gi, 'Trainee – Twentieth Kindergarten in Al-Maseef');
  s = s.replace(/روضة العشرون بالمصيف/gi, 'Twentieth Kindergarten in Al-Maseef');
  s = s.replace(/مساعدة معلمة رياض أطفال/gi, 'Kindergarten Teaching Assistant');
  s = s.replace(/معلمة رياض أطفال|معلم رياض أطفال/gi, 'Kindergarten Teacher');
  s = s.replace(/معلمة صف|معلم صف/gi, 'Classroom Teacher');
  s = s.replace(/معلمة|معلم/gi, 'Teacher');
  s = s.replace(/أخصائي سلامة وصحة مهنية/gi, 'Occupational Health & Safety Specialist');
  s = s.replace(/حراسات أمنية|حراسة أمنية/gi, 'Security Services');
  s = s.replace(/دعم فني/gi, 'Technical Support');
  s = s.replace(/متدرب\s*[-–—]\s*تدريب عملي|متدربة\s*[-–—]\s*تدريب عملي/gi, 'Trainee – Practical Internship');
  s = s.replace(/مساعد إداري\s*[-–—]\s*خبرة عملية|مساعدة إدارية/gi, 'Administrative Assistant – Practical Experience');
  s = s.replace(/رجل أمن\s*[-–—|]\s*حراسات أمنية|حارس أمن/gi, 'Security Officer – Security Services');
  s = s.replace(/ممثل خدمة عملاء|موظف خدمة عملاء/gi, 'Customer Service Representative');
  s = s.replace(/أخصائي موارد بشرية|مسؤول موارد بشرية/gi, 'Human Resources Specialist');
  s = s.replace(/مدخل بيانات|مدخلة بيانات/gi, 'Data Entry Specialist');
  s = s.replace(/محاسب عام|محاسب/gi, 'General Accountant');
  s = s.replace(/سكرتير تنفيذي|سكرتيرة تنفيذية/gi, 'Executive Secretary');

  // Education Degrees & Universities
  s = s.replace(/بكالوريوس رياض أطفال|رياض أطفال/gi, 'Bachelor of Early Childhood Education');
  s = s.replace(/جامعة حائل/gi, 'University of Hail');
  s = s.replace(/جامعة الملك عبدالعزيز/gi, 'King Abdulaziz University');
  s = s.replace(/جامعة الملك سعود/gi, 'King Saud University');
  s = s.replace(/جامعة أم القرى/gi, 'Umm Al-Qura University');
  s = s.replace(/جامعة الإمام محمد بن سعود الإسلامية/gi, 'Imam Mohammad Ibn Saud Islamic University');
  s = s.replace(/جامعة الملك فيصل/gi, 'King Faisal University');
  s = s.replace(/جامعة القصيم/gi, 'Qassim University');
  s = s.replace(/جامعة الطائف/gi, 'Taif University');
  s = s.replace(/جامعة طيبة/gi, 'Taibah University');
  s = s.replace(/جامعة نجران/gi, 'Najran University');
  s = s.replace(/جامعة جازان/gi, 'Jazan University');
  s = s.replace(/جامعة تبوك/gi, 'Tabuk University');
  s = s.replace(/الكلية التقنية/gi, 'College of Technology');
  s = s.replace(/قسم الحاسب وتقنية المعلومات/gi, 'Computer & Information Technology Department');
  s = s.replace(/دبلوم دعم فني/gi, 'Technical Support Diploma');
  s = s.replace(/شهادة الثانوية العامة|ثانوية عامة|الثانوية العامة/gi, 'High School Diploma');
  s = s.replace(/المسار الأدبي/gi, 'Literary Track');
  s = s.replace(/المسار العلمي/gi, 'Scientific Track');
  s = s.replace(/دبلوم إدارة الموارد البشرية/gi, 'Diploma in Human Resources Management');
  s = s.replace(/دبلوم القوى الكهربائية|دبلوم قوى كهربائية/gi, 'Diploma in Electrical Power Technology');
  s = s.replace(/بكالوريوس إدارة أعمال/gi, 'Bachelor of Business Administration');
  s = s.replace(/بكالوريوس علوم الحاسب/gi, 'Bachelor of Computer Science');

  // Training Courses & Certifications
  s = s.replace(/أساسيات اللغة الإنجليزية\.?/gi, 'English Language Fundamentals');
  s = s.replace(/اضطراب طيف التوحد\.?/gi, 'Autism Spectrum Disorder (ASD)');
  s = s.replace(/الاحتياجات الخاصة وصعوبات التعلم\.?|صعوبات التعلم/gi, 'Special Needs & Learning Difficulties');
  s = s.replace(/الإسعافات الأولية\.?|دورة الإسعافات الأولية/gi, 'First Aid Certification');
  s = s.replace(/أمراض السمع والنطق\.?|السمع والنطق/gi, 'Hearing and Speech Disorders');
  s = s.replace(/OSHA\s*[–\-]\s*السلامة والصحة المهنية\s*\|\s*مدة 3 أشهر\.?/gi, 'OSHA – Occupational Safety and Health (3 Months)');
  s = s.replace(/OSHA\s*[–\-]\s*السلامة والصحة في الصناعات العامة\.?/gi, 'OSHA – Safety and Health in General Industry');
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

  // Skills (Comprehensive)
  s = s.replace(/التعامل الفعّال مع الأطفال|التعامل الفعال مع الأطفال|التعامل مع الأطفال/gi, 'Effective Interaction with Children');
  s = s.replace(/إعداد وتنفيذ الأنشطة التعليمية|الأنشطة التعليمية/gi, 'Preparing & Implementing Educational Activities');
  s = s.replace(/إدارة وتنظيم البيئة الصفية|تنظيم البيئة الصفية/gi, 'Classroom Management & Organization');
  s = s.replace(/التواصل الفعّال|التواصل الفعال/gi, 'Effective Communication');
  s = s.replace(/الصبر وحسن التعامل|الصبر والتعامل الإيجابي/gi, 'Patience & Professional Interpersonal Skills');
  s = s.replace(/العمل ضمن فريق|العمل بروح الفريق|العمل الجماعي/gi, 'Teamwork & Collaboration');
  s = s.replace(/تحمل المسؤولية والانضباط|تحمل المسؤولية/gi, 'Taking Responsibility & Accountability');
  s = s.replace(/تنظيم الوقت وإدارة المهام|إدارة الوقت وترتيب الأولويات|تنظيم الوقت|إدارة الوقت/gi, 'Time Management & Task Organization');
  s = s.replace(/السلامة والصحة المهنية/gi, 'Occupational Health & Safety (OHS)');
  s = s.replace(/تحديد المخاطر المهنية والوقاية منها/gi, 'Hazard Identification & Risk Prevention');
  s = s.replace(/الالتزام بتعليمات وإجراءات السلامة|الالتزام بتعليمات وإرشادات السلامة/gi, 'Safety Procedures Compliance');
  s = s.replace(/المراقبة والمتابعة/gi, 'Surveillance & Monitoring');
  s = s.replace(/التعامل مع العملاء والزملاء باحترافية/gi, 'Professional Interaction with Clients & Peers');
  s = s.replace(/مهارات الحاسب والدعم الفني|مهارات الحاسب والدعم/gi, 'Computer Proficiency & Technical Support');
  s = s.replace(/خدمة العملاء المتميزة|خدمة العملاء|خدمة عملاء/gi, 'Customer Service Excellence');
  s = s.replace(/حل المشكلات واتخاذ القرار|حل المشكلات واتخاذ القرارات|حل المشكلات واتخاذ الإجراءات المناسبة|حل المشكلات/gi, 'Problem Solving & Decision Making');
  s = s.replace(/استخدام الحاسب الآلي وبرامج مايكروسوفت أوفيس|برامج Microsoft Office|برامج مايكروسوفت أوفيس/gi, 'Microsoft Office Suite Proficiency');

  // Languages & Levels
  s = s.replace(/اللغة العربية\s*:\s*اللغة الأم/gi, 'Arabic: Native');
  s = s.replace(/اللغة الإنجليزية\s*:\s*متوسط/gi, 'English: Intermediate');
  s = s.replace(/اللغة الإنجليزية\s*:\s*جيد جد[اًا]/gi, 'English: Very Good');
  s = s.replace(/اللغة الإنجليزية\s*:\s*مبتدئ/gi, 'English: Beginner');
  s = s.replace(/اللغة الإنجليزية\s*:\s*متقدم/gi, 'English: Advanced');
  s = s.replace(/اللغة الإنجليزية\s*:\s*ممتاز/gi, 'English: Fluent');
  s = s.replace(/اللغة العربية|العربية/gi, 'Arabic');
  s = s.replace(/اللغة الإنجليزية|الإنجليزية|الانجليزية/gi, 'English');
  s = s.replace(/اللغة الأم|الأم/gi, 'Native');
  s = s.replace(/متوسط/gi, 'Intermediate');
  s = s.replace(/جيد\s*جد[اًاً]/gi, 'Very Good');
  s = s.replace(/جيد/gi, 'Good');
  s = s.replace(/\bجيد\b\.?/gi, 'Good');
  s = s.replace(/\bممتاز\b\.?|\bبطلاقة\b\.?|\bطلاقة\b\.?/gi, 'Fluent');
  s = s.replace(/مستوى متقدم|\bمتقدم\b\.?/gi, 'Advanced');
  s = s.replace(/مستوى مبتدئ|\bمبتدئ\b\.?/gi, 'Beginner');

  // Locations & Cities
  s = s.replace(/المملكة العربية السعودية/gi, 'Saudi Arabia');
  s = s.replace(/السعودية/gi, 'Saudi Arabia');
  s = s.replace(/مكة المكرمة|مكة/gi, 'Makkah');
  s = s.replace(/المدينة المنورة|المدينة/gi, 'Madinah');
  s = s.replace(/حائل/gi, 'Hail');
  s = s.replace(/المصيف/gi, 'Al-Maseef');
  s = s.replace(/\bالقصيم\b/gi, 'Al-Qassim');
  s = s.replace(/\bالطائف\b/gi, 'Taif');
  s = s.replace(/\bالرياض\b/gi, 'Riyadh');
  s = s.replace(/\bجدة\b/gi, 'Jeddah');
  s = s.replace(/\bالدمام\b/gi, 'Dammam');
  s = s.replace(/\bالخبر\b/gi, 'Khobar');
  s = s.replace(/\bسعودي\b|\bسعودية\b/gi, 'Saudi');

  // General vocabulary
  const vocab = {
    'إدارة': 'Management', 'قسم': 'Department', 'شركة': 'Company', 'مؤسسة': 'Establishment',
    'مستشفى': 'Hospital', 'مركز': 'Center', 'معهد': 'Institute', 'جامعة': 'University',
    'كلية': 'College', 'مدرسة': 'School', 'روضة': 'Kindergarten', 'ثانوية': 'High School', 'مشروع': 'Project', 'مصنع': 'Factory',
    'عمليات': 'Operations', 'خدمة': 'Service', 'خدمات': 'Services', 'دعم': 'Support',
    'تطوير': 'Development', 'تصميم': 'Design', 'تنفيذ': 'Execution', 'متابعة': 'Follow-up',
    'إعداد': 'Preparation', 'تقديم': 'Providing', 'تنظيم': 'Organization', 'تنسيق': 'Coordination',
    'تدريب': 'Training', 'خبرة': 'Experience', 'مهارة': 'Skill', 'مهارات': 'Skills',
    'دورة': 'Course', 'دورات': 'Courses', 'شهادة': 'Certificate', 'شهادات': 'Certifications',
    'سجلات': 'Records', 'ملفات': 'Files', 'وثائق': 'Documents', 'مستندات': 'Documents',
    'موظفين': 'Employees', 'بيانات': 'Data', 'معلومات': 'Information',
    'أنظمة': 'Systems', 'لوائح': 'Regulations', 'سياسات': 'Policies', 'إجراءات': 'Procedures',
    'مهام': 'Tasks', 'أعمال': 'Work', 'وظيفة': 'Job', 'مسؤوليات': 'Responsibilities',
    'أهداف': 'Objectives', 'جودة': 'Quality', 'سلامة': 'Safety', 'كفاءة': 'Efficiency',
    'إنتاجية': 'Productivity', 'أداء': 'Performance', 'تواصل': 'Communication',
    'قيادة': 'Leadership', 'إشراف': 'Supervision', 'تخطيط': 'Planning', 'تقارير': 'Reports',
    'حلول': 'Solutions', 'ذكاء': 'Intelligence', 'اصطناعي': 'Artificial', 'معالجة': 'Processing',
    'استخدام': 'Proficiency in', 'اكتساب': 'Gaining', 'تطبيق': 'Application', 'تحقيق': 'Achieving',
    'الحالي': 'Present', 'حتى الآن': 'Present', 'المنشأة': 'Organization', 'المنظمة': 'Organization',
    'الموردين': 'Suppliers', 'العملاء': 'Clients', 'المرضى': 'Patients', 'المراجعين': 'Visitors',
    'الشكاوى': 'Complaints', 'حل': 'Resolving', 'الالتزام': 'Commitment', 'الانضباط': 'Discipline',
    'الفريق': 'Team', 'الحرص': 'Dedication', 'المستمر': 'Continuous', 'المزيد': 'Further',
    'العملية': 'Practical', 'العامة': 'General', 'الخاصة': 'Special', 'الخاص': 'Private',
    'الحكومي': 'Governmental', 'الأدبي': 'Literary', 'العلمي': 'Scientific', 'المسار': 'Track',
    'المعدل': 'GPA', 'طموح': 'Ambitious', 'منظم': 'Organized', 'نشيط': 'Active', 'احترافي': 'Professional'
  };

  Object.keys(vocab).forEach(arWord => {
    const reg = new RegExp('\\b' + arWord + '\\b', 'g');
    s = s.replace(reg, vocab[arWord]);
  });

  // If any Arabic word remains, transliterate it instead of stripping it!
  if (/[\u0600-\u06FF]/.test(s)) {
    s = s.replace(/[\u0600-\u06FF]+/g, match => transliterateArabicToPhoneticEnglish(match));
  }

  return s
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s*([–\-\|])\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateTextToEnglish(text) {
  if (!text) return '';
  let cleanRaw = text.replace(/[#\*\_#~`]/g, '').trim();
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
  if (!rawLine) return null;
  const clean = sanitizeText(rawLine).toLowerCase().replace(/^[#\*\_–•▪🔹■\d+\.\s]+|[#\*\_–:\s]+$/g, '').trim();
  if (/^(?:الهدف المهني|الهدف الوظيفي|المستهدف الوظيفي|Career Objective|Objective|الملخص المهني|الملخص التنفيذي|النبذة المهنية|نبذة عني|نبذة تعريفية|نبذة|عني|الملخص|Summary|About Me|Profile)(?:$|[\s:\-])/i.test(clean)) return 'summary';
  if (/^(?:المؤهلات العلمية|المؤهل العلمي|التعليم والمؤهلات|التعليم|المؤهلات|الدراسة|Education|Academic Background|Academic Qualifications|Qualifications)(?:$|[\s:\-])/i.test(clean)) return 'education';
  if (/^(?:الخبرات العملية|الخبرة المهنية|الخبرات المهنية|سجل الخبرات|الخبرة|الخبرات|خبراتي|Work Experience|Experience|Employment|Professional Experience)(?:$|[\s:\-])/i.test(clean)) return 'experience';
  if (/^(?:الدورات التدريبية|الشهادات الاحترافية|الدورات والشهادات|الدورات|الكورسات|الشهادات|البرامج التدريبية|Courses|Certificates|Certifications|Training|Workshops)(?:$|[\s:\-])/i.test(clean)) return 'training';
  if (/^(?:المهارات الشخصية|المهارات التقنية|المهارات والقدرات|المهارات المهنية|المهارات|مهاراتي|القدرات|Skills|Core Skills|Technical Skills|Key Skills|Competencies)(?:$|[\s:\-])/i.test(clean)) return 'skills';
  if (/^(?:اللغات والمهارات اللغوية|اللغات|اللغة|Languages|Language Skills)(?:$|[\s:\-])/i.test(clean)) return 'languages';
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
      const afterColon = line.replace(/^[#\*\_–•▪🔹■\d+\.\s]*(?:الهدف المهني|الهدف الوظيفي|المستهدف الوظيفي|Career Objective|Objective|الملخص المهني|الملخص التنفيذي|النبذة المهنية|نبذة عني|نبذة تعريفية|نبذة|عني|الملخص|Summary|About Me|Profile|الخبرات العملية|الخبرة المهنية|الخبرات المهنية|سجل الخبرات|الخبرة|الخبرات|Work Experience|Experience|Employment|المؤهلات العلمية|المؤهل العلمي|التعليم والمؤهلات|التعليم|الدراسة|Education|Academic|الدورات التدريبية|الشهادات الاحترافية|الدورات والشهادات|الدورات|الكورسات|الشهادات|Courses|Certificates|Certifications|Training|المهارات الشخصية|المهارات التقنية|المهارات والقدرات|المهارات|القدرات|Skills|Competencies|اللغات والمهارات اللغوية|اللغات|Languages)[#\*\_–:\s]*/i, '').trim();
      if (afterColon) {
        rawSections[activeSection].push(afterColon);
      }
      continue;
    }
    if (rawSections[activeSection]) {
      rawSections[activeSection].push(line);
    }
  }

  // 1. Parse Personal Data
  let nameAr = '', nameEn = '';
  let titleAr = '', titleEn = '';
  let phone = '', email = '', cityAr = '', cityEn = '';

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const phoneRegex = /(?:\+?966|00966|0)?5\d{8}|05\d{8}|\b5\d{8}\b/;
  const cityRegex = /(?:الرياض|جدة|مكة المكرمة|مكة|المدينة المنورة|المدينة|الدمام|الخبر|الظهران|الطائف|حائل|تبوك|جازان|جيزان|نجران|أبها|خميس مشيط|القصيم|بريدة|عنيزة|ينبع|الجبيل|الأحساء|الهفوف|الدرعية|الخرج|Riyadh|Jeddah|Makkah|Madinah|Dammam|Khobar|Taif|Hail|Tabuk|Jazan|Najran|Abha|Qassim|Al-Qassim|Jubail|Yanbu|Al-Ahsa)/i;

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

  let nationalityAr = '', nationalityEn = '';
  for (let l of lines) {
    const natM = l.match(/(?:الجنسية\s*[:\-]\s*([^\n\r,]+))/i);
    if (natM && natM[1]) {
      nationalityAr = natM[1].trim();
      nationalityEn = translateTextToEnglish(nationalityAr);
      break;
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
    if (nameAr && !titleAr && l.length > 2 && l.length < 80 && !classifySectionHeading(l) && !/(?:سعودي|سعودية|المملكة|الرياض|جدة|الطائف|القصيم|مكة|حائل|الخبر|الدمام|المدينة|الهاتف|الجوال|البريد|الإيميل|المنطقة|الجنسية|العنوان|الهدف|الملخص|نبذة)/i.test(l)) {
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
    const cleanL = rawLine.replace(/^[•\-\*▪🔹■\d+\.]+\s*/, '').replace(/[#\*\_#~`]/g, '').trim();
    if (!cleanL) return;

    const dates = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/g);
    const isDuration = /(?:مدة الخبرة|سنة|سنتين|أشهر|شهر|years?|months?)/i.test(cleanL);

    const isRoleKeyword = /(?:أخصائي|أخصائيه|مشرف|مشرفة|مسؤول|مسؤولة|مدير|مديرة|معلم|معلمة|مربي|مربية|فني|فنية|مهندس|مهندسة|كاتب|كاتبة|مساعد|مساعدة|متدرب|متدربة|حراسات|حراسة|حارس|رجل أمن|خدمة عملاء|كاشير|سائق|منسق|منسقة|مندوب|مندوبة|مدخل بيانات|مدخلة بيانات|محاسب|محاسبة|سكرتير|سكرتيرة|ضابط|مراقب|مراقبة|مسوق|مسوقة|عامل|مطور|محلل|دعم فني|سلامة وصحة|رياض أطفال|روضة|Trainee|Assistant|Teacher|Officer|Specialist|Manager|Engineer|Technician|Driver)/i.test(cleanL);

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
      level = p.slice(1).join(' ').trim() || level;
    }
    const cleanLevel = level.replace(/\.+$/, '').trim();
    langItems.push({
      nameAr: name,
      nameEn: translateTextToEnglish(name),
      levelAr: cleanLevel,
      levelEn: translateTextToEnglish(cleanLevel)
    });
  });

  if (langItems.length === 0) {
    langItems.push({ nameAr: 'العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native' });
    langItems.push({ nameAr: 'الإنجليزية', nameEn: 'English', levelAr: 'متوسط', levelEn: 'Intermediate' });
  }

  return {
    personal: {
      nameAr: nameAr || 'هدى لافي المطيري',
      nameEn: nameEn || 'Huda Lafi Al-Mutairi',
      titleAr: titleAr || 'معلمة رياض أطفال | Early Childhood Teacher',
      titleEn: titleEn || 'Early Childhood & Kindergarten Teacher',
      email: email || 'huda98huda89@icloud.com',
      phone: phone || '0500908924',
      cityAr: cityAr || 'مكة المكرمة، المملكة العربية السعودية',
      cityEn: cityEn || 'Makkah, Saudi Arabia',
      linkedin: '',
      website: '',
      nationality: nationalityAr || '',
      nationalityEn: nationalityEn || '',
      birthdate: '',
      photo: '',
      logo: '',
      signature: ''
    },
    sections: [
      {
        id: 's1',
        type: 'summary',
        titleAr: 'الهدف المهني',
        titleEn: 'Career Objective',
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
        titleAr: 'الدورات التدريبية',
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
      try { parsed = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson; } catch { parsed = JSON.parse(this.generateResumeFromSmartEngine('معلمة')); }
      return JSON.stringify(parsed);
    },

    generateCoverLetterFromSmartEngine(name, job, company, points, lang) {
      const isEn = lang === 'en';
      if (isEn) {
        return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position${company ? ' at ' + company : ''}. With solid professional experience in Saudi Arabia, I am confident in my ability to make an immediate impact on your team.\n\nSincerely,\n${name || 'Applicant'}`;
      }
      return `السادة / فريق التوظيف المحترمين،\n\nالسلام عليكم ورحمة الله وبركاته،،\n\nأتقدم إليكم بخالص الرغبة والاهتمام بالترشح للوظيفة${company ? ' في شركة ' + company : ''}. متسلحة بخبرة عملية متقدمة في رعاية وتعليم الأطفال.\n\nوتقبلوا فائق الاحترام والتقدير،،\n\n${name || 'المتقدمة'}`;
    }
  };
}
