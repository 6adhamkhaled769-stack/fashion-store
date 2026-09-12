import { useEffect, useState } from 'react'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ProductCard from '@/components/home/ProductCard'
import { getBestSellers } from '@/services/productsService'

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
 * BestSellers — قسم "الأكثر مبيعًا" في الصفحة الرئيسية.
 * يجلب فعليًا من Supabase (products where is_best_seller = true) —
 * PHASE 9B. هذه العلامة يدوية حاليًا من لوحة التحكم؛ يمكن تطويرها
 * لاحقًا لتُحتسَب فعليًا من مجموع الكميات المباعة في order_items.
 */
export default function BestSellers() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getBestSellers(6).then((res) => {
      if (!cancelled) {
        setItems(res)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!isLoading && items.length === 0) return null

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="المفضّلة لدى عملائنا" title="الأكثر مبيعًا" viewAllTo="/products?sort=bestselling" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </section>
  )
}
