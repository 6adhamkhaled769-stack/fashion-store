# Fashion Store — منصة متجر ملابس إلكتروني قابلة لإعادة البيع

> ⚠️ هذا README مبدئي (PHASE 1 فقط). سيتم استكماله بالتفصيل الكامل
> (Supabase setup, DB setup, Admin setup, Deployment...) في PHASE 21.

## Tech Stack

- **React 19 + Vite** — الواجهة
- **Tailwind CSS v4** — التصميم (عبر `@tailwindcss/vite`، بدون ملف `tailwind.config` تقليدي)
- **React Router v6** — التوجيه
- **Supabase** — Database + Auth + Storage (سيتم ربطه في PHASE 8/9)
- **Zustand** — إدارة حالة السلة/المفضلة (PHASE 6)
- **Vercel** — النشر

## هيكلة المشروع

```
src/
  components/   # عناصر UI قابلة لإعادة الاستخدام (ui, layout, product, cart, admin)
  pages/        # صفحات المتجر ولوحة التحكم
  layouts/      # StorefrontLayout و AdminLayout
  hooks/        # React hooks مخصصة
  lib/          # إعداد Supabase وغيره
  services/     # طبقة الاتصال بـ Supabase (products, orders, ...)
  context/      # Context providers (Auth, Cart...)
  types/        # تعريفات الأنواع/الأشكال المشتركة
  utils/        # دوال مساعدة عامة
```

## التشغيل محليًا

```bash
npm install
cp .env.example .env   # ثم ضع بيانات Supabase الحقيقية
npm run dev
```

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
- [ ] PHASE 2 — Design System + Header/Footer
- [ ] PHASE 3 وما بعدها...
