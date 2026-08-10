/* ===== Ehab ATS — ATS Analysis Engine ===== */

const ATS_ACTION_VERBS_EN = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'improved', 'increased', 'decreased', 'reduced', 'achieved', 'delivered', 'launched', 'built', 'coordinated', 'analyzed', 'optimized', 'streamlined', 'supervised', 'trained', 'negotiated', 'established', 'executed', 'generated', 'initiated', 'prepared'];
const ATS_ACTION_VERBS_AR = ['قدت', 'أدرت', 'طورت', 'أنشأت', 'نفذت', 'صممت', 'حسنت', 'خفضت', 'حققت', 'أطلقت', 'بنيت', 'نسقت', 'حللت', 'أشرفت', 'دربت', 'أسست', 'ساهمت', 'شاركت', 'أعددت', 'قمت'];

const AR_STOPWORDS = new Set(['في', 'من', 'على', 'إلى', 'عن', 'مع', 'أن', 'إن', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي', 'كما', 'لدى', 'أو', 'ثم', 'قد', 'كان', 'كانت', 'يكون', 'هو', 'هي', 'نحن', 'انت', 'أنا', 'ما', 'لا', 'لم', 'لن', 'يجب', 'خلال', 'بعد', 'قبل', 'عند', 'كل', 'بعض', 'غير', 'بين', 'حيث', 'أي', 'اذا', 'إذا', 'حتى', 'منذ', 'لديه', 'لديها', 'ذات', 'سنوات', 'خبرة', 'العمل', 'الوظيفة', 'المتقدم', 'مطلوب', 'يفضل']);
const EN_STOPWORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'we', 'you', 'they', 'it', 'he', 'she', 'their', 'our', 'your', 'its', 'not', 'no', 'all', 'any', 'some', 'more', 'most', 'other', 'such', 'than', 'then', 'so', 'if', 'about', 'into', 'through', 'during', 'per', 'etc', 'job', 'work', 'role', 'position', 'candidate', 'required', 'requirements', 'skills', 'experience', 'years', 'ability', 'strong', 'good', 'excellent', 'knowledge', 'plus', 'preferred', 'who', 'what', 'when', 'where', 'how', 'why', 'which']);

function atsExtractText(data) {
  const parts = [];
  const walk = (o) => {
    if (o == null) return;
    if (typeof o === 'string') { if (!o.startsWith('data:')) parts.push(o); return; }
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o === 'object') { Object.values(o).forEach(walk); }
  };
  walk(data);
  return parts.join(' ');
}

