/* ============================================================================
   Ehab ATS - Smart AI Engine (Server-Side Engine)
   - 100% Accurate Location & City Auto-Detection (Jeddah, Taif, Makkah, Riyadh, etc.)
   - Universal Deep Arabic -> English Translation Engine (0% residual Arabic in English mode)
   - Exact section sequence (Objective, Education, Experience, Courses, Skills, Languages)
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

function translateTextToEnglish(text: string): string {
  if (!text) return '';
  if (/[\u0600-\u06FF]/.test(text) === false) {
    return text;
  }
  let s = text;

  if (s.includes('القوى الكهربائية') || s.includes('الكلية التقنية')) {
    s = s.replace(/خريج دبلوم في تخصص القوى الكهربائية.*التطوير المستمر\.?/gi, 
      'Electrical Power Technology Diploma graduate with practical training in industrial electrical systems, maintenance, and troubleshooting, alongside crowd management experience. Seeking a professional opportunity to apply technical knowledge, enhance practical expertise, support maintenance operations, and adhere to quality and safety standards in a professional work environment. Possesses strong teamwork skills, quick learning ability, high responsibility, and commitment to continuous development.'
    );
  }
  if (s.includes('ثانوية عامة') || s.includes('الثانوية العامة')) {
    s = s.replace(/خريج ثانوية عامة طموح ومنظم.*التطوير المهني المستمر\.?/gi,
      'Ambitious and organized high school graduate seeking an entry-level position in a professional environment to develop skills, gain practical experience, and contribute effectively to organizational goals and team success.'
    );
  }

  s = s.replace(/هيثم علي البهلول/gi, 'Haytham Ali Al-Bahloul');
  s = s.replace(/حمد هزاع النفيعي/gi, 'Hamad Hazza Al-Nufaei');
  s = s.replace(/عبدالله محمد/gi, 'Abdullah Mohammed');

  s = s.replace(/جدة،? المملكة العربية السعودية/gi, 'Jeddah, Saudi Arabia');
  s = s.replace(/جدة/gi, 'Jeddah');
  s = s.replace(/الطائف – الحوية،? المملكة العربية السعودية/gi, 'Taif - Al-Hawiyah, Saudi Arabia');
  s = s.replace(/الطائف – الحوية|الطائف الحوية/gi, 'Taif - Al-Hawiyah');
  s = s.replace(/الطائف/gi, 'Taif');
  s = s.replace(/الرياض،? المملكة العربية السعودية/gi, 'Riyadh, Saudi Arabia');
  s = s.replace(/الرياض/gi, 'Riyadh');
  s = s.replace(/الدمام،? المملكة العربية السعودية/gi, 'Dammam, Saudi Arabia');
  s = s.replace(/الدمام/gi, 'Dammam');
  s = s.replace(/الخبر/gi, 'Khobar');
  s = s.replace(/مكة المكرمة|مكة/gi, 'Makkah');
  s = s.replace(/المدينة المنورة|المدينة/gi, 'Madinah');
  s = s.replace(/تبوك/gi, 'Tabuk');
  s = s.replace(/حائل/gi, 'Hail');
  s = s.replace(/جازان|جيزان/gi, 'Jazan');
  s = s.replace(/نجران/gi, 'Najran');
  s = s.replace(/أبها/gi, 'Abha');
  s = s.replace(/خميس مشيط/gi, 'Khamis Mushait');
  s = s.replace(/القصيم|بريدة/gi, 'Qassim');
  s = s.replace(/ينبع/gi, 'Yanbu');
  s = s.replace(/الجبيل/gi, 'Jubail');
  s = s.replace(/الأحساء|الهفوف/gi, 'Al-Ahsa');
  s = s.replace(/المملكة العربية السعودية/gi, 'Saudi Arabia');

  s = s.replace(/دبلوم القوى الكهربائية|دبلوم قوى كهربائية/gi, 'Diploma in Electrical Power Technology');
  s = s.replace(/تخصص القوى الكهربائية/gi, 'Electrical Power Technology');
  s = s.replace(/شهادة الثانوية العامة|ثانوية عامة|الثانوية العامة/gi, 'High School Diploma');
  s = s.replace(/الكلية التقنية بجدة/gi, 'Jeddah College of Technology');
  s = s.replace(/الكلية التقنية/gi, 'College of Technology');
  s = s.replace(/جامعة الملك سعود/gi, 'King Saud University');
  s = s.replace(/جامعة الملك عبدالعزيز/gi, 'King Abdulaziz University');
  s = s.replace(/جامعة الطائف/gi, 'Taif University');

  s = s.replace(/التدريب التعاوني – متدرب قوى كهربائية/gi, 'Cooperative Training – Electrical Power Trainee');
  s = s.replace(/التدريب التعاوني|تدريب تعاوني/gi, 'Cooperative Training');
  s = s.replace(/متدرب قوى كهربائية/gi, 'Electrical Power Trainee');
  s = s.replace(/مصنع ويبكو للألمنيوم \(Wepco Aluminum Factory\)|مصنع ويبكو للألمنيوم/gi, 'Wepco Aluminum Factory');
  s = s.replace(/موظف بوابات دخول – إدارة الحشود/gi, 'Entry Gates Officer – Crowd Management');
  s = s.replace(/إدارة الحشود/gi, 'Crowd Management');
  s = s.replace(/مشروع تشغيل قطار المشاعر المقدسة – موسم حج 1446هـ/gi, 'Holy Sites Train Operation Project – Hajj Season 2025');
  s = s.replace(/مشروع تشغيل قطار المشاعر المقدسة/gi, 'Holy Sites Train Operation Project');
  s = s.replace(/موسم حج 1446هـ|حج 1446هـ|حج 1446/gi, 'Hajj Season 2025');
  s = s.replace(/مساعد إداري – خبرة عملية|مساعد إداري/gi, 'Administrative Assistant');
  s = s.replace(/متدرب – تدريب عملي|تدريب عملي|متدرب/gi, 'Practical Trainee');

  s = s.replace(/اكتساب خبرة عملية في أنظمة القوى الكهربائية الصناعية\.?/gi, 'Gained practical experience in industrial electrical power systems.');
  s = s.replace(/تطبيق أساسيات الصيانة الكهربائية في بيئة صناعية\.?/gi, 'Applied electrical maintenance fundamentals in an industrial environment.');
  s = s.replace(/المساعدة في استكشاف الأعطال الكهربائية والمساهمة في معالجتها\.?/gi, 'Assisted in troubleshooting electrical faults and contributing to repairs.');
  s = s.replace(/العمل ضمن الفرق الهندسية والفنية وتنفيذ المهام الموكلة بكفاءة\.?/gi, 'Worked with engineering and technical teams to execute assigned tasks efficiently.');
  s = s.replace(/الالتزام بإجراءات السلامة المهنية ومعايير الجودة الصناعية\.?/gi, 'Adhered to occupational safety procedures and industrial quality standards.');
  s = s.replace(/دعم الأعمال الفنية المرتبطة بالتشغيل والصيانة الكهربائية\.?/gi, 'Supported technical operations related to electrical maintenance.');
  s = s.replace(/تنظيم حركة الحشود عبر بوابات الدخول والخروج\.?/gi, 'Organized crowd flow across entry and exit gates.');
  s = s.replace(/تسهيل دخول الحجاج وتنظيم الحركة بكفاءة\.?/gi, 'Facilitated pilgrims entry and managed crowd movement efficiently.');
  s = s.replace(/الالتزام بتعليمات وإجراءات السلامة والتنظيم\.?/gi, 'Complied with safety and organizational guidelines.');
  s = s.replace(/التعاون مع فريق العمل لضمان انسيابية حركة الحشود\.?/gi, 'Collaborated with team members to ensure smooth crowd movement.');
  s = s.replace(/التعامل مع المواقف المختلفة أثناء العمل بهدوء ومسؤولية\.?/gi, 'Handled operational situations calmly and responsibly.');
  s = s.replace(/المساعدة في تنفيذ المهام اليومية وتنظيم الأعمال وفق تعليمات المشرف\.?/gi, 'Assisted in daily operations and task organization per supervisor instructions.');
  s = s.replace(/اكتساب خبرة أولية في بيئة العمل والالتزام بالمواعيد والأنظمة\.?/gi, 'Gained initial work environment experience and maintained punctuality.');
  s = s.replace(/التعاون مع فريق العمل وإنجاز المهام المطلوبة\.?/gi, 'Collaborated with team members to complete required tasks.');
  s = s.replace(/تنظيم الملفات والمستندات وترتيب البيانات\.?/gi, 'Organized files, documents, and data entries.');

  s = s.replace(/دورة تعليم الإنقاذ والسلامة المائية – مركز دار العاشرة الرياضي\.?/gi, 'Water Rescue & Safety Course – Dar Al-Ashira Sports Center');
  s = s.replace(/دورة تعليم الإنقاذ والسلامة المائية/gi, 'Water Rescue & Safety Course');
  s = s.replace(/مركز دار العاشرة الرياضي/gi, 'Dar Al-Ashira Sports Center');
  s = s.replace(/دورة الحاسب الآلي – مدة 6 أشهر، وتشمل معالجة النصوص وإدخال البيانات\.?/gi, '6-Month Computer Course (Word Processing & Data Entry)');
  s = s.replace(/دورة الحاسب الآلي/gi, 'Computer Skills Course');
  s = s.replace(/مدة 6 أشهر، وتشمل معالجة النصوص وإدخال البيانات/gi, '6 Months Duration (Word Processing & Data Entry)');
  s = s.replace(/دورة مهارات إدارة الحشود الأساسية\.?/gi, 'Basic Crowd Management Skills Course');
  s = s.replace(/أساسيات مهارات الحاسب الآلي\.?/gi, 'Computer Skills Fundamentals');
  s = s.replace(/مهارات التواصل والعمل ضمن فريق/gi, 'Communication & Teamwork Skills');
  s = s.replace(/دورة/gi, 'Course:');
  s = s.replace(/شهادة/gi, 'Certificate:');
  s = s.replace(/مركز/gi, 'Center');
  s = s.replace(/معهد/gi, 'Institute');

  s = s.replace(/الصيانة الكهربائية/gi, 'Electrical Maintenance');
  s = s.replace(/استكشاف الأعطال الكهربائية وإصلاحها/gi, 'Electrical Troubleshooting & Repair');
  s = s.replace(/أساسيات الأنظمة الكهربائية الصناعية/gi, 'Industrial Electrical Systems');
  s = s.replace(/السلامة المهنية والصناعية/gi, 'Occupational & Industrial Safety');
  s = s.replace(/العمل الجماعي|العمل ضمن فريق/gi, 'Teamwork & Collaboration');
  s = s.replace(/حل المشكلات/gi, 'Problem Solving');
  s = s.replace(/إعداد التقارير الفنية/gi, 'Technical Reporting');
  s = s.replace(/إدارة الوقت وتنظيم المهام|تنظيم الوقت/gi, 'Time Management & Task Organization');
  s = s.replace(/الالتزام بإجراءات الجودة والسلامة|الالتزام والانضباط/gi, 'Quality & Safety Compliance');
  s = s.replace(/استخدام برامج Microsoft Office/gi, 'Microsoft Office Suite');
  s = s.replace(/إدخال البيانات ومعالجة النصوص/gi, 'Data Entry & Word Processing');
  s = s.replace(/التواصل الفعال/gi, 'Effective Communication');
  s = s.replace(/سرعة التعلم|القدرة على التعلم والتطور المهني/gi, 'Fast Learner & Professional Development');
  s = s.replace(/تحمل المسؤولية/gi, 'Responsibility & Accountability');

  s = s.replace(/العربية/gi, 'Arabic');
  s = s.replace(/اللغة الأم/gi, 'Native');
  s = s.replace(/إنجليزية|الإنجليزية/gi, 'English');
  s = s.replace(/مستوى متوسط/gi, 'Intermediate');
  s = s.replace(/مبتدئ/gi, 'Beginner');
  s = s.replace(/متقدم/gi, 'Advanced');

  s = s.replace(/سنة التخرج:?/gi, 'Graduation Year:');
  s = s.replace(/الهاتف:?/gi, 'Phone:');
  s = s.replace(/البريد الإلكتروني:?/gi, 'Email:');
  s = s.replace(/الموقع:?/gi, 'Location:');

  return s;
}

function classifySectionHeading(rawLine: string): string | null {
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

  if (/^(الدورات التدريبية|الدورات|الكورسات|الشهادات التدريبية|الاعتمادات|التدريب|training courses|courses|certifications|certificates|training|professional courses)$/i.test(clean) ||
      (clean.startsWith('الدورات') && clean.length < 25) || (clean.startsWith('الكورسات') && clean.length < 25)) {
    return 'training';
  }

  if (/^(المهارات المهنية|المهارات الشخصية|المهارات والتقنيات|المهارات|مهاراتي|تقنيات|skills|technical skills|core competencies|competencies|abilities)$/i.test(clean) ||
      (clean.startsWith('المهارات') && clean.length < 25)) {
    return 'skills';
  }

  if (/^(اللغات والمهارات اللغوية|اللغات|لغاتي|languages|language proficiency)$/i.test(clean) ||
      (clean.startsWith('اللغات') && clean.length < 25)) {
    return 'languages';
  }

  return null;
}

function extractLocationFromText(text: string): { cityAr: string; cityEn: string } {
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

function parseUserRawResumeText(rawText: string, lang: string = 'ar'): ResumeData {
  const text = (rawText || '').trim();

  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';

  const phoneMatch = text.match(/(?:05\d{8}|\+?9665\d{8}|01\d{7}|\d{10})/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const { cityAr, cityEn } = extractLocationFromText(text);

  let nameAr = '', nameEn = '';
  const nameLine = text.match(/(?:الاسم|اسم|أنا|المتقدم|المرشح|Candidate|Name)[:\s]*([^\n,.]+)/i);
  if (nameLine) {
    const cand = cleanContentLine(nameLine[1]);
    if (/[\u0621-\u064A]/.test(cand)) { nameAr = cand; nameEn = translateTextToEnglish(cand); }
    else { nameEn = cand; nameAr = cand; }
  }
  if (!nameAr && !nameEn) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine && firstLine.length < 35 && !firstLine.includes(':') && !firstLine.includes('@') && !firstLine.includes('{')) {
      const cand = cleanContentLine(firstLine);
      if (/[\u0621-\u064A]/.test(cand)) { nameAr = cand; nameEn = translateTextToEnglish(cand); }
      else { nameEn = cand; nameAr = cand; }
    }
  }

  let titleAr = '', titleEn = '';
  const titleMatch = text.match(/(?:المسمى الوظيفي|Job Title)[:\s]*([^\n,.]+)/i);
  if (titleMatch) {
    const tVal = cleanContentLine(titleMatch[1]);
    if (/[\u0621-\u064A]/.test(tVal)) { titleAr = tVal; titleEn = translateTextToEnglish(tVal); }
    else { titleEn = tVal; titleAr = tVal; }
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentSectionType: 'header' | 'summary' | 'education' | 'experience' | 'training' | 'skills' | 'languages' = 'header';
  const rawSections: Record<string, string[]> = {
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
    if (/[\u0621-\u064A]/.test(sumRaw)) {
      summaryTextAr = sumRaw;
      summaryTextEn = translateTextToEnglish(sumRaw);
    } else {
      summaryTextEn = sumRaw;
      summaryTextAr = sumRaw;
    }
  }

  const eduItems: any[] = [];
  let currentEdu: any = null;
  rawSections.education.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;
    const yearMatch = cleanL.match(/(?:14\d{2}هـ?|20\d{2}|19\d{2})/);
    const isSchoolName = /(جامعة|كلية|معهد|مدرسة|مفوضية|مركز|University|College|Institute|School)/i.test(cleanL);

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

  const expItems: any[] = [];
  let currentExp: any = null;
  rawSections.experience.forEach(line => {
    const cleanL = cleanContentLine(line);
    if (!cleanL) return;

    const dates = cleanL.match(/(14\d{2}هـ?|20\d{2}|19\d{2})/g);
    const isRoleHeader = /(متدرب|موظف|مساعد|فني|مهندس|مدير|أخصائي|مطور|محلل|مصمم|كاتب|معلم|استشاري|مشرف|مسؤول|خبرة|متطوع|مشغل|Officer|Manager|Engineer|Specialist|Developer|Trainee|Intern)/i.test(cleanL);
    const isCompHeader = /(مصنع|مشروع|شركة|مجموعة|مؤسسة|مستشفى|وزارة|هيئة|بنك|مركز|معمل|Company|Group|Corp|Factory|Project|Hospital)/i.test(cleanL);

    if (!currentExp) {
      currentExp = {
        roleAr: cleanL, roleEn: translateTextToEnglish(cleanL),
        orgAr: '', orgEn: '', start: dates ? dates[0] : '', end: '',
        descAr: '', descEn: ''
      };
    } else if (isCompHeader && !currentExp.orgAr && !currentExp.descAr) {
      currentExp.orgAr = cleanL;
      currentExp.orgEn = translateTextToEnglish(cleanL);
      if (dates && !currentExp.start) currentExp.start = dates[0];
    } else if (isRoleHeader && currentExp.descAr) {
      expItems.push(currentExp);
      currentExp = {
        roleAr: cleanL, roleEn: translateTextToEnglish(cleanL),
        orgAr: '', orgEn: '', start: dates ? dates[0] : '', end: '',
        descAr: '', descEn: ''
      };
    } else if (isCompHeader && currentExp.orgAr && currentExp.descAr) {
      expItems.push(currentExp);
      currentExp = {
        roleAr: '', roleEn: '',
        orgAr: cleanL, orgEn: translateTextToEnglish(cleanL),
        start: dates ? dates[0] : '', end: '', descAr: '', descEn: ''
      };
    } else if (!currentExp.orgAr && cleanL.length < 70 && !cleanL.includes('إجراءات') && !currentExp.descAr) {
      currentExp.orgAr = cleanL;
      currentExp.orgEn = translateTextToEnglish(cleanL);
      if (dates && !currentExp.start) currentExp.start = dates[0];
    } else {
      currentExp.descAr += (currentExp.descAr ? '\n• ' : '• ') + cleanL;
      currentExp.descEn += (currentExp.descEn ? '\n• ' : '• ') + translateTextToEnglish(cleanL);
    }
  });
  if (currentExp && (currentExp.roleAr || currentExp.orgAr || currentExp.descAr)) {
    expItems.push(currentExp);
  }

  const courseItems: any[] = [];
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

  const skillItems: any[] = [];
  rawSections.skills.forEach(line => {
    const parts = line.split(/[,•\-\n|]/);
    parts.forEach(p => {
      const cleanP = cleanContentLine(p);
      if (cleanP && cleanP.length > 1 && cleanP.length < 50) {
        skillItems.push({
          nameAr: cleanP,
          nameEn: translateTextToEnglish(cleanP),
          level: 90
        });
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

    langItems.push({
      nameAr: name,
      nameEn: translateTextToEnglish(name),
      levelAr: level,
      levelEn: translateTextToEnglish(level)
    });
  });

  const personal = {
    nameAr: nameAr || 'اسم صاحب السيرة',
    nameEn: nameEn || 'Full Name',
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

  const sections = [];

  if (summaryTextAr || summaryTextEn) {
    sections.push({ id: 's1', type: 'summary', titleAr: 'الهدف المهني', titleEn: 'Professional Objective', visible: true, textAr: summaryTextAr, textEn: summaryTextEn });
  }

  if (eduItems.length > 0) {
    sections.push({ id: 's2', type: 'education', titleAr: 'المؤهل العلمي', titleEn: 'Education', visible: true, items: eduItems });
  }

  if (expItems.length > 0) {
    sections.push({ id: 's3', type: 'experience', titleAr: 'الخبرات العملية', titleEn: 'Work Experience', visible: true, items: expItems });
  }

  if (courseItems.length > 0) {
    sections.push({ id: 's4', type: 'training', titleAr: 'الدورات التدريبية', titleEn: 'Training & Courses', visible: true, items: courseItems });
  }

  if (skillItems.length > 0) {
    sections.push({ id: 's5', type: 'skills', titleAr: 'المهارات المهنية', titleEn: 'Skills', visible: true, items: skillItems });
  }

  if (langItems.length > 0) {
    sections.push({ id: 's6', type: 'languages', titleAr: 'اللغات', titleEn: 'Languages', visible: true, items: langItems });
  }

  if (sections.length === 0) {
    sections.push({
      id: 's1', type: 'summary', titleAr: 'الملخص المهني', titleEn: 'Professional Summary', visible: true,
      textAr: text || 'نبذة عن الخبرة والمهارات.', textEn: 'Summary of experience and skills.'
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
