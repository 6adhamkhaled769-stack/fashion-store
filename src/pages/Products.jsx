import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import CategoryTabs from '@/components/products/CategoryTabs'
import SortDropdown from '@/components/products/SortDropdown'
import FiltersPanel from '@/components/products/FiltersPanel'
import ProductGrid from '@/components/products/ProductGrid'
import Button from '@/components/ui/Button'
import { getProducts, getCategories } from '@/services/productsService'

const PAGE_SIZE = 8

/**
 * Products — صفحة كل المنتجات (PHASE 4 مكتملة: شبكة + تصنيفات +
 * ترتيب + فلاتر سعر/مقاس + Load More + حالات Loading/Empty/Error).
 * كل الفلاتر مصدرها الرابط (URL) حتى تبقى قابلة للمشاركة.
 */
export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const tag = searchParams.get('tag') || ''
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null
  const sizes = searchParams.get('sizes') ? searchParams.get('sizes').split(',') : []

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [categories, setCategories] = useState([])

  const sizesParam = searchParams.get('sizes') || ''

  // الأصناف تُجلب مرة واحدة فقط (لا تعتمد على الفلاتر)
  useEffect(() => {
    let cancelled = false
    getCategories().then((cats) => {
      if (!cancelled) setCategories(cats)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // إعادة الصفحة لـ 1 عند تغيّر أي فلتر من الرابط
  useEffect(() => {
    setPage(1)
  }, [category, search, sort, tag, minPrice, maxPrice, sizesParam])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getProducts({ category, search, sort, tag, minPrice, maxPrice, sizes, page, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        setItems(res.items)
        setTotal(res.total)
      })
      .catch(() => {
        if (!cancelled) setError('حدث خطأ أثناء تحميل المنتجات')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, sort, tag, minPrice, maxPrice, sizesParam, page, retryKey])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      next.delete(key)
    } else {
      next.set(key, Array.isArray(value) ? value.join(',') : value)
    }
    setSearchParams(next)
  }

  function handleApplyFilters({ minPrice: nextMin, maxPrice: nextMax, sizes: nextSizes }) {
    const next = new URLSearchParams(searchParams)
    if (nextMin) next.set('minPrice', nextMin)
    else next.delete('minPrice')
    if (nextMax) next.set('maxPrice', nextMax)
    else next.delete('maxPrice')
    if (nextSizes?.length) next.set('sizes', nextSizes.join(','))
    else next.delete('sizes')
    setSearchParams(next)
  }

  const activeCategory = categories.find((c) => c.slug === category)
  const pageTitle = search
    ? `نتائج البحث عن "${search}"`
    : tag === 'sale'
      ? 'العروض'
      : activeCategory
        ? activeCategory.name
        : 'كل المنتجات'

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mb-6">
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">
            {pageTitle}
          </h1>
          {!isLoading && !error && (
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              {total} {total === 1 ? 'منتج' : 'منتج متاح'}
            </p>
          )}
        </div>

        <div className="mb-5">
          <CategoryTabs categories={categories} activeSlug={category} />
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-[var(--color-border)] py-3">
          <FiltersPanel
            initialMinPrice={minPrice}
            initialMaxPrice={maxPrice}
            initialSizes={sizes}
            onApply={handleApplyFilters}
          />
          <SortDropdown value={sort} onChange={(v) => updateParam('sort', v)} />
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <AlertCircle className="size-10 text-[var(--color-danger)]" strokeWidth={1.4} />
            <p className="font-medium text-[var(--color-text)]">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setRetryKey((k) => k + 1)}>
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <>
            <ProductGrid items={items} isLoading={isLoading} />

            {!isLoading && items.length < total && (
              <div className="mt-10 flex justify-center">
                <Button variant="outline" size="lg" onClick={() => setPage((p) => p + 1)}>
                  عرض المزيد
                </Button>
              </div>
            )}

            {isLoading && items.length > 0 && (
              <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
                جارٍ تحميل المزيد...
              </p>
            )}
          </>
        )}
      </Container>
    </div>
  )
}

