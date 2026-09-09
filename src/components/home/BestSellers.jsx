import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ProductCard from '@/components/home/ProductCard'
import { mockBestSellers } from '@/lib/mockData'

/**
 * BestSellers — قسم "الأكثر مبيعًا" في الصفحة الرئيسية.
 *
 * TODO(PHASE 9): استبدال mockBestSellers باستدعاء فعلي مبني على
 * عدد المبيعات الفعلي (يُحتسب من order_items)، وليس ترتيبًا يدويًا.
 */
export default function BestSellers() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="المفضّلة لدى عملائنا" title="الأكثر مبيعًا" viewAllTo="/products?sort=bestselling" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          {mockBestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}
