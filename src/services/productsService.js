import { supabase } from '@/lib/supabaseClient'

/**
 * productsService — طبقة وصول بيانات المنتجات والأصناف من Supabase.
 *
 * كل دالة هنا تُرجع نفس الشكل (shape) الذي كانت تُرجعه النسخة
 * التجريبية في PHASE 3-6، لذلك لم تحتج أي صفحة أو
 * مكوّن تعديلًا جوهريًا سوى استبدال مصدر البيانات (PHASE 9B).
 *
 * عند أي خطأ اتصال بـ Supabase، كل دالة تُرجع نتيجة فارغة آمنة
 * (بدل رمي استثناء يكسر الصفحة) وتُسجّل تحذيرًا واضحًا في الـ console.
 */

const CARD_SELECT = `
  id, slug, name, price, old_price, is_new, is_featured, is_best_seller, created_at,
  category:categories ( name, slug ),
  product_images ( url, sort_order ),
  product_variants ( stock )
`

const DETAIL_SELECT = `
  id, slug, name, description, price, old_price, is_new, created_at,
  category:categories ( name, slug ),
  product_images ( url, sort_order ),
  product_variants ( size, color_name, color_hex, stock )
`

const DEFAULT_CARE_TEXT =
  'غسيل بارد يدوي أو دورة لطيفة — يُفضّل التجفيف في الظل بعيدًا عن أشعة الشمس المباشرة.'

function sortedImages(images) {
  return [...(images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

function totalStock(variants) {
  return (variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0)
}

/** يحوّل صف Supabase (بطاقة منتج مختصرة) إلى شكل ProductCard. */
function mapRowToCardProduct(row) {
  const images = sortedImages(row.product_images)
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category?.name ?? '',
    categorySlug: row.category?.slug ?? '',
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    image: images[0]?.url ?? null,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isBestSeller: row.is_best_seller,
    inStock: totalStock(row.product_variants) > 0,
    createdAt: row.created_at,
  }
}

/** يحوّل صف Supabase الكامل إلى شكل صفحة تفاصيل المنتج. */
function mapRowToDetailProduct(row) {
  const images = sortedImages(row.product_images).map((i) => i.url)
  const variants = row.product_variants ?? []
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]

  const colorsMap = new Map()
  variants.forEach((v) => {
    if (v.color_name && !colorsMap.has(v.color_name)) {
      colorsMap.set(v.color_name, { name: v.color_name, hex: v.color_hex })
    }
  })

  const stockCount = totalStock(variants)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category?.name ?? '',
    categorySlug: row.category?.slug ?? '',
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    isNew: row.is_new,
    images: images.length ? images : [null],
    description: row.description ?? '',
    colors: [...colorsMap.values()],
    sizes,
    inStock: stockCount > 0,
    stockCount,
    care: DEFAULT_CARE_TEXT,
  }
}

/** يحل slug الصنف إلى id فعلي (استعلام صغير ومنفصل لتبسيط باقي الفلاتر). */
async function resolveCategoryId(slug) {
  if (!slug) return null
  const { data, error } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle()
  if (error) {
    console.warn('[productsService] تعذّر إيجاد الصنف:', error.message)
    return null
  }
  return data?.id ?? null
}

/** يرجع معرّفات المنتجات التي تملك مخزونًا فعليًا في أحد المقاسات المطلوبة. */
async function resolveProductIdsForSizes(sizes) {
  if (!sizes?.length) return null
  const { data, error } = await supabase
    .from('product_variants')
    .select('product_id')
    .in('size', sizes)
    .gt('stock', 0)

  if (error) {
    console.warn('[productsService] تعذّر تطبيق فلتر المقاس:', error.message)
    return []
  }
  return [...new Set((data ?? []).map((r) => r.product_id))]
}

/**
 * getProducts — يرجع منتجات مفلترة/مرتّبة/مقسّمة صفحات من Supabase.
 * @param {Object} filters
 * @param {string} [filters.category] - category slug
 * @param {string} [filters.search]
 * @param {'newest'|'bestselling'|'price-asc'|'price-desc'} [filters.sort]
 * @param {'sale'} [filters.tag]
 * @param {number} [filters.minPrice]
 * @param {number} [filters.maxPrice]
 * @param {string[]} [filters.sizes]
 * @param {number} [filters.page]
 * @param {number} [filters.pageSize]
 */