function atsKeywords(text) {
  const words = String(text).toLowerCase().replace(/[^\u0600-\u06FFa-z0-9+#. ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const freq = {};
  for (const w of words) {
    if (AR_STOPWORDS.has(w) || EN_STOPWORDS.has(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(e => e[0]);
}

function analyzeATS(data, language, jobDescription) {
  const p = data.personal || {};
  const sections = data.sections || [];
  const byType = (t) => sections.find(s => s.type === t && s.visible !== false);
  const fullText = atsExtractText(data);
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const checks = [];
  const suggestions = [];
  const isEn = language === 'en';

  // 1. contact (20)
  let contact = 0;
  if (p.fullName || p.fullNameEn) contact += 6; else suggestions.push('أضف الاسم الكامل — أهم عنصر في السيرة');
  if (p.email) { if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) contact += 5; else { contact += 2; suggestions.push('صيغة الإيميل غير صحيحة'); } } else suggestions.push('أضف بريد إلكتروني احترافي');
  if (p.phone) contact += 5; else suggestions.push('أضف رقم جوال (بصيغة دولية +966...)');
  if (p.city || p.cityEn) contact += 2; else suggestions.push('أضف المدينة — مهم لأنظمة التوظيف السعودية');
  if (p.linkedin) contact += 2; else suggestions.push('أضف رابط LinkedIn لزيادة المصداقية');
  checks.push({ ok: contact >= 16, label: 'معلومات التواصل كاملة', weight: 20, got: contact });

  // 2. summary (15)
  let summary = 0;
  const sum = byType('summary') || byType('objective');
  const sumText = sum ? ((isEn ? (sum.textEn || sum.textAr) : (sum.textAr || sum.textEn)) || '') : '';
  const sumWords = sumText.split(/\s+/).filter(Boolean).length;
  if (sumWords >= 30 && sumWords <= 90) summary = 15;
  else if (sumWords >= 15) { summary = 10; suggestions.push('الملخص المهني الأمثل 30-80 كلمة'); }
  else if (sumWords > 0) { summary = 5; suggestions.push('الملخص المهني قصير جداً — وسّعه ليشمل سنوات الخبرة والتخصص وأبرز إنجاز'); }
  else suggestions.push('أضف ملخص مهني قوي (30-80 كلمة) — أول ما تقرأه أنظمة ATS');
  checks.push({ ok: summary >= 10, label: 'ملخص مهني فعّال', weight: 15, got: summary });

  // 3. experience (25)
  let exp = 0;
  const expSec = byType('experience') || byType('internship');
  const expItems = expSec ? (expSec.items || []) : [];
  if (expItems.length > 0) {
    exp += 8;
    const withDates = expItems.filter(i => i.start).length;
    if (withDates === expItems.length) exp += 5; else suggestions.push('أضف تواريخ البداية والنهاية لكل خبرة');
    const withDesc = expItems.filter(i => ((i.descAr || '') + (i.descEn || '')).length > 30).length;
    if (withDesc === expItems.length) exp += 6; else suggestions.push('أضف وصف تفصيلي (نقاط) لكل خبرة عملية');
    const descAll = expItems.map(i => (i.descAr || '') + ' ' + (i.descEn || '')).join(' ').toLowerCase();
    const hasVerbs = ATS_ACTION_VERBS_AR.some(v => descAll.includes(v)) || ATS_ACTION_VERBS_EN.some(v => descAll.includes(v));
    if (hasVerbs) exp += 3; else suggestions.push('ابدأ نقاط الخبرة بأفعال قوية (طورت، أدرت، حققت / Led, Developed, Achieved)');
    const hasNumbers = /\d+\s*[%٪]|\d{2,}/.test(descAll);
    if (hasNumbers) exp += 3; else suggestions.push('أضف أرقام وإحصائيات للإنجازات (زيادة المبيعات 25%، إدارة فريق من 10)');
  } else {
    suggestions.push('أضف الخبرات العملية أو التدريب التعاوني — القسم الأهم لأنظمة ATS');
  }
  checks.push({ ok: exp >= 17, label: 'خبرات عملية موثقة بالتفاصيل والأرقام', weight: 25, got: exp });

  // 4. education (10)
  let edu = 0;
  const eduSec = byType('education');
  const eduItems = eduSec ? (eduSec.items || []) : [];
  if (eduItems.length > 0) {
    edu += 6;
    if (eduItems.every(i => i.year)) edu += 2; else suggestions.push('أضف سنة التخرج لكل مؤهل');
    if (eduItems.some(i => i.gpa)) edu += 2;
  } else suggestions.push('أضف المؤهلات التعليمية');
  checks.push({ ok: edu >= 6, label: 'التعليم موثق', weight: 10, got: edu });

  // 5. skills (15)
  let skills = 0;
  const skillItems = sections.filter(s => ['skills', 'techskills', 'softskills'].includes(s.type) && s.visible !== false).flatMap(s => s.items || []);
  if (skillItems.length >= 8) skills = 15;
  else if (skillItems.length >= 5) { skills = 11; suggestions.push('أضف مهارات أكثر — الأمثل 8-15 مهارة'); }
  else if (skillItems.length >= 1) { skills = 6; suggestions.push('عدد المهارات قليل جداً — أنظمة ATS تطابق الكلمات المفتاحية من المهارات'); }
  else suggestions.push('أضف قسم المهارات — ضروري جداً لأنظمة ATS');
  checks.push({ ok: skills >= 11, label: 'مهارات كافية (8+)', weight: 15, got: skills });

  // 6. languages (5)
  let langs = 0;
  const langSec = byType('languages');
  if (langSec && (langSec.items || []).length > 0) langs = 5;
  else suggestions.push('أضف اللغات (العربية والإنجليزية على الأقل) — مطلوبة في السوق السعودي');
  checks.push({ ok: langs === 5, label: 'اللغات مذكورة', weight: 5, got: langs });

  // 7. quality (10)
  let quality = 0;
  if (wordCount >= 200 && wordCount <= 900) quality += 4;
  else if (wordCount < 200) suggestions.push('السيرة قصيرة — المحتوى الأمثل 300-700 كلمة');
  else suggestions.push('السيرة طويلة — اختصر للأهم (صفحة إلى صفحتين)');
  if (p.jobTitle || p.jobTitleEn) quality += 3; else suggestions.push('أضف المسمى الوظيفي تحت الاسم مباشرة');
  const visSections = sections.filter(s => s.visible !== false).length;
  if (visSections >= 5) quality += 3; else suggestions.push('أضف أقسام أكثر (شهادات، دورات، إنجازات) لسيرة أكمل');
  checks.push({ ok: quality >= 7, label: 'جودة عامة وطول مناسب', weight: 10, got: quality });

  let score = checks.reduce((a, c) => a + c.got, 0);

  // JD match
  let jdMatch = null;
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdKw = atsKeywords(jobDescription).slice(0, 30);
    const cvLower = fullText.toLowerCase();
    const matched = jdKw.filter(k => cvLower.includes(k));
    const missing = jdKw.filter(k => !cvLower.includes(k)).slice(0, 15);
    const percent = jdKw.length ? Math.round((matched.length / jdKw.length) * 100) : 0;
    jdMatch = { percent, matched: matched.slice(0, 20), missing };
    if (percent < 60) suggestions.push(`نسبة التطابق مع الوصف الوظيفي ${percent}% — أضف الكلمات المفتاحية الناقصة في المهارات والخبرات`);
  }

  score = Math.max(0, Math.min(100, score));
  const grade = score >= 90 ? 'ممتاز' : score >= 75 ? 'جيد جداً' : score >= 60 ? 'جيد' : score >= 40 ? 'يحتاج تحسين' : 'ضعيف';

  return { score, checks, suggestions, wordCount, jdMatch, grade };
}

if (typeof window !== 'undefined') {
  window.analyzeATS = analyzeATS;
  window.atsKeywords = atsKeywords;
}
