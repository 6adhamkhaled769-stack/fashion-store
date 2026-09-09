import { useEffect, useState } from 'react'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ProductCard from '@/components/home/ProductCard'
import { getRelatedProducts } from '@/services/productsService'

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-[var(--radius-sm)] bg-[var(--color-surface)]" />
      <div className="mt-3.5 space-y-2">
        <div className="h-3 w-1/3 rounded bg-[var(--color-surface)]" />
        <div className="h-3.5 w-2/3 rounded bg-[var(--color-surface)]" />
      </div>
    </div>
  )
}

/**
 * RelatedProducts — منتجات "قد يعجبك أيضًا" من نفس الصنف، أسفل صفحة
 * تفاصيل المنتج. يختفي القسم بالكامل لو مفيش منتجات ذات صلة (بدل
 * إظهار Empty state مزعج في نهاية صفحة منتج).
 */
export default function RelatedProducts({ categorySlug, excludeSlug }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getRelatedProducts(excludeSlug, categorySlug)
      .then((res) => {
        if (!cancelled) setItems(res)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [categorySlug, excludeSlug])

  if (!isLoading && items.length === 0) return null

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="أكملي الإطلالة" title="قد يعجبك أيضًا" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </section>
  )
}
