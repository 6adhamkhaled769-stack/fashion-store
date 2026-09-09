import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { formatPrice } from '@/utils/formatPrice'

/**
 * CartLineItem — سطر منتج واحد في صفحة السلة (صورة، اسم، مقاس/لون،
 * سعر، عدّاد كمية، وحذف بتأكيد بسيط قبل الحذف الفعلي).
 */
export default function CartLineItem({ item, onUpdateQuantity, onRemove }) {
  const { currency } = useStoreConfig()
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  return (
    <div className="flex gap-4 border-b border-[var(--color-border)] py-5 first:pt-0 last:border-b-0">
      <Link to={`/products/${item.slug}`} className="shrink-0">
        <ImageWithFallback src={item.image} alt={item.name} className="size-24 rounded-[var(--radius-sm)] sm:size-28" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link to={`/products/${item.slug}`} className="font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)]">
            {item.name}
          </Link>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {[item.color?.name, item.size].filter(Boolean).join(' — ') || 'مقاس/لون واحد'}
          </p>
          <p className="mt-1.5 text-sm font-semibold">{formatPrice(item.price, currency)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-[3px] border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="تقليل الكمية"
              className="inline-flex size-8 items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-surface)] disabled:opacity-30"
            >
              <Minus className="size-3.5" strokeWidth={1.8} />
            </button>
            <span className="inline-flex w-8 items-center justify-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
              aria-label="زيادة الكمية"
              className="inline-flex size-8 items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-surface)]"
            >
              <Plus className="size-3.5" strokeWidth={1.8} />
            </button>
          </div>

          {confirmingRemove ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--color-text-muted)]">تأكيد الحذف؟</span>
              <button
                type="button"
                onClick={() => onRemove(item.key)}
                className="font-medium text-[var(--color-danger)] hover:underline"
              >
                نعم
              </button>
              <button
                type="button"
                onClick={() => setConfirmingRemove(false)}
                className="text-[var(--color-text-muted)] hover:underline"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              aria-label="حذف من السلة"
              className="inline-flex size-8 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-danger)]"
            >
              <Trash2 className="size-4" strokeWidth={1.6} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
