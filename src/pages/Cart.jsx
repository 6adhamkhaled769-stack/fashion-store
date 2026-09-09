import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import CartLineItem from '@/components/cart/CartLineItem'
import { useCart } from '@/context/CartContext'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { formatPrice } from '@/utils/formatPrice'

/**
 * Cart — صفحة سلة التسوق الكاملة (PHASE 6، الجزء 2/2).
 * قائمة المنتجات + عدّاد كمية + حذف بتأكيد + ملخص الطلب (المجموع
 * الفرعي، التوفير، الشحن، الإجمالي) + إتمام الطلب.
 */
export default function Cart() {
  const { items, itemCount, subtotal, totalSavings, updateQuantity, removeItem } = useCart()
  const { currency, shippingFee } = useStoreConfig()

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <ShoppingBag className="size-10 text-[var(--color-text-muted)]" strokeWidth={1.4} />
        <p className="font-medium text-[var(--color-text)]">سلتك فاضية</p>
        <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
          لسه ماضفتيش أي منتج للسلة. تصفّحي مجموعتنا واختاري اللي يعجبك.
        </p>
        <Button as={Link} to="/products" variant="primary" size="md" className="mt-2">
          تصفّحي المنتجات
        </Button>
      </Container>
    )
  }

  const total = subtotal + shippingFee

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <h1 className="mb-8 font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">
          سلة التسوق <span className="text-base font-normal text-[var(--color-text-muted)]">({itemCount})</span>
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
          {/* المنتجات */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            ))}

            <Link
              to="/products"
              className="mt-6 inline-block text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]"
            >
              ← متابعة التسوق
            </Link>
          </div>

          {/* ملخص الطلب */}
          <div className="h-fit rounded-[var(--radius-md)] border border-[var(--color-border)] p-6">
            <h2 className="mb-4 font-medium">ملخص الطلب</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">المجموع الفرعي</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-[var(--color-success)]">
                  <span>توفير</span>
                  <span>- {formatPrice(totalSavings, currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">الشحن</span>
                <span>{formatPrice(shippingFee, currency)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-base font-semibold">
              <span>الإجمالي</span>
              <span>{formatPrice(total, currency)}</span>
            </div>

            <Button as={Link} to="/checkout" variant="primary" size="lg" className="mt-6 w-full">
              إتمام الطلب
            </Button>

            <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
              الدفع عند الاستلام متاح — طرق دفع إضافية قريبًا
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
