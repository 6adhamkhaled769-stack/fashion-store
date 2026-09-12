# إعداد قاعدة البيانات على Supabase

هذا الدليل يشرح كيفية تطبيق `schema.sql` و`seed.sql` على مشروع
Supabase حقيقي. تم اختبار كلا الملفَين فعليًا (وليس نظريًا فقط) على
PostgreSQL 16 قبل تسليمهما — بما في ذلك تشغيل RLS مع مستخدمين
تجريبيين للتأكد من العزل الفعلي بين البيانات.

## 1) إنشاء مشروع Supabase

1. أنشئ حسابًا/مشروعًا على [supabase.com](https://supabase.com).
2. من **Project Settings > API** انسخ:
   - `Project URL` → ضعه في `.env` كـ `VITE_SUPABASE_URL`
   - `anon public key` → ضعه في `.env` كـ `VITE_SUPABASE_ANON_KEY`

⚠️ لا تنسخ أبدًا `service_role key` إلى أي متغيّر بادئته `VITE_` —
انظر التحذير في `.env.example`.

## 2) تطبيق الـ Schema

1. من قائمة Supabase اليسرى: **SQL Editor > New query**.
2. افتح `supabase/schema.sql` من هذا المشروع، انسخ **كل المحتوى**،
   الصقه في المحرر، ثم اضغط **Run**.
3. يجب أن تنتهي العملية بنجاح دون أي `ERROR` (رسائل `NOTICE` طبيعية
   ولا تعني وجود مشكلة).
4. تحقّق من **Table Editor** — يجب أن ترى 14 جدولًا: `profiles`,
   `categories`, `products`, `product_images`, `product_variants`,
   `cart`, `cart_items`, `wishlist`, `wishlist_items`, `orders`,
   `order_items`, `coupons`, `coupon_usage`, `store_settings`.

## 3) تطبيق بيانات Seed (اختياري لكن موصى به)

كرّر نفس الخطوة بمحتوى `supabase/seed.sql`. سيملأ المتجر بـ 6 أقسام
و18 منتجًا وكوبونين وطلبين تجريبيين، حتى تُعاين المتجر ولوحة التحكم
بمحتوى حقيقي فور ربط Supabase بالواجهة (PHASE 9) بدل شاشات فارغة.

يمكنك حذف هذه البيانات لاحقًا من Table Editor بمجرد إضافة منتجاتك
الحقيقية.

## 4) ترقية أول حساب Admin

النظام لا يسمح لأي مستخدم بترقية نفسه إلى `admin` من داخل التطبيق
(محمي بـ trigger مخصص). لترقية أول حساب أدمن:

1. سجّل حسابًا عاديًا من صفحة `/register` في المتجر.
2. من Supabase: **Table Editor > profiles**، ابحث عن صفّك بالبريد
   الإلكتروني، وغيّر عمود `role` من `customer` إلى `admin` يدويًا.
3. سجّل خروج ودخول مرة أخرى في المتجر — ستحصل على صلاحيات الأدمن.

(نفس الخطوة يمكن تنفيذها عبر SQL Editor: `update public.profiles set role = 'admin' where id = '...';`)

## 6) إعدادات Authentication المطلوبة (PHASE 9C)

من **Authentication > URL Configuration** في Supabase:

1. اضبط **Site URL** على رابط موقعك (مثلًا `http://localhost:5173` محليًا، ورابط Vercel بعد النشر).
2. أضف نفس الرابط + `/reset-password` إلى **Redirect URLs**، وإلا سيرفض
   Supabase رابط استعادة كلمة المرور بصمت.

من **Authentication > Providers > Email**:

- **Confirm email** مفعّلة افتراضيًا (يجب على المستخدم تفعيل بريده قبل
  أول تسجيل دخول). الواجهة تتعامل مع الحالتين تلقائيًا. يمكنك تعطيلها
  مؤقتًا أثناء التطوير لتسجيل دخول فوري بدون تفعيل بريد.

## 7) التحقق من RLS (اختياري)

من **Authentication > Policies** في Supabase يمكنك مراجعة كل سياسة
تم إنشاؤها. لاختبار العزل الفعلي:

- افتح المتجر بمتصفحَين مختلفين (أو نافذة عادية + خاصة)، سجّل بحسابين
  مختلفين، وتأكد أن سلة/مفضلة كل حساب منفصلة تمامًا عن الآخر.
- تأكد أن `/admin` غير قابل للوصول إلا بحساب `role = admin`.

## بنية الجداول باختصار

| الجدول | الغرض |
|---|---|
| `profiles` | بيانات إضافية لكل مستخدم (الاسم، الهاتف، الصلاحية) |
| `categories` | أقسام المتجر |
| `products` | المنتج الأساسي (اسم، سعر، وصف...) |
| `product_images` | صور متعددة لكل منتج |
| `product_variants` | كل تركيبة مقاس×لون بمخزونها المستقل |
| `cart` / `cart_items` | سلة كل مستخدم مسجَّل (مزامنة عبر الأجهزة) |
| `wishlist` / `wishlist_items` | المفضلة |
| `orders` / `order_items` | الطلبات وسطورها (يدعم طلبات الزوار) |
| `coupons` / `coupon_usage` | كوبونات الخصم وسجل استخدامها |
| `store_settings` | هوية المتجر الكاملة (صف واحد فقط) — أساس قابلية إعادة البيع |
