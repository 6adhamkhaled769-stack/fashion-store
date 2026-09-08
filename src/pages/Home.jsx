import Hero from '@/components/home/Hero'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import FeaturedProducts from '@/components/home/FeaturedProducts'

/**
 * Home — الصفحة الرئيسية.
 *
 * تم تقسيم بناء هذه الصفحة إلى مرحلتين فرعيتين:
 * PHASE 3 (1/2) — الحالية: Hero + الأصناف + منتجات مميزة.
 * PHASE 3 (2/2) — القادمة: وصل حديثًا + الأكثر مبيعًا + بانر عروض
 * + نشرة بريدية بارزة.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
    </>
  )
}
