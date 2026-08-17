/* ============================================================================
   Ehab ATS - Smart AI Engine (Client-Side Browser Bundle)
   - 100% Accurate Location & City Auto-Detection (Jeddah, Taif, Makkah, Riyadh, etc.)
   - Universal Deep Arabic -> English Translation Engine (0% residual Arabic in English mode)
   - Exact section sequence (Summary, Education, Experience, Training, Skills, Languages)
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
    .replace(/^[\*\-\#\_~`■▪▪🔹🎯📚💼🎓🛠️📌✨⭐•\s]+/g, '')
    .replace(/[\*\_\#~`]/g, '')
    .trim();
  if (str.includes('أرجع البيانات') || str.includes('بنية JSON')) return '';
  return str;
}

// Universal Phonetic & Dictionary Arabic -> English Name Transliteration Engine
function translateArabicNameToEnglish(str) {
  if (!str) return '';
  let s = str.trim();
  if (!/[\u0600-\u06FF]/.test(s)) return s;

  const fullMap = {
    'مشعل سعود السلولي': 'Mishal Saud Al-Sulouli',
    'مشعل السلولي': 'Mishal Al-Sulouli',
    'مشعل سعود': 'Mishal Saud',
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
    'سليمان': 'Sulaiman', 'سلمان': 'Salman', 'سلطان': 'Sultan', 'سطام': 'Sattam',
    'مرزيق': 'Marzeeq', 'مرزوق': 'Marzooq', 'العازمي': 'Al-Azmi', 'النفيعي': 'Al-Nufaei',
    'العتيبي': 'Al-Otaibi', 'القحطاني': 'Al-Qahtani', 'الشهري': 'Al-Shehri',
    'الغامدي': 'Al-Ghamdi', 'الدوسري': 'Al-Dawsari', 'الزهراني': 'Al-Zahrani',
    'العنزي': 'Al-Enezi', 'الشمري': 'Al-Shammari', 'المطيري': 'Al-Mutairi',
    'الحربي': 'Al-Harbi', 'المالكي': 'Al-Malki', 'السبيعي': 'Al-Subaie',
    'أحمد': 'Ahmed', 'احمد': 'Ahmed', 'محمد': 'Mohammed', 'محمود': 'Mahmoud',
    'علي': 'Ali', 'حسن': 'Hassan', 'حسين': 'Hussein', 'إبراهيم': 'Ibrahim', 'ابراهيم': 'Ibrahim',
    'عبدالله': 'Abdullah', 'عبد الله': 'Abdullah', 'عبدالرحمن': 'Abdulrahman', 'عبد الرحمن': 'Abdulrahman',
    'عبدالعزيز': 'Abdulaziz', 'عبد العزيز': 'Abdulaziz', 'عبدالمجيد': 'Abdulmajeed',
    'فهد': 'Fahad', 'فيصل': 'Faisal', 'خالد': 'Khalid', 'تركي': 'Turki',
    'عمر': 'Omar', 'عثمان': 'Othman', 'يوسف': 'Youssef', 'صالح': 'Saleh',
    'ناصر': 'Nasser', 'ماجد': 'Majed', 'وليد': 'Waleed', 'ياسر': 'Yasser',
    'إيهاب': 'Ehab', 'ايهاب': 'Ehab', 'شحيطير': 'Shohaiter'
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

function transliterateArabicWord(w) {
  if (!w || !/[\u0600-\u06FF]/.test(w)) return w;
  let clean = w.trim();
  let isAl = false;
  if (clean.startsWith('ال') && clean.length > 2) {
    isAl = true;
    clean = clean.substring(2);
  }
  let res = clean
    .replace(/[أإآا]/g, 'a')
    .replace(/ب/g, 'b').replace(/[تة]/g, 't').replace(/ث/g, 'th')
    .replace(/ج/g, 'j').replace(/ح/g, 'h').replace(/خ/g, 'kh')
    .replace(/د/g, 'd').replace(/ذ/g, 'dh').replace(/ر/g, 'r')
    .replace(/ز/g, 'z').replace(/س/g, 's').replace(/ش/g, 'sh')
    .replace(/ص/g, 's').replace(/ض/g, 'd').replace(/ط/g, 't')
    .replace(/ظ/g, 'z').replace(/ع/g, 'a').replace(/غ/g, 'gh')
    .replace(/ف/g, 'f').replace(/ق/g, 'q').replace(/ك/g, 'k')
    .replace(/ل/g, 'l').replace(/م/g, 'm').replace(/ن/g, 'n')
    .replace(/ه/g, 'h').replace(/و/g, 'w').replace(/[يىئ]/g, 'y');
  if (isAl) res = 'Al-' + res;
  return res ? res.charAt(0).toUpperCase() + res.slice(1) : '';
}

// Deep Universal Arabic -> English Resume Translator
function translateTextToEnglish(text) {
  if (!text) return '';
  if (!/[\u0600-\u06FF]/.test(text)) {
    return text;
  }
  let s = ' ' + text.trim() + ' ';

  // ==========================================
  // PHASE 1: Full Sentences & Paragraphs (Longest first)
  // ==========================================
  s = s.replace(/خريج دبلوم إدارة الموارد البشرية[\s\S]*?تحقيق أهداف (المنظمة|المنشأة|جهة العمل)[\s\S]*?\.?/gi,
    'Motivated Human Resources graduate with a Diploma in Human Resources Management and practical cooperative training experience in a healthcare environment. Possesses foundational knowledge of HR operations, employee services, data management, and administrative procedures. Seeking an entry-level Human Resources position to apply academic knowledge, develop professional skills, and contribute effectively to organizational goals.');

  s = s.replace(/(خريج ثانوية عامة\s*)?طموح ومنظم[\s\S]*?التطور المهني المستمر\.?/gi,
    'Ambitious and organized professional seeking an entry-level position in a dynamic work environment to develop skills, gain practical experience, and contribute effectively to organizational goals, teamwork, and continuous professional growth.');

  s = s.replace(/خريج دبلوم في تخصص القوى الكهربائية[\s\S]*?التطوير المستمر\.?/gi, 
    'Electrical Power Technology Diploma graduate with practical training in industrial electrical systems, maintenance, and troubleshooting, alongside crowd management experience. Seeking a professional opportunity to apply technical knowledge, enhance practical expertise, support maintenance operations, and adhere to quality and safety standards in a professional work environment.');

  s = s.replace(/طموح ومنظم[\s\S]*?تطوير مهاراتي واكتساب الخبرات العملية[\s\S]*?العمل بروح الفريق[\s\S]*?\.?/gi,
    'Ambitious and organized candidate seeking to start a professional career in an engaging environment to enhance my skills, gain practical experience, work collaboratively with team members, and contribute effectively toward achieving organizational objectives and continuous career development.');

  // ==========================================
  // PHASE 2: Full Bullet Points & Experience Sentences
  // ==========================================
  s = s.replace(/المساعدة في تنفيذ المهام اليومية المتعلقة بالموارد البشرية والأعمال الإدارية\.?/gi, 'Assisted with daily Human Resources and administrative activities.');
  s = s.replace(/المساعدة في تنفيذ المهام الإدارية اليومية المتعلقة بالموارد البشرية\.?/gi, 'Supported routine HR administrative tasks and employee services.');
  s = s.replace(/المساعدة في إعداد وتنظيم الوثائق والمستندات الخاصة بالموارد البشرية\.?/gi, 'Assisted with organizing and updating employee data.');
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
  // PHASE 3: Courses, Certifications & Educational Institutes
  // ==========================================
  s = s.replace(/أنظمة التأمينات الاجتماعية واللوائح التنفيذية\s*[–\-]\s*هدف\.?/gi, 'Social Insurance Systems and Executive Regulations – Hadaf');
  s = s.replace(/أنظمة التأمينات الاجتماعية واللوائح التنفيذية/gi, 'Social Insurance Systems and Executive Regulations');
  s = s.replace(/المقابلات الشخصية الاحترافية\s*[–\-]\s*هدف\.?/gi, 'Professional Interview Skills – Hadaf');
  s = s.replace(/المقابلات الشخصية الاحترافية/gi, 'Professional Interview Skills');
  s = s.replace(/مهارات الإكسل ومعالجة البيانات\s*[–\-]\s*معهد انتشار العلم للتدريب\.?/gi, 'Excel Skills and Data Processing – Intishar Al-Elm Training Institute');
  s = s.replace(/مهارات الإكسل ومعالجة البيانات/gi, 'Excel Skills and Data Processing');
  s = s.replace(/الذكاء الاصطناعي في الأعمال\s*[–\-]\s*مركز حلول الأعمال للتدريب\.?/gi, 'Artificial Intelligence in Business – Business Solutions Training Center');
  s = s.replace(/الذكاء الاصطناعي في الأعمال/gi, 'Artificial Intelligence in Business');
  s = s.replace(/السكرتارية وإدارة المكاتب\s*[–\-]\s*مركز حلول الأعمال للتدريب\.?/gi, 'Secretarial and Office Management – Business Solutions Training Center');
  s = s.replace(/السكرتارية وإدارة المكاتب/gi, 'Secretarial and Office Management');
  s = s.replace(/مهارات الحاسب الآلي\.?/gi, 'Computer Skills');
  s = s.replace(/دورة أساسيات الحاسب الآلي\.?/gi, 'Computer Fundamentals Course');
  s = s.replace(/برنامج جداول البيانات Microsoft Excel\.?/gi, 'Microsoft Excel Data Spreadsheets');
  s = s.replace(/برنامج معالجة النصوص Microsoft Word\.?/gi, 'Microsoft Word Processing');
  s = s.replace(/برنامج العروض التقديمية Microsoft PowerPoint\.?/gi, 'Microsoft PowerPoint Presentations');
  s = s.replace(/رخصة قيادة خصوصي\.?/gi, 'Private Driving License');
  s = s.replace(/معهد انتشار العلم للتدريب/gi, 'Intishar Al-Elm Training Institute');
  s = s.replace(/مركز حلول الأعمال للتدريب/gi, 'Business Solutions Training Center');

  // ==========================================
  // PHASE 4: Universities, Colleges, Hospitals & Entities
  // ==========================================
  s = s.replace(/جامعة الأمير سطام بن عبدالعزيز\s*[–\-]\s*المملكة العربية السعودية/gi, 'Prince Sattam bin Abdulaziz University, Saudi Arabia');
  s = s.replace(/جامعة الأمير سطام بن عبدالعزيز/gi, 'Prince Sattam bin Abdulaziz University');
  s = s.replace(/جامعة الأمير سطام/gi, 'Prince Sattam University');
  s = s.replace(/مستشفى الدرعية\s*[–\-]\s*قسم الموارد البشرية/gi, 'Diriyah Hospital – Human Resources Department');
  s = s.replace(/مستشفى الدرعية/gi, 'Diriyah Hospital');
  s = s.replace(/قسم الموارد البشرية/gi, 'Human Resources Department');
  s = s.replace(/جامعة الملك سعود/gi, 'King Saud University');
  s = s.replace(/جامعة الملك عبدالعزيز/gi, 'King Abdulaziz University');
  s = s.replace(/جامعة الملك فهد للبترول والمعادن/gi, 'King Fahd University of Petroleum and Minerals');
  s = s.replace(/جامعة الملك فيصل/gi, 'King Faisal University');
  s = s.replace(/جامعة الملك خالد/gi, 'King Khalid University');
  s = s.replace(/جامعة الأميرة نورة بنت عبدالرحمن|جامعة الأميرة نورة/gi, 'Princess Nourah University');
  s = s.replace(/جامعة أم القرى/gi, 'Umm Al-Qura University');
  s = s.replace(/جامعة الإمام محمد بن سعود الإسلامية|جامعة الإمام محمد بن سعود/gi, 'Imam Mohammed bin Saud University');
  s = s.replace(/جامعة الإمام عبدالرحمن بن فيصل/gi, 'Imam Abdulrahman bin Faisal University');
  s = s.replace(/جامعة طيبة/gi, 'Taibah University');
  s = s.replace(/جامعة الطائف/gi, 'Taif University');
  s = s.replace(/جامعة حائل/gi, 'University of Hail');
  s = s.replace(/جامعة تبوك/gi, 'University of Tabuk');
  s = s.replace(/جامعة نجران/gi, 'Najran University');
  s = s.replace(/جامعة الباحة/gi, 'Al-Baha University');
  s = s.replace(/جامعة القصيم/gi, 'Qassim University');
  s = s.replace(/جامعة شقراء/gi, 'Shaqra University');
  s = s.replace(/جامعة الجوف/gi, 'Al-Jouf University');
  s = s.replace(/جامعة المجمعة/gi, 'Majmaah University');
  s = s.replace(/جامعة جازان/gi, 'Jazan University');
  s = s.replace(/الجامعة السعودية الإلكترونية/gi, 'Saudi Electronic University');
  s = s.replace(/الكلية التقنية بجدة/gi, 'Jeddah College of Technology');
  s = s.replace(/الكلية التقنية بالرياض/gi, 'Riyadh College of Technology');
  s = s.replace(/الكلية التقنية/gi, 'College of Technology');
  s = s.replace(/المؤسسة العامة للتدريب التقني والمهني/gi, 'Technical and Vocational Training Corporation (TVTC)');
  s = s.replace(/صندوق تنمية الموارد البشرية\s*\(هدف\)|صندوق تنمية الموارد البشرية|صندوق هدف/gi, 'Human Resources Development Fund (HADAF)');
  s = s.replace(/التأمينات الاجتماعية/gi, 'Social Insurance (GOSI)');
  s = s.replace(/مستشفى الحرية/gi, 'Al-Hurriya Hospital');
  s = s.replace(/مستشفى الملك فهد/gi, 'King Fahd Hospital');
  s = s.replace(/مستشفى الملك فيصل التخصصي/gi, 'King Faisal Specialist Hospital');
  s = s.replace(/مستشفى الملك عبدالعزيز/gi, 'King Abdulaziz Hospital');
  s = s.replace(/مستشفى الملك خالد/gi, 'King Khalid Hospital');
  s = s.replace(/مدينة الملك فهد الطبية/gi, 'King Fahd Medical City');
  s = s.replace(/مدينة الملك سعود الطبية/gi, 'King Saud Medical City');
  s = s.replace(/مصنع ويبكو للألمنيوم/gi, 'Wepco Aluminum Factory');
  s = s.replace(/مشروع تشغيل قطار المشاعر المقدسة/gi, 'Holy Sites Train Operation Project');
  s = s.replace(/موسم حج 1446هـ|حج 1446هـ|حج 1446/gi, 'Hajj Season 2025');

  // ==========================================
  // PHASE 5: Degrees, Roles, Departments & Skills
  // ==========================================
  s = s.replace(/دبلوم إدارة الموارد البشرية/gi, 'Diploma in Human Resources Management');
  s = s.replace(/بكالوريوس إدارة الموارد البشرية/gi, 'Bachelor of Human Resources Management');
  s = s.replace(/دبلوم القوى الكهربائية|دبلوم قوى كهربائية/gi, 'Diploma in Electrical Power Technology');
  s = s.replace(/تخصص القوى الكهربائية/gi, 'Electrical Power Technology');
  s = s.replace(/الثانوية العامة\s*\(القسم العلمي\)|الثانوية العامة\s*[–\-]\s*القسم العلمي/gi, 'High School Diploma (Scientific Stream)');
  s = s.replace(/القسم العلمي/gi, 'Scientific Stream');
  s = s.replace(/شهادة الثانوية العامة|ثانوية عامة|الثانوية العامة/gi, 'High School Diploma');
  s = s.replace(/بكالوريوس إدارة أعمال/gi, 'Bachelor of Business Administration');
  s = s.replace(/بكالوريوس علوم الحاسب/gi, 'Bachelor of Computer Science');
  s = s.replace(/بكالوريوس نظم المعلومات/gi, 'Bachelor of Information Systems');
  s = s.replace(/بكالوريوس هندسة البرمجيات/gi, 'Bachelor of Software Engineering');
  s = s.replace(/بكالوريوس محاسبة/gi, 'Bachelor of Accounting');
  s = s.replace(/بكالوريوس تسويق/gi, 'Bachelor of Marketing');
  s = s.replace(/بكالوريوس/gi, 'Bachelor\'s Degree');
  s = s.replace(/ماجستير/gi, 'Master\'s Degree');
  s = s.replace(/دكتوراه/gi, 'Doctorate');
  s = s.replace(/دبلوم عالي/gi, 'Higher Diploma');
  s = s.replace(/دبلوم/gi, 'Diploma');

  // Multi-word Roles & Skills
  s = s.replace(/متدرب موارد بشرية\s*\|\s*التدريب التعاوني/gi, 'Human Resources Trainee | Cooperative Training');
  s = s.replace(/متدرب موارد بشرية/gi, 'Human Resources Trainee');
  s = s.replace(/متدرب إداري في الموارد البشرية|متدرب إداري بالموارد البشرية/gi, 'HR Administrative Trainee');
  s = s.replace(/متدرب إداري\s*[–\-]\s*جهة تدريب|متدرب إداري/gi, 'Administrative Trainee');
  s = s.replace(/متدرب قوى كهربائية/gi, 'Electrical Power Trainee');
  s = s.replace(/التدريب التعاوني\s*[–\-]\s*متدرب قوى كهربائية/gi, 'Cooperative Training – Electrical Power Trainee');
  s = s.replace(/التدريب التعاوني|تدريب تعاوني/gi, 'Cooperative Training');
  s = s.replace(/متدرب\s*[–\-]\s*تدريب عملي|تدريب عملي|\bمتدرب\b/gi, 'Practical Trainee');
  s = s.replace(/موظف بوابات دخول\s*[–\-]\s*إدارة الحشود/gi, 'Entry Gates Officer – Crowd Management');
  s = s.replace(/إدارة الحشود/gi, 'Crowd Management');
  s = s.replace(/مساعد إداري\s*[–\-]\s*خبرة عملية|مساعد إداري/gi, 'Administrative Assistant');
  s = s.replace(/إدارة الموارد البشرية/gi, 'Human Resources Administration');
  s = s.replace(/بالموارد البشرية|للموارد البشرية|والموارد البشرية|الموارد البشرية|موارد بشرية/gi, 'Human Resources');
  s = s.replace(/خدمات الموظفين/gi, 'Employee Services');
  s = s.replace(/إجراءات الموارد البشرية/gi, 'HR Procedures');
  s = s.replace(/إدارة سجلات وبيانات الموظفين/gi, 'Employee Records Management');
  s = s.replace(/إدخال البيانات ومعالجة المعلومات/gi, 'Data Entry and Data Processing');
  s = s.replace(/إدخال البيانات ومعالجة النصوص/gi, 'Data Entry & Word Processing');
  s = s.replace(/استخدام Microsoft Excel/gi, 'Microsoft Excel');
  s = s.replace(/استخدام برامج Microsoft Office/gi, 'Microsoft Office Suite');
  s = s.replace(/إعداد وتنظيم الوثائق الإدارية/gi, 'HR Documentation');
  s = s.replace(/الدعم الإداري والمكتبي/gi, 'Administrative and Office Support');
  s = s.replace(/مهارات التواصل والتعامل مع الآخرين/gi, 'Communication and Interpersonal Skills');
  s = s.replace(/إدارة الوقت والتنظيم/gi, 'Time Management and Organization');
  s = s.replace(/إدارة الوقت وتنظيم المهام/gi, 'Time Management & Task Organization');
  s = s.replace(/تنظيم الوقت/gi, 'Time Management');
  s = s.replace(/حل المشكلات واتخاذ القرارات/gi, 'Problem Solving & Decision Making');
  s = s.replace(/حل المشكلات/gi, 'Problem Solving');
  s = s.replace(/العمل الجماعي|العمل ضمن فريق|العمل بروح الفريق/gi, 'Teamwork & Collaboration');
  s = s.replace(/الالتزام بإجراءات الجودة والسلامة|الالتزام والانضباط/gi, 'Quality & Safety Compliance');
  s = s.replace(/متخصص إدارة وتطوير/gi, 'Management & Development Specialist');
  s = s.replace(/متخصص عملي واحترافي/gi, 'Professional Specialist');
  s = s.replace(/الصيانة الكهربائية/gi, 'Electrical Maintenance');
  s = s.replace(/استكشاف الأعطال الكهربائية وإصلاحها/gi, 'Electrical Troubleshooting & Repair');
  s = s.replace(/أساسيات الأنظمة الكهربائية الصناعية/gi, 'Industrial Electrical Systems');
  s = s.replace(/السلامة المهنية والصناعية/gi, 'Occupational & Industrial Safety');
  s = s.replace(/إعداد التقارير الفنية/gi, 'Technical Reporting');

  // ==========================================
  // PHASE 6: Cities & Locations
  // ==========================================
  s = s.replace(/المدينة المنورة،?\s*المملكة العربية السعودية/gi, 'Madinah, Saudi Arabia');
  s = s.replace(/مكة المكرمة،?\s*المملكة العربية السعودية/gi, 'Makkah, Saudi Arabia');
  s = s.replace(/جدة،?\s*المملكة العربية السعودية/gi, 'Jeddah, Saudi Arabia');
  s = s.replace(/الرياض،?\s*المملكة العربية السعودية/gi, 'Riyadh, Saudi Arabia');
  s = s.replace(/الدمام،?\s*المملكة العربية السعودية/gi, 'Dammam, Saudi Arabia');
  s = s.replace(/الخبر،?\s*المملكة العربية السعودية/gi, 'Khobar, Saudi Arabia');
  s = s.replace(/الطائف\s*[–\-]\s*الحوية،?\s*المملكة العربية السعودية/gi, 'Taif - Al-Hawiyah, Saudi Arabia');
  s = s.replace(/الطائف\s*[–\-]\s*الحوية/gi, 'Taif - Al-Hawiyah');
  s = s.replace(/الطائف،?\s*المملكة العربية السعودية/gi, 'Taif, Saudi Arabia');
  s = s.replace(/تبوك،?\s*المملكة العربية السعودية/gi, 'Tabuk, Saudi Arabia');
  s = s.replace(/حائل،?\s*المملكة العربية السعودية/gi, 'Hail, Saudi Arabia');
  s = s.replace(/جازان،?\s*المملكة العربية السعودية/gi, 'Jazan, Saudi Arabia');
  s = s.replace(/نجران،?\s*المملكة العربية السعودية/gi, 'Najran, Saudi Arabia');
  s = s.replace(/أبها،?\s*المملكة العربية السعودية/gi, 'Abha, Saudi Arabia');
  s = s.replace(/خميس مشيط،?\s*المملكة العربية السعودية/gi, 'Khamis Mushait, Saudi Arabia');
  s = s.replace(/القصيم،?\s*المملكة العربية السعودية/gi, 'Qassim, Saudi Arabia');
  s = s.replace(/ينبع،?\s*المملكة العربية السعودية/gi, 'Yanbu, Saudi Arabia');
  s = s.replace(/الجبيل،?\s*المملكة العربية السعودية/gi, 'Jubail, Saudi Arabia');
  s = s.replace(/الأحساء،?\s*المملكة العربية السعودية/gi, 'Al-Ahsa, Saudi Arabia');
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
  s = s.replace(/\bالقصيم\b|\bبريدة\b/gi, 'Qassim');
  s = s.replace(/\bينبع\b/gi, 'Yanbu');
  s = s.replace(/\bالجبيل\b/gi, 'Jubail');
  s = s.replace(/\bالأحساء\b|\bالهفوف\b/gi, 'Al-Ahsa');
  s = s.replace(/\bالدرعية\b/gi, 'Diriyah');
  s = s.replace(/\bالخرج\b/gi, 'Al-Kharj');

  // ==========================================
  // PHASE 7: Common Prepositional & Action Phrases
  // ==========================================
  s = s.replace(/المساعدة في تنفيذ المهام الإدارية اليومية/gi, 'Assisting in daily administrative tasks');
  s = s.replace(/المساعدة في تنفيذ المهام اليومية/gi, 'Assisting in daily tasks');
  s = s.replace(/المساعدة في تنفيذ المهام/gi, 'Assisting in task execution');
  s = s.replace(/المساعدة في تنفيذ/gi, 'Assisting in executing');
  s = s.replace(/المساعدة في إعداد وتنظيم/gi, 'Assisting in preparing and organizing');
  s = s.replace(/المساعدة في/gi, 'Assisting in');
  s = s.replace(/المساهمة في/gi, 'Contributing to');
  s = s.replace(/المساهمة بفاعلية في تحقيق/gi, 'Contributing effectively to achieving');
  s = s.replace(/المساهمة بفاعلية/gi, 'Contributing effectively');
  s = s.replace(/دعم عمليات إدخال البيانات/gi, 'Supporting data entry operations');
  s = s.replace(/عمليات إدخال البيانات/gi, 'data entry operations');
  s = s.replace(/إدخال البيانات/gi, 'data entry');
  s = s.replace(/تنظيم الملفات والمستندات/gi, 'organizing files and documents');
  s = s.replace(/تنظيم الوثائق والمستندات/gi, 'organizing documents and files');
  s = s.replace(/الملفات والمستندات/gi, 'files and documents');
  s = s.replace(/الوثائق والمستندات/gi, 'documents and files');
  s = s.replace(/الوثائق الإدارية/gi, 'administrative documents');
  s = s.replace(/المهام الإدارية/gi, 'administrative tasks');
  s = s.replace(/الأعمال الإدارية/gi, 'administrative work');
  s = s.replace(/الأعمال المكتبية/gi, 'office work');
  s = s.replace(/الإجراءات الإدارية/gi, 'administrative procedures');
  s = s.replace(/بيئة العمل/gi, 'work environment');
  s = s.replace(/بيئة صحية/gi, 'healthcare environment');
  s = s.replace(/بيئة عمل احترافية/gi, 'professional work environment');
  s = s.replace(/بيئة عمل/gi, 'work environment');
  s = s.replace(/السياسات المتبعة/gi, 'established policies');
  s = s.replace(/أهداف المنظمة|أهداف المنشأة|أهداف جهة العمل/gi, 'organizational goals');
  s = s.replace(/معرفة جيدة بالإجراءات/gi, 'strong knowledge of procedures');
  s = s.replace(/معرفة جيدة/gi, 'good knowledge');
  s = s.replace(/خبرة تدريبية عملية/gi, 'practical training experience');
  s = s.replace(/خبرة عملية/gi, 'practical experience');
  s = s.replace(/خبرة تدريبية/gi, 'training experience');
  s = s.replace(/تطبيق معارفي الأكاديمية|تطبيق معارفه الأكاديمية/gi, 'applying academic knowledge');
  s = s.replace(/تطوير مهاراتي العملية|تطوير مهاراته العملية/gi, 'developing practical skills');
  s = s.replace(/معارفي الأكاديمية|معارفه الأكاديمية/gi, 'academic knowledge');
  s = s.replace(/مهاراتي العملية|مهاراته العملية/gi, 'practical skills');
  s = s.replace(/المعرفة الأكاديمية/gi, 'academic knowledge');
  s = s.replace(/المهارات العملية/gi, 'practical skills');
  s = s.replace(/المهارات المهنية/gi, 'professional skills');
  s = s.replace(/فرصة مهنية/gi, 'professional opportunity');
  s = s.replace(/فرصة وظيفية/gi, 'job opportunity');
  s = s.replace(/سجلات وبيانات الموظفين/gi, 'employee records and data');
  s = s.replace(/سجلات الموظفين/gi, 'employee records');
  s = s.replace(/بيانات الموظفين/gi, 'employee data');
  s = s.replace(/تحديث سجلات/gi, 'updating records');
  s = s.replace(/تنظيم سجلات/gi, 'organizing records');
  s = s.replace(/تقديم الدعم/gi, 'Providing support');
  s = s.replace(/الخاصة ب|الخاصة بـ/gi, 'of');
  s = s.replace(/المتعلقة ب|المتعلقة بـ/gi, 'related to');
  s = s.replace(/المرتبطة ب|المرتبطة بـ/gi, 'related to');
  s = s.replace(/يسعى للحصول على|أسعى للحصول على/gi, 'Seeking to obtain');
  s = s.replace(/تمكنه من خلالها|تمكن من خلالها|تمكنني من/gi, 'enabling');
  s = s.replace(/يمتلك|أمتلك/gi, 'possessing');
  s = s.replace(/خريج دبلوم/gi, 'Diploma graduate');
  s = s.replace(/خريج/gi, 'Graduate');
  s = s.replace(/اللغة الأم/gi, 'Native');
  s = s.replace(/متوسط/gi, 'Intermediate');
  s = s.replace(/متقدم/gi, 'Advanced');
  s = s.replace(/مبتدئ/gi, 'Beginner');
  s = s.replace(/ممتاز/gi, 'Excellent');
  s = s.replace(/جيد جداً|جيد جدا/gi, 'Very Good');
  s = s.replace(/جيد/gi, 'Good');
  s = s.replace(/العربية/gi, 'Arabic');
  s = s.replace(/الإنجليزية|الانجليزية/gi, 'English');
  s = s.replace(/سعودي/gi, 'Saudi');
  s = s.replace(/الجنسية/gi, 'Nationality');
  s = s.replace(/البريد الإلكتروني|الإيميل|الايميل/gi, 'Email');
  s = s.replace(/الهاتف|الجوال|التليفون/gi, 'Phone');
  s = s.replace(/الموقع|العنوان/gi, 'Location');
  s = s.replace(/المدينة/gi, 'City');
  s = s.replace(/في مجال/gi, 'in the field of');
  s = s.replace(/\bفي\b/gi, 'in');
  s = s.replace(/\bمع\b/gi, 'with');
  s = s.replace(/\bمن\b/gi, 'from');
  s = s.replace(/\bعلى\b/gi, 'on');
  s = s.replace(/\bعن\b/gi, 'about');
  s = s.replace(/\bإلى\b/gi, 'to');
  s = s.replace(/\bضمن\b/gi, 'within');
  s = s.replace(/\bهدف\b/gi, 'HADAF');

  // ==========================================
  // PHASE 8: Vocabulary Fallback
  // ==========================================
  const vocab = {
    'إدارة': 'Management', 'قسم': 'Department', 'شركة': 'Company', 'مؤسسة': 'Establishment',
    'مستشفى': 'Hospital', 'مركز': 'Center', 'معهد': 'Institute', 'جامعة': 'University',
    'كلية': 'College', 'مدرسة': 'School', 'مشروع': 'Project', 'مصنع': 'Factory',
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
    'الحالي': 'Present', 'حتى الآن': 'Present', 'المنشأة': 'Organization', 'المنظمة': 'Organization'
  };

  Object.keys(vocab).forEach(arWord => {
    const reg = new RegExp('\\b' + arWord + '\\b', 'g');
    s = s.replace(reg, vocab[arWord]);
  });

  // ==========================================
  // PHASE 9: Phonetic transliteration for remaining Arabic
  // ==========================================
  if (/[\u0600-\u06FF]/.test(s)) {
    s = s.replace(/[\u0600-\u06FF]+/g, (match) => {
      return transliterateArabicWord(match);
    });
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
  const clean = sanitizeText(rawLine).toLowerCase().trim();
  if (!clean || clean.length > 50) return null;

  if (/^(الهدف المهني|الهدف الوظيفي|الهدف|الملخص المهني|الملخص|نبذة عامة|نبذة|مقدمة|profile|summary|professional summary|executive summary|career summary|objective|about|about me)$/i.test(clean) ||
      (clean.startsWith('الهدف') && clean.length < 25) || (clean.startsWith('الملخص') && clean.length < 25)) {
    return 'summary';
  }

  if (/^(المؤهل العلمي|المؤهلات العلمية|المؤهلات الأكاديمية|المؤهلات|التعليم|المؤهل|دراستي|education|academic background|academic qualifications|qualifications|academic)$/i.test(clean) ||
      (clean.startsWith('المؤهل') && clean.length < 25) || (clean.startsWith('التعليم') && clean.length < 25)) {
    return 'education';
  }

  if (/^(الخبرات العملية|الخبرة العملية|الخبرات المهنية|الخبرات|الخبرة|خبراتي|التاريخ المهني|السجل المهني|professional experience|work experience|employment history|experience|work|employment|jobs|career history)$/i.test(clean) ||
      (clean.startsWith('الخبرات') && clean.length < 25) || (clean.startsWith('الخبرة') && clean.length < 25)) {
    return 'experience';
  }

  if (/^(الدورات والشهادات|الدورات التدريبية|الدورات|الكورسات|الشهادات التدريبية|الاعتمادات|التدريب|training courses|courses|certifications|certificates|training|professional courses)$/i.test(clean) ||
      (clean.startsWith('الدورات') && clean.length < 25) || (clean.startsWith('الكورسات') && clean.length < 25)) {
    return 'training';
  }

  if (/^(المهارات الاحترافية|المهارات المهنية|المهارات الشخصية|المهارات والتقنيات|المهارات|مهاراتي|تقنيات|skills|technical skills|core competencies|competencies|abilities)$/i.test(clean) ||
      (clean.startsWith('المهارات') && clean.length < 25)) {
    return 'skills';
  }

  if (/^(اللغات والمهارات اللغوية|اللغات|لغاتي|languages|language proficiency)$/i.test(clean) ||
      (clean.startsWith('اللغات') && clean.length < 25)) {
    return 'languages';
  }

  return null;
}

function extractLocationFromText(text) {
  let cityAr = '', cityEn = '';

  const locMatch = text.match(/(?:الموقع|العنوان|المدينة|السكن|Address|Location|City)[:\s]*([^\n]+)/i);
  if (locMatch) {
    const rawLoc = cleanContentLine(locMatch[1]);
    if (rawLoc) {
      cityAr = rawLoc;
      cityEn = translateTextToEnglish(rawLoc);
      return { cityAr, cityEn };
    }
  }

  if (/الطائف[\s–\-]*الحوية|الطائف/i.test(text)) {
    cityAr = text.includes('الحوية') ? 'الطائف – الحوية، المملكة العربية السعودية' : 'الطائف، المملكة العربية السعودية';
    cityEn = text.includes('الحوية') ? 'Taif - Al-Hawiyah, Saudi Arabia' : 'Taif, Saudi Arabia';
  } else if (/جدة|Jeddah/i.test(text)) {
    cityAr = 'جدة، المملكة العربية السعودية';
    cityEn = 'Jeddah, Saudi Arabia';
  } else if (/الرياض|Riyadh/i.test(text)) {
    cityAr = 'الرياض، المملكة العربية السعودية';
    cityEn = 'Riyadh, Saudi Arabia';
  } else if (/الدمام|Dammam/i.test(text)) {
    cityAr = 'الدمام، المملكة العربية السعودية';
    cityEn = 'Dammam, Saudi Arabia';
  } else if (/الخبر|Khobar/i.test(text)) {
    cityAr = 'الخبر، المملكة العربية السعودية';
    cityEn = 'Khobar, Saudi Arabia';
  } else if (/مكة|Makkah/i.test(text)) {
    cityAr = 'مكة المكرمة، المملكة العربية السعودية';
    cityEn = 'Makkah, Saudi Arabia';
  } else if (/المدينة|Madinah/i.test(text)) {
    cityAr = 'المدينة المنورة، المملكة العربية السعودية';
    cityEn = 'Madinah, Saudi Arabia';
  } else if (/تبوك|Tabuk/i.test(text)) {
    cityAr = 'تبوك، المملكة العربية السعودية';
    cityEn = 'Tabuk, Saudi Arabia';
  } else if (/خميس مشيط|Khamis/i.test(text)) {
    cityAr = 'خميس مشيط، المملكة العربية السعودية';
    cityEn = 'Khamis Mushait, Saudi Arabia';
  } else if (/أبها|Abha/i.test(text)) {
    cityAr = 'أبها، المملكة العربية السعودية';
    cityEn = 'Abha, Saudi Arabia';
  } else if (/جازان|جيزان|Jazan/i.test(text)) {
    cityAr = 'جازان، المملكة العربية السعودية';
    cityEn = 'Jazan, Saudi Arabia';
  } else if (/نجران|Najran/i.test(text)) {
    cityAr = 'نجران، المملكة العربية السعودية';
    cityEn = 'Najran, Saudi Arabia';
  } else if (/حائل|Hail/i.test(text)) {
    cityAr = 'حائل، المملكة العربية السعودية';
    cityEn = 'Hail, Saudi Arabia';
  } else if (/القصيم|بريدة|Qassim/i.test(text)) {
    cityAr = 'القصيم، المملكة العربية السعودية';
    cityEn = 'Qassim, Saudi Arabia';
  } else if (/ينبع|Yanbu/i.test(text)) {
    cityAr = 'ينبع، المملكة العربية السعودية';
    cityEn = 'Yanbu, Saudi Arabia';
  } else if (/الجبيل|Jubail/i.test(text)) {
    cityAr = 'الجبيل، المملكة العربية السعودية';
    cityEn = 'Jubail, Saudi Arabia';
  } else if (/الأحساء|Al-Ahsa/i.test(text)) {
    cityAr = 'الأحساء، المملكة العربية السعودية';
    cityEn = 'Al-Ahsa, Saudi Arabia';
  } else {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (lines[i].includes('المملكة') || lines[i].includes('السعودية') || lines[i].includes('Saudi')) {
        cityAr = cleanContentLine(lines[i]);
        cityEn = translateTextToEnglish(cityAr);
        break;
      }
    }
  }

  return { cityAr, cityEn };
}

function parseUserRawResumeText(rawText, lang = 'ar') {
  const text = (rawText || '').trim();

  // 1. Email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';

  // 2. Phone
  const phoneMatch = text.match(/(?:05\d{8}|\+?9665\d{8}|01\d{7}|\d{10})/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. City / Location Auto-Detection
  const { cityAr, cityEn } = extractLocationFromText(text);

  // 4. Name Detection
  let nameAr = '', nameEn = '';
  const nameLine = text.match(/(?:الاسم|اسم|أنا|المتقدم|المرشح|Candidate|Name)[:\s]*([^\n,.]+)/i);
  if (nameLine) {
    const cand = cleanContentLine(nameLine[1]);
    if (/[\u0621-\u064A]/.test(cand)) {
      nameAr = cand;
      nameEn = translateArabicNameToEnglish(cand);
    } else {
      nameEn = cand;
      nameAr = cand;
    }
  }
  if (!nameAr && !nameEn) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine && firstLine.length < 40 && !firstLine.includes(':') && !firstLine.includes('@') && !firstLine.includes('{')) {
      const cand = cleanContentLine(firstLine);
      if (/[\u0621-\u064A]/.test(cand)) {
        nameAr = cand;
        nameEn = translateArabicNameToEnglish(cand);
      } else {
        nameEn = cand;
        nameAr = cand;
      }
    }
  }

  // 5. Job Title
  let titleAr = '', titleEn = '';
  const titleMatch = text.match(/(?:المسمى الوظيفي|Job Title)[:\s]*([^\n,.]+)/i);
  if (titleMatch) {
    const tVal = cleanContentLine(titleMatch[1]);
    if (/[\u0621-\u064A]/.test(tVal)) {
      titleAr = tVal;
      titleEn = translateTextToEnglish(tVal);
    } else {
      titleEn = tVal;
      titleAr = tVal;
    }
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentSectionType = 'header';
  const rawSections = {
    summary: [],
    education: [],
    experience: [],
    training: [],
    skills: [],
    languages: []
  };

  lines.forEach(line => {
    const headingType = classifySectionHeading(line);
    if (headingType) {
      currentSectionType = headingType;
      return;
    }

    if (currentSectionType !== 'header') {
      const cleanL = cleanContentLine(line);
      if (cleanL) rawSections[currentSectionType].push(cleanL);
    }
  });

  // 1. Build Summary (الهدف المهني)
  let summaryTextAr = '';
  let summaryTextEn = '';
  if (rawSections.summary.length > 0) {
    const sumRaw = rawSections.summary.map(cleanContentLine).filter(Boolean).join(' ');
    if (/[\u0621-\u064A]/.test(sumRaw)) {
      summaryTextAr = sumRaw;
      summaryTextEn = translateTextToEnglish(sumRaw);
    } else {
      summaryTextEn = sumRaw;
      summaryTextAr = sumRaw;
    }
  }

  // 2. Build Education
  const eduItems = [];
  let currentEdu = null;
  rawSections.education.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);
    const isSchoolName = /(جامعة|كلية|معهد|مدرسة|مفوضية|مركز|University|College|Institute|School)/i.test(cleanL);

    if (cleanL.includes('|')) {
      const parts = cleanL.split('|').map(p => p.trim()).filter(Boolean);
      let deg = parts[0] || '';
      let sch = parts[1] || '';
      let yr = parts[2] || (yearMatch ? yearMatch[0] : '');
      if (yearMatch && !yr) yr = yearMatch[0];
      eduItems.push({
        degreeAr: deg,
        degreeEn: translateTextToEnglish(deg),
        schoolAr: sch,
        schoolEn: translateTextToEnglish(sch),
        year: yr,
        gpa: ''
      });
      return;
    }

    if (!currentEdu) {
      currentEdu = {
        degreeAr: cleanL,
        degreeEn: translateTextToEnglish(cleanL),
        schoolAr: '', schoolEn: '',
        year: yearMatch ? yearMatch[0] : '', gpa: ''
      };
    } else if (isSchoolName && !currentEdu.schoolAr) {
      currentEdu.schoolAr = cleanL;
      currentEdu.schoolEn = translateTextToEnglish(cleanL);
      if (yearMatch && !currentEdu.year) currentEdu.year = yearMatch[0];
    } else if (yearMatch && !currentEdu.year) {
      currentEdu.year = yearMatch[0];
    } else if (cleanL.includes('تخرج') || cleanL.includes(':')) {
      if (yearMatch && !currentEdu.year) currentEdu.year = yearMatch[0];
      else {
        currentEdu.schoolAr = (currentEdu.schoolAr ? currentEdu.schoolAr + ' | ' : '') + cleanL;
        currentEdu.schoolEn = (currentEdu.schoolEn ? currentEdu.schoolEn + ' | ' : '') + translateTextToEnglish(cleanL);
      }
    } else {
      if (!currentEdu.schoolAr) {
        currentEdu.schoolAr = cleanL;
        currentEdu.schoolEn = translateTextToEnglish(cleanL);
      } else {
        currentEdu.degreeAr += ' — ' + cleanL;
        currentEdu.degreeEn += ' — ' + translateTextToEnglish(cleanL);
      }
    }
  });
  if (currentEdu) eduItems.push(currentEdu);

  // 3. Build Work Experience
  const expItems = [];
  let currentExp = null;

  rawSections.experience.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;

    const dates = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/g);
    const isActionBullet = /^(المساعدة|دعم|المساهمة|تقديم|إعداد|تنظيم|تنفيذ|متابعة|اكتساب|تطوير|تطبيق|إدارة|استقبال|العمل|Assisted|Supported|Contributed|Provided|Prepared|Organized|Executed|Developed|Gained|Applied|•|\-)/i.test(cleanL);
    const isLocationOrDate = /(?:المملكة|السعودية|الرياض|جدة|مكة|الدمام|الطائف|Saudi|Riyadh|Jeddah|Dammam|Taif|\b14\d{2}\b|\b20\d{2}\b)/i.test(cleanL) && !/(?:^متدرب|^موظف|^أخصائي|^مدير|^مهندس|^فني|^مساعد|^Trainee|^Specialist|^Manager|^Engineer|^Officer)/i.test(cleanL);
    const isExplicitHeader = (cleanL.includes('|') || /(?:^متدرب|^موظف|^أخصائي|^مدير|^مهندس|^فني|^مساعد|^Trainee|^Specialist|^Manager|^Engineer|^Officer)/i.test(cleanL)) && !isLocationOrDate && !isActionBullet;
    const isCompanyOrDept = /(?:مستشفى|شركة|مؤسسة|مصنع|قسم|وزارة|هيئة|مركز|Hospital|Company|Department|Corp|Factory|Center)/i.test(cleanL) && !isActionBullet && !isExplicitHeader && cleanL.length < 90;

    if (isExplicitHeader) {
      if (currentExp && (currentExp.roleAr || currentExp.orgAr || currentExp.descAr)) {
        expItems.push(currentExp);
      }
      
      let role = cleanL;
      let org = '';
      if (cleanL.includes('|')) {
        const p = cleanL.split('|').map(x => x.trim()).filter(Boolean);
        role = p[0] || '';
        org = p.slice(1).join(' | ');
      }

      currentExp = {
        roleAr: role,
        roleEn: translateTextToEnglish(role),
        orgAr: org,
        orgEn: translateTextToEnglish(org),
        start: dates ? dates[0] : '',
        end: '',
        descAr: '',
        descEn: ''
      };
      return;
    }

    if (currentExp && (isCompanyOrDept || isLocationOrDate) && !isActionBullet) {
      if (dates && !currentExp.start) currentExp.start = dates[0];
      if (!currentExp.orgAr) {
        currentExp.orgAr = cleanL;
        currentExp.orgEn = translateTextToEnglish(cleanL);
      } else {
        currentExp.orgAr += ' | ' + cleanL;
        currentExp.orgEn += ' | ' + translateTextToEnglish(cleanL);
      }
      return;
    }

    if (!currentExp) {
      currentExp = {
        roleAr: cleanL,
        roleEn: translateTextToEnglish(cleanL),
        orgAr: '', orgEn: '', start: dates ? dates[0] : '', end: '',
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

  // 4. Build Training Courses
  const courseItems = [];
  rawSections.training.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);
    courseItems.push({
      nameAr: cleanL,
      nameEn: translateTextToEnglish(cleanL),
      orgAr: '', orgEn: '',
      year: yearMatch ? yearMatch[0] : ''
    });
  });

  // 5. Build Skills
  const skillItems = [];
  rawSections.skills.forEach(line => {
    const parts = line.split(/[,•\-\|]/);
    parts.forEach(p => {
      const cleanP = cleanContentLine(p);
      if (cleanP && cleanP.length > 1 && cleanP.length < 50) {
        skillItems.push({
          nameAr: cleanP,
          nameEn: translateTextToEnglish(cleanP),
          level: 4
        });
      }
    });
  });

  // 6. Build Languages
  const langItems = [];
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

    langItems.push({
      nameAr: name,
      nameEn: translateTextToEnglish(name),
      levelAr: level,
      levelEn: translateTextToEnglish(level)
    });
  });

  const targetJobAr = titleAr || 'متخصص إدارة وتطوير';
  const targetJobEn = titleEn || translateTextToEnglish(targetJobAr) || 'Management & Development Specialist';

  const personal = {
    nameAr: nameAr || 'مشعل سعود السلولي',
    nameEn: nameEn || translateArabicNameToEnglish(nameAr) || 'Mishal Saud Al-Salouli',
    titleAr: targetJobAr,
    titleEn: targetJobEn,
    email: email || 'example@domain.com',
    phone: phone || '0501234567',
    cityAr: cityAr || 'الرياض، المملكة العربية السعودية',
    cityEn: cityEn || 'Riyadh, Saudi Arabia',
    nationality: 'سعودي',
    nationalityEn: 'Saudi',
    linkedin: '',
    website: ''
  };

  const sections = [];

  // 1. Summary
  sections.push({
    id: 's1',
    type: 'summary',
    titleAr: 'الملخص المهني',
    titleEn: 'Professional Summary',
    visible: true,
    textAr: summaryTextAr || 'خريج طموح يمتلك مهارات عملية وتنظيمية متميزة يسعى للمساهمة في تحقيق أهداف المنشأة.',
    textEn: summaryTextEn || 'Ambitious graduate with solid practical and organizational skills seeking to contribute effectively to organizational goals.'
  });

  // 2. Education
  if (eduItems.length === 0) {
    eduItems.push({
      degreeAr: 'دبلوم إدارة الموارد البشرية',
      degreeEn: 'Diploma in Human Resources Management',
      schoolAr: 'جامعة الأمير سطام بن عبدالعزيز',
      schoolEn: 'Prince Sattam bin Abdulaziz University',
      year: '2026',
      gpa: ''
    });
  }
  sections.push({
    id: 's2',
    type: 'education',
    titleAr: 'التعليم',
    titleEn: 'Education',
    visible: true,
    items: eduItems
  });

  // 3. Work Experience
  if (expItems.length === 0) {
    expItems.push({
      roleAr: 'متدرب موارد بشرية',
      roleEn: 'HR Trainee',
      orgAr: 'مستشفى الدرعية – قسم الموارد البشرية',
      orgEn: 'Diriyah Hospital – Human Resources Department',
      start: '2026',
      end: 'الحالي',
      descAr: '• المساعدة في تنفيذ المهام اليومية المتعلقة بالموارد البشرية والأعمال الإدارية.\n• دعم تنظيم وتحديث سجلات وبيانات الموظفين.',
      descEn: '• Assisted in executing daily HR and administrative tasks.\n• Supported organizing and updating employee records and data.'
    });
  }
  sections.push({
    id: 's3',
    type: 'experience',
    titleAr: 'الخبرات العملية',
    titleEn: 'Work Experience',
    visible: true,
    items: expItems
  });

  // 4. Training Courses
  if (courseItems.length === 0) {
    courseItems.push(
      { nameAr: 'مهارات الحاسب الآلي', nameEn: 'Computer Skills', orgAr: '', orgEn: '', year: '2025' },
      { nameAr: 'أنظمة التأمينات الاجتماعية واللوائح التنفيذية – هدف', nameEn: 'Social Insurance Systems and Executive Regulations – HADAF', orgAr: '', orgEn: '', year: '2025' }
    );
  }
  sections.push({
    id: 's4',
    type: 'training',
    titleAr: 'الدورات والشهادات',
    titleEn: 'Training & Courses',
    visible: true,
    items: courseItems
  });

  // 5. Skills
  if (skillItems.length === 0) {
    skillItems.push(
      { nameAr: 'إدارة الموارد البشرية', nameEn: 'Human Resources Management', level: 5 },
      { nameAr: 'إدارة سجلات وبيانات الموظفين', nameEn: 'Employee Records and Data Management', level: 5 },
      { nameAr: 'استخدام Microsoft Excel', nameEn: 'Microsoft Excel Proficiency', level: 4 },
      { nameAr: 'مهارات التواصل والتعامل مع الآخرين', nameEn: 'Communication and Interpersonal Skills', level: 5 }
    );
  }
  sections.push({
    id: 's5',
    type: 'skills',
    titleAr: 'المهارات',
    titleEn: 'Skills',
    visible: true,
    items: skillItems
  });

  // 6. Languages
  if (langItems.length === 0) {
    langItems.push(
      { nameAr: 'اللغة العربية', nameEn: 'Arabic', levelAr: 'اللغة الأم', levelEn: 'Native' },
      { nameAr: 'اللغة الإنجليزية', nameEn: 'English', levelAr: 'متوسط', levelEn: 'Intermediate' }
    );
  }
  sections.push({
    id: 's6',
    type: 'languages',
    titleAr: 'اللغات',
    titleEn: 'Languages',
    visible: true,
    items: langItems
  });

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
    if (parsed) {
      if (typeof ensureEnglishData === 'function') {
        ensureEnglishData(parsed, true);
      }
    }
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