export async function getProducts(filters = {}) {
  const {
    category,
    search,
    sort = 'newest',
    tag,
    minPrice,
    maxPrice,
    sizes,
    page = 1,
    pageSize = 8,
  } = filters

  // فلتر المقاس يُحسَم أولًا لأنه قد يُرجِع "لا نتائج" مبكرًا
  let sizeFilteredIds = null
  if (sizes?.length) {
    const matchingIds = await resolveProductIdsForSizes(sizes)
    if (!matchingIds.length) return { items: [], total: 0 }
    sizeFilteredIds = matchingIds
  }

  let query = supabase.from('products').select(CARD_SELECT, { count: 'exact' }).eq('is_active', true)

  const categoryId = await resolveCategoryId(category)
  if (category && !categoryId) return { items: [], total: 0 } // صنف غير موجود
  if (categoryId) query = query.eq('category_id', categoryId)

  if (tag === 'sale') query = query.not('old_price', 'is', null)
  if (search?.trim()) query = query.ilike('name', `%${search.trim()}%`)
  if (typeof minPrice === 'number' && !Number.isNaN(minPrice)) query = query.gte('price', minPrice)
  if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice)) query = query.lte('price', maxPrice)
  if (sizeFilteredIds) query = query.in('id', sizeFilteredIds)

  switch (sort) {
    case 'bestselling':
      query = query.order('is_best_seller', { ascending: false }).order('created_at', { ascending: false })
      break
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  // نفس منطق "عرض المزيد" في النسخة السابقة: نجلب من البداية حتى
  // نهاية الصفحة الحالية (وليس صفحة واحدة منفصلة) حتى لا تُفقَد
  // العناصر المعروضة بالفعل عند الضغط على "عرض المزيد".
  query = query.range(0, page * pageSize - 1)

  const { data, count, error } = await query

  if (error) {
    console.warn('[productsService] تعذّر جلب المنتجات:', error.message)
    return { items: [], total: 0 }
  }

  return { items: (data ?? []).map(mapRowToCardProduct), total: count ?? 0 }
}

/** getCategories — الأصناف النشطة، مرتبة حسب ترتيب العرض. */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, image_url')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.warn('[productsService] تعذّر جلب الأصناف:', error.message)
    return []
  }

  return (data ?? []).map((c) => ({ id: c.id, slug: c.slug, name: c.name, image: c.image_url }))
}

/** getProductBySlug — منتج واحد بكامل تفاصيله، أو null لو مش موجود. */
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(DETAIL_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.warn('[productsService] تعذّر جلب المنتج:', error.message)
    throw error // تُعالَج في الصفحة كـ "حدث خطأ" بدل "غير موجود"
  }

  return data ? mapRowToDetailProduct(data) : null
}

/** getRelatedProducts — منتجات من نفس الصنف، باستثناء المنتج الحالي. */
export async function getRelatedProducts(slug, categorySlug, limit = 4) {
  const categoryId = await resolveCategoryId(categorySlug)
  if (!categoryId) return []

  const { data, error } = await supabase
    .from('products')
    .select(CARD_SELECT)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('slug', slug)
    .limit(limit)

  if (error) {
    console.warn('[productsService] تعذّر جلب منتجات ذات صلة:', error.message)
    return []
  }

  return (data ?? []).map(mapRowToCardProduct)
}

/**
 * getHeroProducts — منتجات الـ Hero التفاعلي في الصفحة الرئيسية
 * (صورة + أول لون متاح كـ swatch + مقاساته). يعتمد على is_featured،
 * وإن لم توجد منتجات مميزة يسقط تلقائيًا لأحدث المنتجات (getHeroProducts
 * لا تفشل بصمت — الفراغ الكامل يُعالَج من Hero.jsx نفسه).
 */
export async function getHeroProducts(limit = 4) {
  const HERO_SELECT = `
    id, slug, name, price, old_price,
    product_images ( url, sort_order ),
    product_variants ( size, color_name, color_hex )
  `

  async function fetchBy(column) {
    const { data, error } = await supabase
      .from('products')
      .select(HERO_SELECT)
      .eq('is_active', true)
      .eq(column, true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.warn('[productsService] تعذّر جلب منتجات الـ Hero:', error.message)
      return []
    }
    return data ?? []
  }

  let rows = await fetchBy('is_featured')
  if (rows.length === 0) rows = await fetchBy('is_new')

  return rows.map((row) => {
    const images = sortedImages(row.product_images)
    const variants = row.product_variants ?? []
    const firstColor = variants.find((v) => v.color_name)
    const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      colorLabel: firstColor?.color_name ?? '',
      swatchHex: firstColor?.color_hex ?? '#1c1b19',
      price: Number(row.price),
      oldPrice: row.old_price ? Number(row.old_price) : null,
      sizes,
      image: images[0]?.url ?? null,
    }
  })
}
export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('[productsService] تعذّر جلب المنتجات المميّزة:', error.message)
    return []
  }
  return (data ?? []).map(mapRowToCardProduct)
}

/** getNewArrivals — أحدث المنتجات (is_new = true) للصفحة الرئيسية. */
export async function getNewArrivals(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('[productsService] تعذّر جلب المنتجات الجديدة:', error.message)
    return []
  }
  return (data ?? []).map(mapRowToCardProduct)
}

/**
 * getBestSellers — المنتجات الأكثر مبيعًا للصفحة الرئيسية.
 * TODO(لاحقًا): تُحتسَب حاليًا من علامة is_best_seller اليدوية في
 * لوحة التحكم. يمكن تطويرها لاحقًا لتُحتسَب فعليًا من مجموع الكميات
 * المباعة في order_items بعد تراكم بيانات طلبات كافية.
 */
export async function getBestSellers(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .eq('is_best_seller', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('[productsService] تعذّر جلب الأكثر مبيعًا:', error.message)
    return []
  }
  return (data ?? []).map(mapRowToCardProduct)
}
