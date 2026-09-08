import Container from '@/components/ui/Container'
import SectionHeader from '@/components/home/SectionHeader'
import ProductCard from '@/components/home/ProductCard'
import { mockFeaturedProducts } from '@/lib/mockData'

/**
 * FeaturedProducts — قسم "منتجات مميزة" في الصفحة الرئيسية.
 *
 * TODO(PHASE 9): استبدال mockFeaturedProducts باستدعاء فعلي لجدول
 * `products` (where is_featured = true and is_active = true).
 */
export default function FeaturedProducts() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
      <Container>
        <SectionHeader eyebrow="منتقاة بعناية" title="منتجات مميزة" viewAllTo="/products" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          {mockFeaturedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}
