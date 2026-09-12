-- =====================================================================
-- Fashion Store — Database Schema (PHASE 8)
-- =====================================================================
-- طريقة التطبيق: انسخ هذا الملف بالكامل والصقه في
-- Supabase Dashboard > SQL Editor > New query، ثم اضغط Run.
-- الملف idempotent قدر الإمكان (يستخدم IF NOT EXISTS) بحيث يمكن
-- إعادة تشغيله بأمان تقريبًا، لكن الأفضل تشغيله مرة واحدة على
-- مشروع Supabase جديد وفارغ.
--
-- الترتيب داخل الملف:
--   1) Extensions
--   2) دوال مساعدة عامة (updated_at, is_admin, order_number)
--   3) الجداول (بالترتيب حسب الاعتمادية بين الجداول)
--   4) الفهارس (Indexes)
--   5) الـ Triggers
--   6) Row Level Security (تفعيل + سياسات لكل جدول)
-- =====================================================================


-- =====================================================================
-- 1) EXTENSIONS
-- =====================================================================
create extension if not exists pgcrypto;   -- من أجل gen_random_uuid()


-- =====================================================================
-- 2) دوال مساعدة عامة
-- =====================================================================

-- 2.1) دالة عامة لتحديث عمود updated_at تلقائيًا عند أي UPDATE
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2.2) دالة is_admin() تُعرَّف لاحقًا بعد إنشاء جدول profiles (قسم 3.1)
-- لأنها تعتمد عليه مباشرة — انظر القسم "2.2b" أسفل جدول profiles.

-- 2.3) توليد رقم طلب بشري مقروء (ORD-000123) بدل الاعتماد فقط على uuid
create sequence if not exists public.order_number_seq start 1001;

create or replace function public.generate_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'ORD-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;


-- =====================================================================
-- 3) الجداول
-- =====================================================================

-- -----------------------------------------------------------------
-- 3.1) profiles — بيانات إضافية لكل مستخدم مسجَّل (يمتد auth.users)
-- -----------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'بيانات إضافية لكل مستخدم — تمتد auth.users المُدارة من Supabase Auth.';

-- 2.2b) دالة is_admin() — تُستخدم داخل سياسات RLS للتحقق أن المستخدم
-- الحالي (auth.uid()) لديه role = 'admin' في جدول profiles. عُرِّفت
-- هنا (بعد جدول profiles مباشرة) لأنها تعتمد عليه. SECURITY DEFINER
-- + search_path ثابت لمنع أي التفاف أمني ولمنع التكرار اللانهائي
-- عند استخدامها داخل سياسة جدول profiles نفسه.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- -----------------------------------------------------------------
-- 3.2) categories — أقسام المتجر (نسائي/رجالي/أحذية...)
-- -----------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  image_url   text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------
-- 3.3) products — المنتج الأساسي (بدون مقاس/لون — ذلك في variants)
-- -----------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  category_id   uuid references public.categories(id) on delete set null,
  price         numeric(10, 2) not null check (price >= 0),
  old_price     numeric(10, 2) check (old_price is null or old_price >= 0),
  is_featured   boolean not null default false,
  is_new        boolean not null default false,
  is_best_seller boolean not null default false,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------
-- 3.4) product_images — صور متعددة لكل منتج، بترتيب عرض محدد
-- -----------------------------------------------------------------
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  alt_text    text,
  sort_order  integer not null default 0
);

-- -----------------------------------------------------------------
-- 3.5) product_variants — كل تركيبة (مقاس × لون) بمخزونها الخاص
-- -----------------------------------------------------------------
create table if not exists public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  size        text,
  color_name  text,
  color_hex   text,
  sku         text unique,
  stock       integer not null default 0 check (stock >= 0),
  created_at  timestamptz not null default now()
);

-- ⚠️ ملاحظة PostgreSQL مهمة: قيد UNIQUE عادي على (product_id, size,
-- color_name) لن يمنع التكرار عندما يكون color_name = NULL (منتجات
-- بلا لون، مثل الأحذية/الإكسسوارات هنا) — لأن PostgreSQL لا يعتبر
-- NULL مساويًا لـ NULL في قيود UNIQUE. لذلك نستخدم فهرس UNIQUE على
-- تعبير coalesce() بدل قيد الجدول العادي، وهو يحل المشكلة تمامًا
-- ويجعل ON CONFLICT يعمل بشكل صحيح حتى مع القيم الفارغة.
create unique index if not exists uq_product_variants_product_size_color
  on public.product_variants (product_id, size, (coalesce(color_name, '')));

