import { mockCatalogProducts, productCategories } from '@/lib/mockCatalog'

const SIMULATED_DELAY_MS = 450

/**
 * productsService — طبقة وصول بيانات المنتجات.
 *
 * التنفيذ هنا مؤقت (يعمل على مصفوفة محلية + تأخير مصطنع لمحاكاة
 * شبكة حقيقية، حتى تُبنى حالات Loading بشكل صحيح من الآن). بدءًا من
 * PHASE 9 سيُستبدل الجسم الداخلي لكل دالة باستدعاء فعلي لجدول
 * `products` في Supabase — الواجهة (اسم الدالة، شكل المدخلات
 * والمخرجات) لن تتغيّر، فلن تحتاج صفحة Products.jsx أي تعديل.
 */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * getProducts — يرجع منتجات مفلترة/مرتّبة/مقسّمة صفحات.
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
  await delay(SIMULATED_DELAY_MS)

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

  let results = [...mockCatalogProducts]

  if (category) {
    results = results.filter((p) => p.categorySlug === category)
  }

  if (tag === 'sale') {
    results = results.filter((p) => p.oldPrice)
  }

  if (search?.trim()) {
    const q = search.trim().toLowerCase()
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }

  if (typeof minPrice === 'number') {
    results = results.filter((p) => p.price >= minPrice)
  }
  if (typeof maxPrice === 'number') {
    results = results.filter((p) => p.price <= maxPrice)
  }

  if (sizes?.length) {
    results = results.filter((p) => p.sizes.some((s) => sizes.includes(s)))
  }

  switch (sort) {
    case 'bestselling':
      results.sort((a, b) => b.salesCount - a.salesCount)
      break
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'newest':
    default:
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
  }

  const total = results.length
  const items = results.slice(0, page * pageSize)

  return { items, total }
}

/** getCategories — قائمة الأصناف المتاحة للفلترة. */
export async function getCategories() {
  await delay(150)
  return productCategories
}

/** getProductBySlug — يرجع منتج واحد بكامل تفاصيله، أو null لو مش موجود. */
export async function getProductBySlug(slug) {
  await delay(SIMULATED_DELAY_MS)
  return mockCatalogProducts.find((p) => p.slug === slug) ?? null
}

/**
 * getRelatedProducts — منتجات من نفس الصنف، باستثناء المنتج الحالي.
 * TODO(PHASE 9): يمكن تحسينها لاحقًا لتعتمد على مبيعات مشتركة فعلية
 * بدل مجرد "نفس الصنف".
 */
export async function getRelatedProducts(slug, categorySlug, limit = 4) {
  await delay(300)
  return mockCatalogProducts.filter((p) => p.categorySlug === categorySlug && p.slug !== slug).slice(0, limit)
}
