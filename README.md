# Ehab ATS — منصة السير الذاتية الاحترافية الخاصة

## Project Overview
- **Name**: Ehab ATS
- **Goal**: منصة خاصة (Owner-only) لإنشاء سير ذاتية احترافية متوافقة مع أنظمة ATS، مخصصة لسوق العمل السعودي والخليجي، بالعربي والإنجليزي.
- **Access**: دخول بمفتاح واحد خاص بالمالك (`wuda5U9u_Yk`) — HMAC-SHA256 token صالح 7 أيام.

## URLs
- **Sandbox (dev)**: https://3000-ixrdzaizc5o3vgj962rtv-ad490db5.sandbox.novita.ai
- **Public CV link**: `/cv/:slug` (بدون تسجيل دخول، مع زر طباعة PDF)
- **Production**: لم يتم النشر على Cloudflare Pages بعد

## Completed Features
- ✅ تسجيل دخول بمفتاح خاص + جلسات HMAC
- ✅ 15 قالب: 5 أبيض وأسود ATS (ats1/ats2/ats3, corporate, executive) + 10 ملوّنة (creative, modern, minimal, elegant, blue, green, navy, academic, healthcare, engineering)
- ✅ عربي / إنجليزي / ثنائي اللغة مع RTL/LTR تلقائي وتبديل فوري
- ✅ 17 نوع قسم (ملخص، خبرات، تعليم، مهارات، لغات، شهادات، مشاريع، تطوع، مراجع، مخصص...) مع إضافة/حذف/نسخ/ترتيب/إخفاء/طي
- ✅ محرر مباشر (Builder): معاينة حية A4، حفظ تلقائي، تخصيص (ألوان/خطوط/أحجام/هوامش)، رفع صورة/لوجو/توقيع، QR للرابط العام
- ✅ فاحص ATS: نقاط 0-100 موزونة + فحوصات + اقتراحات + تطابق الوصف الوظيفي (كلمات موجودة/ناقصة)
- ✅ مولّد AI: DeepSeek أساسي + Gemini بديل (تبديل من الإعدادات)، توليد سيرة كاملة من المسمى الوظيفي/معلومات/CV قديم
- ✅ خطابات تقديم بالـ AI (عربي/إنجليزي)
- ✅ استيراد: لصق نص، PDF (pdf.js)، DOCX (mammoth)، TXT، OCR للصور (Tesseract ara+eng)
- ✅ تصدير: PDF (طباعة A4)، DOCX، JSON، TXT، نسخ رابط عام
- ✅ سجل إصدارات (آخر 30 نسخة) مع استعادة
- ✅ قاعدة عملاء (اسم/تليفون/إيميل/مدينة/جامعة/تخصص/وظيفة مستهدفة/وسوم/ملاحظات) مع بحث
- ✅ لوحة تحكم بإحصائيات + سجل نشاط + سجل AI + مركز تصدير + إعدادات
- ✅ واجهة Glassmorphism داكن/فاتح، موبايل-أولاً

## Data Architecture
- **Storage**: Cloudflare D1 (SQLite) — local mode في التطوير
- **Tables**: clients, resumes (public_slug, ats_score, is_favorite, status), resume_versions, settings, activity_log, ai_history, cover_letters
- **Resume data model**: JSON — `personal` (14 حقل) + `sections[]` (type/visible/items بحقول Ar/En ثنائية)

## API (كلها خلف Bearer token عدا login و public)
- `POST /api/auth/login` — `{key}` → `{token}`
- CRUD: `/api/clients`, `/api/resumes`, `/api/cover-letters`
- `/api/resumes/:id/duplicate|versions|restore/:vid`
- `POST /api/ai/generate` — بروكسي DeepSeek/Gemini (المفاتيح في D1 settings مقنّعة)
- `/api/settings`, `/api/activity`, `/api/ai-history`, `/api/stats`
- `GET /api/public/cv/:slug` + `GET /cv/:slug` (صفحة عامة)

## User Guide
1. افتح الرابط وادخل بمفتاح الدخول
2. من الإعدادات: أضف مفتاح DeepSeek أو Gemini API لتفعيل الـ AI
3. أنشئ عميل → سيرة جديدة (اختر قالب ولغة) → املأ في المحرر مع معاينة حية
4. افحص بـ ATS مع الوصف الوظيفي → طبّق الاقتراحات
5. صدّر PDF من الرابط العام (زر الطباعة) أو DOCX/JSON/TXT من مركز التصدير

## Deployment
- **Platform**: Cloudflare Pages (جاهز للنشر — يحتاج إنشاء D1 production وتحديث database_id)
- **Status**: ✅ Active (Sandbox dev via PM2 + wrangler pages dev --local)
- **Tech Stack**: Hono + TypeScript + Cloudflare D1 + Tailwind CDN + Vanilla JS SPA
- **Last Updated**: 2026-08-09

## Development
```bash
npm install
npm run build
npx wrangler d1 migrations apply webapp-production --local
pm2 start ecosystem.config.cjs
curl http://localhost:3000
```