comment on table public.product_variants is 'كل صف = تركيبة مقاس+لون واحدة لمنتج معيّن، بمخزون مستقل. مثال: S/أسود/10.';

-- -----------------------------------------------------------------
-- 3.6) cart / cart_items — سلة كل مستخدم مسجَّل (مزامنة عبر الأجهزة)
-- -----------------------------------------------------------------
create table if not exists public.cart (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid not null references public.cart(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  variant_id  uuid references public.product_variants(id) on delete set null,
  quantity    integer not null default 1 check (quantity > 0),
  created_at  timestamptz not null default now(),
  unique (cart_id, product_id, variant_id)
);

-- -----------------------------------------------------------------
-- 3.7) wishlist / wishlist_items
-- -----------------------------------------------------------------
create table if not exists public.wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id            uuid primary key default gen_random_uuid(),
  wishlist_id   uuid not null references public.wishlist(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

-- -----------------------------------------------------------------
-- 3.8) orders — رأس الطلب (COD حاليًا، architecture جاهزة لـ Online)
-- -----------------------------------------------------------------
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text unique,
  user_id           uuid references auth.users(id) on delete set null, -- null = طلب زائر (guest)
  customer_name     text not null,
  phone             text not null,
  email             text,
  address           text not null,
  city              text not null,
  notes             text,
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_method    text not null default 'cod' check (payment_method in ('cod', 'online')),
  payment_status    text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  subtotal          numeric(10, 2) not null default 0,
  discount_amount   numeric(10, 2) not null default 0,
  shipping_fee      numeric(10, 2) not null default 0,
  total             numeric(10, 2) not null default 0,
  coupon_code       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on column public.orders.payment_method is
  'cod الآن فقط. عمود payment_status جاهز مسبقًا لدمج بوابة دفع إلكتروني لاحقًا دون تعديل الجدول.';

-- -----------------------------------------------------------------
-- 3.9) order_items — سطور الطلب (نسخة/snapshot من بيانات المنتج
-- وقت الشراء، حتى لو تغيّر اسم/سعر المنتج لاحقًا)
-- -----------------------------------------------------------------
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  variant_id    uuid references public.product_variants(id) on delete set null,
  product_name  text not null,
  size          text,
  color_name    text,
  unit_price    numeric(10, 2) not null check (unit_price >= 0),
  quantity      integer not null check (quantity > 0),
  line_total    numeric(10, 2) not null check (line_total >= 0)
);

