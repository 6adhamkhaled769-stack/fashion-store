import Hero from '@/components/home/Hero'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import NewArrivals from '@/components/home/NewArrivals'
import OfferBanner from '@/components/home/OfferBanner'
import BestSellers from '@/components/home/BestSellers'
import Newsletter from '@/components/home/Newsletter'

/**
 * Home — الصفحة الرئيسية الكاملة (PHASE 3، الجزءان 1+2).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <NewArrivals />
      <OfferBanner />
      <BestSellers />
      <Newsletter />
    </>
  )
}
