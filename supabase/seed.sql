-- =====================================================================
-- Fashion Store — Seed Data (بيانات تجريبية واقعية)
-- =====================================================================
-- شغّل هذا الملف بعد schema.sql مباشرة (نفس الطريقة: SQL Editor في
-- Supabase). يملأ المتجر بهوية "أطلس" التجريبية + ٦ أقسام + ١٨ منتجًا
-- بمتغيرات (مقاس × لون) وصور حقيقية ومخزون واقعي، بالإضافة لكوبونين
-- وطلبين تجريبيين — حتى تُعاين لوحة التحكم والواجهة بمحتوى حقيقي
-- فور ربط Supabase (PHASE 9) بدل شاشات فارغة.
--
-- آمن لإعادة التشغيل: يستخدم ON CONFLICT DO NOTHING/UPDATE، ولا يكرر
-- البيانات لو نُفِّذ أكثر من مرة على نفس القاعدة.
-- =====================================================================

-- -----------------------------------------------------------------
-- هوية المتجر التجريبية (تطابق الواجهة الحالية قبل ربط Supabase)
-- -----------------------------------------------------------------
update public.store_settings set
  store_name = 'أطلس',
  legal_name = 'أطلس للأزياء',
  english_name = 'ATLAS',
  tagline = 'أزياء تُصمَّم لتدوم',
  store_description = 'متجر أزياء يقدّم قطعًا يومية بجودة عالية وتفاصيل مدروسة، بعيدًا عن صيحات الموسم العابرة.',
  announcement = 'شحن لجميع المحافظات — الدفع عند الاستلام متاح الآن',
  primary_color = '#16241d',
  secondary_color = '#b5652b',
  whatsapp = '+201000000000',
  phone = '+201000000000',
  email = 'hello@atlas-store.example',
  address = 'القاهرة، مصر',
  instagram = 'https://instagram.com',
  facebook = 'https://facebook.com',
  tiktok = 'https://tiktok.com',
  shipping_fee = 60,
  currency = 'ج.م'
where id = 1;

-- -----------------------------------------------------------------
-- الأقسام
-- -----------------------------------------------------------------
insert into public.categories (slug, name, image_url, sort_order)
values ('dresses', 'فساتين', 'https://images.unsplash.com/photo-1564263306152-5e1207dbd0ad?auto=format&fit=crop&w=1000&q=80', 0)
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

insert into public.categories (slug, name, image_url, sort_order)
values ('outerwear', 'جاكيتات ومعاطف', 'https://images.unsplash.com/photo-1707300787601-596f90f64121?auto=format&fit=crop&w=1000&q=80', 1)
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

insert into public.categories (slug, name, image_url, sort_order)
values ('knitwear', 'تريكو', 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 2)
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

insert into public.categories (slug, name, image_url, sort_order)
values ('trousers', 'بناطيل', 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 3)
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

insert into public.categories (slug, name, image_url, sort_order)
values ('shoes', 'أحذية', 'https://images.unsplash.com/photo-1542272604-78d13c1f741a?auto=format&fit=crop&w=1000&q=80', 4)
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

