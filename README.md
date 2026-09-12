# Fashion Store — منصة متجر ملابس إلكتروني قابلة لإعادة البيع

## Tech Stack

- **React 19 + Vite** — الواجهة
- **Tailwind CSS v4** — التصميم (عبر `@tailwindcss/vite`، بدون ملف `tailwind.config` تقليدي)
- **React Router v6** — التوجيه
- **Supabase** — Database + Auth + Storage
- **Zustand/Context** — إدارة حالة السلة/المفضلة/المصادقة
- **Vercel** — النشر

## هيكلة المشروع

```
src/
  components/   # عناصر UI قابلة لإعادة الاستخدام (ui, layout, product, cart, admin, home, products, routing)
  pages/        # صفحات المتجر ولوحة التحكم
  layouts/      # StorefrontLayout و AdminLayout
  hooks/        # React hooks مخصصة
  lib/          # إعداد Supabase، بيانات افتراضية/تجريبية
  services/     # طبقة الاتصال بالبيانات (products, orders, auth)
  context/      # Context providers (StoreConfig, Auth, Cart, Wishlist)
  types/        # تعريفات الأنواع/الأشكال المشتركة
  utils/        # دوال مساعدة عامة
supabase/
  schema.sql    # كل الجداول + العلاقات + RLS في ملف واحد منظم
  seed.sql      # بيانات تجريبية واقعية (اختياري)
  README.md     # دليل تطبيق قاعدة البيانات خطوة بخطوة
```

## التشغيل محليًا

```bash
npm install
cp .env.example .env   # ثم ضع بيانات Supabase الحقيقية
npm run dev
```

## إعداد Supabase

انظر `supabase/README.md` للدليل الكامل خطوة بخطوة (إنشاء مشروع،
تطبيق `schema.sql`، تطبيق `seed.sql` الاختياري، ترقية أول حساب أدمن،
التحقق من RLS).

## Build للإنتاج

```bash
npm run build
npm run preview
```

## متغيرات البيئة

انظر `.env.example`. المطلوب حاليًا:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

لن يتم أبدًا استخدام أو كشف `SUPABASE_SERVICE_ROLE_KEY` داخل الواجهة.

## حالة المشروع

- [x] PHASE 1 — Project setup + Routing
- [x] PHASE 2 — Design System + Layout + Header + Footer
- [x] PHASE 3 — Home Page
- [x] PHASE 4 — Products + Categories + Search + Filters
- [x] PHASE 5 — Product Details + Variants
- [x] PHASE 6 — Cart + Wishlist
- [x] PHASE 7 — Authentication
- [x] PHASE 8 — Supabase Database + RLS (مُختبَر فعليًا على PostgreSQL حقيقي)
- [x] PHASE 9A — الاتصال الأساسي + هوية المتجر (Store Settings) من Supabase
- [x] PHASE 9B — الأصناف والمنتجات (Home + Products + Product Details) من Supabase
- [x] PHASE 9C — المصادقة (Authentication) عبر Supabase Auth الحقيقي
- [ ] PHASE 9D — السلة والمفضلة (Cart + Wishlist) من Supabase
- [ ] PHASE 10 وما بعدها...