-- -----------------------------------------------------------------
-- 3.10) coupons / coupon_usage
-- -----------------------------------------------------------------
create table if not exists public.coupons (
  id                uuid primary key default gen_random_uuid(),
  code              text not null unique,
  type              text not null check (type in ('percentage', 'fixed')),
  value             numeric(10, 2) not null check (value > 0),
  min_order_amount  numeric(10, 2) not null default 0,
  usage_limit       integer,                 -- NULL = بلا حد أقصى
  times_used        integer not null default 0,
  expires_at        timestamptz,             -- NULL = بلا تاريخ انتهاء
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

create table if not exists public.coupon_usage (
  id          uuid primary key default gen_random_uuid(),
  coupon_id   uuid not null references public.coupons(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  used_at     timestamptz not null default now()
);

-- -----------------------------------------------------------------
-- 3.11) store_settings — صف واحد فقط (id ثابت = 1)، هوية المتجر
-- الكاملة القابلة للتخصيص من لوحة التحكم — أساس قابلية إعادة البيع
-- -----------------------------------------------------------------
create table if not exists public.store_settings (
  id                smallint primary key default 1 check (id = 1),
  store_name        text not null default 'متجري',
  legal_name        text,
  english_name      text,
  tagline           text,
  store_description text,
  announcement      text,
  logo_url          text,
  favicon_url       text,
  primary_color     text not null default '#1c1b19',
  secondary_color   text not null default '#7a2430',
  whatsapp          text,
  phone             text,
  email             text,
  address           text,
  instagram         text,
  facebook          text,
  tiktok            text,
  shipping_fee      numeric(10, 2) not null default 0,
  currency          text not null default 'EGP',
  updated_at        timestamptz not null default now()
);

-- آمن لإعادة التشغيل على قاعدة بيانات طُبِّق عليها schema.sql سابقًا
-- (PHASE 8) قبل إضافة هذه الأعمدة في PHASE 9 — لا يحذف أو يغيّر أي
-- بيانات موجودة.
alter table public.store_settings add column if not exists legal_name text;
alter table public.store_settings add column if not exists english_name text;
alter table public.store_settings add column if not exists tagline text;
alter table public.store_settings add column if not exists announcement text;

comment on table public.store_settings is
  'صف واحد فقط (id=1) — هذا هو مصدر الحقيقة الوحيد لهوية المتجر (اسم/لوجو/ألوان/تواصل)، تقرأه الواجهة عند الإقلاع بدل أي قيم ثابتة في الكود، مما يجعل نفس المشروع قابلًا لإعادة البيع لعملاء مختلفين.';

-- صف افتراضي واحد وحيد، حتى لا تُقرأ الواجهة صفًا فارغًا عند أول
-- تشغيل قبل أن يدخل الأدمن على Store Settings ويخصّصه (PHASE 15).
insert into public.store_settings (id) values (1)
  on conflict (id) do nothing;


-- =====================================================================
-- 4) الفهارس (Indexes) — لتسريع الاستعلامات الشائعة
-- =====================================================================
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_featured on public.products(is_featured) where is_featured = true;
create index if not exists idx_products_is_new on public.products(is_new) where is_new = true;

create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);

create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
create index if not exists idx_wishlist_items_wishlist_id on public.wishlist_items(wishlist_id);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

create index if not exists idx_coupon_usage_coupon_id on public.coupon_usage(coupon_id);


-- =====================================================================
-- 5) الـ Triggers
-- =====================================================================

-- 5.1) تحديث updated_at تلقائيًا
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists trg_store_settings_updated_at on public.store_settings;
create trigger trg_store_settings_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();

-- 5.2) توليد order_number تلقائيًا عند إنشاء طلب جديد
drop trigger if exists trg_orders_order_number on public.orders;
create trigger trg_orders_order_number before insert on public.orders
  for each row execute function public.generate_order_number();

-- 5.3) إنشاء صف profiles تلقائيًا عند تسجيل مستخدم جديد في Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5.4) منع أي مستخدم عادي من ترقية نفسه إلى admin عبر UPDATE مباشر
-- على profiles (الأدمن فقط يستطيع تغيير role، عبر service role من
-- لوحة تحكم Supabase أو RPC محمي لاحقًا).
create or replace function public.prevent_self_role_escalation()
returns trigger as $$
begin
  -- auth.uid() يكون NULL عند التنفيذ من SQL Editor أو service role أو
  -- migration مباشرة (سياق موثوق أصلاً) — نسمح بالتغيير هناك، وهذا
  -- بالضبط المسار الذي يُستخدم لترقية أول أدمن للمتجر يدويًا. أمّا
  -- عند وجود auth.uid() (مستخدم فعلي متصل عبر التطبيق عبر PostgREST)
  -- فلا يُسمح بتغيير role إلا لأدمن حالي بالفعل.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'غير مسموح بتغيير الصلاحية (role) بنفسك';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_role_escalation on public.profiles;
create trigger trg_prevent_role_escalation before update on public.profiles
  for each row execute function public.prevent_self_role_escalation();


-- =====================================================================
-- 6) Row Level Security
-- =====================================================================

alter table public.profiles        enable row level security;
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.product_variants enable row level security;
alter table public.cart            enable row level security;
alter table public.cart_items      enable row level security;
alter table public.wishlist        enable row level security;
alter table public.wishlist_items  enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.coupons         enable row level security;
alter table public.coupon_usage    enable row level security;
alter table public.store_settings  enable row level security;