insert into public.categories (slug, name, image_url, sort_order)
values ('accessories', 'إكسسوارات', 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1000&q=80', 5)
on conflict (slug) do update set name = excluded.name, image_url = excluded.image_url;

-- -----------------------------------------------------------------
-- المنتجات + الصور + المتغيرات (مقاس × لون)
-- -----------------------------------------------------------------
insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'linen-wrap-dress', 'فستان لينن ملفوف', 'فستان لينن ملفوف من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 1450, 1850, false, true, true, true
from public.categories c where c.slug = 'dresses'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1564263306152-5e1207dbd0ad?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'linen-wrap-dress'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 13
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 13
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 12
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 13
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كوجناك', '#b5652b', 14
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كوجناك', '#b5652b', 10
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كوجناك', '#b5652b', 11
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كوجناك', '#b5652b', 13
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'رملي', '#c9b28a', 11
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'رملي', '#c9b28a', 13
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'رملي', '#c9b28a', 14
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'رملي', '#c9b28a', 12
from public.products p where p.slug = 'linen-wrap-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'satin-slip-dress', 'فستان ساتان انسيابي', 'فستان ساتان انسيابي من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 1350, null, true, true, false, true
from public.categories c where c.slug = 'dresses'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1564263306152-5e1207dbd0ad?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'satin-slip-dress'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 11
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 6
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 10
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 10
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كوجناك', '#b5652b', 9
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كوجناك', '#b5652b', 11
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كوجناك', '#b5652b', 11
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كوجناك', '#b5652b', 6
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'رملي', '#c9b28a', 8
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'رملي', '#c9b28a', 8
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'رملي', '#c9b28a', 6
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'رملي', '#c9b28a', 8
from public.products p where p.slug = 'satin-slip-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'floral-midi-dress', 'فستان ميدي مطبع', 'فستان ميدي مطبع من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 1240, null, false, false, true, true
from public.categories c where c.slug = 'dresses'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1564263306152-5e1207dbd0ad?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'floral-midi-dress'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كوجناك', '#b5652b', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كوجناك', '#b5652b', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كوجناك', '#b5652b', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كوجناك', '#b5652b', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'رملي', '#c9b28a', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'رملي', '#c9b28a', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'رملي', '#c9b28a', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'رملي', '#c9b28a', 0
from public.products p where p.slug = 'floral-midi-dress'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'oversized-wool-coat', 'معطف صوف واسع', 'معطف صوف واسع من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 2600, null, true, true, false, true
from public.categories c where c.slug = 'outerwear'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1707300787601-596f90f64121?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'oversized-wool-coat'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كحلي', '#1f2a3a', 5
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كحلي', '#1f2a3a', 8
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كحلي', '#1f2a3a', 5
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كحلي', '#1f2a3a', 4
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 3
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 8
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 7
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 8
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'بيج', '#d8c9a8', 6
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'بيج', '#d8c9a8', 8
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'بيج', '#d8c9a8', 5
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'بيج', '#d8c9a8', 8
from public.products p where p.slug = 'oversized-wool-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'classic-trench-coat', 'ترنش كلاسيك', 'ترنش كلاسيك من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 2100, 2450, false, false, true, true
from public.categories c where c.slug = 'outerwear'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1707300787601-596f90f64121?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'classic-trench-coat'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كحلي', '#1f2a3a', 10
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كحلي', '#1f2a3a', 6
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كحلي', '#1f2a3a', 6
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كحلي', '#1f2a3a', 5
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 5
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 6
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 10
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 8
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'بيج', '#d8c9a8', 7
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'بيج', '#d8c9a8', 10
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'بيج', '#d8c9a8', 8
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'بيج', '#d8c9a8', 8
from public.products p where p.slug = 'classic-trench-coat'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'cropped-denim-jacket', 'جاكيت دنيم قصير', 'جاكيت دنيم قصير من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 1180, null, true, false, false, true
from public.categories c where c.slug = 'outerwear'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1707300787601-596f90f64121?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'cropped-denim-jacket'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كحلي', '#1f2a3a', 13
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كحلي', '#1f2a3a', 12
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كحلي', '#1f2a3a', 15
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كحلي', '#1f2a3a', 15
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 16
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 15
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 13
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 13
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'بيج', '#d8c9a8', 15
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'بيج', '#d8c9a8', 13
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'بيج', '#d8c9a8', 12
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'بيج', '#d8c9a8', 11
from public.products p where p.slug = 'cropped-denim-jacket'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'ribbed-knit-top', 'بلوزة تريكو مضلعة', 'بلوزة تريكو مضلعة من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 690, 890, false, false, true, true
from public.categories c where c.slug = 'knitwear'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'ribbed-knit-top'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'رمادي', '#8a8a86', 19
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'رمادي', '#8a8a86', 22
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'رمادي', '#8a8a86', 20
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'رمادي', '#8a8a86', 22
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كريمي', '#e8e0cf', 21
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كريمي', '#e8e0cf', 18
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كريمي', '#e8e0cf', 19
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كريمي', '#e8e0cf', 17
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'زيتوني', '#3f4a37', 21
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'زيتوني', '#3f4a37', 21
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'زيتوني', '#3f4a37', 19
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'زيتوني', '#3f4a37', 22
from public.products p where p.slug = 'ribbed-knit-top'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'merino-turtleneck', 'بلوزة مرينو ياقة عالية', 'بلوزة مرينو ياقة عالية من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 890, null, true, false, false, true
from public.categories c where c.slug = 'knitwear'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'merino-turtleneck'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'رمادي', '#8a8a86', 12
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'رمادي', '#8a8a86', 12
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'رمادي', '#8a8a86', 10
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'رمادي', '#8a8a86', 11
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كريمي', '#e8e0cf', 8
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كريمي', '#e8e0cf', 11
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كريمي', '#e8e0cf', 12
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كريمي', '#e8e0cf', 12
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'زيتوني', '#3f4a37', 9
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'زيتوني', '#3f4a37', 10
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'زيتوني', '#3f4a37', 10
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'زيتوني', '#3f4a37', 13
from public.products p where p.slug = 'merino-turtleneck'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'basic-cotton-tee', 'تيشيرت قطن أساسي', 'تيشيرت قطن أساسي من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 320, null, false, false, true, true
from public.categories c where c.slug = 'knitwear'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'basic-cotton-tee'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'رمادي', '#8a8a86', 29
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'رمادي', '#8a8a86', 28
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'رمادي', '#8a8a86', 31
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'رمادي', '#8a8a86', 31
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كريمي', '#e8e0cf', 27
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كريمي', '#e8e0cf', 32
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كريمي', '#e8e0cf', 30
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كريمي', '#e8e0cf', 27
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'زيتوني', '#3f4a37', 28
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'زيتوني', '#3f4a37', 31
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'زيتوني', '#3f4a37', 27
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'زيتوني', '#3f4a37', 32
from public.products p where p.slug = 'basic-cotton-tee'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'tailored-wide-trousers', 'بنطلون واسع كلاسيك', 'بنطلون واسع كلاسيك من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 980, null, false, false, false, true
from public.categories c where c.slug = 'trousers'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'tailored-wide-trousers'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 11
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 12
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 11
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 12
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كحلي', '#1f2a3a', 8
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كحلي', '#1f2a3a', 10
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كحلي', '#1f2a3a', 12
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كحلي', '#1f2a3a', 11
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'بيج', '#d8c9a8', 9
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'بيج', '#d8c9a8', 12
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'بيج', '#d8c9a8', 11
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'بيج', '#d8c9a8', 9
from public.products p where p.slug = 'tailored-wide-trousers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'high-waist-jeans', 'جينز خصر عالي', 'جينز خصر عالي من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 890, 1050, false, true, true, true
from public.categories c where c.slug = 'trousers'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'high-waist-jeans'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 19
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 17
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 19
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 19
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كحلي', '#1f2a3a', 18
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كحلي', '#1f2a3a', 17
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كحلي', '#1f2a3a', 16
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كحلي', '#1f2a3a', 15
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'بيج', '#d8c9a8', 15
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'بيج', '#d8c9a8', 15
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'بيج', '#d8c9a8', 19
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'بيج', '#d8c9a8', 18
from public.products p where p.slug = 'high-waist-jeans'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'pleated-midi-skirt', 'تنورة ميدي مطوية', 'تنورة ميدي مطوية من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 760, null, true, false, false, true
from public.categories c where c.slug = 'trousers'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'pleated-midi-skirt'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'أسود', '#1c1c1c', 9
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'أسود', '#1c1c1c', 5
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'أسود', '#1c1c1c', 4
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'أسود', '#1c1c1c', 5
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'كحلي', '#1f2a3a', 5
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'كحلي', '#1f2a3a', 8
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'كحلي', '#1f2a3a', 9
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'كحلي', '#1f2a3a', 6
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'XS', 'بيج', '#d8c9a8', 6
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'S', 'بيج', '#d8c9a8', 9
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'M', 'بيج', '#d8c9a8', 9
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'L', 'بيج', '#d8c9a8', 8
from public.products p where p.slug = 'pleated-midi-skirt'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'leather-ankle-boots', 'بوت جلد قصير', 'بوت جلد قصير من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 1650, null, true, true, false, true
from public.categories c where c.slug = 'shoes'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1542272604-78d13c1f741a?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'leather-ankle-boots'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '36', null, null, 4
from public.products p where p.slug = 'leather-ankle-boots'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '37', null, null, 5
from public.products p where p.slug = 'leather-ankle-boots'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '38', null, null, 7
from public.products p where p.slug = 'leather-ankle-boots'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '39', null, null, 6
from public.products p where p.slug = 'leather-ankle-boots'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '40', null, null, 7
from public.products p where p.slug = 'leather-ankle-boots'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '41', null, null, 2
from public.products p where p.slug = 'leather-ankle-boots'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'canvas-sneakers', 'سنيكرز قماش', 'سنيكرز قماش من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 720, null, false, false, true, true
from public.categories c where c.slug = 'shoes'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1542272604-78d13c1f741a?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'canvas-sneakers'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '36', null, null, 19
from public.products p where p.slug = 'canvas-sneakers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '37', null, null, 19
from public.products p where p.slug = 'canvas-sneakers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '38', null, null, 24
from public.products p where p.slug = 'canvas-sneakers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '39', null, null, 20
from public.products p where p.slug = 'canvas-sneakers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '40', null, null, 24
from public.products p where p.slug = 'canvas-sneakers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;
insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, '41', null, null, 23
from public.products p where p.slug = 'canvas-sneakers'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'silk-blend-scarf', 'وشاح حرير مخلوط', 'وشاح حرير مخلوط من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 420, null, true, false, false, true
from public.categories c where c.slug = 'accessories'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'silk-blend-scarf'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'مقاس واحد', null, null, 0
from public.products p where p.slug = 'silk-blend-scarf'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'structured-tote-bag', 'شنطة توتي مهيكلة', 'شنطة توتي مهيكلة من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 1120, 1400, false, true, true, true
from public.categories c where c.slug = 'accessories'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'structured-tote-bag'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'مقاس واحد', null, null, 9
from public.products p where p.slug = 'structured-tote-bag'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'leather-crossbody-bag', 'شنطة كروس جلد', 'شنطة كروس جلد من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 980, 1200, false, false, true, true
from public.categories c where c.slug = 'accessories'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'leather-crossbody-bag'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'مقاس واحد', null, null, 14
from public.products p where p.slug = 'leather-crossbody-bag'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

insert into public.products (slug, name, description, category_id, price, old_price, is_new, is_featured, is_best_seller, is_active)
select 'gold-drop-earrings', 'حلق ذهبي معلّق', 'حلق ذهبي معلّق من تصميمنا الحصري — خامة مختارة بعناية وقصّة مريحة تناسب الاستخدام اليومي. قطعة أساسية تدوم مع الغسيل المتكرر دون أن تفقد شكلها.', c.id, 340, null, true, false, false, true
from public.categories c where c.slug = 'accessories'
on conflict (slug) do update set
  price = excluded.price, old_price = excluded.old_price,
  is_new = excluded.is_new, is_featured = excluded.is_featured, is_best_seller = excluded.is_best_seller;

insert into public.product_images (product_id, url, sort_order)
select p.id, img.url, img.sort_order
from public.products p
cross join (values
  ('https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1000&q=80', 0)
) as img(url, sort_order)
where p.slug = 'gold-drop-earrings'
and not exists (select 1 from public.product_images pi where pi.product_id = p.id);

insert into public.product_variants (product_id, size, color_name, color_hex, stock)
select p.id, 'مقاس واحد', null, null, 25
from public.products p where p.slug = 'gold-drop-earrings'
on conflict (product_id, size, (coalesce(color_name, ''))) do update set stock = excluded.stock;

-- -----------------------------------------------------------------
-- كوبونات تجريبية
-- -----------------------------------------------------------------
insert into public.coupons (code, type, value, min_order_amount, usage_limit, expires_at, is_active)
values
  ('WELCOME10', 'percentage', 10, 0, null, now() + interval '90 days', true),
  ('FREESHIP', 'fixed', 60, 500, 200, now() + interval '30 days', true)
on conflict (code) do nothing;

-- -----------------------------------------------------------------
-- طلبات تجريبية (لعرض واقعي في Admin > Orders قبل وصول طلبات حقيقية)
-- -----------------------------------------------------------------
do $$
declare
  v_order_id uuid;
  v_product_id uuid;
begin
  -- حارس idempotency: لا تُدرَج الطلبات التجريبية إلا مرة واحدة
  if exists (select 1 from public.orders where email = 'sara@example.com') then
    return;
  end if;

  select id into v_product_id from public.products where slug = 'linen-wrap-dress';

  insert into public.orders (customer_name, phone, email, address, city, status, payment_method, subtotal, shipping_fee, total)
  values ('سارة أحمد', '+201112223334', 'sara@example.com', '12 شارع النصر', 'القاهرة', 'pending', 'cod', 1450, 60, 1510)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, product_name, size, color_name, unit_price, quantity, line_total)
  values (v_order_id, v_product_id, 'فستان لينن ملفوف', 'M', 'أسود', 1450, 1, 1450);

  select id into v_product_id from public.products where slug = 'canvas-sneakers';

  insert into public.orders (customer_name, phone, email, address, city, status, payment_method, subtotal, shipping_fee, total)
  values ('مريم علي', '+201223334445', 'mariam@example.com', '5 شارع الجمهورية', 'الإسكندرية', 'delivered', 'cod', 720, 60, 780)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, product_name, size, color_name, unit_price, quantity, line_total)
  values (v_order_id, v_product_id, 'سنيكرز قماش', '38', null, 720, 1, 720);
end $$;
