import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, PackageSearch } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { getOrdersForUser } from '@/services/ordersService'
import { ORDER_STATUSES } from '@/lib/mockOrders'
import { formatPrice } from '@/utils/formatPrice'

/**
 * Orders — صفحة "طلباتي" (PHASE 7، الجزء 2/2).
 * محمية بـ ProtectedRoute. تعرض طلبات المستخدم الحالي وحالة كل طلب.
 */
export default function Orders() {
  const { user } = useAuth()
  const { currency } = useStoreConfig()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getOrdersForUser(user.email)
      .then((res) => {
        if (!cancelled) setOrders(res)
      })
      .catch(() => {
        if (!cancelled) setError('حدث خطأ أثناء تحميل الطلبات')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user.email, retryKey])

  return (
    <div className="py-8 sm:py-12">
      <Container className="max-w-3xl">
        <h1 className="mb-8 font-[var(--font-heading)] text-2xl font-semibold sm:text-3xl">طلباتي</h1>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface)]" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <AlertCircle className="size-10 text-[var(--color-danger)]" strokeWidth={1.4} />
            <p className="font-medium text-[var(--color-text)]">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setRetryKey((k) => k + 1)}>
              إعادة المحاولة
            </Button>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <PackageSearch className="size-10 text-[var(--color-text-muted)]" strokeWidth={1.4} />
            <p className="font-medium text-[var(--color-text)]">لسه معملتيش أي طلب</p>
            <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
              كل طلباتك هتظهر هنا بمجرد إتمام أول عملية شراء.
            </p>
            <Button as={Link} to="/products" variant="primary" size="sm" className="mt-2">
              تصفّحي المنتجات
            </Button>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = ORDER_STATUSES[order.status]
              return (
                <div key={order.id} className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(order.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>

                  <ul className="mt-3 space-y-1 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-text-muted)]">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity, currency)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm font-semibold">
                    <span>الإجمالي</span>
                    <span>{formatPrice(order.total, currency)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}
