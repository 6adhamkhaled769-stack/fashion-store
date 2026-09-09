import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useWishlist } from '@/context/WishlistContext'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

/**
 * ProductCard — بطاقة منتج موحّدة تُستخدم في الصفحة الرئيسية، صفحة
 * المنتجات، نتائج البحث، والمنتجات ذات الصلة.
 *
 * زر المفضلة مفعّل فعليًا (PHASE 6) عبر WishlistContext.
 */
export default function ProductCard({ product }) {
  const { currency } = useStoreConfig()
  const { isInWishlist, toggleItem } = useWishlist()
  const { id, slug, name, category, price, oldPrice, image, isNew, inStock } = product
  const inWishlist = isInWishlist(id)

  const discountPercent =
    oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null

  function handleToggleWishlist(e) {
    e.preventDefault()
    toggleItem(product)
    toast.success(inWishlist ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة')
  }

  return (
    <Link to={`/products/${slug}`} className="group block">
      <div className="relative aspect-[4/5] w-full">
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {isNew && <Badge tone="dark">جديد</Badge>}
            {discountPercent && <Badge tone="accent">خصم {discountPercent}٪</Badge>}
          </div>
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
            aria-pressed={inWishlist}
            title={inWishlist ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
            className={cn(
              'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg)]/90 backdrop-blur transition-colors',
              inWishlist ? 'text-[var(--color-danger)]' : 'text-[var(--color-text)] hover:text-[var(--color-secondary)]'
            )}
          >
            <Heart className="size-4" strokeWidth={1.6} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/70">
            <span className="rounded-[3px] bg-[var(--color-text)] px-3 py-1.5 text-xs font-medium text-[var(--color-bg)]">
              نفدت الكمية
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5 space-y-1">
        {category && (
          <p className="text-xs text-[var(--color-text-muted)]">{category}</p>
        )}
        <h3 className="truncate text-sm font-medium text-[var(--color-text)]">{name}</h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-semibold',
              oldPrice ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text)]'
            )}
          >
            {formatPrice(price, currency)}
          </span>
          {oldPrice && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">
              {formatPrice(oldPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