-- -----------------------------------------------------------------
-- 6.1) profiles — كل مستخدم يرى/يعدّل صفّه فقط، الأدمن يرى الكل
-- -----------------------------------------------------------------
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- الإدراج يتم تلقائيًا عبر trigger (handle_new_user) وليس من الواجهة
-- مباشرة، لكن نسمح به احتياطيًا لو احتاج المستخدم إنشاء صفّه بنفسه.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- -----------------------------------------------------------------
-- 6.2) categories — قراءة عامة للأقسام النشطة، الأدمن يدير كل شيء
-- -----------------------------------------------------------------
drop policy if exists "categories_public_read_active" on public.categories;
create policy "categories_public_read_active" on public.categories
  for select using (is_active = true or public.is_admin());

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for insert with check (public.is_admin());
drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update" on public.categories
  for update using (public.is_admin());
drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete" on public.categories
  for delete using (public.is_admin());

-- -----------------------------------------------------------------
-- 6.3) products — نفس منطق categories
-- -----------------------------------------------------------------
drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active" on public.products
  for select using (is_active = true or public.is_admin());

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert" on public.products
  for insert with check (public.is_admin());
drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update" on public.products
  for update using (public.is_admin());
drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

-- -----------------------------------------------------------------
-- 6.4) product_images / product_variants — قراءة عامة (لا بيانات
-- حساسة)، وكتابة للأدمن فقط
-- -----------------------------------------------------------------
drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read" on public.product_images
  for select using (true);
drop policy if exists "product_images_admin_write" on public.product_images;
create policy "product_images_admin_write" on public.product_images
  for insert with check (public.is_admin());
drop policy if exists "product_images_admin_update" on public.product_images;
create policy "product_images_admin_update" on public.product_images
  for update using (public.is_admin());
drop policy if exists "product_images_admin_delete" on public.product_images;
create policy "product_images_admin_delete" on public.product_images
  for delete using (public.is_admin());

drop policy if exists "product_variants_public_read" on public.product_variants;
create policy "product_variants_public_read" on public.product_variants
  for select using (true);
drop policy if exists "product_variants_admin_write" on public.product_variants;
create policy "product_variants_admin_write" on public.product_variants
  for insert with check (public.is_admin());
drop policy if exists "product_variants_admin_update" on public.product_variants;
create policy "product_variants_admin_update" on public.product_variants
  for update using (public.is_admin());
drop policy if exists "product_variants_admin_delete" on public.product_variants;
create policy "product_variants_admin_delete" on public.product_variants
  for delete using (public.is_admin());

-- -----------------------------------------------------------------
-- 6.5) cart / cart_items — ملكية خاصة صِرفة (المستخدم فقط)
-- -----------------------------------------------------------------
drop policy if exists "cart_owner_all" on public.cart;
create policy "cart_owner_all" on public.cart
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "cart_items_owner_all" on public.cart_items;
create policy "cart_items_owner_all" on public.cart_items
  for all using (
    exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.cart c where c.id = cart_id and c.user_id = auth.uid())
  );

-- -----------------------------------------------------------------
-- 6.6) wishlist / wishlist_items — نفس منطق cart
-- -----------------------------------------------------------------
drop policy if exists "wishlist_owner_all" on public.wishlist;
create policy "wishlist_owner_all" on public.wishlist
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "wishlist_items_owner_all" on public.wishlist_items;
create policy "wishlist_items_owner_all" on public.wishlist_items
  for all using (
    exists (select 1 from public.wishlist w where w.id = wishlist_id and w.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.wishlist w where w.id = wishlist_id and w.user_id = auth.uid())
  );

-- -----------------------------------------------------------------
-- 6.7) orders — يشمل دعم Guest Checkout (user_id = null)
-- -----------------------------------------------------------------
-- القراءة: صاحب الطلب المسجَّل، أو الأدمن. طلبات الزوار (user_id
-- فارغ) لا يمكن قراءتها لاحقًا إلا من الأدمن — وهذا سلوك متوقّع
-- ومقصود (الزائر يعتمد على رسالة التأكيد الفورية بعد إرسال الطلب).
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin" on public.orders
  for select using (
    (user_id is not null and user_id = auth.uid()) or public.is_admin()
  );

-- الإدراج: مسموح للزوار (anon) وللمسجَّلين، بشرط أن user_id إمّا
-- فارغ (طلب زائر) أو يطابق المستخدم الحالي (لا يمكن انتحال هوية
-- مستخدم آخر عند إنشاء الطلب).
drop policy if exists "orders_insert_guest_or_own" on public.orders;
create policy "orders_insert_guest_or_own" on public.orders
  for insert with check (user_id is null or user_id = auth.uid());

