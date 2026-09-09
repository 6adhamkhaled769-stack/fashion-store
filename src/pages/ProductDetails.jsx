import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, Heart, PackageX, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ImageGallery from '@/components/product/ImageGallery'
import ColorSwatches from '@/components/product/ColorSwatches'
import SizeSelector from '@/components/product/SizeSelector'
import QuantitySelector from '@/components/product/QuantitySelector'
import RelatedProducts from '@/components/product/RelatedProducts'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { getProductBySlug } from '@/services/productsService'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

/**
 * ProductDetails — صفحة تفاصيل المنتج (PHASE 5 + تفعيل PHASE 6).
 *
 * معرض صور، سعر وخصم، حالة المخزون، وصف، اختيار لون/مقاس/كمية،
 * منتجات ذات صلة، حالات Loading/Error/NotFound، وأزرار "أضف للسلة"
 * و"المفضلة" مفعّلة فعليًا عبر Cart/Wishlist context.
 */
export default function ProductDetails() {
  const { slug } = useParams()
  const { currency } = useStoreConfig()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setProduct(null)

    getProductBySlug(slug)
      .then((p) => {
        if (cancelled) return
        setProduct(p)
        setSelectedColor(p?.colors?.[0] ?? null)
        setSelectedSize(p?.sizes?.[0] ?? null)
        setQuantity(1)
      })
      .catch(() => {
        if (!cancelled) setError('حدث خطأ أثناء تحميل بيانات المنتج')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug, retryKey])

  function handleAddToCart() {
    if (product.sizes?.length && !selectedSize) {
      toast.error('من فضلك اختاري المقاس أولًا')
      return
    }
    addItem(product, { size: selectedSize, color: selectedColor, quantity })
    toast.success('تمت الإضافة للسلة')
  }

  function handleToggleWishlist() {
    toggleItem(product)
    toast.success(isInWishlist(product.id) ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة')
  }

  if (isLoading) {
    return (
      <Container className="py-10 sm:py-14">
        <div className="grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] rounded-[var(--radius-md)] bg-[var(--color-surface)]" />
          <div className="space-y-4">
            <div className="h-4 w-1/4 rounded bg-[var(--color-surface)]" />
            <div className="h-8 w-2/3 rounded bg-[var(--color-surface)]" />
            <div className="h-6 w-1/3 rounded bg-[var(--color-surface)]" />
            <div className="h-24 w-full rounded bg-[var(--color-surface)]" />
          </div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <AlertCircle className="size-10 text-[var(--color-danger)]" strokeWidth={1.4} />
        <p className="font-medium text-[var(--color-text)]">{error}</p>
        <Button variant="outline" size="sm" onClick={() => setRetryKey((k) => k + 1)}>
          إعادة المحاولة
        </Button>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <PackageX className="size-10 text-[var(--color-text-muted)]" strokeWidth={1.4} />
        <p className="font-medium text-[var(--color-text)]">المنتج غير موجود</p>
        <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
          ربما تم حذف هذا المنتج أو أن الرابط غير صحيح.
        </p>
        <Button as={Link} to="/products" variant="outline" size="sm">
          تصفّحي كل المنتجات
        </Button>
      </Container>
    )
  }

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="مسار التصفح" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Link to="/" className="hover:text-[var(--color-text)]">الرئيسية</Link>
          <span>/</span>
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-[var(--color-text)]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ImageGallery images={product.images} alt={product.name} />

          <div className="lg:max-w-md">
            <p className="text-xs text-[var(--color-text-muted)]">{product.category}</p>
            <h1 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2.5">
              <span className="text-xl font-semibold">{formatPrice(product.price, currency)}</span>
              {product.oldPrice && (
                <span className="text-sm text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.oldPrice, currency)}
                </span>
              )}
              {discountPercent && <Badge tone="accent">خصم {discountPercent}٪</Badge>}
            </div>

            <p
              className={
                product.inStock
                  ? 'mt-2 text-sm font-medium text-[var(--color-success)]'
                  : 'mt-2 text-sm font-medium text-[var(--color-danger)]'
              }
            >
              {product.inStock ? `متوفر (${product.stockCount} قطعة متبقية)` : 'نفدت الكمية'}
            </p>

            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {product.description}
            </p>

            <div className="mt-6 space-y-5">
              <ColorSwatches colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
              <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
              {product.inStock && (
                <QuantitySelector value={quantity} onChange={setQuantity} max={product.stockCount} />
              )}
            </div>

            <div className="mt-7 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingBag className="size-4" strokeWidth={1.8} />
                {product.inStock ? 'أضف للسلة' : 'نفدت الكمية'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className={cn('px-4', isInWishlist(product.id) && 'text-[var(--color-danger)]')}
                aria-label={isInWishlist(product.id) ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
                aria-pressed={isInWishlist(product.id)}
              >
                <Heart className="size-4" strokeWidth={1.8} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </Button>
            </div>

            <p className="mt-5 border-t border-[var(--color-border)] pt-5 text-xs leading-relaxed text-[var(--color-text-muted)]">
              {product.care}
            </p>
          </div>
        </div>
      </Container>

      <RelatedProducts categorySlug={product.categorySlug} excludeSlug={product.slug} />
    </div>
  )
}
