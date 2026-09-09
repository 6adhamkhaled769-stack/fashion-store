import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ProductCard from '@/components/home/ProductCard'
import { mockNewArrivals } from '@/lib/mockData'

/**
 * NewArrivals — قسم "وصل حديثًا" في الصفحة الرئيسية.
 *
 * TODO(PHASE 9): استبدال mockNewArrivals باستدعاء فعلي لجدول
 * `products` (where is_active = true, order by created_at desc, limit N).
 */
export default function NewArrivals() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="أحدث ما وصل" title="وصل حديثًا" viewAllTo="/products?sort=newest" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          {mockNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}