-- تعديل: الأدمن فقط يغيّر حالة الطلب بحرّية. نسمح أيضًا لصاحب الطلب
-- بإلغاء طلبه بنفسه طالما لا يزال Pending فقط.
drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin" on public.orders
  for update using (public.is_admin());

drop policy if exists "orders_cancel_own_pending" on public.orders;
create policy "orders_cancel_own_pending" on public.orders
  for update
  using (user_id = auth.uid() and status = 'pending')
  with check (status = 'cancelled');

-- -----------------------------------------------------------------
-- 6.8) order_items
-- -----------------------------------------------------------------
-- ⚠️ ملاحظة أمان: سياسة الإدراج أدناه تسمح بإضافة سطور لأي طلب
-- "زائر" (user_id فارغ) طالما الطلب موجود، لتسهيل إتمام Checkout من
-- الواجهة مباشرة بدون Edge Function. هذا مقبول لمرحلة MVP لأن سطور
-- الطلب لا تحتوي بيانات حسّاسة عن طرف ثالث، لكن يُنصح لاحقًا (بعد
-- الإطلاق) بنقل عملية "إنشاء طلب + سطوره" إلى RPC/Edge Function
-- واحدة (SECURITY DEFINER) لإغلاق هذه الثغرة النظرية تمامًا.
drop policy if exists "order_items_select_via_order" on public.order_items;
create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_items_insert_via_order" on public.order_items;
create policy "order_items_insert_via_order" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is null or o.user_id = auth.uid())
    )
  );

drop policy if exists "order_items_admin_update" on public.order_items;
create policy "order_items_admin_update" on public.order_items
  for update using (public.is_admin());
drop policy if exists "order_items_admin_delete" on public.order_items;
create policy "order_items_admin_delete" on public.order_items
  for delete using (public.is_admin());

-- -----------------------------------------------------------------
-- 6.9) coupons — قراءة عامة للكوبونات الفعّالة فقط (اللازمة للتحقق
-- من الكود عند الـ checkout)، وكتابة للأدمن فقط
-- -----------------------------------------------------------------
drop policy if exists "coupons_public_read_active" on public.coupons;
create policy "coupons_public_read_active" on public.coupons
  for select using (
    (is_active = true and (expires_at is null or expires_at > now())) or public.is_admin()
  );

drop policy if exists "coupons_admin_insert" on public.coupons;
create policy "coupons_admin_insert" on public.coupons
  for insert with check (public.is_admin());
drop policy if exists "coupons_admin_update" on public.coupons;
create policy "coupons_admin_update" on public.coupons
  for update using (public.is_admin());
drop policy if exists "coupons_admin_delete" on public.coupons;
create policy "coupons_admin_delete" on public.coupons
  for delete using (public.is_admin());

-- -----------------------------------------------------------------
-- 6.10) coupon_usage — سجل داخلي؛ المستخدم يرى استخدامه فقط،
-- الأدمن يرى كل شيء
-- -----------------------------------------------------------------
drop policy if exists "coupon_usage_select_own_or_admin" on public.coupon_usage;
create policy "coupon_usage_select_own_or_admin" on public.coupon_usage
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "coupon_usage_insert" on public.coupon_usage;
create policy "coupon_usage_insert" on public.coupon_usage
  for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists "coupon_usage_admin_write" on public.coupon_usage;
create policy "coupon_usage_admin_write" on public.coupon_usage
  for update using (public.is_admin());

-- -----------------------------------------------------------------
-- 6.11) store_settings — قراءة عامة بالكامل (الواجهة تحتاجها قبل
-- تسجيل الدخول)، وكتابة للأدمن فقط
-- -----------------------------------------------------------------
drop policy if exists "store_settings_public_read" on public.store_settings;
create policy "store_settings_public_read" on public.store_settings
  for select using (true);

drop policy if exists "store_settings_admin_insert" on public.store_settings;
create policy "store_settings_admin_insert" on public.store_settings
  for insert with check (public.is_admin());
drop policy if exists "store_settings_admin_update" on public.store_settings;
create policy "store_settings_admin_update" on public.store_settings
  for update using (public.is_admin());

-- =====================================================================
-- نهاية الملف
-- =====================================================================
