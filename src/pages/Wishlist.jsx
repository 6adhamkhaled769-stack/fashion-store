import { HeartOff } from 'lucide-react'
import Container from '@/components/ui/Container'
import ProductGrid from '@/components/products/ProductGrid'
import { useWishlist } from '@/context/WishlistContext'

/**
 * Wishlist — صفحة المفضلة (PHASE 6، الجزء 2/2).
 * إعادة استخدام كاملة لـ ProductGrid/ProductCard الموجودين — الضغط
 * على القلب (♡) الممتلئ هنا يزيل المنتج من المفضلة مباشرة.
 */
export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">المفضلة</h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
            {items.length} {items.length === 1 ? 'منتج' : 'منتج محفوظ'}
          </p>
        </div>

        <ProductGrid
          items={items}
          isLoading={false}
          emptyIcon={HeartOff}
          emptyTitle="مفضلتك فاضية"
          emptyMessage="اضغطي على أيقونة القلب على أي منتج عشان تضيفيه هنا وترجعيله بسهولة بعدين."
        />
      </Container>
    </div>
  )
}
